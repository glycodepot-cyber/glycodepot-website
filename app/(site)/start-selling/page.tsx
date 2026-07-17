import type { Metadata } from "next";
import {
  Check,
  UserPlus,
  PackagePlus,
  Rocket,
  FlaskConical,
  Warehouse,
  TrendingUp,
  Headphones,
  ListChecks,
  Target,
  Gift,
} from "lucide-react";
import {
  Container,
  Section,
  BrandButton,
  SectionHeading,
} from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";
import { startSelling } from "@/lib/content";

export const metadata: Metadata = {
  title: "Start Selling",
  description:
    "Sell your glycoscience products to a global research community. Listing is 100% free — warehouse support in the US, expert technical support, more visibility.",
  alternates: { canonical: "/start-selling" },
};

const stepIcons = [
  <UserPlus key="u" className="size-5" aria-hidden />,
  <PackagePlus key="p" className="size-5" aria-hidden />,
  <Rocket key="r" className="size-5" aria-hidden />,
];

const featureCards = [
  {
    icon: FlaskConical,
    text: "We know the field better than anyone",
    accent: "bg-[var(--color-brand-soft)] text-[var(--color-brand)]",
  },
  {
    icon: Warehouse,
    text: "Warehouse support in the US",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: TrendingUp,
    text: "More products, more visibility",
    accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  },
  {
    icon: Headphones,
    text: "Expert technical support",
    accent: "bg-purple-50 text-purple-600",
  },
  {
    icon: ListChecks,
    text: "Easy listing of products",
    accent: "bg-amber-50 text-amber-600",
  },
  {
    icon: Target,
    text: "We are result-oriented",
    accent: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
  },
  {
    icon: Gift,
    text: "Product listing is 100% free",
    accent: "bg-[var(--color-brand-soft)] text-[var(--color-brand)]",
  },
];

export default function StartSellingPage() {
  return (
    <>
      <PageHero
        title={startSelling.hero.headline}
        description={startSelling.hero.body}
        breadcrumbs={[{ label: "Start Selling" }]}
      />

      <Section spacing="default" tone="surface">
        <Container>
          <SectionHeading
            title={startSelling.hero.subheading}
            align="center"
            className="mx-auto"
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(({ icon: Icon, text, accent }) => (
              <li
                key={text}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Subtle top accent line */}
                <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--color-brand)] opacity-0 transition-opacity group-hover:opacity-100" />
                <div className={`grid size-11 shrink-0 place-items-center rounded-[var(--radius-md)] ${accent}`}>
                  <Icon className="size-5" aria-hidden />
                </div>
                <p className="text-[15px] font-semibold leading-snug text-[var(--color-foreground)]">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section spacing="default" tone="surface">
        <Container>
          <SectionHeading
            title={startSelling.steps.heading}
            align="center"
            className="mx-auto"
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {startSelling.steps.items.map((step, i) => (
              <li
                key={step.title}
                className="relative flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-7"
              >
                <span className="absolute right-6 top-6 text-[60px] font-bold leading-none tracking-tight text-[var(--color-brand-soft)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative grid size-11 place-items-center rounded-[var(--radius-md)] bg-[var(--color-brand)] text-white">
                  {stepIcons[i]}
                </div>
                <div className="relative space-y-2">
                  <h3 className="type-h3 text-[var(--color-foreground)]">
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section spacing="default">
        <Container>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-brand)] p-10 text-center text-white lg:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 0% 100%, rgba(247,107,106,0.30), transparent 55%), radial-gradient(circle at 100% 0%, rgba(255,255,255,0.18), transparent 55%)",
              }}
            />
            <div className="relative mx-auto max-w-2xl space-y-6">
              <h2 className="type-h1 text-balance text-white">
                {startSelling.steps.bannerHeading}
              </h2>
              <div className="flex justify-center">
                <BrandButton
                  tone="light"
                  size="lg"
                  href={startSelling.steps.cta.href}
                >
                  {startSelling.steps.cta.label}
                </BrandButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
