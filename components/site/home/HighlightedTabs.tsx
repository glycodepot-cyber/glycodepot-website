import { Beaker, FlaskConical } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "./ProductCard";
import { HomeProductCard } from "./HomeProductCard";
import { listCategories, listProducts } from "@/lib/cart/client";
import { highlightedProducts } from "@/lib/content";

export async function HighlightedTabs() {
  const [top, best, sale, categories] = await Promise.all([
    listProducts({ pageSize: 4 }),
    listProducts({ pageSize: 4, sort: "popular" }),
    listProducts({ pageSize: 500 }),
    listCategories(),
  ]);
  const categorySlugFor = (ids: string[]) => categories.find((category) => ids.includes(category.id))?.slug;
  const onSale = sale.items.filter((product) => product.badge === "sale");
  const saleItems = onSale.length ? onSale : sale.items;
  const renderProducts = (products: typeof top.items) => (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => {
        const categorySlug = categorySlugFor(product.categories);
        return categorySlug ? (
          categorySlug === "sugar-nucleotides"
            ? <HomeProductCard key={product.id} product={product} categorySlug={categorySlug} />
            : <ProductCard key={product.id} product={product} categorySlug={categorySlug} />
        ) : null;
      })}
    </div>
  );

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
              <h3 className="type-h4 text-[var(--color-foreground)]">{highlightedProducts.panels[0].title}</h3>
              <p className="type-body-sm text-[var(--color-muted-foreground)]">{highlightedProducts.panels[0].description}</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6">
            <div className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <FlaskConical className="size-5" aria-hidden />
            </div>
            <div className="space-y-1.5">
              <h3 className="type-h4 text-[var(--color-foreground)]">{highlightedProducts.panels[1].title}</h3>
              <p className="type-body-sm text-[var(--color-muted-foreground)]">{highlightedProducts.panels[1].description}</p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Tabs defaultValue="top">
            <TabsList className="h-auto rounded-full border border-[#dfe8d5] bg-white p-1.5 shadow-sm">
              <TabsTrigger value="top" className="rounded-full px-4 py-2">Top Rated</TabsTrigger>
              <TabsTrigger value="best" className="rounded-full px-4 py-2">Best Selling</TabsTrigger>
              <TabsTrigger value="sale" className="rounded-full px-4 py-2">On Sale</TabsTrigger>
            </TabsList>
            <TabsContent value="top" className="mt-6">{renderProducts(top.items)}</TabsContent>
            <TabsContent value="best" className="mt-6">{renderProducts(best.items)}</TabsContent>
            <TabsContent value="sale" className="mt-6">{renderProducts(saleItems)}</TabsContent>
          </Tabs>
        </div>
      </Container>
    </Section>
  );
}
