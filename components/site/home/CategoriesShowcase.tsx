import Link from "next/link";
import { FlaskConical, Dna, LineChart, ArrowRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/primitives";
import { categoryGroups, GROUP_OTHER } from "@/lib/content/category-groups";

const icons: Record<string, React.ReactNode> = {
  glycochemistry: <FlaskConical className="size-6" aria-hidden />,
  glycobiology: <Dna className="size-6" aria-hidden />,
  glycoanalysis: <LineChart className="size-6" aria-hidden />,
};

export function CategoriesShowcase() {
  const groups = categoryGroups.filter((g) => g.slug !== GROUP_OTHER);

  return (
    <Section tone="brand-soft">
      <Container>
        <SectionHeading
          eyebrow="Shop by category"
          title="Everything you need, organized by discipline"
          description="Three focused catalogs spanning synthesis, biology, and analysis — browse the one that matches your work."
          align="center"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {groups.map((group) => (
            <Link
              key={group.slug}
              href={`/products?group=${group.slug}`}
              className="group flex flex-col gap-4 rounded-[var(--radius-lg)] border border-transparent bg-white p-7 shadow-[var(--shadow-xs)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-brand)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="grid size-12 place-items-center rounded-[var(--radius-md)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                {icons[group.slug]}
              </div>
              <div className="space-y-2">
                <h3 className="type-h4 text-[var(--color-foreground)]">
                  {group.name}
                </h3>
                <p className="type-body-sm text-[var(--color-muted-foreground)]">
                  {group.description}
                </p>
              </div>
              <span className="mt-auto flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-brand)]">
                Browse products
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
