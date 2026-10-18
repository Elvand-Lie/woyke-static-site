import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { validateAndPriceConfiguration } from "@/lib/configurator";

export async function GET() {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.from("configurator_forms")
    .select("slug,name,version,configurator_components(slug,name,description,component_type,display_step,sort_order,is_required,condition_rule,guide,configurator_options(slug,value,label,description,price_delta_minor,metadata,sort_order))")
    .eq("slug", "woyke-guided")
    .eq("status", "published")
    .order("sort_order", { referencedTable: "configurator_components" })
    .order("sort_order", { referencedTable: "configurator_components.configurator_options" })
    .single();
  if (error || !data) return NextResponse.json({ error: "Configurator unavailable." }, { status: 503 });
  return NextResponse.json(data, { headers: { "cache-control": "public, s-maxage=300, stale-while-revalidate=600" } });
}

export async function POST(request: Request) {
  try {
    const quote = await validateAndPriceConfiguration(await request.json());
    return NextResponse.json({
      fingerprint: quote.fingerprint,
      product: quote.product,
      sku: { code: quote.sku.code, available: quote.sku.available },
      name: quote.name,
      labels: quote.labels,
      currency: quote.currency,
      basePriceMinor: quote.basePriceMinor,
      totalMinor: quote.totalMinor,
      adjustments: quote.adjustments,
      formVersion: quote.form.version,
      inventoryFixture: quote.inventoryFixture,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "INVALID_CONFIGURATION";
    const [code, details] = message.split(":", 2);
    const status = ["PRODUCT_UNAVAILABLE", "SKU_UNAVAILABLE", "OUT_OF_STOCK"].includes(code) ? 409 : 400;
    return NextResponse.json({ error: code, details: details?.split("|") ?? [] }, { status });
  }
}
