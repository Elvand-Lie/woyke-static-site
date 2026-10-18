import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const directory = new URL("../supabase/migrations/", import.meta.url);
const schema = fs.readdirSync(directory).filter((file) => file.endsWith(".sql")).sort().map((file) => fs.readFileSync(new URL(file, directory), "utf8")).join("\n");

const tables = ["profiles","roles","customer_addresses","categories","products","product_media","skus","inventory","inventory_adjustments","configurator_forms","configurator_components","configurator_options","valid_option_combinations","pricing_rules","saved_designs","saved_design_selections","carts","cart_items","orders","order_items","order_configuration_snapshots","payments","stripe_event_records","order_status_history","admin_audit_logs","content_blocks","translations"];

test("schema contains every required production table and RLS boundary", () => { for (const table of tables) { assert.match(schema, new RegExp(`create table public\\.${table} \\(`)); assert.match(schema, new RegExp(`alter table public\\.${table} enable row level security;`)); } });
test("customer roles cannot write protected commerce state directly", () => { for (const table of ["payments","orders","inventory","admin_audit_logs","pricing_rules"]) assert.doesNotMatch(schema, new RegExp(`create policy .* on public\\.${table}\\s+for (insert|update|all)`, "i")); assert.match(schema, /stripe_event_id text not null unique/); });
test("Milestone 2 synchronization is idempotent and sharing is sanitized", () => { assert.match(schema, /add column client_sync_id text/); assert.match(schema, /saved_designs_owner_client_sync_idx[\s\S]*owner_id, client_sync_id/); assert.match(schema, /returns table \(\s*id uuid,\s*name text,\s*public_snapshot jsonb,/); });