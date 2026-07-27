# WOYKE data and state contract

## Storage strategy

Use a single versioned storage adapter over `localStorage`. Repositories must validate data when reading and recover from malformed JSON without crashing a route.

Recommended keys:

```text
woyke.session.v1
woyke.cart.v1
woyke.designs.v1
woyke.orders.v1
woyke.shares.v1
woyke.consultations.v1
woyke.configurator.v1.<productSlug>
```

Every stored document should contain:

```js
{
  schemaVersion: 1,
  updatedAt: "ISO-8601",
  data: ...
}
```

## Shared primitives

- IDs: collision-resistant string generated in the browser
- Dates: ISO-8601 UTC strings; format only at render time
- Currency: SGD; store numeric amounts consistently and never parse formatted strings
- Text: escape before inserting into HTML
- Query values: validate against known products/options before use

## Session

```js
{
  userId,
  displayName,
  email,
  phone,
  isDemo: true,
  createdAt,
  signedInAt
}
```

Never claim that OTP or credential verification occurred when it did not.

## Configurator draft

```js
{
  id,
  productSlug,
  currentStepId,
  selections,
  engraving: { text, font } | null,
  gift: { message, wrapping } | null,
  advancedStonePreferences: object | null,
  preview: { src, match, alt },
  priceBreakdown,
  createdAt,
  updatedAt
}
```

When a branch-changing selection changes, remove values whose steps are no longer active before persisting.

## Price breakdown

```js
{
  currency: "SGD",
  base: 12800,
  adjustments: [
    { stepId, optionValue, label, amount }
  ],
  engraving: 50,
  total: 12850
}
```

Use the supplied option upcharges and engraving rule. Do not infer a production quote from the demo total.

## Cart

```js
{
  id,
  fingerprint,
  productSlug,
  productId,
  productName,
  preview,
  quantity,
  selections,
  selectionLabels,
  engraving,
  gift,
  priceBreakdown,
  unitPrice,
  createdAt,
  updatedAt
}
```

The fingerprint must include the product and normalized configuration. Never merge two lines with different fingerprints.

## Saved design

```js
{
  id,
  ownerUserId,
  name,
  productSlug,
  preview,
  selections,
  selectionLabels,
  engraving,
  gift,
  priceBreakdown,
  createdAt,
  updatedAt
}
```

## Public share snapshot

```js
{
  id,
  designId,
  productSlug,
  productName,
  preview,
  selectionLabels,
  narrative,
  indicativeTotal,
  createdAt,
  revokedAt: null
}
```

Do not include email, phone, delivery address, checkout data, or private account metadata.

## Order

```js
{
  id,
  reference,
  ownerUserId,
  status: "confirmed-demo",
  customer: { name, email, phone },
  delivery: { address1, address2, city, postalCode, country },
  lines: [/* immutable cart snapshots */],
  totals: { subtotal, shipping, total, currency: "SGD" },
  paymentMethodLabel,
  isDemo: true,
  createdAt
}
```

Create and persist this order before clearing the cart. The success route reads this exact record by reference or ID.

## Consultation request

```js
{
  id,
  reference,
  userId: null,
  name,
  email,
  phone,
  preferredContact,
  preferredTime,
  productSlug: null,
  designId: null,
  message,
  isDemo: true,
  createdAt
}
```
