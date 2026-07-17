"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrandButton } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { heroSlides } from "@/lib/content";

const AUTOPLAY_MS = 6500;

export function HeroSlider() {
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", duration: 32 },
    [autoplay.current],
  );
  const [selected, setSelected] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) autoplay.current.stop();
  }, []);

  return (
    <section
      aria-label="Hero"
      className="relative isolate overflow-hidden bg-[var(--color-brand)] text-white"
    >
      {/* Layered gradient backdrop — matches WP visual feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1100px 600px at 8% 12%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(900px 600px at 92% 88%, rgba(247,107,106,0.28), transparent 60%), linear-gradient(135deg, #1a7a3e 0%, #145f31 55%, #0e4924 100%)",
        }}
      />

      {/* Decorative orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 -z-10 size-72 rounded-full bg-white/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-120px] top-[-80px] -z-10 size-[420px] rounded-full bg-[var(--color-accent)]/25 blur-3xl"
      />

      {/* Fine grid pattern overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 80%)",
        }}
      />

      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className="min-w-0 flex-[0_0_100%]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${heroSlides.length}`}
              >
                <div className="mx-auto grid max-w-[var(--container-max)] items-center gap-6 px-5 py-8 pb-16 sm:gap-10 sm:px-8 sm:py-14 sm:pb-14 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:px-10 lg:py-24">
                  {/* Left — copy */}
                  <div className="max-w-2xl text-center sm:text-left">
                    <span className="type-overline inline-flex items-center gap-2 text-white/75">
                      <span className="inline-block size-1.5 rounded-full bg-[var(--color-accent)]" />
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(heroSlides.length).padStart(2, "0")}
                    </span>
                    {/* Only the first slide is the page's canonical <h1>;
                        the others demote to <h2> so the page has exactly
                        one h1 for SEO/a11y. The carousel visually shows
                        one slide at a time so users see one big headline
                        either way. */}
                    {i === 0 ? (
                      <h1 className="type-display mt-5 text-balance text-white">
                        {slide.headline}
                      </h1>
                    ) : (
                      <h2 className="type-display mt-5 text-balance text-white">
                        {slide.headline}
                      </h2>
                    )}
                    <p className="type-body-lg mt-6 max-w-xl text-pretty text-white/85">
                      {slide.body}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:mt-9 sm:justify-start">
                      <BrandButton tone="light" size="lg" href={slide.ctaHref}>
                        {slide.ctaLabel}
                      </BrandButton>
                      <a
                        href="/quote-request"
                        className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 underline-offset-4 transition-colors duration-150 hover:text-white hover:underline"
                      >
                        Request a Quote
                        <span className="inline-block transition-transform duration-150 group-hover/link:translate-x-1">→</span>
                      </a>
                    </div>
                  </div>

                  {/* Right — image card */}
                  <div className="relative mx-auto w-full max-w-[85%] sm:max-w-[520px] lg:mx-0 lg:ml-auto">
                    {/* Soft glow behind image */}
                    <div
                      aria-hidden
                      className="absolute -inset-6 -z-10 rounded-[28px] bg-white/10 blur-2xl"
                    />
                    {/* Accent dot */}
                    <div
                      aria-hidden
                      className="absolute -left-3 -top-3 z-10 size-6 rounded-full bg-[var(--color-accent)] shadow-[0_0_0_4px_rgba(255,255,255,0.18)]"
                    />
                    {/* Accent ring */}
                    <div
                      aria-hidden
                      className="absolute -right-4 -bottom-4 z-10 hidden size-20 rounded-full border-2 border-dashed border-white/40 lg:block"
                    />

                    <div className="relative overflow-hidden rounded-[24px] bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-white/20">
                      <Image
                        src={slide.image.src}
                        alt={slide.image.alt}
                        width={1024}
                        height={1024}
                        priority={i === 0}
                        sizes="(min-width: 1024px) 520px, (min-width: 640px) 70vw, 90vw"
                        className={`aspect-square h-auto w-full ${slide.image.fit === "cover" ? "object-cover" : "object-contain p-4"}`}
                      />
                      {/* Soft inner highlight */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 lg:grid"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 lg:grid"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Dots */}
        <div
          role="tablist"
          aria-label="Slides"
          className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2"
        >
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={selected === i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                selected === i
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
