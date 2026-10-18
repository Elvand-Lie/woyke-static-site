import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createClient } from "@supabase/supabase-js";

function environment() {
  const env = {};
  for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("="); env[line.slice(0, i)] = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return env;
}
const env = environment();
const options = { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } };
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, options);
const anonymous = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, options);

test("remote configurator and protected production tables are deployed", async () => {
  const form = await anonymous.from("configurator_forms").select("id,status").eq("slug", "woyke-guided").single();
  assert.ifError(form.error); assert.equal(form.data.status, "published");
  const components = await anonymous.from("configurator_components").select("id", { count: "exact", head: true });
  const optionsResult = await anonymous.from("configurator_options").select("id", { count: "exact", head: true });
  assert.equal(components.count, 71); assert.equal(optionsResult.count, 458);
  const engraving = await anonymous.from("pricing_rules").select("adjustment_minor").eq("name", "Personal engraving").single();
  assert.ifError(engraving.error); assert.equal(engraving.data.adjustment_minor, 5000);
  const consultation = await anonymous.from("consultation_requests").insert({ name: "Blocked", email: "blocked@example.com" }).select("id");
  assert.ok(consultation.error || !consultation.data?.length, "anonymous browser inserted a consultation directly");
  const reservation = await anonymous.from("inventory_reservations").insert({ order_id: crypto.randomUUID(), inventory_id: crypto.randomUUID(), quantity: 1, expires_at: new Date(Date.now() + 60000).toISOString() }).select("id");
  assert.ok(reservation.error || !reservation.data?.length, "anonymous browser inserted an inventory reservation");
});
