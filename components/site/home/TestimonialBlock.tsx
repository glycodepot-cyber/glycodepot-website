import { Quote } from "lucide-react";
import { Container, Section } from "@/components/primitives";
import { testimonials } from "@/lib/content";

export function TestimonialBlock() {
  const t = testimonials[0];
  if (!t) return null;

  return (
    <Section tone="surface">
      <Container width="narrow">
        <figure className="relative rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)] lg:p-12">
          <div
            aria-hidden
            className="absolute -top-5 left-8 grid size-12 place-items-center rounded-full bg-[var(--color-brand)] text-white shadow-[var(--shadow-brand)]"
          >
            <Quote className="size-5" aria-hidden />
          </div>
          <blockquote className="text-balance text-[18px] leading-relaxed text-[var(--color-foreground)] lg:text-[20px]">
            “{t.quote}”
          </blockquote>
          <figcaption className="mt-7 flex items-center gap-4 border-t border-[var(--color-border)] pt-6">
            <div className="grid size-12 place-items-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)] font-semibold">
              {t.author
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="font-semibold text-[var(--color-foreground)]">
                {t.author}
              </div>
              <div className="text-[13px] text-[var(--color-muted)]">
                {t.title}
              </div>
            </div>
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}
