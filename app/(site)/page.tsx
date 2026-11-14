import type { Metadata } from "next";
import dynamic from "next/dynamic";

const HeroSlider = dynamic(
  () =>
    import("@/components/site/home/HeroSlider").then((m) => ({
      default: m.HeroSlider,
    })),
  {
    loading: () => (
      <div className="relative isolate h-[380px] bg-[var(--color-brand)] sm:h-[480px] lg:h-[600px]" />
    ),
  },
);
import { ProductGridSection } from "@/components/site/home/ProductGridSection";
import { HighlightedTabs } from "@/components/site/home/HighlightedTabs";
import { GlycanSolutions } from "@/components/site/home/GlycanSolutions";
import { Applications } from "@/components/site/home/Applications";
import { ContactCTA } from "@/components/site/home/ContactCTA";
import { WhatIsGlycoscience } from "@/components/site/home/WhatIsGlycoscience";
import { WhyChooseUs } from "@/components/site/home/WhyChooseUs";
import { OurServices } from "@/components/site/home/OurServices";
import { StartSellingBanner } from "@/components/site/home/StartSellingBanner";
import { TestimonialBlock } from "@/components/site/home/TestimonialBlock";
import { FaqAccordion } from "@/components/site/home/FaqAccordion";
import { ShowcaseCarousel } from "@/components/site/home/ShowcaseCarousel";
import { Section } from "@/components/primitives";
import {
  featuredProducts,
  glycoenzymesGrid,
  oligosGrid,
} from "@/lib/content";
import { OrganizationJsonLd, FaqJsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: {
    absolute: "GlycoDepot | Glycoscience Reagents, Sugar Nucleotides & Expert Services",
  },
  description:
    "Shop high-purity sugar nucleotides, glycoenzymes and glycoanalysis standards, or explore custom glycan synthesis and LC-MS/MS glycosylation analysis from GlycoDepot.",
  keywords: [
    "glycoscience reagents",
    "sugar nucleotides",
    "CMP-Neu5Ac",
    "GDP-fucose",
    "glycan analysis",
    "custom glycan synthesis",
    "glycosylation analysis",
  ],
  openGraph: {
    title: "GlycoDepot | Glycoscience Reagents & Expert Services",
    description:
      "High-purity glycoscience reagents, specialty glycans and custom laboratory services for research and industry.",
    url: "/",
    siteName: "GlycoDepot",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GlycoDepot glycoscience reagents and expert services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlycoDepot | Glycoscience Reagents & Expert Services",
    description:
      "Research-grade glycoscience reagents, specialty glycans and custom services.",
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero slider */}
      <HeroSlider />

      {/* 2 — Featured (Sugar Nucleotides) — flagship: 4+4 grid */}
      <ProductGridSection
        eyebrow={featuredProducts.label}
        heading={featuredProducts.heading}
        categorySlug={featuredProducts.categoryKey}
        viewAllHref={`/products/${featuredProducts.categoryKey}`}
        tone="default"
        limit={8}
      />

      {/* 2b — Animated product showcase */}
      <Section tone="brand-soft" spacing="tight">
        <ShowcaseCarousel />
      </Section>

      {/* 3 — Glycoenzymes */}
      <ProductGridSection
        heading={glycoenzymesGrid.heading}
        categorySlug={glycoenzymesGrid.categoryKey}
        viewAllHref={`/products/${glycoenzymesGrid.categoryKey}`}
        tone="surface"
      />

      {/* 4 — Oligosaccharides / Glycans */}
      <ProductGridSection
        heading={oligosGrid.heading}
        categorySlug={oligosGrid.categoryKey}
        viewAllHref={`/products/${oligosGrid.categoryKey}`}
        tone="brand-soft"
      />

      {/* 5 — Highlighted (tabbed) */}
      <HighlightedTabs />

      {/* 6 — Glycan Solutions */}
      <GlycanSolutions />

      {/* 7 — Applications */}
      <Applications />

      {/* 8 — Contact call-to-action */}
      <ContactCTA />

      {/* 9 — What is Glycoscience? + disciplines */}
      <WhatIsGlycoscience />

      {/* 10 — Why Choose Us */}
      <WhyChooseUs />

      {/* 11 — Our Services */}
      <OurServices />

      {/* 12 — Start Selling banner */}
      <StartSellingBanner />

      {/* 13 — Testimonial */}
      <TestimonialBlock />

      {/* 14 — FAQ */}
      <FaqAccordion />

      <OrganizationJsonLd />
      <FaqJsonLd />
    </>
  );
}
