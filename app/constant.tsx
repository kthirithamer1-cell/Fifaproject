import React from "react";
import {
    Wand2,
    Camera,
    UserCircle,
    ListChecks,
    SlidersHorizontal,
    Brain,
    MessageCircle,
    Sparkles,
    PenTool,
    Eye,
    CreditCard,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────

export interface TunisiaStat {
    code: string;
    stat: string;
    meaning: string;
    emoji: string;
}

export type StepId =
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

export interface StepConfig {
    id: StepId;
    label: string;
    icon: React.ComponentType<any>;
}

export interface QuestionOption {
    id: string;
    question: string;
    options: string[];
    multi?: boolean;
}

export interface BackgroundOption {
    id: string;
    label: string;
    url: string;
    thumbnail: string;
}

export interface CardStat {
    label: string;
    value: number;
}

export interface CardBadge {
    title: string;
}

// ─── 1. Canonical Tunisia Cultural Stats Dataset (68 items) ────────────────

export const TUNISIA_STATS: TunisiaStat[] = [
    { code: "DHK", stat: "Dhahka", meaning: "Humor", emoji: "😂" },
    { code: "NKT", stat: "Nokta", meaning: "Joke quality", emoji: "🎭" },
    { code: "KLM", stat: "Klem", meaning: "Talking ability", emoji: "🗣️" },
    { code: "HDR", stat: "Hadhra", meaning: "Storytelling", emoji: "🎤" },
    { code: "JAW", stat: "Jaw", meaning: "Good vibes", emoji: "😎" },
    { code: "DRM", stat: "Drama", meaning: "Drama creation", emoji: "🎭" },
    { code: "HRB", stat: "Hroub", meaning: "Escaping responsibilities", emoji: "🏃" },
    { code: "KHD", stat: "Khidma", meaning: "Work ethic", emoji: "💼" },
    { code: "MKH", stat: "Mekh", meaning: "Intelligence", emoji: "🧠" },
    { code: "DBR", stat: "Debber Rassek", meaning: "Problem solving", emoji: "🛠️" },
    { code: "SBR", stat: "Sabr", meaning: "Patience", emoji: "😇" },
    { code: "ZHR", stat: "zhar", meaning: "Luck", emoji: "🍀" },
    { code: "7IL", stat: "Hila", meaning: "Tricks & cleverness", emoji: "🎩" },
    { code: "FRS", stat: "Frassa", meaning: "Detective skills", emoji: "🕵️" },
    { code: "CHK", stat: "Chkoun?", meaning: "Curiosity / Gossip", emoji: "👂" },
    { code: "3YN", stat: "3in", meaning: "Observation", emoji: "👀" },
    { code: "WST", stat: "Wasta", meaning: "Connections", emoji: "🤝" },
    { code: "TKK", stat: "TEKTEK", meaning: "Money-making", emoji: "💰" },
    { code: "CRZ", stat: "Corza", meaning: "Financial management", emoji: "💳" },
    { code: "BKL", stat: "Bokhl", meaning: "Stinginess", emoji: "💵" },
    { code: "SRF", stat: "Sarf", meaning: "Spending money", emoji: "💸" },
    { code: "MRG", stat: "Mriguel", meaning: "Style", emoji: "😎" },
    { code: "LBG", stat: "Labga", meaning: "Elegance", emoji: "👔" },
    { code: "GZR", stat: "Gzara", meaning: "Boldness", emoji: "🔥" },
    { code: "TMS", stat: "Tmassik", meaning: "Stubbornness", emoji: "😤" },
    { code: "3SB", stat: "A3sab", meaning: "Anger", emoji: "😡" },
    { code: "HCH", stat: "Hachma Resistance", meaning: "Shamelessness", emoji: "😂" },
    { code: "FDH", stat: "Fdhou7", meaning: "Embarrassing moments", emoji: "🤦" },
    { code: "MCH", stat: "Mchawech", meaning: "Chaos", emoji: "🌪️" },
    { code: "L3B", stat: "La3b", meaning: "Mischief", emoji: "😈" },
    { code: "TBR", stat: "Tbarbir", meaning: "Complaining", emoji: "😤" },
    { code: "SDA", stat: "Sda3", meaning: "Noise level", emoji: "🔊" },
    { code: "FRJ", stat: "Ferja", meaning: "Watching others", emoji: "👀" },
    { code: "RKD", stat: "Rekd", meaning: "Sleeping", emoji: "😴" },
    { code: "9HW", stat: "9ahwa", meaning: "Coffee addiction", emoji: "☕" },
    { code: "CHY", stat: "Chay", meaning: "Tea addiction", emoji: "🍵" },
    { code: "TLF", stat: "Talaf", meaning: "Getting lost", emoji: "🗺️" },
    { code: "SMS", stat: "Semsara", meaning: "Negotiation", emoji: "🤝" },
    { code: "BRG", stat: "Bargouga", meaning: "Bargaining", emoji: "🤑" },
    { code: "W9T", stat: "Wakt", meaning: "Punctuality", emoji: "⏰" },
    { code: "JRY", stat: "Jary", meaning: "Running errands", emoji: "🚗" },
    { code: "S7B", stat: "S7ab", meaning: "Friendship", emoji: "🤜🤛" },
    { code: "HOB", stat: "Hob", meaning: "Romance", emoji: "❤️" },
    { code: "KDB", stat: "Kedhb", meaning: "Lying skill", emoji: "😅" },
    { code: "MSL", stat: "Mas2ouliya", meaning: "Responsibility", emoji: "📋" },
    { code: "TKL", stat: "Twakkel", meaning: "Reliance on luck", emoji: "🙏" },
    { code: "CHJ", stat: "Maywakherhech", meaning: "Courage", emoji: "🦁" },
    { code: "BRD", stat: "Broud", meaning: "Calmness", emoji: "🧊" },
    { code: "NFS", stat: "Nefs", meaning: "Competitiveness", emoji: "⚔️" },
    { code: "MAM", stat: "Weld omo", meaning: "Still calls mom for everything", emoji: "😂" },
    { code: "STP", stat: "Stopet", meaning: "Can find a louage instantly", emoji: "🚐" },
    { code: "RCH", stat: "Richness Appearance", meaning: "Looks rich, isn't", emoji: "💸" },
    { code: "FRD", stat: "Fridha", meaning: "Ability to disappear from work", emoji: "🏃" },
    { code: "NSS", stat: "Nasnes", meaning: "Watches everyone", emoji: "👀" },
    { code: "T7C", stat: "T7in", meaning: "Flattery level", emoji: "🤝" },
    { code: "KRK", stat: "Karhba", meaning: "Driving style", emoji: "🚗" },
    { code: "ZDM", stat: "Zdem", meaning: "Crowding and pushing through", emoji: "🚶" },
    { code: "MTL", stat: "Metloui", meaning: "Flexibility in excuses", emoji: "😅" },
    { code: "GLB", stat: "Ghalba", meaning: "Surviving difficult situations", emoji: "💪" },
    { code: "BRM", stat: "Barmil", meaning: "Eats everything", emoji: "🍔" },
    { code: "S7R", stat: "S7our", meaning: "Late-night energy", emoji: "🌙" },
    { code: "QRM", stat: "GHASRET EL KLEB", meaning: "Last-minute studying", emoji: "📚" },
    { code: "BKR", stat: "Bekri", meaning: "Waking up early", emoji: "⏰" },
    { code: "TKR", stat: "Tkarkir", meaning: "Complaining continuously", emoji: "😤" },
    { code: "DWR", stat: "Dawran", meaning: "Wandering around for no reason", emoji: "🚶" },
    { code: "KHB", stat: "Khabtha", meaning: "Creating trouble", emoji: "💥" },
    { code: "MTR", stat: "Mtarfis", meaning: "FAT", emoji: "🤦" },
];

// ─── 2. Generator Steps & Questions ────────────────────────────────────────

export const ALL_STEPS: StepConfig[] = [
    { id: "upload", label: "ارفع الصورة (Photo)", icon: Camera },
    { id: "profile", label: "معلوماتك (Profil)", icon: UserCircle },
    { id: "stats-pick", label: "اختار الستات (Stats)", icon: ListChecks },
    { id: "stats-values", label: "قيم الستات (Values)", icon: SlidersHorizontal },
    { id: "review", label: "مراجعة الديزاين (Review)", icon: Eye },
    { id: "checkout", label: "تأكيد الطلب (Checkout)", icon: CreditCard },
];

export const AI_INTERVIEW_QUESTIONS: QuestionOption[] = [
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

export const PERSONALITY_QUESTIONS: QuestionOption[] = [
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

// ─── 3. Default Component & Editor Values ──────────────────────────────────

export const DEFAULT_EDITOR_STATS: CardStat[] = [
    { label: "Skill", value: 90 },
    { label: "Charisma", value: 88 },
    { label: "Influence", value: 85 },
    { label: "Focus", value: 92 },
    { label: "Energy", value: 87 },
    { label: "Vibes", value: 95 },
];

export const DEFAULT_EDITOR_BADGES: CardBadge[] = [
    { title: "LEGEND" },
    { title: "UNSTOPPABLE" },
    { title: "ORIGINAL" },
];

export const DEFAULT_EDITOR_HASHTAGS: string[] = [
    "TUNISIA",
    "LEGEND",
    "GOAT",
    "VIBES",
    "BLEDI",
];

export const STATIC_BACKGROUNDS: BackgroundOption[] = [
    {
        id: "default",
        label: "Classic Gold",
        url: "/prompting/image.webp",
        thumbnail: "/prompting/image.webp",
    },
    {
        id: "dark",
        label: "Dark Elite",
        url: "/prompting/image2.webp",
        thumbnail: "/prompting/image2.webp",
    },
];

// ─── 4. Landing Page Data ─────────────────────────────────────────────────

export const NAV_ITEMS = [
    { href: "#top", label: "Accueil" },
    { href: "#about", label: "À propos" },
    { href: "#gallery", label: "Exemples" },
    { href: "#how", label: "Comment ça marche" },
    { href: "#testimonials", label: "Avis" },
    { href: "#faq", label: "FAQ" },
];

export const MARKETING_FEATURES = [
    {
        icon: "😂",
        stat: 100,
        label: "JKS",
        title: "TUNISIANS JOKES",
        subtitle: "100%",
    },
    {
        icon: "⚽",
        stat: 99,
        label: "DSG",
        title: "PREMIUM",
        subtitle: "PREMIUM DESIGN",
    },
    {
        icon: "🎁",
        stat: 99,
        label: "GFT",
        title: "PERFECT",
        subtitle: "GIFT",
    },
    {
        icon: "🚚",
        stat: 99,
        label: "DEL",
        title: "DELIVERY",
        subtitle: "EVERYWHERE IN TUNISIA",
    },
    {
        icon: "⭐",
        stat: 99,
        label: "QLT",
        title: "HIGH QUALITY",
        subtitle: "PVC PRINT",
    },
];

export const GALLERY_MEMES = [
    {
        rating: 97,
        name: "ALUI",
        type: "LEGEND",
        color: "#c9c2a8",
        image: "/images/alui.webp",
        stats: { DHK: 98, TKK: 12, RKD: 95, HRB: 93, "9HW": 90, S7B: 94 },
    },
    {
        rating: 96,
        name: "DELLAI",
        type: "LEGEND",
        color: "#2e8b57",
        image: "/images/delai.webp",
        stats: { DHK: 97, TKK: 15, RKD: 94, HRB: 92, "9HW": 89, S7B: 90 },
    },
    {
        rating: 98,
        name: "MAHER",
        type: "LEGEND",
        color: "#c99a3e",
        image: "/images/maher.webp",
        stats: { DHK: 99, TKK: 18, RKD: 96, HRB: 95, "9HW": 93, S7B: 93 },
    },
    {
        rating: 99,
        name: "ISSAM",
        type: "LEGEND",
        color: "#f4c430",
        image: "/images/Issam.webp",
        stats: { DHK: 99, TKK: 10, RKD: 98, HRB: 94, "9HW": 95, S7B: 97 },
    },
    {
        rating: 95,
        name: "Amine",
        type: "LEGEND",
        color: "#9b59b6",
        image: "/images/aluii.webp",
        stats: { DHK: 96, TKK: 13, RKD: 93, HRB: 90, "9HW": 89, S7B: 89 },
    },
    {
        rating: 94,
        name: "Nour",
        type: "LEGEND",
        color: "#3aa0c9",
        image: "/images/sankooh.webp",
        stats: { DHK: 95, TKK: 11, RKD: 92, HRB: 89, "9HW": 88, S7B: 91 },
    },
];

export const WORKFLOW_STEPS = [
    { icon: "📷", number: "STEP 1", label: "UPLOAD PHOTO" },
    { icon: "😂", number: "STEP 2", label: "CHOOSE FUNNY STATS" },
    { icon: "🎨", number: "STEP 3", label: "WE DESIGN IT" },
    { icon: "📦", number: "STEP 4", label: "RECEIVE YOUR CARD" },
];

export const FUNNY_STATS_LIST = [
    { icon: "😅", label: "ضحكة", code: "DHK" },
    { icon: "💬", label: "كلام", code: "KLM" },
    { icon: "🍟", label: "فلوس", code: "TKK" },
    { icon: "😳", label: "رقاد", code: "RKD" },
    { icon: "🏃", label: "هروب", code: "HRB" },
    { icon: "👀", label: "فرجة", code: "FRJ" },
    { icon: "🔥", label: "قزارة", code: "GZR" },
    { icon: "😏", label: "تبرير", code: "TBR" },
];

export const CARD_PACKAGES = [
    {
        name: "PREMIUM PACK",
        price: "59",
        badge: "POPULAR CHOICE",
        items: [
            { icon: "📱", text: "PVC CARD (45x30 cm)" },
            { icon: "🎁", text: "GIFT BOX" },
            { icon: "✨", text: "UV FINISH" },
        ],
    },
    {
        name: "ULTIMATE PACK",
        price: "79",
        badge: "BEST VALUE",
        items: [
            { icon: "🖼️", text: "MEGA PVC CARD (60x40 cm)" },
            { icon: "🎁", text: "GIFT BOX + STAND" },
            { icon: "🏅", text: "GOLD FINISH" },
        ],
    },
];

export const TESTIMONIALS_LIST = [
    {
        name: "Mohamed Ali",
        initials: "MA",
        avatar: "👤",
        quote: "نكيت بالضحك 😂",
    },
    {
        name: "Achref Ben",
        initials: "AB",
        avatar: "👤",
        quote: "أحسن كادو عملتو لصاحبي",
    },
    {
        name: "Yassine Charfi",
        initials: "YC",
        avatar: "🔥",
        quote: "جودة ممتازة 🔥",
    },
    {
        name: "Marwen Saidi",
        initials: "MS",
        avatar: "🚀",
        quote: "وصلت في نهارين خدمة 5 نجوم",
    },
];

export const FAQ_ITEMS = [
    {
        icon: "⏱️",
        question: "How long does it take?",
        answer: "عادة نحضرو الكارطة و نرسلوها في ظرف 24 إلى 48 ساعة من طلبك.",
    },
    {
        icon: "🚚",
        question: "Do you deliver everywhere?",
        answer: "إيه، نوصلو لكل الولايات التونسية عبر شركات التوصيل المعتمدة.",
    },
    {
        icon: "🎭",
        question: "Can I choose the stats?",
        answer:
            "طبعا! تنجم تختار من أكثر من 50 ستات مضحك تونسي أو تقترح ستات خاص بيك.",
    },
    {
        icon: "💳",
        question: "What about payment?",
        answer:
            "الخلاص يكون عند التسليم (Cash on Delivery) أو أونلاين حسب اختيارك.",
    },
    {
        icon: "📸",
        question: "Can I upload any photo?",
        answer: "إيه، ارفع أي صورة واضحة و نحنا نتصرفو في التصميم و الجودة.",
    },
    {
        icon: "✏️",
        question: "Can I request changes?",
        answer: "طبعا، عندك حق في تعديل واحد مجاني قبل الطباعة النهائية.",
    },
];
