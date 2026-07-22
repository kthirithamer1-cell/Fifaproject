import { steps } from "./data";
import { SectionTitle } from "./SectionTitle";
import { Camera, Smile, Palette, Package, ArrowRight } from "lucide-react";

const stepIcons = [Camera, Smile, Palette, Package];

export function HowItWorks() {
  return (
    <section id="how" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle className="mb-10 sm:mb-14">HOW IT WORKS</SectionTitle>

        {/* Steps flow */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
          {steps.map((step, index) => {
            const IconComponent = stepIcons[index] || Camera;
            return (
              <div key={step.number} className="contents">
                {/* Step card */}
                <div className="flex flex-col items-center text-center group">
                  {/* Icon circle */}
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-[#E5A500]/20 bg-[#E5A500]/[0.05] text-[#E5A500] transition-all duration-300 group-hover:border-[#E5A500]/40 group-hover:bg-[#E5A500]/[0.1] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(229,165,0,.15)]">
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 stroke-[1.5]" />
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-[10px] font-bold tracking-[0.15em] text-[#B07D00]/70 uppercase">
                    {step.number}
                  </div>
                  <div className="mt-1 text-xs font-bold text-gray-900 uppercase tracking-wide max-w-[100px] leading-tight">
                    {step.label}
                  </div>
                </div>

                {/* Arrow (not after last) */}
                {index < steps.length - 1 && (
                  <div className="text-[#E5A500]/30 hidden sm:block">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}