# Production milestone 2 handoff

## Outcome

The development Supabase project now runs the WOYKE schema and seed. The isolated Next application under `production/` has database-backed catalogue/product routes, Supabase email/password sessions, protected customer/admin routes, authenticated carts, saved designs, and duplicate-safe anonymous state synchronization. It is deployed separately at `https://woyke-production.vercel.app`; the existing static Vercel application remains the public rollback target and was not replaced or redeployed.

Stripe checkout and webhooks were intentionally not started.

## Migrations applied

- `202607280001_initial_schema.sql` — 27 production tables, constraints, indexes, triggers, functions, RLS and policies.
- `202607280002_static_seed.sql` — deterministic provisional catalogue/configurator seed.
- `202607300001_milestone_2_catalogue_sync.sql` — saved-design synchronization key and initial interest-catalogue publication delta.
- `202607300002_sync_constraint.sql` — conflict-safe `(owner_id, client_sync_id)` index.
- `202607300003_publish_interest_catalogue.sql` — exact generated slugs for the five authorized provisional products.
- `202607300004_fix_category_names.sql` — corrected category labels after the seed audit exposed object serialization.

No database reset, destructive schema reset or existing-data wipe was used.

## Remote schema and seed audit

- Migration records: 6
- Public tables: 27
- Foreign keys: 31
- Unique constraints: 23
- Indexes: 70
- RLS-enabled tables: 27
- `updated_at` triggers: 27
- RLS policies: 30
- Categories: 9
- Products: 25 total / 5 provisionally published
- Product media: 50
- SKUs: 25, still inactive
- Inventory records: 25, still zero stock
- Configurator components: 71
- Configurator options: 458
- Valid-option rules: 6
- Draft translations: 1,013

The five published interest-test products are Imperial Jade Bloom Ring, Jade Cabochon Statement Ring, Celestial Diamond Floral Ring, Cushion Brilliance Ring and Emerald Accent Marquise Ring.

## Remote RLS results

The real-project test created temporary anonymous/customer/customer/admin contexts and cleaned them up after execution.

- Anonymous users can read only published catalogue data and the sanitized shared-design function.
- Customer A can read/write only Customer A profile, addresses, saved designs and cart.
- Customer B cannot read or modify Customer A profile, addresses, saved designs, cart or orders.
- Browser sessions cannot modify inventory, payments, fulfilment status, audit logs or pricing rules.
- Authenticated admin browser roles can read authorized customer/order data but cannot bypass server-only write boundaries.
- Service-role context can perform the administrative reads required by the protected admin route.
- Duplicate Stripe event IDs are rejected by the remote unique constraint.
- Shared-design RPC output contains only `id`, `name`, `public_snapshot`, `created_at` and `updated_at`.
- Remote timestamp trigger behavior passed.

## Routes connected to Supabase

- `/shop`
- `/product/[slug]`
- `/product?product=<slug>` compatibility redirect
- `/api/catalogue`
- `/auth`
- `/auth/register`
- `/auth/callback`
- `/account`
- `/account/designs`
- `/cart`
- `/admin`
- `/api/account/sync`
- `/api/account/cart`
- `/api/account/designs`
- `/api/account/designs/[id]`

Unmigrated design, craft, materials, consultation and checkout routes temporarily redirect to the current static rollback deployment.

## Authentication and persistence

- Supabase cookie-session refresh proxy implemented.
- Email/password registration, login and logout implemented.
- Customer and admin route guards implemented server-side.
- New Auth users receive a profile and customer role from the database trigger.
- Development customer/admin creation script added; it reads credentials only from process environment variables.
- Anonymous cart and saved-design documents remain in versioned local storage.
- On any protected account route after login, anonymous records synchronize to Supabase and are cleared locally only after success.
- Saved designs use `(owner_id, client_sync_id)` idempotency.
- Cart lines use `(cart_id, configuration_fingerprint)` idempotency.
- Product identity and prices are re-read from published database records; client-supplied price values are ignored.
- Ownership is established from the verified Supabase user on server routes, never from request payloads.

## Admin foundation

`/admin` verifies the admin role before using server-only Supabase access. It provides minimal read views for products, inventory, customers and orders. No browser admin mutation UI was added.

## Changed files

### Repository documentation

- `docs/STATUS.md`
- `docs/CLIENT_DEPENDENCIES.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/SECURITY_MODEL.md`
- `docs/SUPABASE_SETUP.md`
- `docs/TESTING.md`
- `docs/PRODUCTION_MILESTONE_2_HANDOFF.md`

### Production configuration and shared runtime

- `production/package.json`
- `production/next.config.ts`
- `production/proxy.ts`
- `production/app/globals.css`
- `production/app/layout.tsx`
- `production/components/site-chrome.tsx`
- `production/lib/env/server.ts`
- `production/lib/supabase/admin.ts`
- `production/lib/auth.ts`
- `production/lib/catalogue.ts`
- `production/lib/customer-persistence.ts`

### Catalogue and product application

