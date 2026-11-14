import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { ProductCard } from "./ProductCard";
import { listProducts } from "@/lib/cart/client";
import { HomeProductGrid } from "./HomeProductGrid";

interface ProductGridSectionProps {
  eyebrow?: string;
  heading: string;
  categorySlug: string;
  tone?: "default" | "surface" | "surface-2" | "brand-soft" | "brand";
  limit?: number;
  viewAllHref?: string;
}

const featuredSugarNucleotideSlugs = [
  "cmp-c9-azido-neu5ac-cmp-c9-azido-sialic-acid",
  "cmp-neu5ac-2na-cmp-sialic-acid-3063-71-6",
  "cmp-neu5az-cmp-azido-sialic-acid",
  "cmp-neu5gc-2na-cytidine-5-monophospho-n-glycolylneuraminic-acid-98396-76-0",
  "gdp-6-azido-fucose-gdp-6-n3-fuc",
  "gdp-l-fucose-gdp-l-fuc-148296-47-3",
  "gdp-man",
  "udp-2-alkyne-galnac",
];

export async function ProductGridSection({
  eyebrow,
  heading,
  categorySlug,
  tone = "default",
  limit = 4,
  viewAllHref,
}: ProductGridSectionProps) {
  const { items } = await listProducts({
    categorySlug,
    pageSize: categorySlug === "sugar-nucleotides" ? 500 : limit,
  });
  const displayedItems = categorySlug === "sugar-nucleotides"
    ? featuredSugarNucleotideSlugs
      .map((slug) => items.find((product) => product.slug === slug))
      .filter((product) => product !== undefined)
    : items;

  if (displayedItems.length === 0) return null;

  return (
    <Section tone={tone}>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow={eyebrow} title={heading} className="max-w-3xl" />
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
            >
              View all <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>
        {categorySlug === "sugar-nucleotides" ? (
          <HomeProductGrid products={displayedItems} categorySlug={categorySlug} />
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {displayedItems.map((product) => (
              <ProductCard key={product.id} product={product} categorySlug={categorySlug} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
