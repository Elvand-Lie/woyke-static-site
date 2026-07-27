# Graph Report - assets\js  (2026-07-20)

## Corpus Check
- Corpus is ~24,206 words - fits in a single context window. You may not need a graph.

## Summary
- 312 nodes · 555 edges · 13 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `406657d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_configurator-options.js  addSecondSideStoneStep  ankletChainStep|configurator-options.js / addSecondSideStoneStep / ankletChainStep]]
- [[_COMMUNITY_safeReturnUrl()  configurator-preview.js  design.js|safeReturnUrl() / configurator-preview.js / design.js]]
- [[_COMMUNITY_configurator-products.js  catalogueQuery()  categoryName()|configurator-products.js / catalogueQuery() / categoryName()]]
- [[_COMMUNITY_home.js  activateCraft()  activateOccasion()|home.js / activateCraft() / activateOccasion()]]
- [[_COMMUNITY_escapeHtml()  cartTotals()  cart|escapeHtml() / cartTotals() / cart]]
- [[_COMMUNITY_cartRemove  current  footer|cartRemove / current / footer]]
- [[_COMMUNITY_formatCurrency()  formatDate()  getQuery()|formatCurrency() / formatDate() / getQuery()]]
- [[_COMMUNITY_data  errorFor()  form|data / errorFor() / form]]
- [[_COMMUNITY_clone()  createId()  fingerprint()|clone() / createId() / fingerprint()]]
- [[_COMMUNITY_grid  designs-page.js  session|grid / designs-page.js / session]]
- [[_COMMUNITY_nowIso()  envelope()  storage.js|nowIso() / envelope() / storage.js]]
- [[_COMMUNITY_back  credentials  form|back / credentials / form]]
- [[_COMMUNITY_setStatus()  button  id|setStatus() / button / id]]

## God Nodes (most connected - your core abstractions)
1. `t()` - 15 edges
2. `escapeHtml()` - 13 edges
3. `getActiveConfigSteps()` - 12 edges
4. `nowIso()` - 12 edges
5. `formatCurrency()` - 12 edges
6. `render()` - 11 edges
7. `renderStep()` - 10 edges
8. `buildPayload()` - 10 edges
9. `renderSummary()` - 8 edges
10. `renderPreview()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `getInitialProduct()` --calls--> `getQuery()`  [EXTRACTED]
  design.js → app/utils.js
- `saveState()` --calls--> `nowIso()`  [EXTRACTED]
  design.js → app/utils.js
- `buildPayload()` --calls--> `configurationFingerprint()`  [EXTRACTED]
  design.js → domain/configuration.js
- `buildPayload()` --calls--> `nowIso()`  [EXTRACTED]
  design.js → app/utils.js
- `buildCartItem()` --calls--> `nowIso()`  [EXTRACTED]
  design.js → app/utils.js

## Communities (13 total, 0 thin omitted)

### Community 0 - "configurator-options.js / addSecondSideStoneStep / ankletChainStep"
Cohesion: 0.03
Nodes (71): addSecondSideStoneStep, ankletChainStep, ankletCharmStep, ankletClaspStep, ankletLengthStep, ankletSizingStep10, ankletStyleStep, ankletToeRingStep (+63 more)

### Community 1 - "safeReturnUrl() / configurator-preview.js / design.js"
Cohesion: 0.08
Nodes (56): safeReturnUrl(), configSteps, getActiveSteps(), getSizingOptions(), getStepById(), resolvePreviewAsset(), addToCart(), buildCartItem() (+48 more)

### Community 2 - "configurator-products.js / catalogueQuery() / categoryName()"
Cohesion: 0.06
Nodes (36): catalogueQuery(), categoryName(), FALLBACKS, productImage(), productImages(), allCategories, categoryLabels, getProductBySlug() (+28 more)

### Community 3 - "home.js / activateCraft() / activateOccasion()"
Cohesion: 0.08
Nodes (21): craftButtons, craftData, craftLabel, craftPlay, craftVideo, index, lead, leadImage (+13 more)

### Community 4 - "escapeHtml() / cartTotals() / cart"
Cohesion: 0.14
Nodes (15): escapeHtml(), cartTotals(), cart, designs, orders, root, session, spend (+7 more)

### Community 5 - "cartRemove / current / footer"
Cohesion: 0.12
Nodes (14): cartRemove, current, footer, header, heroMedia, item, items, languageButton (+6 more)

### Community 6 - "formatCurrency() / formatDate() / getQuery()"
Cohesion: 0.19
Nodes (11): formatCurrency(), formatDate(), getQuery(), render(), orders, root, session, order (+3 more)

### Community 7 - "data / errorFor() / form"
Cohesion: 0.17
Nodes (9): data, form, lines, order, session, status, submit, summary (+1 more)

### Community 8 - "clone() / createId() / fingerprint()"
Cohesion: 0.27
Nodes (8): clone(), createId(), fingerprint(), normalizeObject(), configurationFingerprint(), normalizeCartLine(), checkoutService, DEMO_USER

### Community 9 - "grid / designs-page.js / session"
Cohesion: 0.22
Nodes (7): grid, session, status, designRepository, draftRepository, KEYS, shareRepository

### Community 10 - "nowIso() / envelope() / storage.js"
Cohesion: 0.40
Nodes (9): nowIso(), envelope(), LEGACY_KEYS, parse(), readDocument(), readLegacy(), removeDocument(), updateDocument() (+1 more)

### Community 11 - "back / credentials / form"
Cohesion: 0.20
Nodes (9): back, credentials, form, otp, phone, request, returnUrl, status (+1 more)

### Community 12 - "setStatus() / button / id"
Cohesion: 0.29
Nodes (6): setStatus(), button, id, labels, root, status

## Knowledge Gaps
- **184 isolated node(s):** `occasionStep`, `categoryStep`, `interchangeabilityStep`, `stoneStep`, `stoneShapeStep` (+179 more)
  These have ≤1 connection - possible missing edges or undocumented components.