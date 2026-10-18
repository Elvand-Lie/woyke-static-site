"use client";

import { useEffect } from "react";

function readArray(key: string) {
  try { const parsed = JSON.parse(localStorage.getItem(key) ?? "null"); return Array.isArray(parsed?.data) ? parsed.data : Array.isArray(parsed) ? parsed : []; }
  catch { return []; }
}
function clearArray(key: string) { localStorage.setItem(key, JSON.stringify({ schemaVersion: 1, updatedAt: new Date().toISOString(), data: [] })); }

export function AnonymousStateSync({ userId }: { userId: string }) {
  useEffect(() => {
    const marker = `woyke.production.sync.v1.${userId}`;
    if (sessionStorage.getItem(marker)) return;
    const designs = readArray("woyke.designs.v1"); const cart = readArray("woyke.cart.v1");
    if (!designs.length && !cart.length) { sessionStorage.setItem(marker, "empty"); return; }
    fetch("/api/account/sync", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ designs, cart }) })
      .then((response) => { if (!response.ok) throw new Error(); clearArray("woyke.designs.v1"); clearArray("woyke.cart.v1"); sessionStorage.setItem(marker, "complete"); location.reload(); })
      .catch(() => sessionStorage.removeItem(marker));
  }, [userId]);
  return null;
}