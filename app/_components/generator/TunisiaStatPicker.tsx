"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check, Plus, Sparkles } from "lucide-react";
import { TUNISIA_STATS, searchStats, type TunisiaStat } from "../../generator/lib/tunisiaStats";

// ─── Auto-generate 3-letter code from stat name ──────────────────────────
function generateStatCode(name: string): string {
    const clean = name.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const consonants = clean.replace(/[AEIOU]/g, "");
    let code = consonants.length >= 3 ? consonants.slice(0, 3) : clean.slice(0, 3);
    if (code.length < 3) code = code.padEnd(3, "X");
    // Ensure unique by checking existing codes
    const existingCodes = new Set(TUNISIA_STATS.map((s) => s.code));
    const customs = getCustomStatsFromStorage();
    customs.forEach((s) => existingCodes.add(s.code));
    let finalCode = code;
    let suffix = 1;
    while (existingCodes.has(finalCode)) {
        finalCode = code.slice(0, 2) + String(suffix);
        suffix++;
        if (suffix > 9) {
            finalCode = code[0] + String(Math.floor(Math.random() * 99)).padStart(2, "0");
            break;
        }
    }
    return finalCode;
}

// ─── Auto-pick emoji from keywords ───────────────────────────────────────
const EMOJI_MAP: [RegExp, string][] = [
    [/cook|food|eat|makl|barm/i, "🍳"],
    [/sport|foot|ball|kora/i, "⚽"],
    [/game|gam|play|l3b/i, "🎮"],
    [/music|song|sing|ghon/i, "🎵"],
    [/car|driv|karhb|sya9/i, "🚗"],
    [/gym|fit|musc|kasa/i, "💪"],
    [/code|dev|tech|prog/i, "💻"],
    [/money|flous|tektek|bizn/i, "💰"],
    [/sleep|noum|rekd|s7r/i, "😴"],
    [/love|hob|rom|heart/i, "❤️"],
    [/talk|klem|hadr|sout/i, "🗣️"],
    [/smart|mekh|dhk|brain/i, "🧠"],
    [/laugh|dhahk|funny|joke/i, "😂"],
    [/anger|3sab|nerv/i, "😡"],
    [/style|fash|lbg|chic/i, "👔"],
    [/luck|zhar|chance/i, "🍀"],
    [/travel|trip|dwr|tour/i, "✈️"],
    [/photo|cam|tswr/i, "📸"],
    [/read|book|study|9ra/i, "📚"],
    [/dance|ra9s/i, "💃"],
    [/swim|bahr|sea/i, "🏊"],
    [/fight|box|9tal/i, "🥊"],
    [/shop|sarf|achri/i, "🛍️"],
    [/friend|s7b|s7ab/i, "🤜🤛"],
    [/work|khidm|khed/i, "💼"],
    [/patient|sabr|sbr/i, "😇"],
    [/brave|chj|coura/i, "🦁"],
    [/lazy|kasl|reyah/i, "🛋️"],
    [/drama|drm/i, "🎭"],
    [/clean|ndaf/i, "✨"],
];

function autoPickEmoji(name: string, meaning: string): string {
    const text = `${name} ${meaning}`.toLowerCase();
    for (const [regex, emoji] of EMOJI_MAP) {
        if (regex.test(text)) return emoji;
    }
    return "⭐";
}

// ─── localStorage helpers ────────────────────────────────────────────────
const CUSTOM_STATS_KEY = "flawless_custom_stats";

