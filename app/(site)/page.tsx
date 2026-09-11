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
import { CategoriesShowcase } from "@/components/site/home/CategoriesShowcase";
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
  // Use the absolute form so the root layout's template doesn't append " · GlycoDepot".
  title: {
    absolute: "GlycoDepot — Your Trusted Source for Glycoscience Solutions",
  },
  description:
    "Sugar nucleotides, glycoenzymes, oligosaccharides, glycan arrays, and expert services — sourced from expert labs to yours. ISO-certified, PhD-level expertise.",
  // openGraph + twitter metadata fully inherited from app/layout.tsx so the
  // auto-discovered app/opengraph-image.tsx is included.
};

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero slider */}
      <HeroSlider />

      {/* 1b — Shop by category */}
      <CategoriesShowcase />

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

      {/* 8 — Contact CTA */}
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
