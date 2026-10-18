import { NextResponse } from "next/server";
import { clientItemSchema, saveCustomerDesign } from "@/lib/customer-persistence";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const parsed = clientItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid design." }, { status: 400 });
  try { const result = await saveCustomerDesign(user.id, parsed.data); return NextResponse.json({ id: result.id, shareToken: result.shareToken }); }
  catch (error) { const code = error instanceof Error ? error.message.split(":")[0] : "SAVE_FAILED"; return NextResponse.json({ error: code }, { status: code === "SAVE_FAILED" ? 500 : 409 }); }
}
