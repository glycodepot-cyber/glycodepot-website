import { Atom, Dna, LineChart } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { glycoscience } from "@/lib/content";

const icons = [
  <Atom key="atom" className="size-5" aria-hidden />,
  <Dna key="dna" className="size-5" aria-hidden />,
  <LineChart key="chart" className="size-5" aria-hidden />,
];

export function WhatIsGlycoscience() {
  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading title={glycoscience.heading} />
            <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
              {glycoscience.intro}
            </p>
          </div>

          <div>
            <h3 className="type-h3 text-[var(--color-foreground)]">
              {glycoscience.disciplinesHeading}
            </h3>
            <div className="mt-5 space-y-4">
              {glycoscience.disciplines.map((d, i) => (
                <article
                  key={d.title}
                  className="flex gap-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:bg-white"
                >
                  <div className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-white text-[var(--color-brand)] shadow-[var(--shadow-xs)]">
                    {icons[i]}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="type-h4 text-[var(--color-foreground)]">
                      {d.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
                      {d.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
