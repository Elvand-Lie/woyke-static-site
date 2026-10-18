import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const requestSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("product"), id: z.string().uuid(), status: z.enum(["draft", "published", "archived"]), name: z.string().trim().min(2).max(160), description: z.string().trim().max(3000), basePriceMinor: z.number().int().min(0).max(100_000_000) }),
  z.object({ action: z.literal("inventory"), id: z.string().uuid(), adjustment: z.number().int().min(-100000).max(100000), reason: z.string().trim().min(3).max(240) }),
  z.object({ action: z.literal("order"), id: z.string().uuid(), status: z.enum(["confirmed", "crafting", "ready", "shipped", "delivered"]), note: z.string().trim().min(3).max(500) }),
  z.object({ action: z.literal("consultation"), id: z.string().uuid(), status: z.enum(["new", "contacted", "scheduled", "completed", "cancelled"]) }),
  z.object({ action: z.literal("content"), key: z.string().trim().min(2).max(160), locale: z.string().trim().min(2).max(12), title: z.string().trim().max(240), text: z.string().trim().max(10000), status: z.enum(["draft", "published", "archived"]) }),
  z.object({ action: z.literal("translation"), namespace: z.string().trim().min(1).max(120), key: z.string().trim().min(1).max(160), locale: z.string().trim().min(2).max(12), value: z.string().trim().max(5000), status: z.enum(["draft", "approved"]) }),
]);

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!auth.roles.includes("admin")) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid administrative update." }, { status: 400 });
  const admin = createAdminSupabaseClient(); const input = parsed.data;
  let entityType: string = input.action; let entityId: string | null = "id" in input ? input.id : null; let before: unknown = null; let after: unknown = null;
  try {
    if (input.action === "product") {
      const existing = await admin.from("products").select("*").eq("id", input.id).single(); if (existing.error) throw existing.error; before = existing.data;
      const result = await admin.from("products").update({ status: input.status, name: input.name, description: input.description, base_price_minor: input.basePriceMinor }).eq("id", input.id).select("*").single(); if (result.error) throw result.error; after = result.data;
    } else if (input.action === "inventory") {
      const existing = await admin.from("inventory").select("*").eq("id", input.id).single(); if (existing.error) throw existing.error; before = existing.data;
      const next = existing.data.quantity_on_hand + input.adjustment; if (next < existing.data.quantity_reserved || next < 0) return NextResponse.json({ error: "Adjustment would make reserved or on-hand stock invalid." }, { status: 409 });
      const result = await admin.from("inventory").update({ quantity_on_hand: next }).eq("id", input.id).select("*").single(); if (result.error) throw result.error; after = result.data;
      const adjustment = await admin.from("inventory_adjustments").insert({ inventory_id: input.id, delta: input.adjustment, reason: input.reason, actor_id: auth.user.id }); if (adjustment.error) throw adjustment.error;
    } else if (input.action === "order") {
      const existing = await admin.from("orders").select("*").eq("id", input.id).single(); if (existing.error) throw existing.error; before = existing.data;
      if (existing.data.payment_status !== "paid") return NextResponse.json({ error: "Only paid orders can enter fulfilment." }, { status: 409 });
      const transitions: Record<string, string[]> = {
        confirmed: ["confirmed", "crafting"],
        crafting: ["crafting", "ready"],
        ready: ["ready", "shipped"],
        shipped: ["shipped", "delivered"],
        delivered: ["delivered"],
      };
      if (!(transitions[existing.data.status] ?? []).includes(input.status)) {
        return NextResponse.json({ error: "Order status must move through the fulfilment sequence." }, { status: 409 });
      }
      const fulfillment = input.status === "confirmed" ? "unfulfilled" : input.status;
      const result = await admin.from("orders").update({ status: input.status, fulfillment_status: fulfillment }).eq("id", input.id).select("*").single(); if (result.error) throw result.error; after = result.data;
      const history = await admin.from("order_status_history").insert({ order_id: input.id, status: input.status, note: input.note || null, actor_id: auth.user.id }); if (history.error) throw history.error;
    } else if (input.action === "consultation") {
      const existing = await admin.from("consultation_requests").select("*").eq("id", input.id).single(); if (existing.error) throw existing.error; before = existing.data;
      const result = await admin.from("consultation_requests").update({ status: input.status }).eq("id", input.id).select("*").single(); if (result.error) throw result.error; after = result.data;
    } else if (input.action === "content") {
      entityType = "content_blocks"; const existing = await admin.from("content_blocks").select("*").eq("key", input.key).eq("locale", input.locale).maybeSingle(); before = existing.data;
      const result = await admin.from("content_blocks").upsert({ key: input.key, locale: input.locale, title: input.title || null, body: { text: input.text }, status: input.status, published_at: input.status === "published" ? new Date().toISOString() : null }, { onConflict: "key,locale" }).select("*").single(); if (result.error) throw result.error; after = result.data; entityId = result.data.id;
    } else {
      entityType = "translations"; const existing = await admin.from("translations").select("*").eq("namespace", input.namespace).eq("key", input.key).eq("locale", input.locale).maybeSingle(); before = existing.data;
      const result = await admin.from("translations").upsert({ namespace: input.namespace, key: input.key, locale: input.locale, value: input.value, status: input.status }, { onConflict: "namespace,key,locale" }).select("*").single(); if (result.error) throw result.error; after = result.data; entityId = result.data.id;
    }
    const audit = await admin.from("admin_audit_logs").insert({ actor_id: auth.user.id, action: input.action, entity_type: entityType, entity_id: entityId, before_state: before, after_state: after, request_id: request.headers.get("x-vercel-id")?.slice(0, 240) ?? null });
    if (audit.error) throw audit.error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Administrative update failed." }, { status: 500 });
  }
}
