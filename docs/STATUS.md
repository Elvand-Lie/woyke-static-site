# WOYKE implementation status

Last updated: 2026-08-03

## Current result

The static prototype is now a coherent schema-v1 browser application. Catalogue, configuration, cart, demo session, checkout, mock orders, saved designs, public share snapshots, consultation requests, and account metrics use shared data and repositories. The visual baseline remains intact.

## Storage contract

- `woyke.session.v1`
- `woyke.cart.v1`
- `woyke.designs.v1`
- `woyke.orders.v1`
- `woyke.shares.v1`
- `woyke.consultations.v1`
- `woyke.configurator.v1.<productSlug>`

Every document uses `{ schemaVersion: 1, updatedAt, data }`. Reads recover from malformed JSON, preserve a recovery copy when possible, and migrate the legacy cart/session/configurator values used by the baseline.

## Codex milestone log

### Milestone 0 - baseline audit

Status: Complete

- The working repository was the older static visual baseline; the supplied Full App Kit added missing briefs, validation, engine and client references.
- `TASTE_GUIDE.md` is absent from the working repository, Full App Kit, both attached briefs, and the Downloads tree. The existing approved presentation and explicit master/client visual rules were used as the available design authority.
- Baseline shop, product, account, order, saved-design, success, share, and consultation routes were hardcoded shells.
- Baseline state used incompatible `woyke-configurator-v2:<slug>`, `woyke-cart-v1`, and `woyke-demo-session` values without envelopes, validation, or migrations.
- The original configurator already ported nine categories, conditional options, pricing, sizing guides and preview resolution. Saved designs, complete cart payloads, cart editing and repository-backed ownership journeys were missing.
- Generated preview image directories are present under `/images/`; missing combinations still use explicitly labelled representative fallbacks.
- The bundled validator crashed on restricted Windows when a nested `node --check` could not spawn. It now reports that sandbox condition as a warning; direct syntax checks are run separately.

### Milestone 1 - shared data and storage

Status: Complete

- Added shared utilities, schema-v1 storage envelopes, legacy migration, malformed-data recovery, repositories, services, catalogue adapters, fingerprinting and safe totals.
- Shop uses the shared 25-product/nine-category engine catalogue with search, category filter, sort, count, empty state and query persistence.
- Product detail resolves `?product=<slug>`, handles invalid slugs, and supports customize or base-design cart actions.
- Cart uses one repository with refresh persistence, quantity, edit, remove, clear, empty state and safe totals.

### Milestone 2 - configurator and cart

Status: Complete

- Preserved the supplied conditional steps, all category branches, option values, pricing, previews and five sizing guides.
- Configurator drafts are schema-v1 and per-product. Branch changes remove inactive selections and retain a valid step.
- Cart and saved-design payloads include product identity, preview and match state, raw selections, readable labels, price breakdown, engraving, gift data, stable fingerprint and timestamps.
- Configurator supports restart, review, save design, edit saved design, add/update cart and cart-line editing.
- The size guide uses a modal dialog with pointer close, Escape close and focus return; generated previews use `object-fit: contain`.

### Milestone 3 - auth, checkout, orders, account and share

Status: Complete

- Demo sign-in is explicitly local and does not claim real SMS, OTP, password or account infrastructure.
- Protected checkout/account routes return through `/auth/`; sign-out clears only the session.
- Checkout has inline validation and creates one immutable order before clearing the cart. Submission IDs prevent duplicate order creation.
- Success loads the actual order record and has a recoverable missing-order state.
- Account metrics, saved designs and order history are derived from repositories.
- Saved designs support open/edit, duplicate, share and remove.
- Public sharing stores an immutable sanitized snapshot without contact, delivery, payment or account fields; missing/revoked IDs render a useful state.
- Consultation validates, supports product/design query context, stores a stable local reference, and states that no email or CRM action occurred.

### Milestone 4 - QA and deployment

Status: Complete for local frontend scope

- Craft autoplay is viewport-aware, reduced-motion aware, and pauses other videos before starting another.
- Sustainability content was replaced with an evidence-first provisional boundary rather than unsupported claims.
- `node scripts/validate.mjs`: 6 pass, 1 Windows sandbox warning, 0 failures.
- All application JavaScript and scripts pass direct `node --check`.
- `node scripts/state-smoke.mjs` covers malformed recovery, distinct fingerprints, order idempotency, cart clearing and share sanitization.
- Browser direct-refresh smoke covered 18 route variants with one H1 and zero console errors on each.
- Browser journeys covered catalogue filters, valid/invalid product detail, cart refresh, auth return, checkout validation, order creation, success refresh, order history, configurator completion, category branch change, sizing dialog, saved design, duplicate, signed-out share, missing share and consultation receipt.
- Responsive overflow checks passed at 375x812, 768x1024, 1024x768 and 1440x900 for shop, design, auth, consultation and craft.

