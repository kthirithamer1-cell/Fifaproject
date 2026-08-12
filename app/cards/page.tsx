import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Wand2, Star, ShieldCheck, Flame, ChevronLeft } from "lucide-react";
import { Header } from "@/app/_components/Header";
import { Footer } from "@/app/_components/Footer";
import { CARD_PRODUCTS } from "./data";

export const metadata: Metadata = {
  title: "كروت فيفا تونسية مخصصة 100% — تشكيلة أساطير الكوميديا والكورة | Flawless",
  description:
    "اكتشف تشكيلة كروت فيفا تونسية مخصصة: كارت كريم الغربي 98، كارت يوسف المايسترو، كارت قادر البوس، وسوسو الملكة. طباعة PVC فاخرة وتوصيل لكل تونس.",
  keywords: [
    "كروت فيفا تونسية مخصصة",
    "carte fifa personnalisee tunisie",
    "كارت كريم الغربي",
    "karim gharbi fifa card",
    "cadeau original homme tunisie",
    "coffret cadeau homme tunisie",
  ],
  alternates: {
    canonical: "https://beflawless.art/cards",
  },
  openGraph: {
    title: "تشكيلة كروت فيفا التونسية الأسطورية — Flawless",
    description: "اكتشف واطلب كروت الأساطير التونسية المطبوعة على خامة PVC فاخرة 🇹🇳",
    url: "https://beflawless.art/cards",
    type: "website",
    locale: "ar_TN",
  },
};

export default function CardsCatalogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#070707] text-white pt-28 pb-20 overflow-hidden relative">
        {/* Glow */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#D4AF37]/10 to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="h-4 w-4" />
              <span>COLLECTION OF TUNISIAN MEME & FOOTBALL LEGENDS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              تشكيلة كروت <span className="text-gold-grad">أساطير تونس</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 mt-4 leading-relaxed">
              اختر كارت أسطورتك المفضلة (كريم الغربي، يوسف، قادر، سوسو، الدلاعي) أو صمّم كارتك الخاصة بصورتك وستاتيكس تونسية مخصصة 100%!
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CARD_PRODUCTS.map((card) => (
              <div
                key={card.slug}
                className="group relative rounded-3xl border border-white/10 bg-black/80 p-5 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-[#D4AF37]/60 hover:shadow-[0_15px_40px_rgba(212,175,55,0.2)] flex flex-col justify-between"
              >
                {/* Glow on hover */}
                <div className="absolute -inset-1 rounded-3xl bg-[#D4AF37]/20 blur-xl opacity-0 transition duration-500 group-hover:opacity-100 pointer-events-none" />

                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-black/80 border border-[#D4AF37]/40 px-2.5 py-1 text-sm font-black text-[#F6D365]">
                      {card.rating} OVR
                    </span>
                    <span className="rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2.5 py-1 text-xs font-bold text-[#F6D365] uppercase">
                      {card.type}
                    </span>
                  </div>

                  {/* Card Image */}
                  <Link href={`/cards/${card.slug}`} className="block relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={card.image}
                      alt={`${card.name} - ${card.arabicName} كارت فيفا تونسية`}
                      fill
                      className="object-contain transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 380px"
                    />
                  </Link>

                  {/* Titles */}
                  <div className="text-right">
                    <h2 className="text-2xl font-black text-white group-hover:text-[#F6D365] transition">
                      {card.arabicName}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                      {card.name} • {card.nickname}
                    </p>
                    <p className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                      {card.tagline}
                    </p>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">السعر مع العلبة</span>
                    <span className="text-xl font-black text-[#F6D365]">{card.price} DT</span>
                  </div>

                  <Link
                    href={`/cards/${card.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-black px-4 py-2.5 text-xs font-bold text-white transition duration-300"
                  >
                    <span>تفاصيل الكارت</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA to Generator */}
          <div className="mt-20 text-center rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-r from-black via-[#D4AF37]/15 to-black p-8 sm:p-12">
            <h3 className="text-2xl sm:text-4xl font-black text-white mb-3">
              تحب تصنع كارت خاصة بيك بصورتك واسمك؟
            </h3>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8">
              استعمل مولد الكروت المجاني: ارفع صورتك، اختر ستاتيكس تونسية مضحكة، وشوف كارتك تلمع مباشرة!
            </p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] px-8 py-4 text-base font-black text-black shadow-xl hover:scale-105 transition"
            >
              <Wand2 className="h-5 w-5" />
              <span>صمّم كارتك الخاصة الآن</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
