"use client";

import Image from "next/image";

const IMAGES = Array.from({ length: 17 }, (_, i) => ({
  src: `/images/showcase/showcase-${String(i + 1).padStart(2, "0")}.jpeg`,
  alt: `GlycoDepot specialist glycan and glycoscience product ${i + 1}`,
}));

export function ShowcaseCarousel() {
  const items = [...IMAGES, ...IMAGES];
  return (
    <>
      <style>{`@keyframes showcase-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } @media (prefers-reduced-motion: reduce) { .showcase-track { animation: none !important; } }`}</style>
      <div className="group/showcase relative overflow-hidden rounded-[24px] border border-[#dfe8d3] bg-gradient-to-br from-[#fbfff0] via-[#eef7e7] to-[#f5f9ec] py-5">
        <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#f4f8ec] to-transparent" aria-hidden="true" />
        <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#f5f9ec] to-transparent" aria-hidden="true" />
        <div className="showcase-track flex gap-4 will-change-transform group-hover/showcase:[animation-play-state:paused]" style={{ animation: `showcase-scroll ${IMAGES.length * 5}s linear infinite`, width: "max-content", backfaceVisibility: "hidden" }}>
          {items.map((img, i) => <div key={i} className="h-[200px] w-[280px] shrink-0 overflow-hidden rounded-[16px] border border-[#e3eadc] bg-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"><Image src={img.src} alt={img.alt} width={280} height={200} className="h-full w-full object-contain p-2" /></div>)}
        </div>
      </div>
    </>
  );
}
