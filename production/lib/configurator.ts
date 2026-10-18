import "server-only";
import { createHash } from "node:crypto";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const looseRecord = z.record(z.string(), z.unknown());
export const configurationInputSchema = z.object({
  productSlug: z.string().min(1).max(120),
  selections: z.record(z.string(), z.string().max(240)).default({}),
  selectionLabels: z.record(z.string(), z.string().max(240)).default({}),
  engraving: z.object({
    text: z.string().trim().max(30),
    font: z.enum(["script", "serif", "block"]).default("script"),
  }).nullable().optional(),
  gift: z.object({
    message: z.string().trim().max(150).default(""),
    wrapping: z.string().max(80).default("standard"),
    hidePrice: z.boolean().default(false),
  }).nullable().optional(),
  preview: z.object({
    src: z.string().max(500).optional(),
    alt: z.string().max(240).optional(),
    match: z.enum(["exact", "representative", "fallback"]).optional(),
  }).default({}),
  clientFingerprint: z.string().max(256).optional(),
  metadata: looseRecord.optional(),
});

export type ConfigurationInput = z.infer<typeof configurationInputSchema>;

type RuleClause = { field?: string; operator?: string; value?: unknown };
type Rule = { all?: RuleClause[]; any?: RuleClause[] } | Record<string, never>;
type ComponentRow = {
  slug: string;
  name: string;
  is_required: boolean;
  condition_rule: Rule;
  configurator_options: {
    value: string;
    label: string;
    price_delta_minor: number;
    is_active: boolean;
  }[];
};

function clauseMatches(clause: RuleClause, selections: Record<string, string>) {
  const actual = clause.field ? selections[clause.field] : undefined;
  if (clause.operator === "equals") return actual === clause.value;
  if (clause.operator === "not_equals") return actual !== clause.value;
  if (clause.operator === "in") return Array.isArray(clause.value) && clause.value.includes(actual);
  if (clause.operator === "not_in") return Array.isArray(clause.value) && !clause.value.includes(actual);
  if (clause.operator === "exists") return typeof actual === "string" && actual.length > 0;
  return false;
}

