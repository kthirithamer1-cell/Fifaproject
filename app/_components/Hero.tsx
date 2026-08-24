"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Sparkles, 
  Truck, 
  Star, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2,
  Flame,
  ArrowLeft
} from "lucide-react";

export function Hero() {
  const router = useRouter();

  return (
    <section
      id="top"
      className="relative min-h-[90vh] sm:min-h-[95vh] w-full flex items-center justify-center overflow-hidden bg-black text-white py-20 sm:py-24"
    >
      {/* Background Ambient Radial Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute left-1/2 top-0 h-[600px] sm:h-[800px] w-[600px] sm:w-[800px] -translate-x-1/2 rounded-full" 
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.02) 45%, transparent 70%)' }} 
        />
        <div 
          className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full" 
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} 
        />
      </div>

      {/* Background Banner Image with High-End Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-black">
        <Image
          src="/images/image.webp"
          alt="Flawless Tunisian FIFA Card"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 filter brightness-90 sm:opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 text-center" dir="rtl">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F6D365] text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg shadow-[#D4AF37]/10 animate-fade-in">
          <Sparkles className="h-4 w-4 text-[#F6D365] animate-pulse" />
          <span>أقوى وأفخم كادو في تونس 🇹🇳</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
        </div>

        {/* Main Punchy Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.2] text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] max-w-4xl mx-auto">
          كل تونسي أسطورة... <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#F6D365] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-sm">
            يلزملو غير الكارطة الصحيحة
          </span>
        </h1>

        {/* Short, High-Impact Subtitle */}
        <p className="mt-5 text-sm sm:text-lg md:text-xl text-gray-200 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-md font-space">
          طباعة Ultra-HD فاخرة على لوح صلب مقاوم للماء • ستاتيكس تونسية مضحكة • توصيل لباب الدار في 24-48 ساعة والخلاص عند الاستلام 100%
        </p>

        {/* Primary High-Contrast CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => router.push("/generator")}
            className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F6D365] to-[#D4AF37] text-black font-black text-base sm:text-lg shadow-[0_10px_35px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_45px_rgba(212,175,55,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-space"
          >
            <Sparkles className="w-5 h-5 text-black" />
            <span>صمّم كارتك الآن (من 49 DT)</span>
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>

          <a
            href="#packages"
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all duration-300 text-center cursor-pointer font-space"
          >
            اكتشف الأحجام والأسعار
          </a>
        </div>

        {/* 3 Core Trust Badges (Zero Doubt) */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-gray-300 font-space font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Truck className="w-4 h-4" />
            </div>
            <span>توصيل 24/48h لباب الدار</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F6D365]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>خلاص 100% عند الاستلام</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span>تقييم 4.9★ من الحرفاء</span>
          </div>
        </div>

      </div>
    </section>
  );
}