"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye, Sparkles } from "lucide-react";
import { gallery } from "./data";

export function Gallery() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const isCheckingScroll = useRef(false);

  const checkScroll = () => {
    if (!carouselRef.current || isCheckingScroll.current) return;
    isCheckingScroll.current = true;

    requestAnimationFrame(() => {
      isCheckingScroll.current = false;
      if (!carouselRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);

      // Calculate active index
      const child = carouselRef.current.firstElementChild as HTMLElement | null;
      if (child) {
        const cardWidth = child.offsetWidth || 260;
        const gap = 20; // gap-5 is 20px
        const index = Math.round(scrollLeft / (cardWidth + gap));
        
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        if (isAtEnd) {
          setActiveIndex(gallery.length - 1);
        } else {
          setActiveIndex(Math.max(0, Math.min(gallery.length - 1, index)));
        }
      }
    });
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    // Run check initially
    checkScroll();

    // Check scroll on window resize too with passive listener
    window.addEventListener("resize", checkScroll, { passive: true });
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
    <section id="gallery" className="relative py-24 bg-[#0A0A0A] text-white overflow-hidden">
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      {/* Gold Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)' }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>GALLERY OF MEME LEGENDS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              أمثلة الكروت <span className="text-gold-grad">التونسية</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/cards"
              className="text-xs sm:text-sm font-bold text-gray-300 hover:text-white transition underline underline-offset-4"
            >
              عرض التشكيلة كاملة
            </Link>
            <Link
              href="/generator"
              className="group flex items-center gap-2 text-xs sm:text-sm font-bold text-[#F6D365] transition hover:text-[#D4AF37]"
            >
              صمّم كارتك الخاصة
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                ←
              </span>
            </Link>
          </div>
        </div>

        {/* Gallery Carousel Container */}
        <div className="relative group/carousel rounded-3xl border border-white/10 bg-black/70 p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-xl transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
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
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-xl transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Left Fade Overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/90 to-transparent pointer-events-none z-10 hidden md:block" />
          {/* Right Fade Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/90 to-transparent pointer-events-none z-10 hidden md:block" />

          {/* Carousel Scroll Area */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 px-2"
          >
            {gallery.map((card: any) => {
              const cardSlug = card.slug || (card.name.toLowerCase().includes("karim") ? "karim-gharbi" : card.name.toLowerCase());
              return (
                <Link
                  key={card.name}
                  href={`/cards/${cardSlug}`}
                  className="w-[240px] sm:w-[260px] md:w-[280px] flex-shrink-0 snap-start transition duration-500 group relative block cursor-pointer"
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/20 blur-xl opacity-0 transition duration-500 group-hover:opacity-100" />

                  {/* Card container */}
                  <div className="relative rounded-2xl border border-white/10 bg-black/90 p-3 transition duration-500 group-hover:-translate-y-2 group-hover:border-[#D4AF37]/60 group-hover:shadow-[0_12px_35px_rgba(212,175,55,0.25)]">
                    {/* Rating badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-lg bg-black/80 border border-[#D4AF37]/40 px-2 py-0.5 shadow-md">
                      <span className="text-lg font-black text-[#F6D365] leading-none">
                        {card.rating}
                      </span>
                    </div>

                    {/* Card type badge */}
                    <div className="absolute top-4 right-4 z-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-2 py-0.5">
                      <span className="text-[9px] font-bold text-[#F6D365] tracking-wider uppercase">
                        {card.type}
                      </span>
                    </div>

                    {/* Card image */}
                    {card.image ? (
                      <Image
                        src={card.image}
                        alt={`كارت فيفا ${card.arabicName || card.name} تونسية مخصصة — Flawless`}
                        width={280}
                        height={373}
                        loading="lazy"
                        className="w-full rounded-xl select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-[1.02] transition duration-300"
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
                    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                      <div className="absolute -left-40 top-0 h-full w-20 rotate-12 bg-white/10 blur-xl transition-all duration-1000 group-hover:left-[140%]" />
                    </div>

                    {/* Name & Quick Action */}
                    <div className="mt-3 px-1 border-t border-white/10 pt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#F6D365] group-hover:underline">
                        <span>تفاصيل الكارت</span>
                        <Eye className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-sm font-black text-white uppercase tracking-wide">
                        {card.arabicName || card.name}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="mt-6 flex justify-center gap-2">
            {gallery.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === idx
                    ? "w-6 bg-[#F6D365] shadow-[0_0_12px_rgba(246,211,101,0.6)]"
                    : "w-2 bg-white/20 hover:bg-[#D4AF37]/50"
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