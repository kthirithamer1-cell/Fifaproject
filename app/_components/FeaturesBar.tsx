import { features } from "./data";
import { Laugh, Shield, Gift, Truck, Star } from "lucide-react";

const FEATURE_ICONS = [Laugh, Shield, Gift, Truck, Star];

export function FeaturesBar() {
  return (
    <section className="relative bg-[#F5F5F5] py-14 border-t border-b border-[#E5A500]/10">
      {/* Subtle gold glow */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-300/[.06] to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {features.map((feature, index) => {
            const IconComponent = FEATURE_ICONS[index] || Star;
            return (
              <div
                key={feature.title}
                className="group flex flex-col items-center"
              >
                {/* FIFA Card */}
                <div className="relative w-[160px] sm:w-[170px] transition-all duration-500 group-hover:-translate-y-3 group-hover:scale-105">
                  {/* Card glow on hover */}
                  <div className="absolute inset-0 rounded-xl bg-amber-300/15 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <img
                    src="/images/save.png"
                    alt={feature.title}
                    className="relative w-full select-none drop-shadow-[0_12px_24px_rgba(229,165,0,.15)]"
                  />

                  {/* Overlay content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Icon */}
                    <IconComponent className="h-7 w-7 text-[#E5A500] mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] stroke-[1.75]" />

                    {/* Stat */}
                    <span className="text-4xl font-black text-[#C98600] drop-shadow-lg">
                      {feature.stat}
                    </span>

                    {/* Code */}
                    <span className="mt-0.5 text-xs font-bold tracking-[0.3em] text-[#B07D00]/80">
                      {feature.label}
                    </span>

                    {/* Title */}
                    <span className="mt-3 text-[11px] font-extrabold uppercase text-gray-800 tracking-wide text-center leading-tight px-2">
                      {feature.title}
                    </span>

                    {/* Subtitle */}
                    {feature.subtitle && (
                      <span className="text-[9px] font-semibold uppercase text-gray-500 tracking-wider text-center">
                        {feature.subtitle}
                      </span>
                    )}
                  </div>

                  {/* Shine sweep on hover */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute -left-32 top-0 h-full w-16 rotate-12 bg-white/30 blur-xl transition-all duration-700 group-hover:left-[160%]" />
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