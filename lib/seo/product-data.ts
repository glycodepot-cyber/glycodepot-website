import type { Product } from "../cart/types";
import { SITE_URL } from "../site-url";
import { isQuotePriceCents } from "../cart/price-policy";

export function productDescription(product: Product): string {
  const text = (product.seoDescription || product.shortDescription || product.description ||
    `${product.name}: request product specifications and lot documentation from GlycoDepot.`)
    .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 170 ? `${text.slice(0, 167).trimEnd()}…` : text;
}

export function productStructuredData(product: Product, url: string) {
  // Every priced pack is a separate offer. RFQ markers must never become prices.
  const packs = product.variants.filter(v => v.price && !isQuotePriceCents(Math.round(v.price.amount * 100)));
  const offers = packs.length ? packs.map(v => ({
    "@type": "Offer", url, name: v.name || product.name, sku: v.sku || v.id,
    priceCurrency: v.price!.currency, price: v.price!.amount.toFixed(2),
    availability: `https://schema.org/${v.inStock ? "InStock" : "OutOfStock"}`,
    seller: { "@type": "Organization", name: "GlycoDepot", url: SITE_URL },
  })) : product.variants.length === 0 && product.price && !isQuotePriceCents(Math.round(product.price.amount * 100)) ? [{
    "@type": "Offer", url, priceCurrency: product.price.currency, price: product.price.amount.toFixed(2),
    seller: { "@type": "Organization", name: "GlycoDepot", url: SITE_URL },
  }] : undefined;
  return {
    "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`, url,
    name: product.name, description: product.shortDescription || product.description || productDescription(product),
    sku: product.sku || product.attributes?.SKU || product.id,
    image: product.images.map(image=>new URL(image.src, SITE_URL).href),
    brand: { "@type": "Brand", name: "GlycoDepot" },
    additionalProperty: Object.entries(product.attributes ?? {}).map(([name,value])=>({"@type":"PropertyValue",name,value})),
    ...(offers ? { offers } : {}),
  };
}

export function productBreadcrumbs(category: {name:string;slug:string}, name:string, url:string) {
  return {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[
    {"@type":"ListItem",position:1,name:"Products",item:`${SITE_URL}/products`},
    {"@type":"ListItem",position:2,name:category.name,item:`${SITE_URL}/products/${category.slug}`},
    {"@type":"ListItem",position:3,name,item:url},
  ]};
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
