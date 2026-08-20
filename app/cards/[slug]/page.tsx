import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Sparkles,
  Star,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Gift,
  ArrowRight,
  ChevronRight,
  Share2,
  Wand2,
  Flame,
  Award,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/app/_components/Header";
import { Footer } from "@/app/_components/Footer";
import MetaViewContent from "@/app/_components/MetaViewContent";
import { CARD_PRODUCTS, getCardBySlug, getAllCardSlugs } from "../data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCardSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);

  if (!card) {
    return {
      title: "الكارت غير موجودة — Flawless",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beflawless.art";
  const canonicalUrl = `${baseUrl}/cards/${card.slug}`;
  const ogImageUrl = `${baseUrl}${card.image}`;

  return {
    title: card.seoTitle,
    description: card.seoDescription,
    keywords: card.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: card.seoTitle,
      description: card.seoDescription,
      url: canonicalUrl,
      type: "website",
      locale: "ar_TN",
      siteName: "Flawless Tunisia",
      images: [
        {
          url: ogImageUrl,
          width: 700,
          height: 1050,
          alt: `${card.name} - ${card.arabicName} Flawless Custom FIFA Card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: card.seoTitle,
      description: card.seoDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function CardProductPage({ params }: Props) {
  const { slug } = await params;
  const card = getCardBySlug(slug);

  if (!card) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beflawless.art";
  const otherCards = CARD_PRODUCTS.filter((c) => c.slug !== card.slug);

  // Structured Data (Schema.org) for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: `${card.arabicName} — ${card.name} FIFA Custom Card (${card.rating} Rated)`,
        description: card.description,
        image: `${baseUrl}${card.image}`,
        brand: {
          "@type": "Brand",
          name: "Flawless Tunisia",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "TND",
          price: card.price,
          availability: "https://schema.org/InStock",
          url: `${baseUrl}/cards/${card.slug}`,
          seller: {
            "@type": "Organization",
            name: "Flawless Tunisia",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "348",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "الرئيسية",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "الكروت التونسية",
            item: `${baseUrl}/cards`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: card.arabicName,
            item: `${baseUrl}/cards/${card.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: card.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  const statEntries = Object.entries(card.stats);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <MetaViewContent
        contentName={`${card.arabicName} — ${card.name} FIFA Card`}
        contentIds={[card.slug]}
        value={card.price}
      />

      <main className="min-h-screen bg-[#070707] text-white pt-24 pb-20 overflow-hidden relative">
        {/* Background Ambience */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/[0.02] to-transparent pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation for SEO */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-8 overflow-x-auto py-1"
          >
            <Link href="/" className="hover:text-[#F6D365] transition whitespace-nowrap">
              الرئيسية
            </Link>
            <ChevronRight className="h-3.5 w-3.5 rotate-180 text-gray-600 flex-shrink-0" />
            <Link href="/cards" className="hover:text-[#F6D365] transition whitespace-nowrap">
              الكروت التونسية
            </Link>
            <ChevronRight className="h-3.5 w-3.5 rotate-180 text-gray-600 flex-shrink-0" />
            <span className="text-[#F6D365] font-bold whitespace-nowrap">{card.arabicName}</span>
          </nav>

          {/* Product Showcase Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Interactive Visual Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[360px] sm:max-w-[400px] group">
                {/* Gold Glow Behind Card */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#D4AF37]/30 to-[#F6D365]/20 blur-2xl opacity-75 group-hover:opacity-100 transition duration-700" />

                {/* Card Container */}
                <div className="relative rounded-3xl border border-[#D4AF37]/40 bg-black/90 p-4 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#D4AF37]">
                  {/* Rating Badge */}
                  <div className="absolute top-6 left-6 z-20 flex flex-col items-center bg-black/85 backdrop-blur-md border border-[#D4AF37]/60 rounded-xl px-2.5 py-1 shadow-lg">
                    <span className="text-2xl font-black text-[#F6D365] leading-none">
                      {card.rating}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                      {card.position}
                    </span>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-6 right-6 z-20 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 backdrop-blur-md px-3 py-1">
                    <span className="text-xs font-black text-[#F6D365] tracking-wider uppercase">
                      {card.type}
                    </span>
                  </div>

                  {/* Main Card Image */}
                  <div className="relative w-full aspect-[3/4.4] rounded-2xl overflow-hidden mt-1">
                    <Image
                      src={card.image}
                      alt={`${card.name} - ${card.arabicName} كارت فيفا تونسية مخصصة`}
                      fill
                      priority
                      className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                      sizes="(max-width: 768px) 100vw, 450px"
                    />
                  </div>

                  {/* Trust Footer Bar Under Image */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                    <span className="inline-flex items-center gap-1.5 font-bold text-[#F6D365]">
                      <Sparkles className="h-4 w-4" /> خامة PVC صلبة فاخرة
                    </span>
                    <span className="inline-flex items-center gap-1 text-gray-400">
                      <Truck className="h-4 w-4 text-green-400" /> توصيل لـ 24 ولاية
                    </span>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="mt-6 w-full max-w-[400px] grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                  <div className="text-[#F6D365] font-black text-sm mb-0.5">100% PVC</div>
                  <div className="text-gray-400 text-[11px]">مقاومة للماء والخدش</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                  <div className="text-[#F6D365] font-black text-sm mb-0.5">2-4 أيام</div>
                  <div className="text-gray-400 text-[11px]">توصيل سريع لباب دارك</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                  <div className="text-[#F6D365] font-black text-sm mb-0.5">الدفع بعدين</div>
                  <div className="text-gray-400 text-[11px]">عند استلام الكارت</div>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Stats, Description & Actions */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-right">
              {/* Category & Rating Pill */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F6D365] text-xs font-bold uppercase tracking-wider">
                  <Flame className="h-4 w-4 fill-[#F6D365]" />
                  <span>{card.nickname}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs text-gray-300">
                  <div className="flex items-center text-[#F6D365]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#F6D365]" />
                    ))}
                  </div>
                  <span className="font-bold text-white">4.9</span>
                  <span className="text-gray-400">(348 تقييم تونسي حقيقي)</span>
                </div>
              </div>

              {/* Product Titles */}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                  كارت <span className="text-gold-grad">{card.arabicName}</span> {card.rating}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-gray-400 mt-1 uppercase tracking-wider">
                  Carte FIFA Personnalisée — {card.name} (Tunisian Comedy Legend)
                </p>
              </div>

              {/* Price & Offer Box */}
              <div className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-black/80 via-[#D4AF37]/10 to-black/80 p-5 backdrop-blur-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400 font-semibold mb-0.5">
                    السعر يشمل الطباعة الفاخرة + القاعدة الخشبية + علبة الهدايا
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      {card.price} <span className="text-xl text-[#F6D365]">DT</span>
                    </span>
                    <span className="text-base text-gray-500 line-through font-bold">69 DT</span>
                    <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold">
                      خصم -30% لفترة محدودة
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-[#F6D365] uppercase">Livraison</div>
                  <div className="text-xs text-gray-300">Toute la Tunisie 🇹🇳</div>
                </div>
              </div>

              {/* Tagline / Brief */}
              <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-medium">
                {card.tagline}
              </p>

              {/* Cultural Stats Breakdown (Interactive Display) */}
              <div className="rounded-2xl border border-white/10 bg-black/60 p-5 sm:p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <span className="text-xs text-gray-400">ستاتيكس تونسية مضحكة مخصصة 100%</span>
                  <h2 className="text-base sm:text-lg font-black text-white inline-flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#F6D365]" />
                    تحليل ستاتيكس الكارت
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {statEntries.map(([code, value]) => {
                    const labelInfo = card.statLabels[code] || {
                      label: code,
                      meaning: "خاصية تونسية مميزة",
                      icon: "⚽",
                    };
                    return (
                      <div
                        key={code}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-[#D4AF37]/50 hover:bg-white/[0.06]"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-lg font-black text-[#F6D365] font-mono">
                            {value}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{labelInfo.label}</span>
                            <span className="text-base">{labelInfo.icon}</span>
                            <span className="text-xs font-mono font-bold text-gray-400 bg-white/10 px-1.5 py-0.5 rounded">
                              {code}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 text-right leading-normal">
                          {labelInfo.meaning}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <Link
                  href={`/generator?template=${card.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F6D365] to-[#D4AF37] px-6 py-4 text-base font-black text-black shadow-[0_8px_25px_rgba(212,175,55,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(212,175,55,0.5)] active:scale-95"
                >
                  <Wand2 className="h-5 w-5" />
                  <span>صمّم كارت كيفها بصورتك واسمك</span>
                </Link>

                <a
                  href={`https://wa.me/21650000000?text=${encodeURIComponent(
                    `مرحبا Flawless! نحب نطلب كارت ${card.arabicName} (${card.name} 98) المطبوعة في علبة الهدايا بسعر ${card.price} DT.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37] px-6 py-4 text-sm font-bold text-white transition active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4 text-[#F6D365]" />
                  <span>طلب كارت {card.arabicName} عبر واتساب</span>
                </a>
              </div>
            </div>
          </div>

          {/* Deep Story & Biography Section (Heavy SEO Content) */}
          <section className="mt-20 rounded-3xl border border-white/10 bg-black/70 p-6 sm:p-10 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-4">
                <span>LEGENDARY STORY & BIOGRAPHY</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-6 leading-snug">
                قصة الكارت وأسطورة <span className="text-gold-grad">{card.arabicName}</span> في الكوميديا التونسية
              </h2>

              <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                {card.biography.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {card.famousSketches && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-black text-[#F6D365] mb-4">
                    أشهر أعمال وسكيتشات ومسرحيات ارتبطت بهذه الكارت:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {card.famousSketches.map((sketch, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-end gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm text-gray-200"
                      >
                        <span>{sketch}</span>
                        <CheckCircle2 className="h-4 w-4 text-[#F6D365] flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* PVC Physical Specifications Section */}
          <section className="mt-12 rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-b from-white/[0.03] to-transparent p-6 sm:p-10 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto text-right">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <span className="text-xs text-[#F6D365] font-mono uppercase tracking-widest">
                  FLAWLESS PREMIUM PVC SPECS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white inline-flex items-center gap-2">
                  <Gift className="h-6 w-6 text-[#F6D365]" />
                  مواصفات الطباعة وجودة الباكاجينغ
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {card.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-end gap-3 p-4 rounded-xl bg-black/60 border border-white/10 text-sm text-gray-200"
                  >
                    <span className="leading-relaxed">{feat}</span>
                    <CheckCircle2 className="h-5 w-5 text-[#F6D365] flex-shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Accordion Section */}
          <section className="mt-12 rounded-3xl border border-white/10 bg-black/60 p-6 sm:p-10 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto text-right">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>FAQ & QUESTIONS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">الأسئلة الشائعة حول الكارت</h2>
              </div>

              <div className="space-y-3">
                {card.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-right"
                  >
                    <h3 className="text-base font-bold text-[#F6D365] mb-2">{item.question}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Related Cards / More Legends Carousel */}
          {otherCards.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <Link
                  href="/cards"
                  className="text-xs sm:text-sm font-bold text-[#F6D365] hover:underline"
                >
                  عرض جميع الكروت ←
                </Link>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  أساطير كروت تونسية أخرى قد تعجبك
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {otherCards.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/cards/${other.slug}`}
                    className="group rounded-2xl border border-white/10 bg-black/80 p-3.5 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/60 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] text-right"
                  >
                    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3">
                      <Image
                        src={other.image}
                        alt={`${other.name} - ${other.arabicName}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 50vw, 250px"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#F6D365] font-mono font-black">{other.rating} OVR</span>
                      <span className="font-bold text-white">{other.arabicName}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate">{other.nickname}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Bottom Sticky-like Mobile Banner */}
          <div className="mt-16 text-center">
            <div className="rounded-3xl border border-[#D4AF37]/50 bg-gradient-to-r from-[#D4AF37]/20 via-black to-[#D4AF37]/20 p-8">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                تحب كارت فيفا مخصصة باسمك وصورتك؟
              </h3>
              <p className="text-gray-300 text-sm max-w-xl mx-auto mb-6">
                صمّم كارتك في دقيقتين مع ستاتيكس تونسية مضحكة وخلفيات الأندية التونسية والعالمية، واطلب نسختك الـ PVC الفاخرة.
              </p>
              <Link
                href="/generator"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] px-8 py-3.5 text-base font-black text-black shadow-lg transition hover:scale-105"
              >
                <Wand2 className="h-5 w-5" />
                <span>ابدأ تصميم كارتك الآن مجاناً</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
