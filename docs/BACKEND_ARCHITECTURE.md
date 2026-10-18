# WOYKE backend architecture

## Current production boundary

The existing static application remains at the repository root and is the rollback target. The production application lives in `production/` until each route reaches functional and browser parity.

The production runtime is Next.js App Router with TypeScript, Tailwind CSS, Framer Motion and Zustand. Supabase provides PostgreSQL, authentication and storage. Stripe is server-only.

## Request boundaries

- Browser-safe code may use only `NEXT_PUBLIC_*` values and the Supabase publishable key.
- Server Components and route handlers use the cookie-aware Supabase server client.
- Administrative jobs use the Supabase secret client only after independent role checks.
- Stripe calls are created only through `production/lib/stripe.ts`.
- PostgreSQL is the authority for catalogue, rules, prices, inventory, designs, carts, orders and payments.
- The browser never supplies an authoritative price, stock result, payment result or role.

## Incremental frontend bridge

The first migrated route is `/`. `production/scripts/sync-legacy-home.mjs` extracts the existing homepage markup and route-specific CSS into the Next app. This preserves the accepted appearance while the shared header/footer and runtime move to React.

Only homepage media and its interaction script are copied into `production/public/`. Demo authentication and local-order scripts are not exposed by the production app.

## Production services

- `production/lib/env/` validates public and server environments separately.
- `production/lib/supabase/browser.ts` creates the browser client.
- `production/lib/supabase/server.ts` creates the cookie-aware server client.
- `production/lib/supabase/admin.ts` creates the server-only administrative client.
- `production/lib/stripe.ts` creates the server-only Stripe client.
- `/api/catalogue` reads only published Supabase products.
- `/api/health` reports configuration state without returning credentials.

## Provider boundary

SMS, transactional email, Klaviyo, PostHog and Cloudinary remain disconnected until their integrations are implemented. Their missing credentials do not block database, authentication, catalogue or checkout architecture.
