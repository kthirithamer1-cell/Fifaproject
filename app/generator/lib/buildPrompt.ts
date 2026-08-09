import {
    SelectedStat,
    getDynamicStatNote,
    extractNotesFromContext,
    resolveDynamicPositionAndTitle,
} from "./tunisiaStats";

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
    coffee: "Luxury modern Tunisian lounge café ambiance, glowing espresso machine steam, rich amber ambient lighting, warm gold highlights.",
    kahwa: "Luxury modern Tunisian lounge café ambiance, glowing espresso machine steam, rich amber ambient lighting, warm gold highlights.",
    "9ahwa": "Luxury modern Tunisian lounge café ambiance, glowing espresso machine steam, rich amber ambient lighting, warm gold highlights.",
    game: "High-tech cyberpunk esports battle station, glowing cyan and gold RGB lighting, holographic matrix particle aura.",
    gamer: "High-tech cyberpunk esports battle station, glowing cyan and gold RGB lighting, holographic matrix particle aura.",
    gaming: "High-tech cyberpunk esports battle station, glowing cyan and gold RGB lighting, holographic matrix particle aura.",
    fifa: "High-tech cyberpunk esports arena, glowing neon gold HUD, electronic gaming aura.",
    valorant: "Tactical esports arena, glowing neon cybernetic HUD, victory gold particle aura.",
    car: "Cinematic night drive on Tunis highway, neon city light reflections, sleek supercar backdrop with gold trim.",
    karhba: "Cinematic night drive on Tunis highway, neon city light reflections, sleek supercar backdrop with gold trim.",
    driving: "Cinematic night drive on Tunis highway, neon city light reflections, sleek supercar backdrop with gold trim.",
    football: "Majestic floodlit Tunisian derby stadium, golden confetti explosion, electric championship atmosphere.",
    kora: "Majestic floodlit Tunisian derby stadium, golden confetti explosion, electric championship atmosphere.",
    soccer: "Majestic floodlit Tunisian derby stadium, golden confetti explosion, electric championship atmosphere.",
    sports: "Majestic floodlit sports arena, golden victory confetti, championship energy.",
    gym: "High-contrast elite bodybuilding & fitness arena, dramatic rim-light shadows, intense golden spotlighting.",
    kasa: "High-contrast elite bodybuilding & fitness arena, dramatic rim-light shadows, intense golden spotlighting.",
    fitness: "High-contrast elite fitness arena, golden power lighting, athletic energy.",
    workout: "High-contrast elite gym arena, golden spotlighting, intense motivation aesthetic.",
    fishing: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sun glare on deep azure water.",
    siyada: "Mediterranean coastal breeze, Bizerte sea boat sunset, golden sun glare on deep azure water.",
    bahr: "Mediterranean coastal breeze, sea sunset, golden horizon glare.",
    sea: "Mediterranean coastal breeze, sea sunset, golden horizon glare.",
    beach: "Mediterranean coastal sunset, golden sand dunes, sparkling sun rays.",
    swimming: "Crystal turquoise Mediterranean water, golden sun caustics and radiant sunlight.",
    music: "Neon-lit sound recording studio, glowing vinyl records, golden microphone aura and audio wave particles.",
    singing: "Neon-lit sound recording studio, glowing vinyl records, golden microphone aura and audio wave particles.",
    guitar: "Acoustic stage concert lighting, golden lens flare, musical notes particle aura.",
    rap: "Underground urban neon studio, golden chains aesthetic, bold dynamic contrast.",
    code: "Futuristic developer matrix HUD, glowing holographic gold code streams, quantum circuit background.",
    coding: "Futuristic developer matrix HUD, glowing holographic gold code streams, quantum circuit background.",
    dev: "Futuristic developer matrix HUD, glowing holographic gold code streams, quantum circuit background.",
    tech: "Futuristic developer matrix HUD, glowing holographic gold code streams, quantum circuit background.",
    computer: "Futuristic developer matrix HUD, glowing holographic gold code streams, quantum circuit background.",
    cooking: "Michelin-star master chef kitchen studio, warm amber flame glow, culinary gold accent details.",
    food: "Michelin-star master chef kitchen studio, warm amber flame glow, culinary gold accent details.",
    chef: "Michelin-star master chef kitchen studio, warm amber flame glow, culinary gold accent details.",
    reading: "Cozy luxury leather library, antique books with gold leaf edges, warm reading lamp glow.",
    books: "Cozy luxury leather library, antique books with gold leaf edges, warm reading lamp glow.",
    study: "Cozy luxury leather library, antique books with gold leaf edges, warm reading lamp glow.",
    cinema: "Hollywood red carpet premiere, cinematic anamorphic lens flare, golden spotlight camera aura.",
    movies: "Hollywood red carpet premiere, cinematic anamorphic lens flare, golden spotlight camera aura.",
    fashion: "High-fashion Paris/Tunis runway, luxury gold accents, stylish magazine aesthetic.",
    style: "High-fashion Paris/Tunis runway, luxury gold accents, stylish magazine aesthetic.",
    shopping: "High-fashion boutique avenue, luxury gold accents, stylish magazine aesthetic.",
    travel: "Panoramic mountain peak sunrise, golden horizon clouds, adventurous wanderlust atmosphere.",
    trips: "Panoramic mountain peak sunrise, golden horizon clouds, adventurous wanderlust atmosphere.",
    hiking: "Panoramic mountain peak sunrise, golden horizon clouds, adventurous wanderlust atmosphere.",
    photography: "Professional studio photography setup, golden hour lighting, camera aperture gold bokeh.",
    photo: "Professional studio photography setup, golden hour lighting, camera aperture gold bokeh.",
    art: "Creative artist atelier, golden paint splatters, canvas watercolor particle atmosphere.",
    drawing: "Creative artist atelier, golden paint splatters, canvas watercolor particle atmosphere.",
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
        position: directPosition,
        stats,
        profileInfo,
        backgroundStyle,
        answers,
        personality,
        freeDescription,
        designNotes: directDesignNotes,
    } = input;

    // Parse multi-hobbies
    const rawHobbies = profileInfo?.hobbies;
    const hobbiesArray = Array.isArray(rawHobbies)
        ? rawHobbies
        : typeof rawHobbies === "string" && rawHobbies.trim()
        ? rawHobbies.split(",").map((h) => h.trim())
        : [];
    const hobbiesFormatted = hobbiesArray.filter(Boolean).join(", ");

    // Combined context text for keyword & contextual detection
    const combinedAnswers = { ...(answers || {}), ...(personality || {}) };
    const contextText = `${hobbiesFormatted} ${profileInfo?.description || ""} ${freeDescription || ""} ${directDesignNotes || ""} ${JSON.stringify(combinedAnswers)}`.toLowerCase();

    // 1. Resolve Dynamic Position & Title if default or not set
    const dynamicResolved = resolveDynamicPositionAndTitle({
        gender: profileInfo?.gender,
        age: profileInfo?.age,
        description: profileInfo?.description || freeDescription,
        hobbies: hobbiesArray,
        designNotes: directDesignNotes || profileInfo?.designNotes,
        answers: combinedAnswers,
    });

    const personName = (profileInfo?.name || name || "LEGEND").toUpperCase();
    const finalPosition = (directPosition && directPosition !== "GOAT" && directPosition !== "BOSS" ? directPosition : dynamicResolved.position).toUpperCase();

    // 2. Format 6 Stats with contextual explanation sub-notes
    const finalStats = (stats && stats.length > 0
        ? stats
        : [
              { code: "DHK", value: 85 },
              { code: "JAW", value: 90 },
              { code: "S7B", value: 88 },
              { code: "9HW", value: 80 },
              { code: "DBR", value: 82 },
              { code: "HRB", value: 75 },
          ]
    ).slice(0, 6);

    // Build explicit 3-line column layout specification
    let statsSpecDirective = `CRITICAL STATS & EXPLANATION SUB-NOTES (MUST BE PRINTED UNDER EACH STAT COLUMN):\n`;
    statsSpecDirective += `Each of the 6 stat columns along the bottom row MUST strictly contain 3 elements stacked vertically in metallic GOLD lettering:\n`;
    statsSpecDirective += `- Line 1 (Top): 3-letter Stat CODE (uppercase bold gold, e.g. DHK)\n`;
    statsSpecDirective += `- Line 2 (Middle): Numeric Stat VALUE (large bold gold number, e.g. 98)\n`;
    statsSpecDirective += `- Line 3 (Bottom): Explanation SUB-NOTE (small uppercase bold gold/white text, e.g. DIMA YADH7AK)\n\n`;
    statsSpecDirective += `EXACT 6 STAT COLUMNS TO RENDER:\n`;

    const statStrings: string[] = [];
    finalStats.forEach((s, idx) => {
        const resolvedNote = s.note || extractNotesFromContext(s.code, s.value, contextText);
        statsSpecDirective += `Column ${idx + 1}: Code "${s.code}" | Number "${s.value}" | Sub-Note "${resolvedNote}"\n`;
        statStrings.push(`${s.code} ${s.value} (${resolvedNote})`);
    });

    // 3. Synthesize Background Art Direction based on Hobbies / Style
    let themeDirectives: string[] = [];
    if (backgroundStyle && backgroundStyle.trim()) {
        themeDirectives.push(backgroundStyle.trim());
    }

    Object.entries(HOBBY_DIRECTIVES).forEach(([keyword, directive]) => {
        if (contextText.includes(keyword) && !themeDirectives.includes(directive)) {
            themeDirectives.push(directive);
        }
    });

    let backgroundArtDirective = "";
    if (themeDirectives.length > 0) {
        backgroundArtDirective = `- Thematic Environment: ${themeDirectives.slice(0, 3).join(" blended with ")}\n`;
        backgroundArtDirective += `- Color Palette & Tone: Deep elegant dark obsidian and rich cinematic atmospheric lighting tailored to the theme, with high dynamic contrast. Do NOT make the background all-gold.`;
    } else {
        backgroundArtDirective = `- Thematic Environment: Deep elegant dark obsidian with subtle white Carrara marble texture and rich dynamic contrast.\n`;
        backgroundArtDirective += `- Color Palette & Tone: Sophisticated dark luxury sports card atmosphere with subtle gold rim reflections. Do NOT make the entire background golden.`;
    }

    // 4. Synthesize Subject Portrait & Age Archetype Direction
    const ageNum = parseInt(String(profileInfo?.age || "25"), 10) || 25;
    const gender = profileInfo?.gender === "female" ? "female" : "male";

    let portraitDirective = `- Subject Name: ${personName}\n`;
    portraitDirective += `- Gender & Identity: The portrait MUST accurately reflect a ${gender} subject appearance, preserving facial likeness from the photo.\n`;
    portraitDirective += `- Subject Age: ${ageNum} years old.\n`;

    if (ageNum < 13) {
        portraitDirective += `- AGE ARCHETYPE (CHILD / WONDERKID): Young prodigy / future superstar portrait. Bright youthful energy, boy/girl wonder sports aura, energetic expression, clean junior athletic apparel.\n`;
    } else if (ageNum < 20) {
        portraitDirective += `- AGE ARCHETYPE (TEEN / NEXT-GEN): Next-generation rookie phenom / rising star portrait. Dynamic modern athletic styling, confident young face, fresh swagger.\n`;
    } else if (ageNum < 35) {
        portraitDirective += `- AGE ARCHETYPE (PRIME ADULT / SUPERSTAR): Peak prime elite athlete portrait. Chiseled confidence, heroic focus, supreme athletic expression.\n`;
    } else if (ageNum < 51) {
        portraitDirective += `- AGE ARCHETYPE (VETERAN / CAPTAIN): Seasoned team captain / iconic maestro portrait. Distinguished mature charisma, commanding leadership presence, poised authority.\n`;
    } else {
        portraitDirective += `- AGE ARCHETYPE (SENIOR / GRANDMASTER): Timeless patriarch/matriarch / grandmaster portrait. Regal dignity, wise charisma, distinguished silver-touched elegance.\n`;
    }

    if (profileInfo?.description && profileInfo.description.trim()) {
        portraitDirective += `- Subject Persona & Story: ${profileInfo.description.trim().slice(0, 200)}\n`;
    }
    if (hobbiesFormatted) {
        portraitDirective += `- Passions & Lifestyle: ${hobbiesFormatted}\n`;
    }

    // Custom text & design specifications
    const customNotes = (directDesignNotes || profileInfo?.designNotes || "").trim().slice(0, 200);
    const subtitleToPrint = customNotes || profileInfo?.description?.slice(0, 50) || dynamicResolved.bio;

    if (customNotes) {
        statsSpecDirective += `\nCRITICAL PRINTED SUBTITLE / CUSTOM BANNER:\nVisibly print the text "${customNotes}" as the subtitle banner directly below the Player Name in crisp gold typography.\n`;
    }

    // 5. Compact JSON for image model
    const jsonString = JSON.stringify({
        name: personName,
        rating: overallRating || 85,
        pos: finalPosition,
        subtitle: subtitleToPrint,
        stats: statStrings,
    });

    // 6. Template replacements
    let prompt = template;
    if (prompt.includes("{BACKGROUND_ART_DIRECTION}")) {
        prompt = prompt.replace(/{BACKGROUND_ART_DIRECTION}/g, backgroundArtDirective);
    } else {
        prompt += `\n# BACKGROUND THEME:\n${backgroundArtDirective}\n`;
    }

    if (prompt.includes("{SUBJECT_PORTRAIT_DIRECTION}")) {
        prompt = prompt.replace(/{SUBJECT_PORTRAIT_DIRECTION}/g, portraitDirective);
    } else {
        prompt += `\n# SUBJECT PORTRAIT:\n${portraitDirective}\n`;
    }

    if (prompt.includes("{CARD_STATS_AND_NOTES_SPECIFICATION}")) {
        prompt = prompt.replace(/{CARD_STATS_AND_NOTES_SPECIFICATION}/g, statsSpecDirective);
    } else {
        prompt += `\n${statsSpecDirective}\n`;
    }

    prompt = prompt.replace(/{PLAYER_DATA_JSON}/g, jsonString);

    return prompt;
}

