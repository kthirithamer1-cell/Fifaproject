"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, Sparkles, TrendingUp, Users, Crown, ShieldAlert } from "lucide-react";

interface Leader {
  rank: number;
  name: string;
  code: string;
  orders: number;
  earned: number;
  city?: string;
  badge: string;
}

export function AffiliateLeaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"month" | "all">("month");

  useEffect(() => {
    fetch("/api/affiliate/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.leaders) {
          setLeaders(data.leaders);
        }
      })
      .catch((err) => console.warn("Failed to load leaderboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const top3 = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#0c0c0c]/80 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_50px_rgba(212,175,55,0.07)] overflow-hidden" dir="rtl">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#F6D365]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div className="flex items-center gap-3 text-right">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F6D365] flex items-center justify-center text-black shadow-lg shadow-[#D4AF37]/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ترتيب الشركاء في تونس 🇹🇳
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F6D365] text-xs font-bold animate-pulse">
                Live
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">
              شوف منافسيك شكون في الصدارة وقدّاش ربحوا هالشهر! (10 د.ت على كل كارطة)
            </p>
          </div>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold">
          <button
            onClick={() => setTimeframe("month")}
            className={`px-4 py-2 rounded-xl transition-all ${
              timeframe === "month"
                ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            ترتيب الشهر 🏆
          </button>
          <button
            onClick={() => setTimeframe("all")}
            className={`px-4 py-2 rounded-xl transition-all ${
              timeframe === "all"
                ? "bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            الترتيب العام 👑
          </button>
        </div>
      </div>

      {/* Podium for Top 3 */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 pb-8 items-end">
          {/* Rank 2 (Silver) */}
          {top3[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="order-2 md:order-1 relative rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-transparent p-6 text-center shadow-lg hover:border-[#F6D365]/30 transition-all group"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-neutral-300 text-black flex items-center justify-center font-black text-lg border-2 border-neutral-700 shadow-md">
                2
              </div>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-[11px] font-bold mb-2">
                  🥈 المرتبة الثانية
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-[#F6D365] transition-colors truncate">
                  {top3[1].name}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">
                  @{top3[1].code}
                </span>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-around">
                  <div>
                    <div className="text-xs text-neutral-400">كروت مبيوعة</div>
                    <div className="text-lg font-black text-white">{top3[1].orders}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400">المرابيح</div>
                    <div className="text-lg font-black text-[#F6D365]">{top3[1].earned} د.ت</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rank 1 (Gold - Elevated) */}
          {top3[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 relative rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-b from-[#D4AF37]/20 via-[#060606] to-[#060606] p-7 text-center shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:scale-[1.02] transition-all group"
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <Crown className="w-8 h-8 text-[#F6D365] mx-auto -mb-1 animate-bounce" />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F6D365] text-black flex items-center justify-center font-black text-xl border-2 border-black shadow-xl">
                    1
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#D4AF37]/30 border border-[#D4AF37]/50 text-[#F6D365] text-xs font-black mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  بطل تونس للشهر 👑
                </span>
                <h3 className="text-lg font-black text-white group-hover:text-[#F6D365] transition-colors truncate">
                  {top3[0].name}
                </h3>
                <span className="text-xs text-[#D4AF37] font-mono font-bold">
                  @{top3[0].code}
                </span>

                <div className="mt-5 pt-4 border-t border-[#D4AF37]/20 grid grid-cols-2 gap-2 bg-black/40 rounded-2xl p-3">
                  <div>
                    <div className="text-xs text-neutral-400">كروت مبيوعة</div>
                    <div className="text-xl font-black text-white">{top3[0].orders}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400">المرابيح المحققة</div>
                    <div className="text-xl font-black text-[#F6D365]">{top3[0].earned} د.ت</div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-[#F6D365] font-semibold flex items-center justify-center gap-1">
                  <span>🎁 جائزة إضافية: كارطة PVC Giant 60x40 مجاناً</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="order-3 relative rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-transparent p-6 text-center shadow-lg hover:border-[#F6D365]/30 transition-all group"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#CD7F32] text-white flex items-center justify-center font-black text-lg border-2 border-neutral-800 shadow-md">
                3
              </div>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-[11px] font-bold mb-2">
                  🥉 المرتبة الثالثة
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-[#F6D365] transition-colors truncate">
                  {top3[2].name}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">
                  @{top3[2].code}
                </span>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-around">
                  <div>
                    <div className="text-xs text-neutral-400">كروت مبيوعة</div>
                    <div className="text-lg font-black text-white">{top3[2].orders}</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400">المرابيح</div>
                    <div className="text-lg font-black text-[#F6D365]">{top3[2].earned} د.ت</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Rest of the Top 10 Table */}
      {others.length > 0 && (
        <div className="mt-6 border border-white/10 rounded-2xl overflow-hidden bg-black/40">
          <div className="px-6 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-bold text-neutral-400">
            <span>الترتيب & الشريك</span>
            <div className="flex items-center gap-8">
              <span>الكروت</span>
              <span>المرابيح</span>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {others.map((item) => (
              <div
                key={item.rank}
                className="px-6 py-3.5 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-neutral-300">
                    #{item.rank}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">(@{item.code})</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <span>{item.city || "تونس"}</span>
                      <span>•</span>
                      <span className="text-[#F6D365]">{item.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <span className="text-xs font-semibold text-neutral-300 w-10 text-center">
                    {item.orders}
                  </span>
                  <span className="text-xs font-black text-[#F6D365] w-16 text-left">
                    {item.earned} د.ت
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Motivation Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 via-[#060606] to-[#D4AF37]/15 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F6D365] shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-white">
              تحب تشوف اسمك في أول الترتيب وتكسب أول 100 دينار؟
            </div>
            <div className="text-[11px] text-neutral-400">
              التسجيل مجاني 100% ويأخذ منك أقل من دقيقة واحدة!
            </div>
          </div>
        </div>

        <a
          href="/affiliate/signup"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-xs hover:scale-105 transition-all shadow-lg shadow-[#D4AF37]/20 shrink-0"
        >
          سجّل توا ونافسهم 🚀
        </a>
      </div>
    </div>
  );
}
