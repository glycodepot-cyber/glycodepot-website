import type { Product } from "@/lib/cart";
import { productStructuredData, serializeJsonLd } from "@/lib/seo/product-data";

export function ProductJsonLd({ product, url }: { product: Product; url: string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{
    __html: serializeJsonLd(productStructuredData(product,url)),
  }} />;
}
