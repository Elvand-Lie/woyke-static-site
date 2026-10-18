import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { formatMoney } from "@/lib/catalogue";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };
export default async function OrderDetailPage({ params }: Props) {
  const { user } = await requireUser("/account/orders"); const supabase = await createServerSupabaseClient(); const { id } = await params;
  const { data: order } = await supabase.from("orders").select("id,reference,status,payment_status,fulfillment_status,total_minor,currency,created_at,shipping_address_snapshot,order_items(id,product_name,quantity,unit_price_minor,line_total_minor,order_configuration_snapshots(selections,pricing_breakdown,preview)),order_status_history(status,note,created_at)").eq("id", id).eq("owner_id", user.id).maybeSingle();
  if (!order) notFound();
  return <main id="main"><section className="page-hero" data-header-theme="light"><div className="container"><div className="section-kicker">Order / {order.reference}</div><h1 className="display-lg">{order.status}.</h1><p className="lede">Payment {order.payment_status} / fulfilment {order.fulfillment_status}</p></div></section><section className="scene scene-ivory"><div className="container order-detail"><div>{order.order_items.map((item) => <article className="cart-item" key={item.id}><div><p className="mono">QTY {item.quantity}</p><h2>{item.product_name}</h2><p>{Object.values(item.order_configuration_snapshots?.[0]?.selections ?? {}).slice(0, 5).join(" / ")}</p></div><strong>{formatMoney(item.line_total_minor, order.currency)}</strong></article>)}</div><aside className="order-summary"><p className="mono">Order total</p><strong>{formatMoney(order.total_minor, order.currency)}</strong><h3>Timeline</h3>{order.order_status_history.map((entry) => <p key={entry.created_at}><span className="mono">{new Date(entry.created_at).toLocaleString("en-SG")}</span><br />{entry.status}{entry.note ? ` — ${entry.note}` : ""}</p>)}</aside></div></section></main>;
}