export function ruleMatches(rule: Rule | null | undefined, selections: Record<string, string>) {
  if (!rule || !Object.keys(rule).length) return true;
  const all = Array.isArray(rule.all) ? rule.all : [];
  const any = Array.isArray(rule.any) ? rule.any : [];
  return (!all.length || all.every((clause) => clauseMatches(clause, selections)))
    && (!any.length || any.some((clause) => clauseMatches(clause, selections)));
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stable(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function configurationFingerprint(input: Pick<ConfigurationInput, "productSlug" | "selections" | "engraving" | "gift">) {
  return createHash("sha256").update(stable({
    productSlug: input.productSlug,
    selections: input.selections,
    engraving: input.engraving ?? null,
    gift: input.gift ?? null,
  })).digest("hex");
}

export function configuredPieceName(labels: Record<string, string>, fallback = "Custom Design") {
  const category = labels.category?.trim();
  const stone = labels.stone?.trim();
  const hasStone = stone && !/^(none|no stone|without stone)$/i.test(stone);
  if (category && hasStone) return `Custom ${stone} ${category}`;
  if (category) return `Custom ${category}`;
  return fallback;
}

export async function validateAndPriceConfiguration(raw: unknown) {
  const input = configurationInputSchema.parse(raw);
  const admin = createAdminSupabaseClient();
  const [{ data: product, error: productError }, { data: form, error: formError }] = await Promise.all([
    admin.from("products")
      .select("id,slug,name,base_price_minor,currency,status,customizable,skus(id,code,is_active,price_minor,metadata,inventory(quantity_on_hand,quantity_reserved))")
      .eq("slug", input.productSlug)
      .eq("status", "published")
      .single(),
    admin.from("configurator_forms")
      .select("id,slug,version,status,configurator_components(slug,name,is_required,condition_rule,configurator_options(value,label,price_delta_minor,is_active)),valid_option_combinations(name,selection_rule,is_active),pricing_rules(name,condition_rule,adjustment_minor,priority,is_active)")
      .eq("slug", "woyke-guided")
      .eq("status", "published")
      .single(),
  ]);
  if (productError || !product) throw new Error("PRODUCT_UNAVAILABLE");
  if (formError || !form) throw new Error("CONFIGURATOR_UNAVAILABLE");

  const components = (form.configurator_components ?? []) as unknown as ComponentRow[];
  const componentBySlug = new Map(components.map((component) => [component.slug, component]));
  const active = components.filter((component) => ruleMatches(component.condition_rule, input.selections));
  const errors: string[] = [];

  for (const key of Object.keys(input.selections)) {
    if (key === "want-side-stones") {
      if (!["yes", "no"].includes(input.selections[key])) errors.push("Side-stone choice is invalid.");
      continue;
    }
    const component = componentBySlug.get(key);
    if (!component || !ruleMatches(component.condition_rule, input.selections)) {
      errors.push(`Selection ${key} is not available for this design.`);
      continue;
    }
    if (!component.configurator_options.some((option) => option.is_active && option.value === input.selections[key])) {
      errors.push(`Selection ${key} has an invalid option.`);
    }
  }
  for (const component of active) {
    if (Object.keys(input.selections).length && component.is_required && component.configurator_options.length && !input.selections[component.slug]) {
      errors.push(`${component.name} is required.`);
    }
  }

  const combinations = (form.valid_option_combinations ?? []) as unknown as { selection_rule: Rule; is_active: boolean }[];
  if (input.selections.interchangeability && !combinations.some((combination) => combination.is_active && ruleMatches(combination.selection_rule, input.selections))) {
    errors.push("That interchangeability choice is not valid for the selected category.");
  }
  if (errors.length) throw new Error(`INVALID_CONFIGURATION:${errors.join("|")}`);

  let total = product.base_price_minor;
  const adjustments: { component: string; option: string; label: string; amountMinor: number }[] = [];
  for (const component of active) {
    const selected = input.selections[component.slug];
    const option = component.configurator_options.find((candidate) => candidate.is_active && candidate.value === selected);
    if (option?.price_delta_minor) {
      total += option.price_delta_minor;
      adjustments.push({ component: component.slug, option: option.value, label: option.label, amountMinor: option.price_delta_minor });
    }
  }
  const pricingRules = (form.pricing_rules ?? []) as unknown as { name: string; condition_rule: Rule; adjustment_minor: number; priority: number; is_active: boolean }[];
  const pricingContext = { ...input.selections, _engraving: input.engraving?.text ? "yes" : "no" };
  for (const rule of pricingRules.filter((candidate) => candidate.is_active).sort((a, b) => a.priority - b.priority)) {
    if (ruleMatches(rule.condition_rule, pricingContext)) {
      total += rule.adjustment_minor;
      adjustments.push({ component: "pricing-rule", option: rule.name, label: rule.name, amountMinor: rule.adjustment_minor });
    }
  }

  const skus = (product.skus ?? []) as unknown as {
    id: string; code: string; is_active: boolean; price_minor: number | null;
    metadata: Record<string, unknown>;
    inventory: { quantity_on_hand: number; quantity_reserved: number } | { quantity_on_hand: number; quantity_reserved: number }[];
  }[];
  const sku = skus.find((candidate) => candidate.is_active);
  if (!sku) throw new Error("SKU_UNAVAILABLE");
  const inventory = Array.isArray(sku.inventory) ? sku.inventory[0] : sku.inventory;
  const available = inventory ? inventory.quantity_on_hand - inventory.quantity_reserved : 0;
  if (available < 1) throw new Error("OUT_OF_STOCK");

  const labels = { ...input.selectionLabels };
  for (const [slug, value] of Object.entries(input.selections)) {
    if (!labels[slug]) labels[slug] = componentBySlug.get(slug)?.configurator_options.find((option) => option.value === value)?.label ?? value;
  }
  const name = Object.keys(input.selections).length > 1 ? configuredPieceName(labels, product.name) : product.name;
  const fingerprint = configurationFingerprint(input);

  return {
    input,
    product: { id: product.id, slug: product.slug, name: product.name },
    sku: { id: sku.id, code: sku.code, available },
    form: { id: form.id, version: form.version },
    name,
    labels,
    fingerprint,
    currency: product.currency,
    basePriceMinor: product.base_price_minor,
    totalMinor: Math.max(0, total),
    adjustments,
    inventoryFixture: sku.metadata?.inventory_source === "development_fixture",
  };
}
