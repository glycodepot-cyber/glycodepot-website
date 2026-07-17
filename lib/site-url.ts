/**
 * Single source of truth for the public site URL.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel env vars when DNS cutover to
 * glycodepot.com happens — every canonical link, OG image URL, sitemap
 * entry, robots.txt host, and JSON-LD url updates automatically. No code
 * change needed at cutover time.
 *
 * Default is the staging Vercel URL so dev/preview builds always work.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://glycodepot-web.vercel.app"
).replace(/\/+$/, "");
