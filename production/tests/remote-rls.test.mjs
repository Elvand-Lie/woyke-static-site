import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function loadEnvironment() {
  const source = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
  const env = {};
  for (const line of source.split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    env[line.slice(0, index)] = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return env;
}

const env = loadEnvironment();
const options = { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } };
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, options);
const anonymous = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, options);
const createdUsers = [];
const createdOrders = [];
let createdPayment;
let createdDesign;
let createdAddress;
let createdCart;
let pricingRule;
let stripeRecord;

async function makeUser(role = "customer") {
  const suffix = randomUUID();
  const email = `codex-${suffix}@example.com`;
  const password = `Woyke!${suffix}Aa1`;
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: "WOYKE test account" } });
  assert.ifError(error);
  createdUsers.push(data.user.id);
  if (role === "admin") {
    const grant = await admin.from("roles").insert({ user_id: data.user.id, role: "admin" });
    assert.ifError(grant.error);
  }
  const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, options);
  const signedIn = await client.auth.signInWithPassword({ email, password });
  assert.ifError(signedIn.error);
  return { id: data.user.id, client };
}

async function cleanup() {
  if (createdPayment) await admin.from("payments").delete().eq("id", createdPayment);
  if (createdOrders.length) await admin.from("orders").delete().in("id", createdOrders);
  if (stripeRecord) await admin.from("stripe_event_records").delete().eq("id", stripeRecord);
  if (pricingRule) await admin.from("pricing_rules").delete().eq("id", pricingRule);
  if (createdDesign) await admin.from("saved_designs").delete().eq("id", createdDesign);
  if (createdAddress) await admin.from("customer_addresses").delete().eq("id", createdAddress);
  if (createdCart) await admin.from("carts").delete().eq("id", createdCart);
  for (const id of createdUsers.reverse()) await admin.auth.admin.deleteUser(id);
}

function assertBlocked(result, message) {
  assert.ok(result.error || !result.data?.length, message);
}

