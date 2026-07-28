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

const TOTAL_SLIDES = 4;
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
    setIsAnimating(currentSlide === 3);
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
      className="relative h-screen w-full overflow-hidden bg-black text-white"
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

      <div className="relative w-full h-full">
        <div className="relative h-full">
          {renderSlide(0, <Slide1 goNext={nextSlide} />)}
          {renderSlide(1, <SlideBanner4 goNext={nextSlide} />)}
          {renderSlide(
            2,
            <Slide2
              isActive={currentSlide === 2}
              isAnimating={isAnimating}
              goPrev={prevSlide}
              goNext={nextSlide}
            />
          )}
          {renderSlide(
            3,
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
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-[#D4AF37]/40 text-xs tracking-[0.3em] uppercase animate-bounce pointer-events-none">
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
          padding: 0;
        }
        .hero-slide.active {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1) translateY(0);
        }
        .hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          padding: 0;
        }
        .hero-dot.active {
          background: #D4AF37;
          width: 28px;
          border-radius: 12px;
          box-shadow: 0 0 24px rgba(212, 175, 55, 0.6);
        }
        .hero-dot:hover {
          background: rgba(212, 175, 55, 0.5);
        }
        .hero-arrow {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1.2rem;
          font-weight: 300;
        }
        .hero-arrow:hover {
          background: rgba(212, 175, 55, 0.2);
          border-color: rgba(212, 175, 55, 0.6);
          color: #F6D365;
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
          background: #D4AF37;
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

// ==================== SLIDE COMPONENTS ====================

function Slide1({ goNext }: { goNext: () => void }) {
  const router = useRouter();
  return (
    <div className="relative w-full h-full flex items-center justify-end overflow-hidden bg-black">
      {/* Background Image & Overlays - Full Banner Fit */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="/images/image.png"
          alt="Slide 1 Background"
          className="w-full h-full object-cover object-center transform scale-100 filter brightness-100"
        />
        {/* Soft, low-intensity shadow gradient behind text on the right */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/25 via-40% to-transparent pointer-events-none" />
      </div>

      {/* Slide 1 Content - Right Aligned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pt-24 pb-10 text-right" dir="rtl">
        <div className="hero-badge mb-6 inline-flex gap-1.5 items-center bg-black/75 border-[#D4AF37]/50 text-[#F6D365] backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
          <Sparkles className="h-4 w-4 text-[#F6D365]" />
          <span className="font-bold text-xs sm:text-sm tracking-wider">#1 CUSTOM MEME CARDS IN TUNISIA</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.15] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
          حوّل صحابك إلى
          <br />
          <span className="text-gold-grad">أساطير الكارطة</span>
        </h1>

        <p className="mt-5 text-sm sm:text-lg text-gray-200 font-medium leading-relaxed max-w-xl mr-0 ml-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          كارطة تونسية مضحكة، مصنوعة باسمك، صورتك،
          <br className="hidden sm:block" />
          و ستاتيكس تقطس بالضحك.
        </p>

        <div className="mt-8 flex flex-wrap justify-start gap-4">
          <button onClick={() => router.push("/generator")} className="hero-btn shadow-lg shadow-amber-500/30">
            <span>+</span> صمّم كارطتي
          </button>
          <a href="#gallery" className="hero-btn-outline text-white border-white/20 hover:bg-white/10 backdrop-blur-md">
            شوف أمثلة <span>◉</span>
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap justify-start gap-6">
          <div className="hero-trust text-gray-200">
            <Truck className="h-4.5 w-4.5 text-[#F6D365]" />
            <span>توصيل لكل تونس</span>
          </div>
          <div className="hero-trust text-gray-200">
            <Star className="h-4.5 w-4.5 text-[#F6D365]" />
            <span>جودة عالية</span>
          </div>
          <div className="hero-trust text-gray-200">
            <CreditCard className="h-4.5 w-4.5 text-[#F6D365]" />
            <span>PVC PREMIUM</span>
          </div>
        </div>
      </div>
    </div>
  );
}



function SlideBanner4({ goNext }: { goNext: () => void }) {
  const router = useRouter();
  return (
    <div className="relative w-full h-full flex items-center justify-end overflow-hidden bg-black">
      {/* Background Image & Overlays - Full Banner Visible */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src="/images/image4.png"
          alt="Mariem Tunisian Pride Banner"
          className="w-full h-full object-cover object-center transform scale-100 filter brightness-100"
        />
        {/* Soft, low-intensity shadow gradient behind text on the right */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/25 via-40% to-transparent pointer-events-none" />
      </div>

      {/* Slide Content - Right Aligned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pt-24 pb-10 text-right" dir="rtl">
        <div className="hero-badge mb-6 inline-flex gap-1.5 items-center bg-black/60 border-[#D4AF37]/40 text-[#F6D365] backdrop-blur-md px-4 py-1.5 rounded-full">
          <Sparkles className="h-4 w-4 text-[#F6D365]" />
          <span className="font-bold text-xs sm:text-sm tracking-wider">PREMIUM TUNISIAN COLLECTION</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.15] text-white drop-shadow-md">
          الزين و الفخامة
          <br />
          <span className="text-gold-grad">Made in Tunisia</span>
        </h1>

        <p className="mt-5 text-sm sm:text-lg text-gray-200 font-medium leading-relaxed max-w-xl mr-0 ml-auto drop-shadow-sm">
          كروت شخصية فاخرة بالهوية التونسية، تفاصيل ذهبية وجودة طباعة عالية جداً.
        </p>

        <div className="mt-8 flex flex-wrap justify-start gap-4">
          <button onClick={() => router.push("/generator")} className="hero-btn shadow-lg shadow-amber-500/30">
            <span>+</span> صمّم الآن
          </button>
          <a href="#packages" className="hero-btn-outline text-white border-white/20 hover:bg-white/10 backdrop-blur-md">
            اكتشف العروض <span>◉</span>
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-start gap-6">
          <div className="hero-trust text-gray-200">
            <Truck className="h-4.5 w-4.5 text-[#F6D365]" />
            <span>توصيل سريع</span>
          </div>
          <div className="hero-trust text-gray-200">
            <Star className="h-4.5 w-4.5 text-[#F6D365]" />
            <span>تقييم 5 نجوم</span>
          </div>
          <div className="hero-trust text-gray-200">
            <CreditCard className="h-4.5 w-4.5 text-[#F6D365]" />
            <span>طباعة فاخرة</span>
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
    { icon: Laugh, label: "DHK", value: 99, name: "Dhahka" },
    { icon: Coffee, label: "9HW", value: 96, name: "9ahwa" },
    { icon: Coins, label: "TKK", value: 94, name: "Tektek" },
    { icon: Users, label: "S7B", value: 92, name: "S7ab" },
    { icon: LogOut, label: "HRB", value: 90, name: "Hroub" },
    { icon: Flame, label: "GZR", value: 98, name: "Gzara" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto text-center px-4 py-8">
      {/* Dark Glass Card Container */}
      <div className="relative rounded-3xl border border-white/10 bg-black/90 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/[0.06] blur-[140px] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="h-3.5 w-3.5 text-[#F6D365] animate-pulse" />
          <span>TUNISIAN MEME STATS ENGINE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-white drop-shadow-md">
          مش كان لاعبي الكورة عندهم ستاتيكس...
          <br />
          <span className="text-gold-grad">حتّى أحنا عندنا.</span>
        </h2>

        {/* Animated Flying Stat Chips */}
        <div className="mt-10 flex flex-wrap justify-center gap-3.5 max-w-2xl mx-auto">
          {stats.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`group flex items-center gap-2.5 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/15 to-transparent px-4 py-2.5 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] cursor-default ${
                  isActive && isAnimating ? "hero-fly" : ""
                }`}
                style={{
                  animationDelay:
                    isActive && isAnimating ? `${i * 0.08 + 0.1}s` : "0s",
                }}
              >
                <Icon className="h-4.5 w-4.5 text-[#F6D365] transition-transform group-hover:rotate-12" />
                <span className="font-black text-lg text-[#F6D365]">{item.value}</span>{" "}
                <span className="font-bold text-xs tracking-wider text-gray-200 uppercase">{item.label}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-sm sm:text-base text-gray-300 font-medium" dir="rtl">
          كل واحد عنده ستاتيكس خاصة بيه تضحّك وتخلّد ذكرياته.
        </p>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={goNext} className="hero-btn text-sm shadow-lg shadow-amber-500/30">
            التالي →
          </button>
        </div>
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
    <div className="w-full max-w-4xl mx-auto text-center px-4 py-8">
      <div className="relative rounded-3xl border border-white/10 bg-black/90 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-6">
          <Trophy className="h-4 w-4 text-[#F6D365]" />
          <span>THE FINAL LEGEND</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-white drop-shadow-md">
          كل واحد عنده ستاتيكس خاصة بيه...
          <br />
          <span className="text-gold-grad">شنوّة الستاتيكس متاعك إنتي؟</span>
        </h2>

        <div className="mt-8 flex justify-center">
          <div className="bg-black/90 rounded-2xl border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl flex flex-col items-center max-w-[320px] group hover:scale-105 transition-transform duration-300">
            <Award className="h-10 w-10 text-[#F6D365] mb-2 animate-bounce" />
            <div className="text-4xl font-black text-[#F6D365]">? ? ?</div>
            <div className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Your Stats OVR</div>
            <div className="flex justify-center gap-4 mt-4 text-xs font-bold">
              <div>
                <span className="text-[#F6D365]">??</span>{" "}
                <span className="text-gray-400">DHK</span>
              </div>
              <div>
                <span className="text-[#F6D365]">??</span>{" "}
                <span className="text-gray-400">9HW</span>
              </div>
              <div>
                <span className="text-[#F6D365]">??</span>{" "}
                <span className="text-gray-400">S7B</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button onClick={() => router.push("/generator")} className="hero-btn shadow-lg shadow-amber-500/30">
            + صمّمها الآن
          </button>
          <a href="#gallery" className="hero-btn-outline text-white border-white/20 hover:bg-white/10 backdrop-blur-md">
            شوف أمثلة <span>◉</span>
          </a>
        </div>


      </div>
    </div>
  );
}