import type { Product } from "@/lib/cart";

interface ProductJsonLdProps {
  product: Product;
  url: string;
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    image: product.images.map((i) => i.src),
    brand: { "@type": "Brand", name: "GlycoDepot" },
    offers: product.price
      ? {
          "@type": "Offer",
          url,
          priceCurrency: product.price.currency,
          price: product.price.amount.toFixed(2),
          availability: product.variants.some((v) => v.inStock)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        }
      : {
          "@type": "Offer",
          url,
          availability: "https://schema.org/InStoreOnly",
          businessFunction: "https://schema.org/Sell",
        },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
