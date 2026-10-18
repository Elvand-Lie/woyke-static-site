import type { Metadata } from "next";
import Script from "next/script";
import { getAuthContext } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Design your own" };
type Props = { searchParams: Promise<{ product?: string; design?: string; line?: string }> };

export default async function DesignPage({ searchParams }: Props) {
  const params = await searchParams;
  const auth = await getAuthContext();
  let restored: Record<string, unknown> | null = null;
  if (auth && (params.design || params.line)) {
    const supabase = await createServerSupabaseClient();
    if (params.design) {
      const { data } = await supabase.from("saved_designs").select("id,name,public_snapshot,preview,created_at").eq("id", params.design).maybeSingle();
      if (data) restored = { ...data.public_snapshot, id: data.id, name: data.name, preview: data.preview, createdAt: data.created_at, kind: "design" };
    } else if (params.line) {
      const { data } = await supabase.from("cart_items").select("id,quantity,configuration_snapshot,created_at").eq("id", params.line).maybeSingle();
      if (data) restored = { ...data.configuration_snapshot, id: data.id, quantity: data.quantity, createdAt: data.created_at, kind: "line" };
    }
  }
  const bootstrap = JSON.stringify({ authenticated: Boolean(auth), restored, requestedProduct: params.product ?? null }).replaceAll("<", "\\u003c");
  return <>
    <main id="main">
    <div className="configurator-engine" data-header-theme="split">
      <section className="atelier-controls" aria-labelledby="config-question-title">
        <div className="atelier-topline"><div><span className="mono">Digital atelier</span><strong id="config-product-name">WOYKE custom design</strong></div><button id="config-reset" className="atelier-reset" type="button">Start over</button></div>
        <div className="atelier-progress" aria-label="Configuration progress"><span id="config-current" className="mono">01 / 11</span><div className="atelier-progress-track" aria-hidden="true"><div id="config-fill" className="atelier-progress-fill" /></div><span id="config-label" className="mono">OCCASION</span></div>
        <p id="config-substep" className="atelier-substep mono" />
        <div id="config-editor" className="atelier-editor"><div className="atelier-question"><span id="config-kicker" className="section-kicker">Begin with a reason</span><h1 id="config-question-title">Choose your occasion</h1><p id="config-copy">Every piece tells a story. What is yours?</p></div><div id="config-guide" className="atelier-guide" hidden /><div id="config-options" className="atelier-options" role="radiogroup" /><div id="config-extras" className="atelier-extras" /><p id="config-validation" className="atelier-validation" role="status" aria-live="polite" /></div>
        <div id="config-summary" className="atelier-summary" hidden />
        <div className="atelier-actions"><button id="config-back" className="btn btn-secondary" type="button"><span>Back</span></button><button id="config-next" className="btn btn-light" type="button"><span>Continue</span><span>→</span></button></div>
      </section>
      <aside className="atelier-preview" aria-label="Live jewellery preview"><div id="config-preview-stage" className="atelier-preview-stage"><img id="config-preview-image" src="/assets/media/images/ring-radiant-floral.webp" alt="Current jewellery configuration preview" /><div className="atelier-preview-glow" aria-hidden="true" /><span id="config-preview-badge" className="atelier-preview-badge mono">REPRESENTATIVE PREVIEW</span><div className="atelier-preview-caption"><span id="preview-reference" className="mono">WOYKE / LIVE STUDY</span><h2 id="preview-design-name">A piece shaped by you.</h2><p id="preview-design-copy">The image changes whenever a matching approved preview is available.</p></div></div><div className="atelier-preview-footer"><div className="atelier-preview-price"><span className="mono">SERVER-VALIDATED ESTIMATE</span><strong id="preview-price-value">—</strong></div><div className="atelier-preview-specs mono"><span id="preview-form-label">FORM / —</span><span id="preview-stone-label">STONE / —</span><span id="preview-metal-label">METAL / —</span></div></div></aside>
    </div>
    <section id="design-film" className="scene scene-dark editorial-film-section" data-header-theme="dark">
      <div className="container editorial-film-grid">
        <figure className="editorial-film-frame editorial-film-landscape reveal">
          <video muted playsInline loop controls preload="metadata" poster="/assets/media/posters/pear-ring-showcase.jpg" src="/assets/media/videos/pear-ring-showcase.mp4" data-autoplay="true" aria-label="Representative pear-cut ring object study" />
          <figcaption className="mono">REPRESENTATIVE OBJECT STUDY / PEAR-CUT RING</figcaption>
        </figure>
        <div className="editorial-film-copy reveal"><div className="section-kicker">Made visible</div><h2 className="display-md">See the idea move.</h2><p className="lede">A representative pear-cut study shows proportion, profile and movement in the hand. Your saved specification remains the source of truth; final feasibility and quotation are confirmed by the atelier.</p><a className="btn btn-secondary" href="/consultation"><span>Discuss your design</span><span>↗</span></a></div>
      </div>
    </section>    </main>
    <div id="config-toast" className="atelier-toast" role="status" aria-live="polite" hidden />
    <script id="configurator-bootstrap" type="application/json" dangerouslySetInnerHTML={{ __html: bootstrap }} />
    <Script type="module" src="/assets/js/design.js" strategy="afterInteractive" />
  </>;
}
