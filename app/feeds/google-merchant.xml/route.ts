import { listCategories, listProducts } from "@/lib/cart/client";
import { buildMerchantFeed } from "@/lib/seo/merchant-feed";

/**
 * Served at /feeds/google-merchant.xml and registered in Merchant Center as a
 * primary product source. A real feed supersedes the "Found by Google" crawl,
 * which was ingesting the whole catalogue — most of it quote-only — and
 * disapproving the overwhelming majority for "missing product price".
 *
 * The feed reads the same prebaked catalogue the site renders from, so feed
 * price and landing-page price cannot drift apart: both come from
 * `applyPricePolicy`. See lib/seo/merchant-feed.ts for the rules it enforces.
 */

export const runtime = "nodejs";
// Rebuilt with the daily catalog prebake; a stale price is a policy problem,
// so this is never served from an indefinite cache.
export const revalidate = 3600;

export async function GET() {
  const categories = await listCategories();
  // One page large enough for the whole catalogue; listProducts paginates.
  const { items: products } = await listProducts({ page: 1, pageSize: 100000 });

  const xml = buildMerchantFeed(products, categories);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
