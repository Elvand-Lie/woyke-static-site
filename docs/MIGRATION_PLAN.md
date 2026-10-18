# WOYKE incremental production migration

## Rule

The root static application remains runnable until a Next route has equivalent state, responsive behaviour and browser coverage. Production work is isolated under `production/`.

## Route order

1. Foundation and homepage - complete
2. Authentication and session refresh
3. Catalogue and product detail
4. Configurator and saved designs
5. Cart and authenticated checkout
6. Stripe payment orchestration and webhook
7. Orders and customer account
8. Protected administration
9. Content, translations and provider adapters
10. Full responsive, accessibility and security validation

## Data migration

- Static catalogue and configurator fixtures become draft Supabase seeds.
- Client-approved products replace provisional product rows through an import.
- Existing anonymous designs and carts remain local until authenticated synchronization is implemented.
- No local demo order or payment record becomes a production order.

## Cutover

The current Vercel static project remains unchanged during migration. The Next app should use a separate preview project or a Vercel project configured with `production/` as its root. Public domain cutover occurs only after route parity and production environment checks.
