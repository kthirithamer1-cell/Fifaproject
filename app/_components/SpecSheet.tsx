import { SectionTitle } from "./SectionTitle";
import { Shield, Layers, Printer, Droplets } from "lucide-react";

const specs = [
  {
    icon: Layers,
    title: "Material",
    value: "0.8mm Rigid PVC",
    description: "Credit-card grade synthetic composite. Waterproof, shatter-resistant, and built to last for years.",
  },
  {
    icon: Printer,
    title: "Print Resolution",
    value: "1200 DPI",
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
    value: "Water & UV Proof",
    description: "Fully sealed edges and UV-stabilized inks. Your card stays perfect in sun, rain, or humidity.",
  },
];

export function SpecSheet() {
  return (
    <section className="bg-[#080808] py-16 sm:py-20" id="specs">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle className="mb-10 sm:mb-14">
          MATERIAL SPECIFICATIONS
        </SectionTitle>

        <p className="text-sm text-neutral-400 max-w-xl mb-10 leading-relaxed">
          Every Kartetna card is engineered for premium quality. Here is exactly what goes into each card we produce.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.title}
                className="group rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-6 sm:p-8 transition-all duration-300 hover:border-yellow-400/15 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400/[0.08] border border-yellow-400/[0.08]">
                    <Icon className="h-5.5 w-5.5 text-yellow-400 stroke-[1.5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1">
                      {spec.title}
                    </div>
                    <div className="text-lg font-black text-white mb-2">
                      {spec.value}
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
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
