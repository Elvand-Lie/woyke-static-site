import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const productionRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const repositoryRoot = path.resolve(productionRoot, "..");
const output = path.join(
  productionRoot,
  "supabase",
  "migrations",
  "202607280002_static_seed.sql",
);

const catalogue = await import(
  pathToFileURL(path.join(repositoryRoot, "assets/js/data/catalogue.js")).href
);
const { configSteps } = await import(
  pathToFileURL(path.join(repositoryRoot, "assets/js/configurator-options.js")).href
);

const deterministicUuid = (key) => {
  const hash = crypto.createHash("sha256").update(`woyke:${key}`).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
};

const quote = (value) => {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  return `'${String(value).replaceAll("'", "''")}'`;
};
const json = (value) => `${quote(JSON.stringify(value))}::jsonb`;

const conditionRule = (condition) => {
  if (!condition) return {};
  const source = condition.toString().replace(/\s+/g, " ");
  const all = [];
  for (const match of source.matchAll(
    /selections\['([^']+)'\]\s*(===|!==)\s*'([^']+)'/g,
  )) {
    all.push({
      field: match[1],
      operator: match[2] === "===" ? "equals" : "not_equals",
      value: match[3],
    });
  }
  const includes = source.match(
    /\[([^\]]+)\]\.includes\(selections\['([^']+)'\]\s*\|\|\s*''\)/,
  );
  if (includes) {
    all.push({
      field: includes[2],
      operator: "in",
      value: [...includes[1].matchAll(/'([^']+)'/g)].map((match) => match[1]),
    });
  }
  assert.ok(all.length, `Unsupported condition: ${source}`);
  return { all };
};

const insertRows = (table, columns, rows) => {
  if (!rows.length) return "";
  const values = rows
    .map((row) => `  (${columns.map((column) => row[column]).join(", ")})`)
    .join(",\n");
  return `insert into public.${table} (${columns.join(", ")}) values\n${values}\non conflict do nothing;\n`;
};

const categoryRows = catalogue.allCategories.map((slug, index) => ({
  id: quote(deterministicUuid(`category:${slug}`)),
  slug: quote(slug),
  name: quote(catalogue.categoryLabels[slug]?.en ?? slug),
  sort_order: String(index),
  is_active: "true",
}));

const productRows = catalogue.products.map((product, index) => ({
  id: quote(deterministicUuid(`product:${product.slug}`)),
  category_id: quote(deterministicUuid(`category:${product.category}`)),
  slug: quote(product.slug),
  name: quote(product.name),
  description: quote(product.description),
  base_price_minor: String(Math.round(product.basePrice * 100)),
  currency: quote("SGD"),
  status: quote("draft"),
  customizable: quote(product.customizable !== false),
  metadata: json({
    seedStatus: "provisional",
    nameCn: product.nameCn,
    descriptionCn: product.descriptionCn,
    materials: product.materials ?? [],
    occasions: product.occasions ?? [],
    featured: Boolean(product.featured),
  }),
  sort_order: String(index),
}));

const mediaRows = catalogue.products.flatMap((product) => {
  const media = catalogue.productMedia(product);
  return media.images.map((url, index) => ({
    id: quote(deterministicUuid(`media:${product.slug}:${url}`)),
    product_id: quote(deterministicUuid(`product:${product.slug}`)),
    url: quote(url),
    alt_text: quote(product.name),
    role: quote(index === 0 ? "primary" : "gallery"),
    match_quality: quote(media.isCurated ? "representative" : "fallback"),
    sort_order: String(index),
  }));
});

const skuRows = catalogue.products.map((product, index) => ({
  id: quote(deterministicUuid(`sku:${product.slug}:base`)),
  product_id: quote(deterministicUuid(`product:${product.slug}`)),
  code: quote(`WOYKE-SEED-${String(index + 1).padStart(3, "0")}`),
  option_signature: quote("base"),
  price_minor: String(Math.round(product.basePrice * 100)),
  currency: quote("SGD"),
  is_active: "false",
  metadata: json({ seedStatus: "provisional" }),
}));

