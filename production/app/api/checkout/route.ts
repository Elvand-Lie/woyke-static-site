import { NextResponse } from "next/server";
import { createCheckout } from "@/lib/orders";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const checkout = await createCheckout(user.id, user.email, await request.json());
    return NextResponse.json(checkout);
  } catch (error) {
    const code = error instanceof Error ? error.message.split(":")[0] : "CHECKOUT_FAILED";
    const status = ["EMPTY_CART", "OUT_OF_STOCK", "INVALID_CONFIGURATION"].includes(code) ? 409 : 500;
    return NextResponse.json({ error: code }, { status });
  }
}
