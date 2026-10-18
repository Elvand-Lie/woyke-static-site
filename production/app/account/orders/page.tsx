import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatMoney } from "@/lib/catalogue";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const { user } = await requireUser("/account/orders"); const supabase = await createServerSupabaseClient();
  const { data: orders } = await supabase.from("orders").select("id,reference,status,payment_status,total_minor,currency,created_at").eq("owner_id", user.id).order("created_at", { ascending: false });
  return <main id="main"><section className="page-hero" data-header-theme="light"><div className="container"><div className="section-kicker">Private account</div><h1 className="display-lg">Orders.</h1><p className="lede">Payment and atelier status come directly from the production database.</p></div></section><section className="scene scene-ivory"><div className="container order-list">{orders?.length ? orders.map((order) => <article key={order.id}><div><p className="mono">{new Date(order.created_at).toLocaleDateString("en-SG")} / {order.payment_status}</p><h2>{order.reference}</h2><p>{order.status}</p></div><strong>{formatMoney(order.total_minor, order.currency)}</strong><Link href={`/account/orders/${order.id}`}>View order →</Link></article>) : <div className="empty-state"><h2>No orders yet.</h2><p>Your completed Stripe test orders will appear here.</p><Link className="btn" href="/shop"><span>Browse the collection</span></Link></div>}</div></section></main>;
}
