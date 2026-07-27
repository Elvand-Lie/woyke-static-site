# Start here — WOYKE Codex full-app kit

This repository is a working premium WOYKE static frontend plus the complete implementation brief Codex needs to turn it into one coherent, stateful end-to-end frontend application.

## First five minutes

1. Open this folder as the Codex working directory.
2. Read `AGENTS.md`.
3. Read every file under `docs/`.
4. Run:

```powershell
node .\scripts\validate.mjs
node .\serve.mjs
```

5. Import the large generated engine image library when the original Next.js repository is available:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\import-engine-assets.ps1 `
  -EnginePath "C:\Users\elvan\Downloads\9684 8883 Ecom platform\9684 8883 Ecom platform\yoke-jewellery" `
  -Force
```

6. Paste `CODEX_MASTER_PROMPT.md` into Codex.

## What is already included

- Premium static WOYKE visual baseline
- Home, shop, product, design, craft, materials, sustainability, consultation, cart, auth, checkout, success, account, saved designs, orders, and share routes
- Browser-native configurator data, product catalogue, preview resolver, cart script, and sizing guides
- Premium photography and workshop media
- Original client references and extracted engine references
- Four-week implementation plan, schemas, route acceptance, QA, and migration guidance
- Validation and engine-asset import scripts

## Important scope boundary

This kit targets a complete frontend demonstration. Real payments, production authentication, inventory, logistics, CRM delivery, and production databases are explicitly outside the four-week static build. The architecture creates clean boundaries for a later production migration.

## Run locally

```powershell
node .\serve.mjs
```

Open `http://127.0.0.1:4187/`.
