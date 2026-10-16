import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, BrandButton } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { QuoteListView } from "@/components/site/quote/QuoteListView";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Custom Glycan Synthesis Services",
  description: "Explore gram-scale enzymatic N-glycan synthesis and custom N-glycan standards. Share your target structure, quantity and specifications for a project-specific quote.",
  alternates: { canonical: "/services/custom-glycan-synthesis" },
};

const caseStudies = [
  {
    id: "gram-scale-n-glycan-synthesis",
    number: "01",
    title: "N-glycan synthesis at gram scale",
    subtitle: "Bottom-up assembly through a fully enzymatic route",
    metrics: [
      { value: "1–10 g", label: "Project quantities" },
      { value: "≥95%", label: "Specified purity" },
      { value: "Enzymatic", label: "Stereochemical control" },
    ],
    brief: "The project called for gram-scale Asn-linked N-glycans across multiple glycosylation patterns, with defined structures and a purity specification of at least 95%.",
    approach: "A bottom-up, fully enzymatic synthesis strategy used the selectivity of glycosyltransferases to control glycosidic bond formation and achieve high stereochemical control during assembly.",
    scope: "The project scope included both 1 g and 10 g N-glycan requirements. Each target was specified separately to align structure, quantity, and purity with the research program.",
    cta: "Discuss a gram-scale project",
  },
  {
    id: "custom-n-glycan-standards",
    number: "02",
    title: "Custom N-glycan standards",
    subtitle: "Analytical characterization with confidential structural details",
    metrics: [
      { value: "NMR", label: "Characterization data" },
      { value: "MS", label: "Mass-spectrometric data" },
      { value: "Custom", label: "Research standards" },
    ],
    brief: "The requirement was a set of custom N-glycan standards with project-specific structural requirements and supporting analytical documentation for research use.",
    approach: "The analytical package included NMR spectra and mass-spectrometric datasets to support characterization of the prepared standards. The scope and documentation were tailored to the individual targets.",
    scope: "Molecular structures and ligand identities are withheld from this public summary. Project-specific structures and analytical requirements can be discussed privately with our team.",
    cta: "Request a custom standard",
  },
];

export default function CustomGlycanSynthesisPage() {
  const schema = { "@context": "https://schema.org", "@type": "Service", name: "Custom glycan synthesis", serviceType: "Custom glycan and oligosaccharide synthesis", provider: { "@type": "Organization", name: "GlycoDepot" }, url: `${SITE_URL}/services/custom-glycan-synthesis` };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <PageHero title="Custom Glycan Synthesis" description="From a target structure to a project-specific quote. Tell us the glycan, amount, and specifications your research requires." breadcrumbs={[{label:"Services",href:"/services"},{label:"Custom glycan synthesis"}]} />
    <Section spacing="tight"><Container>
      <div className="flex flex-wrap gap-3"><BrandButton href="#request" size="lg">Request a synthesis quote</BrandButton><BrandButton href="/products/n-glycans" tone="outline" size="lg">Browse N-glycan standards</BrandButton><a href="#case-studies" className="self-center text-sm font-semibold text-[var(--color-brand)] hover:underline">View case studies</a></div>
      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {[
          ["Define your target", "Specify glycan sequence, linkages, branching, chemical form, and any labeling or conjugation requirements."],
          ["Review feasibility & pricing", "Our team reviews your project requirements and prepares a quote. Scope, analytical documentation, pricing, and lead time are agreed before work begins."],
          ["Plan your research supply", "Discuss the required amount, batch needs, delivery location, and timeline so the proposal fits your project."],
        ].map(([title,body],i)=><article key={title} className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6"><p className="text-sm font-semibold text-[var(--color-brand)]">0{i+1}</p><h2 className="type-h3 mt-3">{title}</h2><p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">{body}</p></article>)}
      </div>
      <p className="mt-6 text-sm text-[var(--color-muted-foreground)]">Looking for an existing reagent? Browse <Link href="/products/sugar-nucleotides" className="text-[var(--color-brand)] underline">sugar nucleotides</Link> or <Link href="/products/n-glycans" className="text-[var(--color-brand)] underline">N-glycans</Link> before requesting a custom project. Services are for Research Use Only.</p>
    </Container></Section>
    <Section spacing="default"><Container>
      <div id="case-studies" className="scroll-mt-48">
        <p className="type-overline text-[var(--color-brand)]">Selected projects</p>
        <h2 className="type-h2 mt-3">Custom glycan synthesis case studies</h2>
        <p className="mt-4 max-w-3xl text-[var(--color-muted-foreground)]">From gram-scale enzymatic synthesis to research standards with analytical documentation, each project starts with a defined target and an agreed scope.</p>
        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          {caseStudies.map(study => <article key={study.id} id={study.id} className="flex scroll-mt-48 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-brand-soft)] p-6 sm:p-8">
              <p className="text-sm font-semibold text-[var(--color-brand)]">Case {study.number}</p>
              <h3 className="type-h2 mt-3">{study.title}</h3>
              <p className="mt-3 text-[15px] text-[var(--color-muted-foreground)]">{study.subtitle}</p>
              <dl className="mt-6 grid grid-cols-3 gap-3">
                {study.metrics.map(metric => <div key={metric.label}><dt className="text-xs leading-relaxed text-[var(--color-muted-foreground)]">{metric.label}</dt><dd className="mt-1 text-base font-semibold text-[var(--color-brand)] sm:text-lg">{metric.value}</dd></div>)}
              </dl>
            </div>
            <div className="flex flex-1 flex-col gap-5 p-6 sm:p-8">
              <div><h4 className="font-semibold">The brief</h4><p className="mt-2 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">{study.brief}</p></div>
              <div><h4 className="font-semibold">Our approach</h4><p className="mt-2 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">{study.approach}</p></div>
              <div><h4 className="font-semibold">Project scope</h4><p className="mt-2 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">{study.scope}</p></div>
              <div className="mt-auto pt-2"><BrandButton href="#request" tone="outline" className="w-full whitespace-normal px-4 text-center sm:w-auto">{study.cta}</BrandButton></div>
            </div>
          </article>)}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-[var(--color-muted-foreground)]">Project examples are shared anonymously. Quantities and specifications describe these projects; feasibility, purity, and scale are reviewed for each new request. Research Use Only.</p>
      </div>
    </Container></Section>
    <Section tone="surface" spacing="default"><Container>
      <div id="request" className="scroll-mt-48"><h2 className="type-h2 mb-3">Request your custom synthesis quote</h2><p className="mb-8 text-[var(--color-muted-foreground)]">Provide the project brief below, along with billing and shipping details. Your request does not commit you to a purchase.</p><QuoteListView service /></div>
    </Container></Section>
  </>;
}
