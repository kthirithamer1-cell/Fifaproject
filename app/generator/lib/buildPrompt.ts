import { SelectedStat } from "./tunisiaStats";
import { getCardModelById } from "./cardModels";

export interface DynamicPromptInput {
    name: string;
    overallRating: number;
    position?: string;
    stats: SelectedStat[];
    mood?: string;
    recipient?: string;
    backgroundStyle?: string;
    modelId?: string;
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
    badges?: { title: string }[];
    freeDescription?: string;
    title?: string;
}

// ─── Expanded Hobby → Visual Directive Map (40+ keywords) ─────────────────
const HOBBY_DIRECTIVES: Record<string, string> = {
    // Food & Drink
    coffee: "Modern Tunisian lounge café, espresso & chicha aesthetic, warm golden lighting, steam particles.",
    kahwa: "Modern Tunisian lounge café, espresso & chicha aesthetic, warm golden lighting, steam particles.",
    "9ahwa": "Modern Tunisian lounge café, espresso & chicha aesthetic, warm golden lighting, steam particles.",
    tea: "Zen tea ceremony aesthetic, delicate steam, warm amber glow, ceramic textures.",
    cooking: "Professional chef kitchen, stainless steel surfaces, warm flame glow, floating spice particles.",
    food: "Gourmet food styling, rich warm colors, golden plate reflections, appetite-inducing glow.",

    // Gaming & Tech
    game: "Cyberpunk RGB esports arena, neon cyan & magenta glow, gaming headset, holographic HUD overlays, matrix particle rain.",
    gaming: "Cyberpunk RGB esports arena, neon cyan & magenta glow, gaming headset, holographic HUD overlays, matrix particle rain.",
    gamer: "Cyberpunk RGB esports arena, neon cyan & magenta glow, gaming headset, holographic HUD overlays, matrix particle rain.",
    valorant: "Tactical neon shooter aesthetic, red & cyan lighting, angular geometric patterns, crosshair HUD.",
    fifa: "Football stadium night, floodlights with lens flare, green pitch glow, trophy golden confetti.",
    code: "Futuristic developer matrix HUD, neon green code waterfall, dark terminal aesthetic, holographic IDE overlays.",
    coding: "Futuristic developer matrix HUD, neon green code waterfall, dark terminal aesthetic, holographic IDE overlays.",
    programming: "Futuristic developer matrix HUD, neon green code waterfall, dark terminal aesthetic, holographic IDE overlays.",
    developer: "Futuristic developer matrix HUD, neon green code waterfall, dark terminal aesthetic, holographic IDE overlays.",
    tech: "Sleek silicon valley aesthetic, holographic circuit boards, blue LED glow, futuristic clean design.",
    hacker: "Dark web terminal green glow, scrolling code matrix, anonymous mask silhouette vibes.",

    // Sports
    football: "Floodlit championship stadium atmosphere at night, golden confetti rain, emerald pitch bokeh, victory celebration.",
    kora: "Floodlit championship stadium atmosphere at night, golden confetti rain, emerald pitch bokeh, victory celebration.",
    soccer: "Floodlit championship stadium atmosphere at night, golden confetti rain, emerald pitch bokeh, victory celebration.",
    gym: "High-contrast elite gym, intense workout mood, golden spotlighting on iron weights, sweat droplets.",
    fitness: "High-contrast elite gym, intense workout mood, golden spotlighting on iron weights, sweat droplets.",
    kasa: "High-contrast elite gym, intense workout mood, golden spotlighting on iron weights, sweat droplets.",
    boxing: "Dark boxing ring with crimson ropes, dramatic spotlight cone, smoke haze, fierce champion energy.",
    basketball: "Indoor arena with orange-gold lighting, hardwood floor reflections, slam dunk energy, crowd silhouette.",
    swimming: "Deep aqua blue underwater aesthetic, light rays piercing surface, bubble particles, serene power.",
    running: "Dynamic motion blur cityscape at dawn, golden hour sunlight, speed streaks, marathon energy.",
    tennis: "Pristine clay court under golden sunlight, dynamic rally energy, sharp shadow contrast.",
    martial: "Dojo atmosphere, wooden floor, red & black aesthetic, disciplined warrior energy, ink splash.",
    karate: "Dojo atmosphere, wooden floor, red & black aesthetic, disciplined warrior energy, ink splash.",

    // Music & Arts
    music: "Neon concert stage setup, vinyl beats, gold microphone with spotlight aura, sound wave visualization, DJ booth neon.",
    dj: "Epic DJ booth at festival, purple & cyan lasers, crowd silhouette, equalizer waveform, speaker stacks with bass vibration.",
    rap: "Urban hip-hop studio, gold chain aesthetic, microphone spotlight, graffiti-tagged brick wall, boom box vibes.",
    singer: "Grand concert stage, dramatic spotlight beam, microphone in hand, crowd lighter glow, musical note particles.",
    guitar: "Rock concert stage, electric guitar lightning, amplifier glow, smoky atmosphere, rebel energy.",
    piano: "Elegant grand piano in spotlight, classical concert hall, black & gold aesthetic, sheet music floating.",
    art: "Creative artist studio, paint splashes, vibrant canvas, palette knife texture, colorful chaos aesthetic.",
    drawing: "Sketch artist studio, pencil strokes, charcoal texture, creative workspace, inspiration mood.",
    photography: "Photographer studio, camera flash ring light, bokeh background, lens flare, creative eye aesthetic.",
    dance: "Dynamic dance floor, neon strobes, motion blur trails, urban breakdance energy, spotlight drama.",

    // Vehicles & Travel
    car: "Sleek night drive on coastal highway, neon city reflection on wet road, gold-accented luxury sports car taillights.",
    cars: "Sleek night drive on coastal highway, neon city reflection on wet road, gold-accented luxury sports car taillights.",
    driving: "Sleek night drive on coastal highway, neon city reflection on wet road, gold-accented luxury sports car taillights.",
    motorcycle: "Night rider aesthetic, chrome reflections, asphalt speed blur, rebel freedom vibes.",
    travel: "World explorer aesthetic, vintage passport stamps, airplane window golden sunset, wanderlust map overlay.",
    adventure: "Mountain peak summit at golden hour, epic landscape, explorer energy, nature grandeur.",

    // Water & Nature
    fishing: "Mediterranean coastal breeze, Bizerte sea boat at sunset, golden sea glare, calm ocean reflections.",
    siyada: "Mediterranean coastal breeze, Bizerte sea boat at sunset, golden sea glare, calm ocean reflections.",
    bahr: "Mediterranean coastal breeze, Bizerte sea boat at sunset, golden sea glare, calm ocean reflections.",
    beach: "Tropical paradise beach, turquoise water, golden sand, palm tree silhouette, sunset paradise glow.",
    nature: "Lush forest cathedral, sunbeams through canopy, emerald green atmosphere, peaceful power.",

    // Education & Professional
    study: "Grand library aesthetic, towering bookshelves, warm reading lamp, scholarly golden glow, floating pages.",
    reading: "Grand library aesthetic, towering bookshelves, warm reading lamp, scholarly golden glow, floating pages.",
    medical: "Futuristic medical lab, clean white & blue, holographic anatomy display, precision heal energy.",
    doctor: "Futuristic medical lab, clean white & blue, holographic anatomy display, precision heal energy.",
    engineering: "Industrial workshop, blueprint overlays, precision machinery, copper & steel aesthetic.",
    architecture: "Modern skyscraper skyline, geometric glass facades, blueprint wireframe overlay, grand design energy.",
    business: "Executive penthouse office, city skyline view at night, mahogany desk, power CEO aesthetic.",
    entrepreneur: "Startup hustle aesthetic, whiteboard strategy, multiple screens, innovation energy.",

    // Fashion & Lifestyle
    fashion: "High-end runway aesthetic, dramatic catwalk lighting, designer fabric textures, vogue magazine energy.",
    style: "Luxury boutique interior, mirror reflections, golden accessories, high fashion editorial lighting.",
    shopping: "Luxury boulevard at night, boutique window displays, neon signs, gold shopping bag aesthetic.",

    // Anime & Pop Culture
    anime: "Japanese anime aesthetic, cherry blossom petals, vibrant manga colors, dramatic speed lines, otaku energy.",
    manga: "Japanese manga panel aesthetic, ink brush strokes, dramatic black & white with red accents.",
    movie: "Hollywood cinematic wide shot, film reel bokeh, golden oscar statuette glow, premiere red carpet.",
    cinema: "Hollywood cinematic wide shot, film reel bokeh, golden oscar statuette glow, premiere red carpet.",
};

