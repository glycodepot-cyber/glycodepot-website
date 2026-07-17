import { Check } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { glycanSolutions } from "@/lib/content";

export function GlycanSolutions() {
  return (
    <Section>
      <Container>
        <SectionHeading
          title={glycanSolutions.heading}
          description={glycanSolutions.subheading}
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {glycanSolutions.cards.map((card) => (
            <article
              key={card.title}
              className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-7 transition-shadow hover:shadow-[var(--shadow-md)]"
            >
              <div>
                <h3 className="type-h3 text-balance text-[var(--color-foreground)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {card.body}
                </p>
              </div>
              <ul className="mt-auto space-y-2.5 border-t border-[var(--color-border)] pt-5">
                {card.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-sm text-[var(--color-foreground)]"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
