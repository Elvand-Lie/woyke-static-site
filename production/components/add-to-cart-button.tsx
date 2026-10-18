"use client";

import { useState } from "react";

type Props = { product: { id: string; slug: string; name: string; priceMinor: number; image: string; alt: string }; authenticated: boolean };
function readArray(key: string) { try { const parsed = JSON.parse(localStorage.getItem(key) ?? "null"); return Array.isArray(parsed?.data) ? parsed.data : Array.isArray(parsed) ? parsed : []; } catch { return []; } }
function writeArray(key: string, data: unknown[]) { localStorage.setItem(key, JSON.stringify({ schemaVersion: 1, updatedAt: new Date().toISOString(), data })); }

export function AddToCartButton({ product, authenticated }: Props) {
  const [status, setStatus] = useState("");
  async function add() {
    const fingerprint = `base:${product.id}`;
    if (authenticated) {
      const response = await fetch("/api/account/cart", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productSlug: product.slug, fingerprint, quantity: 1, configuration: { type: "base" } }) });
      if (!response.ok) { setStatus("Unable to add this piece."); return; }
    } else {
      const lines = readArray("woyke.cart.v1") as Record<string, unknown>[];
      const existing = lines.find((line) => line.fingerprint === fingerprint);
      if (existing) existing.quantity = Math.min(10, Number(existing.quantity ?? 1) + 1);
      else lines.push({ id: crypto.randomUUID(), productId: product.id, productSlug: product.slug, productName: product.name, fingerprint, quantity: 1, unitPrice: product.priceMinor / 100, preview: { src: product.image, alt: product.alt, match: "representative" }, selections: {}, selectionLabels: {}, configuration: { type: "base" } });
      writeArray("woyke.cart.v1", lines);
    }
    location.href = "/cart";
  }
  async function save() {
    const design = { id: crypto.randomUUID(), productSlug: product.slug, productName: product.name, name: `${product.name} starting design`, preview: { src: product.image, alt: product.alt, match: "representative" }, selections: {}, selectionLabels: {} };
    if (authenticated) {
      const response = await fetch("/api/account/designs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(design) });
      if (!response.ok) { setStatus("Unable to save this design."); return; }
      location.href = "/account/designs";
    } else {
      writeArray("woyke.designs.v1", [...readArray("woyke.designs.v1"), design]);
      location.href = "/auth?return=/account/designs";
    }
  }
  return <><button className="btn btn-secondary" type="button" onClick={add}><span>Add base design</span></button><button className="text-button" type="button" onClick={save}>Save starting design</button><p className="prototype-note" role="status">{status || "Use this study as a starting point, then shape the details in the atelier."}</p></>;
}