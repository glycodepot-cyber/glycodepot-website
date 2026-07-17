import { Pill, Baby, Sparkles, Wheat } from "lucide-react";
import { Container, Section } from "@/components/primitives";
import { applications } from "@/lib/content";
import type { ReactNode } from "react";

const icons: ReactNode[] = [
  <Pill key="pill" className="size-5" aria-hidden />,
  <Baby key="baby" className="size-5" aria-hidden />,
  <Sparkles key="sparkles" className="size-5" aria-hidden />,
  <Wheat key="wheat" className="size-5" aria-hidden />,
];

export function Applications() {
  return (
    <Section tone="surface">
      <Container>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {applications.map((app, i) => (
            <div
              key={app.title}
              className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
            >
              <div className="grid size-11 place-items-center rounded-[var(--radius-md)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                {icons[i]}
              </div>
              <div className="space-y-2">
                <h3 className="type-h4 text-[var(--color-foreground)]">
                  {app.title}
                </h3>
                <p className="type-body-sm text-[var(--color-muted-foreground)]">
                  {app.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
