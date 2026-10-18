import "server-only";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { publicEnvironment } from "@/lib/env/public";
import { validateAndPriceConfiguration } from "@/lib/configurator";
import { getStripeClient } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const checkoutInputSchema = z.object({
  recipientName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  addressLine1: z.string().trim().min(3).max(160),
  addressLine2: z.string().trim().max(160).default(""),
  city: z.string().trim().min(2).max(80).default("Singapore"),
  region: z.string().trim().max(80).default("Singapore"),
  postalCode: z.string().trim().min(4).max(12),
  countryCode: z.string().trim().length(2).default("SG"),
  saveAddress: z.boolean().default(false),
});

function reference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `WY-${date}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

type CartRow = {
  id: string;
  cart_id: string;
  quantity: number;
  configuration_snapshot: Record<string, unknown>;
  products: { slug: string } | { slug: string }[];
};

export async function createCheckout(ownerId: string, email: string, raw: unknown) {
  const input = checkoutInputSchema.parse(raw);
  const admin = createAdminSupabaseClient();
  await admin.rpc("release_expired_inventory_reservations");
  const [{ data: cart, error: cartError }, { data: profile }] = await Promise.all([
    admin.from("carts").select("id,cart_items(id,cart_id,quantity,configuration_snapshot,products!inner(slug))")
      .eq("owner_id", ownerId).eq("status", "active").single(),
    admin.from("profiles").select("display_name,email,phone").eq("id", ownerId).single(),
  ]);
  if (cartError || !cart || !cart.cart_items?.length) throw new Error("EMPTY_CART");

  const priced = [];
  for (const row of cart.cart_items as unknown as CartRow[]) {
    const product = Array.isArray(row.products) ? row.products[0] : row.products;
    const snapshot = row.configuration_snapshot ?? {};
    const quote = await validateAndPriceConfiguration({
      productSlug: product.slug,
      selections: snapshot.selections ?? {},
      selectionLabels: snapshot.selectionLabels ?? {},
      engraving: snapshot.engraving ?? null,
      gift: snapshot.gift ?? null,
      preview: snapshot.preview ?? {},
    });
    if (quote.sku.available < row.quantity) throw new Error("OUT_OF_STOCK");
    priced.push({ row, quote });
  }

  const subtotal = priced.reduce((sum, item) => sum + item.quote.totalMinor * item.row.quantity, 0);
  const address = {
    recipientName: input.recipientName,
    phone: input.phone,
    addressLine1: input.addressLine1,
    addressLine2: input.addressLine2 || null,
    city: input.city,
    region: input.region,
    postalCode: input.postalCode,
    countryCode: input.countryCode.toUpperCase(),
  };
  const orderValues = {
    reference: reference(),
    owner_id: ownerId,
    cart_id: cart.id,
    subtotal_minor: subtotal,
    total_minor: subtotal,
    currency: "SGD",
    shipping_address_snapshot: address,
    customer_snapshot: {
      displayName: profile?.display_name ?? input.recipientName,
      email: profile?.email ?? email,
      phone: profile?.phone ?? input.phone,
    },
  };
  const orderResult = await admin.from("orders").insert(orderValues).select("id,reference").single();
  if (orderResult.error) throw orderResult.error;
  const order = orderResult.data;

  try {
    for (const item of priced) {
      const q = item.quote;
      const inserted = await admin.from("order_items").insert({
        order_id: order.id,
        product_id: q.product.id,
        sku_id: q.sku.id,
        product_name: q.name,
        sku_code: q.sku.code,
        quantity: item.row.quantity,
        unit_price_minor: q.totalMinor,
        line_total_minor: q.totalMinor * item.row.quantity,
        product_snapshot: {
          slug: q.product.slug,
          name: q.product.name,
          configuredName: q.name,
          inventoryFixture: q.inventoryFixture,
        },
      }).select("id").single();
      if (inserted.error) throw inserted.error;
      const snapshot = item.row.configuration_snapshot ?? {};
      const detail = await admin.from("order_configuration_snapshots").insert({
        order_item_id: inserted.data.id,
        selections: q.input.selections,
        pricing_breakdown: {
          currency: q.currency,
          basePriceMinor: q.basePriceMinor,
          adjustments: q.adjustments,
          totalMinor: q.totalMinor,
          formVersion: q.form.version,
        },
        preview: snapshot.preview ?? {},
      });
      if (detail.error) throw detail.error;
    }
    const payment = await admin.from("payments").insert({
      order_id: order.id,
      status: "pending",
      amount_minor: subtotal,
      currency: "SGD",
    });
    if (payment.error) throw payment.error;
    const reservation = await admin.rpc("reserve_order_inventory", { target_order_id: order.id, reservation_minutes: 30 });
    if (reservation.error) throw reservation.error;

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      success_url: `${publicEnvironment.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${publicEnvironment.NEXT_PUBLIC_APP_URL}/checkout?cancelled=1`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
      locale: "en",
      line_items: priced.map(({ row, quote }) => ({
        quantity: row.quantity,
        price_data: {
          currency: quote.currency.toLowerCase(),
          unit_amount: quote.totalMinor,
          product_data: {
            name: quote.name,
            description: `WOYKE ${quote.product.name}`,
            metadata: { product_slug: quote.product.slug, sku: quote.sku.code },
          },
        },
      })),
      metadata: { order_id: order.id, order_reference: order.reference, owner_id: ownerId },
      payment_intent_data: { metadata: { order_id: order.id, order_reference: order.reference } },
    });
    const updated = await admin.from("orders").update({ checkout_session_id: session.id }).eq("id", order.id);
    if (updated.error) throw updated.error;
    await admin.from("payments").update({ provider_payment_id: session.id }).eq("order_id", order.id);
    if (input.saveAddress) {
      await admin.from("customer_addresses").insert({
        user_id: ownerId,
        recipient_name: input.recipientName,
        phone: input.phone,
        address_line_1: input.addressLine1,
        address_line_2: input.addressLine2 || null,
        city: input.city,
        region: input.region,
        postal_code: input.postalCode,
        country_code: input.countryCode.toUpperCase(),
      });
    }
    return { orderId: order.id, reference: order.reference, url: session.url };
  } catch (error) {
    await admin.rpc("release_order_inventory", { target_order_id: order.id });
    await admin.from("orders").update({ status: "cancelled", payment_status: "failed" }).eq("id", order.id);
    throw error;
  }
}

export async function markOrderPaid(orderId: string, paymentIntentId: string | null) {
  const admin = createAdminSupabaseClient();
  const { data: order, error } = await admin.from("orders").select("id,cart_id,payment_status").eq("id", orderId).single();
  if (error || !order) throw new Error("ORDER_NOT_FOUND");
  if (order.payment_status === "paid") return;
  const consumed = await admin.rpc("consume_order_inventory", { target_order_id: orderId });
  if (consumed.error) throw consumed.error;
  await admin.from("orders").update({ status: "confirmed", payment_status: "paid" }).eq("id", orderId);
  await admin.from("payments").update({
    status: "succeeded",
    provider_payment_id: paymentIntentId ?? undefined,
    paid_at: new Date().toISOString(),
  }).eq("order_id", orderId);
  await admin.from("order_status_history").insert({ order_id: orderId, status: "confirmed", note: "Stripe payment confirmed." });
  if (order.cart_id) await admin.from("carts").update({ status: "converted" }).eq("id", order.cart_id);
}

export async function cancelPendingOrder(orderId: string, note: string) {
  const admin = createAdminSupabaseClient();
  const { data: order } = await admin.from("orders").select("payment_status").eq("id", orderId).single();
  if (!order || order.payment_status === "paid") return;
  await admin.rpc("release_order_inventory", { target_order_id: orderId });
  await admin.from("orders").update({ status: "cancelled", payment_status: "cancelled", fulfillment_status: "cancelled" }).eq("id", orderId);
  await admin.from("payments").update({ status: "cancelled" }).eq("order_id", orderId);
  await admin.from("order_status_history").insert({ order_id: orderId, status: "cancelled", note });
}
