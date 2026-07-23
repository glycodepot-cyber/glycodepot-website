import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/home/ProductCard";
import { ProductFilters } from "@/components/site/catalog/ProductFilters";
import { Pagination } from "@/components/site/catalog/Pagination";
import {
  getCategoryBySlug,
  listCategories,
  listProducts,
} from "@/lib/cart/client";
import type { ListQuery } from "@/lib/cart";
import { findGroupForCategory } from "@/lib/content/category-groups";

const PAGE_SIZE = 12;
type SP = { search?: string; sort?: string; page?: string };

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<SP>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Category not found" };
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/products/${cat.slug}` },
  };
}

function buildHrefFor(base: string, params: SP): (page: number) => string {
  return (page: number) => {
    const u = new URLSearchParams();
    if (params.search) u.set("search", params.search);
    if (params.sort) u.set("sort", params.sort);
    if (page > 1) u.set("page", String(page));
    const qs = u.toString();
    return qs ? `${base}?${qs}` : base;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { category: slug } = await params;
  const sp = (await searchParams) ?? {};

  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const page = Math.max(1, Number(sp.page) || 1);
  const sort = (sp.sort as ListQuery["sort"]) ?? "popular";
  const search = sp.search?.trim() || undefined;

  const [categories, result] = await Promise.all([
    listCategories(),
    listProducts({
      categorySlug: cat.slug,
      page,
      pageSize: PAGE_SIZE,
      sort,
      search,
    }),
  ]);

  const otherCategories = categories.filter((c) => c.id !== cat.id);

  return (
    <>
      <PageHero
        title={cat.name}
        description={cat.description}
        breadcrumbs={(() => {
          const group = findGroupForCategory(cat.slug);
          return [
            { label: "Products", href: "/products" },
            ...(group
              ? [{ label: group.name, href: `/products?group=${group.slug}` }]
              : []),
            { label: cat.name },
          ];
        })()}
      />

      <Section spacing="default">
        <Container>
          <div>
            <ProductFilters
              resultCount={result.items.length}
              totalCount={result.totalItems}
            />
          </div>

          {result.items.length === 0 ? (
            <div className="mt-10 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-white p-10 text-center">
              <h2 className="type-h3 text-[var(--color-foreground)]">
                No results in {cat.name}.
              </h2>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-[var(--color-muted-foreground)]">
                Adjust the filter, or{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-[var(--color-brand)] hover:underline"
                >
                  ask our team
                </Link>{" "}
                to source what you need.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {result.items.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  categorySlug={cat.slug}
                />
              ))}
            </div>
          )}

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            hrefFor={buildHrefFor(`/products/${cat.slug}`, sp)}
          />
        </Container>
      </Section>

      {otherCategories.length > 0 ? (
        <Section tone="surface" spacing="default">
          <Container>
            <SectionHeading title="Explore more categories" align="center" className="mx-auto" />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {otherCategories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4 transition-colors hover:border-[var(--color-brand)]"
                  >
                    <div>
                      <p className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-brand)]">
                        {c.name}
                      </p>
                      {typeof c.productCount === "number" ? (
                        <p className="text-[12px] text-[var(--color-muted)]">
                          {c.productCount} products
                        </p>
                      ) : null}
                    </div>
                    <ArrowRight
                      className="size-4 shrink-0 text-[var(--color-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-brand)]"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
