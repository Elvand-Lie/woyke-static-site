import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProductMedia = {
  url: string;
  altText: string;
  role: string;
  matchQuality: string;
  sortOrder: number;
};

export type CatalogueProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePriceMinor: number;
  currency: string;
  customizable: boolean;
  category: { slug: string; name: string };
  media: ProductMedia[];
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  base_price_minor: number;
  currency: string;
  customizable: boolean;
  categories: { slug: string; name: string } | { slug: string; name: string }[];
  product_media: {
    url: string;
    alt_text: string;
    role: string;
    match_quality: string;
    sort_order: number;
  }[];
};

const productSelection =
  "id,slug,name,description,base_price_minor,currency,customizable,categories!inner(slug,name),product_media(url,alt_text,role,match_quality,sort_order)";

function normalize(row: ProductRow): CatalogueProduct {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    basePriceMinor: row.base_price_minor,
    currency: row.currency,
    customizable: row.customizable,
    category,
    media: [...(row.product_media ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        url: item.url,
        altText: item.alt_text,
        role: item.role,
        matchQuality: item.match_quality,
        sortOrder: item.sort_order,
      })),
  };
}

export async function listPublishedProducts(input?: {
  query?: string;
  category?: string;
  sort?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelection)
    .eq("status", "published")
    .order("sort_order")
    .order("sort_order", { referencedTable: "product_media" });

  if (error) throw new Error("Catalogue query failed", { cause: error });
  let products = ((data ?? []) as unknown as ProductRow[]).map(normalize);
  const query = input?.query?.trim().toLocaleLowerCase("en-SG");
  if (query) {
    products = products.filter((product) =>
      [product.name, product.description, product.category.name]
        .join(" ")
        .toLocaleLowerCase("en-SG")
        .includes(query),
    );
  }
  if (input?.category && input.category !== "all") {
    products = products.filter((product) => product.category.slug === input.category);
  }
  if (input?.sort === "price-asc") products.sort((a, b) => a.basePriceMinor - b.basePriceMinor);
  if (input?.sort === "price-desc") products.sort((a, b) => b.basePriceMinor - a.basePriceMinor);
  if (input?.sort === "name") products.sort((a, b) => a.name.localeCompare(b.name));
  return products;
}

export async function getPublishedProduct(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelection)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error("Product query failed", { cause: error });
  return data ? normalize(data as unknown as ProductRow) : null;
}

export function formatMoney(minor: number, currency = "SGD") {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(minor / 100);
}