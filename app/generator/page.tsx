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
    ListChecks
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
    | "editor"
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
    hobbies: string;
    description: string;
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

// ─── AI Interview Questions ───────────────────────────────────────────────

const AI_INTERVIEW_QUESTIONS = [
    {
        id: "social",
        question: "How would your friends describe you in one word?",
        options: ["The Funny One", "The Smart One", "The Leader", "The Chill One", "The Crazy One", "The Drama King/Queen"],
    },
    {
        id: "morning",
        question: "What does your typical morning look like?",
        options: ["Sleep until noon", "Coffee first, everything else later", "Gym then hustle", "Late to everything", "Up at 5am like a legend"],
    },
    {
        id: "money",
        question: "How do you handle money?",
        options: ["Spend it all day 1", "Save every millime", "Invest wisely", "Borrow from friends", "What money?"],
    },
    {
        id: "conflict",
        question: "When there's drama, you...",
        options: ["Start it", "Watch from the side", "Fix it", "Run away", "Make jokes about it"],
    },
    {
        id: "superpower",
        question: "If you had a Tunisian superpower, it would be...",
        options: ["Unlimited wasta", "Never-ending sabr", "Master negotiator", "Escape any situation", "Make everyone laugh"],
    },
];

// ─── Constants ────────────────────────────────────────────────────────────

const ALL_STEPS: { id: Step; label: string; icon: React.ComponentType<any> }[] = [
    { id: "mode", label: "Card Type", icon: Wand2 },
    { id: "upload", label: "Upload Photo", icon: Camera },
    { id: "profile", label: "Your Info", icon: UserCircle },
    { id: "stats-pick", label: "Pick Stats", icon: ListChecks },
    { id: "stats-values", label: "Set Values", icon: SlidersHorizontal },
    { id: "personality", label: "Personality", icon: Brain },
    { id: "ai-interview", label: "AI Questions", icon: MessageCircle },
    { id: "ai", label: "AI Generation", icon: Sparkles },
    { id: "editor", label: "Customize", icon: PenTool },
    { id: "review", label: "Review", icon: Eye },
    { id: "checkout", label: "Checkout", icon: CreditCard },
];

