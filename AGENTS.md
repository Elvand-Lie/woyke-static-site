# WOYKE repository instructions

This repository is the working implementation, not a blank scaffold.

## First action

Read, in order:

1. `START_HERE.md`
2. `docs/PRODUCT_SCOPE.md`
3. `docs/IMPLEMENTATION_PLAN.md`
4. `docs/DATA_AND_STATE.md`
5. `docs/ROUTE_ACCEPTANCE.md`
6. `docs/QA_AND_HANDOFF.md`
7. `docs/PRODUCTION_MIGRATION.md`
8. `docs/CLIENT_INPUTS.md`

Then inspect the current routes and JavaScript before editing.

## Non-negotiable product rules

- Preserve the existing premium, editorial WOYKE visual language.
- Photography carries the emotional layer; commerce controls remain obvious.
- Do not turn the application into a generic SaaS dashboard.
- Do not introduce Three.js, WebGL, shader canvases, or procedural jewellery.
- Do not replace working configurator data or preview logic with fake UI.
- Do not add a framework or build system unless a proven blocker requires it.
- Do not use competitor assets or copy competitor wording.
- Do not invent sourcing claims, certifications, inventory, or production facts.
- Treat generated previews as representative unless the resolver marks them exact.
- Preserve exact generated-asset folder spelling and case, including `Angklet`.

## Technical constraints

- Primary runtime: static HTML, CSS, and browser-native ES modules.
- Deployment target: Vercel static hosting.
- Persistence: versioned `localStorage` repositories for this prototype.
- Root-relative public asset paths are allowed and preferred.
- Every public route must work on direct refresh.
- Avoid inline business logic in HTML files. Put data, rules, stores, and services in JavaScript modules.
- Use one source of truth for products, configuration, cart, users, designs, and orders.
- Preserve backward compatibility with existing local demo data where practical.
- JavaScript must pass `node --check`.
- No console errors on supported user journeys.

## Work discipline

- Audit before changing.
- Make small coherent changes.
- Do not rewrite files solely for stylistic preference.
- Fix root causes rather than hiding errors.
- Update `docs/STATUS.md` after each milestone.
- Run `node scripts/validate.mjs` before reporting completion.
- If browser automation is available, execute the journeys in `docs/ROUTE_ACCEPTANCE.md`.

## Completion rule

Do not report the application complete merely because every page renders. Completion requires the cross-route stateful journeys, validation, persistence, responsive behavior, and acceptance criteria documented in this repository.
