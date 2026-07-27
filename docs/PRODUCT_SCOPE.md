# WOYKE product scope — four-week frontend application

## Goal

Turn the current premium WOYKE prototype into one coherent, stateful browser application that demonstrates the complete customer journey and can be deployed publicly on Vercel.

This is a **full frontend application**, not a production commerce backend. Every visible route and cross-route state transition must work. External services are represented through explicit interfaces and honest demo behavior.

## Brand foundation

- Brand: **WOYKE** (pronounced “woke”)
- Tagline: **i am, we are.**
- Personality: warm, precise, expressive maker
- Experience: customer-led, occasion-led, guided custom jewellery
- Visual language: ivory, cream, near-black, restrained champagne gold
- Typography: editorial serif for brand hierarchy; highly legible sans-serif for commerce
- Photography hierarchy: people/campaign, product/macro, craft/process

## In scope

### Discovery and storytelling

- Premium campaign homepage
- Occasion-led discovery
- Collection/shop with search, category filtering, sorting, count, query persistence, and empty states
- Product detail pages driven by shared product data
- Craft page using supplied workshop videos and poster fallbacks
- Materials and sustainability pages using only approved or clearly provisional copy
- Consultation request flow

### Custom design

- All nine jewellery categories
- All supplied conditional configuration steps and category branches
- Interchangeability rules
- Generated preview resolver with exact, representative, and fallback states
- Category-specific sizing and five visual sizing guides
- Price breakdown, engraving, gift options, summary, save, restart, edit, and add-to-cart
- Per-product configurator persistence

### Commerce demonstration

- Shopping bag with configured lines, quantity, edit, remove, clear, and totals
- Demo authentication/session flow
- Conventional checkout with validation
- Immutable mock-order creation before cart clearing
- Real order confirmation based on the newly created local order
- Account overview, saved designs, order history, and sign-out
- Public share links backed by sanitized design snapshots

### Practical quality

- Direct-refresh-safe routes
- Desktop and mobile behavior
- Keyboard operation and visible focus
- Reduced-motion support
- Graceful missing/invalid data states
- Versioned localStorage with migration and recovery
- Validation scripts and handoff documentation

## Explicitly out of scope for this four-week build

- Real payment capture or Stripe production credentials
- Real OTP, email, SMS, or password infrastructure
- Production authentication or authorization
- Live inventory, stone sourcing, logistics, tax, shipping rates, or fulfilment
- Production database or Supabase migration
- Real CRM/Klaviyo submission
- Real PostHog analytics events unless a client key and consent plan are supplied
- AR try-on
- Three.js, WebGL, shader jewellery, or procedural 3D rendering
- Claims about certification, provenance, sustainability, or inventory that are not client-approved
- Unlimited revisions or unbounded catalogue entry

## Definition of done

The application is done only when the acceptance journeys in `ROUTE_ACCEPTANCE.md` work across routes, survive refresh where required, produce no console errors, and pass `node scripts/validate.mjs`.
