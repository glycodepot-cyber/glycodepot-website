import type { Category, Product } from "../cart/types";

export const tagSlug = (label: string) => label.toLowerCase().normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Confirmed old indexed URLs or the historical campaign destination.
const productAliases: Record<string, string> = {
  "cmp-neu5ac": "bprd_11425",
  "methyl2346-tetra-o-acetyl-a-d-glucopyranoside": "bprd_13380",
  "methyl2346-tetra-o-acetyl-b-d-glucopyranoside": "bprd_13350",
};

const groupAliases: Record<string,string> = {
  glycochemistry: "glycochemistry", glycobiology: "glycobiology",
  glycoanalysis: "glycoanalysis", "glyco-analysis": "glycoanalysis",
};

function archiveParts(path: string[]) {
  const parts = [...path];
  let page: string | undefined;
  if (parts.length > 2 && parts.at(-2) === "page" && /^\d+$/.test(parts.at(-1)!)) {
    page = parts.pop(); parts.pop();
  }
  return { parts, page };
}

export function productPath(product: Product, categories: Category[]): string | null {
  const category = categories.find(c => c.id === product.primaryCategoryId && product.categories.includes(c.id))
    ?? categories.find(c => product.categories.includes(c.id));
  return category ? `/products/${category.slug}/${product.slug}` : null;
}

export function resolveLegacyPath(pathname: string, products: Product[], categories: Category[]): string | null {
  let decoded: string;
  try { decoded = decodeURIComponent(pathname); } catch { return null; }
  const path = decoded.split("/").filter(Boolean);
  if (path[0] === "shop" && (path.length === 1 || (path.length === 3 && path[1] === "page" && /^\d+$/.test(path[2])))) {
    return path.length === 3 ? `/products?page=${path[2]}` : "/products";
  }
  if (path[0] === "product" && path.length === 2) {
    const slug = path[1].toLowerCase().replace(/[‐‑‒–—]/g,"-");
    const alias = productAliases[slug];
    const matches = products.filter(p => alias ? p.id === alias : p.slug === slug);
    return matches.length === 1 ? productPath(matches[0], categories) : null;
  }
  if (path[0] === "product-category" || path[0] === "product-tag") {
    const {parts, page} = archiveParts(path.slice(1));
    const leaf = parts.at(-1);
    if (!leaf) return null;
    let destination: string | null = null;
    if (path[0] === "product-tag" && products.some(p => p.tags?.some(t => tagSlug(t) === leaf))) {
      destination = `/tags/${leaf}`;
    } else if (groupAliases[leaf]) {
      destination = `/products?group=${groupAliases[leaf]}`;
    } else {
      const category = categories.find(c => c.slug === leaf);
      if (category) destination = `/products/${category.slug}`;
      else if (leaf === "galactosamine" && products.some(p => p.name.toLowerCase().includes("galactosamine"))) {
        destination = "/products?search=galactosamine";
      }
    }
    if (destination && page && Number(page)>1) destination += `${destination.includes("?") ? "&" : "?"}page=${page}`;
    return destination;
  }
  return null;
}

/** Preserve paid-click attribution; translate WordPress shop search and ordering. */
export function legacyDestinationUrl(destination: string, requestUrl: string, origin: string): URL {
  const target = new URL(destination, origin);
  const source = new URL(requestUrl);
  for (const [key,value] of source.searchParams) {
    if (/^utm_/i.test(key) || ["gclid","dclid","gbraid","wbraid"].includes(key)) target.searchParams.set(key,value);
  }
  if (target.pathname === "/products") {
    if (source.searchParams.get("s")) target.searchParams.set("search",source.searchParams.get("s")!);
    const sort = source.searchParams.get("orderby");
    if (sort === "price") target.searchParams.set("sort","price-asc");
    if (sort === "price-desc") target.searchParams.set("sort","price-desc");
  }
  return target;
}

export function buildLegacyRedirectMap(products: Product[], categories: Category[]) {
  const sources = new Set<string>(["/shop/"]);
  products.forEach(p=>sources.add(`/product/${p.slug}/`));
  Object.keys(productAliases).forEach(slug=>sources.add(`/product/${slug}/`));
  categories.forEach(c=>sources.add(`/product-category/${c.slug}/`));
  Object.keys(groupAliases).forEach(slug=>sources.add(`/product-category/${slug}/`));
  products.forEach(p=>p.tags?.forEach(tag=>sources.add(`/product-tag/${tagSlug(tag)}/`)));
  sources.add("/product-category/glycochemistry/building-blocks/monosaccharides/galactosamine/");
  return [...sources].sort().flatMap(source=>{
    const destination=resolveLegacyPath(source,products,categories);
    return destination ? [{source,destination,status:301}] : [];
  });
}