// ─── Build Personality Context String ─────────────────────────────────────
function buildPersonalityContext(input: DynamicPromptInput): string {
    const parts: string[] = [];

    // Hobbies
    const rawHobbies = input.profileInfo?.hobbies;
    const hobbiesArray = Array.isArray(rawHobbies)
        ? rawHobbies
        : typeof rawHobbies === "string" && rawHobbies.trim()
        ? rawHobbies.split(",").map((h) => h.trim())
        : [];

    if (hobbiesArray.length > 0) {
        parts.push(`Hobbies: ${hobbiesArray.join(", ")}`);
    }

    // Description
    if (input.profileInfo?.description) {
        parts.push(`Identity: ${input.profileInfo.description.slice(0, 100)}`);
    }

    // Free description
    if (input.freeDescription) {
        parts.push(`Style: ${input.freeDescription.slice(0, 100)}`);
    }

    // Personality answers
    const combinedAnswers = { ...(input.answers || {}), ...(input.personality || {}) };
    const answerParts = Object.entries(combinedAnswers)
        .filter(([_, val]) => val && String(val).trim())
        .map(([key, val]) => `${key}: ${String(val).slice(0, 40)}`)
        .slice(0, 5);
    if (answerParts.length > 0) {
        parts.push(`Personality: ${answerParts.join("; ")}`);
    }

    // Design notes
    const notes = (input.designNotes || input.profileInfo?.designNotes || "").trim();
    if (notes) {
        parts.push(`Custom: ${notes.slice(0, 100)}`);
    }

    if (parts.length === 0) {
        return "Premium sports collectible with cinematic luxury aesthetic.";
    }

    return parts.join(". ") + ".";
}

