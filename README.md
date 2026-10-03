# GlycoDepot storefront

Next.js 16 (App Router) storefront for [glycodepot.com](https://glycodepot.com).
Catalog comes from **BysonHub**, payments from **Stripe** (created by BysonHub),
auth from **Clerk**. Hosted on Vercel.

> Migration in progress: when `DATABASE_URL` is configured, the storefront now
> reads the first-party GlycoDepot catalog database before using the legacy
> prebaked/BysonHub fallback. `/admin` provides the initial product editor.

## Getting started

```bash
npm install
npm run dev
```

Requires `.env.local` (never committed — see **Environment** below).

## Architecture

| Concern | Where | Notes |
| --- | --- | --- |
| Catalog source | `lib/api/bysonhub.ts` | BysonHub External Partner API. Server-only — the API key must never reach the browser. |
| BysonHub → domain mapping | `lib/api/bysonhub-map.ts` | Raw API shapes → `lib/cart/types.ts`. |
| Catalog data | `lib/data/catalog.json` | ~8.7 MB, **generated at build time** by `scripts/prebake-catalog.mjs` (runs on `prebuild`). Statically imported, so it must exist for the build to compile. |
| Catalog reads | `lib/cart/client.ts` | Prefers the prebake; falls back to the live API, then to mocks. |
| Checkout | `lib/cart/actions.ts` | Posts `product_id`/`variant_id`/`quantity` to BysonHub. **BysonHub computes the price** and returns a Stripe `payment_link`. |
| Auth | Clerk hosted Account Portal | `/my-account` redirects to `accounts.glycodepot.com`. Deliberately not embedded — the Clerk dashboard is configured for Account Portal mode. |

## Pricing semantics (important)

BysonHub's price fields do **not** follow WooCommerce conventions:

- `regular_price` → **what the customer actually pays**
- `compare_price` → **"Compare at price"** — the higher, struck-through figure
  (named `sale_price` until BysonHub renamed it on 2026-07-17; values unchanged)

Verified across the full catalog: of the 54 variants with `compare_price` set,
every one is *above* `regular_price`; none is a discount. The mappers guard on
`compare > price` regardless and drop anything that isn't, so a genuine discount
can never render as a struck-through price *below* the live price.

> ⚠️ **The pricing logic is duplicated** across `lib/api/bysonhub-map.ts`
> (TypeScript, runtime) and `scripts/prebake-catalog.mjs` (plain `.mjs`, build
> time — it cannot import the TS mapper). **Change both or neither.** They have
> silently drifted before.

## Catalog refresh

The site serves the build-time prebake, so **catalog changes only appear when the
site rebuilds**. Rebuilds happen on:

1. Any push to `main` (Vercel auto-deploy), or
2. The daily cron in `vercel.json` (`0 7 * * *`), which hits
   `/api/refresh-catalog` → fires `VERCEL_DEPLOY_HOOK_URL` → new build.

The cron is a **no-op unless `VERCEL_DEPLOY_HOOK_URL` is set**. On Vercel's Hobby
plan crons run at most **once per day** with **±59 min** precision, so a price
edit can take up to ~24 h to appear. Faster refresh requires the Pro plan.

## Environment

Set in Vercel project settings; locally in `.env.local` (gitignored).

| Variable | Purpose |
| --- | --- |
| `BYSONHUB_API_URL` / `BYSONHUB_API_KEY` | Catalog + order API. Server-only. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk auth. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, OG tags, sitemap. |
| `VERCEL_DEPLOY_HOOK_URL` | Required for the refresh cron to do anything. |
| `CRON_SECRET` | Shared secret; `/api/refresh-catalog` rejects calls without it. |
| `DATABASE_URL` | Neon PostgreSQL connection string for the unified catalog. |
| `ADMIN_EMAILS` | Comma-separated Clerk email addresses allowed into `/admin`. |

## Unified catalog migration

1. Provision Neon PostgreSQL in the Vercel Marketplace and set `DATABASE_URL`.
2. Set `ADMIN_EMAILS` to the GlycoDepot administrator email address.
3. Run a validation-only import:
   `npm run import:products -- /path/to/products-export.xlsx`
4. Apply the schema and import:
   `npm run import:products -- /path/to/products-export.xlsx --apply`
5. Verify `/admin`, product search, category pages and checkout before removing
   the BysonHub environment variables.

The importer merges the latest spreadsheet stock/pricing with the descriptions,
images and variants in `lib/data/catalog.json`. It deduplicates legacy cache
rows by stable BysonHub product ID and records each import checksum.

## Notes

- `scripts/product-images/` is gitignored — ~98 MB of regenerable scratch output
  from the one-off image-migration scripts.
- CSP lives in `next.config.ts`. It must allow Clerk's custom domains and
  `worker-src 'self' blob:` — Cloudflare Turnstile spawns its bot-check worker
  from a `blob:` URL, and without it sign-up silently fails.
