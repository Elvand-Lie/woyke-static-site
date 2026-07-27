# WOYKE frontend application

A no-build, photo-first static frontend with shared browser-native state for the complete WOYKE demonstration journey.

## Run locally

```powershell
node .\serve.mjs
```

Open `http://127.0.0.1:4187/`.

## Validate

```powershell
node .\scripts\validate.mjs
node .\scripts\state-smoke.mjs
Get-ChildItem .\assets\js -Recurse -Filter *.js | ForEach-Object { node --check $_.FullName }
```

## Deploy to Vercel

From this repository root, with an authenticated Vercel CLI:

```powershell
npx vercel --prod
```

`vercel.json` configures clean, trailing-slash static routes.

## Demo credentials

- Phone: `+65 8123 4567`
- Password: `woyke-demo`
- OTP: `123456`

The login, checkout, orders, consultations and public shares are explicit local demonstrations. No payment, OTP, email, CRM, inventory, fulfilment or production database service is connected.

See `docs/STATUS.md` for completed milestones, routes, storage keys, QA results and limitations.