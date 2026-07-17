import type { ReactNode } from "react";
import { Container, Section } from "@/components/primitives";
import { PageHero } from "@/components/site/PageHero";

interface LegalLayoutProps {
  children: ReactNode;
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <>
      <PageHero
        title="Legal"
        breadcrumbs={[{ label: "Legal" }]}
        description="Policies that govern your use of GlycoDepot."
      />
      <Section spacing="default">
        <Container>
          <div className="mx-auto max-w-3xl prose-legal">
            <p className="mb-8 rounded-[var(--radius-md)] border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 p-4 text-[13px] text-[var(--color-foreground)]">
              <strong>Draft for review.</strong> These pages are starter copy
              and have not yet been reviewed by counsel. Replace with your
              firm&apos;s official policy before launch.
            </p>
            {children}
          </div>
        </Container>
      </Section>
    </>
  );
}
