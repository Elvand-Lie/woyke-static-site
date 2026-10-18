"use client";

import { useState } from "react";

type Defaults = { recipientName: string; phone: string; addressLine1: string; addressLine2: string; city: string; region: string; postalCode: string; countryCode: string };

export function CheckoutForm({ defaults, totalMinor }: { defaults: Defaults; totalMinor: number }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(formData: FormData) {
    setBusy(true); setStatus("Opening secure Stripe checkout…");
    const payload = {
      recipientName: formData.get("recipientName"),
      phone: formData.get("phone"),
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2"),
      city: formData.get("city"),
      region: formData.get("region"),
      postalCode: formData.get("postalCode"),
      countryCode: formData.get("countryCode"),
      saveAddress: formData.get("saveAddress") === "on",
    };
    const response = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.url) {
      const messages: Record<string, string> = { EMPTY_CART: "Your bag is empty.", OUT_OF_STOCK: "One of your pieces is no longer available.", INVALID_CONFIGURATION: "One design needs to be reviewed before checkout." };
      setStatus(messages[result.error] ?? "Checkout could not be opened. Please try again."); setBusy(false); return;
    }
    location.assign(result.url);
  }
  const money = new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD", maximumFractionDigits: 0 }).format(totalMinor / 100);
  return <form className="checkout-form" action={submit}>
    <div className="section-kicker">Delivery details</div><h2>Where should the piece arrive?</h2>
    <div className="form-grid">
      <label>Recipient name<input required name="recipientName" defaultValue={defaults.recipientName} autoComplete="name" /></label>
      <label>Phone<input required name="phone" defaultValue={defaults.phone} autoComplete="tel" /></label>
      <label className="wide">Address line 1<input required name="addressLine1" defaultValue={defaults.addressLine1} autoComplete="address-line1" /></label>
      <label className="wide">Address line 2<input name="addressLine2" defaultValue={defaults.addressLine2} autoComplete="address-line2" /></label>
      <label>City<input required name="city" defaultValue={defaults.city} autoComplete="address-level2" /></label>
      <label>Region<input name="region" defaultValue={defaults.region} autoComplete="address-level1" /></label>
      <label>Postal code<input required name="postalCode" defaultValue={defaults.postalCode} autoComplete="postal-code" /></label>
      <label>Country code<input required name="countryCode" maxLength={2} defaultValue={defaults.countryCode} autoComplete="country" /></label>
    </div>
    <label className="check-field"><input type="checkbox" name="saveAddress" /> Save this address to my account</label>
    <button className="btn" disabled={busy} type="submit"><span>{busy ? "Preparing checkout…" : `Pay ${money} securely`}</span><span>→</span></button>
    <p className="form-status" role="status">{status}</p>
    <p className="prototype-note">Stripe is in test mode. No live charge will be made until production keys and approved inventory are supplied.</p>
  </form>;
}
