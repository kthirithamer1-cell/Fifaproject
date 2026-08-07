"use client";

import { SectionTitle } from "./SectionTitle";
import { CreditCard, Gift, Sparkles, Ruler, Truck, ShieldCheck } from "lucide-react";

const PACKAGES_DATA = [
  {
    name: "PREMIUM PACK",
    price: "49",
    size: "45x30 cm",
    badge: "POPULAR CHOICE",
    description: "Ideal for individual gifts, desk displays, and standard size custom cards.",
    features: [
      { text: "Dimensions: 45x30 cm Standard", icon: Ruler },
      { text: "High-Quality Rigid PVC Card", icon: CreditCard },
      { text: "Luxury Custom Gift Packaging", icon: Gift },
      { text: "Anti-Scratch UV Protective Finish", icon: Sparkles },
    ],
  },
  {
    name: "ULTIMATE PACK",
    price: "69",
    size: "60x40 cm",
    badge: "BEST VALUE (MEGA SIZE)",
    isFeatured: true,
    description: "The ultimate showstopper! Large size card with gold finish & premium box.",
    features: [
      { text: "Dimensions: 60x40 cm (Mega Giant Size)", icon: Ruler },
      { text: "Extra Heavy Rigid PVC Master Card", icon: CreditCard },
      { text: "Deluxe Gift Packaging + Display Stand", icon: Gift },
      { text: "Liquid Gold Accent & Glossy Coating", icon: Sparkles },
      { text: "Priority Delivery in Tunisia 🚚", icon: Truck },
    ],
  },
];

export function Packages() {
  return (
    <section className="relative bg-[#090909] py-20 sm:py-28 text-white overflow-hidden" id="packages">
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      {/* Ambient Lighting Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/[0.05] blur-[160px]" />
        <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#F6D365]/[0.04] blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col items-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#F6D365] animate-pulse" />
            <span>EXCLUSIVELY 2 PACKAGES AVAILABLE</span>
          </div>
          <SectionTitle className="text-white text-3xl sm:text-4xl font-black tracking-wider">
            CHOOSE YOUR PACKAGE
          </SectionTitle>
          <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-md mx-auto font-medium" dir="rtl">
            اختر الحجم والباك المناسب لك، التوصيل لكامل تراب الجمهورية.
          </p>
        </div>

        {/* 2 Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PACKAGES_DATA.map((pack) => {
            const isFeatured = !!pack.isFeatured;

            return (
              <div
                key={pack.name}
                className={`relative flex flex-col justify-between rounded-3xl border p-8 sm:p-10 transition-all duration-500 backdrop-blur-xl group hover:-translate-y-2.5 ${
                  isFeatured
                    ? "border-[#D4AF37] bg-gradient-to-b from-neutral-900/90 via-neutral-900/80 to-[#D4AF37]/10 shadow-[0_20px_50px_rgba(212,175,55,0.2)] scale-[1.02]"
                    : "border-white/10 bg-neutral-900/60 hover:border-[#D4AF37]/50 hover:shadow-[0_12px_40px_rgba(212,175,55,0.12)]"
                }`}
              >
                <div>
                  {/* Top Badge */}
                  {pack.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F6D365] px-4 py-1 text-[11px] font-black tracking-wider text-black uppercase shadow-lg shadow-[#D4AF37]/30">
                      {pack.badge}
                    </div>
                  )}

                  {/* Name */}
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-[#F6D365] mt-2">
                    {pack.name}
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-6xl font-black tracking-tight text-white group-hover:text-[#F6D365] transition-colors">
                      {pack.price}
                    </span>
                    <span className="text-lg font-black text-[#F6D365]">
                      DT
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-400 font-medium leading-relaxed">
                    {pack.description}
                  </p>

                  {/* Dimensions badge */}
                  <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-gray-200">
                    <Ruler className="h-4 w-4 text-[#F6D365]" />
                    <span className="font-bold">{pack.size}</span>
                  </div>

                  {/* Divider */}
                  <div className="my-6 border-t border-white/10" />

                  {/* Features */}
                  <ul className="flex flex-col gap-3.5">
                    {pack.features.map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <li
                          key={idx}
                          className="flex items-center gap-3 text-gray-200 text-xs sm:text-sm font-medium"
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
                <a
                  href={`/generator?size=${isFeatured ? "mega" : "standard"}`}
                  className={`mt-10 w-full py-4 rounded-2xl text-center text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isFeatured
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black shadow-lg shadow-[#D4AF37]/30 hover:scale-[1.02]"
                      : "bg-white/10 text-white border border-white/15 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37]"
                  }`}
                >
                  Commander Package ({pack.price} DT)
                </a>
              </div>
            );
          })}
        </div>

        {/* Security / Quality guarantee note */}
        <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#F6D365]" />
            <span>Paiement 100% sécurisé à la livraison</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-[#F6D365]" />
            <span>توصيل سريع في 24-48 ساعة</span>
          </div>
        </div>
      </div>
    </section>
  );
}