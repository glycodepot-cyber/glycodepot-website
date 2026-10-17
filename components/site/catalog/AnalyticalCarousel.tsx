"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export interface AnalyticalSlide { src: string; caption: string }

export function AnalyticalCarousel({ title, slides }: { title: string; slides: AnalyticalSlide[] }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  if (!slides.length) return null;
  const current = slides[index];
  const move = (step: number) => setIndex(i => (i + step + slides.length) % slides.length);
  return <div role="region" aria-roledescription="carousel" aria-label={`${title} analytical images`} className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
    <button type="button" onClick={() => dialog.current?.showModal()} aria-label={`Enlarge ${title}: ${current.caption}`} className="relative block h-72 w-full cursor-zoom-in bg-white p-3 outline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] sm:h-80">
      <Image src={current.src} alt={`${title}: ${current.caption}`} fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-contain p-4" />
      <span className="absolute bottom-3 right-3 rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs">Enlarge ↗</span>
    </button>
    <div className="border-t border-[var(--color-border)] p-4">
      <p className="min-h-10 text-sm font-semibold" aria-live="polite" aria-atomic="true">{current.caption} <span className="font-normal text-[var(--color-muted-foreground)]">({index + 1}/{slides.length})</span></p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button type="button" aria-label={`Previous analytical image for ${title}`} onClick={() => move(-1)} className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm hover:bg-[var(--color-brand-soft)]">← Previous</button>
        <div className="flex flex-wrap justify-center gap-1">{slides.map((s, i) => <button key={s.src} type="button" aria-label={`Show ${s.caption}`} aria-pressed={index === i} onClick={() => setIndex(i)} className={`flex size-7 items-center justify-center rounded-full text-xs ${index === i ? "bg-[var(--color-brand)] text-white" : "bg-[var(--color-surface)]"}`}>{i + 1}</button>)}</div>
        <button type="button" aria-label={`Next analytical image for ${title}`} onClick={() => move(1)} className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm hover:bg-[var(--color-brand-soft)]">Next →</button>
      </div>
    </div>
    <dialog ref={dialog} aria-label={`${title}: enlarged analytical image`} className="m-auto max-h-[95dvh] w-[96vw] max-w-6xl rounded-2xl bg-white p-4 text-[var(--color-foreground)] backdrop:bg-black/70">
      <form method="dialog" className="flex items-center justify-between gap-5"><p className="text-sm font-semibold">{title} · {current.caption}</p><button className="shrink-0 rounded-full border border-[var(--color-border)] px-4 py-2" autoFocus>Close ×</button></form>
      <div className="relative mt-4 h-[75dvh]"><Image src={current.src} alt={`${title}: ${current.caption}`} fill sizes="95vw" className="object-contain" /></div>
    </dialog>
  </div>;
}
