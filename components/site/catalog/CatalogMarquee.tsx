"use client";

import Image from "next/image";

const IMAGES = Array.from({ length: 17 }, (_, i) => ({
  src: `/images/categories/cat-${String(i + 1).padStart(2, "0")}.jpeg`,
  alt: `Glycoscience product image ${i + 1}`,
}));

export function CatalogMarquee() {
  const items = [...IMAGES, ...IMAGES];
  return (
    <>
      <style>{`
        @keyframes catalog-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="group/marquee relative overflow-hidden py-2">
        <div
          className="flex gap-3 will-change-transform group-hover/marquee:[animation-play-state:paused]"
          style={{
            animation: `catalog-scroll ${IMAGES.length * 4}s linear infinite`,
            width: "max-content",
            backfaceVisibility: "hidden",
          }}
        >
          {items.map((img, i) => (
            <div
              key={i}
              className="size-[200px] shrink-0 overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-[var(--color-border-strong)]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={200}
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
