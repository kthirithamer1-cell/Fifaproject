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
    SlidersHorizontal,
    MessageCircle,
    UserCircle,
    ListChecks,
    Lock,
    Truck,
    CheckCircle2
} from "lucide-react";
import CardComposer from "../_components/generator/CardComposer";
import type { CardStat, CardBadge } from "../_components/generator/CardComposer";
import CardEditor from "../_components/generator/CardEditor";
import BackgroundPicker from "../_components/generator/BackgroundPicker";
import TunisiaStatPicker from "../_components/generator/TunisiaStatPicker";
import RecentOrderPopup from "../_components/generator/RecentOrderPopup";
import {
    TUNISIA_STATS,
    getStatByCode,
    getDynamicStatNote,
    extractNotesFromContext,
    resolveDynamicPositionAndTitle,
    calculateOverall,
    type SelectedStat,
} from "./lib/tunisiaStats";
import { initAffiliateTracker, getAffiliateCode, trackCardGenerated } from "@/lib/affiliateTracker";
import { trackViewContent, trackAddToCart, trackInitiateCheckout, trackPurchase } from "@/lib/fbPixel";

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
    POPULAR_STAT_CODES,
    SOCIAL_PROOF,
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
    const [editorBgUrl, setEditorBgUrl] = useState<string>("/prompting/image.webp");
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

    // ── Order & Checkout State ──
    const [selectedSize, setSelectedSize] = useState<"standard" | "mega">("standard");
    const [affiliateInputCode, setAffiliateInputCode] = useState<string>("");
    const [orderForm, setOrderForm] = useState({
        customerName: "",
        phone: "",
        governorate: "تونس",
        city: "",
        address: "",
        quantity: 1,
        notes: "",
    });
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [orderSuccessModal, setOrderSuccessModal] = useState<{
        visible: boolean;
        orderId: string;
        details: any;
    } | null>(null);

    // ── 24-Hour Cooldown & Generation Rate Limit State ──
    const [remainingGenerations, setRemainingGenerations] = useState<number>(3);
    const [totalGenerations, setTotalGenerations] = useState<number>(3);
    const [cooldownRemainingSeconds, setCooldownRemainingSeconds] = useState<number>(0);
    const [isCooldownActive, setIsCooldownActive] = useState<boolean>(false);
    const [showCooldownModal, setShowCooldownModal] = useState<boolean>(false);

    const formatCooldownTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        setMounted(true);
        // Meta Pixel: ViewContent when generator page loads
        trackViewContent({
            content_name: "Flawless Card Generator",
            content_type: "product_group",
        });
        initAffiliateTracker().then((code) => {
            if (code) setAffiliateInputCode(code);
        });
        const currentCode = getAffiliateCode();
        if (currentCode) setAffiliateInputCode(currentCode);
        // Check rate limit & remaining attempts on mount
        fetch("/api/generate-card")
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error(`Status ${res.status}`);
                }
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid response format");
                }
                return res.json();
            })
            .then((data) => {
                if (data) {
                    if (typeof data.remainingGenerations === "number") {
                        setRemainingGenerations(data.remainingGenerations);
                    }
                    if (typeof data.totalGenerations === "number") {
                        setTotalGenerations(data.totalGenerations);
                    }
                    if (!data.canGenerate || data.remainingGenerations <= 0) {
                        setIsCooldownActive(true);
                        if (data.cooldownRemainingSeconds) {
                            setCooldownRemainingSeconds(data.cooldownRemainingSeconds);
                        }
                    } else {
                        setIsCooldownActive(false);
                        setCooldownRemainingSeconds(0);
                    }
                }
            })
            .catch((err) => {
                console.warn("Notice: Using default rate limit state:", err?.message || err);
            });
    }, []);

    useEffect(() => {
        if (cooldownRemainingSeconds <= 0) {
            if (remainingGenerations <= 0) {
                setRemainingGenerations(3);
                setIsCooldownActive(false);
            }
            return;
        }
        const timer = setInterval(() => {
            setCooldownRemainingSeconds((prev) => {
                if (prev <= 1) {
                    setIsCooldownActive(false);
                    setRemainingGenerations(3);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldownRemainingSeconds, remainingGenerations]);

    // ── LocalStorage Helpers ──
    const LOCAL_STORAGE_KEY_CARD_URL = "fifa_generated_card_url";
    const LOCAL_STORAGE_KEY_CARD_DATA = "fifa_card_editor_state";

    const saveCardToLocalStorage = (imageUrl: string, extraData?: any) => {
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem(LOCAL_STORAGE_KEY_CARD_URL, imageUrl);
                const dataToSave = {
                    ...extraData,
                    profileName: profileInfo.name || editorName,
                    selectedSize,
                    overallRating,
                };
                localStorage.setItem(LOCAL_STORAGE_KEY_CARD_DATA, JSON.stringify(dataToSave));
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

    useEffect(() => {
        setMounted(true);
        // Read size query parameter from URL
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const sizeParam = params.get("size");
            if (sizeParam === "mega" || sizeParam === "standard") {
                setSelectedSize(sizeParam);
            }
        }

        // Restore saved card image & details from localStorage if present
        const { savedUrl, savedData } = loadCardFromLocalStorage();
        if (savedUrl) {
            setGeneratedCardUrl(savedUrl);
            setEditorBgUrl(savedUrl);
            if (savedData) {
                if (savedData.editorName) setEditorName(savedData.editorName);
                if (savedData.profileName) {
                    setProfileInfo((prev) => ({ ...prev, name: savedData.profileName }));
                    setOrderForm((prev) => ({ ...prev, customerName: savedData.profileName }));
                }
                if (savedData.selectedSize) setSelectedSize(savedData.selectedSize);
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

    // ── Share Toast State ──
    const [shareToast, setShareToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
    const showShareToast = (message: string) => {
        setShareToast({ message, visible: true });
        setTimeout(() => setShareToast({ message: "", visible: false }), 5000);
    };

    // Copy image to clipboard (works in Chrome/Edge)
    const copyImageToClipboard = async (imgSrc: string): Promise<boolean> => {
        try {
            const res = await fetch(imgSrc);
            const blob = await res.blob();
            // Convert to PNG blob if needed (clipboard requires image/png)
            let pngBlob = blob;
            if (blob.type !== "image/png") {
                const bitmap = await createImageBitmap(blob);
                const canvas = document.createElement("canvas");
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;
                const ctx = canvas.getContext("2d")!;
                ctx.drawImage(bitmap, 0, 0);
                pngBlob = await new Promise<Blob>((resolve) =>
                    canvas.toBlob((b) => resolve(b!), "image/png")
                );
                // Immediately release WebKit GPU texture and ImageBitmap memory
                bitmap.close();
                canvas.width = 0;
                canvas.height = 0;
            }
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": pngBlob }),
            ]);
            return true;
        } catch (e) {
            console.warn("Clipboard image copy failed:", e);
            return false;
        }
    };

    const handleShareSocial = async (platform: "whatsapp" | "twitter" | "facebook" | "instagram" | "native" | "copy") => {
        const cardImg = generatedCardUrl || uploadPreview;
        if (!cardImg) {
            alert("No card image to share!");
            return;
        }

        const playerName = profileInfo.name || editorName || "Legend";

        // ── Step 1: Upload card image to get a public shareable URL with OG tags ──
        let shareUrl = typeof window !== "undefined" ? window.location.origin : "https://flawless.tn";
        try {
            const uploadRes = await fetch("/api/upload-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageData: cardImg }),
            });
            const uploadData = await uploadRes.json();
            if (uploadRes.ok && uploadData.shareUrl) {
                shareUrl = `${window.location.origin}${uploadData.shareUrl}`;
            }
        } catch (e) {
            console.warn("Card upload for share failed, using fallback URL:", e);
        }

        const shareText = `شوف كارطة ${playerName} الأسطورية! ⚽🔥 #Flawless #Tunisia`;

        // ── Step 2: Native File Sharing — ONLY on mobile ──
        const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (platform === "native" || (isMobile && platform !== "copy")) {
            if (typeof navigator !== "undefined" && navigator.share) {
                try {
                    const res = await fetch(cardImg);
                    const blob = await res.blob();
                    const file = new File([blob], `${playerName.replace(/\s+/g, "_")}_flawless_card.png`, { type: "image/png" });

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            title: `كارطة ${playerName} الأسطورية`,
                            text: shareText + "\n" + shareUrl,
                            files: [file],
                        });
                        await handleUnlockByShare("Social Media");
                        return;
                    }
                } catch (e: any) {
                    if (e?.name === "AbortError") {
                        console.log("User cancelled native share");
                        return;
                    }
                    console.log("Native file share fallback:", e);
                }
            }
        }

        // ── Step 3: Desktop — platform-specific flows ──
        let popup: Window | null = null;

        if (platform === "facebook") {
            // Copy card image to clipboard, then open Facebook
            const copied = await copyImageToClipboard(cardImg);
            if (copied) {
                showShareToast("✅ الصورة منسوخة! الصق في بوستك على فايسبوك (Ctrl+V)");
            } else {
                downloadCardImage();
                showShareToast("⬇️ الصورة تحملت! ارفعها في بوستك على فايسبوك");
            }
            popup = window.open("https://www.facebook.com/", "_blank");
            waitForPopupClose(popup, "Facebook");

        } else if (platform === "instagram") {
            const copied = await copyImageToClipboard(cardImg);
            if (copied) {
                showShareToast("✅ الصورة منسوخة! الصق في ستوري أو بوست على إنستغرام");
            } else {
                downloadCardImage();
                showShareToast("⬇️ الصورة تحملت! ارفعها على إنستغرام");
            }
            popup = window.open("https://www.instagram.com/flawless_official1/", "_blank");
            waitForPopupClose(popup, "Instagram");

        } else if (platform === "whatsapp") {
            // Copy image to clipboard + open WhatsApp Web (user can paste with Ctrl+V)
            await copyImageToClipboard(cardImg);
            showShareToast("✅ الصورة منسوخة! اختار شكون تبعثلو و الصق (Ctrl+V)");
            popup = window.open(`https://web.whatsapp.com/`, "_blank");
            waitForPopupClose(popup, "WhatsApp");

        } else if (platform === "twitter") {
            // Copy image + open Twitter compose
            const copied = await copyImageToClipboard(cardImg);
            if (copied) {
                showShareToast("✅ الصورة منسوخة! الصق في تغريدتك (Ctrl+V)");
            } else {
                downloadCardImage();
                showShareToast("⬇️ الصورة تحملت! ارفعها في التغريدة");
            }
            popup = window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
            waitForPopupClose(popup, "X / Twitter");

        } else if (platform === "copy") {
            const copied = await copyImageToClipboard(cardImg);
            if (copied) {
                showShareToast("✅ الصورة منسوخة! الصقها وين تحب");
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                showShareToast("🔗 الرابط منسوخ!");
            }
            await handleUnlockByShare("Copy");
        }
    };

    // ── Direct step flow (3-step optimized) ──
    const getStepsForMode = (_mode: CardMode): Step[] => {
        return ["upload", "stats-pick", "checkout"];
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

        let progressVal = 0;
        const progressInterval = setInterval(() => {
            if (progressVal < 90) {
                progressVal += Math.random() * 6 + 2;
                setGenerationProgress(Math.min(Math.round(progressVal), 95));
            }
        }, 800);

        try {
            // Step 1: Call AI to analyze interview answers and pick stats (passing full profile info)
            const aiCardResponse = await fetch("/api/generate-ai-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    answers: aiInterviewAnswers,
                    photo: uploadPreview,
                    profileInfo: profileInfo,
                }),
            });

            const aiCardData = await aiCardResponse.json();

            if (!aiCardResponse.ok) {
                throw new Error(aiCardData.error || "Failed to generate AI card data");
            }

            const dynamicResolved = resolveDynamicPositionAndTitle({
                gender: profileInfo.gender,
                age: profileInfo.age,
                description: profileInfo.description,
                hobbies: profileInfo.hobbies,
                designNotes: profileInfo.designNotes,
                answers: aiInterviewAnswers,
            });

            // Apply AI-selected stats to the editor with contextual notes
            const contextText = `${(profileInfo.hobbies || []).join(" ")} ${profileInfo.description || ""} ${profileInfo.designNotes || ""} ${JSON.stringify(aiInterviewAnswers)}`.toLowerCase();
            const aiStats: CardStat[] = (aiCardData.stats || []).map((s: { code: string; value: number; note?: string; emoji?: string }) => {
                const statDef = getStatByCode(s.code);
                return {
                    label: s.code,
                    value: s.value,
                    note: s.note || extractNotesFromContext(s.code, s.value, contextText),
                    emoji: s.emoji || statDef?.emoji || "⭐",
                };
            });
            setEditorStats(aiStats);
            setEditorRating(aiCardData.overall || calculateOverall(aiCardData.stats || []));
            setOverallRating(aiCardData.overall || calculateOverall(aiCardData.stats || []));
            setEditorName(aiCardData.cardTitle || profileInfo.name || dynamicResolved.title);
            setEditorSubtitle(aiCardData.bio || dynamicResolved.bio);
            const resolvedPos = aiCardData.position || dynamicResolved.position;
            setEditorPosition(resolvedPos);
            if (aiCardData.description) setEditorDescription(aiCardData.description);

            // Step 2: Generate AI card image (Synchronous)
            const bgResponse = await fetch("/api/generate-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    photo: uploadPreview,
                    cardData: {
                        ...cardData,
                        answers: aiInterviewAnswers,
                        position: resolvedPos,
                    },
                    overallRating: aiCardData.overall || 85,
                    profileInfo: {
                        ...profileInfo,
                        position: resolvedPos,
                    },
                    stats: aiStats,
                    freeDescription: aiCardData.bio || dynamicResolved.bio,
                }),
            });

            const bgData = await bgResponse.json();
            clearInterval(progressInterval);

            if (!bgResponse.ok) {
                if (bgResponse.status === 429 || bgData.cooldownRemainingSeconds) {
                    setRemainingGenerations(0);
                    setCooldownRemainingSeconds(bgData.cooldownRemainingSeconds || 86400);
                    setIsCooldownActive(true);
                }
                throw new Error(bgData.error || "Failed to generate card background");
            }

            if (typeof bgData.remainingGenerations === "number") {
                setRemainingGenerations(bgData.remainingGenerations);
                if (bgData.remainingGenerations <= 0) {
                    setIsCooldownActive(true);
                    setCooldownRemainingSeconds(bgData.cooldownRemainingSeconds || 86400);
                }
            }

            setGeneratedCardUrl(bgData.imageUrl);
            setEditorBgUrl(bgData.imageUrl);
            trackCardGenerated();
            saveCardToLocalStorage(bgData.imageUrl, {
                editorName: aiCardData.cardTitle || profileInfo.name || dynamicResolved.title,
                editorSubtitle: aiCardData.bio || dynamicResolved.bio,
                editorPosition: resolvedPos,
                editorRating: aiCardData.overall || calculateOverall(aiCardData.stats || []),
                editorStats: aiStats,
                editorDescription: aiCardData.description,
            });
            setGenerationProgress(100);
            setIsGenerating(false);
            setRevealCard(true);
            setShowConfetti(true);

            setTimeout(() => {
                setCurrentStep("checkout");
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
        const contextText = `${(profileInfo.hobbies || []).join(" ")} ${profileInfo.description || ""} ${profileInfo.designNotes || ""}`.toLowerCase();
        const dynamicResolved = resolveDynamicPositionAndTitle({
            gender: profileInfo.gender,
            age: profileInfo.age,
            description: profileInfo.description,
            hobbies: profileInfo.hobbies,
            designNotes: profileInfo.designNotes,
        });

        const manualStats: CardStat[] = selectedStatCodes.map((code) => {
            const val = statValues[code] || 75;
            const statDef = getStatByCode(code);
            return {
                label: code,
                value: val,
                note: extractNotesFromContext(code, val, contextText),
                emoji: statDef?.emoji || "⭐",
            };
        });
        setEditorStats(manualStats);
        const overall = calculateOverall(
            selectedStatCodes.map((code) => ({ code, value: statValues[code] || 75 }))
        );
        setOverallRating(overall);
        setEditorRating(overall);
        setEditorName(profileInfo.name || dynamicResolved.title);
        setEditorPosition(dynamicResolved.position);
        setEditorSubtitle(dynamicResolved.bio || profileInfo.description?.slice(0, 50) || "Born to be legendary");
        const descParts = selectedStatCodes.map((code) => {
            const stat = getStatByCode(code);
            return stat ? stat.meaning : code;
        });
        setEditorDescription(descParts.slice(0, 4).join(" • "));
    };

    // ── Generate AI background for the editor (Synchronous) ──
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
            trackCardGenerated();
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
                    const result = canvas.toDataURL("image/jpeg", 0.82);
                    // Explicitly clean up canvas GPU buffer to prevent tab crashes
                    canvas.width = 0;
                    canvas.height = 0;
                    img.src = "";
                    resolve(result);
                } else {
                    canvas.width = 0;
                    canvas.height = 0;
                    img.src = "";
                    resolve(dataUrl);
                }
            };
            img.onerror = () => {
                img.src = "";
                resolve(dataUrl);
            };
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

    const renderMobileProgressBar = () => {
        if (currentStep === "ai") return null;
        return (
            <div className="lg:hidden w-full bg-neutral-950/95 border-b border-white/10 px-4 py-3 sticky top-0 z-30 backdrop-blur-md">
                <div className="max-w-md mx-auto flex items-center justify-between relative px-2">
                    {/* Connecting Line background */}
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-white/15" />
                    {/* Connecting Line active fill */}
                    <div
                        className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F6D365] transition-all duration-500"
                        style={{
                            width:
                                currentStepIndex === 0
                                    ? "0%"
                                    : currentStepIndex === 1
                                    ? "50%"
                                    : "calc(100% - 3rem)",
                        }}
                    />

                    {STEPS.map((step, idx) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStepIndex > idx;

                        return (
                            <button
                                key={step.id}
                                type="button"
                                disabled={!isCompleted}
                                onClick={() => {
                                    if (isCompleted) {
                                        setCurrentStep(step.id);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }
                                }}
                                className={`relative z-10 flex flex-col items-center gap-1 group ${
                                    isCompleted ? "cursor-pointer" : "cursor-default"
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-space transition-all duration-300 ${
                                        isActive
                                            ? "bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black ring-4 ring-[#D4AF37]/20 scale-110 shadow-lg"
                                            : isCompleted
                                            ? "bg-[#D4AF37] text-black font-bold"
                                            : "bg-neutral-900 border border-white/20 text-gray-500"
                                    }`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-4 h-4 stroke-[3]" />
                                    ) : (
                                        <span>{idx + 1}</span>
                                    )}
                                </div>
                                <span
                                    className={`text-[10px] font-space font-bold whitespace-nowrap transition-colors ${
                                        isActive
                                            ? "text-[#F6D365]"
                                            : isCompleted
                                            ? "text-gray-300"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderStepIndicator = () => {
        if (currentStep === "ai") return null;
        if (currentStep === "checkout") return null;
        const label = STEPS.find((s) => s.id === currentStep)?.label || "";
        return (
            <div className="hidden lg:flex items-center gap-3 text-sm text-gray-500 font-space">
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
            ? () => {
                // Meta Pixel: AddToCart when user commits to ordering from review
                const unitPrice = selectedSize === "mega" ? 69 : 49;
                const totalPrice = (orderForm.quantity * unitPrice) + 8;
                trackAddToCart({
                    content_name: `Flawless Card - ${selectedSize === "mega" ? "Mega 60x40cm" : "Standard 45x30cm"}`,
                    value: totalPrice,
                });
                setCurrentStep("checkout");
            }
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
                                className={`relative p-7 rounded-3xl border transition-all duration-200 text-right cursor-pointer ${
                                    isSelected
                                        ? "border-[#D4AF37] bg-neutral-950 shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
                                        : "border-white/10 bg-neutral-950/80 hover:border-[#D4AF37]/50 hover:bg-neutral-900 shadow-xl"
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
        const canProceed = isUploaded && profileInfo.name.trim().length > 0;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
            >
                {/* Social proof */}
                <div className="flex items-center justify-center gap-2 py-1" dir="rtl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-space">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        🔥 تم تسجيل 4 طلبيات (4 Commandes) جديدة مؤخراً — اطلب كارتتك توا!
                    </span>
                </div>

                <div className="space-y-1.5" dir="rtl">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                        صمّم كارتتك{" "}
                        <span className="text-gold-grad">
                            الأسطورية 🏆
                        </span>
                    </h1>
                    <p className="text-gray-400 font-space text-xs sm:text-sm max-w-md">
                        ارفع صورتك ومعلوماتك — في دقيقة تولّي كارت فيفا تونسي مميّز.
                    </p>
                </div>

                {/* Photo Upload */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => !isUploaded && fileInputRef.current?.click()}
                    className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                        isDragging
                            ? "border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_10px_30px_rgba(212,175,55,0.25)] border-dashed cursor-pointer"
                            : isUploaded
                            ? "border-[#D4AF37]/60 bg-neutral-950 shadow-xl"
                            : "border-2 border-dashed border-white/20 bg-neutral-950/80 hover:border-[#D4AF37]/60 hover:bg-neutral-900 shadow-xl cursor-pointer"
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

                    <div className="relative min-h-[220px] sm:min-h-[280px] flex items-center justify-center p-3 sm:p-5">
                        {isUploaded ? (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative w-full h-[200px] sm:h-[260px] rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#D4AF37]/30 flex items-center justify-center"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                                <div className="relative w-full h-full p-2">
                                    <Image
                                        src={uploadPreview!}
                                        alt="Uploaded Photo"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>

                                {/* Overlay actions */}
                                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-20" dir="rtl">
                                    <span className="px-2.5 py-1 rounded-full bg-neutral-950/90 border border-[#D4AF37]/40 flex items-center gap-1 text-[10px] font-bold text-[#F6D365] shadow-lg">
                                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> صورة واضحة
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                            className="px-2.5 py-1 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/35 border border-[#D4AF37]/60 text-[10px] font-bold font-space text-[#F6D365] transition-all cursor-pointer shadow-md flex items-center gap-1"
                                        >
                                            <Camera className="w-3 h-3" /> تغيير
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUploadPreview(null);
                                                setUploadedFile(null);
                                            }}
                                            className="px-2 py-1 rounded-full bg-red-500/20 hover:bg-red-500/35 border border-red-500/40 text-[10px] font-bold font-space text-red-400 transition-all cursor-pointer shadow-md"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center space-y-2.5 py-5" dir="rtl">
                                <div className="mx-auto w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#F6D365] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                    <ImagePlus className="w-6 h-6 stroke-[1.75]" />
                                </div>
                                <div className="text-white font-bold text-base sm:text-lg">
                                    📷 اضغط هنا لرفع الصورة
                                </div>
                                <div className="text-gray-400 font-space text-xs max-w-xs mx-auto">
                                    PNG, JPG, WEBP — صورة واضحة للوجه
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Fields in Step 1 */}
                <div className="space-y-4" dir="rtl">
                    {/* Name */}
                    <div>
                        <label className="text-xs font-space font-bold text-white mb-1.5 block">
                            ✍️ الاسم واللقب على الكارت <span className="text-[#D4AF37]">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileInfo.name}
                            onChange={(e) => setProfileInfo((p) => ({ ...p, name: e.target.value }))}
                            placeholder="مثال: أحمد، مريم، كريم..."
                            maxLength={30}
                            className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/70 text-white text-base font-bold font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-500 placeholder:font-normal placeholder:text-xs"
                        />
                    </div>

                    {/* Age + Gender row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-space font-bold text-gray-300 mb-1.5 block">العمر (Age)</label>
                            <input
                                type="number"
                                value={profileInfo.age}
                                onChange={(e) => setProfileInfo((p) => ({ ...p, age: e.target.value }))}
                                placeholder="مثال: 24"
                                min={1}
                                max={99}
                                className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/70 text-white font-space text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-space font-bold text-gray-300 mb-1.5 block">الجنس (Gender)</label>
                            <div className="flex gap-2">
                                {(["male", "female"] as const).map((g) => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setProfileInfo((p) => ({ ...p, gender: g }))}
                                        className={`flex-1 py-2.5 rounded-xl border text-xs font-space font-bold transition-all duration-200 cursor-pointer ${
                                            profileInfo.gender === g
                                                ? "border-[#D4AF37] bg-[#D4AF37]/25 text-[#F6D365] shadow-md shadow-[#D4AF37]/10"
                                                : "border-white/15 bg-black/60 text-gray-300 hover:border-white/30"
                                        }`}
                                    >
                                        {g === "male" ? "♂ ذكر" : "♀ أنثى"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hobbies — Interactive Chips */}
                    <div>
                        <label className="text-xs font-space font-bold text-gray-300 mb-1.5 block">
                            🎯 الهوايات والاهتمامات (Hobbies)
                        </label>
                        
                        {/* Selected Hobbies Pills */}
                        {Array.isArray(profileInfo.hobbies) && profileInfo.hobbies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2.5">
                                {profileInfo.hobbies.map((hobby) => (
                                    <span
                                        key={hobby}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#F6D365] border border-[#D4AF37]/40 text-xs font-space font-bold"
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
                                            className="hover:text-red-400 font-bold ml-1 text-xs"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Preset Chips */}
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                            {[
                                { label: "⚽ كورة (Football)", val: "Football" },
                                { label: "🎮 جيمنغ (Gaming)", val: "Gaming" },
                                { label: "☕ قهوة (Kahwa)", val: "Kahwa Direct" },
                                { label: "🚗 كراهب (Cars)", val: "Cars" },
                                { label: "🏋️ جيم (Gym)", val: "Gym" },
                                { label: "🎵 مزيكا (Music)", val: "Music" },
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
                                        className={`px-3 py-1.5 rounded-lg border text-xs font-space font-bold transition-all cursor-pointer ${
                                            isSelected
                                                ? "border-[#D4AF37] bg-[#D4AF37] text-black shadow-sm"
                                                : "border-white/10 bg-black/50 text-gray-300 hover:border-white/25"
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
                                className="flex-1 px-3.5 py-2 rounded-xl border border-white/15 bg-black/70 text-xs text-white font-space focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-500"
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
                                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-xs font-space font-bold hover:bg-[#F6D365] transition cursor-pointer"
                            >
                                + أضف
                            </button>
                        </div>
                    </div>
                </div>

                {/* Next Button */}
                {canProceed && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end pt-2"
                    >
                        {renderNextButton(false, "الخطوة التالية: الستاتيكس →")}
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
                            maxLength={500}
                            rows={2}
                            className="w-full px-5 py-3.5 rounded-2xl border border-white/15 bg-black/70 text-sm text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-400 resize-none"
                        />
                        <span className="text-xs text-gray-400 font-space mt-1 block">{profileInfo.designNotes.length}/500</span>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-space font-bold text-white mb-2 block">توصيف أو سيرة سريعة (Short Bio / Career History)</label>
                        <textarea
                            value={profileInfo.description}
                            onChange={(e) => setProfileInfo((p) => ({ ...p, description: e.target.value }))}
                            placeholder="شنوّة أكثر حاجة تميّزك؟ اكتب خدمتك، أعمالك، مسيرتك ومشاريعك..."
                            maxLength={1000}
                            rows={4}
                            className="w-full px-5 py-3.5 rounded-2xl border border-white/15 bg-black/70 text-sm text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-400 resize-none"
                        />
                        <span className="text-xs text-gray-400 font-space mt-1 block">{profileInfo.description.length}/1000</span>
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
                className="space-y-5"
            >
                {/* Fast-Completion Motivation & Urgency Banner */}
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/20 via-amber-500/10 to-transparent border border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/5" dir="rtl">
                    <div className="flex items-center gap-2.5">
                        <span className="text-2xl animate-bounce">⚡</span>
                        <div>
                            <div className="text-xs sm:text-sm font-black text-[#F6D365] font-space">
                                أقل من 30 ثانية وتشوف كارتتك كاملة بالـ AI والـ 3D!
                            </div>
                            <div className="text-[11px] text-gray-300 font-space mt-0.5">
                                اختار 6 ستاتيكس واضغط &quot;توليد ومعاينة الكارت&quot; لمعاينة تصميمك فوراً 🚀
                            </div>
                        </div>
                    </div>
                    <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg bg-[#D4AF37] text-black font-black text-[10px] font-space shrink-0 shadow-md">
                        الخطوة 2 من 3
                    </span>
                </div>

                <div className="space-y-1.5" dir="rtl">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                        اختار <span className="text-gold-grad">6 ستاتيكس تونسية 😂</span>
                    </h1>
                    <p className="text-gray-400 font-space text-xs sm:text-sm max-w-md">
                        اضغط على 6 ستاتيكس توصف صاحبك أو توصفك أنت — القيم تتحط تلقائياً وتنجم تبدلها!
                    </p>
                </div>

                {/* Dynamic Real-time Action Cue */}
                <div className="text-center py-1">
                    {selectedStatCodes.length === 0 ? (
                        <span className="text-xs font-space text-gray-300 font-bold">
                            🎯 اضغط على 6 ستاتيكس لحساب قوة الكارت (OVR) متاعك فوراً!
                        </span>
                    ) : selectedStatCodes.length < 6 ? (
                        <span className="text-xs font-space text-[#F6D365] font-bold animate-pulse">
                            🔥 تبقّتلك {6 - selectedStatCodes.length} ستاتيكس فقط — كملهم وشوف كارتتك جاهزة!
                        </span>
                    ) : (
                        <span className="text-xs font-space text-emerald-400 font-bold flex items-center justify-center gap-1">
                            <Check className="w-4 h-4 stroke-[3]" /> كارتتك كاملة! اضغط &quot;توليد ومعاينة الكارت الآن&quot; بالأسفل 👇
                        </span>
                    )}
                </div>

                <TunisiaStatPicker
                    selected={selectedStatCodes}
                    onSelectionChange={(codes) => {
                        setSelectedStatCodes(codes);
                        // Auto-assign random values for newly selected stats (no sliders needed)
                        const newValues = { ...statValues };
                        codes.forEach((code) => {
                            if (!(code in newValues)) {
                                newValues[code] = Math.floor(Math.random() * 26) + 70; // 70-95
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

                {/* Interactive Stat Power Customizer (1-99) */}
                {selectedStatCodes.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 rounded-2xl border border-white/15 bg-neutral-950/90 p-4 sm:p-5"
                        dir="rtl"
                    >
                        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-base font-bold font-space text-white">
                                    ⚡ قوة الستاتيكس المختارة ({selectedStatCodes.length}/6)
                                </span>
                                <span className="text-[10px] text-gray-400 font-space">
                                    (اسحب لتعديل القوة 1–99)
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newValues = { ...statValues };
                                        selectedStatCodes.forEach((c) => {
                                            newValues[c] = Math.floor(Math.random() * 25) + 75; // 75-99
                                        });
                                        setStatValues(newValues);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F6D365] text-[11px] font-bold font-space transition-all cursor-pointer flex items-center gap-1"
                                >
                                    <span>🎲 عشوائي</span>
                                </button>
                                
                                {isReady && (
                                    <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F6D365] text-black font-black text-xs font-space flex items-center gap-1 shadow-md">
                                        <span>OVR</span>
                                        <span className="text-sm">
                                            {calculateOverall(
                                                selectedStatCodes.map((c) => ({
                                                    code: c,
                                                    value: statValues[c] || 80,
                                                }))
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sliders Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {selectedStatCodes.map((code) => {
                                const stat = TUNISIA_STATS.find((s) => s.code === code);
                                const val = statValues[code] || 80;
                                return (
                                    <div
                                        key={code}
                                        className="space-y-1.5 p-3 rounded-xl bg-black/60 border border-white/10"
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-base">{stat?.emoji || "⭐"}</span>
                                                <span className="font-bold text-white font-space">{stat?.stat || code}</span>
                                                <span className="text-[10px] text-gray-400 font-space">({stat?.meaning || code})</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newVal = Math.max(1, val - 1);
                                                        setStatValues((prev) => ({ ...prev, [code]: newVal }));
                                                    }}
                                                    className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-gray-300 text-xs flex items-center justify-center font-bold cursor-pointer"
                                                >
                                                    -
                                                </button>
                                                <span className="font-black text-sm text-[#F6D365] font-space w-7 text-center">
                                                    {val}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newVal = Math.min(99, val + 1);
                                                        setStatValues((prev) => ({ ...prev, [code]: newVal }));
                                                    }}
                                                    className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-gray-300 text-xs flex items-center justify-center font-bold cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <input
                                            type="range"
                                            min={1}
                                            max={99}
                                            value={val}
                                            onChange={(e) => {
                                                const v = parseInt(e.target.value) || 1;
                                                setStatValues((prev) => ({ ...prev, [code]: v }));
                                            }}
                                            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${
                                                    ((val - 1) / 98) * 100
                                                }%, rgba(255,255,255,0.15) ${((val - 1) / 98) * 100}%, rgba(255,255,255,0.15) 100%)`,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Bio / Description & Design Notes (Rich context for AI Prompt & Card Titles) */}
                <div className="space-y-3 pt-2" dir="rtl">
                    <div>
                        <label className="text-xs font-space font-bold text-gray-300 mb-1.5 block">
                            💬 احكي عليه في جملة أو موقف مضحك (Bio / Description)
                        </label>
                        <textarea
                            value={profileInfo.description}
                            onChange={(e) => setProfileInfo((p) => ({ ...p, description: e.target.value }))}
                            placeholder="مثال: أعز صاحب، ديما 15 دقيقة روطار، أحسن واحد يضحك في القعدة، يحب القهوة والجيمنغ..."
                            maxLength={300}
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/70 text-xs text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-space font-bold text-gray-300 mb-1.5 block">
                            🏷️ لقب أو ملاحظات خاصة على الكارت (Custom Title / Nickname)
                        </label>
                        <input
                            type="text"
                            value={profileInfo.designNotes}
                            onChange={(e) => setProfileInfo((p) => ({ ...p, designNotes: e.target.value }))}
                            placeholder="مثال: THE GOAT، ملك القهوة، EL MAESTRO..."
                            maxLength={60}
                            className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black/70 text-xs text-white font-space focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-200 placeholder:text-gray-500"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 gap-3 flex-wrap sm:flex-nowrap">
                    {renderBackButton()}
                    <button
                        onClick={() => {
                            if (!isReady) return;
                            startDescribeAIGeneration();
                        }}
                        disabled={!isReady}
                        className={`group relative flex-1 sm:flex-initial px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F6D365] to-[#D4AF37] text-black font-black font-space text-lg shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                            !isReady ? "opacity-40 pointer-events-none" : "shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                        }`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5 fill-black" />
                            <span>توليد ومعاينة الكارت الآن 🚀</span>
                        </span>
                    </button>
                </div>
            </motion.div>
        );
    };

    // ── AI Card Generation for Describe Yourself Mode (Synchronous) ──
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
            const contextText = `${(profileInfo.hobbies || []).join(" ")} ${profileInfo.description || ""} ${profileInfo.designNotes || ""}`.toLowerCase();
            const dynamicResolved = resolveDynamicPositionAndTitle({
                gender: profileInfo.gender,
                age: profileInfo.age,
                description: profileInfo.description,
                hobbies: profileInfo.hobbies,
                designNotes: profileInfo.designNotes,
            });

            const formattedStats = selectedStatCodes.map((code) => {
                const val = statValues[code] || 75;
                const statDef = getStatByCode(code);
                return {
                    code,
                    value: val,
                    note: extractNotesFromContext(code, val, contextText),
                    emoji: statDef?.emoji || "⭐",
                };
            });
            const overall = calculateOverall(formattedStats);

            const response = await fetch("/api/generate-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    photo: uploadPreview,
                    profileInfo: {
                        ...profileInfo,
                        position: dynamicResolved.position,
                    },
                    cardData: {
                        ...cardData,
                        position: dynamicResolved.position,
                    },
                    stats: formattedStats,
                    overallRating: overall,
                    mode: "full-ai",
                }),
            });

            const data = await response.json();
            clearInterval(progressInterval);

            if (!response.ok) {
                if (response.status === 429 || data.cooldownRemainingSeconds) {
                    setRemainingGenerations(0);
                    setCooldownRemainingSeconds(data.cooldownRemainingSeconds || 86400);
                    setIsCooldownActive(true);
                }
                throw new Error(data.error || "Failed to generate card");
            }

            if (typeof data.remainingGenerations === "number") {
                setRemainingGenerations(data.remainingGenerations);
                if (data.remainingGenerations <= 0) {
                    setIsCooldownActive(true);
                    setCooldownRemainingSeconds(data.cooldownRemainingSeconds || 86400);
                }
            }

            setGeneratedCardUrl(data.imageUrl);
            setEditorBgUrl(data.imageUrl);
            trackCardGenerated();
            saveCardToLocalStorage(data.imageUrl, {
                editorName: profileInfo.name || dynamicResolved.title,
                editorSubtitle: dynamicResolved.bio || profileInfo.description?.slice(0, 50) || "Born to be legendary",
                editorPosition: dynamicResolved.position,
                editorRating: overall,
                editorStats: formattedStats,
            });
            setGenerationProgress(100);
            setIsGenerating(false);
            setRevealCard(true);
            setShowConfetti(true);

            setTimeout(() => {
                setCurrentStep("checkout");
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
                        className="flex flex-col items-center gap-1 px-10 py-6 rounded-3xl bg-neutral-950 border-2 border-[#D4AF37] shadow-[0_10px_35px_rgba(212,175,55,0.25)]"
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
                            <div key={code} className="space-y-2 rounded-2xl border border-white/10 bg-neutral-950/90 p-4">
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
                            {isCooldownActive ? "Daily Limit Reached (3/3 Used)" : "Generation Failed"}
                        </h2>
                        {isCooldownActive && (
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100/70 border border-amber-300 text-amber-900 rounded-xl font-mono text-lg font-bold">
                                <span>⏳ Refreshing in {formatCooldownTime(cooldownRemainingSeconds)}</span>
                            </div>
                        )}
                        <p className="text-gray-600 font-space text-sm">
                            {generationError || "You have used your 3 AI card generations for today. Your 3 generations refresh automatically every 24 hours."}
                        </p>
                    </div>

                    {!isCooldownActive && (
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
                            <button
                                onClick={startAIGeneration}
                                className="px-6 py-3 bg-[#E5A500] hover:bg-[#C98600] text-white font-bold font-space rounded-2xl shadow-sm transition-all cursor-pointer"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </motion.div>
            );
        }

        const generationSteps = [
            { ar: "تحليل المسيرة والشخصية", en: "Analyzing Persona & Career History", icon: Brain },
            { ar: "معالجة ملامح الوجه 3D", en: "AI Facial & Identity Synthesis", icon: Camera },
            { ar: "توليد الخلفية السينمائية", en: "Crafting Thematic Cinematic Scene", icon: Sparkles },
            { ar: "حساب الستاتيكس والتقييم", en: "Calculating Cultural Stats & OVR", icon: SlidersHorizontal },
            { ar: "صقل الدرع الذهبي الفاخر", en: "Forging 3D Metallic Gold Shield", icon: Trophy },
        ];
        const currentStepIdx = Math.min(
            Math.floor((generationProgress / 100) * generationSteps.length),
            generationSteps.length - 1
        );
        const currentStepData = generationSteps[currentStepIdx] || generationSteps[0];
        const StepIcon = currentStepData.icon;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative flex flex-col items-center justify-center min-h-[75vh] py-8 text-center"
            >
                {/* Ambient Golden Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(246,211,101,0.08) 45%, transparent 70%)" }} />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none animate-pulse" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)" }} />

                {/* 3D Holographic Card Forging Container */}
                <div className="relative mb-8">
                    {/* Outer Rotating Energy Ring */}
                    <motion.div
                        className="absolute -inset-6 rounded-[42px] border border-[#D4AF37]/20 border-dashed"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Inner Counter-Rotating Ring */}
                    <motion.div
                        className="absolute -inset-3 rounded-[36px] border border-[#F6D365]/30"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Holographic Card Shield Preview */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotateY: [0, 6, 0, -6, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative w-56 sm:w-64 aspect-[3/4.2] rounded-[28px] overflow-hidden bg-gradient-to-b from-[#1C180C] via-[#120F08] to-[#080704] border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.35)] flex flex-col items-center justify-center p-4"
                        style={{ perspective: 1000 }}
                    >
                        {/* Shimmer / Laser Scanner Line */}
                        <motion.div
                            className="absolute inset-x-0 h-2 bg-gradient-to-r from-transparent via-[#F6D365] to-transparent shadow-[0_0_20px_#F6D365] z-30 opacity-80"
                            animate={{ top: ["-10%", "110%"] }}
                            transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                        {/* Subject Photo / Shield Hologram */}
                        {uploadPreview ? (
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#D4AF37]/30">
                                <Image
                                    src={uploadPreview}
                                    alt="Subject preview"
                                    fill
                                    className="object-cover opacity-60 filter brightness-90 contrast-125"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-[#D4AF37]/10" />
                                {/* Glowing Center Rune */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-neutral-950 border border-[#D4AF37] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.5)]">
                                        <StepIcon className="w-7 h-7 text-[#F6D365] animate-pulse" />
                                    </div>
                                    <span className="text-[10px] font-space font-black uppercase tracking-widest text-[#F6D365] bg-black/80 px-2.5 py-1 rounded-full border border-[#D4AF37]/40 shadow-sm">
                                        FLAWLESS AI
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                                    <Sparkles className="w-8 h-8 text-[#F6D365] animate-spin" style={{ animationDuration: "6s" }} />
                                </div>
                                <span className="text-xs font-space font-bold uppercase tracking-widest text-[#F6D365]">
                                    3D CARD FORGE
                                </span>
                            </div>
                        )}

                        {/* Card Hologram Grid Pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                    </motion.div>
                </div>

                {/* Dynamic Status Text with Bilingual Display */}
                <div className="space-y-3 max-w-md px-4 mb-6 z-10">
                    <motion.div
                        key={currentStepData.ar}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-1.5"
                    >
                        <h2 className="text-2xl sm:text-3xl font-black font-space text-white leading-tight" dir="rtl">
                            <span className="text-gold-grad">{currentStepData.ar}</span>
                        </h2>
                        <p className="text-xs sm:text-sm font-space text-gray-300 tracking-wide">
                            {currentStepData.en}...
                        </p>
                    </motion.div>
                </div>

                {/* High-End Golden Progress Bar & Ticker */}
                <div className="w-full max-w-sm px-4 space-y-3 z-10">
                    <div className="relative w-full h-3 rounded-full bg-black/80 border border-white/10 overflow-hidden shadow-inner p-0.5">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-[#8A6D1C] via-[#D4AF37] to-[#FFF0A0] shadow-[0_0_15px_#F6D365]"
                            initial={{ width: 0 }}
                            animate={{ width: `${generationProgress}%` }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs font-space">
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                            <span>جارِ التوليد (Generating)</span>
                        </div>
                        <span className="font-black text-base text-[#F6D365] font-sora">
                            {Math.round(generationProgress)}%
                        </span>
                    </div>

                    {/* Step Pills Indicator */}
                    <div className="grid grid-cols-5 gap-1.5 pt-2">
                        {generationSteps.map((s, idx) => {
                            const isDone = idx < currentStepIdx;
                            const isCurrent = idx === currentStepIdx;
                            return (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        isDone
                                            ? "bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]"
                                            : isCurrent
                                            ? "bg-[#F6D365] animate-pulse shadow-[0_0_8px_#F6D365]"
                                            : "bg-white/10"
                                    }`}
                                />
                            );
                        })}
                    </div>
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

                <div className="flex justify-center">
                    {/* Card Preview */}
                    <div className="relative w-full max-w-sm aspect-[2/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E180A] via-[#12100A] to-[#0A0905] border-2 border-[#E5A500] shadow-[0_12px_40px_rgba(229,165,0,0.15)] flex flex-col justify-between">
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
                </div>

                <div className="flex items-center justify-between pt-6 flex-wrap gap-4" dir="rtl">
                    <button
                        onClick={() => {
                            // Navigate back to upload step so user can review/edit any step with inputs intact
                            setCurrentStep("upload");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-bold font-space text-sm transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <Sparkles className="w-4 h-4 text-[#E5A500]" />
                        تعديل المعطيات / Regenerate
                    </button>

                    {renderNextButton(false, "اطلب كارتتك الآن 🚀")}
                </div>
            </motion.div>
        );
    };

    const TUNISIA_GOVERNORATES = [
        "تونس",
        "أريانة",
        "بن عروس",
        "منوبة",
        "نابل",
        "زغوان",
        "بنزرت",
        "باجة",
        "جندوبة",
        "الكاف",
        "سليانة",
        "سوسة",
        "المنستير",
        "المهدية",
        "صفاقس",
        "القيروان",
        "القصرين",
        "سيدي بوزيد",
        "قابص",
        "مدنين",
        "تطاوين",
        "قفصة",
        "توذر",
        "قبلي",
    ];

    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrderError(null);

        const nameToUse = orderForm.customerName || profileInfo.name || editorName;
        if (!nameToUse.trim()) {
            setOrderError("الرجاء إدخال الاسم واللقب الكامل");
            return;
        }

        if (!orderForm.phone.trim() || orderForm.phone.trim().length < 8) {
            setOrderError("الرجاء إدخال رقم هاتف تونسي صحيح (8 أرقام)");
            return;
        }

        if (!orderForm.city.trim() || !orderForm.address.trim()) {
            setOrderError("الرجاء إدخال المدينة والعنوان الكامل للتوصيل");
            return;
        }

        setIsSubmittingOrder(true);

        try {
            const cardImg = generatedCardUrl || uploadPreview || editorBgUrl;
            const unitPrice = selectedSize === "mega" ? 69 : 49;
            const deliveryFee = 8;
            const totalPrice = (orderForm.quantity * unitPrice) + deliveryFee;

            const payload = {
                customerName: nameToUse.trim(),
                phone: orderForm.phone.trim(),
                governorate: orderForm.governorate,
                city: orderForm.city.trim(),
                address: orderForm.address.trim(),
                cardSize: selectedSize,
                quantity: orderForm.quantity,
                unitPrice,
                deliveryFee,
                totalPrice,
                cardImageUrl: cardImg,
                notes: orderForm.notes.trim(),
                // Card metadata for high-res PDF generation
                playerName: nameToUse.toUpperCase(),
                rating: overallRating || editorRating || 99,
                position: editorPosition || "GOAT",
                stats: editorStats,
                badges: editorBadges,
                subtitle: editorSubtitle || "Born to be legendary",
                description: editorDescription || "Skill • Charisma • Influence • Focus",
                quoteFr: editorQuoteFr,
                quoteAr: editorQuoteAr,
                hashtags: editorHashtags,
                accentColor: editorAccentColor,
                affiliateCode: (affiliateInputCode || getAffiliateCode() || "").trim().toUpperCase() || null,
            };

            const codeToPersist = (affiliateInputCode || getAffiliateCode() || "").trim().toUpperCase();
            if (codeToPersist) {
                localStorage.setItem("flw_ref", codeToPersist);
                const maxAge = 30 * 24 * 60 * 60;
                document.cookie = `flw_ref=${encodeURIComponent(codeToPersist)}; max-age=${maxAge}; path=/; SameSite=Lax`;
            }

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "فشل تسجيل الطلب");
            }

            // Meta Pixel: Purchase — fires ONLY after server confirms order
            trackPurchase({
                value: totalPrice,
                content_name: `Flawless Card - ${selectedSize === "mega" ? "Mega 60x40cm" : "Standard 45x30cm"}`,
                content_ids: [data.orderId],
                num_items: orderForm.quantity,
            });
            // Reset checkout-fired flag so a new order can fire InitiateCheckout again
            if (typeof window !== "undefined") {
                (window as any).__fbq_checkout_fired = false;
            }

            setOrderSuccessModal({
                visible: true,
                orderId: data.orderId || `FLW-${Math.floor(100000 + Math.random() * 900000)}`,
                details: {
                    name: nameToUse.trim(),
                    phone: orderForm.phone.trim(),
                    governorate: orderForm.governorate,
                    city: orderForm.city.trim(),
                    address: orderForm.address.trim(),
                    size: selectedSize === "mega" ? "60x40 cm (Mega Giant)" : "45x30 cm (Standard)",
                    quantity: orderForm.quantity,
                    totalPrice,
                },
            });
        } catch (err: any) {
            console.error("Order submission error:", err);
            setOrderError(err.message || "حدث خطأ أثناء تسجيل الطلب. الرجاء المحاولة مرة أخرى.");
        } finally {
            setIsSubmittingOrder(false);
        }
    };

    const renderCheckout = () => {
        const nameToDisplay = profileInfo.name || editorName || "LEGEND";
        const unitPrice = selectedSize === "mega" ? 69 : 49;
        const deliveryFee = 8;
        const subtotal = unitPrice * orderForm.quantity;
        const totalPrice = subtotal + deliveryFee;
        const cardImg = generatedCardUrl || uploadPreview || editorBgUrl;

        // Meta Pixel: InitiateCheckout when checkout form renders
        // (useEffect-like via ref guard not needed here — renderCheckout only runs when currentStep === 'checkout')
        // We use a static flag to avoid duplicate fires on re-renders
        if (typeof window !== "undefined") {
            const checkoutFiredKey = "__fbq_checkout_fired";
            if (!(window as any)[checkoutFiredKey]) {
                (window as any)[checkoutFiredKey] = true;
                trackInitiateCheckout({
                    content_name: `Flawless Card - ${selectedSize === "mega" ? "Mega" : "Standard"}`,
                    value: totalPrice,
                    num_items: orderForm.quantity,
                });
            }
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-10 max-w-4xl mx-auto"
                dir="rtl"
            >
                <div className="space-y-3 text-center sm:text-right">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5A500]/10 border border-[#E5A500]/30 text-[#E5A500] text-xs font-bold font-space">
                        <Truck className="w-4 h-4" />
                        <span>الدفع عند التوصيل 100% (Cash on Delivery)</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                        تأكيد طلب <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">الكارت الأسطوري</span>
                    </h1>
                    <p className="text-gray-400 font-space text-sm sm:text-base max-w-lg">
                        أدخل معطياتك ليصلك الكارت مطبوعاً بأعلى جودة PVC إلى باب منزلك مع التوصيل لكل الولايات التونسية.
                    </p>
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Form side (7 cols) */}
                    <div className="lg:col-span-7 bg-neutral-950/90 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-6">
                        <h3 className="text-xl font-bold text-white font-sora flex items-center gap-2">
                            <UserCircle className="w-5 h-5 text-[#E5A500]" />
                            معلومات التوصيل والطلب
                        </h3>

                        {/* Size Picker */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-gray-300 font-space uppercase tracking-wider">
                                اختر الحجم (Card Size):
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedSize("standard")}
                                    className={`p-4 rounded-2xl border transition-all text-right cursor-pointer flex flex-col justify-between ${
                                        selectedSize === "standard"
                                            ? "border-[#E5A500] bg-[#E5A500]/10 shadow-[0_0_20px_rgba(229,165,0,0.15)]"
                                            : "border-white/10 bg-white/5 hover:border-white/20"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-sm text-white">45×30 cm</span>
                                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSize === "standard" ? "border-[#E5A500] bg-[#E5A500]" : "border-gray-500"}`}>
                                            {selectedSize === "standard" && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400">Standard Pack</div>
                                    <div className="text-lg font-black text-[#E5A500] mt-1">49 DT</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedSize("mega")}
                                    className={`p-4 rounded-2xl border transition-all text-right cursor-pointer flex flex-col justify-between ${
                                        selectedSize === "mega"
                                            ? "border-[#E5A500] bg-[#E5A500]/10 shadow-[0_0_20px_rgba(229,165,0,0.15)]"
                                            : "border-white/10 bg-white/5 hover:border-white/20"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-sm text-white">60×40 cm</span>
                                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSize === "mega" ? "border-[#E5A500] bg-[#E5A500]" : "border-gray-500"}`}>
                                            {selectedSize === "mega" && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400">Mega Giant Pack</div>
                                    <div className="text-lg font-black text-[#E5A500] mt-1">69 DT</div>
                                </button>
                            </div>
                        </div>

                        {orderError && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-space font-semibold">
                                ⚠️ {orderError}
                            </div>
                        )}

                        <form onSubmit={handleOrderSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-300 font-space mb-1.5">
                                    الاسم واللقب الكامل <span className="text-[#E5A500]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={orderForm.customerName || profileInfo.name || editorName}
                                    onChange={(e) => setOrderForm((prev) => ({ ...prev, customerName: e.target.value }))}
                                    placeholder="مثال: محمد بن علي"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E5A500] transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-300 font-space mb-1.5">
                                        رقم الهاتف (8 أرقام) <span className="text-[#E5A500]">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        maxLength={8}
                                        value={orderForm.phone}
                                        onChange={(e) => setOrderForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "") }))}
                                        placeholder="22 123 456"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E5A500] transition-colors font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-300 font-space mb-1.5">
                                        الولاية <span className="text-[#E5A500]">*</span>
                                    </label>
                                    <select
                                        value={orderForm.governorate}
                                        onChange={(e) => setOrderForm((prev) => ({ ...prev, governorate: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E5A500] transition-colors"
                                    >
                                        {TUNISIA_GOVERNORATES.map((gov) => (
                                            <option key={gov} value={gov}>
                                                {gov}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-300 font-space mb-1.5">
                                        المدينة / المعتمدية <span className="text-[#E5A500]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={orderForm.city}
                                        onChange={(e) => setOrderForm((prev) => ({ ...prev, city: e.target.value }))}
                                        placeholder="مثال: أريانة المدينة"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E5A500] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-300 font-space mb-1.5">
                                        الكمية (Quantity)
                                    </label>
                                    <select
                                        value={orderForm.quantity}
                                        onChange={(e) => setOrderForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E5A500] transition-colors"
                                    >
                                        {[1, 2, 3, 4, 5, 10].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? "كارت" : "كروت"}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-300 font-space mb-1.5">
                                    العنوان التفصيلي <span className="text-[#E5A500]">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={orderForm.address}
                                    onChange={(e) => setOrderForm((prev) => ({ ...prev, address: e.target.value }))}
                                    placeholder="النهج، رقم العمارة / الشقة، الإقامة أو علامة مميزة..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E5A500] transition-colors resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 font-space mb-1.5 flex items-center justify-between">
                                    <span>كود الإحالة / الشريك (اختياري)</span>
                                    {affiliateInputCode ? (
                                        <span className="text-emerald-400 text-[10px] font-bold">🟢 كود مفعّل</span>
                                    ) : (
                                        <span className="text-gray-500 text-[10px]">إذا عندك كود من صديق</span>
                                    )}
                                </label>
                                <input
                                    type="text"
                                    value={affiliateInputCode}
                                    onChange={(e) => {
                                        const cleanVal = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
                                        setAffiliateInputCode(cleanVal);
                                        if (cleanVal) {
                                            localStorage.setItem("flw_ref", cleanVal);
                                        }
                                    }}
                                    placeholder="مثال: KHALILTIME1"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#E5A500] placeholder-gray-600 text-xs font-mono font-bold focus:outline-none focus:border-[#E5A500] transition-colors uppercase tracking-wider"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 font-space mb-1.5">
                                    ملاحظات للتوصيل (اختياري)
                                </label>
                                <input
                                    type="text"
                                    value={orderForm.notes}
                                    onChange={(e) => setOrderForm((prev) => ({ ...prev, notes: e.target.value }))}
                                    placeholder="أي تعليمات إضافية للموزّع..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#E5A500] transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingOrder}
                                className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-[#E5A500] to-[#C98600] hover:from-[#C98600] hover:to-[#A36A00] text-black font-black font-space text-lg shadow-[0_8px_30px_rgba(229,165,0,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmittingOrder ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>جاري تسجيل الطلب...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>تأكيد الطلب — {totalPrice} DT</span>
                                        <ArrowRight className="w-5 h-5 rotate-180" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Summary side (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Card preview thumbnail */}
                        <div className="bg-neutral-950/90 border border-white/10 p-5 rounded-3xl space-y-4">
                            <div className="text-xs font-bold text-gray-400 font-space uppercase tracking-wider">
                                معاينة الكارت المطاطي
                            </div>
                            <div className="relative aspect-[2/3] w-full max-w-[200px] mx-auto rounded-2xl overflow-hidden border border-[#E5A500]/50 shadow-lg">
                                {cardImg ? (
                                    <Image src={cardImg} alt="Card preview" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-gray-500 text-xs font-space">
                                        لا توجد صورة
                                    </div>
                                )}
                            </div>
                            <div className="text-center space-y-1">
                                <div className="font-bold text-white font-sora text-base">{nameToDisplay}</div>
                                <div className="text-xs text-[#E5A500] font-space font-semibold">OVR {overallRating || 87}</div>
                            </div>
                        </div>

                        {/* Order breakdown */}
                        <div className="bg-neutral-950/90 border border-white/10 p-6 rounded-3xl space-y-4">
                            <h4 className="font-bold text-white font-sora text-base">تفاصيل الفاتورة</h4>
                            <div className="space-y-2.5 text-xs font-space">
                                <div className="flex justify-between text-gray-300">
                                    <span>نوع الحجم:</span>
                                    <span className="font-bold text-white">
                                        {selectedSize === "mega" ? "Mega Giant (60×40 cm)" : "Standard (45×30 cm)"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>سعر الكارت:</span>
                                    <span className="font-bold text-white">{unitPrice} DT</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>الكمية:</span>
                                    <span className="font-bold text-white">{orderForm.quantity}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>مجموع الكروت:</span>
                                    <span className="font-bold text-white">{subtotal} DT</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>مصاريف التوصيل:</span>
                                    <span className="font-bold text-white">{deliveryFee} DT</span>
                                </div>
                                {getAffiliateCode() && (
                                    <div className="flex justify-between items-center text-xs px-2.5 py-1.5 rounded-lg bg-[#E5A500]/15 border border-[#E5A500]/30 text-[#E5A500]">
                                        <span>كود الإحالة المفعّل:</span>
                                        <span className="font-mono font-bold font-space">@{getAffiliateCode()}</span>
                                    </div>
                                )}
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex justify-between text-base font-bold text-white">
                                    <span>المجموع الجملي:</span>
                                    <span className="text-[#E5A500] font-black text-lg">{totalPrice} DT</span>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-[#E5A500]/10 border border-[#E5A500]/30 text-center text-xs font-space text-[#E5A500] font-semibold flex items-center justify-center gap-2">
                                <span>💵</span>
                                <span>الدفع نقداً عند الاستلام من الموزّع</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setCurrentStep("review")}
                            className="text-gray-400 hover:text-white transition-colors text-xs font-space flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4 rotate-180" />
                            العودة لمراجعة الكارت
                        </button>
                    </div>
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
            <div className="hidden lg:flex flex-col h-full py-8 px-6 border-r border-white/10 bg-neutral-950 text-white shadow-2xl min-w-[280px]">
                {/* Logo & Return Link */}
                <div className="flex items-center justify-between gap-3 mb-10">
                    <a href="/" className="inline-flex items-center gap-2">
                        <img src="/images/logo.webp" alt="Flawless" className="w-32 h-10 object-contain object-left" />
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

            {/* Background glow using lightweight radial-gradient instead of heavy 200px GPU blurs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(246,211,101,0.06) 0%, transparent 70%)" }} />
            </div>

            {/* Confetti overlay */}
            <AnimatePresence>
                {showConfetti && mounted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
                    >
                        {[...Array(24)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2.5 h-2.5 rounded-sm"
                                style={{
                                    left: `${(i * 4.2 + 2)}%`,
                                    top: -10,
                                    background: [
                                        "#E5A500",
                                        "#C98600",
                                        "#FF6B6B",
                                        "#4ECDC4",
                                        "#FFE66D",
                                        "#A78BFA",
                                    ][i % 6],
                                }}
                                animate={{
                                    y: "110vh",
                                    rotate: 360,
                                    opacity: [1, 1, 0],
                                }}
                                transition={{
                                    duration: 2.2 + (i % 4) * 0.3,
                                    delay: (i % 5) * 0.15,
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
                    {/* Mobile 3-Step Sticky Progress Bar */}
                    {renderMobileProgressBar()}

                    {/* Content */}
                    <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-12">
                        <div className="max-w-4xl mx-auto">
                            {/* Top bar */}
                            <div className="flex items-center justify-between mb-6 lg:mb-14">
                                <div className="flex items-center gap-4">
                                    {renderBackButton()}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`px-2.5 py-1 rounded-full border text-[11px] font-bold font-mono flex items-center gap-1.5 ${remainingGenerations > 0 ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"}`}>
                                        <span>⚡ {remainingGenerations}/{totalGenerations} متبقية</span>
                                    </div>
                                    {renderStepIndicator()}
                                </div>
                            </div>

                            {/* Content */}
                            <AnimatePresence mode="wait">
                                {renderContent()}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Success Confirmation Modal */}
            {orderSuccessModal?.visible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fade-in" dir="rtl">
                    <div className="relative w-full max-w-lg p-6 sm:p-8 bg-neutral-900 border border-[#E5A500]/40 rounded-3xl shadow-2xl space-y-6 text-right">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#E5A500]/20 border border-[#E5A500] flex items-center justify-center text-[#E5A500]">
                                <CheckCircle2 className="w-9 h-9" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black font-sora text-white">
                                تم تسجيل طلبك بنجاح! 🎉
                            </h3>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E5A500]/10 border border-[#E5A500]/30 text-[#E5A500] rounded-xl font-mono text-sm font-bold">
                                <span>رقم الطلب: {orderSuccessModal.orderId}</span>
                            </div>
                            <p className="text-gray-300 font-space text-sm max-w-md mx-auto leading-relaxed">
                                شكراً لك! سيتم التواصل معك عبر الهاتف لتأكيد التوصيل. كارتتك الأسطورية ستصلك مطبوعة خلال 2 إلى 4 أيام عمل.
                            </p>
                        </div>

                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2.5 text-xs font-space">
                            <div className="flex justify-between text-gray-300">
                                <span>صاحب الطلب:</span>
                                <span className="font-bold text-white">{orderSuccessModal.details.name}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>رقم الهاتف:</span>
                                <span className="font-bold text-white font-mono">{orderSuccessModal.details.phone}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>مكان التوصيل:</span>
                                <span className="font-bold text-white">{orderSuccessModal.details.governorate} - {orderSuccessModal.details.city}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>الحجم والكمية:</span>
                                <span className="font-bold text-white">{orderSuccessModal.details.size} (×{orderSuccessModal.details.quantity})</span>
                            </div>
                            <div className="h-px bg-white/10 my-2" />
                            <div className="flex justify-between text-sm font-bold text-white">
                                <span>المبلغ عند التوصيل:</span>
                                <span className="text-[#E5A500] font-black text-base">{orderSuccessModal.details.totalPrice} DT</span>
                            </div>
                        </div>

                        <div className="pt-2 text-center flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    setOrderSuccessModal(null);
                                    setCurrentStep("upload");
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="flex-1 py-3 px-4 rounded-xl bg-[#E5A500] hover:bg-[#C98600] text-black font-bold font-space text-sm transition-all cursor-pointer"
                            >
                                تصميم كارت جديد 🚀
                            </button>
                            <a
                                href="/"
                                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold font-space text-sm text-center transition-all cursor-pointer"
                            >
                                الصفحة الرئيسية
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Cooldown Share Unlock Popup Modal */}
            {showCooldownModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in">
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
                                Daily Limit Reached (3/3 Used)
                            </h3>
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-mono text-lg font-bold">
                                <span>⏳ Refreshing in {formatCooldownTime(cooldownRemainingSeconds)}</span>
                            </div>
                            <p className="text-gray-600 font-space text-sm max-w-sm mx-auto">
                                You have used all 3 AI card generations for today. Generations refresh automatically every 24 hours.
                            </p>
                        </div>

                        <div className="pt-2 text-center">
                            <button
                                onClick={() => setShowCooldownModal(false)}
                                className="w-full py-3 bg-[#111827] hover:bg-[#1f2937] text-white font-bold font-space rounded-2xl shadow-sm transition-all cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Toast Notification */}
            <AnimatePresence>
                {shareToast.visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 z-[100] px-6 py-4 bg-neutral-950 border border-[#D4AF37]/40 text-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] max-w-sm text-center"
                        dir="rtl"
                    >
                        <p className="text-sm font-bold font-space leading-relaxed">{shareToast.message}</p>
                        <button
                            onClick={() => setShareToast({ message: "", visible: false })}
                            className="mt-2 text-[#F6D365] text-xs font-bold hover:underline cursor-pointer"
                        >
                            حسناً ✓
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Live Social Proof Recent Order Activity Pill (Clever Affichage) */}
            <RecentOrderPopup currentStep={currentStep} selectedCount={selectedStatCodes.length} />
        </div>
    );
}