## Known limitations and client inputs

- All persistence is browser-local and is intentionally not production authentication, payment, inventory, fulfilment, email, CRM or database infrastructure.
- Product catalogue, prices, photography, translations, materials claims, lead times, policies and commercial integrations still require client approval as listed in `docs/CLIENT_INPUTS.md`.
- Public share IDs are local-browser demonstrations; they are not accessible from another device without a production backend.
- Deployment was not performed because Vercel project ownership and credentials were not supplied. Static deployment configuration is present.
- Optional admin routes were not added because customer acceptance journeys do not require them and a production admin/data model is explicitly a later migration boundary.

### Milestone 5 - media interest-test refinement

Status: Complete

- Curated a provisional five-product media edit: Imperial Jade Bloom, Jade Cabochon Statement, Celestial Diamond Floral, Cushion Brilliance and Emerald Accent Marquise.
- Replaced inaccurate public category fallbacks with category-correct generated studies; the public shop no longer maps bangles, brooches or earrings to unrelated bracelet, jade or model imagery.
- Product galleries now resolve from a central media manifest and jewellery imagery uses `contain` so generated pieces are not cropped to fill editorial frames.
- Surfaced the existing 9:16 pear-ring film as an explicitly labelled pear-cut object study on the Craft page.
- Corrected configurator fallback media by category and change the displayed starting-product name to a category study when the selected form changes.
- Removed public prototype/demo and unsupported sourcing/certification language from the product, craft, materials, shared footer and shared language controls.
- Full asset requirements and every changed file are recorded in `docs/MEDIA_INTEREST_TEST_HANDOFF.md`.


### Milestone 6 - Vercel deployment and Git connection

Status: Complete

- Confirmed the existing Vercel project `woyke-static-site` is already connected to `https://github.com/Elvand-Lie/woyke-static-site.git` for Git-triggered deployments.
- Deployed the current working tree to the public production alias `https://woyke-static-site.vercel.app` and verified a direct product route in a browser.
- The verified production product image loads at its natural resolution with `object-fit: contain`, and obsolete public prototype/demo wording is absent.
- No Git commit or push was made because the working tree contains pre-existing mixed changes that require review before they are published to `main`.
### Milestone 7 - production foundation and database

Status: Complete for Phase 1 and Phase 2 repository scope

- Added an isolated Next.js 16 App Router production application under `production/` while preserving the live static application as the rollback target.
- Configured TypeScript 6, Tailwind CSS 4, Framer Motion, Zustand, browser/server/admin Supabase clients, server-only Stripe and split environment validation.
- Migrated the homepage through a deterministic markup/CSS bridge and a React shared header/footer without changing the accepted visual composition.
- Added a public Supabase catalogue route and a credential-safe health route.
- Added the complete versioned PostgreSQL schema, indexes, timestamp triggers, RLS, customer isolation, server-only administrative write boundary, sanitized design sharing and unique Stripe event records.
- Generated honest draft seeds from the existing application: 9 categories, 25 provisional products, 71 configurator components, 458 options and 6 valid interchangeability rules. SKUs are inactive and inventory is zero.
- Added backend, schema, migration, client-dependency, Stripe, Supabase, security, deployment and testing documentation.
- TypeScript, ESLint, schema/security tests, seed drift check and the optimized Next production build pass.
- Local HTTP checks returned 200 for the homepage, hero media, craft video and home interaction script; `/api/health` confirmed Supabase and Stripe configuration while correctly rejecting the placeholder database URL and missing webhook secret.
- Visual browser automation is still required because the in-app browser runtime could not initialize in the current desktop session.
- A Supabase migration dry run was attempted but could not connect because `DATABASE_URL` still contains a placeholder database password; Supabase also reports that no SMS provider is enabled.
- The Next app has not replaced the current static Vercel project.
### Milestone 8 - Supabase catalogue, authentication and customer persistence

Status: Complete for Production Milestone 2

