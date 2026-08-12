"use client";

import React, { useState } from "react";
import { Sparkles, Coins, Zap, Gift, CheckCircle } from "lucide-react";

export function ProfitCalculator() {
  const [cardsCount, setCardsCount] = useState(5);
  const commissionPerCard = 10;
  const totalMonthlyEarnings = cardsCount * commissionPerCard;

  const milestones = [
    { count: 1, title: "10 د.ت", perk: "أول 10 دينار ربح من أول طلبية 🎯" },
    { count: 3, title: "30 د.ت", perk: "الحد الأدنى للسحب الفوري في D17 📱" },
    { count: 5, title: "50 د.ت", perk: "50 دينار خلاص انترنت ومصروف جمعة ☕" },
    { count: 8, title: "80 د.ت", perk: "80 دينار دخل إضافي وتفريهدة ويكاند 🏖️" },
    { count: 10, title: "100 د.ت", perk: "100 دينار صابة في حسابك + مرتبة الصدارة 👑" },
    { count: 15, title: "150 د.ت", perk: "150 دينار + كارطة PVC عملاقة هدية 🌟" },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#151515] to-[#080808] p-6 sm:p-10 shadow-[0_0_60px_rgba(212,175,55,0.12)] overflow-hidden" dir="rtl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold mb-3">
          <Coins className="w-3.5 h-3.5" />
          <span>حاسبة الأرباح التقديرية</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          قدّاش تنجم تربح مع <span className="text-[#F6D365]">Flawless TN</span>؟
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-2">
          حرّك المؤشر وشوف مرابيحك الصافية (10 دينار صابة على كل كارطة)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Slider Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-black/50 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-neutral-300">
                عدد الكروت المبيوعة:
              </span>
              <span className="text-2xl font-black text-[#F6D365] px-3 py-1 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                {cardsCount} <span className="text-xs font-normal text-white">كارطة</span>
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={cardsCount}
              onChange={(e) => setCardsCount(Number(e.target.value))}
              className="w-full h-3 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            />

            <div className="flex justify-between text-[11px] text-neutral-500 font-bold mt-2 font-mono">
              <span>1 كارطة</span>
              <span>3</span>
              <span>5</span>
              <span>8</span>
              <span>10 كروت</span>
              <span>15</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2">
            {[1, 3, 5, 8, 10, 15].map((preset) => (
              <button
                key={preset}
                onClick={() => setCardsCount(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  cardsCount === preset
                    ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/30"
                    : "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10"
                }`}
              >
                {preset} {preset === 1 ? "كارطة" : "كروت"}
              </button>
            ))}
          </div>

          {/* Benefits summary list */}
          <div className="space-y-2.5 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>عمولة ثابتة <strong>10 دينار</strong> على كل طلب، تتصب في حسابك أسبوعياً.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>سحب فوري للأموال عبر <strong>D17</strong>، <strong>Flouci</strong>، أو تحويل بنكي <strong>RIB</strong>.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>لوحة تحكم مباشرة تشوف بيها شكون دخل، وشكون صمم كارطة، وشكون شرى.</span>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#D4AF37]/25 via-black to-black border-2 border-[#D4AF37]/60 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <div className="text-xs font-bold text-neutral-300 mb-1">
            مرابيحك الشهرية الصافية
          </div>
          <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF6B0] via-[#F6D365] to-[#D4AF37] my-3">
            {totalMonthlyEarnings.toLocaleString()} <span className="text-xl sm:text-2xl text-white font-bold">د.ت</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#F6D365] font-semibold my-4">
            {milestones.find((m) => cardsCount <= m.count)?.perk || milestones[milestones.length - 1].perk}
          </div>

          <a
            href="/affiliate/signup"
            className="w-full block py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-sm hover:scale-105 transition-all shadow-xl shadow-[#D4AF37]/25"
          >
            سجّل وابدا اربح توا 🚀
          </a>

          <div className="mt-3 text-[11px] text-neutral-400">
            بدون أي التزام، التسجيل 100% مجاني
          </div>
        </div>
      </div>
    </div>
  );
}
