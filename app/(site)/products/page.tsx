import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";
import { FlaskConical, Dna, BarChart3, Package2 } from "lucide-react";
import { Container, Section } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/home/ProductCard";
import { ProductFilters } from "@/components/site/catalog/ProductFilters";
import { Pagination } from "@/components/site/catalog/Pagination";
import { listCategories, listProducts } from "@/lib/cart/client";
import { CatalogMarquee } from "@/components/site/catalog/CatalogMarquee";
import type { ListQuery } from "@/lib/cart";
import {
  categoryGroups,
  groupCategories,
} from "@/lib/content/category-groups";

export const metadata: Metadata = {
  title: "Shop all products",
  description:
    "Browse the GlycoDepot catalog — Glycochemistry, Glycobiology and Glycoanalysis. Sugar nucleotides, glycoenzymes, building blocks, glycan arrays and more.",
  alternates: { canonical: "/products" },
};

const PAGE_SIZE = 12;

type SP = {
  search?: string;
  sort?: string;
  page?: string;
  group?: string;
};

interface PageProps {
  searchParams?: Promise<SP>;
}

function buildHrefFor(base: string, params: SP): (page: number) => string {
  return (page: number) => {
    const u = new URLSearchParams();
    if (params.search) u.set("search", params.search);
    if (params.sort) u.set("sort", params.sort);
    if (params.group) u.set("group", params.group);
    if (page > 1) u.set("page", String(page));
    const qs = u.toString();
    return qs ? `${base}?${qs}` : base;
  };
}

export default async function ProductsLanding({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const page = Math.max(1, Number(sp.page) || 1);
  const sort = (sp.sort as ListQuery["sort"]) ?? "popular";
  const search = sp.search?.trim() || undefined;
  const groupSlug = sp.group?.trim() || undefined;
  const activeGroup = groupSlug
    ? categoryGroups.find((g) => g.slug === groupSlug)
    : undefined;

  const [categories, result] = await Promise.all([
    listCategories(),
    listProducts({
      page,
      pageSize: PAGE_SIZE,
      sort,
      search,
      groupSlug,
    }),
  ]);

  const grouped = groupCategories(categories);

  return (
    <>
      <PageHero
        title={activeGroup ? activeGroup.name : "Shop GlycoDepot"}
        description={
          activeGroup
            ? activeGroup.description
            : "Three families of glycoscience reagents — Glycochemistry, Glycobiology and Glycoanalysis. Lot-tracked, research-grade."
        }
        breadcrumbs={
          activeGroup
            ? [
                { label: "Products", href: "/products" },
                { label: activeGroup.name },
              ]
            : [{ label: "Products" }]
        }
        rightSlot={!activeGroup ? <CatalogMarquee /> : undefined}
      />

      <Section spacing="default">
        <Container>
          {/* Group pills — restored WP-style top-level navigation */}
          <GroupPills
            groups={grouped}
            activeGroup={groupSlug}
            search={search}
            sort={sort}
          />

          {/* Sub-categories for the active group */}
          {activeGroup ? (
            <SubcategoryGrid
              groupName={activeGroup.name}
              categories={
                grouped.find((g) => g.group.slug === activeGroup.slug)
                  ?.categories ?? []
              }
            />
          ) : null}

          <div className="mt-10">
            <ProductFilters
              resultCount={result.items.length}
              totalCount={result.totalItems}
            />
          </div>

          {result.items.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {result.items.map((p) => {
                const cat = categories.find((c) =>
                  p.categories.includes(c.id),
                );
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categorySlug={cat?.slug}
                  />
                );
              })}
            </div>
          )}

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            hrefFor={buildHrefFor("/products", sp)}
          />
        </Container>
      </Section>
    </>
  );
}

const GROUP_ICONS: Record<string, React.FC<{ className?: string }>> = {
  glycochemistry: FlaskConical,
  glycobiology: Dna,
  glycoanalysis: BarChart3,
};

function GroupPills({
  groups,
  activeGroup,
  search,
  sort,
}: {
  groups: ReturnType<typeof groupCategories>;
  activeGroup: string | undefined;
  search: string | undefined;
  sort: string | undefined;
}) {
  function hrefFor(group: string | null): string {
    const u = new URLSearchParams();
    if (group) u.set("group", group);
    if (search) u.set("search", search);
    if (sort && sort !== "popular") u.set("sort", sort);
    const qs = u.toString();
    return qs ? `/products?${qs}` : "/products";
  }
  return (
    <nav aria-label="Product groups" className="flex flex-wrap gap-2">
      <Link
        href={hrefFor(null)}
        className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-[13px] font-semibold transition-all ${
          !activeGroup
            ? "bg-[var(--color-brand)] text-white shadow-[var(--shadow-brand)]"
            : "border border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)]"
        }`}
      >
        <Package2 className="size-3.5" aria-hidden />
        All products
      </Link>
      {groups.map(({ group, categories }) => {
        const count = categories.reduce((n, c) => n + (c.productCount ?? 0), 0);
        const isActive = activeGroup === group.slug;
        const Icon = GROUP_ICONS[group.slug] ?? Package2;
        return (
          <Link
            key={group.slug}
            href={hrefFor(group.slug)}
            className={`inline-flex items-center gap-2 rounded-[var(--radius-md)] px-4 py-2.5 text-[13px] font-semibold transition-all ${
              isActive
                ? "bg-[var(--color-brand)] text-white shadow-[var(--shadow-brand)]"
                : "border border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand)]"
            }`}
          >
            <Icon className="size-3.5" aria-hidden />
            {group.name}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-[var(--color-surface)] text-[var(--color-muted)]"}`}>
              {count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function SubcategoryGrid({
  groupName,
  categories,
}: {
  groupName: string;
  categories: ReturnType<typeof groupCategories>[number]["categories"];
}) {
  if (!categories.length) return null;
  return (
    <div className="mt-8">
      <p className="type-overline text-[var(--color-muted)]">
        Sub-categories in {groupName}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/products/${c.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-[13px] font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
            >
              {c.name}
              <span className="text-[11px] text-[var(--color-muted)]">
                {c.productCount ?? 0}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState({ search }: { search?: string }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-white p-12 text-center">
      <h2 className="type-h3 text-[var(--color-foreground)]">
        {search ? `No matches for "${search}".` : "Nothing to show yet."}
      </h2>
      <p className="max-w-md text-[15px] text-[var(--color-muted-foreground)]">
        Try a different search or browse by category above. Our team can also
        source custom items — get in touch and we&rsquo;ll help.
      </p>
    </div>
  );
}
