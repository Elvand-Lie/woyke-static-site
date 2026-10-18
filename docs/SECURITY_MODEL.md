# WOYKE security model

## Trust boundaries

- Browser input is untrusted.
- Supabase Auth establishes identity; the UI does not establish authorization.
- RLS isolates customer records.
- Server routes independently verify owner/admin access.
- The Supabase secret key, database URL and Stripe secret remain server-only.

## Commerce

- Product and configurator prices are recalculated from database records.
- Inventory is checked and reserved on the server.
- Orders snapshot product, price and configuration data.
- Customers cannot directly insert or update order, payment or fulfilment state.
- Payment success is accepted only from a verified Stripe webhook.
- Stripe event IDs are unique and processing is idempotent.
- No payment-card data is stored.

## Administration

RLS permits administrative reads where required, but administrative writes are intentionally absent from browser roles. Admin mutations must pass through server routes that verify `is_admin()` and write an `admin_audit_logs` record.

## Milestone 2 verification

Remote tests separately verified anonymous, Customer A, Customer B, authenticated admin and service-role contexts. Customer ownership comes from the verified Supabase session; API payload owner IDs are never trusted. Browser admin roles retain read-only database policies, while admin pages use the service role only after `is_admin()` authorization.

## Public sharing

Saved designs remain private by default. Public access uses an opaque token and returns only `public_snapshot`; customer, address, cart, order and payment fields are excluded.

## Claims and content

Draft products, translations and content are not publicly readable. Unsupported sourcing, certification, sustainability, inventory or fulfilment claims must not be published.