- Normalized the development database connection to the Supabase Singapore IPv4 session pooler without exposing credentials.
- Applied six migrations without a reset: the complete schema/seed plus saved-design idempotency, provisional five-product publication and category-name correction.
- Verified the remote database has 27 tables, 31 foreign keys, 23 unique constraints, 70 indexes, RLS and timestamp triggers on all 27 tables, and 30 policies.
- Confirmed remote seed counts: 9 categories, 25 products, 50 media rows, 25 inactive SKUs, 25 zero-stock inventory records, 71 components, 458 options, 6 combination rules and 1,013 draft translations; five products are provisionally published.
- Added Supabase-backed catalogue/product routes and retained the static deployment as the rollback destination for unmigrated routes.
- Implemented Supabase session refresh, registration, login, logout, customer/admin guards and development account creation.
- Moved authenticated carts and saved designs to Supabase while preserving anonymous versioned local drafts and merging them exactly once after login.
- Added server-side ownership validation, database price lookup, idempotent sync keys and minimal protected admin reads for products, inventory, customers and orders.
- Real-project RLS tests passed for anonymous, two different customers, authenticated admin and service-role contexts, including protected writes, Stripe uniqueness and sanitized public design sharing.
- TypeScript, ESLint, local tests, seed drift, optimized Next build, static validation/state smoke and browser journeys passed.
- Browser smoke covered homepage, catalogue, product, login, account, Saved Designs, cart, customer/admin boundary, admin views and logout with zero console errors.
- Stripe checkout/webhooks were intentionally excluded. SMS remains mocked; public email confirmation awaits an approved sending domain/test address.
- The Next application remains local and has not replaced the current static Vercel production alias.

### Milestone 9 - production application Vercel deployment

Status: Complete for the separate production application project

- Created and linked the separate Vercel project `woyke-production`; the existing `woyke-static-site` project remains unchanged as the rollback target.
- Connected `woyke-production` to the existing `Elvand-Lie/woyke-static-site` GitHub repository with `production/` as the Vercel root for automatic future Git deployments.
- Added the existing production Supabase, database, Stripe and provider environment configuration to Vercel without committing or exposing credential values.
- Deployed the Next.js application to `https://woyke-production.vercel.app`.
- Vercel's clean install, optimized Next.js build and TypeScript validation completed successfully.
- Live checks returned HTTP 200 for the homepage, catalogue, product, authentication, catalogue API and health API.
- The live health response confirms database, Supabase and Stripe configuration; Stripe webhooks remain intentionally unconfigured and SMS/email remain mocked.

### Milestone 10 - custom configuration naming

Status: Complete

- Custom configurator payloads now use the selected stone and jewellery category for honest names such as `Custom Pink Diamond Necklace` and `Custom Ruby Brooch` instead of inheriting the starter catalogue product name.
- Existing browser-local cart lines and saved designs are normalized when read, so stale `Imperial Jade Bloom Ring` names are corrected without deleting customer selections.
- Ordinary catalogue product lines retain their approved product names; custom names fall back to `Custom <Category>` or `Custom Design` when descriptors are unavailable.
- Updated `assets/js/domain/configuration.js`, `assets/js/design.js`, `assets/js/repositories/repositories.js` and `scripts/state-smoke.mjs`.
- Direct JavaScript syntax checks, state repository smoke tests and the static validator pass with zero failures.
- Deployed the naming fix to `https://woyke-static-site.vercel.app`; the live cart and updated JavaScript modules returned HTTP 200.
- Completed a full live configurator journey for a ruby brooch and confirmed the cart displays `Custom Ruby Brooch` with zero browser console errors.

### Milestone 11 - production completion and acceptance repair

Status: Complete for implemented production scope; external launch inputs remain blocked

- Recovered the frozen production task and audited the live Next.js, Supabase and Stripe implementation against the repository acceptance journeys.
- Fixed the authenticated cart query so only the signed-in user's active cart is rendered; converted carts no longer leak stale lines into the bag. Added readable specifications, quantity feedback and a clear-bag action.
- Added saved-design duplication, product/design consultation context with stable human references, phone-change OTP routes, authenticated SMS verification controls and administrator consultation references.
- Added optional Klaviyo event and PostHog provider adapters while preserving honest disabled/mock behavior when credentials are absent.
- Added a protected Cloudinary signature and audited media-record boundary plus an administrator product-media uploader. It remains disabled until the client Cloudinary credentials are connected.
- Explicitly scoped customer-facing order, cart, address and saved-design queries to the signed-in owner even when the user also has an administrator role. The administrator dashboard retains global operational visibility.
- Applied production migrations `202607310002_auth_profile_phone.sql` and `202607310003_consultation_context.sql`; repaired the already-live `202607310001` migration history entry without resetting data.
- Browser acceptance completed a full 11-step configuration, server-validated SGD 12,800 review, authenticated save and duplicate, public sanitized share while signed out, product-prefilled consultation, active bag, checkout constraint validation, administrator media view and global/personal data-boundary checks. Temporary QA identity and data were deleted afterward.
- Responsive browser checks passed 40 route/viewport combinations at 375x812, 768x1024, 1024x768 and 1440x900 with one H1, no broken images and no horizontal overflow.
- `pnpm typecheck`, `pnpm lint` (0 errors, 14 existing image/performance warnings), `pnpm test` (all suites), `pnpm test:remote`, `pnpm seed:check`, optimized `pnpm build`, root `node scripts/validate.mjs` and `node scripts/state-smoke.mjs` pass.
- The remaining launch blockers are client-owned: final catalogue/media/prices/inventory, approved Chinese copy, SMS sender configuration, Klaviyo/PostHog/Cloudinary credentials and flows, and a verified live Stripe payment/webhook run. These are documented in `docs/PRODUCTION_COMPLETION_HANDOFF.md` and are not represented as complete.
- Milestone 11 deployment: added the production-root Next.js Vercel configuration, deployed to https://woyke-production.vercel.app, and verified six public routes, the configured health boundary and the unauthenticated media API rejection. The static rollback deployment remains unchanged.

