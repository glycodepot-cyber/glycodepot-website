import type { Product } from "../cart/types";
import { chemistryForCas } from "../content/chemistry-reference";

/**
 * Text helpers for product pages: CAS number, title, specification rows and
 * meta description. Pure functions over catalogue data, with no runtime imports,
 * so they can be unit-tested directly.
 */

/** True when the last digit of a CAS Registry Number matches its checksum. */
export function isValidCas(cas: string): boolean {
  if (!/^\d{2,7}-\d{2}-\d$/.test(cas)) return false;
  const digits = cas.replace(/-/g, "");
  const body = digits.slice(0, -1).split("").reverse();
  const sum = body.reduce((acc, d, i) => acc + (i + 1) * Number(d), 0);
  return sum % 10 === Number(digits.at(-1));
}

/**
 * The product's CAS number, taken only from its own catalogue data: a
 * `…-cas-<number>` slug or an explicitly labelled "CAS" in its description.
 * Returned only when the checksum is valid, and never for products whose
 * attributes already carry form-specific CAS references (sugar nucleotides).
 */
export function productCasNumber(product: Product): string | null {
  if (Object.keys(product.attributes ?? {}).some(k => /^CAS\b/i.test(k))) return null;
  const fromSlug = product.slug.match(/(?:^|-)cas-(\d{2,7}-\d{2}-\d)(?:-|$)/)?.[1];
  const text = (product.description || product.shortDescription || "").replace(/<[^>]*>/g, " ");
  const fromText = text.match(/\bCAS(?:\s*(?:No\.?|Number|#|RN))?\s*[:#]?\s*(\d{2,7}-\d{2}-\d)\b/i)?.[1];
  const cas = fromSlug ?? fromText;
  return cas && isValidCas(cas) ? cas : null;
}

/**
 * PubChem identity for the product's CAS, when we hold one. This is what turns a
 * page that said only "name + pack sizes" into something a researcher searching
 * a CAS number, or an assistant quoting one, can actually use. Null stays null:
 * a product whose chemistry we have not verified shows no chemistry rows at all.
 */
export function productChemistry(product: Product) {
  return chemistryForCas(productCasNumber(product));
}

/** Specification rows shown on the page and in Product structured data. */
export function productSpecs(product: Product): Record<string, string> {
  const cas = productCasNumber(product);
  const chemistry = chemistryForCas(cas);
  return {
    ...(cas ? { "CAS number": cas } : {}),
    ...(chemistry
      ? {
          "Molecular formula": chemistry.formula,
          "Molecular weight": `${chemistry.molecularWeight} g/mol`,
        }
      : {}),
    ...product.attributes,
    // SKU goes last in the page table: the structured data already carries it as
    // its own `sku` field, so it does not need to lead the property list.
    ...(product.sku ? { SKU: product.sku } : {}),
  };
}

/** Page title: the editor's SEO title, else the name with its CAS number when known. */
export function productTitle(product: Product): string {
  if (product.seoTitle) return product.seoTitle;
  const cas = productCasNumber(product);
  return cas && !product.name.includes(cas) ? `${product.name} (CAS ${cas})` : product.name;
}

function packSizes(product: Product): string[] {
  return product.variants
    .map(v => v.name?.trim())
    .filter((n): n is string => Boolean(n) && !/^other$/i.test(n!));
}

export function productDescription(product: Product): string {
  const cas = productCasNumber(product);
  const chemistry = chemistryForCas(cas);
  const sku = product.sku || product.attributes?.SKU;
  const sizes = packSizes(product);
  // Factual fallback for products with no description: name, verified chemistry,
  // catalogue number and pack sizes, all from our own data. Nothing invented.
  const fallback = `${product.name}${cas ? ` (CAS ${cas})` : ""}` +
    `${chemistry ? `, ${chemistry.formula}, MW ${chemistry.molecularWeight}` : ""}` +
    `${sku ? `, catalog no. ${sku}` : ""}, for laboratory research.` +
    `${sizes.length ? ` Available in ${sizes.join(", ")}.` : ""} Request a quote with lot-specific CoA from GlycoDepot.`;
  const text = (product.seoDescription || product.shortDescription || product.description || fallback)
    .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 170 ? `${text.slice(0, 167).trimEnd()}…` : text;
}
