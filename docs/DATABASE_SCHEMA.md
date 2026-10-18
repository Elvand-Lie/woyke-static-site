# WOYKE database schema

## Migrations

- `202607280001_initial_schema.sql` creates the production schema, indexes, triggers, functions, RLS and policies.
- `202607280002_static_seed.sql` contains deterministic provisional seeds generated from the static application.
- `202607300001_milestone_2_catalogue_sync.sql` adds the saved-design client synchronization key.
- `202607300002_sync_constraint.sql` makes customer/design synchronization conflict-safe.
- `202607300003_publish_interest_catalogue.sql` publishes the five authorized provisional interest-test products.
- `202607300004_fix_category_names.sql` repairs the generated category names.
- `202608030001_publish_complete_existing_catalogue.sql` exposes the complete existing 25-piece provisional collection.

## Main domains

- Identity: `profiles`, `roles`, `customer_addresses`
- Catalogue: `categories`, `products`, `product_media`, `skus`
- Stock: `inventory`, `inventory_adjustments`
- Configurator: `configurator_forms`, `configurator_components`, `configurator_options`, `valid_option_combinations`, `pricing_rules`
- Ownership: `saved_designs`, `saved_design_selections`, `carts`, `cart_items`
- Orders: `orders`, `order_items`, `order_configuration_snapshots`, `order_status_history`
- Payments: `payments`, `stripe_event_records`
- Administration: `admin_audit_logs`, `content_blocks`, `translations`

## Verified remote invariants

- 27 public tables, 31 foreign keys, 23 unique constraints and 70 indexes.
- RLS and timestamp triggers enabled on all 27 public tables.
- 30 policies enforce public catalogue reads, customer isolation and admin read boundaries.
- Customer roles cannot write orders, payments, inventory, fulfilment, audit records or pricing rules.
- Saved-design synchronization is unique per `(owner_id, client_sync_id)`.
- Cart synchronization is unique per `(cart_id, configuration_fingerprint)`.
- Stripe event IDs are unique.
- Public design access returns only the sanitized `get_shared_design(token)` result.
- Money is integer SGD minor units; order items retain immutable product/configuration snapshots.

## Development seed

The remote project contains 9 categories, 25 products, 50 media rows, 25 inactive SKUs, 25 zero-stock inventory rows, 71 configurator components, 458 options, 6 valid-option rules and 1,013 draft translations. All 25 existing product studies are now published for the collection experience. They remain provisional, with inactive SKUs and zero inventory, and do not replace the final client-approved catalogue.