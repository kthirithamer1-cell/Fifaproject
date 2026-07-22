import { testimonials } from "./data";
import { SectionTitle } from "./SectionTitle";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="bg-[#FAFAFA] py-16 sm:py-20" id="testimonials">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle className="mb-10 sm:mb-14">
          WHAT OUR CLIENTS SAY
        </SectionTitle>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-[#E5A500]/25 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E5A500]/15 to-[#E5A500]/5 text-xs font-black text-[#C98600] border border-[#E5A500]/10 shadow-inner">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5 text-[#E5A500]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#E5A500] stroke-[#E5A500]" />
                    ))}
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {testimonial.name}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm font-medium text-gray-600 leading-relaxed" dir="rtl">
                &quot;{testimonial.quote}&quot;
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}