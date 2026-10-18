import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Context = { params: Promise<{ id: string }> };
async function context() { const supabase = await createServerSupabaseClient(); return (await supabase.auth.getUser()).data.user; }
export async function GET(_: Request, { params }: Context) { const user = await context(); if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 }); const { id } = await params; const admin = createAdminSupabaseClient(); const result = await admin.from("saved_designs").select("id,name,preview,public_snapshot,is_public,share_token,revoked_at,created_at").eq("id", id).eq("owner_id", user.id).maybeSingle(); if (result.error || !result.data) return NextResponse.json({ error: "Design not found." }, { status: 404 }); return NextResponse.json(result.data); }
export async function POST(_: Request, { params }: Context) {
  const user = await context(); if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params; const admin = createAdminSupabaseClient();
  const source = await admin.from("saved_designs").select("product_id,name,currency,indicative_total_minor,preview,public_snapshot").eq("id", id).eq("owner_id", user.id).maybeSingle();
  if (source.error || !source.data) return NextResponse.json({ error: "Design not found." }, { status: 404 });
  const created = await admin.from("saved_designs").insert({ ...source.data, owner_id: user.id, name: `${source.data.name} copy`, is_public: false, revoked_at: null }).select("id").single();
  if (created.error) return NextResponse.json({ error: "Design could not be duplicated." }, { status: 500 });
  const selections = await admin.from("saved_design_selections").select("component_slug,option_value,value_json,price_delta_minor").eq("saved_design_id", id);
  if (selections.error) { await admin.from("saved_designs").delete().eq("id", created.data.id); return NextResponse.json({ error: "Design could not be duplicated." }, { status: 500 }); }
  if (selections.data?.length) {
    const copied = await admin.from("saved_design_selections").insert(selections.data.map((selection) => ({ ...selection, saved_design_id: created.data.id })));
    if (copied.error) { await admin.from("saved_designs").delete().eq("id", created.data.id); return NextResponse.json({ error: "Design could not be duplicated." }, { status: 500 }); }
  }
  return NextResponse.json({ id: created.data.id });
}
export async function PATCH(request: Request, { params }: Context) { const user = await context(); if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 }); const parsed = z.object({ isPublic: z.boolean() }).safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid sharing update." }, { status: 400 }); const { id } = await params; const admin = createAdminSupabaseClient(); const result = await admin.from("saved_designs").update({ is_public: parsed.data.isPublic, revoked_at: parsed.data.isPublic ? null : new Date().toISOString() }).eq("id", id).eq("owner_id", user.id).select("share_token,is_public").maybeSingle(); if (result.error || !result.data) return NextResponse.json({ error: "Design not found." }, { status: 404 }); return NextResponse.json({ ...result.data, url: result.data.is_public ? `/share/${result.data.share_token}` : null }); }
export async function DELETE(_: Request, { params }: Context) { const user = await context(); if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 }); const { id } = await params; const admin = createAdminSupabaseClient(); const { data, error } = await admin.from("saved_designs").delete().eq("id", id).eq("owner_id", user.id).select("id"); if (error || !data?.length) return NextResponse.json({ error: "Design not found." }, { status: 404 }); return NextResponse.json({ ok: true }); }