"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ChevronUp, ChevronDown, Sparkles, ShoppingBag, ShieldCheck } from "lucide-react";

interface BuyerProfile {
    id: number;
    name: string;
    governorate: string;
    size: "Standard (45×30 cm)" | "Mega Giant (60×40 cm)";
    timeAgo: string;
    avatarEmoji: string;
}

const RECENT_BUYERS: BuyerProfile[] = [
    { id: 1, name: "عزيز ب.", governorate: "سوسة", size: "Standard (45×30 cm)", timeAgo: "منذ 3 دقائق", avatarEmoji: "⚽" },
    { id: 2, name: "يوسف ط.", governorate: "تونس العاصمة", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 7 دقائق", avatarEmoji: "🏆" },
    { id: 3, name: "مريم ك.", governorate: "أريانة (النصر)", size: "Standard (45×30 cm)", timeAgo: "منذ 14 دقيقة", avatarEmoji: "✨" },
    { id: 4, name: "مهدي ج.", governorate: "صفاقس", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 22 دقيقة", avatarEmoji: "🔥" },
    { id: 5, name: "فراس ع.", governorate: "نابل (الحمامات)", size: "Standard (45×30 cm)", timeAgo: "منذ 30 دقيقة", avatarEmoji: "☕" },
    { id: 6, name: "سليم م.", governorate: "بنزرت", size: "Standard (45×30 cm)", timeAgo: "منذ 38 دقيقة", avatarEmoji: "🎮" },
    { id: 7, name: "خليل ب.", governorate: "المنستير", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 45 دقيقة", avatarEmoji: "💪" },
    { id: 8, name: "ياسمين ر.", governorate: "بن عروس (رادس)", size: "Standard (45×30 cm)", timeAgo: "منذ ساعة", avatarEmoji: "👑" },
    { id: 9, name: "أحمد و.", governorate: "منوبة (الدندان)", size: "Standard (45×30 cm)", timeAgo: "منذ ساعة", avatarEmoji: "⚡" },
    { id: 10, name: "ريان ح.", governorate: "القيروان", size: "Mega Giant (60×40 cm)", timeAgo: "منذ ساعتين", avatarEmoji: "🦁" },
    { id: 11, name: "أمين د.", governorate: "المهدية", size: "Standard (45×30 cm)", timeAgo: "منذ ساعتين", avatarEmoji: "🚀" },
    { id: 12, name: "حمزة ق.", governorate: "سيدي بوزيد", size: "Standard (45×30 cm)", timeAgo: "منذ ساعتين", avatarEmoji: "⚽" },
    { id: 13, name: "هبة ش.", governorate: "قابس", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 3 ساعات", avatarEmoji: "💎" },
    { id: 14, name: "بلال ب.", governorate: "مدنين (جرجيس)", size: "Standard (45×30 cm)", timeAgo: "منذ 3 ساعات", avatarEmoji: "🔥" },
    { id: 15, name: "إسكندر س.", governorate: "باجة", size: "Standard (45×30 cm)", timeAgo: "منذ 3 ساعات", avatarEmoji: "🏆" },
    { id: 16, name: "سامي ل.", governorate: "الكاف", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 4 ساعات", avatarEmoji: "☕" },
    { id: 17, name: "إيناس م.", governorate: "سليانة", size: "Standard (45×30 cm)", timeAgo: "منذ 4 ساعات", avatarEmoji: "✨" },
    { id: 18, name: "نور الدين غ.", governorate: "زغوان", size: "Standard (45×30 cm)", timeAgo: "منذ 4 ساعات", avatarEmoji: "🎮" },
    { id: 19, name: "مالك ف.", governorate: "جندوبة (طبرقة)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 5 ساعات", avatarEmoji: "💪" },
    { id: 20, name: "وسيم هـ.", governorate: "القصرين", size: "Standard (45×30 cm)", timeAgo: "منذ 5 ساعات", avatarEmoji: "🦁" },
    { id: 21, name: "شيماء ت.", governorate: "تطاوين", size: "Standard (45×30 cm)", timeAgo: "منذ 5 ساعات", avatarEmoji: "👑" },
    { id: 22, name: "أنيس ن.", governorate: "قفصة", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 6 ساعات", avatarEmoji: "⚡" },
    { id: 23, name: "زياد ص.", governorate: "توزر", size: "Standard (45×30 cm)", timeAgo: "منذ 6 ساعات", avatarEmoji: "🚀" },
    { id: 24, name: "رانية ب.", governorate: "قبلي", size: "Standard (45×30 cm)", timeAgo: "منذ 6 ساعات", avatarEmoji: "💎" },
    { id: 25, name: "محمد علي ز.", governorate: "تونس (المرسى)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 7 ساعات", avatarEmoji: "⚽" },
    { id: 26, name: "وائل خ.", governorate: "بن عروس (حمام الأنف)", size: "Standard (45×30 cm)", timeAgo: "منذ 7 ساعات", avatarEmoji: "🏆" },
    { id: 27, name: "آية ع.", governorate: "تونس (قمرت)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 7 ساعات", avatarEmoji: "✨" },
    { id: 28, name: "كريم ب.", governorate: "أريانة (سكرة)", size: "Standard (45×30 cm)", timeAgo: "منذ 8 ساعات", avatarEmoji: "🔥" },
    { id: 29, name: "هادي ج.", governorate: "بن عروس (المروج)", size: "Standard (45×30 cm)", timeAgo: "منذ 8 ساعات", avatarEmoji: "☕" },
    { id: 30, name: "سارة ر.", governorate: "أريانة (المنازه)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 8 ساعات", avatarEmoji: "🎮" },
    { id: 31, name: "رمزي ش.", governorate: "جندوبة (عين دراهم)", size: "Standard (45×30 cm)", timeAgo: "منذ 9 ساعات", avatarEmoji: "💪" },
    { id: 32, name: "حسام س.", governorate: "نابل (قليبية)", size: "Standard (45×30 cm)", timeAgo: "منذ 9 ساعات", avatarEmoji: "🦁" },
    { id: 33, name: "نسرين م.", governorate: "نابل (الهوارية)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 9 ساعات", avatarEmoji: "👑" },
    { id: 34, name: "غازي م.", governorate: "مدنين (حومة السوق - جربة)", size: "Standard (45×30 cm)", timeAgo: "منذ 10 ساعات", avatarEmoji: "⚡" },
    { id: 35, name: "فهد ز.", governorate: "مدنين (ميدون - جربة)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 10 ساعات", avatarEmoji: "🚀" },
    { id: 36, name: "طارق ل.", governorate: "تونس (قرطاج)", size: "Standard (45×30 cm)", timeAgo: "منذ 10 ساعات", avatarEmoji: "💎" },
    { id: 37, name: "إكرام ب.", governorate: "تونس (باردو)", size: "Standard (45×30 cm)", timeAgo: "منذ 11 ساعة", avatarEmoji: "⚽" },
    { id: 38, name: "هيثم ب.", governorate: "بن عروس (الزهراء)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 11 ساعة", avatarEmoji: "🏆" },
    { id: 39, name: "نادين ك.", governorate: "بنزرت (منزل بورقيبة)", size: "Standard (45×30 cm)", timeAgo: "منذ 11 ساعة", avatarEmoji: "✨" },
    { id: 40, name: "صابرين غ.", governorate: "بنزرت (رأس الجبل)", size: "Standard (45×30 cm)", timeAgo: "منذ 12 ساعة", avatarEmoji: "🔥" },
    { id: 41, name: "وليد ع.", governorate: "المنستير (جمال)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 12 ساعة", avatarEmoji: "☕" },
    { id: 42, name: "أسامة ق.", governorate: "المنستير (قصر هلال)", size: "Standard (45×30 cm)", timeAgo: "منذ 12 ساعة", avatarEmoji: "🎮" },
    { id: 43, name: "رامي م.", governorate: "المنستير (المكنين)", size: "Standard (45×30 cm)", timeAgo: "منذ 13 ساعة", avatarEmoji: "💪" },
    { id: 44, name: "إيمان د.", governorate: "سوسة (القلعة الكبرى)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 13 ساعة", avatarEmoji: "🦁" },
    { id: 45, name: "جهاد ك.", governorate: "سوسة (حمام سوسة)", size: "Standard (45×30 cm)", timeAgo: "منذ 13 ساعة", avatarEmoji: "👑" },
    { id: 46, name: "أشرف ع.", governorate: "سوسة (الخزامة)", size: "Standard (45×30 cm)", timeAgo: "منذ 14 ساعة", avatarEmoji: "⚡" },
    { id: 47, name: "صبري ف.", governorate: "صفاقس (طريق تونس)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 14 ساعة", avatarEmoji: "🚀" },
    { id: 48, name: "مروان ط.", governorate: "صفاقس (طريق العين)", size: "Standard (45×30 cm)", timeAgo: "منذ 14 ساعة", avatarEmoji: "💎" },
    { id: 49, name: "رحمة ج.", governorate: "قفصة (الرديف)", size: "Standard (45×30 cm)", timeAgo: "منذ 15 ساعة", avatarEmoji: "⚽" },
    { id: 50, name: "نزار ب.", governorate: "قابس (مطماطة)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 15 ساعة", avatarEmoji: "🏆" },
];

interface RecentOrderPopupProps {
    currentStep?: string;
    selectedCount?: number;
}

export default function RecentOrderPopup({ currentStep = "upload", selectedCount = 0 }: RecentOrderPopupProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [activeBuyerIndex, setActiveBuyerIndex] = useState(0);
    const [hasTriggeredMilestone, setHasTriggeredMilestone] = useState(false);

    // Pick a random starting offset on mount so repeat visits see fresh names
    const startOffset = useMemo(() => Math.floor(Math.random() * 20), []);

    // 3 recent buyers for the expanded drawer view
    const displayBuyers = useMemo(() => {
        return [
            RECENT_BUYERS[(activeBuyerIndex + startOffset) % RECENT_BUYERS.length],
            RECENT_BUYERS[(activeBuyerIndex + startOffset + 1) % RECENT_BUYERS.length],
            RECENT_BUYERS[(activeBuyerIndex + startOffset + 2) % RECENT_BUYERS.length],
        ];
    }, [activeBuyerIndex, startOffset]);

    const latestBuyer = displayBuyers[0];

    // Gentle rotation every 25 seconds (smart ticker, not spammy)
    useEffect(() => {
        if (isDismissed) return;
        const interval = setInterval(() => {
            setActiveBuyerIndex((prev) => (prev + 1) % RECENT_BUYERS.length);
        }, 25000);
        return () => clearInterval(interval);
    }, [isDismissed]);

    // Contextual trigger on milestone (e.g. user reaches 6 stats or checkout)
    useEffect(() => {
        if (isDismissed || hasTriggeredMilestone) return;

        if (selectedCount === 6 || currentStep === "checkout") {
            setHasTriggeredMilestone(true);
            // Briefly cycle to a fresh buyer to reinforce social proof
            setActiveBuyerIndex((prev) => (prev + 1) % RECENT_BUYERS.length);
        }
    }, [selectedCount, currentStep, isDismissed, hasTriggeredMilestone]);

    if (isDismissed) {
        // Minimal badge if user dismissed full widget
        return (
            <div className="fixed bottom-3 left-3 z-30 pointer-events-auto" dir="rtl">
                <button
                    type="button"
                    onClick={() => setIsDismissed(false)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/85 border border-[#D4AF37]/30 text-[10px] font-space font-bold text-gray-300 hover:text-[#F6D365] transition-all shadow-md cursor-pointer backdrop-blur-sm"
                    title="إظهار النشاط الأخير"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>4 طلبيات اليوم</span>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 max-w-[340px] sm:max-w-sm pointer-events-auto select-none" dir="rtl">
            <AnimatePresence mode="wait">
                {/* 1. EXPANDED ACTIVITY DRAWER */}
                {isExpanded ? (
                    <motion.div
                        key="drawer"
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="rounded-2xl bg-neutral-950/95 border border-[#D4AF37]/40 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-md space-y-3"
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold font-space text-white flex items-center gap-1">
                                    <ShoppingBag className="w-3.5 h-3.5 text-[#F6D365]" />
                                    آخر الطلبيات المؤكدة في تونس
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(false)}
                                    className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    title="تصغير"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsDismissed(true)}
                                    className="p-1 rounded-lg text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                    title="إغلاق"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* List of 3 Recent Buyers */}
                        <div className="space-y-2">
                            {displayBuyers.map((buyer, idx) => (
                                <div
                                    key={`${buyer.id}-${idx}`}
                                    className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                                        idx === 0
                                            ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-white"
                                            : "bg-white/[0.02] border-white/5 text-gray-300"
                                    }`}
                                >
                                    <span className="text-base shrink-0">{buyer.avatarEmoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between text-xs font-space">
                                            <span className="font-bold text-white truncate">
                                                {buyer.name} <span className="text-[10px] text-gray-400 font-normal">({buyer.governorate})</span>
                                            </span>
                                            <span className="text-[9px] text-gray-400 font-mono shrink-0">{buyer.timeAgo}</span>
                                        </div>
                                        <div className="text-[10px] text-[#F6D365] font-space font-medium truncate flex items-center gap-1 mt-0.5">
                                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                                            <span>كارت {buyer.size}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trust Footer */}
                        <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400 font-space border-t border-white/5">
                            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                                <ShieldCheck className="w-3 h-3" /> دفع عند التوصيل 100%
                            </span>
                            <span className="text-gray-400">توصيل لكافة الولايات 🚚</span>
                        </div>
                    </motion.div>
                ) : (
                    /* 2. SMART COMPACT ACTIVITY PILL (Default View) */
                    <motion.div
                        key="pill"
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="group flex items-center gap-2 px-3 py-2 rounded-2xl bg-neutral-950/90 hover:bg-neutral-900/95 border border-[#D4AF37]/35 shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all cursor-pointer"
                        onClick={() => setIsExpanded(true)}
                    >
                        {/* Live Green Pulsing Indicator */}
                        <div className="relative flex items-center justify-center shrink-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="absolute w-3 h-3 rounded-full bg-emerald-400/40 animate-ping" />
                        </div>

                        {/* Text Summary */}
                        <div className="flex-1 min-w-0 text-right">
                            <div className="text-[11px] font-space text-gray-200 font-bold truncate">
                                <span>{latestBuyer.name}</span>{" "}
                                <span className="text-gray-400 font-normal">من {latestBuyer.governorate}</span>
                            </div>
                            <div className="text-[9px] text-[#F6D365] font-space font-medium truncate flex items-center gap-1">
                                <span>طلب كارت {latestBuyer.size}</span>
                                <span className="text-gray-400">• {latestBuyer.timeAgo}</span>
                            </div>
                        </div>

                        {/* Expand / Close Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                            <span className="p-1 rounded-md text-gray-400 group-hover:text-white transition-colors" title="عرض التفاصيل">
                                <ChevronUp className="w-3.5 h-3.5" />
                            </span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDismissed(true);
                                }}
                                className="p-1 rounded-md text-gray-500 hover:text-red-400 transition-colors"
                                title="إخفاء"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
