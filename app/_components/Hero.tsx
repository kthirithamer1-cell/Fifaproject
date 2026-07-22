"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Truck, 
  Star, 
  CreditCard, 
  Laugh, 
  Coffee, 
  Coins, 
  Users, 
  LogOut, 
  Flame, 
  Clock, 
  MessageSquare, 
  Shield, 
  Trophy,
  Award
} from "lucide-react";

const TOTAL_SLIDES = 7;
const AUTOPLAY_INTERVAL = 6000;
const SCROLL_THRESHOLD = 40;

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollLockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const heroRef = useRef<HTMLElement>(null);
  const scrollLock = useRef(false);

  const goToSlide = useCallback((index: number) => {
    const target = Math.max(0, Math.min(index, TOTAL_SLIDES - 1));
    setCurrentSlide(target);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
  }, []);

  useEffect(() => {
    setIsAnimating(currentSlide === 1);
  }, [currentSlide]);

  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(nextSlide, AUTOPLAY_INTERVAL);
  }, [nextSlide]);

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [resetAutoplay]);

  const pauseAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };
  const resumeAutoplay = () => {
    if (!autoplayRef.current) resetAutoplay();
  };

  // Scroll (wheel)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!heroRef.current?.contains(e.target as Node)) return;
      if (scrollLock.current) return;
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < SCROLL_THRESHOLD) return;
      e.preventDefault();
      scrollLock.current = true;
      delta > 0 ? nextSlide() : prevSlide();
      scrollLockTimeout.current = setTimeout(() => {
        scrollLock.current = false;
      }, 400);
    };
    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (hero) hero.removeEventListener("wheel", handleWheel);
      if (scrollLockTimeout.current) clearTimeout(scrollLockTimeout.current);
    };
  }, [nextSlide, prevSlide]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  // Touch
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    touchStartY.current = e.changedTouches[0].screenY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - e.changedTouches[0].screenX;
    const diffY = touchStartY.current - e.changedTouches[0].screenY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      diffX > 0 ? nextSlide() : prevSlide();
    } else if (Math.abs(diffY) > 40) {
      diffY > 0 ? nextSlide() : prevSlide();
    }
  };

  const renderDots = () => (
    <div className="flex gap-2">
      {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
        <button
          key={i}
          className={`hero-dot ${i === currentSlide ? "active" : ""}`}
          onClick={() => goToSlide(i)}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );

  const renderSlide = (index: number, content: React.ReactNode) => (
    <div
      className={`hero-slide ${index === currentSlide ? "active" : ""}`}
      style={{ transitionDelay: index === currentSlide ? "0.1s" : "0s" }}
    >
      {content}
    </div>
  );

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative h-screen overflow-hidden bg-[#FAFAFA] text-gray-900"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-amber-300/[.08] blur-[200px]" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-amber-200/[.06] blur-[200px]" />
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full border border-black/[.03] hero-spin" />
        <div className="absolute right-1/3 bottom-1/3 h-80 w-80 rounded-full border border-black/[.03] hero-spin-rev" />
        <div className="hero-orb left-0 top-24 h-28 w-28" />
        <div className="hero-orb right-8 top-12 h-40 w-40" />
        <div className="hero-orb left-1/4 bottom-10 h-20 w-20" />
        <div className="hero-orb right-1/3 top-1/3 h-32 w-32" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="relative h-full">
          {renderSlide(0, <Slide1 goNext={nextSlide} />)}
          {renderSlide(
            1,
            <Slide2
              isActive={currentSlide === 1}
              isAnimating={isAnimating}
              goPrev={prevSlide}
              goNext={nextSlide}
            />
          )}
          {renderSlide(2, <Slide3 goPrev={prevSlide} goNext={nextSlide} />)}
          {renderSlide(3, <Slide4 goPrev={prevSlide} goNext={nextSlide} />)}
          {renderSlide(4, <Slide5 goPrev={prevSlide} goNext={nextSlide} />)}
          {renderSlide(5, <Slide6 goPrev={prevSlide} goNext={nextSlide} />)}
          {renderSlide(
            6,
            <Slide7 goPrev={prevSlide} goToStart={() => goToSlide(0)} />
          )}
        </div>

        {/* Navigation */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-4 z-20 px-4">
          {renderDots()}
          <div className="hidden sm:flex gap-3">
            <button
              onClick={prevSlide}
              className="hero-arrow"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="hero-arrow"
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        {currentSlide === 0 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-[#E5A500]/40 text-xs tracking-[0.3em] uppercase animate-bounce pointer-events-none">
            ↓ Scroll
          </div>
        )}
      </div>

      <style>{`
        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          transform: scale(0.96) translateY(12px);
          transition: opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
        }
        .hero-slide.active {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1) translateY(0);
        }
        .hero-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.10);
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
        }
        .hero-dot.active {
          background: #E5A500;
          width: 28px;
          border-radius: 12px;
          box-shadow: 0 0 24px rgba(229, 165, 0, 0.3);
        }
        .hero-dot:hover {
          background: rgba(229, 165, 0, 0.4);
        }
        .hero-arrow {
          background: rgba(0, 0, 0, 0.04);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 999px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1.2rem;
          font-weight: 300;
        }
        .hero-arrow:hover {
          background: rgba(229, 165, 0, 0.1);
          border-color: rgba(229, 165, 0, 0.3);
          transform: scale(1.08);
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(229, 165, 0, 0.06);
          background: radial-gradient(circle at 30% 30%, rgba(229, 165, 0, 0.04), transparent);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 999px;
          border: 1px solid rgba(229, 165, 0, 0.25);
          background: rgba(229, 165, 0, 0.08);
          padding: 0.5rem 1.2rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #B07D00;
          letter-spacing: 0.06em;
          backdrop-filter: blur(12px);
        }
        .hero-stat {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(229, 165, 0, 0.15);
          padding: 0.45rem 1.2rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.9rem;
          color: #333;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .hero-stat .sv {
          color: #C98600;
          font-weight: 900;
          font-size: 1.05rem;
        }
        .hero-stat .sl {
          color: #999;
          font-weight: 600;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .hero-btn {
          background: #E5A500;
          color: #fff;
          font-weight: 800;
          padding: 0.85rem 2.2rem;
          border-radius: 0.75rem;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          box-shadow: 0 4px 20px rgba(229, 165, 0, 0.2);
        }
        .hero-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 32px rgba(229, 165, 0, 0.35);
          background: #D49800;
        }
        .hero-btn-outline {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #333;
          font-weight: 700;
          padding: 0.85rem 2.2rem;
          border-radius: 0.75rem;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .hero-btn-outline:hover {
          border-color: rgba(229, 165, 0, 0.4);
          background: rgba(229, 165, 0, 0.06);
        }
        .hero-mini-card {
          background: #fff;
          border-radius: 1rem;
          padding: 1rem 0.9rem 1.2rem;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
          transition: all 0.4s;
          min-width: 120px;
          text-align: center;
        }
        .hero-mini-card:hover {
          border-color: rgba(229, 165, 0, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(229, 165, 0, 0.1);
        }
        .hero-mini-card .mc-rating {
          font-size: 1.6rem;
          font-weight: 900;
          color: #C98600;
          line-height: 1;
        }
        .hero-mini-card .mc-label {
          font-size: 0.6rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .hero-mini-card .mc-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #777;
          padding: 0.15rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        }
        .hero-mini-card .mc-row .mc-v {
          color: #C98600;
          font-weight: 700;
        }
        .hero-bubble {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(229, 165, 0, 0.1);
          border-radius: 999px;
          padding: 0.4rem 1.2rem;
          font-size: 1.1rem;
          font-weight: 500;
          color: #333;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }
        .hero-glow {
          animation: heroGlow 4s ease-in-out infinite;
        }
        @keyframes heroGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(229, 165, 0, 0.05); }
          50% { box-shadow: 0 0 60px rgba(229, 165, 0, 0.15); }
        }
        .hero-fly {
          opacity: 0;
          transform: translateY(24px) scale(0.95);
          animation: heroFlyIn 0.45s ease forwards;
        }
        @keyframes heroFlyIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hero-spin { animation: heroSpin 30s linear infinite; }
        .hero-spin-rev { animation: heroSpin 35s linear infinite reverse; }
        @keyframes heroSpin { to { transform: rotate(360deg); } }

        .hero-trust {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: #777;
          letter-spacing: 0.02em;
        }
        .hero-trust span {
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .hero-slide { padding: 1.5rem 0.8rem; }
          .hero-stat { font-size: 0.75rem; padding: 0.3rem 0.8rem; }
          .hero-stat .sv { font-size: 0.9rem; }
          .hero-btn, .hero-btn-outline { padding: 0.7rem 1.5rem; font-size: 0.85rem; }
          .hero-arrow { width: 36px; height: 36px; font-size: 1rem; }
          .hero-mini-card { min-width: 100px; padding: 0.8rem 0.7rem 1rem; }
        }
      `}</style>
    </section>
  );
}

// ==================== SLIDE COMPONENTS ====================ffslide

function Slide1({ goNext }: { goNext: () => void }) {
  const router = useRouter();
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* Left content */}
        <div className="flex-1 text-center lg:text-right order-2 lg:order-1">
          <div className="hero-badge mb-6 inline-flex gap-1.5 items-center">
            <Sparkles className="h-3.5 w-3.5 text-[#E5A500]" />
            <span>#1 CUSTOM MEME CARDS IN TUNISIA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-gray-900" dir="rtl">
            حوّل صحابك إلى
            <br />
            <span className="text-gold-grad">أساطير الكارطة</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg mx-auto lg:mr-0 lg:ml-auto" dir="rtl">
            كارطة تونسية مضحكة، مصنوعة
            <br className="hidden sm:block" />
            باسمك، صورتك، w ستاتيكات تقطس بالضحك.
          </p>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-end gap-3" dir="rtl">
            <button onClick={() => router.push("/generator")} className="hero-btn">
              <span>+</span> صمّم كارطتي
            </button>
            <a href="#gallery" className="hero-btn-outline">
              شوف أمثلة <span>◉</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap justify-center lg:justify-end gap-4" dir="rtl">
            <div className="hero-trust">
              <Truck className="h-4 w-4 text-[#E5A500]" />
              <span>توصيل لكل تونس</span>
            </div>
            <div className="hero-trust">
              <Star className="h-4 w-4 text-[#E5A500]" />
              <span>جودة عالية</span>
            </div>
            <div className="hero-trust">
              <CreditCard className="h-4 w-4 text-[#E5A500]" />
              <span>PVC PREMIUM</span>
            </div>
          </div>
        </div>

        {/* Right: card image */}
        <div className="flex-shrink-0 order-1 lg:order-2">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-amber-300/10 blur-[60px]" />
            <img
              src="/images/alui.png"
              alt="Custom Meme Card"
              className="relative w-56 sm:w-64 md:w-72 lg:w-80 drop-shadow-[0_0_40px_rgba(229,165,0,.15)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide2({
  isActive,
  isAnimating,
  goPrev,
  goNext,
}: {
  isActive: boolean;
  isAnimating: boolean;
  goPrev: () => void;
  goNext: () => void;
}) {
  const stats = [
    { icon: Laugh, label: "DHK", value: 99 },
    { icon: Coffee, label: "9HW", value: 96 },
    { icon: Coins, label: "TKK", value: 94 },
    { icon: Users, label: "S7B", value: 92 },
    { icon: LogOut, label: "HRB", value: 90 },
    { icon: Flame, label: "GZR", value: 98 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-gray-900">
        Machi kan lo3aba el koora 3andhom stats...
        <br />
        <span className="text-gold-grad">7atta a7na.</span>
      </h2>

      <div className="mt-10 flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className={`hero-stat flex items-center gap-1.5 ${
                isActive && isAnimating ? "hero-fly" : ""
              }`}
              style={{
                animationDelay:
                  isActive && isAnimating ? `${i * 0.08 + 0.1}s` : "0s",
              }}
            >
              <Icon className="h-4 w-4 text-[#E5A500]" />
              <span className="sv">{item.value}</span>{" "}
              <span className="sl">{item.label}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Kol wa7ed 3andou stats mte3ou el khass
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <button onClick={goPrev} className="hero-btn-outline text-sm">
          ← Back
        </button>
        <button onClick={goNext} className="hero-btn text-sm">
          Next →
        </button>
      </div>
    </div>
  );
}

function Slide3({
  goPrev,
  goNext,
}: {
  goPrev: () => void;
  goNext: () => void;
}) {
  const cards = [
    {
      image: "/images/alui.png",
      title: "The Sleeper",
      rating: 89,
      stats: [
        ["RKD", "99"],
        ["HRB", "18"],
        ["DHK", "90"],
      ],
    },
    {
      image: "/images/aluii.png",
      title: "Coffee Addict",
      rating: 92,
      stats: [
        ["9HW", "99"],
        ["KLM", "95"],
        ["TKK", "10"],
      ],
    },
    {
      image: "/images/sankooh.png",
      title: "The Bro",
      rating: 94,
      stats: [
        ["S7B", "99"],
        ["DHK", "98"],
        ["FRJ", "94"],
      ],
    },
  ];
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center leading-tight text-gray-900">
        Kol wa7ed fina 3andou
        <br />
        <span className="text-gold-grad">personality tosta7e9 card.</span>
      </h2>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-3xl mx-auto">
        {cards.map((c, i) => (
          <div key={i} className="hero-mini-card flex flex-col items-center">
            <div className="relative w-16 h-20 mb-2">
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(229,165,0,0.12)]"
              />
            </div>
            <div className="mc-rating">{c.rating}</div>
            <div className="mc-label mb-2">{c.title}</div>
            <div className="w-full">
              {c.stats.map(([label, val]) => (
                <div key={label} className="mc-row">
                  <span>{label}</span> <span className="mc-v">{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-gray-500 text-base font-medium">
        &quot;Hedha sa7bi.&quot;
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={goPrev} className="hero-btn-outline text-sm">
          ← Back
        </button>
        <button onClick={goNext} className="hero-btn text-sm">
          Next →
        </button>
      </div>
    </div>
  );
}

function Slide4({
  goPrev,
  goNext,
}: {
  goPrev: () => void;
  goNext: () => void;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-gray-900">
        7atta el 3youb{" "}
        <span className="text-gold-grad">ywalliw legendary.</span>
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <div className="hero-stat text-base flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-[#E5A500]" />
          <span className="sv">99</span> <span className="sl">RKD</span>
        </div>
        <div className="hero-stat text-base flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-[#E5A500]" />
          <span className="sv">99</span> <span className="sl">KLM</span>
        </div>
        <div className="hero-stat text-base flex items-center gap-1.5">
          <Coins className="h-4 w-4 text-[#E5A500]" />
          <span className="sv">5</span> <span className="sl">TKK</span>
        </div>
      </div>
      <div className="mt-8 max-w-xl mx-auto bg-white/80 backdrop-blur-xl border border-[#E5A500]/15 rounded-2xl p-6 sm:p-8 shadow-sm">
        <p className="text-lg sm:text-xl font-bold text-[#B07D00] leading-relaxed">
          &quot;Fi Kartetna... 7atta akhar stat fik
          <br />
          ywalli sbeb bech nas ted7ek.&quot;
        </p>
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <button onClick={goPrev} className="hero-btn-outline text-sm">
          ← Back
        </button>
        <button onClick={goNext} className="hero-btn text-sm">
          Next →
        </button>
      </div>
    </div>
  );
}

function Slide5({
  goPrev,
  goNext,
}: {
  goPrev: () => void;
  goNext: () => void;
}) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-gray-900">
            A5tar playstyle w wsaflna stats
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg mx-auto lg:ml-0" dir="rtl">
            Sami playstyle mta3 sa7bek: custom rating, skills, weak foot stars, w work rate match l personality mte3ou (kima LOW/LOW lel fachal).
          </p>
          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
            <button onClick={goPrev} className="hero-btn-outline text-sm">
              ← Back
            </button>
            <button onClick={goNext} className="hero-btn text-sm">
              Next →
            </button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-amber-300/8 blur-[50px]" />
            <img
              src="/images/sankooh.png"
              alt="Custom player card"
              className="relative w-60 sm:w-72 md:w-80 drop-shadow-[0_0_30px_rgba(229,165,0,.12)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide6({
  goPrev,
  goNext,
}: {
  goPrev: () => void;
  goNext: () => void;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-gray-900">
        7awel ay sa7eb l
        <br />
        <span className="text-gold-grad">legend tounsi.</span>
      </h2>
      <div className="mt-5 flex flex-wrap justify-center gap-3 text-gray-500">
        <span className="bg-black/[0.03] px-4 py-1.5 rounded-full border border-black/[0.05] text-sm">
          Esmou
        </span>
        <span className="bg-black/[0.03] px-4 py-1.5 rounded-full border border-black/[0.05] text-sm">
          Sourtou
        </span>
        <span className="bg-black/[0.03] px-4 py-1.5 rounded-full border border-black/[0.05] text-sm">
          Stats mte3ou
        </span>
      </div>
      <div className="mt-6 flex justify-center gap-6 items-center">
        {/* Actual card image */}
        <div className="relative w-36 hidden sm:block">
          <div className="absolute inset-0 rounded-3xl bg-amber-300/5 blur-[30px]" />
          <img
            src="/images/aluii.png"
            alt="Custom Card Example"
            className="w-full drop-shadow-[0_0_20px_rgba(229,165,0,0.12)]"
          />
        </div>

        {/* Dynamic Card preview details */}
        <div
          className="bg-white rounded-2xl border border-[#E5A500]/15 p-5 sm:p-6 shadow-lg hero-glow flex flex-col items-center"
          style={{ maxWidth: "260px" }}
        >
          <Award className="h-8 w-8 text-[#E5A500] mb-2" />
          <div className="text-xs text-gray-400 uppercase tracking-widest">
            KARTETNA TN
          </div>
          <div className="text-xl font-black text-[#B07D00] mt-1">
            Sa7bek
          </div>
          <div className="flex justify-center gap-4 mt-3 text-sm">
            <div>
              <span className="text-[#C98600]">99</span>{" "}
              <span className="text-gray-400">RKD</span>
            </div>
            <div>
              <span className="text-[#C98600]">97</span>{" "}
              <span className="text-gray-400">KLM</span>
            </div>
            <div>
              <span className="text-[#C98600]">95</span>{" "}
              <span className="text-gray-400">9HW</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-gray-400 border-t border-gray-100 pt-2">
            PVC Premium • Made in TN
          </div>
        </div>
      </div>
      <p className="mt-5 text-gray-500 text-sm">
        Metb3a 3al PVC b jouda Premium
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={goPrev} className="hero-btn-outline text-sm">
          ← Back
        </button>
        <a href="#order" className="hero-btn text-sm">
          Design your card
        </a>
      </div>
    </div>
  );
}

function Slide7({
  goPrev,
  goToStart,
}: {
  goPrev: () => void;
  goToStart: () => void;
}) {
  const router = useRouter();
  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <div className="hero-badge mb-5 inline-flex gap-1.5 items-center">
        <Trophy className="h-3.5 w-3.5 text-[#E5A500]" />
        <span>The Final Legend</span>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-gray-900">
        Kol wa7ed 3andou stats mte3ou...
        <br />
        <span className="text-gold-grad">Shnowa stats mte3ek inti?</span>
      </h2>
      <div className="mt-6 flex justify-center">
        <div
          className="bg-white rounded-2xl border border-[#E5A500]/20 p-6 sm:p-8 shadow-lg hero-glow flex flex-col items-center"
          style={{ maxWidth: "320px" }}
        >
          <Award className="h-8 w-8 text-[#E5A500] mb-2" />
          <div className="text-3xl font-black text-[#C98600]">? ? ?</div>
          <div className="text-sm text-gray-400 mt-1">Your Stats</div>
          <div className="flex justify-center gap-4 mt-4 text-sm flex-wrap">
            <div>
              <span className="text-[#C98600]">??</span>{" "}
              <span className="text-gray-400">DHK</span>
            </div>
            <div>
              <span className="text-[#C98600]">??</span>{" "}
              <span className="text-gray-400">9HW</span>
            </div>
            <div>
              <span className="text-[#C98600]">??</span>{" "}
              <span className="text-gray-400">S7B</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button onClick={() => router.push("/generator")} className="hero-btn">
          Design it
        </button>
        <a href="#gallery" className="hero-btn-outline">
          See examples
        </a>
      </div>
      <div className="mt-5 flex justify-center gap-3">
        <button onClick={goPrev} className="hero-btn-outline text-sm">
          ← Back
        </button>
        <button
          onClick={goToStart}
          className="text-sm text-gray-400 hover:text-gray-900 transition"
        >
          ⟳ Start over
        </button>
      </div>
    </div>
  );
}