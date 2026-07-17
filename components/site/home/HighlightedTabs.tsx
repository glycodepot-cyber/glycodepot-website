import { Beaker, FlaskConical } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "./ProductCard";
import { listCategories, listProducts } from "@/lib/cart/client";
import { highlightedProducts } from "@/lib/content";

export async function HighlightedTabs() {
  // For now, all three tabs read from the same pool (different sort).
  // When real API lands, swap each fetch for its endpoint (top-rated, best-sellers, on-sale).
  const [top, best, sale, categories] = await Promise.all([
    listProducts({ pageSize: 4 }),
    listProducts({ pageSize: 4, sort: "popular" }),
    listProducts({ pageSize: 4 }),
    listCategories(),
  ]);

  // Resolve a category slug per product so card links don't fall back to the
  // broken /products/all/[slug] route.
  const slugForProduct = (productCategoryIds: string[]): string | undefined => {
    for (const cid of productCategoryIds) {
      const cat = categories.find((c) => c.id === cid);
      if (cat) return cat.slug;
    }
    return undefined;
  };

  const onSaleItems = sale.items.filter((p) => p.badge === "sale");
  const fallbackSale = onSaleItems.length ? onSaleItems : sale.items;

  return (
    <Section tone="surface">
      <Container>
        <SectionHeading title={highlightedProducts.heading} />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="flex gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6">
            <div className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
              <Beaker className="size-5" aria-hidden />
            </div>
            <div className="space-y-1.5">
              <h3 className="type-h4 text-[var(--color-foreground)]">
                {highlightedProducts.panels[0].title}
              </h3>
              <p className="type-body-sm text-[var(--color-muted-foreground)]">
                {highlightedProducts.panels[0].description}
              </p>
            </div>
          </div>
          <div className="flex gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6">
            <div className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <FlaskConical className="size-5" aria-hidden />
            </div>
            <div className="space-y-1.5">
              <h3 className="type-h4 text-[var(--color-foreground)]">
                {highlightedProducts.panels[1].title}
              </h3>
              <p className="type-body-sm text-[var(--color-muted-foreground)]">
                {highlightedProducts.panels[1].description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Tabs defaultValue="top">
            <TabsList className="h-auto bg-white p-1">
              <TabsTrigger value="top" className="px-4 py-2">
                Top Rated
              </TabsTrigger>
              <TabsTrigger value="best" className="px-4 py-2">
                Best Selling
              </TabsTrigger>
              <TabsTrigger value="sale" className="px-4 py-2">
                On Sale
              </TabsTrigger>
            </TabsList>

            <TabsContent value="top" className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {top.items.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categorySlug={slugForProduct(p.categories)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="best" className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {best.items.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categorySlug={slugForProduct(p.categories)}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="sale" className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
                {fallbackSale.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categorySlug={slugForProduct(p.categories)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </Section>
  );
}
