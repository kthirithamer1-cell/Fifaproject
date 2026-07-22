"use client";

import { useState } from "react";
import { allTunisianStats } from "./data";
import { SectionTitle } from "./SectionTitle";
import { Search } from "lucide-react";

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
    <section className="bg-[#0A0A0A] py-16 sm:py-20" id="glossary">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle className="mb-10 sm:mb-14">
          STATS GLOSSARY
        </SectionTitle>

        <p className="text-sm text-neutral-400 max-w-xl mb-8 leading-relaxed">
          Browse all 70 funny Tunisian stats used on our custom cards. Search by code, name, or meaning to discover the perfect stats for your friend.
        </p>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by code, name or meaning..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#0D0D0D] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-yellow-400/30 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.label
                    ? "bg-yellow-400/15 text-yellow-400 border border-yellow-400/25"
                    : "bg-white/[0.03] text-neutral-400 border border-white/[0.06] hover:border-white/[0.12] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-xs text-neutral-500 font-medium">
          {filtered.length} stat{filtered.length !== 1 ? "s" : ""} found
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((stat, i) => (
            <div
              key={`${stat.code}-${i}`}
              className="group rounded-xl border border-white/[0.06] bg-[#0D0D0D] p-4 transition-all duration-200 hover:border-yellow-400/20 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="text-[10px] font-black text-yellow-400/70 bg-yellow-400/[0.08] px-2 py-0.5 rounded-md tracking-wider">
                  {stat.code}
                </span>
              </div>
              <div className="text-sm font-bold text-white leading-tight mb-1 truncate" title={stat.label}>
                {stat.label}
              </div>
              <div className="text-[11px] text-neutral-400 leading-snug">
                {stat.meaning}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-neutral-500 text-sm">
            No stats found matching &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </section>
  );
}
