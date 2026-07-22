"use client";

import { useState } from "react";
import { faqs } from "./data";
import { SectionTitle } from "./SectionTitle";
import { Clock, Truck, Sliders, CreditCard, Camera, PenTool } from "lucide-react";

const FAQ_ICONS = [Clock, Truck, Sliders, CreditCard, Camera, PenTool];

export function Faq() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    faqs[0]?.question ?? null
  );

  return (
    <section className="bg-white py-16 sm:py-20" id="faq">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle className="mb-10 sm:mb-14">FAQ</SectionTitle>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {faqs.map((faq, index) => {
            const isOpen = openQuestion === faq.question;
            const IconComponent = FAQ_ICONS[index] || Clock;

            return (
              <div
                key={faq.question}
                className={`rounded-xl border bg-[#F9F9F9] px-5 transition-colors duration-300 ${
                  isOpen ? "border-[#E5A500]/50" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenQuestion(isOpen ? null : faq.question)
                  }
                  className="flex w-full items-center justify-between gap-4 py-4 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 sm:text-base">
                    <IconComponent className="h-4.5 w-4.5 text-[#E5A500] shrink-0 stroke-[1.75]" />
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-lg font-bold text-[#E5A500] transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid overflow-hidden transition-all duration-200 ease-in-out ${
                     isOpen
                      ? "grid-rows-[1fr] pb-4 opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 text-sm text-gray-500 leading-relaxed" dir="rtl">
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