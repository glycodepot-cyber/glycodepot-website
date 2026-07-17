import { Check } from "lucide-react";
import { BrandButton, Container, Section, Eyebrow } from "@/components/primitives";
import { startSellingBanner } from "@/lib/content";

export function StartSellingBanner() {
  return (
    <Section spacing="default">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-foreground)] text-white">
          {/* Decorative backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 90% 0%, rgba(26,122,62,0.45), transparent 55%), radial-gradient(circle at 0% 100%, rgba(247,107,106,0.25), transparent 55%)",
            }}
          />

          <div className="relative grid gap-10 p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-14">
            <div>
              <Eyebrow tone="accent">For vendors</Eyebrow>
              <h2 className="type-h1 mt-4 text-balance text-white">
                Sell your glycoscience products to a global research community.
              </h2>
              <p className="mt-5 max-w-lg text-pretty text-white/75">
                Join a vibrant network of vendors and put your reagents in front
                of researchers, clinicians, and labs around the world.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <BrandButton tone="light" href={startSellingBanner.primaryCta.href}>
                  {startSellingBanner.primaryCta.label}
                </BrandButton>
                <BrandButton
                  tone="outline"
                  href={startSellingBanner.secondaryCta.href}
                  className="border-white/30 text-white hover:border-white hover:bg-white/10 hover:text-white"
                >
                  {startSellingBanner.secondaryCta.label}
                </BrandButton>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-3 self-center sm:grid-cols-2">
              {startSellingBanner.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 rounded-[var(--radius-md)] border border-white/10 bg-white/[0.04] p-3 text-[14px] backdrop-blur-sm"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--color-brand)] text-white">
                    <Check className="size-3" strokeWidth={2.5} />
                  </span>
                  <span className="text-white/85">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
