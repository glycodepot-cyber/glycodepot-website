"use client";

import Image from "next/image";

const IMAGES = Array.from({ length: 17 }, (_, i) => ({
  src: `/images/showcase/showcase-${String(i + 1).padStart(2, "0")}.jpeg`,
  alt: `GlycoDepot product ${i + 1}`,
}));

export function ShowcaseCarousel() {
  const items = [...IMAGES, ...IMAGES];
  return (
    <>
      <style>{`
        @keyframes showcase-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="group/showcase relative overflow-hidden">
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[var(--color-brand-soft)] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[var(--color-brand-soft)] to-transparent"
          aria-hidden
        />
        <div
          className="flex gap-4 will-change-transform group-hover/showcase:[animation-play-state:paused]"
          style={{
            animation: `showcase-scroll ${IMAGES.length * 5}s linear infinite`,
            width: "max-content",
            backfaceVisibility: "hidden",
          }}
        >
          {items.map((img, i) => (
            <div
              key={i}
              className="h-[200px] w-[280px] shrink-0 overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-[var(--color-border-strong)]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={280}
                height={200}
                className="h-full w-full object-contain p-2"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
