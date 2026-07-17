import { ArrowUpRight, Microscope, Cog, FlaskConical } from "lucide-react";
import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { ourServices } from "@/lib/content";

const icons = [
  <Microscope key="m" className="size-5" aria-hidden />,
  <Cog key="c" className="size-5" aria-hidden />,
  <FlaskConical key="f" className="size-5" aria-hidden />,
];

export function OurServices() {
  return (
    <Section>
      <Container>
        <SectionHeading title={ourServices.heading} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ourServices.cards.map((c, i) => (
            <article
              key={c.title}
              className="group flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-7 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
            >
              <div className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                {icons[i]}
              </div>
              <div className="space-y-3">
                <h3 className="type-h3 text-[var(--color-foreground)]">
                  {c.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                  {c.body}
                </p>
              </div>
              <Link
                href={c.ctaHref}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] transition-colors group-hover:text-[var(--color-brand-hover)]"
              >
                {c.ctaLabel}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
