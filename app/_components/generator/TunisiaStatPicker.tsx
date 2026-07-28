"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check } from "lucide-react";
import { TUNISIA_STATS, searchStats, type TunisiaStat } from "../../generator/lib/tunisiaStats";

interface TunisiaStatPickerProps {
    selected: string[]; // array of stat codes
    onSelectionChange: (codes: string[]) => void;
    maxSelection?: number;
}

export default function TunisiaStatPicker({
    selected,
    onSelectionChange,
    maxSelection = 6,
}: TunisiaStatPickerProps) {
    const [query, setQuery] = useState("");

    const filteredStats = useMemo(() => searchStats(query), [query]);

    const toggleStat = (code: string) => {
        if (selected.includes(code)) {
            onSelectionChange(selected.filter((c) => c !== code));
        } else if (selected.length < maxSelection) {
            onSelectionChange([...selected, code]);
        }
    };

    const isSelected = (code: string) => selected.includes(code);
    const isFull = selected.length >= maxSelection;

    return (
        <div className="space-y-6">
            {/* Header with counter */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`text-sm font-bold font-space px-3 py-1.5 rounded-full border transition-all duration-300 ${
                            isFull
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-[#D4AF37]/5 border-[#D4AF37]/20 text-[#C89B3C]"
                        }`}
                    >
                        {selected.length} / {maxSelection} selected
                    </div>
                    {isFull && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-emerald-600 text-xs font-space font-semibold flex items-center gap-1"
                        >
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Ready!
                        </motion.span>
                    )}
                </div>
                {selected.length > 0 && (
                    <button
                        onClick={() => onSelectionChange([])}
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-space flex items-center gap-1 cursor-pointer"
                    >
                        <X className="w-3 h-3" /> Clear all
                    </button>
                )}
            </div>

            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث عن ستات... (Search DHK, 9HW, KLM...)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/15 bg-black/70 text-sm text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-400"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Selected chips (quick view) */}
            <AnimatePresence>
                {selected.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {selected.map((code) => {
                            const stat = TUNISIA_STATS.find((s) => s.code === code);
                            if (!stat) return null;
                            return (
                                <motion.button
                                    key={code}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => toggleStat(code)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#C89B3C] text-xs font-space font-semibold hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all duration-200 cursor-pointer group"
                                >
                                    <span>{stat.emoji}</span>
                                    <span>{stat.code}</span>
                                    <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredStats.map((stat) => {
                    const active = isSelected(stat.code);
                    const disabled = isFull && !active;

                    return (
                        <motion.button
                            key={stat.code}
                            whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
                            whileTap={!disabled ? { scale: 0.98 } : {}}
                            onClick={() => !disabled && toggleStat(stat.code)}
                            className={`relative p-4 rounded-2xl border transition-all duration-300 text-right cursor-pointer ${
                                active
                                    ? "border-[#D4AF37] bg-black/90 shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
                                    : disabled
                                    ? "border-white/5 bg-white/5 opacity-30 cursor-not-allowed"
                                    : "border-white/10 bg-black/70 hover:border-[#D4AF37]/50 hover:bg-black/90 shadow-md"
                            }`}
                        >
                            {/* Emoji + Code */}
                            <div className="flex items-center gap-2 mb-1.5 justify-end">
                                <span className={`font-space font-bold text-xs tracking-wider ${
                                    active ? "text-[#F6D365]" : "text-white"
                                }`}>
                                    {stat.code}
                                </span>
                                <span className="text-lg">{stat.emoji}</span>
                            </div>

                            {/* Stat name */}
                            <div
                                className={`font-space text-xs font-semibold leading-tight ${
                                    active ? "text-[#F6D365]" : "text-gray-300"
                                }`}
                            >
                                {stat.meaning}
                            </div>

                            {/* Tunisian name (small) */}
                            <div className="text-[10px] text-gray-400 font-space mt-1 truncate">
                                {stat.stat}
                            </div>

                            {/* Selected indicator */}
                            {active && (
                                <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-md">
                                    <Check className="w-3 h-3 text-black stroke-[3]" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Empty state */}
            {filteredStats.length === 0 && (
                <div className="text-center py-8 text-gray-400 font-space text-sm">
                    No stats found for &quot;{query}&quot;
                </div>
            )}

            {/* Scrollbar styling */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>
        </div>
    );
}
