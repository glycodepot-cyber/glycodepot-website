import { ShieldCheck, Truck, GraduationCap } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { whyChooseUs } from "@/lib/content";

const icons = [
  <ShieldCheck key="shield" className="size-6" aria-hidden />,
  <Truck key="truck" className="size-6" aria-hidden />,
  <GraduationCap key="grad" className="size-6" aria-hidden />,
];

export function WhyChooseUs() {
  return (
    <Section tone="surface">
      <Container>
        <SectionHeading
          title={whyChooseUs.heading}
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {whyChooseUs.columns.map((c, i) => (
            <div
              key={c.title}
              className="flex flex-col items-center gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 text-center transition-shadow hover:shadow-[var(--shadow-md)]"
            >
              <div className="grid size-14 place-items-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                {icons[i]}
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
  );
}
