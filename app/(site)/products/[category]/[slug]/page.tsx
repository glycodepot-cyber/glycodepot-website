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

/**
 * Serve product pages from the ISR cache rather than rendering each request.
 *
 * There are ~3,600 of these and they are the bulk of what crawlers hit. The
 * page takes no searchParams and reads no cookies or auth, so it is safe to
 * cache; rendering it per request meant a function invocation and a catalogue
 * read for every crawl of every product, which is how Neon's outbound
 * transfer reached 2,360 GB in October.
 *
 * No generateStaticParams on purpose: pre-rendering 3,600 pages would move the
 * cost into billed build minutes. Pages are rendered on first request and
 * cached from then on.
 */
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

const udpGalnazSeo = {
  title: "UDP-GalNAz | Azido GalNAc Sugar Nucleotide",
  description:
    "Buy UDP-GalNAz, an azide-functionalized UDP-GalNAc analogue for glycosyltransferase assays, chemoenzymatic glycan labeling, CuAAC and SPAAC workflows.",
  summary:
    "UDP-GalNAz (uridine 5′-diphospho-N-azidoacetylgalactosamine) is an azide-functionalized analogue of UDP-GalNAc used as a nucleotide-sugar donor in glycosyltransferase assays and chemoenzymatic glycan labeling. Its compact azide handle enables downstream bioorthogonal conjugation after enzymatic transfer.",
  sections: [
    {
      title: "UDP-GalNAz applications",
      body:
        "Use UDP-GalNAz for in vitro O-GalNAc glycosylation studies, glycosyltransferase activity assays, glycan imaging and glycoproteomics workflows. After transfer, the installed azide can be coupled to alkyne- or cyclooctyne-functionalized fluorophores, affinity tags and other probes.",
    },
    {
      title: "Click chemistry and detection",
      body:
        "The azide handle supports copper-catalyzed azide–alkyne cycloaddition (CuAAC), strain-promoted azide–alkyne cycloaddition (SPAAC) and Staudinger ligation. Select the conjugation method according to sample type, copper tolerance and required reaction kinetics.",
    },
    {
      title: "Experimental planning",
      body:
        "Acceptance of non-natural nucleotide-sugar donors is enzyme dependent. Confirm UDP-GalNAz compatibility, donor concentration and reaction conditions for the specific glycosyltransferase and acceptor used in your workflow.",
    },
  ],
  faqs: [
    {
      question: "What is UDP-GalNAz?",
      answer:
        "UDP-GalNAz is UDP-N-azidoacetylgalactosamine, an azide-bearing analogue of UDP-GalNAc used as a donor substrate in glycosyltransferase and glycan-labeling workflows.",
    },
    {
      question: "How is UDP-GalNAz detected after enzymatic transfer?",
      answer:
        "The transferred azide can be conjugated to a compatible probe using CuAAC, SPAAC or Staudinger ligation, depending on the experimental system.",
    },
    {
      question: "Is UDP-GalNAz accepted by every GalNAc transferase?",
      answer:
        "No. Substrate tolerance varies by enzyme and assay conditions, so compatibility should be validated for the selected glycosyltransferase and acceptor.",
    },
    {
      question: "Can GlycoDepot provide a certificate of analysis or custom quantity?",
      answer:
        "Yes. Request a quote or contact GlycoDepot for lot-specific documentation, custom quantities and technical support.",
    },
  ],
} as const;

function isUdpGalnaz(slug: string) {
  return slug.toLowerCase() === "udp-galnaz";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const [cat, product] = await Promise.all([
    getCategoryBySlug(category),
    getProductBySlug(slug),
  ]);
  if (!product || !cat || !product.categories.includes(cat.id)) return { title: "Product not found", robots: { index: false } };
  const canonical = canonicalSiteUrl(product.canonicalUrl, `/products/${cat.slug}/${product.slug}`);
  const seo = isUdpGalnaz(product.slug) ? udpGalnazSeo : null;
  const description = seo?.description ?? productDescription(product);
  const title = seo?.title ?? product.seoTitle ?? product.name;
  return {
    title,
    description,
    keywords: seo
      ? [
          "UDP-GalNAz",
          "UDP-N-azidoacetylgalactosamine",
          "azido GalNAc",
          "sugar nucleotide",
          "glycosyltransferase substrate",
          "chemoenzymatic glycan labeling",
          "click chemistry",
        ]
      : product.focusKeyword || undefined,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: product.images[0]
        ? [{ url: product.images[0].src, alt: product.images[0].alt }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images[0] ? [product.images[0].src] : undefined,
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
  const seo = isUdpGalnaz(product.slug) ? udpGalnazSeo : null;

  return (
    <>
      <ProductDwellTracker productId={product.id} productName={product.name} />
      <PageHero
        title={product.name}
        description={seo?.description ?? product.shortDescription}
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
              {seo ? (
                <div className="space-y-7 text-[16px] leading-relaxed text-[var(--color-muted-foreground)] lg:text-[17px]">
                  <p>{seo.summary}</p>
                  <p>
                    Also known as <strong>UDP-N-azidoacetylgalactosamine</strong>,
                    UDP-GalNAz provides a bioorthogonal chemical handle for
                    selective downstream tagging of enzymatically installed
                    GalNAz residues.
                  </p>
                  {seo.sections.map((section) => (
                    <section key={section.title} className="space-y-2">
                      <h3 className="type-h3 text-[var(--color-foreground)]">
                        {section.title}
                      </h3>
                      <p>{section.body}</p>
                    </section>
                  ))}
                </div>
              ) : product.description ? (
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

      {seo ? (
        <Section spacing="default">
          <Container>
            <div className="mx-auto max-w-4xl">
              <SectionHeading
                title="UDP-GalNAz frequently asked questions"
                description="Quick answers for planning a UDP-GalNAz labeling or glycosyltransferase workflow."
              />
              <div className="mt-8 divide-y divide-[var(--color-border)] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white px-6">
                {seo.faqs.map((faq) => (
                  <details key={faq.question} className="group py-5">
                    <summary className="cursor-pointer list-none font-semibold text-[var(--color-foreground)]">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
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
      {seo ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: seo.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      ) : null}
    </>
  );
}