function getCustomStatsFromStorage(): TunisiaStat[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(CUSTOM_STATS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCustomStatsToStorage(stats: TunisiaStat[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(CUSTOM_STATS_KEY, JSON.stringify(stats));
}

// ─── Component ───────────────────────────────────────────────────────────

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
    const [customStats, setCustomStats] = useState<TunisiaStat[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStatName, setNewStatName] = useState("");
    const [newStatMeaning, setNewStatMeaning] = useState("");

    // Load custom stats from localStorage on mount
    useEffect(() => {
        setCustomStats(getCustomStatsFromStorage());
    }, []);

    // All stats = built-in + custom
    const allStats = useMemo(() => [...TUNISIA_STATS, ...customStats], [customStats]);

    const filteredStats = useMemo(() => {
        if (!query.trim()) return allStats;
        const q = query.toLowerCase().trim();
        return allStats.filter(
            (s) =>
                s.code.toLowerCase().includes(q) ||
                s.stat.toLowerCase().includes(q) ||
                s.meaning.toLowerCase().includes(q)
        );
    }, [query, allStats]);

    const toggleStat = (code: string) => {
        if (selected.includes(code)) {
            onSelectionChange(selected.filter((c) => c !== code));
        } else if (selected.length < maxSelection) {
            onSelectionChange([...selected, code]);
        }
    };

    const isSelected = (code: string) => selected.includes(code);
    const isFull = selected.length >= maxSelection;

    // ── Add custom stat ──
    const handleAddCustomStat = useCallback(() => {
        const name = newStatName.trim();
        const meaning = newStatMeaning.trim() || name;
        if (!name) return;

        const code = generateStatCode(name);
        const emoji = autoPickEmoji(name, meaning);

        const newStat: TunisiaStat = {
            code,
            stat: name,
            meaning,
            emoji,
        };

        const updated = [...customStats, newStat];
        setCustomStats(updated);
        saveCustomStatsToStorage(updated);

        // Auto-select if not full
        if (selected.length < maxSelection) {
            onSelectionChange([...selected, code]);
        }

        setNewStatName("");
        setNewStatMeaning("");
        setShowAddForm(false);
    }, [newStatName, newStatMeaning, customStats, selected, maxSelection, onSelectionChange]);

    const removeCustomStat = (code: string) => {
        const updated = customStats.filter((s) => s.code !== code);
        setCustomStats(updated);
        saveCustomStatsToStorage(updated);
        if (selected.includes(code)) {
            onSelectionChange(selected.filter((c) => c !== code));
        }
    };

    const isCustom = (code: string) => customStats.some((s) => s.code === code);

    // Auto-preview code & emoji
    const previewCode = newStatName.trim() ? generateStatCode(newStatName.trim()) : "???";
    const previewEmoji = newStatName.trim()
        ? autoPickEmoji(newStatName.trim(), newStatMeaning.trim() || newStatName.trim())
        : "⭐";

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

            {/* Search bar + Add button */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="ابحث عن ستات... (Search DHK, JAW, KLM...)"
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
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`flex items-center gap-1.5 px-4 py-3.5 rounded-2xl border text-sm font-space font-bold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                        showAddForm
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                            : "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F6D365] hover:bg-[#D4AF37]/20"
                    }`}
                >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddForm ? "إلغاء" : "أضف ستات"}
                </motion.button>
            </div>

            {/* Add custom stat form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 rounded-2xl border border-[#D4AF37]/30 bg-black/80 space-y-4">
                            {/* Live preview */}
                            <div className="flex items-center justify-center gap-4 py-3 px-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20">
                                <span className="text-2xl">{previewEmoji}</span>
                                <span className="font-space font-black text-[#F6D365] text-lg tracking-widest">{previewCode}</span>
                                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-xs text-gray-400 font-space">Auto-generated</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-400 font-space mb-1 block" dir="rtl">إسم الستات (Stat Name) *</label>
                                    <input
                                        type="text"
                                        value={newStatName}
                                        onChange={(e) => setNewStatName(e.target.value)}
                                        placeholder="مثال: Cooking, Sbiba, Karam..."
                                        maxLength={30}
                                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/60 text-sm text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-space mb-1 block" dir="rtl">الوصف (Description)</label>
                                    <input
                                        type="text"
                                        value={newStatMeaning}
                                        onChange={(e) => setNewStatMeaning(e.target.value)}
                                        placeholder="مثال: Cooking skills, Generosity..."
                                        maxLength={40}
                                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/60 text-sm text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddCustomStat}
                                disabled={!newStatName.trim()}
                                className="w-full py-3 rounded-xl font-space font-bold text-sm transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)]"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    أضف {previewEmoji} {previewCode}
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            const stat = allStats.find((s) => s.code === code);
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

            {/* Custom stats section */}
            {customStats.length > 0 && (
                <div className="space-y-2">
                    <div className="text-xs font-space font-semibold text-[#D4AF37] flex items-center gap-1.5" dir="rtl">
                        <Sparkles className="w-3.5 h-3.5" /> الستاتيكس المخصّصة ({customStats.length})
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {customStats.filter((s) => {
                            if (!query.trim()) return true;
                            const q = query.toLowerCase();
                            return s.code.toLowerCase().includes(q) || s.stat.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q);
                        }).map((stat) => {
                            const active = isSelected(stat.code);
                            const disabled = isFull && !active;
                            return (
                                <motion.div
                                    key={stat.code}
                                    whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
                                    className="relative"
                                >
                                    <button
                                        onClick={() => !disabled && toggleStat(stat.code)}
                                        className={`w-full p-4 rounded-2xl border transition-all duration-300 text-right cursor-pointer ${
                                            active
                                                ? "border-[#D4AF37] bg-black/90 shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
                                                : disabled
                                                ? "border-white/5 bg-white/5 opacity-30 cursor-not-allowed"
                                                : "border-[#D4AF37]/20 bg-[#D4AF37]/5 hover:border-[#D4AF37]/50 hover:bg-black/90 shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5 justify-end">
                                            <span className={`font-space font-bold text-xs tracking-wider ${active ? "text-[#F6D365]" : "text-white"}`}>
                                                {stat.code}
                                            </span>
                                            <span className="text-lg">{stat.emoji}</span>
                                        </div>
                                        <div className={`font-space text-xs font-semibold leading-tight ${active ? "text-[#F6D365]" : "text-gray-300"}`}>
                                            {stat.meaning}
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-space mt-1 truncate">{stat.stat}</div>
                                        {active && (
                                            <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-md">
                                                <Check className="w-3 h-3 text-black stroke-[3]" />
                                            </div>
                                        )}
                                    </button>
                                    {/* Delete custom stat button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeCustomStat(stat.code); }}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-md z-10"
                                    >
                                        <X className="w-3 h-3 stroke-[3]" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Built-in stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredStats.filter((s) => !isCustom(s.code)).map((stat) => {
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
            {filteredStats.length === 0 && customStats.length === 0 && (
                <div className="text-center py-8 text-gray-400 font-space text-sm">
                    No stats found for &quot;{query}&quot;
                    <button
                        onClick={() => { setShowAddForm(true); setNewStatName(query); }}
                        className="block mx-auto mt-3 text-[#D4AF37] font-semibold hover:underline cursor-pointer"
                    >
                        + أضف &quot;{query}&quot; كستات جديد
                    </button>
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
