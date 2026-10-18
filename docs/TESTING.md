# WOYKE production testing

## Production app

From `production/`:

```powershell
pnpm seed:check
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

The local suite verifies server-secret isolation across client modules, all required tables/RLS boundaries, protected commerce-write boundaries, saved-design idempotency and sanitized sharing.

## Real Supabase ownership test

With the development credentials in ignored `production/.env.local`:

```powershell
cd production
pnpm test:remote
```

The test creates temporary Customer A, Customer B and admin accounts, checks anonymous/customer/admin/service behavior, verifies cross-customer isolation and protected-write denial, tests Stripe-event uniqueness and the public share RPC, then removes its users and records.

## Development accounts

Use a new development-only email. Credentials are read from process environment variables and are never printed:

```powershell
cd production
$env:DEV_ACCOUNT_EMAIL="developer@example.test"
$env:DEV_ACCOUNT_PASSWORD="use-a-long-unique-password"
$env:DEV_ACCOUNT_NAME="Development customer"
$env:DEV_ACCOUNT_ROLE="customer" # or admin
pnpm account:create
```

Remove or rotate development accounts from Supabase Auth when they are no longer required. Public registration confirmation should be tested only after an approved sending domain and deliverable test address are available.

## Static regression

From the repository root:

```powershell
node scripts/validate.mjs
node scripts/state-smoke.mjs
```

The completed Milestone 2 run produced 7 static validator passes and a passing repository state smoke test.

## Browser coverage completed

Browser smoke passed for homepage, catalogue, product detail, login, protected account, Saved Designs, cart, customer/admin authorization, four admin read views and logout. The test also created an anonymous cart line and saved design, logged in, confirmed exactly one synchronized database record for each, and observed no console errors.

Keep testing migrated routes at 375x812, 768x1024, 1024x768 and 1440x900 before deployment cutover. Verify direct refresh, keyboard focus, overflow, reduced motion and media loading.