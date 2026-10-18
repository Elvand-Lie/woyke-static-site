import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Props = { searchParams: Promise<{ session_id?: string }> };
export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { user } = await requireUser("/checkout/success");
  const sessionId = (await searchParams).session_id;
  const supabase = await createServerSupabaseClient();
  const { data: order } = sessionId ? await supabase.from("orders").select("id,reference,status,payment_status,total_minor,currency").eq("checkout_session_id", sessionId).eq("owner_id", user.id).maybeSingle() : { data: null };
  return <main id="main"><section className="page-hero" data-header-theme="light"><div className="container"><div className="section-kicker">{order?.payment_status === "paid" ? "Payment confirmed" : "Payment processing"}</div><h1 className="display-lg">{order?.payment_status === "paid" ? "Your order is confirmed." : "We are confirming your payment."}</h1><p className="lede">{order ? `Order ${order.reference}. Stripe webhooks remain the source of truth for payment state.` : "The order could not be matched to this account."}</p><div className="btn-row"><Link className="btn" href="/account/orders"><span>View your orders</span></Link><Link className="btn btn-secondary" href="/shop"><span>Return to collection</span></Link></div></div></section></main>;
}
