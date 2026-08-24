"use client";

import { useState, useEffect } from "react";
import { testimonials } from "./data";
import { Star, Quote, CheckCircle2, HeartHandshake } from "lucide-react";

export function Testimonials() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative bg-[#0A0A0A] text-white py-24 overflow-hidden" id="testimonials" suppressHydrationWarning>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" suppressHydrationWarning />
      </section>
    );
  }

  return (
    <section className="relative bg-[#0A0A0A] text-white py-24 overflow-hidden" id="testimonials" suppressHydrationWarning>
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      {/* Background subtle ambient element */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-3">
              <HeartHandshake className="h-3.5 w-3.5 text-[#F6D365]" />
              <span>REAL TUNISIAN REVIEWS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              آراء <span className="text-gold-grad">تونسية، ما فيهاش مجاملة</span>
            </h2>
            <p className="mt-3 text-sm text-gray-300 max-w-xl leading-relaxed font-medium" dir="rtl">
              أكثر من 500+ تونسي جربوا كروت Flawless وفرحوا أصحابهم بعروض وأفكار كارتات مضحكة وأسطورية.
            </p>
          </div>

          {/* Overall Rating Badge */}
          <div className="flex items-center gap-3 bg-black/80 border border-[#D4AF37]/30 px-5 py-3 rounded-2xl shadow-xl self-start md:self-end">
            <div className="flex text-[#F6D365]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#F6D365] stroke-[#F6D365]" />
              ))}
            </div>
            <div className="text-xs font-bold text-white">
              4.9/5 Rating <span className="text-gray-400 font-normal">(500+ Orders)</span>
            </div>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-black/70 p-6 shadow-2xl transition-all duration-500 hover:border-[#D4AF37]/50 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(212,175,55,0.15)]"
            >
              {/* Decorative Quote Mark */}
              <Quote className="absolute top-5 right-5 h-8 w-8 text-[#D4AF37]/20 group-hover:text-[#D4AF37]/40 transition-colors duration-300 pointer-events-none" />

              <div>
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-sm font-black text-[#F6D365] border border-[#D4AF37]/30 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <div className="text-sm font-black text-white group-hover:text-[#F6D365] transition-colors">
                        {testimonial.name}
                      </div>
                      <span title="Verified Customer" className="inline-flex items-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 mt-0.5 text-[#F6D365]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-[#F6D365] stroke-[#F6D365]" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-sm font-semibold text-gray-200 leading-relaxed" dir="rtl">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>

              {/* Verified Badge Tag */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Verified Buyer</span>
                <span className="text-[#F6D365]">Tunisia 🇹🇳</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}