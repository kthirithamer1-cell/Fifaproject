"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Sparkles } from "lucide-react";

interface BuyerProfile {
    id: number;
    name: string;
    governorate: string;
    size: "Standard (45×30 cm)" | "Mega Giant (60×40 cm)";
    timeAgo: string;
    avatarEmoji: string;
}

const RECENT_BUYERS: BuyerProfile[] = [
    { id: 1, name: "عزيز ب.", governorate: "سوسة", size: "Standard (45×30 cm)", timeAgo: "منذ 4 دقائق", avatarEmoji: "⚽" },
    { id: 2, name: "يوسف ط.", governorate: "تونس العاصمة", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 8 دقائق", avatarEmoji: "🏆" },
    { id: 3, name: "مريم ك.", governorate: "أريانة (النصر)", size: "Standard (45×30 cm)", timeAgo: "منذ 14 دقيقة", avatarEmoji: "✨" },
    { id: 4, name: "مهدي ج.", governorate: "صفاقس", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 21 دقيقة", avatarEmoji: "🔥" },
    { id: 5, name: "فراس ع.", governorate: "نابل (الحمامات)", size: "Standard (45×30 cm)", timeAgo: "منذ 29 دقيقة", avatarEmoji: "☕" },
    { id: 6, name: "سليم م.", governorate: "بنزرت", size: "Standard (45×30 cm)", timeAgo: "منذ 36 دقيقة", avatarEmoji: "🎮" },
    { id: 7, name: "خليل ب.", governorate: "المنستير", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 45 دقيقة", avatarEmoji: "💪" },
    { id: 8, name: "ياسمين ر.", governorate: "بن عروس (رادس)", size: "Standard (45×30 cm)", timeAgo: "منذ ساعة", avatarEmoji: "👑" },
    { id: 9, name: "أحمد و.", governorate: "منوبة (الدندان)", size: "Standard (45×30 cm)", timeAgo: "منذ ساعتين", avatarEmoji: "⚡" },
    { id: 10, name: "ريان ح.", governorate: "القيروان", size: "Mega Giant (60×40 cm)", timeAgo: "منذ ساعتين", avatarEmoji: "🦁" },
    { id: 11, name: "أمين د.", governorate: "المهدية", size: "Standard (45×30 cm)", timeAgo: "منذ ساعتين", avatarEmoji: "🚀" },
    { id: 12, name: "حمزة ق.", governorate: "سيدي بوزيد", size: "Standard (45×30 cm)", timeAgo: "منذ 3 ساعات", avatarEmoji: "⚽" },
    { id: 13, name: "هبة ش.", governorate: "قابس", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 3 ساعات", avatarEmoji: "💎" },
    { id: 14, name: "بلال ب.", governorate: "مدنين (جرجيس)", size: "Standard (45×30 cm)", timeAgo: "منذ 3 ساعات", avatarEmoji: "🔥" },
    { id: 15, name: "إسكندر س.", governorate: "باجة", size: "Standard (45×30 cm)", timeAgo: "منذ 4 ساعات", avatarEmoji: "🏆" },
    { id: 16, name: "سامي ل.", governorate: "الكاف", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 4 ساعات", avatarEmoji: "☕" },
    { id: 17, name: "إيناس م.", governorate: "سليانة", size: "Standard (45×30 cm)", timeAgo: "منذ 4 ساعات", avatarEmoji: "✨" },
    { id: 18, name: "نور الدين غ.", governorate: "زغوان", size: "Standard (45×30 cm)", timeAgo: "منذ 5 ساعات", avatarEmoji: "🎮" },
    { id: 19, name: "مالك ف.", governorate: "جندوبة (طبرقة)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 5 ساعات", avatarEmoji: "💪" },
    { id: 20, name: "وسيم هـ.", governorate: "القصرين", size: "Standard (45×30 cm)", timeAgo: "منذ 6 ساعات", avatarEmoji: "🦁" },
    { id: 21, name: "شيماء ت.", governorate: "تطاوين", size: "Standard (45×30 cm)", timeAgo: "منذ 6 ساعات", avatarEmoji: "👑" },
    { id: 22, name: "أنيس ن.", governorate: "قفصة", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 7 ساعات", avatarEmoji: "⚡" },
    { id: 23, name: "زياد ص.", governorate: "توزر", size: "Standard (45×30 cm)", timeAgo: "منذ 7 ساعات", avatarEmoji: "🚀" },
    { id: 24, name: "رانية ب.", governorate: "قبلي", size: "Standard (45×30 cm)", timeAgo: "منذ 8 ساعات", avatarEmoji: "💎" },
    { id: 25, name: "محمد علي ز.", governorate: "تونس (المرسى)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 8 ساعات", avatarEmoji: "⚽" },
    { id: 26, name: "وائل خ.", governorate: "بن عروس (حمام الأنف)", size: "Standard (45×30 cm)", timeAgo: "منذ 9 ساعات", avatarEmoji: "🏆" },
    { id: 27, name: "آية ع.", governorate: "تونس (قمرت)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 9 ساعات", avatarEmoji: "✨" },
    { id: 28, name: "كريم ب.", governorate: "أريانة (سكرة)", size: "Standard (45×30 cm)", timeAgo: "منذ 10 ساعات", avatarEmoji: "🔥" },
    { id: 29, name: "هادي ج.", governorate: "بن عروس (المروج)", size: "Standard (45×30 cm)", timeAgo: "منذ 10 ساعات", avatarEmoji: "☕" },
    { id: 30, name: "سارة ر.", governorate: "أريانة (المنازه)", size: "Mega Giant (60×40 cm)", timeAgo: "منذ 11 ساعة", avatarEmoji: "🎮" },
];

interface RecentOrderPopupProps {
    currentStep?: string;
    selectedCount?: number;
}

export default function RecentOrderPopup({ currentStep = "upload" }: RecentOrderPopupProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [buyerIndex, setBuyerIndex] = useState(0);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [isDismissedByUser, setIsDismissedByUser] = useState(false);

    const hesitationTimerRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
    const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Pick 1 random starting buyer on mount
    useEffect(() => {
        const randomIdx = Math.floor(Math.random() * RECENT_BUYERS.length);
        setBuyerIndex(randomIdx);
    }, []);

    // ─── 1. Keyboard / Form Focus Awareness ────────────────────────────────
    useEffect(() => {
        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
                setIsKeyboardOpen(true);
                setIsVisible(false);
            }
        };

        const handleFocusOut = () => {
            setIsKeyboardOpen(false);
        };

        window.addEventListener("focusin", handleFocusIn);
        window.addEventListener("focusout", handleFocusOut);

        return () => {
            window.removeEventListener("focusin", handleFocusIn);
            window.removeEventListener("focusout", handleFocusOut);
        };
    }, []);

    // ─── 2. Show Popup Trigger Function ────────────────────────────────────
    const showPopup = useCallback(() => {
        if (isKeyboardOpen || isDismissedByUser) return;

        setBuyerIndex((prev) => (prev + 1) % RECENT_BUYERS.length);
        setIsVisible(true);

        // Auto-hide cleanly after 6.5 seconds
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => {
            setIsVisible(false);
        }, 6500);
    }, [isKeyboardOpen, isDismissedByUser]);

    // ─── 3. Initial 5-Second Trigger on Landing & Generator ───────────────
    useEffect(() => {
        if (isDismissedByUser) return;

        // Trigger first social proof 5s after page load
        const initialTimer = setTimeout(() => {
            showPopup();
        }, 5000);

        // For Landing page, rotate live orders periodically every 24s
        if (currentStep === "landing") {
            rotationIntervalRef.current = setInterval(() => {
                showPopup();
            }, 24000);
        }

        return () => {
            clearTimeout(initialTimer);
            if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
        };
    }, [currentStep, showPopup, isDismissedByUser]);

    // ─── 4. Generator Hesitation Trigger ──────────────────────────────────
    useEffect(() => {
        if (currentStep === "landing" || isDismissedByUser) return;

        const resetHesitationTimer = () => {
            if (hesitationTimerRef.current) clearTimeout(hesitationTimerRef.current);

            hesitationTimerRef.current = setTimeout(() => {
                showPopup();
            }, 5000);
        };

        window.addEventListener("touchstart", resetHesitationTimer, { passive: true });
        window.addEventListener("scroll", resetHesitationTimer, { passive: true });
        window.addEventListener("pointerdown", resetHesitationTimer, { passive: true });

        resetHesitationTimer();

        return () => {
            if (hesitationTimerRef.current) clearTimeout(hesitationTimerRef.current);
            window.removeEventListener("touchstart", resetHesitationTimer);
            window.removeEventListener("scroll", resetHesitationTimer);
            window.removeEventListener("pointerdown", resetHesitationTimer);
        };
    }, [currentStep, showPopup, isDismissedByUser]);

    // If keyboard is open, don't show popup
    if (isKeyboardOpen) return null;

    const currentBuyer = RECENT_BUYERS[buyerIndex];

    return (
        <div
            className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-4 z-40 max-w-[320px] sm:max-w-sm pointer-events-none select-none"
            dir="rtl"
        >
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 25, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="pointer-events-auto relative p-3 sm:p-3.5 rounded-2xl bg-neutral-950/95 border border-[#D4AF37]/40 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md"
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => {
                                setIsVisible(false);
                                setIsDismissedByUser(true);
                                if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                            }}
                            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-neutral-900 border border-white/20 text-gray-400 hover:text-white flex items-center justify-center text-[10px] cursor-pointer shadow-md transition-colors z-10"
                            title="إغلاق"
                        >
                            <X className="w-3 h-3" />
                        </button>

                        <div className="flex items-start gap-2.5">
                            {/* Avatar Icon */}
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-[#F6D365]/10 border border-[#D4AF37]/40 flex items-center justify-center text-base shrink-0 shadow-inner">
                                {currentBuyer.avatarEmoji}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 space-y-0.5 text-right">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-space font-bold text-xs text-white truncate">
                                        {currentBuyer.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-space truncate">
                                        من {currentBuyer.governorate}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block shrink-0" />
                                </div>

                                <div className="text-[11px] text-[#F6D365] font-space font-semibold truncate flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span>
                                        {currentStep === "checkout"
                                            ? `أكد طلب كارت ${currentBuyer.size}`
                                            : `طلب كارت ${currentBuyer.size}`}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-[9px] text-gray-400 font-space pt-0.5">
                                    <span>{currentBuyer.timeAgo}</span>
                                    <span className="text-[#D4AF37] font-bold flex items-center gap-0.5">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        {currentStep === "checkout" ? "دفع عند الاستلام" : "مؤكّد"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
