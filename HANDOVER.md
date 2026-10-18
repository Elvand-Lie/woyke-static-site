# WOYKE Website — Project Handover

Last updated: 2026-10-18
Prepared by: Elvand Lie Nababan
Repository: https://github.com/Elvand-Lie/woyke-static-site

---

## 1. What is being handed over

The complete WOYKE jewellery web platform, in two parts:

| Part | Location | Live URL | Role |
|---|---|---|---|
| Production application | `production/` (Next.js) | https://woyke-production.vercel.app | The real platform: database, accounts, checkout, admin |
| Static site | repository root (HTML/JS) | https://woyke-static-site.vercel.app | The original site, kept as a rollback target |

Both deployments are live. The application deployment is healthy; the Supabase **database project was found paused on 2026-10-18** (free-tier projects pause automatically after roughly one week of inactivity — it had been idle since early August). The data is retained; restoring the project in the Supabase dashboard brings everything back, including the catalogue, accounts and orders. See Section 9.

> **Operational requirement:** while the project stays on the Supabase free tier, the database will pause again after every idle week and the catalogue, sign-in, checkout and admin routes will fail until it is restored in the dashboard. Before public launch, upgrade the project to a paid plan (or otherwise keep it active). After an account transfer, this responsibility moves to the new owner.

The repository contains **everything**: both sites, all documentation, the full product image library, all supplied media, and the AI-assisted jewellery video drafts.

---

## 2. Technology stack (production application)

- **Next.js 16** (App Router) + **React 19** + **TypeScript 6**
- **Tailwind CSS 4** and **Framer Motion**
- **Supabase** — PostgreSQL database, authentication, Row Level Security
- **Stripe** — Checkout and webhook-driven order completion (currently **test mode**)
- **Zustand** — client state
- **Vercel** — hosting and deployments
- Package manager: pnpm (npm works; build scripts are package-manager independent)

## 3. Database (Supabase)

- Project: `https://lstcdcmaqxumscnjvwdk.supabase.co` (Singapore region)
- 27 tables with Row Level Security enabled on all of them, 30 policies, timestamp triggers, indexes
- 10 versioned migrations under `production/supabase/migrations/` — all applied to the live project without data loss
- Catalogue currently published: **25 provisional products across 9 categories**, 71 configurator components, 458 options, 6 interchangeability rules, 1,013 draft translations
- Products are marked provisional, SKUs inactive and inventory zero **until the client approves the final collection**

## 4. Repository map

```
├── index.html, shop/, product/, cart/, checkout/, account/, auth/, ...
│       The original static site (rollback deployment)
├── assets/               Static-site CSS, JS engine, media (images/videos/posters)
├── production/           The Next.js production application
│   ├── app/              35 routes: shop, product, configurator, cart, checkout,
│   │                     account, admin, consultation, share, auth, API routes
│   ├── supabase/         Database migrations and config
│   ├── scripts/          Seed generation, legacy sync, dev-account tooling
│   ├── tests/            Environment, schema, completion + remote RLS test suites
│   └── public/images/    Full product photography library (508 files)
├── Pictures/             Client-supplied reference photos (WhatsApp set, Aug 2026)
├── Videos/               Client-supplied videos + AI-generated ring-video drafts
├── docs/                 21 documents: architecture, schema, security, setup,
│                         QA, deployment plans, milestone handoffs
└── HANDOVER.md           This document
```

Key docs for the incoming team:

- `docs/BACKEND_ARCHITECTURE.md` — how the production app is structured
- `docs/DATABASE_SCHEMA.md` — full data model
- `docs/SECURITY_MODEL.md` — RLS, roles, isolation rules
- `docs/SUPABASE_SETUP.md` / `docs/STRIPE_SETUP.md` — service configuration
- `docs/PRODUCTION_COMPLETION_HANDOFF.md` — verified state + remaining launch blockers
- `docs/CLIENT_DEPENDENCIES.md` — everything the client must supply before launch
- `docs/STATUS.md` — the full milestone log (Milestones 0–14)

## 5. Environment variables

Secrets are **not** committed to the repository (`.env` and `.env.local` are git-ignored). The runtime values currently live in the Vercel project environment settings and in the local `.env.local` files — transfer them through a secure channel (password manager / shared vault), not chat.

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose | Where the new owner gets it |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Canonical app URL | Set to the final domain |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public (anon) key — safe for the browser | Supabase → Project Settings → API |
| `SUPABASE_SECRET_KEY` | Server-side service key — **secret** | Supabase → Project Settings → API |
| `DATABASE_URL` | Postgres connection (session pooler) | Supabase → Project Settings → Database |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | Stripe → Developers → API keys |
| `STRIPE_SECRET_KEY` | Stripe secret key — **secret** (test mode) | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe → Developers → Webhooks |
| `SMS_PROVIDER` / `EMAIL_PROVIDER` / `ANALYTICS_PROVIDER` | `mock`/`disabled` until real providers are connected | Chosen by client |

Optional, to be added when the client connects these services:
`KLAVIYO_PRIVATE_API_KEY`, `POSTHOG_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

## 6. Running locally

Prerequisites: Node.js 20+, pnpm (or npm).

```bash
# Static site (no build step)
node serve.mjs          # or: RUN_WINDOWS.bat

