import type { Metadata } from "next";
import Image from "next/image";
import { Award, HeartHandshake, BadgeDollarSign } from "lucide-react";
import {
  Container,
  Section,
  SectionHeading,
} from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { aboutWhyChoose, aboutPlatformBlurb, foundersLetter } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "GlycoDepot is a glycoscience marketplace — connecting researchers with high-quality reagents, tools, and collaborative opportunities. A letter from our founder.",
  alternates: { canonical: "/about" },
};

const whyIcons = [
  <Award key="award" className="size-6" aria-hidden />,
  <HeartHandshake key="heart" className="size-6" aria-hidden />,
  <BadgeDollarSign key="value" className="size-6" aria-hidden />,
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About GlycoDepot"
        breadcrumbs={[{ label: "About" }]}
      />

      <Section spacing="default">
        <Container>
          <SectionHeading
            title={aboutWhyChoose.heading}
            description={aboutWhyChoose.tagline}
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {aboutWhyChoose.columns.map((c, i) => (
              <div
                key={c.title}
                className="flex flex-col items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 text-center transition-shadow hover:shadow-[var(--shadow-md)]"
              >
                <div className="grid size-14 place-items-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                  {whyIcons[i]}
                </div>
                <h3 className="type-h3 text-[var(--color-foreground)]">
                  {c.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Visual — glycoscience in context */}
      <Section spacing="default" tone="surface">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <p className="text-balance text-[18px] leading-relaxed text-[var(--color-foreground)] lg:text-[20px]">
                {aboutPlatformBlurb}
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-md)]">
                <Image
                  src="/images/science/cell-membrane-ecm.png"
                  alt="Glycoproteins and glycolipids on the cell surface — the glycome in context"
                  width={600}
                  height={600}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Research depth — academic context */}
      <Section spacing="default">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-md)]">
              <Image
                src="/images/science/glycoscience-folding-cycle.png"
                alt="Glycoscience readers, writers and erasers in carbohydrate biochemistry"
                width={700}
                height={500}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
            <div>
              <p className="type-overline text-[var(--color-brand)]">Research-grade science</p>
              <h2 className="type-h2 mt-3 text-[var(--color-foreground)]">
                Rooted in peer-reviewed glycoscience
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--color-muted-foreground)]">
                Every product we source is backed by rigorous QC data and lot-specific Certificates of Analysis. Our team stays current with the latest glycobiology research to ensure our catalogue reflects where the field is heading.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="default">
        <Container width="narrow">
          <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-sm)] lg:p-12">
            <p className="type-overline text-[var(--color-brand)]">
              A letter from the founder
            </p>
            <p className="mt-5 text-[17px] font-medium text-[var(--color-foreground)]">
              {foundersLetter.salutation}
            </p>
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-[var(--color-muted-foreground)] lg:text-[16px]">
              {foundersLetter.paragraphs.map((p, i) => (
                <p key={i} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>

            <footer className="mt-10 border-t border-[var(--color-border)] pt-6">
              <p className="text-[15px] text-[var(--color-muted-foreground)]">
                {foundersLetter.signOff}
              </p>
              <p
                className="mt-3 text-[22px] text-[var(--color-foreground)]"
                style={{ fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive' }}
              >
                {foundersLetter.signatory.name.split(",")[0]}
              </p>
              <p className="mt-1 text-[14px] font-semibold text-[var(--color-foreground)]">
                {foundersLetter.signatory.name}
              </p>
              <p className="text-[13px] text-[var(--color-muted)]">
                {foundersLetter.signatory.title}
              </p>
            </footer>
          </article>
        </Container>
      </Section>
    </>
  );
}
