# WOYKE Supabase setup

## Local application

The production app reads ignored `production/.env.local`. Never place the Supabase secret key or database URL in a `NEXT_PUBLIC_*` variable.

The Supabase direct database host is IPv6-only. This Windows environment uses the Singapore IPv4 session pooler (`aws-0-ap-southeast-1.pooler.supabase.com:5432`) with the pooler user `postgres.<project-ref>`. Percent-encode password characters in connection URLs; square brackets shown in Supabase examples are placeholder notation, not password characters.

```powershell
cd production
pnpm install
pnpm dev
```

## Database migrations

All six migrations through `202607300004_fix_category_names.sql` are applied to the development project. Future changes must be added as new migrations; do not reset the remote project.

```powershell
cd production
supabase db push --dry-run --include-all --db-url $env:DATABASE_URL
supabase db push --include-all --db-url $env:DATABASE_URL
```

## Authentication

Supabase Auth owns credentials and sessions. `handle_new_user` creates the profile and customer role. Admin roles are granted only from a trusted server context.

Email/password registration, login and logout are wired. Public confirmation requires an approved sending domain, deliverable test address and allowed callback URL. Phone login remains disabled at Supabase while `SMS_PROVIDER=mock`.

For development-only accounts, set `DEV_ACCOUNT_EMAIL`, `DEV_ACCOUNT_PASSWORD`, optional `DEV_ACCOUNT_NAME`, and `DEV_ACCOUNT_ROLE=customer|admin`, then run `pnpm account:create` from `production/`.

## Storage

Create private administrative upload buckets and public delivery rules only after the client approves the media workflow. Never use the service key in browser upload code.