# Production application
cd production
pnpm install
cp ../.env.example .env.local   # fill in values
pnpm dev                        # http://localhost:3000
```

Full validation before any release:

```bash
pnpm validate           # seed check + typecheck + lint + tests + build
pnpm test:remote        # remote database / RLS verification
```

## 7. Deployment

- Both Vercel projects live in one Vercel team and are connected to this GitHub repository:
  - `woyke-static-site` — deploys from the repository root
  - `woyke-production` — deploys from the `production/` subdirectory (root directory setting)
- Pushing to `main` triggers both deployments automatically; no manual CLI step is required.
- Manual/CLI alternative: `vercel --prod` from the respective directory (see `docs/DEPLOYMENT_PLAN.md`).
- Rollback: the static site remains a fully functional fallback at `woyke-static-site.vercel.app`.

## 8. Access & account transfer checklist

The items below must be transferred to (or recreated under) client-owned accounts. Until each transfer completes, the corresponding account remains under the developer's control.

**Developer-owned — transfer to client:**

- [ ] **GitHub repository** `Elvand-Lie/woyke-static-site` — transfer via GitHub Settings → Transfer ownership, or add the client as a collaborator
- [ ] **Vercel team + 2 projects** (`woyke-static-site`, `woyke-production`) — invite the client (or transfer team ownership) via Vercel → Settings → Members
- [ ] **Supabase project** `lstcdcmaqxumscnjvwdk` — invite the client as owner or transfer the organization via Supabase → Org settings
- [ ] **Stripe account + test keys** — hand over account access; the incoming developer must rotate the secret key and create a fresh webhook endpoint (which generates a new `STRIPE_WEBHOOK_SECRET`) and update it in Vercel
- [ ] **Local `.env.local` secret values** — share via password manager, never chat
- [ ] **Domain / DNS** (if a custom domain such as `woyke.com` is used later) — point it at the Vercel projects

**Client-owned — to be created and connected by the client (currently mocked/disabled):**

- [ ] SMS provider account + approved sender ID and OTP templates (for real phone verification)
- [ ] Klaviyo account, API key, and approved consultation/customer flows
- [ ] PostHog project key + analytics consent decision
- [ ] Cloudinary account + upload preset policy (admin media uploader activates automatically once connected)
- [ ] Final approved copy: Chinese translations, delivery/returns/privacy/terms, materials claims, lead times

## 9. Verified state at handover

- Production build passes with all 35 routes; typecheck, lint, full test suite, remote RLS tests and seed drift check all pass.
- The application deployment itself is healthy: all editorial routes return 200 and `/api/health` confirms database, Supabase, Stripe and Stripe webhook configuration (note: the health endpoint verifies that configuration is present — it does not ping the database).
- **Database outage at handover date (2026-10-18):** the Supabase project was paused by the free-tier inactivity policy, so database-backed routes (`/shop`, `/api/catalogue`, sign-in, checkout, admin) return errors until the project is restored in the Supabase dashboard. This is a hosting-account action, not a code fault; no data is lost by pausing. Restore steps: log in at supabase.com with the project owner account → select the project → **Restore project** (takes a few minutes) → re-check `/shop`.
- Browser-accepted journeys (all passing when the database was active): full configurator → save → share → consult → cart → checkout validation → admin, on desktop and 375px mobile, with zero console errors and no layout overflow (40 route/viewport combinations).
- Customer/admin data isolation verified against the live database.
- All 8 supplied jewellery videos are placed and playing on the live site (homepage, Our Craft, Design, Materials).

## 10. Outstanding before public launch (client-owned inputs)

1. **Final catalogue** — approved pieces, prices, SKUs, inventory and final photography to replace the 25 provisional products.
2. **Stripe live mode** — activate live keys, complete one controlled end-to-end live payment, verify webhook-driven order completion.
3. **Chinese translations** — approve and load the full translation set (drafts exist in the database).
4. **SMS provider** — connect a real provider so phone-verification codes are delivered.
5. **Klaviyo / PostHog / Cloudinary credentials** — connect to enable email flows, analytics and media uploads.
6. **Legal & operations copy** — delivery, returns, privacy, terms, materials claims, lead times, fulfilment ownership.

None of these are code blockers — the platform is built to accept them as configuration/content.

## 11. Content assets in this package

- `Pictures/` — the client-supplied reference photography (August 2026 WhatsApp set).
- `Videos/` — supplied videos plus the AI-generated campaign drafts:
  - Hand-wearing-ring rotation film: `Locked_off_camera_The_left_ha_cropped.mp4` (client-approved direction)
  - Kite-spin film: `Locked_off_camera_Both_hands_cropped.mp4` (client-approved draft)
  - Later spin iterations with known artefacts are kept for reference only.
- These were prepared for the client's Instagram interest test and are independent of the website build.

## 12. Handover acceptance

On acceptance, the incoming owner should:

1. Restore the Supabase project if it is paused (see Section 9) — then keep it active (paid plan recommended for launch).
2. Gain access to all five accounts in the checklist above and rotate every secret key.
3. Run `pnpm validate && pnpm test:remote` from `production/` to confirm the toolchain works in their hands.
4. Trigger a Vercel deployment from the transferred repository and re-check `/shop` and `/api/health`.
5. Schedule the remaining client inputs (Section 10) with the client directly.