### Milestone 12 - expanded video storytelling

Status: Complete and deployed

- Audited eight unique supplied video assets. The five workshop clips and vertical pear-ring close-up were already used; `pear-ring-showcase.mp4` and `images/hero-video.mp4` were the only unused films.
- Added the eight-second horizontal pear-ring showcase to the Design route as an explicitly representative object study, with consultation context rather than an exact product claim.
- Added the 35-second vertical setting and inspection film to the Materials route as an editorial workshop study and generated a matching poster from the supplied source footage.
- Added responsive editorial film layouts shared by the static rollback and Next.js production application.
- Extended the production route observer so videos play only while visible, pause when they leave the viewport, pause competing films and respect `prefers-reduced-motion`.
- Made the predevelopment and prebuild legacy sync scripts package-manager independent so local and Vercel builds do not depend on a globally available `pnpm` executable.
- `npm run typecheck`, `npm run lint` (0 errors, 14 existing warnings), `npm run test`, optimized `npm run build`, root validation and state smoke pass.
- Milestone 12 deployment: deployed to https://woyke-production.vercel.app; live Design and Materials checks confirmed both films at native resolution, active playback while visible, controls, poster loading, one H1 per route and no desktop or 375px mobile overflow.
### Milestone 13 - complete collection and visual regression repair

Status: Complete and deployed

- Replaced the five-piece interest-test publication boundary with the complete existing 25-piece, nine-category catalogue. The records remain marked provisional, SKUs remain inactive and inventory remains zero until client approval.
- Removed the oversized first-card treatment from Shop and normalized every product media frame to a square `contain` presentation so jewellery is visible without edge cropping.
- Corrected the Craft study cards from cropped `cover` playback to full-frame 16:9 `contain` playback and restored readable ivory/gold captions on the dark cards.
- Restored the proven static consultation art direction in the production application: full-height campaign hero, original editorial headline, two-column request composition and honest production wording.
- Isolated the production consultation form from legacy CSS collisions, removed the empty status box and added recoverable network/API error handling.
- Applied `202608030001_publish_complete_existing_catalogue.sql` to the remote Supabase project; anonymous RLS verification now confirms all 25 published products while protected customer data remains isolated.
- `npm run typecheck`, `npm run test`, `npm run lint` (0 errors, 14 existing warnings), `npm run test:remote`, optimized `npm run build`, root validation and state smoke pass.
- Deployed to https://woyke-production.vercel.app and verified Shop, Our Craft and Consultation on desktop and 375x812: 25 cards, 10 category options, no broken images, full-frame video playback, one H1, no empty status box, no horizontal overflow and no console errors.
- The static rollback at https://woyke-static-site.vercel.app also received the non-breaking Shop/Craft media-fit corrections.

### Milestone 14 - full project handover

Status: Complete

- Committed the complete production application, all documentation, catalogue media and supplied content assets to `main`; the production app had previously existed only in the local working tree and was absent from Git history.
- Added `HANDOVER.md` at the repository root as the client-facing handover reference: live URLs, architecture, database state, environment variables, local development, deployment, access-transfer checklist, verified state and outstanding client-owned launch inputs.
- Added `.env.example` documenting every environment variable by name without secret values; real secrets remain git-ignored and transfer via a secure channel.
- Verified both live deployments: `https://woyke-production.vercel.app` `/api/health` reports database, Supabase, Stripe and Stripe webhook configured; the static rollback remains online.
- Packaged the complete project as a transfer archive excluding dependencies, Git history, temporary files and secret-bearing env files.
- Outstanding launch inputs remain client-owned and are listed in `HANDOVER.md` section 10 and `docs/PRODUCTION_COMPLETION_HANDOFF.md`.
