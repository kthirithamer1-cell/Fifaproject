"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    Target,
    Palette,
    Camera,
    Brain,
    Sparkles,
    Eye,
    CreditCard,
    Gift,
    User,
    Heart,
    Users,
    Briefcase,
    Smile,
    Trophy,
    Scale,
    Flame,
    ImagePlus,
    Check,
    Loader2,
    PartyPopper,
    ChevronLeft,
    ArrowRight,
    Wand2,
    PenTool,
    Download,
    SlidersHorizontal,
    MessageCircle,
    UserCircle,
    ListChecks,
    Lock
} from "lucide-react";
import CardComposer from "../_components/generator/CardComposer";
import type { CardStat, CardBadge } from "../_components/generator/CardComposer";
import CardEditor from "../_components/generator/CardEditor";
import BackgroundPicker from "../_components/generator/BackgroundPicker";
import TunisiaStatPicker from "../_components/generator/TunisiaStatPicker";
import { TUNISIA_STATS, getStatByCode, calculateOverall, type SelectedStat } from "./lib/tunisiaStats";

// ─── Types ────────────────────────────────────────────────────────────────

type Step =
    | "mode"
    | "upload"
    | "profile"
    | "stats-pick"
    | "stats-values"
    | "personality"
    | "ai"
    | "ai-interview"
    | "review"
    | "checkout";

type CardMode = "describe" | "ai-describe" | null;

type Recipient = "friend" | "myself" | "partner" | "family" | "colleague" | null;
type Mood = "funny" | "serious" | "mixed" | "savage" | "wholesome" | null;

export type PersonalityAnswers = {
    talent: string | null;
    weakness: string | null;
    words: string[] | null;
    activity: string | null;
    coffeeLevel: string | null;
    sleepLevel: string | null;
    phrase: string | null;
    lateLevel: string | null;
    funnyLevel: string | null;
    loved: string | null;
    friendGroup: string | null;
};

export type ProfileInfo = {
    name: string;
    age: string;
    gender: "male" | "female" | "";
    hobbies: string[];
    description: string;
    designNotes: string;
};

export type CardData = {
    recipient: Recipient;
    mode: CardMode;
    mood: Mood;
    photo: string | null;
    personality: PersonalityAnswers;
    backgroundChoice: "ai" | "static" | null;
    staticBgUrl: string | null;
};

import {
    ALL_STEPS,
    AI_INTERVIEW_QUESTIONS,
    PERSONALITY_QUESTIONS,
    DEFAULT_EDITOR_STATS,
    DEFAULT_EDITOR_BADGES,
    DEFAULT_EDITOR_HASHTAGS,
} from "@/app/constant";

// ─── Helper: generate random stats ──────────────────────────────────────

const generateStats = () => ({
    pace: Math.floor(Math.random() * 30) + 70,
    shooting: Math.floor(Math.random() * 30) + 70,
    passing: Math.floor(Math.random() * 30) + 70,
    defending: Math.floor(Math.random() * 30) + 70,
    physical: Math.floor(Math.random() * 30) + 70,
});

// ─── Main Component ──────────────────────────────────────────────────────

