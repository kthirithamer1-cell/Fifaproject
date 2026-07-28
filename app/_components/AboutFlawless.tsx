"use client";

import { Sparkles, Trophy, ShieldCheck, HeartHandshake, Truck, Award, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function AboutFlawless() {
  const router = useRouter();

  const pillars = [
    {
      icon: Sparkles,
      title: "هويّة تونسية 100%",
      desc: "ستاتيكس ومواقف تونسية أصيلة توصف أصحابك والعائلة بأحلى طريقة ضاحكة.",
      tag: "TUNISIAN MEMES",
    },
    {
      icon: ShieldCheck,
      title: "طباعة فاخرة PVC Premium",
      desc: "كارتات صلبة مقاومة للماء والخدش، بتفاصيل ذهبية وطباعة عالية الجودة تعيش العمر كامل.",
      tag: "0.8MM PVC QUALITY",
    },
    {
      icon: HeartHandshake,
      title: "أحسن هدية تخلّد الذكريات",
      desc: "هدية أسطورية وغير تقليدية لعيد ميلاد، تخرج، ولاّ لمّة أصحاب تخليهم يضحكوا ويرميو الذكرى.",
      tag: "ULTIMATE GIFT",
    },
    {
      icon: Truck,
      title: "توصيل سريع لكل تونس",
      desc: "نوصّلو طلبك بكل عناية وحماية حتى لـ باب الدار في الـ 24 ولاية تونسية.",
      tag: "NATIONWIDE SHIPPING",
    },
  ];

  const brandStats = [
    { value: "+1,500", label: "كارطة تونسية صمّمت" },
    { value: "24", label: "ولاية توصيل في تونس" },
    { value: "4.9★", label: "تقييم أصحاب الكروت" },
    { value: "100%", label: "جودة ورضا الحرفاء" },
  ];

  return (
    <section id="about" className="relative py-24 bg-[#080808] text-white overflow-hidden">
      {/* Background Lighting & Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#D4AF37]/[0.04] blur-[180px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-500/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#F6D365]/[0.03] blur-[150px] pointer-events-none" />

      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-4">
            <Trophy className="h-4 w-4 text-[#F6D365]" />
            <span>ABOUT FLAWLESS TUNISIA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            شنوّة هيّة <span className="text-gold-grad">Flawless</span>؟
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-300 font-medium leading-relaxed" dir="rtl">
            مش كان للضحك فقط... <strong className="text-[#F6D365]">Flawless</strong> اتخلقت باش تصنع لأي شخص <strong className="text-white">Perfect Meme</strong> بكل عيوبه ومواصفاته الخاصة <span className="text-gray-400 font-semibold">(avec ses défauts)</span>، باش كل واحد يرا كارتته يكون <strong className="text-[#F6D365]">فخور بروحه وبشخصيته الفريدة</strong>.
          </p>
        </div>

        {/* Brand Showcase Hero Glass Card */}
        <div className="relative rounded-3xl border border-white/10 bg-black/70 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl mb-16 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Text story side */}
            <div className="lg:col-span-7 space-y-6 text-right" dir="rtl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F6D365] uppercase tracking-widest">
                <Zap className="h-4 w-4 text-[#F6D365]" />
                <span>فلسفة FLAWLESS</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                كل عيب فيك يولّي ستاتيك أسطوري... <br />
                <span className="text-gold-grad">باش تكون ديما فخور بروحك.</span>
              </h3>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                في Flawless نؤمنوا بلي كل إنسان عنده تفاصيل وعيوب مضحكة تخلّيه مميّز وفريد (99 نوم، 99 كثرة كلام، ولاّ 5 تكتاك). حوّلنا التفاصيل هذي إلى كارتات كورة فاخرة باش أي واحد يشوف كارتته، يضحك، ويكون فخور بنفسه وبشخصيته الأسطورية.
              </p>

              <div className="pt-4 flex flex-wrap justify-end gap-4">
                <button
                  onClick={() => router.push("/generator")}
                  className="hero-btn shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="h-4 w-4" /> صمّم كارتك الآن
                </button>
                <a
                  href="#packages"
                  className="hero-btn-outline text-white border-white/20 hover:bg-white/10 backdrop-blur-md"
                >
                  اكتشف العروض
                </a>
              </div>
            </div>

            {/* Visual showcase side */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 rounded-3xl bg-[#D4AF37]/20 blur-[50px] group-hover:bg-[#D4AF37]/35 transition-all duration-500" />
                <div className="relative rounded-2xl border border-[#D4AF37]/30 bg-black/90 p-6 shadow-2xl flex flex-col items-center max-w-[280px]">
                  <Award className="h-10 w-10 text-[#F6D365] mb-3 animate-bounce" />
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">FLAWLESS CARD</div>
                  <div className="text-2xl font-black text-white mt-1">صاحبك الأسطورة</div>
                  <div className="text-3xl font-black text-[#F6D365] mt-1">99 OVR</div>
                  <div className="mt-4 w-full grid grid-cols-3 gap-2 text-center text-xs border-t border-white/10 pt-3">
                    <div>
                      <div className="text-[#F6D365] font-bold">99</div>
                      <div className="text-gray-400 text-[10px]">DHK</div>
                    </div>
                    <div>
                      <div className="text-[#F6D365] font-bold">96</div>
                      <div className="text-gray-400 text-[10px]">9HW</div>
                    </div>
                    <div>
                      <div className="text-[#F6D365] font-bold">98</div>
                      <div className="text-gray-400 text-[10px]">S7B</div>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-gray-400 font-medium">Made in Tunisia 🇹🇳</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group relative rounded-2xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/50 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div className="h-12 w-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-[#F6D365]" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-2 text-right" dir="rtl">
                    {item.title}
                  </h4>

                  <p className="text-sm text-gray-400 leading-relaxed text-right" dir="rtl">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Counter Bar */}
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-black via-neutral-900 to-black p-8 shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {brandStats.map((st, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-gold-grad">{st.value}</div>
                <div className="text-xs sm:text-sm text-gray-300 font-semibold">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
