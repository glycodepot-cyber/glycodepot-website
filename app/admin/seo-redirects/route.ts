import { requireStaff } from "@/lib/admin/auth";
import { listProducts,listCategories } from "@/lib/cart/client";
import { buildLegacyRedirectMap } from "@/lib/seo/legacy-map";
import { SITE_URL } from "@/lib/site-url";

export async function GET() {
  await requireStaff();
  const [catalog,categories]=await Promise.all([listProducts({pageSize:10000}),listCategories()]);
  const redirects=buildLegacyRedirectMap(catalog.items,categories).map(row=>({...row,destination:`${SITE_URL}${row.destination}`}));
  return Response.json({canonicalOrigin:SITE_URL,total:redirects.length,
    coverage:"Current active product slugs, confirmed aliases, current categories and retained product tags. Nested category paths and numbered archive pages are handled by the resolver.",
    unresolvedPolicy:"Unknown or ambiguous products and missing historical tags return 404 until a verified destination is supplied.",
    redirects},{headers:{"Cache-Control":"private, no-store"}});
}
