"use client";

import { Sparkles, Trophy, ShieldCheck, HeartHandshake, Truck, Award, Zap, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AboutFlawless() {
  const router = useRouter();

  const pillars = [
    {
      icon: ShieldCheck,
      title: "طباعة فاخرة Ultra-HD",
      desc: "لوح PVC صلب 0.8mm مع طبقة حماية عازلة ضد الماء والخدوش وحواف مذهبة تدوم لسنوات.",
      badge: "0.8MM RIGID PVC",
    },
    {
      icon: Sparkles,
      title: "ستاتيكس تونسية مضحكة 100%",
      desc: "أكثر من 60 ستات وميمز تونسي لتصميم كارت يحكي شخصية صاحبك بكل عيوبه ومواقفه المضحكة.",
      badge: "TUNISIAN MEMES",
    },
    {
      icon: Truck,
      title: "توصيل سريع لباب دارك",
      desc: "توصيل لباب دارك في كامل الـ 24 ولاية خلال 24-48 ساعة، مع الدفع عند الاستلام بعد فحص الكارت.",
      badge: "24-48H SHIPPING",
    },
  ];

  return (
    <section id="about" className="relative py-20 sm:py-28 bg-[#080808] text-white overflow-hidden" dir="rtl">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)' }} />

      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-3">
            <Trophy className="h-4 w-4 text-[#F6D365]" />
            <span>لماذا يختار الجميع FLAWLESS؟</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            أعلى جودة كروت في تونس <span className="bg-gradient-to-r from-[#D4AF37] to-[#F6D365] bg-clip-text text-transparent">بدون منافس</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 font-space">
            كل تفصيلة في الكارت مصممة ومطبوعة بحرفية عالية لتكون هدية تليق بأعز أصحابك وعائلتك.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group relative rounded-3xl border border-white/10 bg-neutral-950/80 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/50 hover:shadow-[0_12px_40px_rgba(212,175,55,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div className="h-12 w-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-[#F6D365]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#F6D365] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30 font-mono">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-space">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-space">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>مضمون 100% مع معاينة قبل الطباعة</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick CTA banner */}
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right shadow-xl">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              جاهز تصنع كارت يفاجئ صاحبك ويفرحو؟ 🎉
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 font-space mt-1">
              التصميم يأخذ أقل من دقيقتين • الدفع عند الاستلام لباب الدار
            </p>
          </div>
          <button
            onClick={() => router.push("/generator")}
            className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#C98600] text-black font-bold text-sm transition-all duration-300 cursor-pointer shrink-0 shadow-lg font-space"
          >
            صمّم كارتك الآن ←
          </button>
        </div>
      </div>
    </section>
  );
}
