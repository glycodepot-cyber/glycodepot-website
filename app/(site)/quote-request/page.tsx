import type { Metadata } from "next";
import { Container, Section } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { QuoteListView } from "@/components/site/quote/QuoteListView";
import { quoteCopy } from "@/lib/content";

export const metadata: Metadata = {
  title: "Quote Request",
  description:
    "Bundle the products you need and request a tailored quote — pricing, lead times, and bulk options.",
  alternates: { canonical: "/quote-request" },
  robots: { index: false, follow: true },
};

export default function QuoteRequestPage() {
  return (
    <>
      <PageHero
        title={quoteCopy.heading}
        description={quoteCopy.intro}
        breadcrumbs={[{ label: "Quote Request" }]}
      />

      <Section spacing="default">
        <Container>
          <QuoteListView />
        </Container>
      </Section>
    </>
  );
}
