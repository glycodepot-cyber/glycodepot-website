import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/home/ProductCard";
import { ProductPurchasePanel } from "@/components/site/catalog/ProductPurchasePanel";
import { AnalyticalCarousel } from "@/components/site/catalog/AnalyticalCarousel";
import { ProductDwellTracker } from "@/components/analytics/PageEventTrackers";
import { ProductJsonLd } from "@/components/site/catalog/ProductJsonLd";
import { RecentlyViewedRail } from "@/components/site/catalog/RecentlyViewedRail";
import { formatMoney } from "@/lib/format";
import { canonicalSiteUrl } from "@/lib/site-url";
import {
  getCategoryBySlug,
  getProductBySlug,
  listRelatedProducts,
} from "@/lib/cart/client";
import { productReferences } from "@/lib/content/product-enrichment";
import { productDescription, productBreadcrumbs, serializeJsonLd } from "@/lib/seo/product-data";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const [cat, product] = await Promise.all([
    getCategoryBySlug(category),
    getProductBySlug(slug),
  ]);
  if (!product || !cat || !product.categories.includes(cat.id)) return { title: "Product not found", robots: { index: false } };
  const canonical = canonicalSiteUrl(product.canonicalUrl, `/products/${cat.slug}/${product.slug}`);
  const description = productDescription(product);
  return {
    title: product.seoTitle || product.name,
    description,
    keywords: product.focusKeyword || undefined,
    alternates: { canonical },
    openGraph: {
      title: product.seoTitle || product.name,
      description,
      type: "website",
      url: canonical,
      images: product.images[0] ? [{ url: product.images[0].src }] : undefined,
    },
  };
}

const badgeStyles = {
  sale: "bg-[var(--color-accent)] text-white",
  new: "bg-[var(--color-brand)] text-white",
  popular: "bg-[var(--color-brand-soft)] text-[var(--color-brand)]",
  hot: "bg-orange-100 text-orange-800",
} as const;

const badgeLabel = {
  sale: "Sale",
  new: "New",
  popular: "Popular",
  hot: "Hot",
} as const;

export default async function ProductPage({ params }: PageProps) {
  const { category, slug } = await params;
  const [cat, product] = await Promise.all([
    getCategoryBySlug(category),
    getProductBySlug(slug),
  ]);
  if (!product || !cat) notFound();

  // Sanity — verify product is actually in this category, else 404 to avoid duplicate URLs
  if (!product.categories.includes(cat.id)) notFound();

  const related = await listRelatedProducts(product, 4);
  const image = product.images[0];
  const references = productReferences(product.id);
  const canonical = canonicalSiteUrl(product.canonicalUrl, `/products/${cat.slug}/${product.slug}`);

  return (
    <>
      <ProductDwellTracker productId={product.id} productName={product.name} />
      <PageHero
        title={product.name}
        description={product.shortDescription}
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: cat.name, href: `/products/${cat.slug}` },
          { label: product.name },
        ]}
      />

      <Section spacing="default">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white">
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 600px, 90vw"
                    className="object-contain p-6"
                    priority
                  />
                ) : null}
                {product.badge ? (
                  <span
                    className={cn(
                      "absolute left-4 top-4 rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wider",
                      badgeStyles[product.badge],
                    )}
                  >
                    {badgeLabel[product.badge]}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Purchase panel */}
            <div>
              <ProductPurchasePanel product={product} />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="surface" spacing="default">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            {/* Long description */}
            <div className="space-y-6">
              <h2 className="type-h2 text-[var(--color-foreground)]">About this product</h2>
              {product.description ? (
                <div className="whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-muted-foreground)] lg:text-[17px]">
                  {product.description}
                </div>
              ) : (
                <p className="text-[16px] italic leading-relaxed text-[var(--color-muted)] lg:text-[17px]">
                  Detailed product information available on request. Contact us
                  for specifications, certificates of analysis, and bulk
                  pricing.
                </p>
              )}
            </div>

            {/* Specs */}
            <aside className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-7">
              <h3 className="type-h3 text-[var(--color-foreground)]">Specifications</h3>
              <dl className="mt-5 divide-y divide-[var(--color-border)] text-[14px]">
                {Object.entries({ ...(product.sku ? { SKU: product.sku } : {}), ...product.attributes }).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="font-medium text-[var(--color-muted-foreground)]">
                      {k}
                    </dt>
                    <dd className="text-right font-semibold text-[var(--color-foreground)]">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>

              {references.length > 0 ? <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted-foreground)]">Reference chemical identities are form-specific. Confirm the supplied counterion, hydration and specifications on the lot CoA.</p> : null}

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
              >
                Need a custom spec? Talk to a specialist →
              </Link>
            </aside>
          </div>
        </Container>
      </Section>

      {references.length > 0 ? (
        <Section spacing="default">
          <Container>
            <h2 className="type-h2">Chemical identity & research references</h2>
            <p className="mt-3 max-w-3xl text-[var(--color-muted-foreground)]">These independent sources provide chemical identity or research context. Use the GlycoDepot lot CoA for supplied-product specifications.</p>
            <ul className="mt-5 space-y-3">{references.map(reference=><li key={reference.url}><a className="font-medium text-[var(--color-brand)] underline underline-offset-4" href={reference.url} target="_blank" rel="noopener noreferrer">{reference.label} ↗</a></li>)}</ul>
            <Link href="/services/custom-glycan-synthesis" className="mt-6 inline-flex font-semibold text-[var(--color-brand)]">Planning an enzymatic glycan synthesis? Consult our experts →</Link>
          </Container>
        </Section>
      ) : null}

      {product.id === "bprd_12943" ? (
        <Section spacing="default">
          <Container>
            <div id="coa" className="space-y-6">
              <SectionHeading title="PAPS CoA & analytical data" />
              <p className="max-w-3xl text-[var(--color-muted-foreground)]">
                Supplied product data sheet for catalog GTRC-001, lot GTRC-001_250821_ES.
                The images include the lot specification, HPLC chromatogram, and HRMS spectrum.
                These results apply to the documented lot; request the documentation for your supplied batch.
              </p>
              <AnalyticalCarousel title="PAPS lot GTRC-001_250821_ES" slides={[
                { src: "/images/science/paps/paps-lot-specification.png", caption: "Lot specification and structure" },
                { src: "/images/science/paps/paps-hplc.png", caption: "HPLC chromatogram and conditions" },
                { src: "/images/science/paps/paps-hrms.png", caption: "HRMS spectrum and conditions" },
              ]} />
              <a href="/documents/products/GD-PDS-GTRC-001-PAPS.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold text-white">
                Open PAPS product data sheet (PDF) ↗
              </a>
            </div>
          </Container>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section spacing="default">
          <Container>
            <SectionHeading title="You may also need" />
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} categorySlug={cat.slug} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <RecentlyViewedRail
        trackOnMount={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          href: `/products/${cat.slug}/${product.slug}`,
          image: product.images[0],
          priceLabel: product.price
            ? `From ${formatMoney(product.price)}`
            : "Quote on request",
        }}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(productBreadcrumbs(cat,product.name,canonical)) }} />
      <ProductJsonLd
        product={product}
        url={canonical}
      />
    </>
  );
}
