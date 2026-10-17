import { NextResponse, type NextRequest } from "next/server";
import { listCategories, listProducts } from "@/lib/cart/client";
import { SITE_URL } from "@/lib/site-url";
import { resolveLegacyPath, legacyDestinationUrl } from "./legacy-map";

export async function legacyRedirect(request: NextRequest) {
  const [catalog,categories] = await Promise.all([listProducts({pageSize:10000}),listCategories()]);
  const destination = resolveLegacyPath(request.nextUrl.pathname,catalog.items,categories);
  if (!destination) return new NextResponse("No matching current catalog page was found.",{status:404,headers:{"X-Robots-Tag":"noindex"}});
  return NextResponse.redirect(legacyDestinationUrl(destination,request.url,SITE_URL),{status:301,headers:{"Cache-Control":"public, max-age=3600"}});
}
