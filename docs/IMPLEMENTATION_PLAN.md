# WOYKE implementation plan

## Operating rule

Preserve the current visual system and engine data. Refactor incrementally. Do not rebuild the design from scratch and do not replace working rules with visual mocks.

## Week 1 — baseline and shared foundation

### Deliverables

- Record current behavior and defects in `STATUS.md`
- Inventory routes, scripts, localStorage keys, and duplicated data
- Introduce shared utilities, storage adapter, repositories, and application schemas
- Centralize products and configurator data as the sole sources of truth
- Add malformed-storage recovery and schema versioning
- Make route scripts tolerant of absent DOM nodes
- Connect shop and product detail to the shared product catalogue

### Exit criteria

- Shop filtering/search/sort works from shared data
- Product detail works for valid and invalid slugs
- Validation script passes baseline structural checks
- No route is visually regressed

## Week 2 — configurator and cart

### Deliverables

- Preserve all supplied conditions, option values, sizing, guides, pricing, and preview paths
- Add required-step validation
- Remove stale downstream selections after branch changes
- Clamp step index after active-step changes
- Add exact/representative/fallback preview labelling
- Persist progress per product
- Add stable configuration fingerprinting
- Save configured preview, labels, raw selections, and price breakdown in cart lines
- Complete add, edit, quantity, remove, clear, and empty-cart behavior

### Exit criteria

- Every category can complete a valid configuration
- Different configurations of the same product remain separate cart lines
- Cart survives refresh
- Editing a cart line returns to the relevant saved configuration

## Week 3 — auth, checkout, orders, account, sharing

### Deliverables

- Honest demo authentication and session persistence
- Client-side account guards with return URL
- Accessible checkout validation
- Immutable mock-order snapshot before cart clearing
- Duplicate-submit protection
- Success page loads the actual order
- Account overview derives metrics from repositories
- Saved designs: open, edit, duplicate, share, remove
- Orders: list and detail presentation
- Public share snapshot with no private customer data

### Exit criteria

- Guest-to-auth-to-checkout journey works
- Refreshing success does not create another order
- Saved design can be shared and viewed signed out
- Signing out leaves cart and order history intact unless documented otherwise

## Week 4 — consultation, editorial behavior, QA, deployment

### Deliverables

- Consultation validation, local submission record, and reference number
- Product/design query prefill for consultation
- Viewport-aware craft video behavior
- Accessibility and responsive fixes at 375, 768, 1024, and wide desktop
- Direct refresh checks for every route
- Complete validation and browser journeys
- Vercel configuration and public-production verification
- Final `STATUS.md` and handoff report

### Exit criteria

- All route acceptance scenarios pass
- No broken local asset links except explicitly documented missing generated preview assets
- No JavaScript syntax errors or console errors on primary journeys
- Production URL works in an incognito browser without deployment protection

## Scope-change rule

When a request introduces a real external service, new content workflow, major catalogue migration, or new role/permission model, record it as a separate phase rather than silently expanding this implementation.
