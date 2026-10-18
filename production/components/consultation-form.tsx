"use client";

import { useState } from "react";

type Context = { productSlug: string; designId: string; label: string };
type Status = { message: string; tone: "success" | "error" | "" };

export function ConsultationForm({ context }: { context: Context }) {
  const [status, setStatus] = useState<Status>({ message: "", tone: "" });
  const [busy, setBusy] = useState(false);

  async function submit(formData: FormData) {
    setBusy(true);
    setStatus({ message: "Saving your request…", tone: "" });
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setStatus({ message: `Your consultation request is saved. Reference ${result.reference}.`, tone: "success" });
      } else {
        setStatus({ message: result.error ?? "Please check the details and try again.", tone: "error" });
      }
    } catch {
      setStatus({ message: "The request could not be saved. Please try again.", tone: "error" });
    } finally {
      setBusy(false);
    }
  }

  return <form className="consultation-request-form" action={submit}>
    {context.label ? <div className="consultation-context"><span className="mono">Consultation context</span><strong>{context.label}</strong></div> : null}
    <input type="hidden" name="productSlug" value={context.productSlug} />
    <input type="hidden" name="designId" value={context.designId} />
    <div className="form-grid">
      <label>Name<input required name="name" autoComplete="name" /></label>
      <label>Email<input required type="email" name="email" autoComplete="email" /></label>
      <label>Phone<input required name="phone" autoComplete="tel" /></label>
      <label>Preferred date<input type="date" name="preferredDate" /></label>
      <label>Preferred time<input name="preferredTime" placeholder="Morning or afternoon" /></label>
      <label>Format<select name="channel" defaultValue="video"><option value="video">Video</option><option value="phone">Phone</option><option value="in_person">In person</option></select></label>
      <label className="wide">What would you like to discuss?<textarea required name="message" rows={5} defaultValue={context.label ? `I would like to discuss ${context.label.toLowerCase()}.` : ""} placeholder="A specific occasion, a piece to reinterpret, or a question for the atelier…" /></label>
    </div>
    <button className="btn" type="submit" disabled={busy}><span>{busy ? "Saving…" : "Request consultation"}</span><span>&rarr;</span></button>
    {status.message ? <p className="form-status" data-tone={status.tone || undefined} role="status" aria-live="polite">{status.message}</p> : null}
    <p className="prototype-note">Submitting this form records the request securely for the WOYKE team to follow up.</p>
  </form>;
}