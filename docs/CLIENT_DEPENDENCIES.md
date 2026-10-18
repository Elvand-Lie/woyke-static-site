# WOYKE client dependencies

## Current integration status

- The development Supabase project is connected and all six current migrations are applied.
- The local production connection uses the Singapore IPv4 session pooler; secrets remain ignored.
- SMS and transactional email remain in mock/development mode and do not block the completed catalogue/auth persistence milestone.

## Required before phone and email launch testing

- SMS provider account, sender configuration and approved OTP templates.
- Transactional email provider, verified sending domain, approved templates and a deliverable client test address.
- Production application URL and Supabase redirect allow-list.

## Required before the next commerce integrations

- Stripe webhook signing secret when checkout/webhook work begins.
- Confirm the approved launch payment methods and preferred BNPL provider.
- Klaviyo account, lists and event taxonomy.
- PostHog project key, host and consent decision.
- Cloudinary account, upload preset/folder policy and transformation rules.
- Supabase storage bucket policy and approved media ownership workflow.

## Required before public launch

- Final 100 products with titles, descriptions, categories, prices, SKUs and approved photography.
- Final inventory quantities, low-stock thresholds and valid configuration combinations.
- Approved configuration upcharges and feasibility rules.
- Confirm whether Mandarin or Bahasa is the second launch language.
- Shipping destinations, rates, taxes, lead times and fulfilment workflow.
- Approved returns, warranty, privacy, terms and cookie/analytics consent content.
- Approved material, sourcing, certification and sustainability statements.
- Production Stripe account activation and live webhook signing secret.
- Domain/DNS access and final Vercel ownership.

## Optional later

- BNPL providers beyond the selected launch provider.
- PayNow, Apple Pay and Google Pay after card checkout is stable.
- AI photo conversion add-on.
- Advanced analytics, loyalty, referral, wholesale and native-app work.