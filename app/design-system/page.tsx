import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Container,
  Section,
  Eyebrow,
  SectionHeading,
  BrandButton,
  Prose,
} from "@/components/primitives";

// Hide the dev playground from production traffic.
const SHOW_DESIGN_SYSTEM = process.env.NODE_ENV !== "production";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

const colorTokens = [
  { name: "brand", token: "--color-brand", hex: "#296DC1" },
  { name: "brand-hover", token: "--color-brand-hover", hex: "#1F5499" },
  { name: "brand-soft", token: "--color-brand-soft", hex: "#EAF1FA" },
  { name: "accent", token: "--color-accent", hex: "#F76B6A" },
  { name: "accent-hover", token: "--color-accent-hover", hex: "#E85856" },
  { name: "accent-soft", token: "--color-accent-soft", hex: "#FDE9E9" },
  { name: "foreground", token: "--color-foreground", hex: "#212529" },
  { name: "muted-foreground", token: "--color-muted-foreground", hex: "#5B6168" },
  { name: "muted", token: "--color-muted", hex: "#6C757D" },
  { name: "surface", token: "--color-surface", hex: "#F8F8F8" },
  { name: "surface-2", token: "--color-surface-2", hex: "#F4F4F4" },
  { name: "surface-3", token: "--color-surface-3", hex: "#EFEFEF" },
  { name: "border", token: "--color-border", hex: "#ECECEC" },
  { name: "border-strong", token: "--color-border-strong", hex: "#D5D8DC" },
  { name: "success", token: "--color-success", hex: "#1F8A51" },
  { name: "warning", token: "--color-warning", hex: "#DC9A0E" },
  { name: "danger", token: "--color-danger", hex: "#D83A3A" },
] as const;

const typeSpecs = [
  { className: "type-display", label: "Display — 40 → 60" },
  { className: "type-h1", label: "H1 — 32 → 44" },
  { className: "type-h2", label: "H2 — 26 → 34" },
  { className: "type-h3", label: "H3 — 22" },
  { className: "type-h4", label: "H4 — 18" },
  { className: "type-body-lg", label: "Body large — 17" },
  { className: "type-body", label: "Body — 16" },
  { className: "type-body-sm", label: "Body small — 15" },
  { className: "type-caption", label: "Caption — 13" },
] as const;

const radiusTokens = [
  { name: "xs", token: "--radius-xs", value: "4px" },
  { name: "sm", token: "--radius-sm", value: "6px" },
  { name: "md", token: "--radius-md", value: "10px" },
  { name: "lg", token: "--radius-lg", value: "14px" },
  { name: "xl", token: "--radius-xl", value: "20px" },
  { name: "full", token: "--radius-full", value: "9999px" },
] as const;

const shadowTokens = [
  { name: "xs", token: "--shadow-xs" },
  { name: "sm", token: "--shadow-sm" },
  { name: "md", token: "--shadow-md" },
  { name: "lg", token: "--shadow-lg" },
  { name: "brand", token: "--shadow-brand" },
] as const;

