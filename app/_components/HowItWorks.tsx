"use client";

import { steps } from "./data";
import { SectionTitle } from "./SectionTitle";
import { Camera, Smile, Palette, Package, Sparkles, ChevronRight } from "lucide-react";

const stepDetails = [
  { icon: Camera, desc: "اختار صورة صحابك أو الشخصية اللّي تحب تحولها لأسطورة" },
  { icon: Smile, desc: "اختار ستاتيكس تونسية مضحكة وكلمات تضحك وتعبّر" },
  { icon: Palette, desc: "صمّم ديزاين الكارطة بالألوان، الريتينغ، والأسماء" },
  { icon: Package, desc: "نوصلوهالك مطبوعة على PVC Premium وين ما تكون في تونس" },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative bg-[#0B0B0B] py-20 sm:py-28 overflow-hidden text-white">
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      {/* Background Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)' }} />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(246,211,101,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col items-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#F6D365] animate-pulse" />
            <span>كيفاش تصمّم كارطتك في 4 خطوات</span>
          </div>
          <SectionTitle className="text-white text-2xl sm:text-4xl font-black tracking-wider">
            HOW IT WORKS
          </SectionTitle>
          <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-lg mx-auto font-medium" dir="rtl">
            حوّل أي شخص للكارطة التونسية الخاصة بيه في أقل من 2 دقائق.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Animated Glow Line Connector for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-[2px] -translate-y-12 bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/50 to-[#D4AF37]/10 z-0 pointer-events-none" />

          {steps.map((step, index) => {
            const stepConfig = stepDetails[index] || { icon: Camera, desc: "" };
            const IconComponent = stepConfig.icon;

            return (
              <div
                key={step.number}
                className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-neutral-900/70 border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_16px_45px_rgba(212,175,55,0.18)] z-10"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-black border border-[#D4AF37]/40 text-[#F6D365] text-[11px] font-black tracking-widest uppercase shadow-md group-hover:border-[#D4AF37] group-hover:scale-110 transition-all duration-300">
                  STEP {step.number}
                </div>

                {/* Animated Icon Circle */}
                <div className="relative mt-2 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent text-[#F6D365] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.4)]">
                  <IconComponent className="h-8 w-8 stroke-[1.75] transition-transform duration-500 group-hover:scale-110" />
                  
                  {/* Pulse Glow Aura */}
                  <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Step Title */}
                <h3 className="mt-6 text-base font-bold text-white tracking-wide uppercase group-hover:text-[#F6D365] transition-colors duration-300">
                  {step.label}
                </h3>

                {/* Step Description */}
                <p className="mt-2.5 text-xs sm:text-sm text-gray-300 leading-relaxed font-medium" dir="rtl">
                  {stepConfig.desc}
                </p>

                {/* Mobile Connector Chevron */}
                {index < steps.length - 1 && (
                  <div className="mt-6 lg:hidden text-[#D4AF37]/40">
                    <ChevronRight className="h-5 w-5 rotate-90 sm:rotate-0" />
                  </div>
                )}
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
            <Sparkles className="h-4 w-4" /> ابدأ التصميم الآن
          </a>
        </div>
      </div>
    </section>
  );
}