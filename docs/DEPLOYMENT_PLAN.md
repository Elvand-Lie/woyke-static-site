# WOYKE deployment plan

## Current production

The existing static application remains live at `https://woyke-static-site.vercel.app`. Its Vercel/GitHub connection is unchanged.

## Production application deployment

The separate Next.js application is deployed at `https://woyke-production.vercel.app` in the Vercel project `woyke-production`.

Its production environment variables are stored in Vercel and are not committed. The deployment passed a clean dependency install, optimized Next.js build, TypeScript validation and live route/API smoke checks.

The project is connected to `Elvand-Lie/woyke-static-site` on GitHub with `production/` as its Vercel root, so future pushed commits can deploy automatically.

## Cutover gates

- All required routes migrated with parity.
- Supabase migrations applied and RLS tests passed.
- Stripe test webhook verified and idempotency tested.
- Client catalogue/assets imported and approved.
- Mobile and accessibility checks passed.
- Production domain, DNS, privacy and consent settings approved.

The static Vercel project remains the rollback target until these gates pass.
