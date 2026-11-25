import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/primitives";
import type { BulkProductContent, BulkRow } from "@/lib/content/bulk-products";

/**
 * Long-form layout for Bulk Supply products: overview with basic information,
 * properties, advantages, specification table, applications by industry,
 * packaging and storage, and FAQ. Rendered by the product page in place of
 * its default About/Specifications block when bulk content exists.
 */
export function BulkProductDetails({ content }: { content: BulkProductContent }) {
  return (
    <>
      <Section tone="surface" spacing="default">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            <div className="space-y-6">
              <h2 className="type-h2 text-[var(--color-foreground)]">Product introduction</h2>
              <div className="space-y-5 text-[16px] leading-relaxed text-[var(--color-muted-foreground)] lg:text-[17px]">
                {content.overview.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
              <div className="pt-2">
                <h3 className="type-h3 text-[var(--color-foreground)]">Physical and chemical properties</h3>
                <RowTable rows={content.properties} className="mt-4" />
              </div>
            </div>

            <aside className="h-fit rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-7">
              <h3 className="type-h3 text-[var(--color-foreground)]">Basic information</h3>
              <RowTable rows={content.basicInfo} className="mt-5" />
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
              >
                Need a custom spec or contract volume? Talk to us →
              </Link>
            </aside>
          </div>
        </Container>
      </Section>

      <Section spacing="default">
        <Container>
          <SectionHeading title="Product advantages" />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.advantages.map((a) => (
              <li
                key={a.title}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6"
              >
                <CheckCircle2 className="size-5 text-[var(--color-brand)]" aria-hidden />
                <h3 className="mt-3 font-semibold text-[var(--color-foreground)]">{a.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">{a.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="surface" spacing="default">
        <Container>
          <SectionHeading title="Product specifications" />
          <div className="mt-8 overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[var(--color-surface)] text-[var(--color-muted-foreground)]">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Parameter</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Specification</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {content.specifications.map((s) => (
                  <tr key={s.parameter}>
                    <th scope="row" className="px-5 py-3 font-medium text-[var(--color-foreground)]">{s.parameter}</th>
                    <td className="px-5 py-3 text-[var(--color-foreground)]">{s.limit}</td>
                    <td className="px-5 py-3 text-[var(--color-muted-foreground)]">{s.method ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-[14px] leading-relaxed text-[var(--color-muted-foreground)]">
            {content.specificationNote}
          </p>
        </Container>
      </Section>

      <Section spacing="default">
        <Container>
          <SectionHeading title="Application fields" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {content.applications.map((app) => (
              <div
                key={app.industry}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6"
              >
                <h3 className="type-h4 text-[var(--color-foreground)]">
                  {app.categorySlug ? (
                    <Link href={`/products/${app.categorySlug}`} className="hover:text-[var(--color-brand)]">
                      {app.industry}
                    </Link>
                  ) : (
                    app.industry
                  )}
                </h3>
                <ul className="mt-3 space-y-2 text-[15px] text-[var(--color-muted-foreground)]">
                  {app.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="surface" spacing="default">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
            <div>
              <h2 className="type-h2 text-[var(--color-foreground)]">Packaging, storage &amp; shipping</h2>
              <RowTable rows={content.packaging} className="mt-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white px-6" />
            </div>
            <div>
              <h2 className="type-h2 text-[var(--color-foreground)]">Frequently asked questions</h2>
              <div className="mt-6 divide-y divide-[var(--color-border)] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white px-6">
                {content.faqs.map((faq) => (
                  <details key={faq.question} className="group py-5">
                    <summary className="cursor-pointer list-none font-semibold text-[var(--color-foreground)]">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted-foreground)]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function RowTable({ rows, className }: { rows: BulkRow[]; className?: string }) {
  return (
    <dl className={`divide-y divide-[var(--color-border)] text-[14px] ${className ?? ""}`}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
          <dt className="shrink-0 font-medium text-[var(--color-muted-foreground)]">{row.label}</dt>
          <dd className="text-right font-semibold text-[var(--color-foreground)]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
