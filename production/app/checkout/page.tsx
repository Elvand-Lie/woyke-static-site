import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { requireUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const { user } = await requireUser("/checkout");
  const supabase = await createServerSupabaseClient();
  const [{ data: cart }, { data: profile }, { data: address }] = await Promise.all([
    supabase.from("carts").select("id,cart_items(quantity,unit_price_minor,configuration_snapshot)").eq("owner_id", user.id).eq("status", "active").maybeSingle(),
    supabase.from("profiles").select("display_name,phone").eq("id", user.id).single(),
    supabase.from("customer_addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  const items = cart?.cart_items ?? [];
  const total = items.reduce((sum, item) => sum + item.unit_price_minor * item.quantity, 0);
  return <main id="main"><section className="page-hero" data-header-theme="light"><div className="container"><div className="section-kicker">Secure checkout / Stripe test mode</div><h1 className="display-lg">Complete your order.</h1><p className="lede">Your configuration and price are validated again on the server before payment.</p></div></section><section className="scene scene-ivory"><div className="container checkout-layout"><CheckoutForm totalMinor={total} defaults={{ recipientName: address?.recipient_name ?? profile?.display_name ?? "", phone: address?.phone ?? profile?.phone ?? "", addressLine1: address?.address_line_1 ?? "", addressLine2: address?.address_line_2 ?? "", city: address?.city ?? "Singapore", region: address?.region ?? "Singapore", postalCode: address?.postal_code ?? "", countryCode: address?.country_code ?? "SG" }} /><aside className="order-summary"><p className="mono">Order summary</p><div><span>{items.length} {items.length === 1 ? "piece" : "pieces"}</span><strong>{new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD", maximumFractionDigits: 0 }).format(total / 100)}</strong></div><p>Complimentary insured delivery is currently represented as SGD 0.</p></aside></div></section></main>;
}
