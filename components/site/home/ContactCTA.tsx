import { ArrowRight } from "lucide-react";
import { BrandButton, Container, Section } from "@/components/primitives";
import { contactBanner } from "@/lib/content";

export function ContactCTA() {
  return (
    <Section tone="brand" spacing="tight" className="relative isolate overflow-hidden">
      {/* Same decorative family as hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(700px 360px at 90% 100%, rgba(247,107,106,0.30), transparent 60%), radial-gradient(700px 360px at 0% 0%, rgba(255,255,255,0.14), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 right-1/4 -z-10 size-64 rounded-full bg-white/8 blur-3xl"
      />

      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex max-w-3xl items-start gap-4">
            <span
              aria-hidden
              className="mt-2 inline-block size-2 shrink-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_0_4px_rgba(247,107,106,0.25)]"
            />
            <p className="text-pretty text-[17px] leading-relaxed text-white/90 lg:text-[18px]">
              {contactBanner.body}
            </p>
          </div>
          <BrandButton
            tone="light"
            size="lg"
            href={contactBanner.ctaHref}
            className="shrink-0"
          >
            {contactBanner.ctaLabel}
            <ArrowRight className="size-4" aria-hidden />
          </BrandButton>
        </div>
      </Container>
    </Section>
  );
}
