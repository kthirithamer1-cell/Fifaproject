"use client";

import { useState } from "react";
import { SectionTitle } from "./SectionTitle";
import { Sparkles, Flame } from "lucide-react";

const CHIP_COLORS = [
  "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20 shadow-amber-500/10",
  "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-400 hover:bg-purple-500/20 shadow-purple-500/10",
  "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20 shadow-emerald-500/10",
  "border-rose-500/30 bg-rose-500/10 text-rose-300 hover:border-rose-400 hover:bg-rose-500/20 shadow-rose-500/10",
  "border-sky-500/30 bg-sky-500/10 text-sky-300 hover:border-sky-400 hover:bg-sky-500/20 shadow-sky-500/10",
  "border-orange-500/30 bg-orange-500/10 text-orange-300 hover:border-orange-400 hover:bg-orange-500/20 shadow-orange-500/10",
  "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 shadow-cyan-500/10",
];

const TUNISIAN_STATS = [
  { code: "DHK", label: "Dhahka", meaning: "Humor Master", icon: "😂" },
  { code: "NKT", label: "Nokta", meaning: "Joke Quality", icon: "🎭" },
  { code: "KLM", label: "Klem", meaning: "Talking Skill", icon: "🗣️" },
  { code: "JAW", label: "Jaw", meaning: "Vibe Creator", icon: "😎" },
  { code: "DRM", label: "Drama", meaning: "Drama Queen", icon: "🎬" },
  { code: "HRB", label: "Hroub", meaning: "Escapist", icon: "🏃" },
  { code: "DBR", label: "Debber Rassek", meaning: "Problem Solver", icon: "🛠️" },
  { code: "ZHR", label: "Zhar", meaning: "Luck Factor", icon: "🍀" },
  { code: "WST", label: "Wasta", meaning: "Connections", icon: "🤝" },
  { code: "TKK", label: "Tektek", meaning: "Quick Hustle", icon: "💰" },
  { code: "CRZ", label: "Corza", meaning: "Money Master", icon: "💳" },
  { code: "MRG", label: "Mriguel", meaning: "Cool Style", icon: "😎" },
  { code: "GZR", label: "Gzara", meaning: "Boldness", icon: "🔥" },
  { code: "RKD", label: "Rekd", meaning: "Sleeping Power", icon: "😴" },
  { code: "9HW", label: "9ahwa", meaning: "Coffee Addict", icon: "☕" },
  { code: "S7B", label: "S7ab", meaning: "Loyal Friend", icon: "🤜🤛" },
  { code: "MAM", label: "Weld Omo", meaning: "Mama's Boy", icon: "👑" },
  { code: "STP", label: "Stopet", meaning: "Louage Finder", icon: "🚐" },
  { code: "RCH", label: "Richness", meaning: "Flex Master", icon: "💸" },
  { code: "QRM", label: "Ghasret Kleb", meaning: "Last-min Study", icon: "📚" },
  { code: "GLB", label: "Ghalba", meaning: "Survivor", icon: "💪" },
  { code: "KHB", label: "Khabtha", meaning: "Troublemaker", icon: "💥" },
];

export function StatsChips() {
  const row1 = TUNISIAN_STATS.slice(0, 11);
  const row2 = TUNISIAN_STATS.slice(11);

  return (
    <section className="relative bg-[#080808] py-16 sm:py-20 overflow-hidden text-white border-y border-white/5">
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      {/* Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#D4AF37]/[0.05] blur-[150px]" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#F6D365]/[0.04] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F6D365] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>TUNISIAN STATS ENGINE</span>
            </div>
            <SectionTitle className="text-white text-2xl sm:text-3xl font-black">
              TUNISIAN CARD STATS
            </SectionTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Flame className="h-4 w-4 text-[#F6D365] animate-pulse" />
            <span>Interactive Tunisian Meme Attributes</span>
          </div>
        </div>

        {/* Row 1: Moving Left */}
        <div className="relative w-full overflow-hidden py-3 select-none">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-left flex gap-3.5">
            {[...row1, ...row1, ...row1].map((stat, index) => (
              <div
                key={`${stat.code}-${index}`}
                className={`group flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] backdrop-blur-md cursor-default flex-shrink-0 ${
                  CHIP_COLORS[index % CHIP_COLORS.length]
                }`}
              >
                <span className="text-xl transition-transform duration-300 group-hover:scale-125">{stat.icon}</span>
                <div className="flex flex-col items-start leading-tight">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black tracking-wide text-white text-[13px]">{stat.code}</span>
                    <span className="text-[10px] font-medium text-gray-300 capitalize">{stat.label.toLowerCase()}</span>
                  </div>
                  <span className="text-[8px] font-bold opacity-75 uppercase tracking-widest mt-0.5">
                    {stat.meaning}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Moving Right */}
        <div className="relative w-full overflow-hidden py-3 mt-4 select-none">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-right flex gap-3.5">
            {[...row2, ...row2, ...row2].map((stat, index) => (
              <div
                key={`${stat.code}-${index}`}
                className={`group flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] backdrop-blur-md cursor-default flex-shrink-0 ${
                  CHIP_COLORS[(index + 3) % CHIP_COLORS.length]
                }`}
              >
                <span className="text-xl transition-transform duration-300 group-hover:scale-125">{stat.icon}</span>
                <div className="flex flex-col items-start leading-tight">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black tracking-wide text-white text-[13px]">{stat.code}</span>
                    <span className="text-[10px] font-medium text-gray-300 capitalize">{stat.label.toLowerCase()}</span>
                  </div>
                  <span className="text-[8px] font-bold opacity-75 uppercase tracking-widest mt-0.5">
                    {stat.meaning}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}