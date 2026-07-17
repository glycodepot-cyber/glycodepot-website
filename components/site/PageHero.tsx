import type React from "react";
import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { Container } from "@/components/primitives";

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  rightSlot?: React.ReactNode;
}

export function PageHero({ title, description, breadcrumbs, rightSlot }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-hero-title"
      className="relative isolate overflow-hidden bg-[var(--color-brand-soft)]"
    >
      {/* Layered gradient + decorative orbs — same family as home hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(900px 500px at 92% 8%, rgba(41,109,193,0.18), transparent 55%), radial-gradient(700px 400px at 8% 100%, rgba(247,107,106,0.10), transparent 60%), linear-gradient(180deg, #eaf1fa 0%, #f3f7fc 100%)",
        }}
      />
      {/* Soft floating orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[420px] rounded-full bg-[var(--color-brand)]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-[-80px] -z-10 size-72 rounded-full bg-[var(--color-accent)]/15 blur-3xl"
      />
      {/* Fine grid wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(33,37,41,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(33,37,41,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <Container>
        <div className={`py-14 sm:py-16 lg:py-20 ${rightSlot ? "grid items-center gap-8 lg:grid-cols-[1fr_1fr]" : "flex flex-col gap-4"}`}>
          <div className="flex flex-col gap-4">
          {breadcrumbs?.length ? (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[var(--color-muted-foreground)]">
                <li className="flex items-center gap-1.5">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 hover:text-[var(--color-brand)]"
                  >
                    <HomeIcon className="size-3.5" aria-hidden />
                    <span className="sr-only">Home</span>
                  </Link>
                </li>
                {breadcrumbs.map((b, i) => {
                  const last = i === breadcrumbs.length - 1;
                  return (
                    <li key={`${b.label}-${i}`} className="flex items-center gap-1.5">
                      <ChevronRight
                        className="size-3.5 text-[var(--color-muted)]"
                        aria-hidden
                      />
                      {b.href && !last ? (
                        <Link
                          href={b.href}
                          className="hover:text-[var(--color-brand)]"
                        >
                          {b.label}
                        </Link>
                      ) : (
                        <span
                          className="font-medium text-[var(--color-foreground)]"
                          aria-current={last ? "page" : undefined}
                        >
                          {b.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          ) : null}

          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-px w-8 bg-[var(--color-accent)]"
            />
            <span className="type-overline text-[var(--color-accent)]">
              GlycoDepot
            </span>
          </div>

          <h1
            id="page-hero-title"
            className="type-h1 max-w-3xl text-balance text-[var(--color-foreground)]"
          >
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-pretty text-[16px] leading-relaxed text-[var(--color-muted-foreground)] lg:text-[17px]">
              {description}
            </p>
          ) : null}
          </div>
          {rightSlot ? (
            <div className="hidden overflow-hidden lg:block">{rightSlot}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