export default function DesignSystemPage() {
  if (!SHOW_DESIGN_SYSTEM) notFound();
  return (
    <main className="bg-white">
      {/* ===== Header strip ===== */}
      <Section spacing="tight" tone="surface">
        <Container>
          <Eyebrow>Internal</Eyebrow>
          <h1 className="type-h1 mt-2 text-[var(--color-foreground)]">
            GlycoDepot Design System
          </h1>
          <p className="type-body-lg mt-3 max-w-2xl text-[var(--color-muted-foreground)]">
            Source-of-truth playground for tokens, typography, primitives and
            shadcn/ui components used across the rebuild. This page is{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-[13px]">
              noindex
            </code>{" "}
            and will be removed before launch.
          </p>
        </Container>
      </Section>

      {/* ===== Colors ===== */}
      <Section spacing="default">
        <Container>
          <SectionHeading
            eyebrow="01 — Tokens"
            title="Color"
            description="Every component reads from these CSS variables. Change once in globals.css; the whole site updates."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {colorTokens.map((c) => (
              <div
                key={c.name}
                className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-xs)]"
              >
                <div
                  className="h-20 w-full"
                  style={{ background: `var(${c.token})` }}
                />
                <div className="space-y-0.5 p-4">
                  <div className="type-body-sm font-medium text-[var(--color-foreground)]">
                    {c.name}
                  </div>
                  <div className="type-caption font-mono">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ===== Typography ===== */}
      <Section spacing="default" tone="surface">
        <Container>
          <SectionHeading
            eyebrow="02 — Tokens"
            title="Typography"
            description="Jost across the board. Display + H1/H2 are fluid via clamp() so they scale with viewport."
          />
          <div className="mt-10 space-y-8">
            {typeSpecs.map((t) => (
              <div key={t.className} className="grid gap-2">
                <div className="type-caption font-mono uppercase tracking-wider">
                  {t.label}
                </div>
                <div className={`${t.className} text-[var(--color-foreground)]`}>
                  The science of complex carbohydrates.
                </div>
              </div>
            ))}
            <div>
              <div className="type-caption font-mono uppercase tracking-wider">
                Overline — 12 / 0.18em
              </div>
              <div className="type-overline mt-2 text-[var(--color-brand)]">
                Featured Products
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ===== Radius + Shadow ===== */}
      <Section spacing="default">
        <Container>
          <SectionHeading
            eyebrow="03 — Tokens"
            title="Radius & shadow"
          />
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {radiusTokens.map((r) => (
              <div key={r.name} className="flex flex-col items-center gap-3">
                <div
                  className="h-20 w-20 border border-[var(--color-border-strong)] bg-[var(--color-brand-soft)]"
                  style={{ borderRadius: `var(${r.token})` }}
                />
                <div className="text-center">
                  <div className="type-body-sm font-medium">{r.name}</div>
                  <div className="type-caption font-mono">{r.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {shadowTokens.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-3">
                <div
                  className="h-24 w-full rounded-[var(--radius-lg)] bg-white"
                  style={{ boxShadow: `var(${s.token})` }}
                />
                <div className="type-body-sm font-medium">shadow-{s.name}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ===== Buttons ===== */}
      <Section spacing="default" tone="surface">
        <Container>
          <SectionHeading
            eyebrow="04 — Primitives"
            title="BrandButton"
            description="Marketing-grade CTAs. Pill-shaped, brand-coloured, polymorphic (renders <a>, <Link>, or <button>)."
          />
          <div className="mt-10 space-y-8">
            <div className="space-y-3">
              <div className="type-caption font-mono uppercase tracking-wider">
                Tones
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <BrandButton tone="brand">Brand primary</BrandButton>
                <BrandButton tone="accent">Accent</BrandButton>
                <BrandButton tone="outline">Outline</BrandButton>
                <BrandButton tone="ghost">Ghost</BrandButton>
                <div className="rounded-[var(--radius-md)] bg-[var(--color-brand)] p-3">
                  <BrandButton tone="light">On dark</BrandButton>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="type-caption font-mono uppercase tracking-wider">
                Sizes
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <BrandButton size="sm">Small</BrandButton>
                <BrandButton size="md">Medium (default)</BrandButton>
                <BrandButton size="lg">Large</BrandButton>
              </div>
            </div>

            <div className="space-y-3">
              <div className="type-caption font-mono uppercase tracking-wider">
                As link
              </div>
              <BrandButton href="/" tone="brand">
                Internal link →
              </BrandButton>{" "}
              <BrandButton href="https://www.glycodepot.com" external tone="outline">
                External link ↗
              </BrandButton>
            </div>

            <div className="space-y-3">
              <div className="type-caption font-mono uppercase tracking-wider">
                shadcn/ui Button (used inside compound components)
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ===== Form primitives ===== */}
      <Section spacing="default">
        <Container width="narrow">
          <SectionHeading
            eyebrow="05 — Primitives"
            title="Form fields"
            description="shadcn Input + Label, themed via our tokens."
          />
          <form className="mt-10 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="ds-name">Your name</Label>
              <Input id="ds-name" placeholder="Jane Researcher" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ds-email">Work email</Label>
              <Input id="ds-email" type="email" placeholder="you@lab.edu" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ds-search">Search</Label>
              <Input id="ds-search" placeholder="UDP-GalNAz, GloboH, PNGase…" />
            </div>
            <div className="flex gap-3">
              <BrandButton>Submit</BrandButton>
              <BrandButton tone="outline">Cancel</BrandButton>
            </div>
          </form>
        </Container>
      </Section>

      <Separator />

      {/* ===== Badges + chips ===== */}
      <Section spacing="default" tone="surface">
        <Container>
          <SectionHeading
            eyebrow="06 — Primitives"
            title="Badges & chips"
          />
          <div className="mt-10 flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <span className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Sale
            </span>
            <span className="inline-flex items-center rounded-full bg-[var(--color-brand)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              New
            </span>
            <span className="inline-flex items-center rounded-full bg-[var(--color-brand-soft)] px-3 py-1 text-xs font-medium text-[var(--color-brand)]">
              Popular
            </span>
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ===== Tabs ===== */}
      <Section spacing="default">
        <Container>
          <SectionHeading
            eyebrow="07 — Components"
            title="Tabs"
            description="Used on Home for Top Rated / Best Selling / On Sale."
          />
          <div className="mt-10">
            <Tabs defaultValue="top">
              <TabsList>
                <TabsTrigger value="top">Top Rated</TabsTrigger>
                <TabsTrigger value="best">Best Selling</TabsTrigger>
                <TabsTrigger value="sale">On Sale</TabsTrigger>
              </TabsList>
              <TabsContent
                value="top"
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6"
              >
                Top-rated products will render here in Stage 3.
              </TabsContent>
              <TabsContent
                value="best"
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6"
              >
                Best-selling products will render here in Stage 3.
              </TabsContent>
              <TabsContent
                value="sale"
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6"
              >
                On-sale products will render here in Stage 3.
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ===== Accordion ===== */}
      <Section spacing="default" tone="surface">
        <Container width="narrow">
          <SectionHeading
            eyebrow="08 — Components"
            title="Accordion"
            description="Used on Home FAQ + Services list on mobile. Content sourced from lib/content/faq.ts."
          />
          <Accordion className="mt-10 w-full">
            {faqs.slice(0, 3).map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      <Separator />

      {/* ===== Prose ===== */}
      <Section spacing="default">
        <Container width="prose">
          <SectionHeading
            eyebrow="09 — Primitives"
            title="Prose"
            description="Long-form text used for service descriptions, founder's letter, legal pages."
          />
          <Prose className="mt-10">
            <p>
              GlycoDepot is not just a platform — it&apos;s a dynamic marketplace
              transforming the glycoscience landscape, connecting researchers
              with the tools and resources they need to push the boundaries of
              scientific exploration.
            </p>
            <p>
              <strong>Our curated marketplace</strong> is designed to be the
              missing link, connecting you with the highest quality reagents,
              innovative tools, and collaborative opportunities. Visit our{" "}
              <a href="#">services page</a> to learn more.
            </p>
            <ul>
              <li>Research-grade reagents with full CoA</li>
              <li>Lot-tracked batches with traceability</li>
              <li>Bulk and custom synthesis available</li>
            </ul>
          </Prose>
        </Container>
      </Section>

      <Separator />

      {/* ===== Section tones ===== */}
      <Section spacing="tight" tone="brand-soft">
        <Container>
          <Eyebrow>10 — Tones</Eyebrow>
          <p className="type-body mt-2">
            Section can be{" "}
            <code className="rounded bg-white px-1.5">default</code>,{" "}
            <code className="rounded bg-white px-1.5">surface</code>,{" "}
            <code className="rounded bg-white px-1.5">surface-2</code>,{" "}
            <code className="rounded bg-white px-1.5">brand-soft</code>, or{" "}
            <code className="rounded bg-white px-1.5">brand</code>.
          </p>
        </Container>
      </Section>
      <Section spacing="tight" tone="brand">
        <Container>
          <Eyebrow tone="accent" className="text-white/80">
            Brand tone
          </Eyebrow>
          <p className="type-body-lg mt-2 text-white/90">
            Used for the Start Selling banner and the Contact CTA banner.
          </p>
          <div className="mt-4">
            <BrandButton tone="light">Get in touch</BrandButton>
          </div>
        </Container>
      </Section>
    </main>
  );
}
