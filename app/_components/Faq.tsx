"use client";

import { useState, useEffect } from "react";
import { faqs } from "./data";
import { Clock, Truck, Sliders, CreditCard, Camera, PenTool, HelpCircle } from "lucide-react";

const FAQ_ICONS = [Clock, Truck, Sliders, CreditCard, Camera, PenTool];

export function Faq() {
  const [mounted, setMounted] = useState(false);
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    faqs[0]?.question ?? null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative py-24 bg-[#080808] text-white overflow-hidden" id="faq" suppressHydrationWarning>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" suppressHydrationWarning />
      </section>
    );
  }

  return (
    <section className="relative py-24 bg-[#080808] text-white overflow-hidden" id="faq" suppressHydrationWarning>
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" suppressHydrationWarning />

      {/* Gold Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)' }} suppressHydrationWarning />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-4">
            <HelpCircle className="h-4 w-4 text-[#F6D365]" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            الأسئلة <span className="text-gold-grad">الشائعة</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {faqs.map((faq, index) => {
            const isOpen = openQuestion === faq.question;
            const IconComponent = FAQ_ICONS[index] || Clock;

            return (
              <div
                key={faq.question}
                className={`rounded-2xl border bg-black/70 px-6 transition-all duration-300 ${
                  isOpen
                    ? "border-[#D4AF37]/60 shadow-[0_8px_30px_rgba(212,175,55,0.15)] bg-black/90"
                    : "border-white/10 hover:border-white/25 hover:bg-black/80"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenQuestion(isOpen ? null : faq.question)
                  }
                  className="flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-3 text-sm font-bold text-white sm:text-base">
                    <div className="h-9 w-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                      <IconComponent className="h-4.5 w-4.5 text-[#F6D365]" />
                    </div>
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-lg font-bold text-[#F6D365] transition-transform duration-300 ${
                      isOpen ? "rotate-45 bg-[#D4AF37]/20 border-[#D4AF37]" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                     isOpen
                      ? "grid-rows-[1fr] pb-5 opacity-100 border-t border-white/10 pt-3"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 text-sm text-gray-300 leading-relaxed font-medium" dir="rtl">
                    {faq.answer}
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