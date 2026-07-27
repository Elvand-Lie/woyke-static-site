# Validation report

## Automated checks

Run:

```powershell
node .\scripts\validate.mjs
node .\scripts\state-smoke.mjs
Get-ChildItem .\assets\js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

The repository validator checks routes, HTML asset references, sizing guides, forbidden local paths, and prohibited 3D/WebGL dependencies. On the restricted Windows sandbox, nested process spawning is unavailable and is reported as a warning; the direct `node --check` loop is the authoritative syntax check.

## Browser acceptance completed

- Direct refresh for all required routes, valid/invalid product and share states
- Catalogue query persistence, category filter, search, sort and count
- Configurator completion, branch change, exact/fallback labels and sizing dialog keyboard behavior
- Persistent bag, sign-in return, checkout validation, immutable order, confirmation refresh and order history
- Saved design, duplicate, public share while signed out, and consultation receipt
- No console errors on the 18-route smoke matrix
- No horizontal overflow at 375x812, 768x1024, 1024x768 and 1440x900 on primary routes

See `docs/STATUS.md` for the full handoff record and known production boundaries.