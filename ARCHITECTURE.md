# WOYKE Static Architecture

## Design principle

Photography carries desire. Product detail establishes trust. Workshop video proves craft. Commerce controls remain conventional. Motion is limited to masked reveals, image changes, restrained optical scaling and viewport-aware video playback.

## Route map

### Discovery
- `/` — campaign homepage, occasion discovery, interchangeability, craft, collection and materials
- `/shop/` — collection discovery and filtering
- `/product/` — editorial product detail
- `/materials/` — material and evidence story
- `/craft/` — process footage
- `/consultation/` — private-service request

### Design and purchase
- `/design/` — 11-step photo-first configurator demonstration
- `/cart/` — shopping bag
- `/auth/` — demonstration phone/password/OTP flow
- `/checkout/` — contact, delivery and payment-method layout
- `/checkout/success/` — confirmation state

### Ownership
- `/account/` — account overview
- `/account/designs/` — saved designs
- `/account/orders/` — order journey
- `/share/` — private design presentation

## Asset structure

- `assets/media/images/` — client product imagery, generated lifestyle imagery and approved prototype product studies
- `assets/media/videos/` — short H.264 process and product loops
- `assets/media/posters/` — static video fallbacks
- `assets/css/site.css` — tokens, responsive layouts and lightweight motion
- `assets/js/site.js` — shared header, footer, section theming and viewport video behavior
- `assets/js/home.js` — occasion, craft and featured-collection interaction
- `assets/js/design.js` — configurator demonstration state
- `assets/js/commerce.js` — static auth, checkout and share interactions

## Production migration

Keep the HTML structure and visual components, then move data and state behind APIs:

- Product fixtures → catalogue API
- Configurator options and prices → rule/pricing service
- Static images → approved product asset manifest or renderer
- Local demo authentication → real account and OTP service
- Static checkout → payment, inventory, shipping and order services
- Account pages → authenticated customer data
- Process copy and material claims → client-approved evidence
