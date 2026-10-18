"use client";

import { useState } from "react";

type ProductOption = { id: string; name: string };

export function AdminMediaUpload({ products }: { products: ProductOption[] }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  async function upload(data: FormData) {
    setBusy(true);
    setStatus("Preparing secure upload…");
    try {
      const file = data.get("file");
      if (!(file instanceof File) || !file.size || !file.type.startsWith("image/") || file.size > 25_000_000) throw new Error("Choose an image smaller than 25 MB.");
      const signatureResponse = await fetch("/api/admin/media", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "signature" }) });
      const signature = await signatureResponse.json();
      if (!signatureResponse.ok) throw new Error(signature.error ?? "Cloudinary is unavailable.");
      const uploadData = new FormData();
      uploadData.set("file", file);
      uploadData.set("api_key", signature.apiKey);
      uploadData.set("timestamp", String(signature.timestamp));
      uploadData.set("folder", signature.folder);
      uploadData.set("signature", signature.signature);
      setStatus("Uploading asset…");
      const cloudResponse = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`, { method: "POST", body: uploadData });
      const cloud = await cloudResponse.json();
      if (!cloudResponse.ok) throw new Error(cloud.error?.message ?? "Cloudinary rejected the asset.");
      const recordResponse = await fetch("/api/admin/media", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "record", productId: data.get("productId"), url: cloud.secure_url, storagePath: cloud.public_id, altText: data.get("altText"), role: data.get("role"), matchQuality: data.get("matchQuality") }) });
      const record = await recordResponse.json();
      if (!recordResponse.ok) throw new Error(record.error ?? "The asset record could not be saved.");
      setStatus("Asset uploaded and attached. Refreshing…");
      location.reload();
    } catch (error) {
      setBusy(false);
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    }
  }
  return <section className="admin-create admin-media-upload"><h2>Product media</h2><p className="prototype-note">Secure Cloudinary uploads stay disabled until the client account credentials are connected.</p><form action={upload}><select required name="productId" aria-label="Product"><option value="">Choose product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select><input required type="file" name="file" accept="image/*" aria-label="Image file" /><input required name="altText" minLength={3} placeholder="Descriptive alternative text" /><select name="role" defaultValue="gallery"><option value="primary">Primary</option><option value="gallery">Gallery</option><option value="detail">Detail</option><option value="social">Social</option></select><select name="matchQuality" defaultValue="exact"><option value="exact">Exact product match</option><option value="representative">Representative</option><option value="fallback">Fallback</option></select><button className="btn btn-secondary" disabled={busy}><span>{busy ? "Uploading…" : "Upload media"}</span></button><span role="status">{status}</span></form></section>;
}