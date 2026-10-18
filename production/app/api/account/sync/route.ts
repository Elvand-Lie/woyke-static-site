import { NextResponse } from "next/server";
import { syncCustomerState, syncPayloadSchema } from "@/lib/customer-persistence";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const raw = await request.text();
  if (raw.length > 1_000_000) return NextResponse.json({ error: "Payload is too large." }, { status: 413 });
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const payload = syncPayloadSchema.safeParse(parsed);
  if (!payload.success) return NextResponse.json({ error: "Invalid synchronization payload." }, { status: 400 });
  try { return NextResponse.json(await syncCustomerState(user.id, payload.data)); }
  catch { return NextResponse.json({ error: "Synchronization failed." }, { status: 500 }); }
}