import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/app/auth/actions";
import { requireUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Your account" };
export default async function AccountPage() {
  const { user, roles } = await requireUser("/account");
  const supabase = await createServerSupabaseClient();
  const [{ count: designs }, { data: cart }, { count: orders }, { data: profile }] = await Promise.all([
    supabase.from("saved_designs").select("id", { count: "exact", head: true }).eq("owner_id", user.id),
    supabase.from("carts").select("id,cart_items(id)").eq("owner_id", user.id).eq("status", "active").maybeSingle(),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("owner_id", user.id),
    supabase.from("profiles").select("display_name,email").eq("id", user.id).single(),
  ]);
  const displayName = profile?.display_name || user.user_metadata.display_name || "WOYKE client";
  const initials = displayName.split(/\s+/).map((part: string) => part[0]).join("").slice(0, 2).toUpperCase();
  return <main id="main"><section className="account-hero" data-header-theme="light"><div className="container account-hero-grid"><div><div className="section-kicker">Private account</div><h1 className="display-lg">Good to see you.</h1><p className="lede">{displayName} / {profile?.email || user.email}</p></div><div className="account-monogram">{initials}</div></div></section><section className="scene scene-cream" data-header-theme="light"><div className="container account-dashboard"><Link className="account-feature" href="/account/designs"><span className="mono">Saved designs / {designs ?? 0}</span><h2>{designs ? `${designs} ideas waiting.` : "Nothing saved yet."}</h2><p>Return to designs synchronized to this account.</p><span>Open designs +</span></Link><Link className="account-feature" href="/cart"><span className="mono">Shopping bag / {cart?.cart_items?.length ?? 0}</span><h2>Your authenticated bag.</h2><p>Items are isolated by your Supabase account.</p><span>Open bag +</span></Link><div className="account-feature"><span className="mono">Orders / {orders ?? 0}</span><h2>{orders ? "Atelier activity." : "No orders yet."}</h2><p>Follow payment and fulfilment directly from your account.</p><Link href="/account/orders">View orders +</Link>{roles.includes("admin") ? <Link href="/admin">Open administration +</Link> : null}</div></div></section><section className="scene scene-ivory"><div className="container"><div className="btn-row"><Link className="btn btn-secondary" href="/account/settings"><span>Profile & delivery</span></Link><form action={logoutAction}><button className="btn btn-secondary" type="submit"><span>Sign out</span></button></form></div></div></section></main>;
}