test("remote Supabase RLS and ownership boundaries", async () => {
  try {
    const [customerA, customerB, adminUser] = await Promise.all([makeUser(), makeUser(), makeUser("admin")]);
    const productResult = await admin.from("products").select("id,slug").eq("status", "published").limit(1).single();
    assert.ifError(productResult.error);
    const product = productResult.data;

    const anonProducts = await anonymous.from("products").select("id");
    assert.ifError(anonProducts.error);
    assert.equal(anonProducts.data.length, 25);
    const anonProfiles = await anonymous.from("profiles").select("id");
    assert.equal(anonProfiles.data?.length ?? 0, 0);

    const address = await customerA.client.from("customer_addresses").insert({ user_id: customerA.id, recipient_name: "Test A", address_line_1: "1 Test Street", city: "Singapore", postal_code: "018989" }).select("id,label,updated_at").single();
    assert.ifError(address.error); createdAddress = address.data.id;
    const design = await customerA.client.from("saved_designs").insert({ owner_id: customerA.id, product_id: product.id, name: "Private test design", public_snapshot: { productName: "Shared study", selections: { stone: "jade" } }, is_public: true }).select("id,share_token").single();
    assert.ifError(design.error); createdDesign = design.data.id;
    const cart = await customerA.client.from("carts").insert({ owner_id: customerA.id }).select("id").single();
    assert.ifError(cart.error); createdCart = cart.data.id;

    for (const [table, ownerColumn] of [["profiles", "id"], ["customer_addresses", "user_id"], ["saved_designs", "owner_id"], ["carts", "owner_id"]]) {
      const result = await customerB.client.from(table).select("*").eq(ownerColumn, customerA.id);
      assert.ifError(result.error);
      assert.equal(result.data.length, 0, `${table} leaked across customers`);
    }

    const addressChange = await customerB.client.from("customer_addresses").update({ label: "Changed" }).eq("id", createdAddress).select("id");
    assertBlocked(addressChange, "different customer modified an address");
    const profileChange = await customerB.client.from("profiles").update({ display_name: "Changed" }).eq("id", customerA.id).select("id");
    assertBlocked(profileChange, "different customer modified a profile");
    const designDelete = await customerB.client.from("saved_designs").delete().eq("id", createdDesign).select("id");
    assertBlocked(designDelete, "different customer deleted a design");
    const cartChange = await customerB.client.from("carts").update({ status: "abandoned" }).eq("id", createdCart).select("id");
    assertBlocked(cartChange, "different customer modified a cart");

    for (const owner of [customerA.id, customerB.id]) {
      const order = await admin.from("orders").insert({ reference: `TEST-${randomUUID()}`, owner_id: owner, status: "payment_pending", payment_status: "pending", fulfillment_status: "unfulfilled", subtotal_minor: 100000, total_minor: 100000, shipping_address_snapshot: {}, customer_snapshot: {} }).select("id").single();
      assert.ifError(order.error); createdOrders.push(order.data.id);
    }
    const otherOrders = await customerB.client.from("orders").select("id").eq("owner_id", customerA.id);
    assert.ifError(otherOrders.error); assert.equal(otherOrders.data.length, 0);
    const orderChange = await customerA.client.from("orders").update({ fulfillment_status: "shipped" }).eq("id", createdOrders[0]).select("id");
    assertBlocked(orderChange, "browser modified fulfilment state");

    const payment = await admin.from("payments").insert({ order_id: createdOrders[0], status: "pending", amount_minor: 100000 }).select("id,status").single();
    assert.ifError(payment.error); createdPayment = payment.data.id;
    assertBlocked(await customerA.client.from("payments").update({ status: "succeeded" }).eq("id", createdPayment).select("id"), "browser modified payment state");

    const inventory = await admin.from("inventory").select("id,quantity_on_hand").limit(1).single();
    assert.ifError(inventory.error);
    assertBlocked(await customerA.client.from("inventory").update({ quantity_on_hand: inventory.data.quantity_on_hand + 1 }).eq("id", inventory.data.id).select("id"), "browser modified inventory");
    assertBlocked(await customerA.client.from("admin_audit_logs").insert({ actor_id: customerA.id, action: "forbidden", entity_type: "test" }).select("id"), "browser inserted an audit record");
    const form = await admin.from("configurator_forms").select("id").limit(1).single(); assert.ifError(form.error);
    const rule = await admin.from("pricing_rules").insert({ form_id: form.data.id, name: `test-${randomUUID()}`, condition_rule: {}, adjustment_minor: 1 }).select("id").single(); assert.ifError(rule.error); pricingRule = rule.data.id;
    assertBlocked(await customerA.client.from("pricing_rules").update({ adjustment_minor: 999 }).eq("id", pricingRule).select("id"), "browser modified pricing rules");

    const adminProfiles = await adminUser.client.from("profiles").select("id").in("id", [customerA.id, customerB.id]); assert.ifError(adminProfiles.error); assert.equal(adminProfiles.data.length, 2);
    const adminOrders = await adminUser.client.from("orders").select("id").in("id", createdOrders); assert.ifError(adminOrders.error); assert.equal(adminOrders.data.length, 2);
    assertBlocked(await adminUser.client.from("inventory").update({ quantity_on_hand: inventory.data.quantity_on_hand + 1 }).eq("id", inventory.data.id).select("id"), "admin browser bypassed server-only writes");
    const serviceProfiles = await admin.from("profiles").select("id").in("id", [customerA.id, customerB.id, adminUser.id]); assert.ifError(serviceProfiles.error); assert.equal(serviceProfiles.data.length, 3);

    const shared = await anonymous.rpc("get_shared_design", { token: design.data.share_token }); assert.ifError(shared.error); assert.equal(shared.data.length, 1); assert.deepEqual(Object.keys(shared.data[0]).sort(), ["created_at", "id", "name", "public_snapshot", "updated_at"]);

    const stripeId = `evt_test_${randomUUID()}`;
    const stripe = await admin.from("stripe_event_records").insert({ stripe_event_id: stripeId, event_type: "test", payload: {} }).select("id").single(); assert.ifError(stripe.error); stripeRecord = stripe.data.id;
    const duplicateStripe = await admin.from("stripe_event_records").insert({ stripe_event_id: stripeId, event_type: "test", payload: {} }); assert.ok(duplicateStripe.error, "duplicate Stripe event was accepted");

    const before = address.data.updated_at;
    const updated = await customerA.client.from("customer_addresses").update({ label: "Updated" }).eq("id", createdAddress).select("updated_at").single(); assert.ifError(updated.error); assert.notEqual(updated.data.updated_at, before);
  } finally { await cleanup(); }
});