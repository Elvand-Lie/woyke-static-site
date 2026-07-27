# WOYKE QA and handoff

## Automated checks

Run from the repository root:

```powershell
node .\scripts\validate.mjs
```

The check must cover:

- Required routes and root files
- Local HTML asset references
- JavaScript syntax
- Missing sizing guides
- Absolute local filesystem paths
- Accidental Three.js/WebGL/shader dependencies
- Missing generated-preview directory as a warning rather than a false success

## Manual browser checks

Start the server:

```powershell
node .\serve.mjs
```

Open:

```text
http://127.0.0.1:4187/
```

Execute every journey in `ROUTE_ACCEPTANCE.md` in a clean browser profile. Repeat the primary purchase journey at 375px and desktop width.

## Console and network

- No uncaught JavaScript errors
- No repeated 404s for local application assets
- Missing generated preview assets must fall back visibly and honestly
- No request to absolute Windows paths, localhost production endpoints, or competitor domains
- No external font or script dependency required for core use

## Content review

Before client handoff, mark each claim as one of:

- Client approved
- Clearly provisional/demo
- Removed

This is especially important for sourcing, lab-harvested stones, sustainability, certification, lead time, price, warranty, returns, inventory, and delivery.

## Deployment

- Deploy the folder containing root `index.html`, `assets/`, `design/`, and `vercel.json`
- Production branch: `main`
- Verify production deployment protection is disabled
- Test in incognito while signed out of Vercel
- Directly load every route, not only through homepage navigation

## Final Codex report

Codex must update `STATUS.md` and report:

1. Files created and changed
2. Architecture and repositories introduced
3. Storage keys and schema versions
4. Completed routes
5. Acceptance journeys run
6. Automated check results
7. Browser/device checks
8. Known limitations
9. Client inputs still required
10. Exact local run and Vercel deployment steps
