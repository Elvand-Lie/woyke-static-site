# Codex milestone prompts

Use `CODEX_MASTER_PROMPT.md` once at the beginning. These smaller prompts can then be used to keep execution disciplined.

## Milestone 0 — audit

```text
Read AGENTS.md, START_HERE.md, and every docs file. Run the current application and scripts/validate.mjs. Audit routes, duplicated data, localStorage keys, missing assets, console failures, and disconnected controls. Record findings in docs/STATUS.md. Do not redesign pages yet.
```

## Milestone 1 — foundation and catalogue

```text
Implement the shared utilities, versioned storage adapter, repositories, and schemas described in docs/DATA_AND_STATE.md. Connect shop and product detail to the shared product catalogue. Preserve the current visual system. Run validation, manually test catalogue routes, and update docs/STATUS.md before continuing.
```

## Milestone 2 — configurator and cart

```text
Harden the existing configurator and cart according to CODEX_MASTER_PROMPT.md and docs/ROUTE_ACCEPTANCE.md. Preserve all supplied engine values, conditions, guide paths, pricing, and preview resolution. Implement stale-branch cleanup, validation, persistence, fingerprints, save/edit/restart, and configured cart lines. Run journeys A-C and update docs/STATUS.md.
```

## Milestone 3 — customer ownership and checkout

```text
Complete honest demo auth, checkout, immutable local orders, success recovery, account metrics, saved designs, public sanitized sharing, and consultation repositories. Run journeys D-G. Do not claim external delivery or payment. Update docs/STATUS.md.
```

## Milestone 4 — quality and handoff

```text
Run every acceptance journey at the documented viewport sizes. Fix direct-refresh, keyboard, focus, reduced-motion, video, missing-data, and console issues. Run scripts/validate.mjs, verify Vercel routing, update all handoff docs, and provide the final report. Do not report completion with unresolved cross-route journey failures.
```
