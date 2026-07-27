# WOYKE route and journey acceptance

## Required routes

| Route | Acceptance |
|---|---|
| `/` | Campaign homepage loads, all primary calls to action resolve, videos do not all autoplay simultaneously |
| `/shop/` | Shared catalogue, search, filters, sort, count, empty state, product links |
| `/product/?product=<slug>` | Shared product detail, invalid-slug state, customize and cart actions |
| `/design/?product=<slug>` | Full conditional configurator, preview, guide, validation, save, cart |
| `/cart/` | Persistent configured lines, quantity, edit, remove, clear, totals |
| `/auth/` | Explicit demo sign-in, return URL, session persistence |
| `/checkout/` | Guard/guest handling, form validation, order snapshot, submit protection |
| `/checkout/success/?order=<id>` | Loads actual order; no duplicate creation on refresh |
| `/account/` | Session-aware overview and derived metrics |
| `/account/designs/` | Open, edit, duplicate, share, remove saved designs |
| `/account/orders/` | Persisted orders and useful empty state |
| `/share/?id=<id>` | Public sanitized design snapshot and invalid/revoked state |
| `/consultation/` | Validation, optional product/design prefill, local reference receipt |
| `/craft/` | Muted, inline, poster-backed, viewport-aware videos |
| `/materials/` | Editorial content with no unsupported claims |
| `/sustainability/` | Approved/provisional copy clearly handled |

## Journey A — browse to configured cart

1. Open `/shop/` directly.
2. Filter to rings and search for a known product.
3. Open its product detail.
4. Start designing.
5. Complete required steps.
6. Verify price and preview update.
7. Add to cart.
8. Refresh `/cart/`.
9. Confirm configured preview, specification, price, and quantity remain.

## Journey B — branch integrity

1. Begin a ring configuration.
2. Select ring-specific options.
3. Navigate back and change category to necklace.
4. Verify ring-only steps disappear.
5. Verify ring-only selections are removed from summary, persistence, cart, and price.
6. Verify current step remains valid rather than becoming blank.

## Journey C — sizing guides

For ring, bracelet, bangle, necklace/pendant, and anklet:

1. Reach the sizing step.
2. Open the correct guide.
3. Verify accessible close behavior by pointer, Escape, and focus return.
4. Verify the image is readable without horizontal page overflow on mobile.

## Journey D — save, authenticate, and resume

1. Configure a design while signed out.
2. Choose Save Design.
3. Sign in through the clearly labelled demo flow.
4. Return to the design and save it.
5. Refresh `/account/designs/`.
6. Open and edit the saved design.

## Journey E — checkout and order

1. Add at least two different configured lines.
2. Open checkout and submit invalid fields; verify inline errors.
3. Complete valid demo details.
4. Submit once.
5. Verify one order is created before the cart is cleared.
6. Verify success loads that order.
7. Refresh success and confirm no duplicate order.
8. Confirm the order appears under `/account/orders/`.

## Journey F — share safely

1. Create or open a saved design.
2. Generate a share record.
3. Open `/share/?id=<id>` while signed out.
4. Confirm the design is visible.
5. Confirm no account, contact, delivery, or payment information is present.
6. Test missing and revoked IDs.

## Journey G — consultation

1. Open consultation from a product or saved design.
2. Verify context is prefilled from validated query parameters.
3. Submit invalid data and verify errors.
4. Submit valid data and receive a local demo reference.
5. Verify the UI does not claim a real email or CRM delivery.

## Responsive and accessibility matrix

Test at minimum:

- 375 × 812
- 768 × 1024
- 1024 × 768
- 1440 × 900

At each relevant route verify:

- No horizontal overflow
- Visible focus
- Keyboard activation
- Labels for controls
- Dialog focus and Escape behavior
- No content hidden beneath sticky/fixed actions
- Reduced-motion behavior
- Meaningful image alt text
