import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getServerEnvironment } from "@/lib/env/server";
import { cancelPendingOrder, markOrderPaid } from "@/lib/orders";
import { getStripeClient } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = getServerEnvironment().STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret is not configured." }, { status: 503 });
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripeClient().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  const admin = createAdminSupabaseClient();
  const recorded = await admin.from("stripe_event_records").insert({
    stripe_event_id: event.id,
    event_type: event.type,
    payload: event,
    processing_status: "received",
    attempts: 1,
  }).select("id").single();
  if (recorded.error?.code === "23505") return NextResponse.json({ received: true, duplicate: true });
  if (recorded.error) return NextResponse.json({ error: "Unable to record event." }, { status: 500 });

  try {
    if (event.type.startsWith("checkout.session.")) {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;
      if (orderId && (
        event.type === "checkout.session.async_payment_succeeded"
        || (event.type === "checkout.session.completed" && session.payment_status === "paid")
      )) {
        await markOrderPaid(orderId, typeof session.payment_intent === "string" ? session.payment_intent : null);
      } else if (orderId && ["checkout.session.expired", "checkout.session.async_payment_failed"].includes(event.type)) {
        await cancelPendingOrder(orderId, `Stripe event: ${event.type}`);
      }
    }
    await admin.from("stripe_event_records").update({
      processing_status: "processed",
      processed_at: new Date().toISOString(),
    }).eq("id", recorded.data.id);
  } catch (error) {
    await admin.from("stripe_event_records").update({
      processing_status: "failed",
      last_error: error instanceof Error ? error.message.slice(0, 500) : "Unknown processing error",
    }).eq("id", recorded.data.id);
    return NextResponse.json({ error: "Event processing failed." }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
