import { SelectedStat } from "./tunisiaStats";

export interface DynamicPromptInput {
    name: string;
    overallRating: number;
    position?: string;
    stats: SelectedStat[];
    mood?: string;
    recipient?: string;
    modelId?: string;
    backgroundStyle?: string;
    badges?: any[];
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

// Expanded Tunisian & Global Hobby to Background Directives map
const HOBBY_DIRECTIVES: Record<string, string> = {
    coffee: "Modern Tunisian lounge café, espresso & chicha aesthetic, warm golden lighting.",
    kahwa: "Modern Tunisian lounge café, espresso & chicha aesthetic, warm golden lighting.",
    "9ahwa": "Modern Tunisian lounge café, espresso & chicha aesthetic, warm golden lighting.",
    game: "Cyberpunk RGB esports room, neon cyan & gold trim, gaming headset, matrix particle aura.",
    gamer: "Cyberpunk RGB esports room, neon cyan & gold trim, gaming headset, matrix particle aura.",
    gaming: "Cyberpunk RGB esports room, neon cyan & gold trim, gaming headset, matrix particle aura.",
    car: "Sleek night drive on Tunis highway, neon reflection, gold-accented sports car background.",
    karhba: "Sleek night drive on Tunis highway, neon reflection, gold-accented sports car background.",
    driving: "Sleek night drive on Tunis highway, neon reflection, gold-accented sports car background.",
    football: "Floodlit Tunisian stadium atmosphere, golden confetti, championship derby match vibe.",
    kora: "Floodlit Tunisian stadium atmosphere, golden confetti, championship derby match vibe.",
    soccer: "Floodlit Tunisian stadium atmosphere, golden confetti, championship derby match vibe.",
    sports: "Floodlit Tunisian stadium atmosphere, golden confetti, championship derby match vibe.",
    gym: "High-contrast elite gym, intense workout mood, golden spotlighting.",
    kasa: "High-contrast elite gym, intense workout mood, golden spotlighting.",
    fitness: "High-contrast elite gym, intense workout mood, golden spotlighting.",
    workout: "High-contrast elite gym, intense workout mood, golden spotlighting.",
    fishing: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sea glare.",
    siyada: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sea glare.",
    bahr: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sea glare.",
    sea: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sea glare.",
    beach: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sea glare.",
    swimming: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sea glare.",
    music: "Neon studio setup, vinyl beats, gold microphone aura.",
    singing: "Neon studio setup, vinyl beats, gold microphone aura.",
    guitar: "Neon studio setup, vinyl beats, gold microphone aura.",
    rap: "Neon studio setup, vinyl beats, gold microphone aura.",
    code: "Futuristic developer matrix HUD, neon gold code overlays.",
    coding: "Futuristic developer matrix HUD, neon gold code overlays.",
    dev: "Futuristic developer matrix HUD, neon gold code overlays.",
    tech: "Futuristic developer matrix HUD, neon gold code overlays.",
    computer: "Futuristic developer matrix HUD, neon gold code overlays.",
    cooking: "Gourmet master chef kitchen studio, warm ambient amber lighting, culinary gold details.",
    food: "Gourmet master chef kitchen studio, warm ambient amber lighting, culinary gold details.",
    chef: "Gourmet master chef kitchen studio, warm ambient amber lighting, culinary gold details.",
    reading: "Cozy luxury leather library, antique books with gold leaf edges, warm reading lamp glow.",
    books: "Cozy luxury leather library, antique books with gold leaf edges, warm reading lamp glow.",
    study: "Cozy luxury leather library, antique books with gold leaf edges, warm reading lamp glow.",
    cinema: "Hollywood red carpet premiere, cinematic anamorphic lens flare, golden spotlight camera aura.",
    movies: "Hollywood red carpet premiere, cinematic anamorphic lens flare, golden spotlight camera aura.",
    fashion: "High-fashion Paris/Tunis runway, luxury gold accents, stylish magazine aesthetic.",
    style: "High-fashion Paris/Tunis runway, luxury gold accents, stylish magazine aesthetic.",
    shopping: "High-fashion Paris/Tunis runway, luxury gold accents, stylish magazine aesthetic.",
    travel: "Panoramic mountain peak sunrise, golden horizon, adventurous wanderlust atmosphere.",
    trips: "Panoramic mountain peak sunrise, golden horizon, adventurous wanderlust atmosphere.",
    hiking: "Panoramic mountain peak sunrise, golden horizon, adventurous wanderlust atmosphere.",
    photography: "Professional studio photography setup, golden hour lighting, camera aperture gold bokeh.",
    photo: "Professional studio photography setup, golden hour lighting, camera aperture gold bokeh.",
    art: "Creative artist studio, golden paint splatters, canvas watercolor particle atmosphere.",
    drawing: "Creative artist studio, golden paint splatters, canvas watercolor particle atmosphere.",
    dance: "Dynamic stage performance lighting, golden spotlight motion trails, energetic atmosphere.",
    dancing: "Dynamic stage performance lighting, golden spotlight motion trails, energetic atmosphere.",
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
        backgroundStyle,
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
    const hobbiesFormatted = hobbiesArray.filter(Boolean).join(", ");

    // Combined search text for keyword detection
    const combinedAnswers = { ...(answers || {}), ...(personality || {}) };
    const combinedText = `${hobbiesFormatted} ${profileInfo?.description || ""} ${freeDescription || ""} ${JSON.stringify(combinedAnswers)}`.toLowerCase();

    // Detect background directives
    let themeDirectives: string[] = [];

    if (backgroundStyle && backgroundStyle.trim()) {
        themeDirectives.push(`Background Style Preference: ${backgroundStyle.trim()}`);
    }

    Object.entries(HOBBY_DIRECTIVES).forEach(([keyword, directive]) => {
        if (combinedText.includes(keyword) && !themeDirectives.includes(directive)) {
            themeDirectives.push(directive);
        }
    });

    // Custom text & design specifications
    const customNotes = (directDesignNotes || profileInfo?.designNotes || "").trim().slice(0, 200);

    // Build comprehensive person profile block
    let personProfileDirective = `\n# PERSON PROFILE & INDIVIDUAL CHARACTERISTICS\n`;
    personProfileDirective += `- BRAND LOGO REQUIREMENT: Feature the official "FLAWLESS" company logo emblem on the card (golden 3D crest badge with FLAWLESS logo text).\n`;
    personProfileDirective += `- STRICT COLOR RULE: Gold metallic finish is reserved STRICTLY for TEXT typography (Player Name, Rating number, Position, 6 Stat codes & values). Do NOT make the background all-gold.\n`;
    personProfileDirective += `- CHIP EXCLUSION RULE: DO NOT generate any SKILL, WEAK FOOT, or WORK RATE chips or text on the card. Keep top-right area clean.\n`;

    const personName = (profileInfo?.name || name || "LEGEND").toUpperCase();
    personProfileDirective += `- Subject Name: ${personName}\n`;

    if (profileInfo?.gender) {
        personProfileDirective += `- Subject Gender: ${profileInfo.gender}\n`;
        personProfileDirective += `- Gender Visual Representation: The portrait MUST accurately reflect a ${profileInfo.gender} subject appearance.\n`;
    }

    if (profileInfo?.age) {
        personProfileDirective += `- Subject Age: ${profileInfo.age} years old\n`;
        personProfileDirective += `- Age Visual Representation: The facial features and character portrait MUST realistically represent a ${profileInfo.age}-year-old individual.\n`;
    }

    if (hobbiesFormatted) {
        personProfileDirective += `- Hobbies & Passions: ${hobbiesFormatted}\n`;
    }

    if (profileInfo?.description && profileInfo.description.trim()) {
        personProfileDirective += `- Self Description & Story: ${profileInfo.description.trim().slice(0, 200)}\n`;
    }

    if (freeDescription && freeDescription.trim() && freeDescription.trim() !== profileInfo?.description?.trim()) {
        personProfileDirective += `- Additional User Input: ${freeDescription.trim().slice(0, 200)}\n`;
    }

    // Format personality & interview summary if present
    const answersEntries = Object.entries(combinedAnswers).filter(([_, v]) => v !== undefined && v !== null && v !== "");
    if (answersEntries.length > 0) {
        const answersSummary = answersEntries
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .slice(0, 10)
            .join(" | ");
        personProfileDirective += `- Personality & Traits: ${answersSummary}\n`;
    }

    if (themeDirectives.length > 0) {
        personProfileDirective += `- Background Theme Directives: ${themeDirectives.slice(0, 4).join(" | ")}\n`;
    }

    if (customNotes) {
        personProfileDirective += `- Custom User Spec & Text Notes: ${customNotes}\n`;
    }

    // Compact JSON — data the image model needs to RENDER on the card
    const jsonString = JSON.stringify({
        name: personName,
        rating: overallRating || 85,
        pos: position,
        stats: statStrings,
    });

    // Replace placeholder and append full person profile directives
    let prompt = template.replace(/{PLAYER_DATA_JSON}/g, jsonString);
    prompt += personProfileDirective;

    return prompt;
}