const inventoryRows = catalogue.products.map((product) => ({
  id: quote(deterministicUuid(`inventory:${product.slug}:base`)),
  sku_id: quote(deterministicUuid(`sku:${product.slug}:base`)),
  quantity_on_hand: "0",
  quantity_reserved: "0",
  low_stock_threshold: "0",
}));

const formId = deterministicUuid("form:woyke-guided-v1");
const formRows = [
  {
    id: quote(formId),
    slug: quote("woyke-guided"),
    name: quote("WOYKE guided configurator"),
    version: "1",
    status: quote("draft"),
  },
];

const componentRows = configSteps.map((step, index) => ({
  id: quote(deterministicUuid(`component:${step.id}`)),
  form_id: quote(formId),
  slug: quote(step.id),
  name: quote(step.name),
  description: quote(step.description ?? ""),
  component_type: quote(step.type),
  display_step: String(step.displayStep ?? index + 1),
  sort_order: String(index),
  is_required: quote(!["engraving", "gift"].includes(step.id)),
  condition_rule: json(conditionRule(step.condition)),
  guide: step.guide ? json(step.guide) : "null",
}));

const optionRows = configSteps.flatMap((step) =>
  (step.options ?? []).map((option, index) => ({
    id: quote(deterministicUuid(`option:${step.id}:${option.value}`)),
    component_id: quote(deterministicUuid(`component:${step.id}`)),
    slug: quote(option.id),
    value: quote(option.value),
    label: quote(option.label),
    description: quote(option.description ?? ""),
    price_delta_minor: String(Math.round((option.upcharge ?? 0) * 100)),
    metadata: json({
      labelCn: option.labelCn,
      descriptionCn: option.descriptionCn,
      color: option.color,
    }),
    sort_order: String(index),
    is_active: "true",
  })),
);

const compatibility = {
  none: catalogue.allCategories,
  "stud-dangling": ["stud-earring", "dangling-earring"],
  "ring-pendant": ["ring", "pendant"],
  "ring-brooch": ["ring", "brooch"],
  "pendant-brooch": ["pendant", "brooch"],
  "bracelet-necklace": ["bracelet", "necklace"],
};
const combinationRows = Object.entries(compatibility).map(([name, categories]) => ({
  id: quote(deterministicUuid(`combination:${name}`)),
  form_id: quote(formId),
  name: quote(name),
  selection_rule: json({
    all: [
      { field: "interchangeability", operator: "equals", value: name },
      { field: "category", operator: "in", value: categories },
    ],
  }),
  is_active: "true",
}));

const pricingRows = optionRows
  .filter((option) => option.price_delta_minor !== "0")
  .map((option, index) => ({
    id: quote(deterministicUuid(`pricing:${option.id}`)),
    form_id: quote(formId),
    name: quote(`Option ${option.id.slice(1, 9)}`),
    condition_rule: json({
      all: [
        {
          field: "option_id",
          operator: "equals",
          value: option.id.slice(1, -1),
        },
      ],
    }),
    adjustment_minor: option.price_delta_minor,
    currency: quote("SGD"),
    priority: String(100 + index),
    is_active: "true",
  }));

