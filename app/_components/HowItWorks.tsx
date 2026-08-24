"use client";

import { SectionTitle } from "./SectionTitle";
import { Camera, Smile, Package, Sparkles, ChevronLeft, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const stepsData = [
  {
    number: "01",
    title: "ابعث تصويرة 📸",
    desc: "ارفع أي صورة واضحة بالهاتف لصاحبك أو لروحك. الذكاء الاصطناعي يقوم بعزل الخلفية وتحسين الإضاءة مجاناً.",
    highlight: "عزل الخلفية مجاناً",
  },
  {
    number: "02",
    title: "خصّص الستاتيكس ⚽",
    desc: "اختر الستاتيكس التونسية (DHK, 9HW, KLM...)، اسم الكارت، والريتينغ المضحك اللي يعبّر عليه بالحق.",
    highlight: "+60 ستات تونسي",
  },
  {
    number: "03",
    title: "توصلك لباب دارك 🚚",
    desc: "نطبعو كارتك بجودة فاخرة مقاومة للماء ونوصلوهالك في 24-48 ساعة، والخلاص عند الاستلام بعد ما تفحصها.",
    highlight: "خلاص عند الاستلام 100%",
  },
];

export function HowItWorks() {
  const router = useRouter();

  return (
    <section id="how" className="relative bg-[#0B0B0B] py-20 sm:py-24 overflow-hidden text-white" dir="rtl">
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="text-center flex flex-col items-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#F6D365] animate-pulse" />
            <span>كيفاش تصنع كارتك؟</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            3 خطوات بسيطة <span className="bg-gradient-to-r from-[#D4AF37] to-[#F6D365] bg-clip-text text-transparent">في دقيقتين فقط</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-lg mx-auto font-space">
            كل شيء سهل وسريع من هاتفك بدون أي تعقيد
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {stepsData.map((step, index) => (
            <div
              key={step.number}
              className="group relative flex flex-col justify-between text-right p-6 sm:p-8 rounded-3xl bg-neutral-900/80 border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(212,175,55,0.15)]"
            >
              {/* Step Number Top Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black font-mono text-[#D4AF37]/30 group-hover:text-[#F6D365] transition-colors">
                  {step.number}
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full font-space">
                  {step.highlight}
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 group-hover:text-[#F6D365] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-space">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-space">
                <span>الخطوة {index + 1} من 3</span>
                <span className="text-[#F6D365] font-bold">جاهز؟</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push("/generator")}
            className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-sm sm:text-base shadow-[0_8px_30px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center gap-2 font-space"
          >
            <Sparkles className="h-4 w-4 text-black" />
            <span>ابدأ تصميم كارتك الآن</span>
            <ArrowLeft className="h-4 w-4 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
}