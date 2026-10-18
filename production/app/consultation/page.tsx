import type { Metadata } from "next";
import { ConsultationForm } from "@/components/consultation-form";
import { getAuthContext } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Consultation" };

type Props = { searchParams: Promise<{ product?: string; design?: string }> };

export default async function ConsultationPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const auth = await getAuthContext();
  const [productResult, designResult] = await Promise.all([
    params.product
      ? supabase.from("products").select("id,slug,name").eq("slug", params.product).eq("status", "published").maybeSingle()
      : Promise.resolve({ data: null }),
    params.design && auth
      ? supabase.from("saved_designs").select("id,name").eq("id", params.design).eq("owner_id", auth.user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const context = designResult.data
    ? { productSlug: productResult.data?.slug ?? "", designId: designResult.data.id, label: `Saved design: ${designResult.data.name}` }
    : productResult.data
      ? { productSlug: productResult.data.slug, designId: "", label: `Piece: ${productResult.data.name}` }
      : { productSlug: "", designId: "", label: "" };

  return <main id="main">
    <section className="consultation-hero consultation-hero-v3" data-header-theme="dark">
      <img src="/assets/media/images/lifestyle-dark.webp" alt="Model wearing diamond jewellery" />
      <div className="consultation-hero-shade" />
      <div className="consultation-panel-v3">
        <div className="section-kicker">Private consultation</div>
        <h1>A conversation<br />before a configuration.</h1>
        <p>Bring a product, a saved idea, or simply the reason the piece should exist.</p>
        <a className="btn btn-light" href="#consultation-form"><span>Request a time</span><span>&darr;</span></a>
      </div>
    </section>
    <section id="consultation-form" className="scene scene-ivory" data-header-theme="light">
      <div className="container consultation-grid">
        <div>
          <div className="section-kicker">Private appointment request</div>
          <h2 className="display-md">Begin with what you know.</h2>
          <p className="lede">Share the occasion, piece or question you have in mind. Your request will be saved securely for the WOYKE team to review.</p>
        </div>
        <ConsultationForm context={context} />
      </div>
    </section>
  </main>;
}