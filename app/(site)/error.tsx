"use client";

import { useEffect } from "react";
import { Container, Section, BrandButton } from "@/components/primitives";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[site error]", error);
  }, [error]);

  return (
    <Section spacing="default">
      <Container>
        <div className="mx-auto max-w-2xl py-16 text-center lg:py-24">
          <span className="grid mx-auto size-14 place-items-center rounded-full bg-[var(--color-danger)] text-white">
            <AlertTriangle className="size-7" aria-hidden />
          </span>
          <h1 className="type-h1 mt-6 text-balance text-[var(--color-foreground)]">
            Something went wrong
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[16px] text-[var(--color-muted-foreground)] lg:text-[17px]">
            We hit an unexpected error on our end. Try again, or head back to
            the catalog while we look into it.
          </p>
          {error.digest ? (
            <p className="mt-3 text-[12px] text-[var(--color-muted)]">
              Reference: {error.digest}
            </p>
          ) : null}

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BrandButton size="lg" onClick={() => reset()}>
              <RefreshCw className="size-4" />
              Try again
            </BrandButton>
            <BrandButton href="/" size="lg" tone="outline">
              <Home className="size-4" />
              Go home
            </BrandButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
