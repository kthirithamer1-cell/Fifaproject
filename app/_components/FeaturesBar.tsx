"use client";

import { features } from "./data";
import { SectionTitle } from "./SectionTitle";
import { Laugh, Shield, Gift, Truck, Star, Sparkles, Award } from "lucide-react";
import Image from "next/image";

const FEATURE_ICONS = [Laugh, Shield, Gift, Truck, Star];

const FEATURE_BADGES = [
  "100% TUNISIAN MEMES",
  "PREMIUM PVC & UV PRINT",
  "THE UNFORGETTABLE GIFT",
  "FAST NATIONWIDE SHIPPING",
  "5-STAR CUSTOMER RATING",
];

export function FeaturesBar() {
  return (
    <section className="relative bg-[#070707] py-20 sm:py-24 overflow-hidden text-white border-y border-white/10">
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      {/* Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)' }} />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(246,211,101,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col items-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#F6D365] animate-pulse" />
            <span>WHY FLAWLESS CUSTOM CARDS</span>
          </div>
          <SectionTitle className="text-white text-3xl sm:text-4xl font-black tracking-wider">
            FEATURE HIGHLIGHTS
          </SectionTitle>
          <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-lg mx-auto font-medium" dir="rtl">
            مميزات خرافية تجعل من كارطة Flawless الهديّة الأفضل والأكثر تميّزاً في تونس.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = FEATURE_ICONS[index] || Star;
            const badgeText = FEATURE_BADGES[index] || "PREMIUM QUALITY";

            return (
              <div
                key={feature.title}
                className="group relative flex flex-col items-center text-center p-6 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_16px_40px_rgba(212,175,55,0.18)]"
              >
                {/* FIFA Style Card Image Box */}
                <div className="relative w-[150px] sm:w-[160px] mb-6 transition-all duration-500 group-hover:scale-105">
                  {/* Glowing Backlight */}
                  <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/25 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <Image
                    src="/images/save.webp"
                    alt={feature.title}
                    width={160}
                    height={220}
                    className="relative w-full select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
                  />

                  {/* Card Content Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                    <IconComponent className="h-7 w-7 text-[#4A3500] mb-1 stroke-[2] transition-transform duration-300 group-hover:scale-110" />

                    <span className="text-3xl font-black text-[#2A1D00] drop-shadow-sm">
                      {feature.stat}
                    </span>

                    <span className="mt-0.5 text-[10px] font-black tracking-[0.25em] text-[#5C4300]">
                      {feature.label}
                    </span>

                    <span className="mt-2 text-[10px] font-black uppercase text-[#111111] tracking-wide text-center leading-tight">
                      {feature.title}
                    </span>
                  </div>

                  {/* Shine Sweep Highlight */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    <div className="absolute -left-32 top-0 h-full w-16 rotate-12 bg-white/20 blur-lg transition-all duration-700 group-hover:left-[160%]" />
                  </div>
                </div>

                {/* Badge Tag */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F6D365] bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  <Award className="h-3 w-3 text-[#F6D365]" />
                  <span>{feature.label} POWER</span>
                </div>

                {/* Subtitle */}
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  {badgeText}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-14 text-center">
          <a
            href="/generator"
            className="hero-btn shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> صمّم كارتك الآن
          </a>
        </div>
      </div>
    </section>
  );
}