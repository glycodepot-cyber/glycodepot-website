import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/cart";
import { ProductCardQuickAction } from "./ProductCardQuickAction";

const badgeStyles = {
  sale: "bg-[var(--color-accent)] text-white",
  new: "bg-[var(--color-brand)] text-white",
  popular: "bg-[var(--color-brand-soft)] text-[var(--color-brand)]",
  hot: "bg-orange-100 text-orange-800",
} as const;

const badgeLabel: Record<NonNullable<Product["badge"]>, string> = {
  sale: "Sale",
  new: "New",
  popular: "Popular",
  hot: "Hot",
};

interface ProductCardProps {
  product: Product;
  categorySlug?: string;
}

export function ProductCard({ product, categorySlug }: ProductCardProps) {
  const href = categorySlug
    ? `/products/${categorySlug}/${product.slug}`
    : `/products/all/${product.slug}`;
  const image = product.images[0];
  const isQuote = product.price === null;
  // Fallback line for products with no description so the card stays
  // visually balanced. Prefer the SKU attribute, then the empty-string
  // — never raw "undefined".
  const subtitle =
    product.shortDescription?.trim() ||
    product.attributes?.SKU ||
    "Research-grade reagent — Lot tracked";

  // Aggregate stock state across variants.
  // If we have variants: any in-stock → in stock; all out → out of stock.
  // Cards never render "Low stock" today because BysonHub doesn't expose
  // per-variant counts on the prebake — wire when needed.
  const inStockVariants = product.variants.filter((v) => v.inStock).length;
  const totalVariants = product.variants.length;
  const stockLabel: { text: string; tone: "good" | "muted" | "warn" } | null =
    totalVariants === 0
      ? null
      : inStockVariants === 0
        ? { text: "Out of stock", tone: "warn" }
        : inStockVariants === totalVariants
          ? { text: "In stock", tone: "good" }
          : { text: `${inStockVariants}/${totalVariants} sizes in stock`, tone: "muted" };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white transform-gpu transition-all duration-200 hover:-translate-y-1.5 hover:border-[var(--color-brand)]/25 hover:shadow-[var(--shadow-lg)]">
      {/* Image */}
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden bg-white"
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width ?? 600}
            height={image.height ?? 600}
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
            className="h-full w-full object-contain p-3 transform-gpu transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        {product.badge ? (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
              badgeStyles[product.badge],
            )}
          >
            {badgeLabel[product.badge]}
          </span>
        ) : null}
      </Link>

      {/* Quick add — clickable, sits above the link blanket */}
      <ProductCardQuickAction product={product} />

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--color-foreground)]">
            <Link href={href} className="after:absolute after:inset-0">
              {product.name}
            </Link>
          </h3>
          <p className="type-caption line-clamp-1 text-[var(--color-muted)]">
            {subtitle}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          {!isQuote ? (
            <span className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-semibold text-[var(--color-foreground)]">
                {formatMoney(product.price)}
              </span>
              {product.compareAtPrice ? (
                <s className="text-[12px] font-medium text-[var(--color-muted)] decoration-[var(--color-muted)]/70">
                  {formatMoney(product.compareAtPrice)}
                </s>
              ) : null}
            </span>
          ) : (
            <span className="text-[13px] font-semibold text-[var(--color-brand)]">
              Quote on request
            </span>
          )}
          {stockLabel ? (
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-wider",
                stockLabel.tone === "good" && "text-[var(--color-success)]",
                stockLabel.tone === "warn" && "text-[var(--color-danger)]",
                stockLabel.tone === "muted" && "text-[var(--color-muted)]",
              )}
            >
              {stockLabel.text}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
