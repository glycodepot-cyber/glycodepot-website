"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRecentlyViewed, trackView, type RecentItem } from "@/lib/recently-viewed/store";
import { Container, Section, SectionHeading } from "@/components/primitives";

interface RecentlyViewedRailProps {
  /** Optional: the page renders this rail with a fresh entry to track. */
  trackOnMount?: RecentItem;
}

export function RecentlyViewedRail({ trackOnMount }: RecentlyViewedRailProps) {
  useEffect(() => {
    if (trackOnMount) trackView(trackOnMount);
  }, [trackOnMount]);

  const items = useRecentlyViewed();
  // Hide the current product if it's tracked
  const visible = trackOnMount
    ? items.filter((i) => i.id !== trackOnMount.id)
    : items;

  if (visible.length === 0) return null;

  return (
    <Section spacing="default" tone="surface">
      <Container>
        <SectionHeading title="Recently viewed" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-6">
          {visible.slice(0, 6).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-3 transition-colors hover:border-[var(--color-border-strong)]"
            >
              <div className="relative aspect-square overflow-hidden rounded-[var(--radius-sm)] bg-white">
                {item.image ? (
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1024px) 160px, 40vw"
                    className="object-contain p-2"
                  />
                ) : null}
              </div>
              <p className="line-clamp-2 text-[12px] font-medium leading-snug text-[var(--color-foreground)] group-hover:text-[var(--color-brand)]">
                {item.name}
              </p>
              {item.priceLabel ? (
                <p className="text-[12px] font-semibold text-[var(--color-foreground)]">
                  {item.priceLabel}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