const translationRows = [
  ...catalogue.products.flatMap((product) => [
    {
      namespace: "product",
      key: `${product.slug}.name`,
      locale: "zh-SG",
      value: product.nameCn,
    },
    {
      namespace: "product",
      key: `${product.slug}.description`,
      locale: "zh-SG",
      value: product.descriptionCn,
    },
  ]),
  ...configSteps.flatMap((step) => [
    {
      namespace: "configurator",
      key: `${step.id}.name`,
      locale: "zh-SG",
      value: step.nameCn,
    },
    {
      namespace: "configurator",
      key: `${step.id}.description`,
      locale: "zh-SG",
      value: step.descriptionCn,
    },
    ...(step.options ?? []).flatMap((option) => [
      {
        namespace: "configurator",
        key: `${step.id}.${option.value}.label`,
        locale: "zh-SG",
        value: option.labelCn,
      },
      {
        namespace: "configurator",
        key: `${step.id}.${option.value}.description`,
        locale: "zh-SG",
        value: option.descriptionCn,
      },
    ]),
  ]),
]
  .filter((entry) => entry.value)
  .map((entry) => ({
    id: quote(
      deterministicUuid(
        `translation:${entry.namespace}:${entry.key}:${entry.locale}`,
      ),
    ),
    namespace: quote(entry.namespace),
    key: quote(entry.key),
    locale: quote(entry.locale),
    value: quote(entry.value),
    status: quote("draft"),
  }));

assert.equal(categoryRows.length, 9);
assert.equal(productRows.length, 25);
assert.equal(componentRows.length, 71);
assert.equal(optionRows.length, 458);
assert.equal(combinationRows.length, 6);

const seed = [
  "-- Generated from the existing WOYKE static catalogue and configurator.",
  "-- All commercial rows remain draft/inactive until client approval.",
  "begin;\n",
  insertRows("categories", ["id", "slug", "name", "sort_order", "is_active"], categoryRows),
  insertRows(
    "products",
    [
      "id",
      "category_id",
      "slug",
      "name",
      "description",
      "base_price_minor",
      "currency",
      "status",
      "customizable",
      "metadata",
      "sort_order",
    ],
    productRows,
  ),
  insertRows(
    "product_media",
    [
      "id",
      "product_id",
      "url",
      "alt_text",
      "role",
      "match_quality",
      "sort_order",
    ],
    mediaRows,
  ),
  insertRows(
    "skus",
    [
      "id",
      "product_id",
      "code",
      "option_signature",
      "price_minor",
      "currency",
      "is_active",
      "metadata",
    ],
    skuRows,
  ),
  insertRows(
    "inventory",
    [
      "id",
      "sku_id",
      "quantity_on_hand",
      "quantity_reserved",
      "low_stock_threshold",
    ],
    inventoryRows,
  ),
  insertRows(
    "configurator_forms",
    ["id", "slug", "name", "version", "status"],
    formRows,
  ),
  insertRows(
    "configurator_components",
    [
      "id",
      "form_id",
      "slug",
      "name",
      "description",
      "component_type",
      "display_step",
      "sort_order",
      "is_required",
      "condition_rule",
      "guide",
    ],
    componentRows,
  ),
  insertRows(
    "configurator_options",
    [
      "id",
      "component_id",
      "slug",
      "value",
      "label",
      "description",
      "price_delta_minor",
      "metadata",
      "sort_order",
      "is_active",
    ],
    optionRows,
  ),
  insertRows(
    "valid_option_combinations",
    ["id", "form_id", "name", "selection_rule", "is_active"],
    combinationRows,
  ),
  insertRows(
    "pricing_rules",
    [
      "id",
      "form_id",
      "name",
      "condition_rule",
      "adjustment_minor",
      "currency",
      "priority",
      "is_active",
    ],
    pricingRows,
  ),
  insertRows(
    "translations",
    ["id", "namespace", "key", "locale", "value", "status"],
    translationRows,
  ),
  "commit;\n",
].join("\n");

if (process.argv.includes("--check")) {
  assert.equal(fs.existsSync(output), true, "Generated seed migration is missing.");
  assert.equal(
    fs.readFileSync(output, "utf8"),
    seed,
    "Generated seed migration is stale.",
  );
} else {
  fs.writeFileSync(output, seed, "utf8");
  console.log(
    `Generated ${path.relative(repositoryRoot, output)}: ${productRows.length} products, ${componentRows.length} components, ${optionRows.length} options.`,
  );
}
