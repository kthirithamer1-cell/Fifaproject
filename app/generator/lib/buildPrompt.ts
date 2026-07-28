import { SelectedStat } from "./tunisiaStats";

export interface DynamicPromptInput {
    name: string;
    overallRating: number;
    position?: string;
    stats: SelectedStat[];
    mood?: string;
    recipient?: string;
    profileInfo?: {
        name?: string;
        age?: string;
        gender?: string;
        hobbies?: string | string[];
        description?: string;
        designNotes?: string;
    };
    designNotes?: string;
    answers?: Record<string, any>;
    personality?: Record<string, any>;
    freeDescription?: string;
    title?: string;
}

// Compact Tunisian Hobby to Background Directives map
const HOBBY_DIRECTIVES: Record<string, string> = {
    coffee: "Modern Tunisian lounge café, espresso & chicha aesthetic, warm golden lighting.",
    kahwa: "Modern Tunisian lounge café, espresso & chicha aesthetic, warm golden lighting.",
    game: "Cyberpunk RGB esports room, neon cyan & gold trim, gaming headset, matrix particle aura.",
    gamer: "Cyberpunk RGB esports room, neon cyan & gold trim, gaming headset, matrix particle aura.",
    car: "Sleek night drive on Tunis highway, neon reflection, gold-accented sports car background.",
    football: "Floodlit Tunisian stadium atmosphere, golden confetti, championship derby match vibe.",
    kora: "Floodlit Tunisian stadium atmosphere, golden confetti, championship derby match vibe.",
    gym: "High-contrast elite gym, intense workout mood, golden spotlighting.",
    kasa: "High-contrast elite gym, intense workout mood, golden spotlighting.",
    fishing: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sea glare.",
    siyada: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sea glare.",
    bahr: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sea glare.",
    music: "Neon studio setup, vinyl beats, gold microphone aura.",
    code: "Futuristic developer matrix HUD, neon gold code overlays.",
};

export function buildDynamicPrompt(
    template: string,
    input: DynamicPromptInput
): string {
    const {
        name,
        overallRating,
        position = "GOAT",
        stats,
        profileInfo,
        answers,
        personality,
        freeDescription,
        designNotes: directDesignNotes,
    } = input;

    // Format stats as compact "CODE VALUE" strings — image model only needs what to print
    const statStrings = (stats || []).slice(0, 6).map((s) => `${s.code} ${s.value}`);

    // Parse multi-hobbies
    const rawHobbies = profileInfo?.hobbies;
    const hobbiesArray = Array.isArray(rawHobbies)
        ? rawHobbies
        : typeof rawHobbies === "string" && rawHobbies.trim()
        ? rawHobbies.split(",").map((h) => h.trim())
        : [];
    const hobbiesFormatted = hobbiesArray.join(", ");

    // Combined search text for keyword detection
    const combinedAnswers = { ...(answers || {}), ...(personality || {}) };
    const combinedText = `${hobbiesFormatted} ${profileInfo?.description || ""} ${freeDescription || ""} ${JSON.stringify(combinedAnswers)}`.toLowerCase();

    // Detect Tunisian hobby background directives
    let themeDirectives: string[] = [];
    Object.entries(HOBBY_DIRECTIVES).forEach(([keyword, directive]) => {
        if (combinedText.includes(keyword) && !themeDirectives.includes(directive)) {
            themeDirectives.push(directive);
        }
    });

    // Custom text & design specifications (max 150 chars for cost optimization)
    const customNotes = (directDesignNotes || profileInfo?.designNotes || "").trim().slice(0, 150);

    // Build compact theme block
    let themeDirective = "";
    if (themeDirectives.length > 0 || customNotes || hobbiesFormatted) {
        themeDirective = `\n# TUNISIAN HOBBY & VISUAL DIRECTIVES\n`;
        if (hobbiesFormatted) {
            themeDirective += `- Hobbies: ${hobbiesFormatted}\n`;
        }
        if (themeDirectives.length > 0) {
            themeDirective += `- Background Theme: ${themeDirectives.slice(0, 2).join(" | ")}\n`;
        }
        if (customNotes) {
            themeDirective += `- User Custom Spec: ${customNotes}\n`;
        }
    }

    // Compact JSON — only data the image model needs to RENDER on the card
    const jsonString = JSON.stringify({
        name: (name || "LEGEND").toUpperCase(),
        rating: overallRating || 85,
        pos: position,
        stats: statStrings,
    });

    // Replace placeholder and append theme if detected
    let prompt = template.replace(/{PLAYER_DATA_JSON}/g, jsonString);
    if (themeDirective) {
        prompt += themeDirective;
    }

    return prompt;
}
