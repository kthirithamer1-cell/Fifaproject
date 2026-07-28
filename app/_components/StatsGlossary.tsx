"use client";

import { useState } from "react";
import { allTunisianStats } from "./data";
import { SectionTitle } from "./SectionTitle";
import { Search, Zap, Trophy } from "lucide-react";

const CATEGORIES = [
  { label: "All", filter: () => true },
  { label: "Humor", filter: (s: typeof allTunisianStats[0]) => ["DHK", "NKT", "HDR", "DRM", "HCH", "FDH", "L3B"].includes(s.code) },
  { label: "Hustle", filter: (s: typeof allTunisianStats[0]) => ["KHD", "DBR", "7IL", "TKK", "CRZ", "SMS", "BRG", "WST"].includes(s.code) },
  { label: "Personality", filter: (s: typeof allTunisianStats[0]) => ["GZR", "TMS", "3SB", "BRD", "NFS", "CHJ", "MRG", "LBG", "SBR"].includes(s.code) },
  { label: "Habits", filter: (s: typeof allTunisianStats[0]) => ["RKD", "9HW", "CHY", "BRM", "S7R", "BKR", "DWR", "SRF"].includes(s.code) },
  { label: "Social", filter: (s: typeof allTunisianStats[0]) => ["KLM", "S7B", "HOB", "CHK", "3YN", "FRJ", "NSS", "MAM", "JAW"].includes(s.code) },
];

export function StatsGlossary() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const activeCat = CATEGORIES.find((c) => c.label === activeCategory) || CATEGORIES[0];

  const filtered = allTunisianStats.filter((stat) => {
    const matchesQuery =
      !query ||
      stat.code.toLowerCase().includes(query.toLowerCase()) ||
      stat.label.toLowerCase().includes(query.toLowerCase()) ||
      stat.meaning.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCat.filter(stat);
    return matchesQuery && matchesCategory;
  });

  return (
    <section className="relative bg-[#0A0A0A] py-20 sm:py-24 text-white overflow-hidden" id="glossary">
      {/* Glowing Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/4 bottom-10 w-[450px] h-[450px] rounded-full bg-[#D4AF37]/[0.04] blur-[150px]" />
        <div className="absolute right-1/4 top-10 w-[450px] h-[450px] rounded-full bg-[#F6D365]/[0.04] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#F6D365] text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
              <Trophy className="h-3.5 w-3.5 text-[#F6D365]" />
              <span>TUNISIAN MEME DICTIONARY</span>
            </div>
            <SectionTitle className="text-white text-3xl sm:text-4xl font-black">
              STATS GLOSSARY
            </SectionTitle>
            <p className="mt-3 text-sm text-neutral-400 max-w-xl leading-relaxed font-medium">
              Browse all 70 funny Tunisian stats used on our custom cards. Search by code, name, or meaning to discover the perfect stats for your friend.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#F6D365] bg-black/60 border border-[#D4AF37]/30 px-4 py-2 rounded-full backdrop-blur-md self-start md:self-end shadow-md">
            <Zap className="h-4 w-4 text-[#F6D365] animate-bounce" />
            <span>70+ Unique Tunisian Attributes</span>
          </div>
        </div>

        {/* Search + Category Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]" />
            <input
              type="text"
              placeholder="Search stat by code (e.g. DHK), name, or meaning..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-neutral-900/90 pl-11 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.label
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black shadow-lg shadow-[#D4AF37]/20 scale-105"
                    : "bg-neutral-900/80 text-neutral-300 border border-white/10 hover:border-[#D4AF37]/40 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-neutral-400 font-medium px-1">
          <span>Showing <strong className="text-[#F6D365] font-bold">{filtered.length}</strong> stat attributes</span>
          {query && (
            <button onClick={() => setQuery("")} className="text-[#D4AF37] hover:underline cursor-pointer">
              Clear search
            </button>
          )}
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filtered.map((stat, i) => (
            <div
              key={`${stat.code}-${i}`}
              className="group relative rounded-2xl border border-white/10 bg-neutral-900/60 p-4 backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/60 hover:bg-neutral-900/90 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-125">{stat.icon}</span>
                  <span className="text-[10px] font-black text-[#F6D365] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2.5 py-0.5 rounded-lg tracking-wider group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-300">
                    {stat.code}
                  </span>
                </div>
                <div className="text-sm font-extrabold text-white leading-tight mb-1 truncate group-hover:text-[#F6D365] transition-colors" title={stat.label}>
                  {stat.label}
                </div>
                <div className="text-[11px] text-neutral-400 leading-snug font-medium">
                  {stat.meaning}
                </div>
              </div>

              {/* Dynamic Animated Meter Line */}
              <div className="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#D4AF37] to-[#F6D365] h-full rounded-full transition-all duration-500 group-hover:w-full"
                  style={{ width: `${80 + (i % 20)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-neutral-900/40 rounded-3xl border border-white/10 text-neutral-400 text-sm">
            No Tunisian stats found matching &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </section>
  );
}
