# Codex master instruction — implement the complete WOYKE frontend application

Work directly in this repository.

Read `AGENTS.md` and every document linked from `START_HERE.md` before editing. Inspect the existing implementation and references. Do not stop after producing a plan: audit, implement, verify, and document the completed work.

## Mission

Convert the existing WOYKE premium static prototype into one coherent, stateful, end-to-end frontend application based on the supplied architecture and client references.

The existing visual direction is approved as the design foundation. Preserve it. The principal task is to complete the application engine, connect every route to shared data and state, eliminate placeholder-only behavior, and make the whole journey credible on desktop and mobile.

## Source-of-truth hierarchy

1. Existing repository visual presentation: visual source of truth.
2. `reference/engine/options.ts`, `products.ts`, `preview.ts`, `pricing.ts`, `engine.ts`: configurator/data behavior reference.
3. `reference/client/WOYKE_PRD.docx`, proposal, and designer brief: product and content intent.
4. `docs/*.md`: implementation boundaries and acceptance criteria.

When sources conflict, preserve working behavior and document the conflict rather than silently inventing a rule.

## Architecture target

Keep the application static and no-build unless a hard technical blocker is proven.

Use browser-native ES modules with a structure similar to:

```text
assets/js/
  app/
    bootstrap.js
    router-context.js
  data/
    products.js
    configurator-options.js
    content.js
  domain/
    configurator.js
    pricing.js
    preview-resolver.js
    cart.js
    orders.js
    designs.js
    consultation.js
  repositories/
    storage.js
    cart-repository.js
    user-repository.js
    design-repository.js
    order-repository.js
    consultation-repository.js
  services/
    auth-service.js
    checkout-service.js
    share-service.js
  pages/
    home-page.js
    shop-page.js
    product-page.js
    design-page.js
    cart-page.js
    auth-page.js
    checkout-page.js
    success-page.js
    account-page.js
    saved-designs-page.js
    orders-page.js
    share-page.js
    consultation-page.js
```

Do not force these exact filenames if the existing modules can be evolved cleanly. The requirement is separation of data, domain rules, persistence, and rendering.

## Required implementation

### Shared foundation

- Create one versioned application storage layer.
- Define stable schemas for session, cart, saved designs, orders, consultation requests, and share records.
- Add migration and malformed-data recovery.
- Centralize currency formatting, HTML escaping, date formatting, ID generation, and query-parameter parsing.
- Ensure all route scripts fail gracefully when expected DOM nodes are absent.

### Catalogue

- Drive shop and product detail from the same product dataset used by the configurator.
- Support category filtering, search, sort, count, empty states, and query-parameter persistence.
- Use product slugs in links.
- Product detail must load from `?product=<slug>` and provide customize/add-to-cart actions.
- Unknown slugs must show a useful fallback rather than a blank page.

### Configurator

- Preserve all supplied categories, conditions, option values, guide mappings, pricing, and preview paths.
- Validate required steps.
- Remove stale downstream selections after a branch-changing answer.
- Clamp the active step index after branch changes.
- Distinguish exact, representative, and fallback previews.
- Use `object-fit: contain` for generated product renders.
- Include configured preview image, product, selected labels, raw selections, price breakdown, engraving, gift message, and a stable configuration fingerprint in cart/saved-design payloads.
- Support save design, restart, edit, and add to cart.
- Persist progress per product.
- Sizing guides must open accessibly and work on mobile.

### Cart

- One cart source of truth.
- Add, remove, edit, update quantity, and clear.
- Do not merge two different configurations of the same product.
- Show configured preview and readable specification.
- Recalculate totals from stored line data safely.
- Empty-cart state must link back to discovery/design.

### Authentication prototype

- Implement a clearly labelled demo authentication/session flow.
- Do not imply real OTP delivery.
- Persist a demo user session.
- Protect account-only experiences through client-side routing guards with a return URL.
- Signing out must clear session, not cart/order history unless intentionally specified.

### Checkout and orders

- Conventional accessible forms with inline validation.
- Snapshot cart lines and total into an immutable mock order before clearing the cart.
- Generate a stable order reference and timestamps.
- Persist orders by the current demo user.
- Success page must load the actual newly created order.
- Prevent accidental duplicate order creation on refresh.
- Provide a recoverable empty/expired confirmation state.

### Account

- Account overview reflects the current demo user.
- Saved designs page lists, opens, edits, duplicates, shares, and removes designs.
- Orders page lists persisted mock orders and their statuses.
- Account metrics must be derived from stored data, not hardcoded numbers.

### Sharing

- Generate a stable share ID for a saved design.
- Store a sanitized public snapshot separate from private account data.
- `/share/?id=<id>` must render the shared design without requiring authentication.
- Missing/revoked IDs must display a useful state.
- Never expose delivery, contact, or payment fields in a share record.

### Consultation

- Validate and store consultation requests.
- Provide a success state and reference number.
- Allow a selected product/design ID to prefill context through query parameters.
- Avoid claiming that a real email or CRM submission occurred.

### Craft, materials, and sustainability

- Preserve the existing editorial design.
- Workshop videos should be muted, `playsinline`, poster-backed, and viewport-aware.
- Do not autoplay every video simultaneously.
- Do not add unsupported sourcing, environmental, or certification claims.

### Optional practical admin demo

If the client architecture clearly requires it, add `/admin/` and `/admin/orders/` as a local demo interface backed by the same repositories. Keep it practical, restrained, and explicitly non-production. Do not build a second dataset.

## Visual rules

- Keep ivory/cream/ink/champagne palette and existing typography hierarchy.
- Keep campaign and editorial photography.
- Keep commerce interactions conventional and legible.
- No generic rounded-card dashboard redesign.
- No gratuitous animation.
- No Three.js, WebGL, shaders, canvas jewellery, or fake 3D.
- No emoji as primary interface iconography.
- Respect `prefers-reduced-motion`.
- Maintain visible keyboard focus.
- Test 375px, 768px, 1024px, and wide desktop.

## Asset rules

- Import generated engine assets into root `/images/` using `scripts/import-engine-assets.ps1` when the source repository is available.
- Preserve case-sensitive directories: `Necklace`, `Bracelet`, `Bangle`, `Brooch`, and `Angklet`.
- Do not rename source files merely to make paths prettier.
- Do not ship absolute Windows paths.
- Do not reference localhost in production markup.

## Work sequence

1. Run the baseline and record issues in `docs/STATUS.md`.
2. Audit current route behavior and localStorage keys.
3. Implement shared storage/data/domain layers.
4. Connect catalogue and product detail.
5. Harden configurator and cart.
6. Complete auth, checkout, orders, account, saved designs, and sharing.
7. Complete consultation and editorial-page behavior.
8. Add optional admin only after customer journeys pass.
9. Run validation and browser journeys.
10. Update documentation and final report.

## Verification

At minimum run:

```powershell
node .\scripts\validate.mjs
node .\serve.mjs
```

Then manually or with browser automation execute every journey in `docs/ROUTE_ACCEPTANCE.md`.

## Reporting

Maintain `docs/STATUS.md` during work. Final report must include:

- Files changed and created
- Architecture introduced
- Storage schemas and versions
- Completed routes
- Completed end-to-end journeys
- Tests/checks run and results
- Known limitations
- Exact run and deploy commands

Do not claim completion if cross-route persistence, order creation, saved designs, sharing, or mobile configurator behavior remains simulated only through disconnected buttons.
