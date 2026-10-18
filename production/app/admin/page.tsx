import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ConsultationEditor, ContentEditor, InventoryEditor, OrderEditor, ProductEditor, TranslationEditor } from "@/components/admin-controls";
import { AdminMediaUpload } from "@/components/admin-media-upload";
import { requireAdmin } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
export const metadata: Metadata = { title: "Administration" };
function Table({ title, headers, rows }: { title: string; headers: string[]; rows: ReactNode[][] }) { return <section className="admin-table"><h2>{title}</h2><div className="table-scroll"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div></section>; }
type Product = { id: string; name: string; description: string; status: string; base_price_minor: number; currency: string };
type Stock = { id: string; quantity_on_hand: number; quantity_reserved: number; skus: { code: string; products: { name: string } } | { code: string; products: { name: string } }[] };
type Order = { id: string; reference: string; status: string; payment_status: string; total_minor: number; currency: string };
type Consultation = { id: string; reference: string; name: string; email: string; status: string; preferred_date: string | null; channel: string };
type Customer = { id: string; display_name: string | null; email: string | null; created_at: string };
type Audit = { id: string; action: string; entity_type: string; created_at: string; profiles: { email: string | null } | { email: string | null }[] | null };
export default async function AdminPage() {
  await requireAdmin(); const admin = createAdminSupabaseClient();
  const [p, i, c, o, q, a] = await Promise.all([
    admin.from("products").select("id,name,description,status,base_price_minor,currency").order("sort_order"),
    admin.from("inventory").select("id,quantity_on_hand,quantity_reserved,skus(code,products(name))").limit(100),
    admin.from("profiles").select("id,display_name,email,created_at").order("created_at", { ascending: false }).limit(100),
    admin.from("orders").select("id,reference,status,payment_status,total_minor,currency").order("created_at", { ascending: false }).limit(100),
    admin.from("consultation_requests").select("id,reference,name,email,status,preferred_date,channel").order("created_at", { ascending: false }).limit(100),
    admin.from("admin_audit_logs").select("id,action,entity_type,created_at,profiles(email)").order("created_at", { ascending: false }).limit(100),
  ]);
  const products = (p.data ?? []) as Product[]; const stocks = (i.data ?? []) as unknown as Stock[]; const customers = (c.data ?? []) as Customer[]; const orders = (o.data ?? []) as Order[]; const consultations = (q.data ?? []) as Consultation[]; const audits = (a.data ?? []) as unknown as Audit[];
  return <main id="main"><section className="page-hero" data-header-theme="light"><div className="container"><div className="section-kicker">Protected administration</div><h1 className="display-lg">WOYKE operations.</h1><p className="lede">All mutations run server-side and write an administrator audit record.</p></div></section><section className="scene scene-ivory admin-sections"><div className="container">
    <Table title="Products" headers={["Piece", "Edit"]} rows={products.map((item) => [<div key="summary"><strong>{item.name}</strong><br /><span className="mono">{item.status} / {item.currency} {(item.base_price_minor / 100).toLocaleString()}</span></div>, <ProductEditor key="edit" product={item} />])} />
    <AdminMediaUpload products={products.map(({ id, name }) => ({ id, name }))} />
    <Table title="Inventory" headers={["SKU", "On hand", "Reserved", "Adjustment"]} rows={stocks.map((item) => { const sku = Array.isArray(item.skus) ? item.skus[0] : item.skus; return [sku?.code ?? "—", item.quantity_on_hand, item.quantity_reserved, <InventoryEditor key="edit" id={item.id} />]; })} />
    <Table title="Orders" headers={["Reference", "Payment", "Status update"]} rows={orders.map((item) => [<span key="ref">{item.reference}<br />{item.currency} {(item.total_minor / 100).toLocaleString()}</span>, item.payment_status, <OrderEditor key="edit" id={item.id} status={item.status} />])} />
    <Table title="Consultations" headers={["Client", "Preference", "Status"]} rows={consultations.map((item) => [<span key="client"><span className="mono">{item.reference}</span><br />{item.name}<br />{item.email}</span>, `${item.preferred_date ?? "Flexible"} / ${item.channel}`, <ConsultationEditor key="edit" id={item.id} status={item.status} />])} />
    <Table title="Customers" headers={["Name", "Email", "Created"]} rows={customers.map((item) => [item.display_name ?? "—", item.email ?? "—", new Date(item.created_at).toLocaleDateString("en-SG")])} />
    <div className="admin-content-grid"><ContentEditor /><TranslationEditor /></div>
    <Table title="Audit trail" headers={["Action", "Entity", "Actor", "Time"]} rows={audits.map((item) => { const actor = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles; return [item.action, item.entity_type, actor?.email ?? "System", new Date(item.created_at).toLocaleString("en-SG")]; })} />
  </div></section></main>;
}
