# WOYKE Stripe setup

## Current state

Stripe test publishable and secret keys are configured in the ignored environment. `STRIPE_WEBHOOK_SECRET` is empty. No payment success is simulated and no card data is stored.

## Local webhook setup

1. Install and authenticate the Stripe CLI.
2. Run `stripe listen --forward-to http://localhost:3000/api/stripe/webhook`.
3. Copy the returned `whsec_...` value into `production/.env.local` as `STRIPE_WEBHOOK_SECRET`.
4. Restart the Next development server.
5. Use Stripe test-mode events only.

## Required implementation boundary

The checkout phase must create a server-side PaymentIntent or Checkout Session from database prices. `/api/stripe/webhook` must verify the raw request, insert the unique Stripe event ID, ignore duplicates, and update payment/order state inside a retry-safe transaction.

The browser redirect or success page is never payment proof.
