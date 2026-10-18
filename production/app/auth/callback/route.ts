import { NextResponse } from "next/server";
import { safeReturnPath } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnTo = safeReturnPath(url.searchParams.get("return"));
  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(returnTo, url.origin));
  }
  return NextResponse.redirect(new URL("/auth?error=Unable+to+confirm+this+account.", url.origin));
}