import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
type Props = { params: Promise<{ token: string }> };
export const metadata: Metadata = { title: "Shared design" };
export default async function SharedDesignPage({ params }: Props) {
  const { token } = await params; const admin = createAdminSupabaseClient(); const { data, error } = await admin.rpc("get_shared_design", { token }); if (error || !data?.length) notFound();
  const design = data[0]; const snapshot = design.public_snapshot as { productName?: string; preview?: { src?: string; alt?: string }; selectionLabels?: Record<string, string>; selections?: Record<string, string> }; const labels = snapshot.selectionLabels ?? snapshot.selections ?? {};
  return <main id="main"><section className="page-hero" data-header-theme="light"><div className="container"><div className="section-kicker">Private shared design</div><h1 className="display-lg">{design.name}</h1><p className="lede">A sanitized WOYKE design shared by its owner. Account details are never included.</p></div></section><section className="scene scene-ivory"><div className="container shared-design">{snapshot.preview?.src ? <img src={snapshot.preview.src} alt={snapshot.preview.alt ?? design.name} /> : null}<div><p className="mono">{snapshot.productName ?? "WOYKE custom design"}</p><dl>{Object.entries(labels).map(([key, value]) => <div key={key}><dt>{key.replaceAll("-", " ")}</dt><dd>{value}</dd></div>)}</dl><a className="btn" href="/design"><span>Create your own</span><span>→</span></a></div></div></section></main>;
}