const PERSONALITY_QUESTIONS = [
    {
        id: "talent",
        question: "What's their biggest talent?",
        options: ["Music", "Sports", "Comedy", "Intelligence", "Art", "Dance"],
    },
    {
        id: "weakness",
        question: "What's their biggest weakness?",
        options: ["Sleepy", "Food", "Phone", "Lazy", "Shy", "Gaming"],
    },
    {
        id: "words",
        question: "Choose three words that describe them.",
        options: ["Cool", "Savage", "Kind", "Strong", "Smart", "Fun", "Sweet", "Royal"],
        multi: true,
    },
    {
        id: "activity",
        question: "What's their favorite activity?",
        options: ["Football", "Gaming", "Reading", "Music", "Gym", "Cooking"],
    },
    {
        id: "coffeeLevel",
        question: "How much coffee do they need?",
        options: ["Light", "Medium", "Strong", "Espresso", "None"],
    },
    {
        id: "sleepLevel",
        question: "How late do they sleep?",
        options: ["Early bird", "Night owl", "Insomniac", "Vampire"],
    },
    {
        id: "phrase",
        question: "What's their most used phrase?",
        options: ["Yalla", "Inshallah", "Wallah", "3ayech", "Habibi", "Yessir"],
    },
    {
        id: "lateLevel",
        question: "How late are they usually?",
        options: ["Always on time", "5 min late", "15 min late", "Always late"],
    },
    {
        id: "funnyLevel",
        question: "How funny are they?",
        options: ["Not funny", "A little", "Funny", "Hilarious", "Savage"],
    },
    {
        id: "loved",
        question: "Does everyone love them?",
        options: ["Yes", "No", "Mixed"],
    },
    {
        id: "friendGroup",
        question: "Who are they in the friend group?",
        options: ["The Leader", "The Clown", "The Smart One", "The Protector", "The Heart", "The Party"],
    },
];

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
    const [currentStep, setCurrentStep] = useState<Step>("mode");
    const [cardData, setCardData] = useState<CardData>({
        recipient: null,
        mode: null,
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
    const [editorAccentColor, setEditorAccentColor] = useState("#E5A500");

    // ── Custom Card Editor State ──
    const [editorName, setEditorName] = useState("LEGEND");
    const [editorSubtitle, setEditorSubtitle] = useState("Born to be legendary");
    const [editorPosition, setEditorPosition] = useState("GOAT");
    const [editorRating, setEditorRating] = useState(99);
    const [editorStats, setEditorStats] = useState<CardStat[]>([
        { label: "Skill", value: 90 },
        { label: "Charisma", value: 88 },
        { label: "Influence", value: 85 },
        { label: "Focus", value: 92 },
        { label: "Energy", value: 87 },
        { label: "Vibes", value: 95 },
    ]);
    const [editorBadges, setEditorBadges] = useState<CardBadge[]>([
        { title: "LEGEND" },
        { title: "UNSTOPPABLE" },
        { title: "ORIGINAL" },
    ]);
    const [editorQuoteFr, setEditorQuoteFr] = useState("Born different, made legendary");
    const [editorQuoteAr, setEditorQuoteAr] = useState("أسطورة من تونس");
    const [editorHashtags, setEditorHashtags] = useState(["TUNISIA", "LEGEND", "GOAT", "VIBES", "BLEDI"]);
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
        hobbies: "",
        description: "",
    });
    const [selectedStatCodes, setSelectedStatCodes] = useState<string[]>([]);
    const [statValues, setStatValues] = useState<Record<string, number>>({});

    // ── AI Interview State ──
    const [aiInterviewIndex, setAiInterviewIndex] = useState(0);
    const [aiInterviewAnswers, setAiInterviewAnswers] = useState<Record<string, string>>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    // ── Mode-aware step flow ──
    const getStepsForMode = (mode: CardMode): Step[] => {
        if (mode === "describe") {
            // Describe Yourself: profile info → photo → pick stats → set values → editor → review → checkout
            return ["mode", "upload", "profile", "stats-pick", "stats-values", "editor", "review", "checkout"];
        }
        if (mode === "ai-describe") {
            // Let AI Describe You: photo → AI interview → AI generation → editor → review → checkout
            return ["mode", "upload", "ai-interview", "ai", "editor", "review", "checkout"];
        }
        // No mode selected yet
        return ["mode"];
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

            // Step 2: Generate AI background image
            const bgResponse = await fetch("/api/generate-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    photo: uploadPreview,
                    cardData,
                    overallRating: aiCardData.overall || 85,
                    mode: "custom",
                    freeDescription: aiCardData.bio || "",
                }),
            });

            const bgData = await bgResponse.json();
            clearInterval(progressInterval);

            if (!bgResponse.ok) {
                throw new Error(bgData.error || "Failed to generate card background");
            }

            setGeneratedCardUrl(bgData.imageUrl);
            setEditorBgUrl(bgData.imageUrl);
            setGenerationProgress(100);
            setIsGenerating(false);
            setRevealCard(true);
            setShowConfetti(true);

            setTimeout(() => {
                setCurrentStep("editor");
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

    // ── Hybrid: generate AI background for the editor ──
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
                    mode: "custom",
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

    // ── Export card as PNG via server-side Puppeteer ──
    const handleExportCard = async () => {
        setIsExporting(true);
        try {
            const response = await fetch("/api/export-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    baseImageUrl: editorBgUrl,
                    playerName: editorName,
                    subtitle: editorSubtitle,
                    rating: editorRating,
                    position: editorPosition,
                    stats: editorStats,
                    badges: editorBadges,
                    quoteFr: editorQuoteFr,
                    quoteAr: editorQuoteAr,
                    hashtags: editorHashtags,
                    description: editorDescription,
                    accentColor: editorAccentColor,
                }),
            });

            if (!response.ok) throw new Error("Export failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${editorName.replace(/\s+/g, "_")}_card.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error("Export failed:", err);
            alert("Export failed. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleFileUpload = (file: File) => {
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadPreview(e.target?.result as string);
            updateCardData("photo", e.target?.result as string);
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
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-300 font-space text-sm cursor-pointer"
            >
                <ChevronLeft className="w-4 h-4" />
                Back
            </button>
        );
    };

    const renderNextButton = (disabled = false, label = "Continue") => {
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
                className={`group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5A500] to-[#C98600] text-white font-bold font-space text-lg shadow-[0_4px_16px_rgba(229,165,0,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer ${
                    disabled ? "opacity-40 pointer-events-none" : ""
                }`}
            >
                <span className="relative z-10 flex items-center gap-2">
                    {isReview ? "Get Card" : label}
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity duration-300" />
            </button>
        );
    };

    // ── Screen Renderers ──

    const renderMode = () => {
        const options: { id: CardMode; label: string; desc: string; icon: React.ComponentType<any>; features: string[] }[] = [
            {
                id: "describe",
                label: "Describe Yourself",
                desc: "Fill your profile, pick 6 Tunisian stats, set your values.",
                icon: PenTool,
                features: ["Manual profile builder", "Pick 6 stats from 68 Tunisian stats", "Set your own stat values (1–99)", "Auto-calculated Overall rating", "Full card customization"],
            },
            {
                id: "ai-describe",
                label: "Let AI Describe You",
                desc: "Answer a few fun questions and AI builds your card.",
                icon: Wand2,
                features: ["AI picks your best 6 stats", "AI-generated ratings & bio", "Personality-matched card style", "AI-generated background", "Full editing after generation"],
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
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold font-sora text-gray-900 leading-[1.1]">
                        Choose your <br />
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            card type
                        </span>
                    </h1>
                    <p className="text-gray-600 font-space text-base max-w-md">
                        Pick how you want your legendary card created.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                className={`relative p-6 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                                    isSelected
                                        ? "border-[#E5A500] bg-[#E5A500]/8 shadow-[0_4px_20px_rgba(229,165,0,0.12)]"
                                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 shadow-sm"
                                }`}
                            >
                                <div className={`mb-3 ${isSelected ? "text-[#C98600]" : "text-gray-400"}`}>
                                    <IconComponent className="w-10 h-10 stroke-[1.5]" />
                                </div>
                                <div className={`font-sora font-bold text-lg mb-1 ${isSelected ? "text-[#C98600]" : "text-gray-800"}`}>
                                    {opt.label}
                                </div>
                                <div className="text-gray-500 font-space text-sm mb-4">
                                    {opt.desc}
                                </div>
                                <ul className="space-y-1.5">
                                    {opt.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-gray-500 font-space">
                                            <Check className="w-3.5 h-3.5 text-[#E5A500] stroke-[2.5] flex-shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
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
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold font-sora text-gray-900 leading-[1.1]">
                        Upload <br />
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            photo
                        </span>
                    </h1>
                    <p className="text-gray-600 font-space text-base max-w-md">
                        Drop an image and watch the magic happen.
                    </p>
                </div>

                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-3xl border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden ${isDragging
                        ? "border-[#E5A500] bg-[#E5A500]/5 shadow-[0_4px_30px_rgba(229,165,0,0.1)]"
                        : isUploaded
                            ? "border-gray-200 bg-white"
                            : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50/50"
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
                                className="relative w-full h-full rounded-2xl overflow-hidden"
                            >
                                <Image
                                    src={uploadPreview!}
                                    alt="Uploaded"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/60 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white text-sm font-space">
                                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 flex items-center gap-1.5 text-xs font-semibold">
                                        <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> Face detected
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 flex items-center gap-1.5 text-xs font-semibold">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> AI Ready
                                    </span>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <ImagePlus className="w-6 h-6 stroke-[1.5]" />
                                </div>
                                <div className="text-gray-800 font-space font-semibold text-lg">
                                    Drop your image here
                                </div>
                                <div className="text-gray-500 font-space text-sm">
                                    or click to browse · PNG, JPG, WEBP
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
                        {renderNextButton(false, "Continue →")}
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
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold font-sora text-gray-900 leading-[1.1]">
                        Tell us about{" "}
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            yourself
                        </span>
                    </h1>
                    <p className="text-gray-600 font-space text-base max-w-md">
                        Fill in your info — this will appear on your card.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="text-sm font-space font-semibold text-gray-700 mb-1.5 block">Name *</label>
                        <input
                            type="text"
                            value={profileInfo.name}
                            onChange={(e) => setProfileInfo((p) => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. Ahmed, Mariem, etc."
                            maxLength={30}
                            className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-space focus:outline-none focus:border-[#E5A500] focus:ring-2 focus:ring-[#E5A500]/10 transition-all duration-200 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Age + Gender row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-space font-semibold text-gray-700 mb-1.5 block">Age</label>
                            <input
                                type="number"
                                value={profileInfo.age}
                                onChange={(e) => setProfileInfo((p) => ({ ...p, age: e.target.value }))}
                                placeholder="e.g. 22"
                                min={1}
                                max={99}
                                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-space focus:outline-none focus:border-[#E5A500] focus:ring-2 focus:ring-[#E5A500]/10 transition-all duration-200 placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-space font-semibold text-gray-700 mb-1.5 block">Gender</label>
                            <div className="flex gap-2">
                                {(["male", "female"] as const).map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setProfileInfo((p) => ({ ...p, gender: g }))}
                                        className={`flex-1 py-3.5 rounded-2xl border text-sm font-space font-semibold transition-all duration-200 cursor-pointer ${
                                            profileInfo.gender === g
                                                ? "border-[#E5A500] bg-[#E5A500]/8 text-[#C98600]"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                        }`}
                                    >
                                        {g === "male" ? "♂ Male" : "♀ Female"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hobbies */}
                    <div>
                        <label className="text-sm font-space font-semibold text-gray-700 mb-1.5 block">Hobbies</label>
                        <input
                            type="text"
                            value={profileInfo.hobbies}
                            onChange={(e) => setProfileInfo((p) => ({ ...p, hobbies: e.target.value }))}
                            placeholder="e.g. Football, Gaming, Music, Gym..."
                            maxLength={100}
                            className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-space focus:outline-none focus:border-[#E5A500] focus:ring-2 focus:ring-[#E5A500]/10 transition-all duration-200 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-space font-semibold text-gray-700 mb-1.5 block">Short Description</label>
                        <textarea
                            value={profileInfo.description}
                            onChange={(e) => setProfileInfo((p) => ({ ...p, description: e.target.value }))}
                            placeholder="What makes you unique? A short bio for your card..."
                            maxLength={200}
                            rows={3}
                            className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 font-space focus:outline-none focus:border-[#E5A500] focus:ring-2 focus:ring-[#E5A500]/10 transition-all duration-200 placeholder:text-gray-400 resize-none"
                        />
                        <span className="text-xs text-gray-400 font-space mt-1 block">{profileInfo.description.length}/200</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    {renderBackButton()}
                    {renderNextButton(!isReady, "Continue →")}
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
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold font-sora text-gray-900 leading-[1.1]">
                        Pick your{" "}
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            6 stats
                        </span>
                    </h1>
                    <p className="text-gray-600 font-space text-base max-w-md">
                        Choose 6 Tunisian stats that best describe you from our collection of 68.
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
                    {renderNextButton(!isReady, "Set Values →")}
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
                throw new Error(data.error || "Failed to generate card");
            }

            setGeneratedCardUrl(data.imageUrl);
            setEditorBgUrl(data.imageUrl);
            setGenerationProgress(100);
            setIsGenerating(false);
            setRevealCard(true);
            setShowConfetti(true);

            setTimeout(() => {
                setCurrentStep("editor");
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
                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold font-sora text-gray-900 leading-[1.1]">
                        Rate your{" "}
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            stats
                        </span>
                    </h1>
                    <p className="text-gray-600 font-space text-base max-w-md">
                        Set each stat value from 1 to 99. Your overall rating is calculated automatically.
                    </p>
                </div>

                {/* Overall badge */}
                <div className="flex items-center justify-center">
                    <motion.div
                        key={currentOverall}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center gap-1 px-8 py-5 rounded-3xl bg-gradient-to-br from-[#1E180A] via-[#12100A] to-[#0A0905] border-2 border-[#E5A500]/60 shadow-[0_8px_30px_rgba(229,165,0,0.2)]"
                    >
                        <span className="text-5xl font-black text-[#E5A500] font-sora leading-none">{currentOverall}</span>
                        <span className="text-[10px] font-bold text-white/70 uppercase font-space tracking-wider">OVERALL</span>
                    </motion.div>
                </div>

                {/* Stat sliders */}
                <div className="space-y-5">
                    {selectedStatCodes.map((code) => {
                        const stat = getStatByCode(code);
                        if (!stat) return null;
                        const val = statValues[code] || 75;
                        return (
                            <div key={code} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{stat.emoji}</span>
                                        <span className="font-space font-bold text-sm text-gray-900">{stat.code}</span>
                                        <span className="font-space text-xs text-gray-500">— {stat.meaning}</span>
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
                                            className="w-14 px-2 py-1.5 rounded-xl border border-gray-200 bg-white text-center text-sm font-bold text-gray-900 font-space focus:outline-none focus:border-[#E5A500] focus:ring-1 focus:ring-[#E5A500]/20"
                                        />
                                    </div>
                                </div>
                                <div className="relative h-3 rounded-full bg-gray-100 overflow-hidden">
                                    <input
                                        type="range"
                                        min={1}
                                        max={99}
                                        value={val}
                                        onChange={(e) => setStatValues((prev) => ({ ...prev, [code]: parseInt(e.target.value) }))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <motion.div
                                        className="h-full rounded-full bg-gradient-to-r from-[#E5A500] to-[#C98600]"
                                        animate={{ width: `${val}%` }}
                                        transition={{ duration: 0.15 }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between pt-4">
                    {renderBackButton()}
                    <button
                        onClick={startDescribeAIGeneration}
                        className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5A500] to-[#C98600] text-white font-bold font-space text-lg shadow-[0_4px_16px_rgba(229,165,0,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer"
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
        if (generationError) {
            return (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
                >
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <div className="space-y-3 max-w-md">
                        <h2 className="text-2xl font-bold font-sora text-gray-900">
                            Generation Failed
                        </h2>
                        <p className="text-gray-600 font-space text-sm">
                            {generationError}
                        </p>
                    </div>
                    <button
                        onClick={startAIGeneration}
                        className="px-6 py-3 bg-[#E5A500] hover:bg-[#C98600] text-white font-bold font-space rounded-2xl shadow-sm transition-all cursor-pointer"
                    >
                        Try Again
                    </button>
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
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E180A] via-[#12100A] to-[#0A0905] border-2 border-[#E5A500] shadow-[0_12px_40px_rgba(229,165,0,0.15)] flex flex-col justify-between">
                        {generatedCardUrl ? (
                            <Image
                                src={generatedCardUrl}
                                alt="Generated Legendary Card"
                                fill
                                className="object-contain"
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

                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setCurrentStep("ai");
                                startAIGeneration();
                            }}
                            className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-space text-sm flex items-center gap-2 cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4 text-[#E5A500]" />
                            Regenerate Card
                        </button>
                        {generatedCardUrl && (
                            <a
                                href={generatedCardUrl}
                                download={`${name.replace(/\s+/g, "_")}_legendary_card.png`}
                                className="text-[#C98600] hover:text-[#E5A500] transition-colors duration-300 font-space text-sm flex items-center gap-1.5 cursor-pointer font-semibold"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-[2.5]">
                                    <path
                                        d="M8 12V2M8 12L4 8M8 12L12 8M2 14H14"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Download Image
                            </a>
                        )}
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
                        Your personalized FIFA Meme TN card is ready. Complete the checkout to claim it.
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

    // ── Editor Renderer (Custom Mode) ──

    const renderEditor = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
            >
                <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold font-sora text-gray-900 leading-[1.1]">
                        Customize your{" "}
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            card
                        </span>
                    </h1>
                    <p className="text-gray-600 font-space text-sm max-w-md">
                        Edit every detail in real-time. Changes appear instantly on the card.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card Preview */}
                    <div className="flex flex-col items-center gap-4">
                        <div style={{ transform: "scale(0.48)", transformOrigin: "top center", width: 700, height: 1050 }}>
                            <CardComposer
                                ref={cardComposerRef}
                                baseImageUrl={editorBgUrl}
                                userPhotoUrl={uploadPreview}
                                playerName={editorName}
                                subtitle={editorSubtitle}
                                rating={editorRating}
                                position={editorPosition}
                                stats={editorStats}
                                badges={editorBadges}
                                quoteFr={editorQuoteFr}
                                quoteAr={editorQuoteAr}
                                hashtags={editorHashtags}
                                description={editorDescription}
                                accentColor={editorAccentColor}
                            />
                        </div>

                        {/* Background picker */}
                        <div className="w-full max-w-sm">
                            <BackgroundPicker
                                selectedBgUrl={editorBgUrl}
                                onSelect={setEditorBgUrl}
                                onGenerateAI={startHybridBgGeneration}
                                isGeneratingBg={isGeneratingBg}
                            />
                        </div>
                    </div>

                    {/* Editor Panel */}
                    <div>
                        <CardEditor
                            playerName={editorName}
                            onPlayerNameChange={setEditorName}
                            subtitle={editorSubtitle}
                            onSubtitleChange={setEditorSubtitle}
                            rating={editorRating}
                            onRatingChange={setEditorRating}
                            position={editorPosition}
                            onPositionChange={setEditorPosition}
                            stats={editorStats}
                            onStatsChange={setEditorStats}
                            badges={editorBadges}
                            onBadgesChange={setEditorBadges}
                            quoteFr={editorQuoteFr}
                            onQuoteFrChange={setEditorQuoteFr}
                            quoteAr={editorQuoteAr}
                            onQuoteArChange={setEditorQuoteAr}
                            hashtags={editorHashtags}
                            onHashtagsChange={setEditorHashtags}
                            description={editorDescription}
                            onDescriptionChange={setEditorDescription}
                            accentColor={editorAccentColor}
                            onAccentColorChange={setEditorAccentColor}
                        />
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setCurrentStep("ai");
                                startAIGeneration();
                            }}
                            className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-space text-sm flex items-center gap-2 cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4 text-[#E5A500]" />
                            Regenerate Base
                        </button>
                        <button
                            onClick={handleExportCard}
                            disabled={isExporting}
                            className="text-[#C98600] hover:text-[#E5A500] transition-colors duration-300 font-space text-sm flex items-center gap-1.5 cursor-pointer font-semibold disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            {isExporting ? "Exporting..." : "Export PNG"}
                        </button>
                    </div>
                    <button
                        onClick={() => setCurrentStep("review")}
                        className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E5A500] to-[#C98600] text-white font-bold font-space text-lg shadow-[0_4px_16px_rgba(229,165,0,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden cursor-pointer"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Continue to Review
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity duration-300" />
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
            case "editor":
                return renderEditor();
            case "review":
                return renderReview();
            case "checkout":
                return renderCheckout();
            default:
                return null;
        }
    };

    // ── Card Preview (Right Panel) ──

    const renderCardPreview = () => {
        if (currentStep === "ai" || currentStep === "checkout" || currentStep === "editor") {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 font-space text-sm gap-2">
                    {currentStep === "ai" ? (
                        <>
                            <Sparkles className="w-8 h-8 text-[#E5A500] animate-pulse" />
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-8 h-8 text-[#E5A500]" />
                            <span>Checkout</span>
                        </>
                    )}
                </div>
            );
        }

        const name =
            cardData.recipient === "myself"
                ? "You"
                : cardData.recipient === "friend"
                    ? "Friend"
                    : cardData.recipient === "partner"
                        ? "Partner"
                        : cardData.recipient === "family"
                            ? "Family"
                            : "Colleague";

        const MoodIcon = getMoodIcon(cardData.mood);

        return (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E180A] via-[#12100A] to-[#0A0905] border-2 border-[#E5A500] shadow-[0_12px_40px_rgba(229,165,0,0.15)] flex flex-col justify-between">
                    {/* Card shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                    {generatedCardUrl ? (
                        <Image
                            src={generatedCardUrl}
                            alt="Generated Legendary Card"
                            fill
                            className="object-contain"
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
                            
                            <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                                {/* Top stats info */}
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl md:text-2xl font-black text-[#E5A500] leading-none">
                                            {overallRating || 87}
                                        </span>
                                        <span className="text-[8px] font-bold text-white/70 uppercase font-space">
                                            OVR
                                        </span>
                                    </div>
                                    <div className="px-2 py-0.5 rounded bg-[#E5A500]/20 border border-[#E5A500]/40 text-[#E5A500] text-[8px] font-bold uppercase tracking-wider font-space">
                                        {cardData.mood || "Legend"}
                                    </div>
                                </div>

                                {/* Bottom recipient info */}
                                <div className="space-y-0.5">
                                    <div className="text-white font-bold font-sora text-base drop-shadow-md">
                                        {name || "???"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white/80 font-space text-[10px]">
                                        <MoodIcon className="w-3 h-3 text-[#E5A500]" />
                                        <span className="capitalize">{cardData.mood || "Legendary"}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 font-space text-xs">
                            <Camera className="w-6 h-6 text-[#E5A500]/40 mb-1" />
                            <span className="text-[#E5A500]/60 text-[10px]">No photo uploaded</span>
                        </div>
                    )}
                </div>

                <div className="text-center space-y-1">
                    <div className="text-gray-500 font-space text-xs font-semibold">
                        Live preview
                    </div>
                    <div className="text-gray-400 font-space text-[10px]">
                        Updates as you go
                    </div>
                </div>
            </div>
        );
    };

    // ── Sidebar ──

    const renderSidebar = () => {
        return (
            <div className="hidden lg:flex flex-col h-full py-8 px-6 border-r border-gray-200 bg-white shadow-sm">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-12">
                    <img src="./images/logo.png" alt="NoBody" className="w-30 h-10" />
                </div>

                {/* Steps */}
                <div className="flex-1 space-y-1">
                    {STEPS.map((step, idx) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStepIndex > idx;
                        const isPast = currentStepIndex >= idx;
                        const StepIcon = step.icon;

                        return (
                            <div key={step.id} className="relative">
                                <div
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                        ? "bg-[#E5A500]/10 border border-[#E5A500]/25 shadow-sm shadow-[#E5A500]/5"
                                        : isPast
                                            ? "hover:bg-gray-50 cursor-pointer"
                                            : "opacity-40"
                                        }`}
                                    onClick={() => {
                                        if (isPast) {
                                            setCurrentStep(step.id);
                                        }
                                    }}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                            ? "bg-gradient-to-r from-[#E5A500] to-[#C98600] text-white shadow-md shadow-[#E5A500]/15"
                                            : isCompleted
                                                ? "bg-[#E5A500]/15 text-[#C98600] border border-[#E5A500]/20"
                                                : "bg-gray-100 text-gray-500 border border-gray-200"
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-4 h-4 text-[#C98600] stroke-[3]" />
                                        ) : (
                                            <StepIcon className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div
                                            className={`font-space text-sm font-semibold ${isActive
                                                ? "text-gray-900 font-bold"
                                                : isCompleted
                                                    ? "text-gray-700"
                                                    : "text-gray-400"
                                                }`}
                                        >
                                            {step.label}
                                        </div>
                                        {isActive && (
                                            <div className="text-[#C98600] font-space text-[10px] font-semibold flex items-center gap-1">
                                                <Sparkles className="w-3 h-3 fill-[#C98600]" /> active
                                            </div>
                                        )}
                                    </div>
                                    {isActive && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#E5A500] shadow-[0_0_12px_rgba(229,165,0,0.6)]" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Time */}
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-gray-500 font-space text-xs">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle
                                cx="7"
                                cy="7"
                                r="6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M7 3V7L9 9"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span>~2 minutes</span>
                    </div>
                </div>
            </div>
        );
    };

    // ── Main Layout ──

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans overflow-x-hidden">
            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-40%] right-[-20%] w-[60%] h-[60%] bg-[#E5A500] rounded-full blur-[200px] opacity-[0.05]" />
                <div className="absolute bottom-[-40%] left-[-20%] w-[60%] h-[60%] bg-[#C98600] rounded-full blur-[200px] opacity-[0.04]" />
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
                <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
                    {/* Content */}
                    <div className="flex-1 px-6 py-8 lg:px-12 lg:py-12">
                        <div className="max-w-2xl mx-auto lg:mx-0">
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

                    {/* Right Panel - Card Preview */}
                    <div className="hidden lg:block w-[280px] xl:w-[320px] border-l border-gray-200/60 p-6 sticky top-0 h-screen bg-white shadow-sm">
                        {renderCardPreview()}
                    </div>

                    {/* Mobile card preview (small) */}
                    <div className="lg:hidden px-6 pb-6">
                        <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
                            <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-50 relative flex-shrink-0 border border-gray-100">
                                {generatedCardUrl ? (
                                    <Image
                                        src={generatedCardUrl}
                                        alt="Card"
                                        fill
                                        className="object-contain"
                                    />
                                ) : uploadPreview ? (
                                    <Image
                                        src={uploadPreview}
                                        alt="Card"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <Camera className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-gray-900 font-sora font-bold text-sm truncate">
                                    {cardData.recipient === "myself"
                                        ? "You"
                                        : cardData.recipient === "friend"
                                            ? "Friend"
                                            : cardData.recipient === "partner"
                                                ? "Partner"
                                                : cardData.recipient === "family"
                                                    ? "Family"
                                                    : cardData.recipient === "colleague"
                                                        ? "Colleague"
                                                        : "???"}
                                </div>
                                <div className="text-gray-500 font-space text-xs capitalize">
                                    {cardData.mood || "Legend"} · OVR{" "}
                                    {overallRating || "??"}
                                </div>
                            </div>
                            <div className="text-[#C98600] font-space text-[10px] font-bold flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> live
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}