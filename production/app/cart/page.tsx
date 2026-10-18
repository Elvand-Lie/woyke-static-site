import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { getAuthContext } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Shopping bag" };
type CartRow = { id: string; quantity: number; unit_price_minor: number; configuration_fingerprint: string; configuration_snapshot: { productName?: string; selectionLabels?: Record<string, string>; preview?: { src?: string; alt?: string } }; products: { name: string; slug: string; product_media: { url: string; alt_text: string; sort_order: number }[] } | { name: string; slug: string; product_media: { url: string; alt_text: string; sort_order: number }[] }[] };
export default async function CartPage() {
  const auth = await getAuthContext();
  let items: { id: string; productName: string; productSlug: string; image: string; alt: string; quantity: number; unitPriceMinor: number; fingerprint: string; specifications: string[] }[] = [];
  if (auth) {
    const supabase = await createServerSupabaseClient();
    const { data: cart } = await supabase.from("carts")
      .select("id,cart_items(id,quantity,unit_price_minor,configuration_fingerprint,configuration_snapshot,products!inner(name,slug,product_media(url,alt_text,sort_order)))")
      .eq("owner_id", auth.user.id)
      .eq("status", "active")
      .maybeSingle();
    items = ((cart?.cart_items ?? []) as unknown as CartRow[]).map((item) => {
      const product = Array.isArray(item.products) ? item.products[0] : item.products;
      const media = [...(product?.product_media ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0];
      return {
        id: item.id,
        productName: item.configuration_snapshot?.productName ?? product?.name ?? "WOYKE piece",
        productSlug: product?.slug ?? "",
        image: item.configuration_snapshot?.preview?.src ?? media?.url ?? "",
        alt: item.configuration_snapshot?.preview?.alt ?? media?.alt_text ?? product?.name ?? "WOYKE piece",
        quantity: item.quantity,
        unitPriceMinor: item.unit_price_minor,
        fingerprint: item.configuration_fingerprint,
        specifications: Object.values(item.configuration_snapshot?.selectionLabels ?? {}).filter(Boolean).slice(0, 6),
      };
    });
  }
  return <main id="main"><section className="page-hero" data-header-theme="light"><div className="container"><div className="section-kicker">Shopping bag / {auth ? "private account" : "temporary browser draft"}</div><h1 className="display-lg">Your pieces.</h1><p className="lede">Specifications stay attached to the piece you shaped.</p></div></section><section className="scene scene-ivory"><div className="container"><CartView initialItems={items} authenticated={Boolean(auth)} /></div></section></main>;
}