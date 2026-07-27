# Production migration — later phase

The four-week deliverable remains a static, stateful frontend demonstration. The repository should be structured so that its repositories and services can later be replaced without rewriting the visual system.

## Intended production direction

- Next.js App Router
- Typed domain and repository boundaries
- Supabase for authenticated customer and application data
- Stripe Checkout or another approved payment provider
- Vercel deployment
- Approved analytics and email/CRM integrations
- Managed product media pipeline

These are migration targets, not permission to add production credentials or external dependencies during the frontend phase.

## Suggested replacement map

| Prototype | Production replacement |
|---|---|
| Product JavaScript fixtures | Catalogue database/API |
| Config option fixtures | Rule and pricing service |
| `localStorage` session | Supabase Auth/session |
| Cart repository | Authenticated cart service |
| Mock checkout service | Stripe/payment orchestration |
| Local orders | Server-created immutable orders |
| Local saved designs | Authenticated design records |
| Local share snapshots | Public read tokens with revocation |
| Consultation repository | CRM/email workflow |
| Root `/images/` | Approved asset manifest/CDN |

## Migration rule

Do not mix a half-configured production service into the demo. Migrate one boundary at a time with environment validation, server-side authorization, audit logs where needed, and rollback behavior.
