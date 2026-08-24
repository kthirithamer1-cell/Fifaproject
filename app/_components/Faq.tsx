"use client";

import { useState, useEffect } from "react";
import { Clock, Truck, Sliders, CreditCard, Camera, Sparkles, HelpCircle, ShieldCheck } from "lucide-react";

const FAQ_ITEMS_STREAMLINED = [
  {
    icon: Truck,
    question: "كم يستغرق التوصيل لباب داري؟",
    answer: "التوصيل سريع في ظرف 24 إلى 48 ساعة فقط بعد تأكيد الطلب، نوصّلو لباب دارك أو مقر عملك في كامل الـ 24 ولاية تونسية 🇹🇳.",
  },
  {
    icon: ShieldCheck,
    question: "كيف يتم الدفع؟ وهل أستطيع فحص الكارت قبل الخلاص؟",
    answer: "نعم! الدفع 100% عند الاستلام (Paiement à la livraison). عون التوصيل يعطيك الكارت تفحص جودة الطباعة والألوان قبل أن تدفع أي مليم.",
  },
  {
    icon: Camera,
    question: "هل أحتاج إلى صورة احترافية أو صورة كورة؟",
    answer: "لا أبداً! أي صورة واضحة من الهاتف تكفي. الذكاء الاصطناعي يقوم تلقائياً بإزالة الخلفية وتحسين الإضاءة لتظهر مثل كارت FIFA الرسمي.",
  },
  {
    icon: Sparkles,
    question: "ما هي المادة وجودة صنع الكارت؟",
    answer: "طباعة فوتوغرافية Ultra-HD على لوح PVC صلب 0.8mm مقاوم للكسر والماء والخدوش، مع لمسة ذهبية أصلية وعلبة تغليف فاخرة جاهزة للإهداء 🎁.",
  },
];

export function Faq() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);

  return (
    <section className="relative py-20 sm:py-24 bg-[#080808] text-white overflow-hidden" id="faq" dir="rtl">
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      {/* Gold Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)' }} />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-3">
            <HelpCircle className="h-4 w-4 text-[#F6D365]" />
            <span>الأسئلة الأكثر تكراراً</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            كل ما يهمك معرفته <span className="bg-gradient-to-r from-[#D4AF37] to-[#F6D365] bg-clip-text text-transparent">عن الكارت والتوصيل</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
          {FAQ_ITEMS_STREAMLINED.map((faq, index) => {
            const isOpen = openQuestion === index;
            const IconComponent = faq.icon;

            return (
              <div
                key={index}
                className={`rounded-2xl border bg-neutral-950/80 p-5 transition-all duration-300 ${
                  isOpen
                    ? "border-[#D4AF37]/60 shadow-[0_8px_30px_rgba(212,175,55,0.15)] bg-neutral-950"
                    : "border-white/10 hover:border-white/20 hover:bg-neutral-900/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenQuestion(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-3 text-right cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                      <IconComponent className="h-4.5 w-4.5 text-[#F6D365]" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-white leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-[#F6D365] transition-transform duration-300 ${
                      isOpen ? "rotate-45 bg-[#D4AF37]/20 border-[#D4AF37]" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-3.5 pt-3.5 border-t border-white/10 text-xs sm:text-sm text-gray-300 leading-relaxed font-space">
                    {faq.answer}
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