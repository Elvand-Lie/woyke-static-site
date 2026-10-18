# Production milestone 1 handoff

## Outcome

Phase 1 foundation and Phase 2 repository schema are complete. The static application remains unchanged as the public rollback target. The production Next app is runnable under `production/`.

## Changed files

### Repository

- `.gitignore`
- `scripts/validate.mjs`
- `docs/STATUS.md`
- `docs/BACKEND_ARCHITECTURE.md`
- `docs/CLIENT_DEPENDENCIES.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/DEPLOYMENT_PLAN.md`
- `docs/MIGRATION_PLAN.md`
- `docs/PRODUCTION_MILESTONE_1_HANDOFF.md`
- `docs/SECURITY_MODEL.md`
- `docs/STRIPE_SETUP.md`
- `docs/SUPABASE_SETUP.md`
- `docs/TESTING.md`

### Next application and configuration

- `production/package.json`
- `production/pnpm-lock.yaml`
- `production/pnpm-workspace.yaml`
- `production/tsconfig.json`
- `production/next-env.d.ts`
- `production/next.config.ts`
- `production/postcss.config.mjs`
- `production/eslint.config.mjs`
- `production/app/globals.css`
- `production/app/legacy.css`
- `production/app/legacy-home.css`
- `production/app/legacy-home.html`
- `production/app/layout.tsx`
- `production/app/page.tsx`
- `production/app/api/catalogue/route.ts`
- `production/app/api/health/route.ts`
- `production/components/site-chrome.tsx`
- `production/lib/env/public.ts`
- `production/lib/env/server.ts`
- `production/lib/stripe.ts`
- `production/lib/supabase/admin.ts`
- `production/lib/supabase/browser.ts`
- `production/lib/supabase/server.ts`
- `production/scripts/generate-supabase-seed.mjs`
- `production/scripts/sync-legacy-home.mjs`
- `production/tests/environment.test.mjs`
- `production/tests/schema.test.mjs`

### Supabase

- `production/supabase/config.toml`
- `production/supabase/migrations/202607280001_initial_schema.sql`
- `production/supabase/migrations/202607280002_static_seed.sql`

### Homepage runtime assets

- `production/public/assets/js/home.js`
- `production/public/assets/media/images/bracelet-bar.webp`
- `production/public/assets/media/images/bracelet-charm.webp`
- `production/public/assets/media/images/bracelet-radiant.webp`
- `production/public/assets/media/images/hero-portrait.webp`
- `production/public/assets/media/images/hero-wide.webp`
- `production/public/assets/media/images/jade-dark.webp`
- `production/public/assets/media/images/jade-final-statement.webp`
- `production/public/assets/media/images/necklace-emerald.webp`
- `production/public/assets/media/images/necklace-heart.webp`
- `production/public/assets/media/images/necklace-princess.webp`
- `production/public/assets/media/images/ring-pear-close.webp`
- `production/public/assets/media/images/ring-radiant-floral.webp`
- `production/public/assets/media/posters/adjustment.jpg`
- `production/public/assets/media/posters/assembly.jpg`
- `production/public/assets/media/posters/finish.jpg`
- `production/public/assets/media/posters/polish.jpg`
- `production/public/assets/media/posters/setting.jpg`
- `production/public/assets/media/videos/adjustment.mp4`
- `production/public/assets/media/videos/assembly.mp4`
- `production/public/assets/media/videos/finish.mp4`
- `production/public/assets/media/videos/polish.mp4`
- `production/public/assets/media/videos/setting.mp4`

Ignored local files are not part of the handoff: `production/.env.local`, `production/node_modules/`, `production/.next/`, `production/supabase/.temp/` and TypeScript build metadata.

## Validation completed

- TypeScript: pass
- ESLint: pass
- Environment secret-boundary test: pass
- Required schema/RLS tests: pass
- Seed drift check: pass
- Next optimized production build: pass
- Static state smoke: pass
- Static validator: 6 pass, 1 expected Windows nested-process warning, 0 failures
- Local homepage and required homepage assets: HTTP 200
- Health route: Supabase and Stripe valid; database URL and Stripe webhook secret invalid/missing as expected

## Blockers

- `DATABASE_URL` contains a placeholder database password, so migrations cannot connect to the development project.
- Supabase reports no SMS provider enabled, so phone OTP cannot be tested.
- `STRIPE_WEBHOOK_SECRET` is empty until Stripe CLI or a deployed webhook endpoint provides a signing secret.
- Final client catalogue, stock, product media and valid combinations remain outstanding.
- Visual browser automation could not initialize in the current desktop session.
