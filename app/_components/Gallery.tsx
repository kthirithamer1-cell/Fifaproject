"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gallery } from "./data";

export function Gallery() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);

    // Calculate active index
    const child = carouselRef.current.firstElementChild;
    if (child) {
      const cardWidth = child.getBoundingClientRect().width;
      const gap = 16; // gap-4 is 16px
      const index = Math.round(scrollLeft / (cardWidth + gap));
      
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
      if (isAtEnd) {
        setActiveIndex(gallery.length - 1);
      } else {
        setActiveIndex(Math.max(0, Math.min(gallery.length - 1, index)));
      }
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    // Run check initially
    checkScroll();

    // Check scroll on window resize too
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const handleScroll = () => {
    checkScroll();
  };

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const { scrollLeft } = carouselRef.current;
    const child = carouselRef.current.firstElementChild;
    if (child) {
      const cardWidth = child.getBoundingClientRect().width;
      const gap = 16;
      const amount = cardWidth + gap;
      carouselRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - amount : scrollLeft + amount,
        behavior: "smooth",
      });
    }
  };

  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    const child = carouselRef.current.firstElementChild;
    if (child) {
      const cardWidth = child.getBoundingClientRect().width;
      const gap = 16;
      carouselRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="gallery" className="relative py-20 bg-[#FAFAFA]">
      {/* Gold glow */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-300/[.04] to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 h-1 w-14 rounded-full bg-[#E5A500]" />
            <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 md:text-4xl">
              GALLERY
            </h2>
          </div>

          <a
            href="#order"
            className="group flex items-center gap-2 text-sm font-medium text-[#E5A500] transition hover:text-[#C98600]"
          >
            Voir plus d&apos;exemples
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        {/* Gallery Carousel Container */}
        <div className="relative group/carousel rounded-2xl border border-black/[0.05] bg-white p-5 overflow-hidden shadow-sm">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/90 text-gray-800 shadow-md backdrop-blur-md transition-all duration-300 hover:bg-[#E5A500] hover:text-white hover:border-[#E5A500] active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/90 text-gray-800 shadow-md backdrop-blur-md transition-all duration-300 hover:bg-[#E5A500] hover:text-white hover:border-[#E5A500] active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Left Fade Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 hidden md:block" />
          {/* Right Fade Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden md:block" />

          {/* Carousel Scroll Area */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 px-2"
          >
            {gallery.map((card) => {
              const statEntries = Object.entries(card.stats);
              return (
                <div
                  key={card.name}
                  className="w-[240px] sm:w-[260px] md:w-[280px] flex-shrink-0 snap-start transition duration-500 group relative cursor-pointer"
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-xl bg-amber-300/10 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />

                  {/* Card container */}
                  <div className="relative transition duration-500 group-hover:-translate-y-2 group-hover:scale-[1.03]">
                    {/* Rating badge */}
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-sm border border-black/5 px-2 py-0.5 shadow-sm">
                      <span className="text-lg font-black text-[#C98600] leading-none">
                        {card.rating}
                      </span>
                    </div>

                    {/* Card type badge */}
                    <div className="absolute top-2 right-2 z-10 rounded-md bg-[#E5A500]/10 backdrop-blur-sm px-1.5 py-0.5">
                      <span className="text-[8px] font-bold text-[#B07D00] tracking-wider uppercase">
                        {card.type}
                      </span>
                    </div>

                    {/* Card image */}
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full rounded-xl select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                      />
                    ) : (
                      <div
                        className="w-full aspect-[3/4] rounded-xl flex items-center justify-center text-4xl"
                        style={{
                          background: `linear-gradient(135deg, ${card.color}22, ${card.color}05)`,
                        }}
                      >
                        ⚽
                      </div>
                    )}

                    {/* Shine sweep */}
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <div className="absolute -left-40 top-0 h-full w-20 rotate-12 bg-white/20 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
                    </div>
                  </div>

                  {/* Stats overlay */}
                  <div className="mt-2 px-0.5">
                    <div className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
                      {card.name}
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-0">
                      {statEntries.map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between text-[10px] py-[1px]"
                        >
                          <span className="font-bold text-[#C98600]">
                            {value}
                          </span>
                          <span className="font-semibold text-gray-400 uppercase tracking-wider">
                            {key}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="mt-4 flex justify-center gap-2">
            {gallery.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? "w-6 bg-[#E5A500]"
                    : "w-2 bg-[#E5A500]/20 hover:bg-[#E5A500]/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}