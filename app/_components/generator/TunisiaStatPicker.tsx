"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check, Plus, Sparkles, Flame, Grid } from "lucide-react";
import { TUNISIA_STATS, searchStats, type TunisiaStat } from "../../generator/lib/tunisiaStats";
import { POPULAR_STAT_CODES } from "@/app/constant";

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

// ─── Memoized Stat Item for 120 FPS performance ───────────────────────────
const StatButton = React.memo(function StatButton({
    stat,
    active,
    disabled,
    onToggle,
}: {
    stat: TunisiaStat;
    active: boolean;
    disabled: boolean;
    onToggle: (code: string) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => !disabled && onToggle(stat.code)}
            disabled={disabled}
            className={`relative p-3.5 sm:p-4 rounded-2xl border transition-colors duration-150 text-right cursor-pointer select-none active:scale-[0.97] transition-transform ${
                active
                    ? "border-[#D4AF37] bg-black shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
                    : disabled
                    ? "border-white/5 bg-white/5 opacity-30 cursor-not-allowed"
                    : "border-white/10 bg-neutral-950/90 hover:border-[#D4AF37]/50 hover:bg-black"
            }`}
            style={{ contain: "content" }}
        >
            {/* Emoji + Code */}
            <div className="flex items-center gap-2 mb-1 justify-end">
                <span className={`font-space font-bold text-xs tracking-wider ${active ? "text-[#F6D365]" : "text-white"}`}>
                    {stat.code}
                </span>
                <span className="text-lg leading-none">{stat.emoji}</span>
            </div>

            {/* Stat name */}
            <div className={`font-space text-xs font-semibold leading-snug ${active ? "text-[#F6D365]" : "text-gray-300"}`}>
                {stat.meaning}
            </div>

            {/* Tunisian name (small) */}
            <div className="text-[10px] text-gray-400 font-space mt-0.5 truncate">
                {stat.stat}
            </div>

            {/* Selected indicator */}
            {active && (
                <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 text-black stroke-[3]" />
                </div>
            )}
        </button>
    );
});

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
    const [activeTab, setActiveTab] = useState<"popular" | "all">("popular");
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
        if (query.trim()) {
            const q = query.toLowerCase().trim();
            return allStats.filter(
                (s) =>
                    s.code.toLowerCase().includes(q) ||
                    s.stat.toLowerCase().includes(q) ||
                    s.meaning.toLowerCase().includes(q)
            );
        }
        if (activeTab === "popular") {
            return allStats.filter(
                (s) => POPULAR_STAT_CODES.includes(s.code) || customStats.some((c) => c.code === s.code)
            );
        }
        return allStats;
    }, [query, activeTab, allStats, customStats]);

    const toggleStat = useCallback((code: string) => {
        if (selected.includes(code)) {
            onSelectionChange(selected.filter((c) => c !== code));
        } else if (selected.length < maxSelection) {
            onSelectionChange([...selected, code]);
        }
    }, [selected, maxSelection, onSelectionChange]);

    const isSelected = useCallback((code: string) => selected.includes(code), [selected]);
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

    const removeCustomStat = useCallback((code: string) => {
        const updated = customStats.filter((s) => s.code !== code);
        setCustomStats(updated);
        saveCustomStatsToStorage(updated);
        if (selected.includes(code)) {
            onSelectionChange(selected.filter((c) => c !== code));
        }
    }, [customStats, selected, onSelectionChange]);

    const isCustom = useCallback((code: string) => customStats.some((s) => s.code === code), [customStats]);

    // Auto-preview code & emoji
    const previewCode = newStatName.trim() ? generateStatCode(newStatName.trim()) : "???";
    const previewEmoji = newStatName.trim()
        ? autoPickEmoji(newStatName.trim(), newStatMeaning.trim() || newStatName.trim())
        : "⭐";

    return (
        <div className="space-y-4">
            {/* Header with counter & Tab switcher */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3">
                    <div
                        className={`text-xs font-bold font-space px-3 py-1.5 rounded-full border transition-all duration-300 ${
                            isFull
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                : "bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#F6D365]"
                        }`}
                    >
                        {selected.length} / {maxSelection} تم اختيارهم
                    </div>
                    {isFull && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-emerald-400 text-xs font-space font-semibold flex items-center gap-1"
                        >
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> جاهز!
                        </motion.span>
                    )}
                </div>

                {/* Popular vs All Tabs */}
                <div className="flex items-center p-1 bg-black/60 border border-white/10 rounded-xl">
                    <button
                        type="button"
                        onClick={() => { setActiveTab("popular"); setQuery(""); }}
                        className={`px-3 py-1 rounded-lg text-xs font-space font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            activeTab === "popular" && !query
                                ? "bg-[#D4AF37] text-black shadow-md"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        <Flame className="w-3 h-3" /> الأكثر شهرة
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab("all"); }}
                        className={`px-3 py-1 rounded-lg text-xs font-space font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            activeTab === "all" || query
                                ? "bg-[#D4AF37] text-black shadow-md"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        <Grid className="w-3 h-3" /> الكل ({allStats.length})
                    </button>
                </div>
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
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/15 bg-neutral-900/90 text-sm text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-400"
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
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`flex items-center gap-1.5 px-4 py-3.5 rounded-2xl border text-sm font-space font-bold transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 ${
                        showAddForm
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                            : "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#F6D365] hover:bg-[#D4AF37]/20"
                    }`}
                >
                    {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showAddForm ? "إلغاء" : "أضف ستات"}
                </button>
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
                        <div className="p-5 rounded-2xl border border-[#D4AF37]/30 bg-neutral-900/95 space-y-4">
                            {/* Live preview */}
                            <div className="flex items-center justify-center gap-4 py-3 px-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20">
                                <span className="text-2xl">{previewEmoji}</span>
                                <span className="font-space font-black text-[#F6D365] text-lg tracking-widest">{previewCode}</span>
                                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
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

                            <button
                                onClick={handleAddCustomStat}
                                disabled={!newStatName.trim()}
                                className="w-full py-3 rounded-xl font-space font-bold text-sm transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] active:scale-[0.98]"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    أضف {previewEmoji} {previewCode}
                                </span>
                            </button>
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
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => toggleStat(code)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#C89B3C] text-xs font-space font-semibold hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors duration-150 cursor-pointer group active:scale-95"
                                >
                                    <span>{stat.emoji}</span>
                                    <span>{stat.code}</span>
                                    <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                                </button>
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
                                <div key={stat.code} className="relative">
                                    <StatButton
                                        stat={stat}
                                        active={active}
                                        disabled={disabled}
                                        onToggle={toggleStat}
                                    />
                                    {/* Delete custom stat button */}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeCustomStat(stat.code); }}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer shadow-md z-10"
                                    >
                                        <X className="w-3 h-3 stroke-[3]" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Built-in stats grid */}
            <div
                className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar"
                style={{
                    WebkitOverflowScrolling: "touch",
                    overscrollBehavior: "contain",
                }}
            >
                {filteredStats.filter((s) => !isCustom(s.code)).map((stat) => {
                    const active = isSelected(stat.code);
                    const disabled = isFull && !active;
                    return (
                        <StatButton
                            key={stat.code}
                            stat={stat}
                            active={active}
                            disabled={disabled}
                            onToggle={toggleStat}
                        />
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
