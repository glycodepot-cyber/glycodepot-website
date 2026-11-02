/** Permanent public origin selected by the site owner. Preview pages also canonicalize to production. */
export const SITE_URL = "https://www.glycodepot.com";

export function canonicalSiteUrl(value: string | undefined, fallbackPath: string): string {
  if (value) {
    try {
      const url = new URL(value, SITE_URL);
      if (["glycodepot.com", "www.glycodepot.com"].includes(url.hostname) && url.pathname.startsWith("/products/")) {
        return `${SITE_URL}${url.pathname.replace(/\/+$/, "")}`;
      }
    } catch { /* Invalid imported canonical falls back to the current product. */ }
  }
  return `${SITE_URL}${fallbackPath}`;
}
