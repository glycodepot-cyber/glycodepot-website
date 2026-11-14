import Image from "next/image";
import Link from "next/link";
import { ProductCardQuickAction } from "./ProductCardQuickAction";
import type { Product } from "@/lib/cart";
import { formatMoney } from "@/lib/format";

const productImageUrls: Record<string, string> = {
  "cmp-c9-azido-neu5ac-cmp-c9-azido-sialic-acid": "https://laoycnbsattw3wiy.public.blob.vercel-storage.com/products/CMP-C9-Azido-Neu5Ac.jpg",
  "cmp-neu5ac-2na-cmp-sialic-acid-3063-71-6": "https://laoycnbsattw3wiy.public.blob.vercel-storage.com/products/CMP-N-acetylneuraminicacid.jpg",
  "cmp-neu5az-cmp-azido-sialic-acid": "https://laoycnbsattw3wiy.public.blob.vercel-storage.com/products/CMP-Neu5Az.jpg",
  "cmp-neu5gc-2na-cytidine-5-monophospho-n-glycolylneuraminic-acid-98396-76-0": "https://laoycnbsattw3wiy.public.blob.vercel-storage.com/products/CMP-Neu5Gc.jpg",
  "gdp-6-azido-fucose-gdp-6-n3-fuc": "https://laoycnbsattw3wiy.public.blob.vercel-storage.com/products/GDP-6-N3-Fuc.png",
  "gdp-l-fucose-gdp-l-fuc-148296-47-3": "https://laoycnbsattw3wiy.public.blob.vercel-storage.com/products/GDP-L-Fuc.png",
  "gdp-man": "https://laoycnbsattw3wiy.public.blob.vercel-storage.com/products/GDP-Man.png",
  "udp-2-alkyne-galnac": "https://laoycnbsattw3wiy.public.blob.vercel-storage.com/products/Screenshot-2024-04-23-195052.png",
};

export function HomeProductCard({ product, categorySlug }: { product: Product; categorySlug?: string }) {
  const href = `/products/${categorySlug ?? product.categories[0] ?? "all"}/${product.slug}`;
  const image = product.images[0];
  const imageSrc = productImageUrls[product.slug] ?? image?.src;
  const isQuote = product.price === null;
  const inStockVariants = product.variants.filter((variant) => variant.inStock).length;
  const totalVariants = product.variants.length;
  const stockLabel: { text: string; tone: "good" | "muted" | "warn" } | null = isQuote
    ? { text: "Lead time on quote", tone: "muted" }
    : totalVariants === 0
      ? null
      : inStockVariants === 0
        ? { text: "Out of stock", tone: "warn" }
        : inStockVariants === totalVariants
          ? { text: "In stock", tone: "good" }
          : { text: `${inStockVariants}/${totalVariants} sizes in stock`, tone: "muted" };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[#e1e8dc] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:border-[#16844e]/40 hover:shadow-[var(--shadow-lg)]">
      <Link href={href} className="relative block aspect-square overflow-hidden bg-[#f2f7ed]" aria-label={`View ${product.name}`}>
        {imageSrc ? <Image src={imageSrc} alt={image?.alt || product.name} width={image?.width ?? 600} height={image?.height ?? 600} sizes="(min-width: 1280px) 280px, (min-width: 640px) 34vw, 46vw" className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105" /> : null}
        {product.badge ? <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#12613e]">{product.badge}</span> : null}
      </Link>
      <ProductCardQuickAction product={product} />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="space-y-2">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#193d30] sm:text-[15px]"><Link href={href} className="after:absolute after:inset-0">{product.name}</Link></h3>
          <p className="line-clamp-2 min-h-10 text-xs leading-5 text-[#63776c]">{product.shortDescription?.trim() || product.attributes?.SKU || "Research-grade reagent"}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#edf1e9] pt-3">
          {!isQuote ? (
            <span className="text-sm font-extrabold text-[#173d2e]">{product.variants.filter((variant) => variant.price).length > 1 ? "From " : ""}{formatMoney(product.price)}</span>
          ) : (
            <span className="text-xs font-bold text-[#12613e]">Quote on request</span>
          )}
          {stockLabel ? (
            <span className={`shrink-0 text-[9px] font-extrabold uppercase tracking-[.08em] ${stockLabel.tone === "good" ? "text-[#218450]" : stockLabel.tone === "warn" ? "text-[#a24b42]" : "text-[#758277]"}`}>{stockLabel.text}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
