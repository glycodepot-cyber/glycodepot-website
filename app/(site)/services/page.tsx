import type { Metadata } from "next";
import Image from "next/image";
import { TriangleAlert } from "lucide-react";
import {
  Container,
  Section,
  Eyebrow,
  BrandButton,
} from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { services, servicesIntro, servicesDisclaimer } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom glycosylation, glycan analysis, antibody development, lectin production and more — partner with GlycoDepot for end-to-end glycoscience services.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        breadcrumbs={[{ label: "Services" }]}
      />

      <Section spacing="default">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
            <div className="space-y-6 text-[16px] leading-relaxed text-[var(--color-muted-foreground)] lg:text-[17px]">
              {servicesIntro.map((p, i) => (
                <p key={i} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-md)]">
              <Image
                src="/images/science/antibody-bioorthogonal.png"
                alt="Bioorthogonal antibody-glycan conjugation chemistry"
                width={420}
                height={420}
                sizes="(min-width: 1024px) 420px, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="default" tone="surface">
        <Container>
          <Eyebrow>Our Services</Eyebrow>
          <ol className="mt-8 grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <li
                key={s.title}
                className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 transition-shadow hover:shadow-[var(--shadow-md)] lg:p-7"
              >
                <div className="flex items-baseline gap-3">
                  <span className="type-overline shrink-0 rounded-full bg-[var(--color-brand-soft)] px-2 py-1 font-mono tabular-nums text-[var(--color-brand)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="type-h3 text-[var(--color-foreground)]">
                    {s.title}
                  </h2>
                </div>
                <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <TriangleAlert
              className="mt-0.5 size-4 shrink-0 text-[var(--color-warning)]"
              aria-hidden
            />
            <p className="text-[14px] text-[var(--color-muted-foreground)]">
              {servicesDisclaimer}
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="brand" spacing="tight">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="type-h2 text-white">
                Have a project we haven&rsquo;t listed?
              </h2>
              <p className="mt-3 text-white/85">
                Tell us the target, scale, and timeline — we&rsquo;ll route it to the
                right specialist.
              </p>
            </div>
            <BrandButton tone="light" size="lg" href="/contact" className="shrink-0">
              Get in touch
            </BrandButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