// ─── Detect Hobby Visual Directives ───────────────────────────────────────
function detectHobbyDirectives(searchText: string): string[] {
    const lower = searchText.toLowerCase();
    const directives: string[] = [];

    Object.entries(HOBBY_DIRECTIVES).forEach(([keyword, directive]) => {
        if (lower.includes(keyword) && !directives.includes(directive)) {
            directives.push(directive);
        }
    });

    return directives;
}

// ─── Main Prompt Builder ──────────────────────────────────────────────────
export function buildDynamicPrompt(
    template: string,
    input: DynamicPromptInput
): string {
    const {
        name,
        overallRating,
        position = "BOSS",
        stats,
        mood,
        profileInfo,
        answers,
        personality,
        freeDescription,
        backgroundStyle,
        modelId,
    } = input;

    // ── 1. Format stats ──
    const statStrings = (stats || []).slice(0, 6).map((s) => `${s.code} ${s.value}`);

    // ── 2. Build combined search text for hobby keyword detection ──
    const rawHobbies = profileInfo?.hobbies;
    const hobbiesArray = Array.isArray(rawHobbies)
        ? rawHobbies
        : typeof rawHobbies === "string" && rawHobbies.trim()
        ? rawHobbies.split(",").map((h) => h.trim())
        : [];
    const hobbiesFormatted = hobbiesArray.join(", ");
    const combinedAnswers = { ...(answers || {}), ...(personality || {}) };
    const searchText = `${hobbiesFormatted} ${profileInfo?.description || ""} ${freeDescription || ""} ${JSON.stringify(combinedAnswers)}`;

    // ── 3. Build {BACKGROUND_STYLE} — blend model + hobbies (Option B) ──
    const bgParts: string[] = [];

    // Model-based palette directive (base layer)
    if (modelId) {
        const selectedModel = getCardModelById(modelId);
        bgParts.push(selectedModel.promptStyle);
    } else if (backgroundStyle) {
        bgParts.push(backgroundStyle);
    }

    // Hobby-based directives (detail layer — blended on top, max 2)
    const hobbyDirectives = detectHobbyDirectives(searchText);
    hobbyDirectives.slice(0, 2).forEach((d) => {
        if (!bgParts.includes(d)) {
            bgParts.push(d);
        }
    });

    const bgStyleText = bgParts.length > 0
        ? bgParts.join(" | ")
        : "Vibrant high-end sports collectible aesthetic with cinematic lighting, gold particles & dramatic rim glow.";

    // ── 4. Build {MOOD} ──
    const moodText = mood || "Legendary, confident, powerful";

    // ── 5. Build {PERSONALITY_CONTEXT} ──
    const personalityContext = buildPersonalityContext(input);

    // ── 6. Build player data JSON ──
    const attributeChips = (input.badges && input.badges.length > 0)
        ? input.badges.map((b) => b.title)
        : ["SKILL 5★", "WEAK 5★", "WORK H/H"];

    const jsonString = JSON.stringify({
        name: (name || "LEGEND").toUpperCase(),
        rating: overallRating || 85,
        pos: position || "BOSS",
        club: "b FLAWLESS",
        stats: statStrings,
        attributes: attributeChips,
    });

    // ── 7. Replace all placeholders ──
    const prompt = template
        .replace(/{PLAYER_DATA_JSON}/g, jsonString)
        .replace(/{BACKGROUND_STYLE}/g, bgStyleText)
        .replace(/{MOOD}/g, moodText)
        .replace(/{PERSONALITY_CONTEXT}/g, personalityContext);

    return prompt;
}
