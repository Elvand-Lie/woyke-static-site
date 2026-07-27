# WOYKE implementation status

Last updated: 2026-07-20

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