import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, BrandButton } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { QuoteListView } from "@/components/site/quote/QuoteListView";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Custom Glycan Synthesis Services",
  description: "Request custom glycan and oligosaccharide synthesis for your research. Share target structures, quantities, labeling needs and specifications for feasibility and pricing review.",
  alternates: { canonical: "/services/custom-glycan-synthesis" },
};

export default function CustomGlycanSynthesisPage() {
  const schema = { "@context": "https://schema.org", "@type": "Service", name: "Custom glycan synthesis", serviceType: "Custom glycan and oligosaccharide synthesis", provider: { "@type": "Organization", name: "GlycoDepot" }, url: `${SITE_URL}/services/custom-glycan-synthesis` };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <PageHero title="Custom Glycan Synthesis" description="From a target structure to a project-specific quote. Tell us the glycan, amount, and specifications your research requires." breadcrumbs={[{label:"Services",href:"/services"},{label:"Custom glycan synthesis"}]} />
    <Section spacing="tight"><Container>
      <div className="flex flex-wrap gap-3"><BrandButton href="#request" size="lg">Request a synthesis quote</BrandButton><BrandButton href="/products/n-glycans" tone="outline" size="lg">Browse N-glycan standards</BrandButton></div>
      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {[
          ["Define your target", "Specify glycan sequence, linkages, branching, chemical form, and any labeling or conjugation requirements."],
          ["Review feasibility & pricing", "Our team reviews your project requirements and prepares a quote. Scope, analytical documentation, pricing, and lead time are agreed before work begins."],
          ["Plan your research supply", "Discuss the required amount, batch needs, delivery location, and timeline so the proposal fits your project."],
        ].map(([title,body],i)=><article key={title} className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6"><p className="text-sm font-semibold text-[var(--color-brand)]">0{i+1}</p><h2 className="type-h3 mt-3">{title}</h2><p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">{body}</p></article>)}
      </div>
      <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">Looking for an existing reagent? Browse <Link href="/products/sugar-nucleotides" className="text-[var(--color-brand)] underline">sugar nucleotides</Link> or <Link href="/products/n-glycans" className="text-[var(--color-brand)] underline">N-glycans</Link> before requesting a custom project. Services are for Research Use Only.</p>
    </Container></Section>
    <Section tone="surface" spacing="default"><Container>
      <div id="request" className="scroll-mt-28"><h2 className="type-h2 mb-3">Request your custom synthesis quote</h2><p className="mb-8 text-[var(--color-muted-foreground)]">Provide the project brief below, along with billing and shipping details. Your request does not commit you to a purchase.</p><QuoteListView service /></div>
    </Container></Section>
  </>;
}
