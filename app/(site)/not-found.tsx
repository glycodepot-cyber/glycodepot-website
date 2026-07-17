import Link from "next/link";
import { Container, Section, BrandButton } from "@/components/primitives";
import { Search, Compass } from "lucide-react";
import { SearchBar } from "@/components/site/SearchBar";

export const metadata = {
  title: "Page not found",
  description:
    "We can't find that page. Browse our catalog or search for a product instead.",
};

export default function NotFound() {
  return (
    <Section spacing="default">
      <Container>
        <div className="mx-auto max-w-2xl py-16 text-center lg:py-24">
          <span className="type-overline text-[var(--color-brand)]">404</span>
          <h1 className="type-h1 mt-4 text-balance text-[var(--color-foreground)]">
            We can&apos;t find that page
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[16px] text-[var(--color-muted-foreground)] lg:text-[17px]">
            It may have been moved, renamed, or never existed. Try a search, or
            jump back to our full catalog of glycoscience reagents.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BrandButton href="/products" size="lg">
              <Search className="size-4" />
              Browse products
            </BrandButton>
            <BrandButton href="/contact" size="lg" tone="outline">
              <Compass className="size-4" />
              Talk to a specialist
            </BrandButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
