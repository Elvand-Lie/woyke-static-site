# WOYKE production completion handoff

Last updated: 2026-07-31

## Delivered

The production application under `production/` now has persisted Supabase catalogue, authentication, customer carts, saved designs and sanitized sharing; server-validated configuration; Stripe Checkout and idempotent webhook code; order and inventory reservation state; consultation references and context; protected operations/admin views; phone-change OTP UI; and secure Cloudinary upload signing/recording boundaries.

The production build is deployed at `https://woyke-production.vercel.app`. The static deployment remains the rollback target. No existing data was reset.

## Verified

- Production migrations applied without reset; remote RLS and production-table tests pass.
- Optimized Next.js build passes with 35 routes.
- Full configurator, saved-design duplicate, signed-out share, product consultation, cart, checkout validation, admin and personal-data isolation journeys pass.
- Forty responsive route checks pass across phone, tablet, laptop and desktop viewports.
- Static rollback validation and state smoke tests pass.

## Launch blockers requiring client access or approved data

1. **Catalogue:** only five strongest provisional products are published. Supply approved records, exact imagery, prices, SKUs and inventory before expanding toward the 100-product commercial target.
2. **SMS:** Supabase reports no SMS provider. Connect the approved sender/provider before phone-change codes can be delivered.
3. **Email/CRM:** set `EMAIL_PROVIDER=klaviyo`, add `KLAVIYO_PRIVATE_API_KEY`, and create the approved Klaviyo flow for the emitted consultation event.
4. **Analytics:** set `ANALYTICS_PROVIDER=posthog`, `POSTHOG_KEY` and the approved host after consent and retention decisions.
5. **Media:** add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`; then test an exact product upload from `/admin`.
6. **Chinese:** approve and load full page/product/legal translations. The current language control covers shared navigation and configurator content but is not a complete approved localization.
7. **Payments:** verify the Vercel Stripe webhook endpoint and complete one controlled Stripe test-mode payment through webhook confirmation before live keys or real inventory are enabled.
8. **Legal/operations:** approve delivery, returns, privacy, terms, materials claims, lead times and fulfilment ownership.

## Release commands

From `production/`:

```powershell
pnpm seed:check
pnpm typecheck
pnpm lint
pnpm test
pnpm test:remote
pnpm build
vercel --prod
```

From the repository root:

```powershell
node scripts/validate.mjs
node scripts/state-smoke.mjs
```