import React from "react";
import Link from "next/link";
import { Header } from "../_components/Header";
import { Footer } from "../_components/Footer";
import { AffiliateLeaderboard } from "./_components/AffiliateLeaderboard";
import { ProfitCalculator } from "./_components/ProfitCalculator";
import {
  Sparkles,
  Trophy,
  Coins,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Share2,
  Smartphone,
  CreditCard,
  Flame,
  CheckCircle2,
  HelpCircle,
  Users,
} from "lucide-react";

export const metadata = {
  title: "برنامج الشركاء والمؤثرين 🇹🇳 — اربح 10 دينار على كل كارطة | Flawless TN",
  description: "انضم لأقوى برنامج أفلييت في تونس. اربح 10 دينار تونسي على كل كارطة فيفا تتباع برابطك مع سحب فوري عبر D17 و Flouci وترتيب حي للمنافسة بين الشركاء.",
};

export default function AffiliateLandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#D4AF37] selection:text-black">
      <Header />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/10" dir="rtl">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/15 to-[#F6D365]/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F6D365] text-xs sm:text-sm font-bold mb-6 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Sparkles className="w-4 h-4 text-[#F6D365] animate-spin" style={{ animationDuration: "6s" }} />
              <span>برنامج شركاء ومؤثري Flawless TN 🇹🇳</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
              اربح <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF6B0] via-[#F6D365] to-[#D4AF37]">10 دينار تونسي</span> صابة على كل كارطة تتباع برابطك!
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-sm sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed font-medium">
              عندك تيك توك، إنستغرام، فيسبوك، ولا حتى أصحابك في القهوة؟ انشر كودك الخاص واربح 10 دينار على كل طلب يتعدى مع خلاص فوري أسبوعي عبر <strong>D17</strong> أو <strong>Flouci</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/affiliate/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-sm sm:text-base hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2"
              >
                <span>سجّل حسابك في دقيقة وابدا اربح</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </Link>

              <Link
                href="/affiliate/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/15 text-white font-bold text-sm sm:text-base hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all flex items-center justify-center gap-2"
              >
                <span>دخول حساب الشريك</span>
              </Link>
            </div>

            {/* Trust Metrics Bar */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-right">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-[#F6D365]">10 د.ت</div>
                <div className="text-xs text-neutral-400 mt-1 font-semibold">عمولة ثابتة لكل كارطة</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-white">D17 / Flouci</div>
                <div className="text-xs text-neutral-400 mt-1 font-semibold">خلاص وسحب أسبوعي</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">Live 100%</div>
                <div className="text-xs text-neutral-400 mt-1 font-semibold">لوحة تحكم وإحصائيات فورية</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-[#F6D365]">0 مليم</div>
                <div className="text-xs text-neutral-400 mt-1 font-semibold">تسجيل مجاني وبدون شروط</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LIVE LEADERBOARD / CLASSEMENT SECTION */}
        {/* ========================================================================= */}
        <section id="classement" className="py-20 px-4 sm:px-6 lg:px-8 relative border-b border-white/10 bg-gradient-to-b from-[#080808] to-[#050505]">
          <div className="max-w-5xl mx-auto mb-10 text-center" dir="rtl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold mb-3">
              <Trophy className="w-3.5 h-3.5" />
              <span>المنافسة والترتيب المباشر</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              ترتيب أقوى شركاء ومؤثري تونس 🏆
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-2 max-w-xl mx-auto">
              تنافس مع أكبر صناع المحتوى في تونس واكسب هدايا حصرية وكروت مجانية للمراتب الأولى!
            </p>
          </div>

          <AffiliateLeaderboard />
        </section>

        {/* ========================================================================= */}
        {/* HOW IT WORKS (3 SIMPLE STEPS) */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10" dir="rtl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold mb-3">
                <Zap className="w-3.5 h-3.5" />
                <span>طريقة العمل في 3 خطوات</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                كيفاش تبدأ تربح من أول يوم؟
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 hover:border-[#D4AF37]/40 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#F6D365] text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-lg font-black text-white mb-2">
                  سجّل حسابك وخذ الرابط والكود
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  سجّل في 30 ثانية باسمك ورقمك، واختر كود الإحالة الخاص بيك (مثال: <code>AMINE10</code>) ورابط مباشر لصفحة الكارطة.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 hover:border-[#D4AF37]/40 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#F6D365] text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-lg font-black text-white mb-2">
                  انشر في الستوريات وتيك توك
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  حط الرابط في البايو، اعمل ستوري، وري أصحابك كارتك، وانشر الفكرة في قروبات الفيسبوك والواتساب. نوفرولك تصاميم وفيديوهات جاهزة!
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-8 hover:border-[#D4AF37]/40 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#F6D365] text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-lg font-black text-white mb-2">
                  اقبض 10 د.ت على كل كوموند
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  كل ما شخص يصمم كارطة ويشريها برابطك، تجيك 10 دنانير صابة في حسابك. اطلب سحبها وتوصلك في D17 أو Flouci أسبوعياً.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* PROFIT CALCULATOR SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#070707]">
          <ProfitCalculator />
        </section>

        {/* ========================================================================= */}
        {/* TUNISIAN PAYMENT METHODS SECTION */}
        {/* ========================================================================= */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10" dir="rtl">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37] mb-3">
              طرق السحب المتاحة في كامل تراب الجمهورية 🇹🇳
            </h3>
            <p className="text-sm text-neutral-300 font-medium mb-8">
              فلوسك توصلك وين ما تكون بدون تعقيدات وبكل أمان
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col items-center">
                <Smartphone className="w-8 h-8 text-[#F6D365] mb-2" />
                <span className="text-sm font-black text-white">تطبيق D17</span>
                <span className="text-[11px] text-neutral-400 mt-1">البريد التونسي</span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col items-center">
                <Zap className="w-8 h-8 text-[#00E5FF] mb-2" />
                <span className="text-sm font-black text-white">تطبيق Flouci</span>
                <span className="text-[11px] text-neutral-400 mt-1">سحب فوري</span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col items-center">
                <CreditCard className="w-8 h-8 text-emerald-400 mb-2" />
                <span className="text-sm font-black text-white">تحويل بنكي RIB</span>
                <span className="text-[11px] text-neutral-400 mt-1">جميع البنوك التونسية</span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col items-center">
                <ShieldCheck className="w-8 h-8 text-[#D4AF37] mb-2" />
                <span className="text-sm font-black text-white">حوالة سريعة</span>
                <span className="text-[11px] text-neutral-400 mt-1">Mandat Minute</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FAQ SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10" dir="rtl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>الأسئلة الشائعة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                كل ما تحب تعرفه على برنامج الأفلييت
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-sm sm:text-base font-black text-[#F6D365] mb-2">
                  وقتاش وكيفاش نجبد فلوسي؟
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  تنجم تطلب سحب مرابيحك بمجرد ما يوصل رصيدك لـ 30 دينار (3 كروت فقط). نبعثولك فلوسك مباشرة عبر D17 أو Flouci أو حسابك البنكي خلال 24 إلى 48 ساعة.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-sm sm:text-base font-black text-[#F6D365] mb-2">
                  كيفاش نعرف شكون شرى برابطي؟
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  عندك لوحة تحكم حية (Dashboard) تشوف فيها بالتفصيل: قداش من واحد نقر على رابطك، قداش صمموا كروت بالذكاء الاصطناعي، والطلبيات المؤكدة مع حالة التوصيل والمرابيح الصافية.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-sm sm:text-base font-black text-[#F6D365] mb-2">
                  هل يلزمني نكون صانع محتوى كبير وعندي برشا متابعين؟
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  لا، أبداً! تنجم تبدأ حتى مع أصحابك في ليسي، الفاك، التيران، أو تنشر في مجموعات الفيسبوك وتيك توك. الكارطة فكرتها مضحكة والتوانسة يحبوها هدية، يعني ساهلة في البيع.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-sm sm:text-base font-black text-[#F6D365] mb-2">
                  شنيّة ميزة الترتيب (Classement)؟
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  أفضل 3 شركاء كل شهر يتحصلوا على هدايا إضافية وكروت مخصصة PVC Giant عملاقة مجاناً، بالإضافة لزيادة نسبة العمولة للشريك المميز.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FINAL CALL TO ACTION BANNER */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center" dir="rtl">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#D4AF37]/20 via-[#151515] to-[#D4AF37]/20 border-2 border-[#D4AF37]/40 p-8 sm:p-14 shadow-[0_0_60px_rgba(212,175,55,0.2)]">
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
              جاهز تبدأ تحقق أول <span className="text-[#F6D365]">100 دينار</span> مع Flawless؟
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto mb-8 font-medium">
              التسجيل مجاني، لا يوجد أي التزام، وأرباحك مضمونة ومسجلة في حسابك لحظة بلحظة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/affiliate/signup"
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-base hover:scale-105 transition-all shadow-xl shadow-[#D4AF37]/30"
              >
                سجّل حسابك الآن مجاناً 🚀
              </Link>
              <Link
                href="/affiliate/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/20 text-white font-bold text-base hover:bg-white/10 transition-all"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