export default function FIFAMemeTN() {
    // ── State ──
    const [currentStep, setCurrentStep] = useState<Step>("upload");
    const [cardData, setCardData] = useState<CardData>({
        recipient: null,
        mode: "describe",
        mood: null,
        photo: null,
        personality: {
            talent: null,
            weakness: null,
            words: null,
            activity: null,
            coffeeLevel: null,
            sleepLevel: null,
            phrase: null,
            lateLevel: null,
            funnyLevel: null,
            loved: null,
            friendGroup: null,
        },
        backgroundChoice: null,
        staticBgUrl: null,
    });
    const [personalityIndex, setPersonalityIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);
    const [revealCard, setRevealCard] = useState(false);
    const [stats, setStats] = useState({
        pace: 80,
        shooting: 80,
        passing: 80,
        defending: 80,
        physical: 80
    });
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [overallRating, setOverallRating] = useState(0);
    const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cardComposerRef = useRef<HTMLDivElement>(null);
    const [freeDescription, setFreeDescription] = useState("");
    const [editorAccentColor, setEditorAccentColor] = useState("#D4AF37");

    // ── Custom Card Editor State ──
    const [editorName, setEditorName] = useState("LEGEND");
    const [editorSubtitle, setEditorSubtitle] = useState("Born to be legendary");
    const [editorPosition, setEditorPosition] = useState("GOAT");
    const [editorRating, setEditorRating] = useState(99);
    const [editorStats, setEditorStats] = useState<CardStat[]>(DEFAULT_EDITOR_STATS);
    const [editorBadges, setEditorBadges] = useState<CardBadge[]>(DEFAULT_EDITOR_BADGES);
    const [editorQuoteFr, setEditorQuoteFr] = useState("Born different, made legendary");
    const [editorQuoteAr, setEditorQuoteAr] = useState("أسطورة من تونس");
    const [editorHashtags, setEditorHashtags] = useState(DEFAULT_EDITOR_HASHTAGS);
    const [editorDescription, setEditorDescription] = useState("Skill • Charisma • Influence • Focus");
    const [editorBgUrl, setEditorBgUrl] = useState<string>("/prompting/image.png");
    const [isGeneratingBg, setIsGeneratingBg] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [mounted, setMounted] = useState(false);

    // ── Describe Yourself State ──
    const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
        name: "",
        age: "",
        gender: "",
        hobbies: [],
        description: "",
        designNotes: "",
    });
    const [customHobbyInput, setCustomHobbyInput] = useState("");
    const [selectedStatCodes, setSelectedStatCodes] = useState<string[]>([]);
    const [statValues, setStatValues] = useState<Record<string, number>>({});

    // ── AI Interview State ──
    const [aiInterviewIndex, setAiInterviewIndex] = useState(0);
    const [aiInterviewAnswers, setAiInterviewAnswers] = useState<Record<string, string>>({});
    const [isExportingFormat, setIsExportingFormat] = useState<"png" | "pdf" | null>(null);

    const handleExportCard = async (format: "png" | "pdf") => {
        if (isExportingFormat) return;
        setIsExportingFormat(format);
        try {
            const name = profileInfo.name || editorName || "MARIEM";
            const payload = {
                baseImageUrl: generatedCardUrl || uploadPreview || cardData.staticBgUrl || "/generator/back.png",
                playerName: name.toUpperCase(),
                subtitle: editorSubtitle || "Zin w bech n3ich",
                rating: overallRating || editorRating || 99,
                position: editorPosition || "VALEUR",
                stats: editorStats,
                badges: editorBadges,
                quoteFr: editorQuoteFr || "Ma voix, mon choix, mon avenir",
                quoteAr: editorQuoteAr || "صوتي، اختياري، مستقبلي",
                hashtags: editorHashtags || ["GENZ_TUNISIA", "ZIN_LIFE", "FOCUS", "VIBES", "BLEDI"],
                description: editorDescription || "Dlel Zin • Charizam • Instagramable • Indépendante",
                accentColor: editorAccentColor || "#E5A500",
                format,
            };

            const res = await fetch("/api/export-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || "Export failed");
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${name.replace(/\s+/g, "_")}_fifa_card.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error("Export error:", err);
            alert(`Export failed: ${err.message || err}`);
        } finally {
            setIsExportingFormat(null);
        }
    };

    // ── 24-Hour Cooldown State ──
    const [cooldownRemainingSeconds, setCooldownRemainingSeconds] = useState<number>(0);
    const [isCooldownActive, setIsCooldownActive] = useState<boolean>(false);

    const formatCooldownTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        setMounted(true);
        // Check 24h rate limit cooldown status on mount
        fetch("/api/generate-card")
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.canGenerate && data.cooldownRemainingSeconds > 0) {
                    setCooldownRemainingSeconds(data.cooldownRemainingSeconds);
                    setIsCooldownActive(true);
                }
            })
            .catch((err) => console.error("Error checking cooldown:", err));
    }, []);

    useEffect(() => {
        if (cooldownRemainingSeconds <= 0) {
            setIsCooldownActive(false);
            return;
        }
        const timer = setInterval(() => {
            setCooldownRemainingSeconds((prev) => {
                if (prev <= 1) {
                    setIsCooldownActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldownRemainingSeconds]);

    // ── LocalStorage Helpers ──
    const LOCAL_STORAGE_KEY_CARD_URL = "fifa_generated_card_url";
    const LOCAL_STORAGE_KEY_CARD_DATA = "fifa_card_editor_state";

    const saveCardToLocalStorage = (imageUrl: string, extraData?: any) => {
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem(LOCAL_STORAGE_KEY_CARD_URL, imageUrl);
                if (extraData) {
                    localStorage.setItem(LOCAL_STORAGE_KEY_CARD_DATA, JSON.stringify(extraData));
                }
            }
        } catch (e) {
            console.warn("Failed to save card to localStorage:", e);
        }
    };

    const loadCardFromLocalStorage = () => {
        try {
            if (typeof window !== "undefined") {
                const savedUrl = localStorage.getItem(LOCAL_STORAGE_KEY_CARD_URL);
                const savedDataStr = localStorage.getItem(LOCAL_STORAGE_KEY_CARD_DATA);
                let savedData = null;
                if (savedDataStr) {
                    savedData = JSON.parse(savedDataStr);
                }
                return { savedUrl, savedData };
            }
        } catch (e) {
            console.warn("Failed to load card from localStorage:", e);
        }
        return { savedUrl: null, savedData: null };
    };

    const [showCooldownModal, setShowCooldownModal] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        // Restore saved card image & details from localStorage if present
        const { savedUrl, savedData } = loadCardFromLocalStorage();
        if (savedUrl) {
            setGeneratedCardUrl(savedUrl);
            setEditorBgUrl(savedUrl);
            if (savedData) {
                if (savedData.editorName) setEditorName(savedData.editorName);
                if (savedData.editorSubtitle) setEditorSubtitle(savedData.editorSubtitle);
                if (savedData.editorPosition) setEditorPosition(savedData.editorPosition);
                if (savedData.editorRating) setEditorRating(savedData.editorRating);
                if (savedData.editorStats) setEditorStats(savedData.editorStats);
                if (savedData.editorDescription) setEditorDescription(savedData.editorDescription);
            }
        }
    }, []);

    // ── Unlock Cooldown via Social Sharing ──
    const handleUnlockByShare = async (platformName?: string) => {
        try {
            const res = await fetch("/api/generate-card", { method: "DELETE" });
            if (res.ok) {
                setIsCooldownActive(false);
                setCooldownRemainingSeconds(0);
                setGenerationError(null);
                setShowCooldownModal(false);
            }
        } catch (err) {
            console.error("Unlock error:", err);
        }
    };

    // Auto-download the card image as a PNG file
    const downloadCardImage = () => {
        const cardImg = generatedCardUrl || uploadPreview;
        if (!cardImg) return;
        const a = document.createElement("a");
        a.href = cardImg;
        a.download = "my_fifa_card.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    // Wait for a popup window to close, then call the unlock
    const waitForPopupClose = (popup: Window | null, platformName: string) => {
        if (!popup) {
            // Popup blocked — unlock immediately as fallback
            handleUnlockByShare(platformName);
            return;
        }
        const checkInterval = setInterval(() => {
            try {
                if (popup.closed) {
                    clearInterval(checkInterval);
                    handleUnlockByShare(platformName);
                }
            } catch {
                clearInterval(checkInterval);
                handleUnlockByShare(platformName);
            }
        }, 1000);
        // Safety timeout: auto-unlock after 5 minutes if user never closes
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 5 * 60 * 1000);
    };

    const handleShareSocial = async (platform: "whatsapp" | "twitter" | "facebook" | "instagram" | "native" | "copy") => {
        const shareText = "Check out my legendary AI FIFA card! ⚽🔥";
        const shareUrl = typeof window !== "undefined" ? window.location.href : "https://fifacard.app";
        const cardImg = generatedCardUrl || uploadPreview;

        // ── Native File Sharing (mobile — best experience) ──
        if (cardImg && typeof navigator !== "undefined" && navigator.share) {
            try {
                const res = await fetch(cardImg);
                const blob = await res.blob();
                const file = new File([blob], "my_fifa_card.png", { type: "image/png" });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: "My Legendary FIFA Card",
                        text: shareText,
                        files: [file],
                    });
                    // navigator.share only resolves if user actually shared (rejects on cancel)
                    await handleUnlockByShare("Social Media");
                    return;
                }
            } catch (e: any) {
                // User cancelled the native share — do NOT unlock
                if (e?.name === "AbortError") {
                    console.log("User cancelled native share");
                    return;
                }
                console.log("Native file share fallback:", e);
            }
        }

        // ── Desktop / Fallback: open popup and track close ──
        // Always auto-download the card image so user has it ready to attach
        downloadCardImage();

        let popup: Window | null = null;

        if (platform === "whatsapp") {
            popup = window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
            waitForPopupClose(popup, "WhatsApp");
        } else if (platform === "twitter") {
            popup = window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
            waitForPopupClose(popup, "X / Twitter");
        } else if (platform === "facebook") {
            popup = window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
            waitForPopupClose(popup, "Facebook");
        } else if (platform === "instagram") {
            // Instagram has no web share API — download image + open Instagram
            popup = window.open("https://www.instagram.com/", "_blank");
            waitForPopupClose(popup, "Instagram");
        } else if (platform === "copy") {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
            }
            await handleUnlockByShare("Copy Link");
        }
    };

    // ── Direct step flow ──
    const getStepsForMode = (_mode: CardMode): Step[] => {
        return ["upload", "profile", "stats-pick", "stats-values", "review", "checkout"];
    };

    const activeSteps = getStepsForMode(cardData.mode);
    const STEPS = ALL_STEPS.filter((s) => activeSteps.includes(s.id));

    // ── Derived ──
    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
    const totalSteps = STEPS.length;
    const isPersonalityDone = personalityIndex >= PERSONALITY_QUESTIONS.length;
    const personalityProgress = Math.min(
        (personalityIndex / PERSONALITY_QUESTIONS.length) * 100,
        100
    );

    // ── Handlers ──
    const updateCardData = (key: keyof CardData, value: any) => {
        setCardData((prev) => ({ ...prev, [key]: value }));
    };

    const updatePersonality = (key: keyof PersonalityAnswers, value: any) => {
        setCardData((prev) => ({
            ...prev,
            personality: { ...prev.personality, [key]: value },
        }));
    };

    const goToNextStep = () => {
        const nextIdx = currentStepIndex + 1;
        if (nextIdx < totalSteps) {
            const nextStep = STEPS[nextIdx].id;
            if (nextStep === "personality") {
                setPersonalityIndex(0);
            }
            setCurrentStep(nextStep);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const goToPreviousStep = () => {
        const prevIdx = currentStepIndex - 1;
        if (prevIdx >= 0) {
            const prevStep = STEPS[prevIdx].id;
            if (prevStep === "personality") {
                setPersonalityIndex(PERSONALITY_QUESTIONS.length - 1);
            }
            setCurrentStep(prevStep);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePersonalityNext = () => {
        const currentQ = PERSONALITY_QUESTIONS[personalityIndex];
        const key = currentQ.id as keyof PersonalityAnswers;
        const val = cardData.personality[key];

        // Check if answered
        if (currentQ.multi) {
            if (!val || (Array.isArray(val) && val.length === 0)) return;
        } else {
            if (!val) return;
        }

        if (personalityIndex < PERSONALITY_QUESTIONS.length - 1) {
            setPersonalityIndex(personalityIndex + 1);
        } else {
            // All personality questions done → go to AI
            setCurrentStep("ai");
            startAIGeneration();
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePersonalityBack = () => {
        if (personalityIndex > 0) {
            setPersonalityIndex(personalityIndex - 1);
        } else {
            goToPreviousStep();
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const startAIGeneration = async () => {
        setIsGenerating(true);
        setGenerationProgress(0);
        setRevealCard(false);
        setShowConfetti(false);
        setGenerationError(null);
        setGeneratedCardUrl(null);

        // Simulated progress steps during the actual network call
        let progressVal = 0;
        const progressInterval = setInterval(() => {
            if (progressVal < 90) {
                progressVal += Math.random() * 6 + 2;
                setGenerationProgress(Math.min(Math.round(progressVal), 95));
            }
        }, 800);

        try {
            // Step 1: Call AI to analyze interview answers and pick stats
            const aiCardResponse = await fetch("/api/generate-ai-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answers: aiInterviewAnswers,
                    photo: uploadPreview,
                }),
            });

            const aiCardData = await aiCardResponse.json();

            if (!aiCardResponse.ok) {
                throw new Error(aiCardData.error || "Failed to generate AI card data");
            }

            // Apply AI-selected stats to the editor
            const aiStats: CardStat[] = (aiCardData.stats || []).map((s: { code: string; value: number }) => ({
                label: s.code,
                value: s.value,
            }));
            setEditorStats(aiStats);
            setEditorRating(aiCardData.overall || calculateOverall(aiCardData.stats || []));
            setOverallRating(aiCardData.overall || calculateOverall(aiCardData.stats || []));
            setEditorName(aiCardData.cardTitle || profileInfo.name || "LEGEND");
            setEditorSubtitle(aiCardData.bio || "Born to be legendary");
            setEditorPosition(aiCardData.position || "GOAT");
            if (aiCardData.description) setEditorDescription(aiCardData.description);

            // Step 2: Generate AI card image
            const bgResponse = await fetch("/api/generate-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    photo: uploadPreview,
                    cardData: {
                        ...cardData,
                        answers: aiInterviewAnswers,
                        position: aiCardData.position,
                    },
                    overallRating: aiCardData.overall || 85,
                    profileInfo: profileInfo,
                    stats: aiStats,
                    freeDescription: aiCardData.bio || "",
                }),
            });

            const bgData = await bgResponse.json();
            clearInterval(progressInterval);

            if (!bgResponse.ok) {
                if (bgResponse.status === 429 || bgData.cooldownRemainingSeconds) {
                    setCooldownRemainingSeconds(bgData.cooldownRemainingSeconds || 86400);
                    setIsCooldownActive(true);
                }
                throw new Error(bgData.error || "Failed to generate card background");
            }

            setGeneratedCardUrl(bgData.imageUrl);
            setEditorBgUrl(bgData.imageUrl);
            saveCardToLocalStorage(bgData.imageUrl, {
                editorName: aiCardData.cardTitle || profileInfo.name || "LEGEND",
                editorSubtitle: aiCardData.bio || "Born to be legendary",
                editorPosition: aiCardData.position || "GOAT",
                editorRating: aiCardData.overall || calculateOverall(aiCardData.stats || []),
                editorStats: aiStats,
                editorDescription: aiCardData.description,
            });
            setGenerationProgress(100);
            setIsGenerating(false);
            setRevealCard(true);
            setShowConfetti(true);

            setTimeout(() => {
                setCurrentStep("review");
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 3000);

        } catch (err: any) {
            clearInterval(progressInterval);
            setIsGenerating(false);
            setGenerationError(err.message || "Failed to generate card using AI.");
        }
    };

    // ── Apply manual stats to editor (Describe Yourself mode) ──
    const applyManualStatsToEditor = () => {
        const manualStats: CardStat[] = selectedStatCodes.map((code) => ({
            label: code,
            value: statValues[code] || 75,
        }));
        setEditorStats(manualStats);
        const overall = calculateOverall(
            selectedStatCodes.map((code) => ({ code, value: statValues[code] || 75 }))
        );
        setOverallRating(overall);
        setEditorRating(overall);
        setEditorName(profileInfo.name || "LEGEND");
        setEditorSubtitle(profileInfo.description || "Born to be legendary");
        const descParts = selectedStatCodes.map((code) => {
            const stat = getStatByCode(code);
            return stat ? stat.meaning : code;
        });
        setEditorDescription(descParts.slice(0, 4).join(" • "));
    };

    // ── Generate AI background for the editor ──
    const startHybridBgGeneration = async () => {
        if (!uploadPreview) return;
        setIsGeneratingBg(true);

        try {
            const response = await fetch("/api/generate-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    photo: uploadPreview,
                    cardData,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to generate background");

            setEditorBgUrl(data.imageUrl);
        } catch (err: any) {
            console.error("Background generation failed:", err);
        } finally {
            setIsGeneratingBg(false);
        }
    };



    const compressImage = (dataUrl: string, maxW = 600, maxH = 600): Promise<string> => {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > maxW) {
                        height = Math.round((height * maxW) / width);
                        width = maxW;
                    }
                } else {
                    if (height > maxH) {
                        width = Math.round((width * maxH) / height);
                        height = maxH;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", 0.82));
                } else {
                    resolve(dataUrl);
                }
            };
            img.onerror = () => resolve(dataUrl);
            img.src = dataUrl;
        });
    };

    const handleFileUpload = (file: File) => {
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const rawDataUrl = e.target?.result as string;
            const compressed = await compressImage(rawDataUrl, 512, 512);
            setUploadPreview(compressed);
            updateCardData("photo", compressed);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            handleFileUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const getMoodIcon = (mood: Mood) => {
        switch (mood) {
            case "funny": return Smile;
            case "serious": return Trophy;
            case "mixed": return Scale;
            case "savage": return Flame;
            case "wholesome": return Heart;
            default: return Target;
        }
    };

    // ── Render Helpers ──

    const renderStepIndicator = () => {
        if (currentStep === "ai") return null;
        if (currentStep === "checkout") return null;
        const label = STEPS.find((s) => s.id === currentStep)?.label || "";
        return (
            <div className="flex items-center gap-3 text-sm text-gray-500 font-space">
                <span className="text-[#C98600] font-semibold">
                    {currentStepIndex + 1}
                </span>
                <span className="text-gray-300">—</span>
                <span>{label}</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-400">{totalSteps} steps</span>
            </div>
        );
    };

    const renderBackButton = () => {
        if (currentStep === "checkout") return null;
        if (currentStep === "mode") return null;
        if (currentStep === "ai") return null;
        return (
            <button
                onClick={handlePersonalityBack}
                className="flex items-center gap-2 text-gray-400 hover:text-[#F6D365] transition-colors duration-300 font-space text-sm cursor-pointer font-bold"
            >
                ← رجوع (Back)
            </button>
        );
    };

    const renderNextButton = (disabled = false, label = "مواصلة →") => {
        if (currentStep === "checkout") return null;
        if (currentStep === "ai") return null;
        
        const isReview = currentStep === "review";
        const onClickHandler = isReview
            ? () => setCurrentStep("checkout")
            : currentStep === "personality"
            ? handlePersonalityNext
            : goToNextStep;

        return (
            <button
                onClick={onClickHandler}
                disabled={disabled}
                className={`group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black font-space text-lg shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer ${
                    disabled ? "opacity-40 pointer-events-none" : ""
                }`}
            >
                <span className="relative z-10 flex items-center gap-2">
                    {isReview ? "اطلب كارتتك الآن 🚀" : label}
                </span>
            </button>
        );
    };

    // ── Screen Renderers ──

    const renderMode = () => {
        const options: { id: CardMode; label: string; desc: string; icon: React.ComponentType<any>; features: string[] }[] = [
            {
                id: "describe",
                label: "صمّم كارتتك يدويّاً (Describe Yourself)",
                desc: "اكتب معلوماتك، اختر 6 ستاتيكس تونسية مضحكة، وحدّد قيمك الخاصة.",
                icon: PenTool,
                features: [
                    "إدخال البيانات والصورة الخاصة",
                    "اختيار 6 ستاتيكس من بين أكثر من 50 ستات تونسي",
                    "تعديل قيم الستاتيكس (1–99) حسب اختيارك",
                    "حساب تلقائي للـ Overall rating",
                    "تعديل كامل ومراجعة قبل الطباعة",
                ],
            },
            {
                id: "ai-describe",
                label: "دع الذكاء الاصطناعي يصمّم لك (Let AI Describe You)",
                desc: "أجب عن أسئلة مضحكة ودع الـ AI يبني كارتتك الأسطورية.",
                icon: Wand2,
                features: [
                    "الـ AI يختار أفضل 6 ستاتيكس تناسبك",
                    "ستاتيكس وتوصيف مخصّص تلقائيّاً",
                    "تصميم خلفية وأسلوب يتماشى مع شخصيتك",
                    "إمكانية التعديل والتخصيص الكامل بعد الإنشاء",
                ],
            },
        ];

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10"
            >
                <div className="space-y-3" dir="rtl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                        اختر طريقة <br />
                        <span className="text-gold-grad">
                            تصميم كارتتك الأسطورية
                        </span>
                    </h1>
                    <p className="text-gray-300 font-space text-base max-w-md">
                        حدد الطريقة التي تفضلها لبناء كارتتك المضحكة والفاخرة.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {options.map((opt) => {
                        const IconComponent = opt.icon;
                        const isSelected = cardData.mode === opt.id;
                        return (
                            <motion.button
                                key={opt.id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    updateCardData("mode", opt.id);
                                    setTimeout(goToNextStep, 300);
                                }}
                                className={`relative p-7 rounded-3xl border backdrop-blur-xl transition-all duration-300 text-right cursor-pointer ${
                                    isSelected
                                        ? "border-[#D4AF37] bg-black/90 shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
                                        : "border-white/10 bg-black/60 hover:border-[#D4AF37]/50 hover:bg-black/80 shadow-xl"
                                }`}
                                dir="rtl"
                            >
                                <div className={`mb-4 inline-flex p-3 rounded-2xl ${isSelected ? "bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F6D365]" : "bg-white/5 border border-white/10 text-gray-400"}`}>
                                    <IconComponent className="w-8 h-8 stroke-[1.75]" />
                                </div>
                                <div className="font-bold text-xl mb-2 text-white">
                                    {opt.label}
                                </div>
                                <div className="text-gray-300 font-space text-sm mb-5 leading-relaxed">
                                    {opt.desc}
                                </div>
                                <ul className="space-y-2 border-t border-white/10 pt-4">
                                    {opt.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-xs text-gray-300 font-space font-medium">
                                            <Check className="w-4 h-4 text-[#F6D365] stroke-[2.5] flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                {isSelected && (
                                    <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-[#F6D365] shadow-[0_0_12px_rgba(246,211,101,0.8)]" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    const renderRecipient = () => {
        const options: { id: Recipient; label: string; icon: React.ComponentType<any> }[] = [
            { id: "friend", label: "A Friend", icon: Gift },
            { id: "myself", label: "Myself", icon: User },
            { id: "partner", label: "My Partner", icon: Heart },
            { id: "family", label: "Family", icon: Users },
            { id: "colleague", label: "Colleague", icon: Briefcase },
        ];

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10"
            >
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold font-sora text-gray-900 leading-[1.1]">
                        Who is this <br />
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            card for?
                        </span>
                    </h1>
                    <p className="text-gray-600 font-space text-base max-w-md">
                        Choose the legend you're about to create.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {options.map((opt) => {
                        const IconComponent = opt.icon;
                        const isSelected = cardData.recipient === opt.id;
                        return (
                            <motion.button
                                key={opt.id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    updateCardData("recipient", opt.id);
                                    setTimeout(goToNextStep, 300);
                                }}
                                className={`relative p-5 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                                    isSelected
                                        ? "border-[#E5A500] bg-[#E5A500]/8 shadow-[0_4px_20px_rgba(229,165,0,0.12)]"
                                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 shadow-sm"
                                }`}
                            >
                                <div className={`mb-3 ${isSelected ? "text-[#C98600]" : "text-gray-400"}`}>
                                    <IconComponent className="w-8 h-8 stroke-[1.5]" />
                                </div>
                                <div className={`font-space font-semibold text-sm ${isSelected ? "text-[#C98600]" : "text-gray-800"}`}>
                                    {opt.label}
                                </div>
                                {isSelected && (
                                    <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#E5A500] shadow-[0_0_8px_rgba(229,165,0,0.6)]" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>
        );
    };

    const renderMood = () => {
        const options: { id: Mood; label: string; icon: React.ComponentType<any>; color: string }[] = [
            { id: "funny", label: "Funny", icon: Smile, color: "#D97706" },
            { id: "serious", label: "Serious", icon: Trophy, color: "#2563EB" },
            { id: "mixed", label: "Mixed", icon: Scale, color: "#7C3AED" },
            { id: "savage", label: "Savage", icon: Flame, color: "#DC2626" },
            { id: "wholesome", label: "Wholesome", icon: Heart, color: "#059669" },
        ];

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10"
            >
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold font-sora text-gray-900 leading-[1.1]">
                        Choose the <br />
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            mood
                        </span>
                    </h1>
                    <p className="text-gray-600 font-space text-base max-w-md">
                        Set the vibe for this legendary card.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {options.map((opt) => {
                        const IconComponent = opt.icon;
                        const isSelected = cardData.mood === opt.id;
                        return (
                            <motion.button
                                key={opt.id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    updateCardData("mood", opt.id);
                                    setTimeout(goToNextStep, 300);
                                }}
                                className={`relative p-5 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                                    isSelected
                                        ? "border-[#E5A500] bg-[#E5A500]/8 shadow-[0_4px_20px_rgba(229,165,0,0.12)]"
                                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 shadow-sm"
                                }`}
                            >
                                <div className="mb-3" style={{ color: opt.color }}>
                                    <IconComponent className="w-8 h-8 stroke-[1.5]" />
                                </div>
                                <div
                                    className="font-space font-semibold text-sm"
                                    style={{ color: isSelected ? opt.color : "#1F2937" }}
                                >
                                    {opt.label}
                                </div>
                                {isSelected && (
                                    <div
                                        className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full shadow-sm"
                                        style={{ backgroundColor: opt.color }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>
        );
    };


    const renderUpload = () => {
        const isUploaded = !!uploadPreview;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10"
            >
                <div className="space-y-3" dir="rtl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                        ارفع صورة <br />
                        <span className="text-gold-grad">
                            الأسطورة (Upload Photo)
                        </span>
                    </h1>
                    <p className="text-gray-300 font-space text-base max-w-md">
                        اختر صورة واضحة للشخص ليتم معالجتها وطباعتها على الكارطة.
                    </p>
                </div>

                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-3xl border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-xl ${isDragging
                        ? "border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_10px_30px_rgba(212,175,55,0.25)]"
                        : isUploaded
                            ? "border-[#D4AF37]/50 bg-black/90 shadow-2xl"
                            : "border-white/20 bg-black/70 hover:border-[#D4AF37]/60 hover:bg-black/90 shadow-xl"
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                    />

                    <div className="aspect-[4/3] flex items-center justify-center p-8">
                        {isUploaded ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10"
                            >
                                <Image
                                    src={uploadPreview!}
                                    alt="Uploaded"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm font-space">
                                    <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/40 flex items-center gap-1.5 text-xs font-bold text-[#F6D365]">
                                        <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> الصورة جاهزة
                                    </span>
                                    <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/40 flex items-center gap-1.5 text-xs font-bold text-[#F6D365]">
                                        <Sparkles className="w-4 h-4 text-[#F6D365] fill-[#F6D365]" /> جاهز للتصميم
                                    </span>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center space-y-4" dir="rtl">
                                <div className="mx-auto w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#F6D365]">
                                    <ImagePlus className="w-7 h-7 stroke-[1.75]" />
                                </div>
                                <div className="text-white font-bold text-xl">
                                    اسحب الصّورة هنا أو اضغط للاختيار
                                </div>
                                <div className="text-gray-400 font-space text-xs">
                                    صيغ المتمثلة: PNG, JPG, WEBP (صورة واضحة تضمن أفضل طباعة)
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isUploaded && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end"
                    >
                        {renderNextButton(false, "مواصلة →")}
                    </motion.div>
                )}
            </motion.div>
        );
    };

    const renderDescribe = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10"
            >
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold font-sora text-gray-900 leading-[1.1]">
                        Describe the{" "}
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            legend
                        </span>
                    </h1>
                    <p className="text-gray-600 font-space text-base max-w-md">
                        Tell us about this person — name, personality, what makes them unique. The more you share, the better the card.
                    </p>
                </div>

                <div className="space-y-3">
                    <textarea
                        value={freeDescription}
                        onChange={(e) => setFreeDescription(e.target.value)}
                        placeholder={"e.g. Ahmed, my best friend, loves football and gaming, always 15 min late, the funniest guy in our group, his weakness is sleeping too much, we call him The Legend..."}
                        maxLength={500}
                        rows={6}
                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-space focus:outline-none focus:border-[#E5A500] focus:ring-2 focus:ring-[#E5A500]/10 transition-all duration-200 placeholder:text-gray-400 resize-none"
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-space">
                            {freeDescription.length}/500 characters
                        </span>
                        <span className="text-xs text-gray-400 font-space">
                            Missing info? No worries — you can edit everything later.
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    {renderBackButton()}
                    <button
                        onClick={() => {
                            setCurrentStep("ai");
                            startAIGeneration();
                        }}
                        disabled={!freeDescription.trim()}
                        className={`group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5A500] to-[#C98600] text-white font-bold font-space text-lg shadow-[0_4px_16px_rgba(229,165,0,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer ${
                            !freeDescription.trim() ? "opacity-40 pointer-events-none" : ""
                        }`}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Generate Card
                            <Sparkles className="w-5 h-5" />
                        </span>
                        <div className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity duration-300" />
                    </button>
                </div>
            </motion.div>
        );
    };

    // ── NEW: Describe Yourself — Phase 1: Profile Info ──
    const renderProfile = () => {
        const isReady = profileInfo.name.trim().length > 0;
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8"
            >
                <div className="space-y-3" dir="rtl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                        المعلومات <span className="text-gold-grad">الشخصية (Profile Info)</span>
                    </h1>
                    <p className="text-gray-300 font-space text-base max-w-md">
                        اكتب اسمك وهواياتك — ستظهر هذه البيانات على كارتتك الأسطورية.
                    </p>
                </div>

                <div className="space-y-5" dir="rtl">
                    {/* Name */}
                    <div>
                        <label className="text-sm font-space font-bold text-white mb-2 block">الاسم واللقب (Name on Card) *</label>
                        <input
                            type="text"
                            value={profileInfo.name}
                            onChange={(e) => setProfileInfo((p) => ({ ...p, name: e.target.value }))}
                            placeholder="مثال: أحمد، مريم، كريم..."
                            maxLength={30}
                            className="w-full px-5 py-4 rounded-2xl border border-white/15 bg-black/70 text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Age + Gender row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-space font-bold text-white mb-2 block">العمر (Age)</label>
                            <input
                                type="number"
                                value={profileInfo.age}
                                onChange={(e) => setProfileInfo((p) => ({ ...p, age: e.target.value }))}
                                placeholder="مثال: 24"
                                min={1}
                                max={99}
                                className="w-full px-5 py-4 rounded-2xl border border-white/15 bg-black/70 text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-space font-bold text-white mb-2 block">النوع (Gender)</label>
                            <div className="flex gap-2">
                                {(["male", "female"] as const).map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setProfileInfo((p) => ({ ...p, gender: g }))}
                                        className={`flex-1 py-4 rounded-2xl border text-sm font-space font-bold transition-all duration-200 cursor-pointer ${
                                            profileInfo.gender === g
                                                ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#F6D365] shadow-lg shadow-[#D4AF37]/10"
                                                : "border-white/15 bg-black/60 text-gray-300 hover:border-white/30"
                                        }`}
                                    >
                                        {g === "male" ? "♂ ذكر" : "♀ أنثى"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hobbies — Interactive Chips & Custom Input */}
                    <div>
                        <label className="text-sm font-space font-bold text-white mb-2 block">
                            الهوايات والاهتمامات (Hobbies & Passions)
                        </label>
                        
                        {/* Selected Hobbies Pills */}
                        {Array.isArray(profileInfo.hobbies) && profileInfo.hobbies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {profileInfo.hobbies.map((hobby) => (
                                    <span
                                        key={hobby}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 text-[#F6D365] border border-[#D4AF37]/40 text-xs font-space font-bold"
                                    >
                                        {hobby}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setProfileInfo((p) => ({
                                                    ...p,
                                                    hobbies: (Array.isArray(p.hobbies) ? p.hobbies : []).filter((h) => h !== hobby),
                                                }))
                                            }
                                            className="hover:text-red-400 font-bold ml-1"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Preset Chips */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {[
                                { label: "⚽ كورة (Football)", val: "Football" },
                                { label: "🎮 جيمنغ (Gaming)", val: "Gaming" },
                                { label: "☕ قهوة ديركت (Kahwa)", val: "Kahwa Direct" },
                                { label: "🚗 كراهب وكورصا (Cars)", val: "Cars" },
                                { label: "🏋️ جيم وقصّة (Gym)", val: "Gym" },
                                { label: "🎵 مزيكا (Music)", val: "Music" },
                                { label: "🎣 صيّادة (Fishing)", val: "Fishing" },
                                { label: "📸 تصوير (Photography)", val: "Photography" },
                                { label: "✈️ سفر (Travel)", val: "Travel" },
                                { label: "💻 كودينغ (Coding)", val: "Coding" },
                            ].map((preset) => {
                                const currentHobbies = Array.isArray(profileInfo.hobbies) ? profileInfo.hobbies : [];
                                const isSelected = currentHobbies.includes(preset.val);
                                return (
                                    <button
                                        key={preset.val}
                                        type="button"
                                        onClick={() => {
                                            setProfileInfo((p) => {
                                                const list = Array.isArray(p.hobbies) ? p.hobbies : [];
                                                const next = isSelected
                                                    ? list.filter((h) => h !== preset.val)
                                                    : [...list, preset.val];
                                                return { ...p, hobbies: next };
                                            });
                                        }}
                                        className={`px-3.5 py-2 rounded-xl border text-xs font-space font-bold transition-all cursor-pointer ${
                                            isSelected
                                                ? "border-[#D4AF37] bg-[#D4AF37] text-black shadow-md"
                                                : "border-white/15 bg-black/60 text-gray-300 hover:border-white/30"
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Custom Hobby Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customHobbyInput}
                                onChange={(e) => setCustomHobbyInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        const trimmed = customHobbyInput.trim();
                                        if (trimmed) {
                                            setProfileInfo((p) => {
                                                const list = Array.isArray(p.hobbies) ? p.hobbies : [];
                                                if (!list.includes(trimmed)) {
                                                    return { ...p, hobbies: [...list, trimmed] };
                                                }
                                                return p;
                                            });
                                            setCustomHobbyInput("");
                                        }
                                    }
                                }}
                                placeholder="أضف هواية أخرى (مثال: شطرنج، سينما...)..."
                                className="flex-1 px-4 py-3 rounded-xl border border-white/15 bg-black/70 text-xs text-white font-space focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const trimmed = customHobbyInput.trim();
                                    if (trimmed) {
                                        setProfileInfo((p) => {
                                            const list = Array.isArray(p.hobbies) ? p.hobbies : [];
                                            if (!list.includes(trimmed)) {
                                                return { ...p, hobbies: [...list, trimmed] };
                                            }
                                            return p;
                                        });
                                        setCustomHobbyInput("");
                                    }
                                }}
                                className="px-5 py-3 rounded-xl bg-[#D4AF37] text-black text-xs font-space font-bold hover:bg-[#F6D365] transition"
                            >
                                + أضف
                            </button>
                        </div>
                    </div>

                    {/* Custom Text & Design Specifications Field */}
                    <div>
                        <label className="text-sm font-space font-bold text-white mb-2 block">
                            جمل وملاحظات خاصة على الكارطة (Custom Text / Design Notes)
                        </label>
                        <textarea
                            value={profileInfo.designNotes}
                            onChange={(e) => setProfileInfo((p) => ({ ...p, designNotes: e.target.value }))}
                            placeholder="مثال: جملة تونسية مضحكة تحب نكتبوها، لقب خاص (THE KING OF CARS)، خلفية معينة..."
                            maxLength={150}
                            rows={2}
                            className="w-full px-5 py-3.5 rounded-2xl border border-white/15 bg-black/70 text-sm text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-400 resize-none"
                        />
                        <span className="text-xs text-gray-400 font-space mt-1 block">{profileInfo.designNotes.length}/150</span>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-space font-bold text-white mb-2 block">توصيف أو سيرة سريعة (Short Bio)</label>
                        <textarea
                            value={profileInfo.description}
                            onChange={(e) => setProfileInfo((p) => ({ ...p, description: e.target.value }))}
                            placeholder="شنوّة أكثر حاجة تميّزك وتخليك أسطورة؟ (مثال: ديما يسألوه وينك، أستاذ في التكتاك...)"
                            maxLength={200}
                            rows={3}
                            className="w-full px-5 py-3.5 rounded-2xl border border-white/15 bg-black/70 text-sm text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-400 resize-none"
                        />
                        <span className="text-xs text-gray-400 font-space mt-1 block">{profileInfo.description.length}/200</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    {renderBackButton()}
                    {renderNextButton(!isReady, "مواصلة →")}
                </div>
            </motion.div>
        );
    };

    // ── NEW: Describe Yourself — Phase 2: Pick 6 Stats ──
    const renderStatsPick = () => {
        const isReady = selectedStatCodes.length === 6;
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8"
            >
                <div className="space-y-3" dir="rtl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                        اختار الـ <span className="text-gold-grad">6 ستاتيكس متاعك (Pick 6 Stats)</span>
                    </h1>
                    <p className="text-gray-300 font-space text-base max-w-md">
                        اختار 6 ستاتيكس تونسية توصف صاحبك ولاّ توصفك أنت <span className="text-[#F6D365] font-bold">avec ses défauts</span>.
                    </p>
                </div>

                <TunisiaStatPicker
                    selected={selectedStatCodes}
                    onSelectionChange={(codes) => {
                        setSelectedStatCodes(codes);
                        // Initialize values for newly selected stats
                        const newValues = { ...statValues };
                        codes.forEach((code) => {
                            if (!(code in newValues)) {
                                newValues[code] = 75;
                            }
                        });
                        // Remove deselected stats
                        Object.keys(newValues).forEach((code) => {
                            if (!codes.includes(code)) {
                                delete newValues[code];
                            }
                        });
                        setStatValues(newValues);
                    }}
                    maxSelection={6}
                />

                <div className="flex items-center justify-between pt-4">
                    {renderBackButton()}
                    {renderNextButton(!isReady, "حدّد القيم (Stat Values) →")}
                </div>
            </motion.div>
        );
    };

    // ── AI Card Generation for Describe Yourself Mode ──
    const startDescribeAIGeneration = async () => {
        applyManualStatsToEditor();
        setCurrentStep("ai");
        setIsGenerating(true);
        setGenerationProgress(0);
        setRevealCard(false);
        setShowConfetti(false);
        setGenerationError(null);
        setGeneratedCardUrl(null);

        let progressVal = 0;
        const progressInterval = setInterval(() => {
            if (progressVal < 90) {
                progressVal += Math.random() * 6 + 2;
                setGenerationProgress(Math.min(Math.round(progressVal), 95));
            }
        }, 800);

        try {
            const formattedStats = selectedStatCodes.map((code) => ({
                code,
                value: statValues[code] || 75,
            }));
            const overall = calculateOverall(formattedStats);

            const response = await fetch("/api/generate-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    photo: uploadPreview,
                    profileInfo,
                    stats: formattedStats,
                    overallRating: overall,
                    mode: "full-ai",
                }),
            });

            const data = await response.json();
            clearInterval(progressInterval);

            if (!response.ok) {
                if (response.status === 429 || data.cooldownRemainingSeconds) {
                    setCooldownRemainingSeconds(data.cooldownRemainingSeconds || 86400);
                    setIsCooldownActive(true);
                }
                throw new Error(data.error || "Failed to generate card");
            }

            setGeneratedCardUrl(data.imageUrl);
            setEditorBgUrl(data.imageUrl);
            saveCardToLocalStorage(data.imageUrl, {
                editorName: profileInfo.name || "LEGEND",
                editorSubtitle: "Born to be legendary",
                editorPosition: "GOAT",
                editorRating: overall,
                editorStats: formattedStats,
            });
            setGenerationProgress(100);
            setIsGenerating(false);
            setRevealCard(true);
            setShowConfetti(true);

            setTimeout(() => {
                setCurrentStep("review");
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 3000);
        } catch (err: any) {
            clearInterval(progressInterval);
            setIsGenerating(false);
            setGenerationError(err.message || "Failed to generate card using AI.");
        }
    };

    // ── NEW: Describe Yourself — Phase 3: Set Stat Values + Overall ──
    const renderStatsValues = () => {
        const currentOverall = calculateOverall(
            selectedStatCodes.map((code) => ({ code, value: statValues[code] || 75 }))
        );

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8"
            >
                <div className="space-y-3" dir="rtl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                        حدّد قيم <span className="text-gold-grad">الستاتيكس (Rate your Stats)</span>
                    </h1>
                    <p className="text-gray-300 font-space text-base max-w-md">
                        بدّل القيم من 1 حتى لـ 99. الـ Overall Rating يتحسب أوتوماتيكيّاً.
                    </p>
                </div>

                {/* Overall badge */}
                <div className="flex items-center justify-center">
                    <motion.div
                        key={currentOverall}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center gap-1 px-10 py-6 rounded-3xl bg-black/90 border-2 border-[#D4AF37] shadow-[0_10px_35px_rgba(212,175,55,0.25)] backdrop-blur-2xl"
                    >
                        <span className="text-5xl font-black text-[#F6D365] font-sora leading-none">{currentOverall}</span>
                        <span className="text-xs font-bold text-gray-300 uppercase font-space tracking-widest mt-1">OVERALL RATING</span>
                    </motion.div>
                </div>

                {/* Stat sliders */}
                <div className="space-y-5" dir="rtl">
                    {selectedStatCodes.map((code) => {
                        const stat = getStatByCode(code);
                        if (!stat) return null;
                        const val = statValues[code] || 75;
                        return (
                            <div key={code} className="space-y-2 rounded-2xl border border-white/10 bg-black/70 p-4 backdrop-blur-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{stat.emoji}</span>
                                        <span className="font-space font-bold text-base text-[#F6D365]">{stat.code}</span>
                                        <span className="font-space text-xs text-gray-300">— {stat.meaning}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={val}
                                            onChange={(e) => {
                                                const v = Math.max(1, Math.min(99, parseInt(e.target.value) || 1));
                                                setStatValues((prev) => ({ ...prev, [code]: v }));
                                            }}
                                            min={1}
                                            max={99}
                                            className="w-16 px-2 py-1.5 rounded-xl border border-white/15 bg-black text-center text-sm font-black text-[#F6D365] font-space focus:outline-none focus:border-[#D4AF37]"
                                        />
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={99}
                                    value={val}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setStatValues((prev) => ({ ...prev, [code]: v }));
                                    }}
                                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${
                                            ((val - 1) / (98)) * 100
                                        }%, rgba(255,255,255,0.15) ${((val - 1) / (98)) * 100}%, rgba(255,255,255,0.15) 100%)`,
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between pt-4">
                    {renderBackButton()}
                    <button
                        onClick={startDescribeAIGeneration}
                        className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black font-space text-lg shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            إنشاء الكارطة (Générer la Carte) ✨
                        </span>
                    </button>
                </div>
            </motion.div>
        );
    };

    // ── NEW: Let AI Describe You — Interactive Q&A ──
    const renderAiInterview = () => {
        const q = AI_INTERVIEW_QUESTIONS[aiInterviewIndex];
        if (!q) return null;

        const currentAnswer = aiInterviewAnswers[q.id] || null;
        const isAnswered = currentAnswer !== null;
        const interviewProgress = Math.min(
            ((aiInterviewIndex + (isAnswered ? 1 : 0)) / AI_INTERVIEW_QUESTIONS.length) * 100,
            100
        );

        const handleSelect = (opt: string) => {
            setAiInterviewAnswers((prev) => ({ ...prev, [q.id]: opt }));
        };

        const handleNext = () => {
            if (!isAnswered) return;
            if (aiInterviewIndex < AI_INTERVIEW_QUESTIONS.length - 1) {
                setAiInterviewIndex(aiInterviewIndex + 1);
            } else {
                // All questions answered → start AI generation
                setCurrentStep("ai");
                startAIGeneration();
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        const handleBack = () => {
            if (aiInterviewIndex > 0) {
                setAiInterviewIndex(aiInterviewIndex - 1);
            } else {
                goToPreviousStep();
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-space">
                        <span className="text-[#C98600] font-semibold">
                            {aiInterviewIndex + 1}
                        </span>
                        <span className="text-gray-300">—</span>
                        <span>
                            {aiInterviewIndex + 1} of {AI_INTERVIEW_QUESTIONS.length}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-[#E5A500] to-[#C98600]"
                                initial={{ width: 0 }}
                                animate={{ width: `${interviewProgress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E5A500] to-[#C98600] flex items-center justify-center shadow-md">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-space font-semibold text-[#C98600]">AI is asking you...</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold font-sora text-gray-900 leading-[1.2]">
                        {q.question}
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt) => (
                        <motion.button
                            key={opt}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect(opt)}
                            className={`relative p-4 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                                currentAnswer === opt
                                    ? "border-[#E5A500] bg-[#E5A500]/8 shadow-[0_4px_20px_rgba(229,165,0,0.1)] text-[#C98600]"
                                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:bg-gray-50/50"
                            }`}
                        >
                            <div className="font-space font-medium text-sm">
                                {opt}
                            </div>
                            {currentAnswer === opt && (
                                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#E5A500]" />
                            )}
                        </motion.button>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-300 font-space text-sm cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!isAnswered}
                        className={`group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5A500] to-[#C98600] text-white font-bold font-space text-lg shadow-[0_4px_16px_rgba(229,165,0,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer ${
                            !isAnswered ? "opacity-40 pointer-events-none" : ""
                        }`}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {aiInterviewIndex === AI_INTERVIEW_QUESTIONS.length - 1 ? (
                                <>Generate Card <Sparkles className="w-5 h-5" /></>
                            ) : (
                                <>Next <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" /></>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity duration-300" />
                    </button>
                </div>
            </motion.div>
        );
    };

    const renderPersonality = () => {
        const q = PERSONALITY_QUESTIONS[personalityIndex];
        if (!q) return null;

        const key = q.id as keyof PersonalityAnswers;
        const value = cardData.personality[key];
        const isMulti = q.multi || false;

        const handleSelect = (opt: string) => {
            if (isMulti) {
                const current = (value as string[]) || [];
                const newVal = current.includes(opt)
                    ? current.filter((v) => v !== opt)
                    : [...current, opt];
                updatePersonality(key, newVal);
            } else {
                updatePersonality(key, opt);
            }
        };

        const isSelected = (opt: string) => {
            if (isMulti) {
                return (value as string[] || []).includes(opt);
            }
            return value === opt;
        };

        const isAnswered = isMulti
            ? (value as string[] || []).length > 0
            : value !== null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500 font-space">
                        <span className="text-[#C98600] font-semibold">
                            {personalityIndex + 1}
                        </span>
                        <span className="text-gray-300">—</span>
                        <span>
                            {personalityIndex + 1} of {PERSONALITY_QUESTIONS.length}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-[#E5A500] to-[#C98600]"
                                initial={{ width: 0 }}
                                animate={{ width: `${personalityProgress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold font-sora text-gray-900 leading-[1.2]">
                        {q.question}
                    </h1>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {q.options.map((opt) => (
                        <motion.button
                            key={opt}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect(opt)}
                            className={`relative p-4 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                                isSelected(opt)
                                    ? "border-[#E5A500] bg-[#E5A500]/8 shadow-[0_4px_20px_rgba(229,165,0,0.1)] text-[#C98600]"
                                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-700 hover:bg-gray-50/50"
                            }`}
                        >
                            <div className="font-space font-medium text-sm">
                                {opt}
                            </div>
                            {isSelected(opt) && (
                                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#E5A500]" />
                            )}
                        </motion.button>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4">
                    {renderBackButton()}
                    {renderNextButton(!isAnswered, "Next →")}
                </div>
            </motion.div>
        );
    };

    const renderAI = () => {
        if (generationError || isCooldownActive) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 p-6"
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isCooldownActive ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"}`}>
                        {isCooldownActive ? (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        ) : (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        )}
                    </div>
                    <div className="space-y-3 max-w-md">
                        <h2 className="text-2xl font-bold font-sora text-gray-900">
                            {isCooldownActive ? "24-Hour AI Generation Cooldown" : "Generation Failed"}
                        </h2>
                        {isCooldownActive && (
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-xl font-mono text-lg font-bold">
                                <span>⏳ {formatCooldownTime(cooldownRemainingSeconds)}</span>
                            </div>
                        )}
                        <p className="text-gray-600 font-space text-sm">
                            {generationError || "AI generation is limited to once per 24 hours per user. You can still customize your card freely or share on social media to unlock an instant regeneration!"}
                        </p>
                    </div>

                    {isCooldownActive && (
                        <div className="w-full max-w-md p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/40 rounded-3xl space-y-4">
                            <div className="text-center space-y-1">
                                <h3 className="font-bold text-amber-900 text-base font-sora flex items-center justify-center gap-2">
                                    🚀 Share to Unlock Regeneration Now!
                                </h3>
                                <p className="text-xs text-amber-800/80 font-space">
                                    Share your card on social media to bypass the 24-hour wait instantly.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <button
                                    onClick={() => handleShareSocial("whatsapp")}
                                    className="px-3 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold font-space rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    💬 WhatsApp
                                </button>
                                <button
                                    onClick={() => handleShareSocial("instagram")}
                                    className="px-3 py-2.5 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white text-xs font-bold font-space rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    📸 Instagram
                                </button>
                                <button
                                    onClick={() => handleShareSocial("facebook")}
                                    className="px-3 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold font-space rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    📘 Facebook
                                </button>
                                <button
                                    onClick={() => handleShareSocial("twitter")}
                                    className="px-3 py-2.5 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white text-xs font-bold font-space rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    🐦 X / Twitter
                                </button>
                                <button
                                    onClick={() => handleShareSocial("copy")}
                                    className="px-3 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold font-space rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                    🔗 Copy Link
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => {
                                setCurrentStep("review");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="px-6 py-3 bg-[#111827] hover:bg-[#1f2937] text-white font-bold font-space rounded-2xl shadow-sm transition-all cursor-pointer"
                        >
                            ✏️ Edit Current Card
                        </button>
                        {!isCooldownActive && (
                            <button
                                onClick={startAIGeneration}
                                className="px-6 py-3 bg-[#E5A500] hover:bg-[#C98600] text-white font-bold font-space rounded-2xl shadow-sm transition-all cursor-pointer"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                </motion.div>
            );
        }

        const steps = [
            "Analyzing personality...",
            "Reading photo...",
            "Generating legendary title...",
            "Calculating stats...",
            "Creating premium artwork...",
            "Building collectible card...",
        ];
        const currentStepIdx = Math.min(
            Math.floor((generationProgress / 100) * steps.length),
            steps.length - 1
        );
        const currentLabel = steps[currentStepIdx] || steps[0];

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-[#E5A500] blur-[80px] opacity-10" />
                    <div className="relative w-32 h-32 rounded-full border-4 border-gray-100 flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#E5A500]"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                        <Sparkles className="w-10 h-10 text-[#E5A500] animate-pulse" />
                    </div>
                </div>

                <div className="space-y-4 max-w-md">
                    <h2 className="text-2xl font-bold font-sora text-gray-900">
                        {currentLabel}
                    </h2>
                    <p className="text-gray-600 font-space text-sm">
                        Our AI is crafting a legendary card just for you.
                    </p>
                </div>

                <div className="w-full max-w-xs h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#E5A500] to-[#C98600]"
                        initial={{ width: 0 }}
                        animate={{ width: `${generationProgress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="flex items-center gap-2 text-gray-500 font-space text-sm">
                    <span className="text-[#C98600] font-bold">
                        {Math.round(generationProgress)}%
                    </span>
                    <span className="text-gray-300">·</span>
                    <span>almost there</span>
                </div>
            </motion.div>
        );
    };

    const renderReview = () => {
        const name = profileInfo.name || editorName || "Legend";

        const MoodIcon = getMoodIcon(cardData.mood);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10"
            >
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold font-sora text-gray-900 leading-[1.1]">
                        Your Legendary <br />
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            Card
                        </span>
                    </h1>
                    <p className="text-gray-600 font-space text-base max-w-md">
                        Review your masterpiece before claiming it.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card Preview */}
                    <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E180A] via-[#12100A] to-[#0A0905] border-2 border-[#E5A500] shadow-[0_12px_40px_rgba(229,165,0,0.15)] flex flex-col justify-between">
                        {generatedCardUrl ? (
                            <Image
                                src={generatedCardUrl}
                                alt="Generated Legendary Card"
                                fill
                                className="object-cover"
                            />
                        ) : uploadPreview ? (
                            <>
                                <Image
                                    src={uploadPreview}
                                    alt="Card"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                
                                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                                    {/* Top stats info */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col items-center">
                                            <span className="text-2xl md:text-3xl font-black text-[#E5A500] leading-none">
                                                {overallRating || 87}
                                            </span>
                                            <span className="text-[10px] font-bold text-white/70 uppercase font-space">
                                                OVR
                                            </span>
                                        </div>
                                        <div className="px-2 py-0.5 rounded bg-[#E5A500]/20 border border-[#E5A500]/40 text-[#E5A500] text-[9px] font-bold uppercase tracking-wider font-space">
                                            {cardData.mood || "Legend"}
                                        </div>
                                    </div>

                                    {/* Bottom recipient info */}
                                    <div className="space-y-1">
                                        <div className="text-white font-bold font-sora text-xl md:text-2xl drop-shadow-md">
                                            {name}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80 font-space text-xs">
                                            <MoodIcon className="w-3.5 h-3.5 text-[#E5A500]" />
                                            <span className="capitalize">{cardData.mood || "Legendary"}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 font-space text-sm">
                                <Camera className="w-8 h-8 text-[#E5A500]/40 mb-2" />
                                <span className="text-[#E5A500]/60">No photo uploaded</span>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-900 font-sora font-bold text-lg flex items-center gap-2">
                            <Target className="w-5 h-5 text-[#E5A500]" />
                            Performance Stats
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(stats).map(([key, val]) => (
                                <div key={key} className="flex items-center gap-3">
                                    <span className="text-gray-600 font-space text-sm capitalize w-20">
                                        {key}
                                    </span>
                                    <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-[#E5A500] to-[#C98600]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${val}%` }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                        />
                                    </div>
                                    <span className="text-gray-900 font-space text-sm font-black w-8 text-right">
                                        {val}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-100 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 font-space">Style / Vibe</span>
                                <span className="text-gray-900 font-space font-semibold capitalize">
                                    {cardData.mood || "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 font-space">Recipient</span>
                                <span className="text-gray-900 font-space font-semibold capitalize">
                                    {cardData.recipient || "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (isCooldownActive) {
                                    setShowCooldownModal(true);
                                } else {
                                    setCurrentStep("ai");
                                    startAIGeneration();
                                }
                            }}
                            className={`transition-colors duration-300 font-space text-sm flex items-center gap-2 cursor-pointer ${
                                isCooldownActive
                                    ? "text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 hover:bg-amber-100 font-semibold"
                                    : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            {isCooldownActive ? <Lock className="w-4 h-4 text-amber-600" /> : <Sparkles className="w-4 h-4 text-[#E5A500]" />}
                            {isCooldownActive ? `Locked (Wait ${formatCooldownTime(cooldownRemainingSeconds)} or Share)` : "Regenerate Card"}
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleExportCard("png")}
                            disabled={isExportingFormat !== null}
                            className="px-4 py-2.5 bg-[#E5A500] hover:bg-[#C98600] text-white font-bold font-space text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isExportingFormat === "png" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            Transparent PNG (300 DPI)
                        </button>

                        <button
                            onClick={() => handleExportCard("pdf")}
                            disabled={isExportingFormat !== null}
                            className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-bold font-space text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isExportingFormat === "pdf" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-[#E5A500]" />}
                            Printable PDF (Vector)
                        </button>
                    </div>

                    {renderNextButton(false, "Get Card →")}
                </div>
            </motion.div>
        );
    };

    const renderCheckout = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-10"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-[#E5A500] blur-[100px] opacity-10" />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative w-16 h-16 rounded-full bg-[#E5A500]/10 flex items-center justify-center text-[#E5A500]"
                    >
                        <PartyPopper className="w-8 h-8" />
                    </motion.div>
                </div>

                <div className="space-y-4 max-w-md">
                    <h2 className="text-3xl font-bold font-sora text-gray-900">
                        You're getting a{" "}
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            Legendary Card
                        </span>
                    </h2>
                    <p className="text-gray-600 font-space text-base">
                        Your personalized Flawless card is ready. Complete the checkout to claim it.
                    </p>
                </div>

                <div className="w-full max-w-sm space-y-4">
                    <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-3 text-left">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-space">Card</span>
                            <span className="text-gray-900 font-space font-semibold capitalize">
                                {cardData.recipient || "Legend"} · {cardData.mood || "Funny"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-space">Overall Rating</span>
                            <span className="text-[#C98600] font-space font-bold font-semibold">
                                OVR {overallRating || 87}
                            </span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex items-center justify-between">
                            <span className="text-gray-800 font-space font-semibold">Price</span>
                            <span className="text-gray-900 font-sora font-black text-xl">
                                $4.99
                            </span>
                        </div>
                    </div>

                    <button className="w-full group relative py-4 rounded-2xl bg-gradient-to-r from-[#E5A500] to-[#C98600] text-white font-bold font-space text-lg shadow-[0_4px_20px_rgba(229,165,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden cursor-pointer">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Claim Card
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity duration-300" />
                    </button>

                    <button
                        onClick={() => setCurrentStep("review")}
                        className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-space text-sm flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to review
                    </button>
                </div>
            </motion.div>
        );
    };

    // ── Main Render ──

    const renderContent = () => {
        switch (currentStep) {
            case "mode":
                return renderMode();
            case "upload":
                return renderUpload();
            case "profile":
                return renderProfile();
            case "stats-pick":
                return renderStatsPick();
            case "stats-values":
                return renderStatsValues();
            case "ai-interview":
                return renderAiInterview();
            case "personality":
                return renderPersonality();
            case "ai":
                return renderAI();
            case "review":
                return renderReview();
            case "checkout":
                return renderCheckout();
            default:
                return null;
        }
    };



    // ── Sidebar ──

    const renderSidebar = () => {
        return (
            <div className="hidden lg:flex flex-col h-full py-8 px-6 border-r border-white/10 bg-black/90 text-white shadow-2xl backdrop-blur-2xl min-w-[280px]">
                {/* Logo & Return Link */}
                <div className="flex items-center justify-between gap-3 mb-10">
                    <a href="/" className="inline-flex items-center gap-2">
                        <img src="/images/logo.png" alt="Flawless" className="w-32 h-10 object-contain object-left" />
                    </a>
                </div>

                {/* Steps */}
                <div className="flex-1 space-y-1.5">
                    {STEPS.map((step, idx) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStepIndex > idx;
                        const isPast = currentStepIndex >= idx;
                        const StepIcon = step.icon;

                        return (
                            <div key={step.id} className="relative">
                                <div
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                        ? "bg-[#D4AF37]/15 border border-[#D4AF37]/40 shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
                                        : isPast
                                            ? "hover:bg-white/5 cursor-pointer text-gray-300"
                                            : "opacity-40 text-gray-500"
                                        }`}
                                    onClick={() => {
                                        if (isPast) {
                                            setCurrentStep(step.id);
                                        }
                                    }}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                                            ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black shadow-md font-bold"
                                            : isCompleted
                                                ? "bg-[#D4AF37]/20 text-[#F6D365] border border-[#D4AF37]/40"
                                                : "bg-white/5 text-gray-400 border border-white/10"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-4 h-4 text-[#F6D365] stroke-[3]" />
                                        ) : (
                                            <StepIcon className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div
                                            className={`font-space text-sm font-bold ${isActive
                                                ? "text-white"
                                                : isCompleted
                                                    ? "text-gray-200"
                                                    : "text-gray-400"
                                                }`}
                                        >
                                            {step.label}
                                        </div>
                                        {isActive && (
                                            <div className="text-[#F6D365] font-space text-[10px] font-bold flex items-center gap-1 mt-0.5">
                                                <Sparkles className="w-3 h-3 fill-[#F6D365]" /> <span>خطوة حالية</span>
                                            </div>
                                        )}
                                    </div>
                                    {isActive && (
                                        <div className="w-2 h-2 rounded-full bg-[#F6D365] shadow-[0_0_12px_rgba(246,211,101,0.8)]" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Return Home Link & Info */}
                <div className="pt-6 border-t border-white/10">
                    <a href="/" className="flex items-center gap-2 text-[#F6D365] hover:text-white font-space text-xs font-bold transition-colors">
                        ← العودة للصفحة الرئيسية
                    </a>
                </div>
            </div>
        );
    };

    // ── Main Layout ──

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#080808] text-white font-sans overflow-x-hidden">
            {/* Top Gold Border Accent */}
            <div className="fixed top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent z-50 pointer-events-none" />

            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/[0.05] rounded-full blur-[200px]" />
                <div className="absolute bottom-[-30%] left-[-10%] w-[50%] h-[50%] bg-[#F6D365]/[0.04] rounded-full blur-[200px]" />
            </div>

            {/* Floating particles */}
            {mounted && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-[#E5A500]"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                opacity: 0.1 + Math.random() * 0.2,
                            }}
                            animate={{
                                y: [0, -20 - Math.random() * 40, 0],
                                x: [0, 10 - Math.random() * 20, 0],
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 6,
                                repeat: Infinity,
                                delay: Math.random() * 4,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Confetti overlay */}
            <AnimatePresence>
                {showConfetti && mounted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 pointer-events-none z-50"
                    >
                        {[...Array(60)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 rounded-sm"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: -10,
                                    background: [
                                        "#E5A500",
                                        "#C98600",
                                        "#FF6B6B",
                                        "#4ECDC4",
                                        "#FFE66D",
                                        "#A78BFA",
                                    ][Math.floor(Math.random() * 6)],
                                    rotate: Math.random() * 360,
                                }}
                                animate={{
                                    y: `${100 + Math.random() * 60}vh`,
                                    x: [
                                        Math.random() * 40 - 20,
                                        Math.random() * 40 - 20,
                                    ],
                                    rotate: Math.random() * 720 + 360,
                                    opacity: [1, 0.8, 0],
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    delay: Math.random() * 1.5,
                                    ease: "easeOut",
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Layout */}
            <div className="relative flex min-h-screen">
                {/* Sidebar */}
                {renderSidebar()}

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Content */}
                    <div className="flex-1 px-6 py-8 lg:px-12 lg:py-12">
                        <div className="max-w-4xl mx-auto">
                            {/* Top bar */}
                            <div className="flex items-center justify-between mb-10 lg:mb-14">
                                <div className="flex items-center gap-4">
                                    {renderBackButton()}
                                </div>
                                {renderStepIndicator()}
                            </div>

                            {/* Content */}
                            <AnimatePresence mode="wait">
                                {renderContent()}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cooldown Share Unlock Popup Modal */}
            {showCooldownModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
                    <div className="relative w-full max-w-lg p-6 sm:p-8 bg-white rounded-3xl shadow-2xl space-y-6 border border-gray-100">
                        <button
                            onClick={() => setShowCooldownModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full cursor-pointer transition-colors"
                        >
                            ✕
                        </button>
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold font-sora text-gray-900">
                                24-Hour AI Generation Cooldown
                            </h3>
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-mono text-lg font-bold">
                                <span>⏳ {formatCooldownTime(cooldownRemainingSeconds)}</span>
                            </div>
                            <p className="text-gray-600 font-space text-sm max-w-sm mx-auto">
                                AI card generation is limited to once every 24 hours. You can edit your current card details freely, or <strong>share your card on social media</strong> to unlock an instant AI regeneration!
                            </p>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-2xl space-y-3">
                            <h4 className="text-xs font-bold font-sora text-amber-900 text-center uppercase tracking-wider">
                                🚀 Share to Unlock & Regenerate Now
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                <button
                                    onClick={() => handleShareSocial("whatsapp")}
                                    className="px-3.5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold font-space rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    💬 WhatsApp
                                </button>
                                <button
                                    onClick={() => handleShareSocial("instagram")}
                                    className="px-3.5 py-3 bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white text-xs font-bold font-space rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    📸 Instagram
                                </button>
                                <button
                                    onClick={() => handleShareSocial("facebook")}
                                    className="px-3.5 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold font-space rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    📘 Facebook
                                </button>
                                <button
                                    onClick={() => handleShareSocial("twitter")}
                                    className="px-3.5 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white text-xs font-bold font-space rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    🐦 X / Twitter
                                </button>
                                <button
                                    onClick={() => handleShareSocial("copy")}
                                    className="px-3.5 py-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold font-space rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    🔗 Copy Link
                                </button>
                            </div>
                        </div>

                        <div className="pt-2 text-center">
                            <button
                                onClick={() => setShowCooldownModal(false)}
                                className="text-xs text-gray-500 hover:text-gray-800 underline font-space cursor-pointer"
                            >
                                Continue Editing Current Card
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}