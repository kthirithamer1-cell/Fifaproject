"use client";

import { SectionTitle } from "./SectionTitle";
import { CreditCard, Gift, Sparkles, Ruler, Truck, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";
import { trackAddToCart } from "@/lib/fbPixel";
import { useRouter } from "next/navigation";

const PACKAGES_DATA = [
  {
    name: "PREMIUM PACK",
    titleAr: "كارت الحجم القياسي Standard",
    price: "49",
    size: "45 × 30 cm",
    badge: "STANDARD SIZE",
    description: "كارت بحجم مثالي لتزيين المكتب أو البيت، مع طباعة فوتوغرافية فائقة الدقة ولوح PVC صلب 0.8mm مغلف.",
    features: [
      { text: "أبعاد الكارت: 45×30 سم (Standard)", icon: Ruler },
      { text: "لوح PVC صلب 0.8mm مقاوم للماء والكسر", icon: CreditCard },
      { text: "طبقة حماية عازلة ضد الخدوش ولمعة ذهبية", icon: Sparkles },
      { text: "علبة تغليف فاخرة جاهزة للإهداء 🎁", icon: Gift },
    ],
  },
  {
    name: "ULTIMATE PACK",
    titleAr: "كارت الحجم العملاق Mega Giant",
    price: "69",
    size: "60 × 40 cm",
    badge: "🔥 الأكثر طلباً في تونس",
    isFeatured: true,
    description: "حجم عملاق فخم وضخم جداً لمفاجأة وهدية استثنائية لا تُنسى في أعياد الميلاد والنجاح.",
    features: [
      { text: "أبعاد الكارت: 60×40 سم (Mega Giant)", icon: Ruler },
      { text: "لوح PVC صلب 0.8mm مقاوم للماء والكسر", icon: CreditCard },
      { text: "طبقة حماية عازلة ضد الخدوش ولمعة ذهبية", icon: Sparkles },
      { text: "علبة تغليف فاخرة جاهزة للإهداء 🎁", icon: Gift },
    ],
  },
];

export function Packages() {
  const router = useRouter();

  return (
    <section className="relative bg-[#090909] py-20 sm:py-28 text-white overflow-hidden" id="packages" dir="rtl">
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)' }} />
        <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(246,211,101,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">
        <div className="text-center flex flex-col items-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#F6D365] animate-pulse" />
            <span>اختر الحجم المناسب لهديتك</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            باقات وأسعار <span className="bg-gradient-to-r from-[#D4AF37] to-[#F6D365] bg-clip-text text-transparent">FLAWLESS</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-lg mx-auto font-space">
            نفس الجودة العالية والصلابة الفاخرة، والفرق الوحيد في أبعاد وحجم الكارت.
          </p>
        </div>

        {/* 2 Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PACKAGES_DATA.map((pack) => {
            const isFeatured = !!pack.isFeatured;

            return (
              <div
                key={pack.name}
                className={`relative flex flex-col justify-between rounded-3xl border p-7 sm:p-9 transition-all duration-300 group hover:-translate-y-2 ${
                  isFeatured
                    ? "border-[#D4AF37] bg-gradient-to-b from-neutral-900/95 via-neutral-900/80 to-[#D4AF37]/10 shadow-[0_20px_50px_rgba(212,175,55,0.2)] scale-[1.02]"
                    : "border-white/10 bg-neutral-900/70 hover:border-[#D4AF37]/50 hover:shadow-[0_12px_40px_rgba(212,175,55,0.12)]"
                }`}
              >
                <div>
                  {/* Top Badge */}
                  {pack.badge && (
                    <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-[11px] font-black tracking-wider uppercase shadow-lg ${
                      isFeatured
                        ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black shadow-[#D4AF37]/30"
                        : "bg-neutral-800 text-gray-200 border border-white/15"
                    }`}>
                      {pack.badge}
                    </div>
                  )}

                  {/* Name & Title */}
                  <div className="mt-2 text-right">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-[#F6D365] font-mono">
                      {pack.name}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                      {pack.titleAr}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-2 text-right">
                    <span className="text-5xl sm:text-6xl font-black tracking-tight text-white group-hover:text-[#F6D365] transition-colors font-mono">
                      {pack.price}
                    </span>
                    <span className="text-xl font-bold text-[#F6D365] font-space">
                      دينار تونسي (DT)
                    </span>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-gray-300 font-space leading-relaxed text-right">
                    {pack.description}
                  </p>

                  {/* Dimensions badge */}
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-gray-200 font-space">
                    <Ruler className="h-4 w-4 text-[#F6D365]" />
                    <span className="font-bold">أبعاد الكارت: {pack.size}</span>
                  </div>

                  {/* Divider */}
                  <div className="my-6 border-t border-white/10" />

                  {/* Features */}
                  <ul className="flex flex-col gap-3 text-right">
                    {pack.features.map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <li
                          key={idx}
                          className="flex items-center gap-3 text-gray-200 text-xs sm:text-sm font-space"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#F6D365] border border-[#D4AF37]/30">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span>{feature.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Choose Button */}
                <button
                  onClick={() => {
                    trackAddToCart({
                      content_name: `Flawless Card - ${pack.name}`,
                      value: Number(pack.price),
                    });
                    router.push(`/generator?size=${isFeatured ? "mega" : "standard"}`);
                  }}
                  className={`mt-8 w-full py-4 rounded-2xl text-center text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 font-space ${
                    isFeatured
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black shadow-lg shadow-[#D4AF37]/30 hover:scale-[1.02]"
                      : "bg-white/10 text-white border border-white/15 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37]"
                  }`}
                >
                  <span>اطلب الآن ({pack.price} DT)</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Security / Quality guarantee note */}
        <div className="mt-10 text-center flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-space font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>الدفع 100% عند الاستلام بعد فحص الكارت</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#F6D365]" />
            <span>توصيل سريع 24-48 ساعة لباب الدار</span>
          </div>
        </div>
      </div>
    </section>
  );
}