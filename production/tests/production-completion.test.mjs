import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const migrations = fs.readdirSync(new URL("../supabase/migrations/", import.meta.url)).filter((file) => file.endsWith(".sql")).sort().map((file) => fs.readFileSync(new URL(file, new URL("../supabase/migrations/", import.meta.url)), "utf8")).join("\n");
const source = (file) => fs.readFileSync(new URL(file, import.meta.url), "utf8");

test("production completion schema includes reservations, consultations and atomic inventory functions", () => {
  for (const table of ["inventory_reservations", "consultation_requests"]) {
    assert.match(migrations, new RegExp(`create table if not exists public\\.${table}`));
    assert.match(migrations, new RegExp(`alter table public\\.${table} enable row level security`));
  }
  for (const fn of ["reserve_order_inventory", "release_order_inventory", "consume_order_inventory", "release_expired_inventory_reservations"]) {
    assert.match(migrations, new RegExp(`function public\\.${fn}`));
    assert.match(migrations, new RegExp(`grant execute on function public\\.${fn}`));
  }
});

test("checkout prices and validates on the server and webhook processing is idempotent", () => {
  assert.match(source("../lib/orders.ts"), /validateAndPriceConfiguration/);
  assert.match(source("../lib/orders.ts"), /reserve_order_inventory/);
  assert.match(source("../app/api/stripe/webhook/route.ts"), /constructEvent/);
  assert.match(source("../app/api/stripe/webhook/route.ts"), /23505/);
  assert.match(source("../app/api/stripe/webhook/route.ts"), /markOrderPaid/);
});

test("static rollback is preserved while production routes no longer redirect to it", () => {
  assert.doesNotMatch(source("../next.config.ts"), /woyke-static-site/);
  for (const route of ["design/page.tsx", "checkout/page.tsx", "consultation/page.tsx", "craft/page.tsx", "materials/page.tsx"]) {
    assert.ok(fs.existsSync(new URL(`../app/${route}`, import.meta.url)), `${route} is missing`);
  }
});

test("customer journeys retain active-cart, duplicate, consultation-context and phone-verification contracts", () => {
  assert.match(source("../app/cart/page.tsx"), /from\("carts"\)[\s\S]*\.eq\("status", "active"\)/);
  assert.match(source("../app/api/account/cart/route.ts"), /clear: z\.literal\(true\)/);
  assert.match(source("../app/api/account/designs/[id]/route.ts"), /export async function POST/);
  assert.match(source("../app/api/consultations/route.ts"), /consultationReference/);
  assert.match(migrations, /add column if not exists saved_design_id/);
  assert.match(source("../app/account/actions.ts"), /type: "phone_change"/);
});
test("admin media uses secure Cloudinary signatures and audited database records", () => {
  const route = source("../app/api/admin/media/route.ts");
  assert.match(route, /CLOUDINARY_API_SECRET/);
  assert.match(route, /createHash\("sha1"\)/);
  assert.match(route, /roles\.includes\("admin"\)/);
  assert.match(route, /admin_audit_logs/);
  assert.match(source("../components/admin-media-upload.tsx"), /secure_url/);
});
test("admin-capable customer routes still scope personal data to the signed-in owner", () => {
  assert.match(source("../app/account/page.tsx"), /orders[^\n]+owner_id/);
  assert.match(source("../app/account/orders/page.tsx"), /eq\("owner_id", user\.id\)/);
  assert.match(source("../app/account/orders/[id]/page.tsx"), /eq\("owner_id", user\.id\)/);
  assert.match(source("../app/cart/page.tsx"), /eq\("owner_id", auth\.user\.id\)/);
  assert.match(source("../app/checkout/page.tsx"), /eq\("owner_id", user\.id\)/);
  assert.match(source("../app/account/actions.ts"), /eq\("user_id", user\.id\)/);
});
test("editorial video studies are placed honestly and respect motion preferences", () => {
  assert.match(source("../app/design/page.tsx"), /pear-ring-showcase\.mp4/);
  assert.match(source("../app/design/page.tsx"), /REPRESENTATIVE OBJECT STUDY/);
  assert.match(source("../app/legacy-materials.html"), /hero-video\.mp4/);
  assert.match(source("../app/legacy-materials.html"), /not a claim about a specific catalogue piece/);
  assert.match(source("../components/site-chrome.tsx"), /prefers-reduced-motion/);
  assert.match(source("../components/site-chrome.tsx"), /videoObserver/);
  assert.ok(fs.existsSync(new URL("../public/assets/media/posters/atelier-setting-vertical.jpg", import.meta.url)));
});
test("complete catalogue, uncropped media and restored consultation presentation remain in production", () => {
  assert.match(migrations, /metadata ->> 'seedStatus' = 'provisional'/);
  assert.doesNotMatch(source("../app/shop/page.tsx"), /index === 0 \? "featured"/);
  assert.match(source("../app/legacy.css"), /\.craft-card video \{[^}]*object-fit: contain/);
  assert.match(source("../app/legacy.css"), /\.craft-card \{[^}]*color: var\(--ivory\)/);
  assert.match(source("../app/consultation/page.tsx"), /consultation-hero-v3/);
  assert.match(source("../app/consultation/page.tsx"), /A conversation/);
  assert.match(source("../components/consultation-form.tsx"), /consultation-request-form/);
  assert.doesNotMatch(source("../components/consultation-form.tsx"), /Provider delivery remains disabled/);
});