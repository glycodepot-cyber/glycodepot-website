import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { ProductCard } from "./ProductCard";
import { listProducts } from "@/lib/cart/client";

interface ProductGridSectionProps {
  eyebrow?: string;
  heading: string;
  categorySlug: string;
  tone?: "default" | "surface" | "surface-2" | "brand-soft" | "brand";
  limit?: number;
  viewAllHref?: string;
}

export async function ProductGridSection({
  eyebrow,
  heading,
  categorySlug,
  tone = "default",
  limit = 4,
  viewAllHref,
}: ProductGridSectionProps) {
  const { items } = await listProducts({ categorySlug, pageSize: limit });

  if (items.length === 0) return null;

  return (
    <Section tone={tone}>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={eyebrow}
            title={heading}
            className="max-w-3xl"
          />
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
            >
              View all
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} categorySlug={categorySlug} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
