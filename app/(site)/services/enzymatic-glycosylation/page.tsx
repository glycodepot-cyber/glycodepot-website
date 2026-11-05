import type { Metadata } from "next";
import { TriangleAlert, Check } from "lucide-react";
import {
  Container,
  Section,
  SectionHeading,
  Eyebrow,
  BrandButton,
} from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { BrochureRequestForm } from "@/components/site/forms/BrochureRequestForm";
import {
  glycosylationHero,
  glycosylationStats,
  glycosylationWhy,
  glycosylationBenefits,
  glycosylationPlatform,
  glycosylationCases,
  glycosylationRoutes,
  glycosylationPhases,
  glycosylationTerms,
  glycosylationPricing,
  glycosylationLeadMagnet,
  glycosylationDisclaimer,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Enzymatic Glycosylation Services",
  description:
    "Screen your small molecule against 380 plant glycosyltransferases to improve solubility, delivery, potency or manufacturability — then scale the winning reaction from milligrams to grams.",
  alternates: { canonical: "/services/enzymatic-glycosylation" },
};

export default function EnzymaticGlycosylationPage() {
  return (
    <>
      <PageHero
        title="Enzymatic Glycosylation"
        description={glycosylationHero.title}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: "Enzymatic Glycosylation" },
        ]}
      />

      {/* Intro + stats */}
      <Section spacing="default">
        <Container>
          <p className="max-w-3xl text-[16px] leading-relaxed text-[var(--color-muted-foreground)] lg:text-[17px]">
            {glycosylationHero.intro}
          </p>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {glycosylationStats.map((s) => (
              <div
                key={s.label}
                className="border-t-2 border-[var(--color-brand)] pt-4"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="type-h2 block font-mono tabular-nums text-[var(--color-brand)]">
                    {s.value}
                  </span>
                  <span className="mt-2 block text-[14px] leading-snug text-[var(--color-muted-foreground)]">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Why glycosylation */}
      <Section spacing="default" tone="surface">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="Why glycosylation"
                title="One sugar, one step, in water."
              />
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                {glycosylationWhy.map((p, i) => (
                  <p key={i} className="text-pretty">
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <Eyebrow>What it can do for your molecule</Eyebrow>
              <ul className="mt-6 space-y-3">
                {glycosylationBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--color-brand)]"
                      aria-hidden
                    />
                    <span className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Platform */}
      <Section spacing="default">
        <Container>
          <SectionHeading
            eyebrow="The platform"
            title="380 Family-1 UDP-dependent glycosyltransferases"
            description="Purified and arrayed one enzyme per well, plant-derived, sourced from 30 taxonomically dispersed species and spanning the known Family-1 UGT sub-families — which is what gives the library its chemistry coverage."
          />
          <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <table className="w-full border-collapse text-left">
              <tbody>
                {glycosylationPlatform.map((row, i) => (
                  <tr
                    key={row.component}
                    className={
                      i % 2 === 1 ? "bg-[var(--color-surface)]" : "bg-white"
                    }
                  >
                    <th
                      scope="row"
                      className="w-[32%] border-b border-[var(--color-border)] p-4 align-top text-[14px] font-semibold text-[var(--color-foreground)]"
                    >
                      {row.component}
                    </th>
                    <td className="border-b border-[var(--color-border)] p-4 align-top text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* Published case studies */}
      <Section spacing="default" tone="surface">
        <Container>
          <SectionHeading
            eyebrow="Published results"
            title="What the chemistry has achieved"
            description="Drawn from the peer-reviewed literature on glycosylated analogues. These illustrate what glycosylation can do — they are not GlycoDepot project results."
          />
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {glycosylationCases.map((c) => (
              <li
                key={c.title}
                className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 transition-shadow hover:shadow-[var(--shadow-md)]"
              >
                <span className="type-overline w-fit rounded-full bg-[var(--color-brand-soft)] px-2.5 py-1 font-mono tabular-nums text-[var(--color-brand)]">
                  {c.highlight}
                </span>
                <h3 className="type-h3 text-[var(--color-foreground)]">
                  {c.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {c.body}
                </p>
                <p className="mt-auto pt-2 text-[12px] text-[var(--color-muted)]">
                  {c.cite}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Two routes */}
      <Section spacing="default">
        <Container>
          <SectionHeading
            eyebrow="How to work with us"
            title="Run it yourself, or hand us the molecule"
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {glycosylationRoutes.map((r) => (
              <div
                key={r.key}
                className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] border-t-4 border-t-[var(--color-brand)] bg-white p-6 lg:p-7"
              >
                <h3 className="type-h3 text-[var(--color-foreground)]">
                  {r.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {r.summary}
                </p>
                <ul className="space-y-2">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-[var(--color-brand)]"
                        aria-hidden
                      />
                      <span className="text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-2 text-[14px] text-[var(--color-foreground)]">
                  <span className="font-semibold">Best when:</span> {r.bestWhen}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Project shape */}
      <Section spacing="default" tone="surface">
        <Container>
          <SectionHeading
            eyebrow="What a project looks like"
            title="Every phase has a stage gate. You can stop after any phase."
          />
          <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-[var(--color-brand)] text-white">
                  <th className="p-4 text-[13px] font-semibold">Phase</th>
                  <th className="p-4 text-[13px] font-semibold">Work</th>
                  <th className="p-4 text-[13px] font-semibold">Duration</th>
                  <th className="p-4 text-[13px] font-semibold">Deliverable</th>
                </tr>
              </thead>
              <tbody>
                {glycosylationPhases.map((p, i) => (
                  <tr
                    key={p.phase}
                    className={
                      i % 2 === 1 ? "bg-[var(--color-surface)]" : "bg-white"
                    }
                  >
                    <th
                      scope="row"
                      className="border-b border-[var(--color-border)] p-4 align-top text-[14px] font-semibold text-[var(--color-foreground)]"
                    >
                      {p.phase}
                      {p.optional ? (
                        <span className="mt-1 block text-[12px] font-normal text-[var(--color-muted)]">
                          optional
                        </span>
                      ) : null}
                    </th>
                    <td className="border-b border-[var(--color-border)] p-4 align-top text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                      {p.work}
                    </td>
                    <td className="border-b border-[var(--color-border)] p-4 align-top text-[14px] whitespace-nowrap text-[var(--color-muted-foreground)]">
                      {p.duration}
                    </td>
                    <td className="border-b border-[var(--color-border)] p-4 align-top text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                      {p.deliverable}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6">
              <h3 className="type-h3 text-[var(--color-foreground)]">Pricing</h3>
              <p className="mt-3 text-[15px] font-semibold text-[var(--color-brand)]">
                {glycosylationPricing.headline}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                {glycosylationPricing.body}
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6">
              <h3 className="type-h3 text-[var(--color-foreground)]">
                Commercial terms
              </h3>
              <ul className="mt-3 space-y-2">
                {glycosylationTerms.map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--color-brand)]"
                      aria-hidden
                    />
                    <span className="text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Lead magnet */}
      <Section spacing="default" id="brochure">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow={glycosylationLeadMagnet.eyebrow}
                title={glycosylationLeadMagnet.title}
                description={glycosylationLeadMagnet.description}
              />
              <ul className="mt-6 space-y-3">
                {glycosylationLeadMagnet.points.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--color-brand)]"
                      aria-hidden
                    />
                    <span className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                {glycosylationLeadMagnet.privacyNote}
              </p>
            </div>
            <BrochureRequestForm />
          </div>
        </Container>
      </Section>

      {/* Disclaimer */}
      <Section spacing="tight">
        <Container>
          <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <TriangleAlert
              className="mt-0.5 size-4 shrink-0 text-[var(--color-warning)]"
              aria-hidden
            />
            <p className="text-[14px] text-[var(--color-muted-foreground)]">
              {glycosylationDisclaimer}
            </p>
          </div>
        </Container>
      </Section>

      {/* Closing CTA */}
      <Section tone="brand" spacing="tight">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="type-h2 text-white">
                Not sure whether your molecule is a fit?
              </h2>
              <p className="mt-3 text-white/85">
                Tell us roughly what you are working with and we will say
                candidly whether the library is likely to glycosylate it.
              </p>
            </div>
            <BrandButton
              tone="light"
              size="lg"
              href="/contact"
              className="shrink-0"
            >
              Talk to us
            </BrandButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
