import { NextResponse } from "next/server";
import { z } from "zod";
import { clientItemSchema, upsertCartLines } from "@/lib/customer-persistence";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function owner() { const supabase = await createServerSupabaseClient(); return (await supabase.auth.getUser()).data.user; }
const itemSchema = z.object({ itemId: z.string().uuid(), quantity: z.number().int().min(1).max(10).optional() });
const deleteSchema = z.union([itemSchema, z.object({ clear: z.literal(true) })]);

export async function POST(request: Request) {
  const user = await owner(); if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = clientItemSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
  try { await upsertCartLines(user.id, [parsed.data]); return NextResponse.json({ ok: true }); }
  catch (error) { const code = error instanceof Error ? error.message.split(":")[0] : "CART_UPDATE_FAILED"; return NextResponse.json({ error: code }, { status: code === "CART_UPDATE_FAILED" ? 500 : 409 }); }
}

export async function PATCH(request: Request) {
  const user = await owner(); if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = itemSchema.required({ quantity: true }).safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid cart update." }, { status: 400 });
  const admin = createAdminSupabaseClient(); const owned = await admin.from("cart_items").select("id,carts!inner(owner_id)").eq("id", parsed.data.itemId).eq("carts.owner_id", user.id).maybeSingle();
  if (owned.error || !owned.data) return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
  const { error } = await admin.from("cart_items").update({ quantity: parsed.data.quantity }).eq("id", parsed.data.itemId); if (error) return NextResponse.json({ error: "Unable to update cart." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await owner(); if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = deleteSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
  const admin = createAdminSupabaseClient();
  if ("clear" in parsed.data) {
    const cart = await admin.from("carts").select("id").eq("owner_id", user.id).eq("status", "active").maybeSingle();
    if (cart.error) return NextResponse.json({ error: "Unable to find the active cart." }, { status: 500 });
    if (cart.data) { const cleared = await admin.from("cart_items").delete().eq("cart_id", cart.data.id); if (cleared.error) return NextResponse.json({ error: "Unable to clear the cart." }, { status: 500 }); }
    return NextResponse.json({ ok: true });
  }
  const owned = await admin.from("cart_items").select("id,carts!inner(owner_id)").eq("id", parsed.data.itemId).eq("carts.owner_id", user.id).maybeSingle();
  if (owned.error || !owned.data) return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
  const { error } = await admin.from("cart_items").delete().eq("id", parsed.data.itemId); if (error) return NextResponse.json({ error: "Unable to remove item." }, { status: 500 });
  return NextResponse.json({ ok: true });
}