- `production/app/shop/page.tsx`
- `production/app/product/page.tsx`
- `production/app/product/[slug]/page.tsx`
- `production/app/api/catalogue/route.ts`
- `production/components/add-to-cart-button.tsx`

### Authentication, account and administration

- `production/app/auth/actions.ts`
- `production/app/auth/page.tsx`
- `production/app/auth/register/page.tsx`
- `production/app/auth/callback/route.ts`
- `production/app/account/layout.tsx`
- `production/app/account/page.tsx`
- `production/app/account/designs/page.tsx`
- `production/app/admin/page.tsx`
- `production/scripts/create-dev-account.mjs`

### Cart, saved designs and synchronization

- `production/app/cart/page.tsx`
- `production/app/api/account/cart/route.ts`
- `production/app/api/account/sync/route.ts`
- `production/app/api/account/designs/route.ts`
- `production/app/api/account/designs/[id]/route.ts`
- `production/components/anonymous-state-sync.tsx`
- `production/components/cart-view.tsx`
- `production/components/saved-design-actions.tsx`

### Migrations, seed generation and tests

- `production/supabase/migrations/202607280002_static_seed.sql`
- `production/supabase/migrations/202607300001_milestone_2_catalogue_sync.sql`
- `production/supabase/migrations/202607300002_sync_constraint.sql`
- `production/supabase/migrations/202607300003_publish_interest_catalogue.sql`
- `production/supabase/migrations/202607300004_fix_category_names.sql`
- `production/scripts/generate-supabase-seed.mjs`
- `production/tests/environment.test.mjs`
- `production/tests/schema.test.mjs`
- `production/tests/remote-rls.test.mjs`

### Product media copied into the isolated Next public root

- `production/public/assets/media/images/hero-model.webp`
- `production/public/assets/media/images/jade-dark.webp`
- `production/public/assets/media/images/jade-final-hand.webp`
- `production/public/assets/media/images/jade-final-statement.webp`
- `production/public/assets/media/images/jade-initial-hand.webp`
- `production/public/images/Angklet/angklet.png`
- `production/public/images/Angklet/angklet-gold.png`
- `production/public/images/Bangle/bangle.png`
- `production/public/images/Bangle/bangle-gold.png`
- `production/public/images/Bracelet/bracelet.png`
- `production/public/images/Bracelet/bracelet-gold.png`
- `production/public/images/Brooch/brooch.png`
- `production/public/images/Brooch/brooch-gold.png`
- `production/public/images/dangling/dangling.png`
- `production/public/images/dangling/dangling-gold.png`
- `production/public/images/Necklace/necklace-gold.png`
- `production/public/images/pendant/pendant.png`
- `production/public/images/pendant/pendant-gold.png`
- `production/public/images/rings/ring_01.png`
- `production/public/images/rings/ring_02.png`
- `production/public/images/rings/ring_05.png`
- `production/public/images/rings/ring_06.png`
- `production/public/images/rings/ring_20.png`
- `production/public/images/rings/ring_21.png`
- `production/public/images/stud/stud-earring.png`
- `production/public/images/stud/stud-gold-earring.png`

`production/.env.local` was normalized locally to the Supabase Singapore IPv4 session-pooler URL. It remains ignored and no credential value is logged or committed.

## Validation passed

- Supabase migration dry runs and six remote migration records
- Remote schema/constraint/index/trigger/RLS introspection
- Remote anonymous/customer/customer/admin ownership test
- Seed drift validation
- TypeScript
- ESLint: zero errors; existing `<img>` optimization advisories only
- Environment secret-boundary test
- Schema/security/idempotency tests
- Optimized Next production build with 17 routes plus proxy
- Static state smoke
- Static validator: 7 pass, 0 warning, 0 failure
- Browser smoke: homepage, catalogue, product, login, account, Saved Designs, cart, customer/admin boundary, admin views and logout
- Browser synchronization: one anonymous design and one anonymous cart line merged exactly once after login
- Browser console: zero errors on the tested journeys

## Remaining blockers and boundaries

- SMS stays intentionally mocked until a real provider and sender configuration are supplied.
- Public email confirmation requires an approved sending domain, deliverable test address and production redirect allow-list; development accounts can be created with `pnpm account:create`.
- Final 100-product catalogue, approved copy/media/prices, live SKUs, inventory and valid configuration combinations are still client inputs.
- Stripe checkout/webhooks remain the next separate milestone; the webhook secret is still required then.
- The isolated Next application is deployed at `https://woyke-production.vercel.app` and has not replaced the static Vercel alias.
- Complete configurator, order creation and admin mutation parity remain later production milestones.

## Vercel deployment validation

- Separate project: `woyke-production`
- Git deployment source: `Elvand-Lie/woyke-static-site`, root directory `production/`
- Live application: `https://woyke-production.vercel.app`
- Rollback application retained: `https://woyke-static-site.vercel.app`
- Clean Vercel install and optimized Next.js build: passed
- Live HTTP checks: homepage, catalogue, product, authentication, catalogue API and health API all returned 200
- Health configuration: database, Supabase and Stripe ready; Stripe webhook absent by design; SMS/email mocked; analytics disabled
