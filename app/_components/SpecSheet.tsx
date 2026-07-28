"use client";

import { SectionTitle } from "./SectionTitle";
import { Shield, Layers, Printer, Droplets, Sparkles, CheckCircle } from "lucide-react";

const specs = [
  {
    icon: Layers,
    title: "Material Spec",
    value: "0.8mm Rigid PVC",
    description: "Credit-card grade synthetic composite. Waterproof, shatter-resistant, and built to last for years.",
  },
  {
    icon: Printer,
    title: "Print Resolution",
    value: "1200 DPI UV Print",
    description: "Ultra-high-density UV-cured printing. Every pixel is razor sharp with vibrant color reproduction.",
  },
  {
    icon: Shield,
    title: "Surface Coating",
    value: "Anti-Scratch Laminate",
    description: "Protective matte or gloss overlay that prevents scratches, fingerprints, and color fade over time.",
  },
  {
    icon: Droplets,
    title: "Weather Resistance",
    value: "Water & UV Proof 100%",
    description: "Fully sealed edges and UV-stabilized inks. Your card stays perfect in sun, rain, or humidity.",
  },
];

export function SpecSheet() {
  return (
    <section className="relative bg-[#060606] py-20 sm:py-24 text-white overflow-hidden" id="specs">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>CRAFT & QUALITY GUARANTEE</span>
            </div>
            <SectionTitle className="text-white text-2xl sm:text-3xl font-black">
              MATERIAL SPECIFICATIONS
            </SectionTitle>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed font-medium">
            Every Flawless card is engineered for premium durability and credit-card feel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.title}
                className="group relative rounded-3xl border border-white/10 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-neutral-900/90 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(212,175,55,0.12)]"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 text-[#F6D365] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 stroke-[1.75]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-[#F6D365] uppercase tracking-widest">
                        {spec.title}
                      </span>
                      <CheckCircle className="h-4 w-4 text-emerald-400 opacity-80" />
                    </div>
                    <div className="text-xl font-black text-white mb-2 group-hover:text-[#F6D365] transition-colors">
                      {spec.value}
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                      {spec.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
