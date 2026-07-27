# WOYKE static application architecture

## Design principle

Photography carries desire. Product detail establishes trust. Workshop video proves craft. Commerce controls remain conventional. Motion is limited to image changes, restrained reveals and coordinated viewport-aware playback.

## Runtime

- Static HTML and CSS
- Browser-native ES modules
- No build step or runtime dependency install
- Vercel static hosting with direct-refresh-safe route folders
- Schema-v1 `localStorage` repositories for the frontend demonstration

## Route groups

- Discovery: `/`, `/shop/`, `/product/`, `/materials/`, `/sustainability/`, `/craft/`, `/consultation/`
- Design and purchase: `/design/`, `/cart/`, `/auth/`, `/checkout/`, `/checkout/success/`
- Ownership: `/account/`, `/account/designs/`, `/account/orders/`, `/share/`

## JavaScript boundaries

- `assets/js/app/` - formatting, escaping, identifiers, query handling and fingerprints
- `assets/js/data/` - catalogue adapter over the supplied engine product source
- `assets/js/domain/` - configuration normalization and safe totals
- `assets/js/repositories/` - versioned storage plus session, cart, draft, design, order, share and consultation repositories
- `assets/js/services/` - honest demo authentication and idempotent checkout/order orchestration
- `assets/js/pages/` - route-specific controllers and rendering
- `assets/js/design.js` - configurator controller using supplied option/preview data and shared repositories
- `assets/js/site.js` - header, footer, section theming, reduced motion and coordinated video behavior

## Storage

Each key stores `{ schemaVersion: 1, updatedAt, data }`. Repositories validate reads, recover malformed JSON, and migrate the baseline legacy cart, session and configurator values. See `docs/DATA_AND_STATE.md` and `docs/STATUS.md`.

## Production migration

Replace one boundary at a time: product fixtures with a catalogue API, browser session with production auth, cart/orders/designs/shares with authorized services, checkout with payment orchestration, consultation with an approved CRM workflow, and static product media with an approved asset manifest. Do not mix partially configured production services into the local demo.