import "server-only";
import { z } from "zod";
import { configurationInputSchema, validateAndPriceConfiguration } from "@/lib/configurator";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const clientItemSchema = configurationInputSchema.extend({
  id: z.string().min(1).max(160).optional(), name: z.string().max(120).optional(), productName: z.string().max(120).optional(),
  fingerprint: z.string().min(1).max(256).optional(), quantity: z.coerce.number().int().min(1).max(10).default(1),
  configuration: z.record(z.string(), z.unknown()).optional(),
}).passthrough();
export const syncPayloadSchema = z.object({ designs: z.array(clientItemSchema).max(100).default([]), cart: z.array(clientItemSchema).max(100).default([]) });
export type SyncPayload = z.infer<typeof syncPayloadSchema>;
export type CustomerItemInput = z.infer<typeof clientItemSchema>;

function canonicalSnapshot(quote: Awaited<ReturnType<typeof validateAndPriceConfiguration>>) {
  return { productSlug: quote.product.slug, productName: quote.name, selections: quote.input.selections, selectionLabels: quote.labels,
    engraving: quote.input.engraving ?? null, gift: quote.input.gift ?? null, preview: quote.input.preview, formVersion: quote.form.version,
    pricing: { currency: quote.currency, basePriceMinor: quote.basePriceMinor, adjustments: quote.adjustments, totalMinor: quote.totalMinor } };
}

export async function saveCustomerDesign(ownerId: string, input: CustomerItemInput) {
  const admin = createAdminSupabaseClient(); const quote = await validateAndPriceConfiguration(input); const snapshot = canonicalSnapshot(quote);
  const values = { owner_id: ownerId, product_id: quote.product.id, name: input.name || quote.name,
    currency: quote.currency, indicative_total_minor: quote.totalMinor, preview: quote.input.preview, public_snapshot: snapshot };
  let result;
  if (input.id && /^[0-9a-f-]{36}$/i.test(input.id)) {
    const owned = await admin.from("saved_designs").select("id").eq("id", input.id).eq("owner_id", ownerId).maybeSingle();
    result = owned.data ? await admin.from("saved_designs").update(values).eq("id", input.id).eq("owner_id", ownerId).select("id,share_token").single() : await admin.from("saved_designs").upsert({ ...values, client_sync_id: input.id }, { onConflict: "owner_id,client_sync_id" }).select("id,share_token").single();
  } else if (input.id) result = await admin.from("saved_designs").upsert({ ...values, client_sync_id: input.id }, { onConflict: "owner_id,client_sync_id" }).select("id,share_token").single();
  else result = await admin.from("saved_designs").insert(values).select("id,share_token").single();
  const { data: design, error } = result; if (error) throw error;
  const selections = Object.entries(quote.input.selections).map(([component, value]) => ({ saved_design_id: design.id, component_slug: component, option_value: value, value_json: null }));
  await admin.from("saved_design_selections").delete().eq("saved_design_id", design.id);
  if (selections.length) { const result = await admin.from("saved_design_selections").insert(selections); if (result.error) throw result.error; }
  return { id: design.id, shareToken: design.share_token, quote };
}

async function activeCart(ownerId: string) {
  const admin = createAdminSupabaseClient(); const found = await admin.from("carts").select("id").eq("owner_id", ownerId).eq("status", "active").maybeSingle();
  if (found.error) throw found.error; if (found.data) return found.data;
  const created = await admin.from("carts").insert({ owner_id: ownerId, guest_token: null }).select("id").single(); if (!created.error) return created.data;
  const retry = await admin.from("carts").select("id").eq("owner_id", ownerId).eq("status", "active").single(); if (retry.error) throw created.error; return retry.data;
}

export async function upsertCartLines(ownerId: string, lines: CustomerItemInput[]) {
  const admin = createAdminSupabaseClient(); const cart = await activeCart(ownerId); let inserted = 0;
  for (const input of lines) { const quote = await validateAndPriceConfiguration(input); const snapshot = canonicalSnapshot(quote);
    const result = await admin.from("cart_items").upsert({ cart_id: cart.id, product_id: quote.product.id, sku_id: quote.sku.id,
      configuration_fingerprint: quote.fingerprint, quantity: input.quantity, unit_price_minor: quote.totalMinor, configuration_snapshot: snapshot }, { onConflict: "cart_id,configuration_fingerprint" });
    if (result.error) throw result.error; inserted += 1; }
  return inserted;
}

export async function syncCustomerState(ownerId: string, payload: SyncPayload) {
  let designs = 0; for (const input of payload.designs) { await saveCustomerDesign(ownerId, input); designs += 1; }
  return { designs, cartItems: await upsertCartLines(ownerId, payload.cart) };
}
