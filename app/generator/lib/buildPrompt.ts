import {
    SelectedStat,
    getDynamicStatNote,
    extractNotesFromContext,
    resolveDynamicPositionAndTitle,
    TUNISIA_STATS,
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
    theatre: "Prestigious historic grand theatre stage, cinematic velvet gold lighting, dramatic architectural archways and spotlight bokeh.",
    theater: "Prestigious historic grand theatre stage, cinematic velvet gold lighting, dramatic architectural archways and spotlight bokeh.",
    masra7: "Prestigious historic grand theatre stage, cinematic velvet gold lighting, dramatic architectural archways and spotlight bokeh.",
    actor: "Grand cinematic film set and prestigious theatre stage atmosphere, golden rim lighting, anamorphic lens flares.",
    acting: "Grand cinematic film set and prestigious theatre stage atmosphere, golden rim lighting, anamorphic lens flares.",
    comedy: "Prestigious comedy theatre arena, cinematic warm golden spotlighting, vibrant live audience ambiance.",
    comedian: "Prestigious comedy theatre arena, cinematic warm golden spotlighting, vibrant live audience ambiance.",
    standup: "Prestigious comedy theatre arena, cinematic warm golden spotlighting, vibrant live audience ambiance.",
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
    // Filter out coffeeLevel key to prevent its name from triggering coffee background
    const { coffeeLevel: _cl, ...filteredAnswers } = combinedAnswers as any;
    const contextText = `${hobbiesFormatted} ${profileInfo?.description || ""} ${freeDescription || ""} ${directDesignNotes || ""} ${JSON.stringify(filteredAnswers)}`.toLowerCase();

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
              { code: "ZHR", value: 80 },
              { code: "DBR", value: 82 },
              { code: "HRB", value: 75 },
          ]
    ).slice(0, 6);

    // Build explicit 3-line column layout specification
    let statsSpecDirective = `CRITICAL STATS, EMOJIS & EXPLANATION SUB-NOTES (MUST BE PRINTED UNDER EACH STAT COLUMN):\n`;
    statsSpecDirective += `Each of the 6 stat columns along the bottom row MUST strictly render:\n`;
    statsSpecDirective += `- Line 1 (Top): Cultural Emoji icon + 3-letter Stat CODE in uppercase bold metallic gold (e.g. "😂 DHK")\n`;
    statsSpecDirective += `- Line 2 (Middle): Numeric Stat VALUE in large bold metallic gold numbers (e.g. 98)\n`;
    statsSpecDirective += `- Line 3 (Bottom): Explanation SUB-NOTE in small uppercase bold gold/white text (e.g. DIMA YADH7AK)\n\n`;
    statsSpecDirective += `EXACT 6 STAT COLUMNS TO RENDER:\n`;

    const statStrings: string[] = [];
    finalStats.forEach((s: any, idx) => {
        const resolvedNote = s.note || extractNotesFromContext(s.code, s.value, contextText);
        const statDef = TUNISIA_STATS.find((t) => t.code === s.code);
        const emoji = s.emoji || statDef?.emoji || "⭐";
        statsSpecDirective += `Column ${idx + 1}: Emoji "${emoji}" + Code "${s.code}" | Number "${s.value}" | Sub-Note "${resolvedNote}"\n`;
        statStrings.push(`${emoji} ${s.code} ${s.value} (${resolvedNote})`);
    });

    // 3. Synthesize Background Art Direction — narrative-driven, celebrating user career & works
    let themeDirectives: string[] = [];
    if (backgroundStyle && backgroundStyle.trim()) {
        themeDirectives.push(backgroundStyle.trim());
    }

    Object.entries(HOBBY_DIRECTIVES).forEach(([keyword, directive]) => {
        if (contextText.includes(keyword) && !themeDirectives.includes(directive)) {
            themeDirectives.push(directive);
        }
    });

    // ── Extract contextual mood & personality signals from stats ──
    const statMoodSignals: string[] = [];
    const highStats = finalStats.filter((s) => s.value >= 85);

    // Map dominant stat codes to atmospheric hints (no extra AI cost, pure logic)
    const STAT_ATMOSPHERE: Record<string, string> = {
        DHK: "warm playful energy, lighthearted radiance",
        NKT: "comedic stage spotlight, vibrant fun atmosphere",
        JAW: "chill luxurious lounge vibes, relaxed golden ambiance",
        DRM: "dramatic cinematic intensity, bold contrast shadows",
        HDR: "magnetic storytelling aura, stage presence",
        KHD: "master craftsman work ethic, professional dedication glow",
        MKH: "intellectual quantum data streams, cerebral glow",
        DBR: "industrial workshop sparks, problem-solver forge",
        HRB: "mysterious escape artist smoke, vanishing trails",
        GZR: "bold fiery confidence aura, blazing presence",
        "3SB": "intense volcanic energy, fiery red-gold tension",
        L3B: "mischievous neon trickster glow, playful chaos",
        HOB: "romantic soft rose-gold ambiance, heartfelt warmth",
        S7B: "brotherhood golden circle, loyal friendship energy",
        RKD: "midnight dreamy moonlit atmosphere, sleepy cosmos",
        S7R: "midnight owl neon city, late-night urban energy",
        BRM: "gourmet feast golden table, abundant food aesthetic",
        KRK: "speed dashboard neon, racing cockpit glow",
        NFS: "competitive arena fire, champion rivalry energy",
        TKK: "money vault golden luxury, business empire aesthetic",
        SRF: "shopping luxury bags, premium retail golden glow",
        LBG: "fashion editorial elegance, haute couture spotlight",
        MRG: "sleek mirror reflection, polished style confidence",
        CHJ: "heroic lion-heart courage, brave warrior glow",
        SBR: "serene zen patience, calm meditative golden mist",
    };

    highStats.forEach((s) => {
        const atmo = STAT_ATMOSPHERE[s.code];
        if (atmo && !statMoodSignals.includes(atmo)) {
            statMoodSignals.push(atmo);
        }
    });

    // ── Extract user career story, projects & design notes ──
    const rawNotes = (directDesignNotes || profileInfo?.designNotes || "").trim();
    const userStory = (profileInfo?.description || freeDescription || "").trim();
    const descriptionHints: string[] = [];
    const combinedUserText = `${userStory} ${rawNotes}`.toLowerCase();

    // Detect mood/atmosphere keywords from user's free text
    const MOOD_KEYWORDS: [RegExp, string][] = [
        [/dark|sombre|mysterious|mysteri/i, "deep mysterious dark shadows with subtle golden rim light"],
        [/bright|colorful|vibrant|cheerful/i, "vibrant radiant energy with warm golden highlights"],
        [/elegant|luxury|luxe|royal|premium/i, "ultra-premium luxury elegance with rich gold accents"],
        [/aggressive|savage|beast|fire|intense/i, "intense fiery energy with bold dramatic contrast"],
        [/calm|zen|peaceful|quiet|serene/i, "serene tranquil atmosphere with soft golden mist"],
        [/night|nuit|3am|midnight|ليل/i, "nocturnal urban neon cityscape with moody golden reflections"],
        [/funny|humor|laugh|yadh7ak|نكت/i, "warm spotlight stage with playful comic energy"],
        [/leader|boss|patron|captain|chef/i, "commanding throne room power with imperial golden glow"],
        [/street|urban|city|حومة|7ouma/i, "gritty Tunisian medina street art with golden graffiti accents"],
        [/nature|mountain|forest|جبل/i, "majestic natural landscape with golden sunlight filtering through"],
        [/party|celebration|fête|حفلة/i, "festive celebration with golden confetti and sparkler energy"],
        [/vintage|retro|classic|قديم/i, "vintage sepia-toned aesthetic with classic golden grain texture"],
    ];

    MOOD_KEYWORDS.forEach(([regex, hint]) => {
        if (regex.test(combinedUserText) && !descriptionHints.includes(hint)) {
            descriptionHints.push(hint);
        }
    });

    // ── Build the final background art directive ──
    let backgroundArtDirective = "";

    // Extract highlighted project names from user story (e.g. *Denya Okhra*, "Super Tounsi", VISA)
    const projectMatches: string[] = [];
    const italicOrQuoteRegex = /[\*\"\'\`_]([A-Za-z0-9\s\u0600-\u06FF\-\:\.]{2,35})[\*\"\'\`_]/g;
    let match;
    while ((match = italicOrQuoteRegex.exec(userStory)) !== null) {
        const clean = match[1].trim();
        if (clean.length >= 2 && !projectMatches.includes(clean)) {
            projectMatches.push(clean);
        }
    }

    if (userStory) {
        backgroundArtDirective += `- PRIMARY BACKGROUND MOTIF — SUBJECT CAREER, WORKS & REAL HISTORY (CRITICAL REQUIREMENT):\n`;
        backgroundArtDirective += `  The background scene MUST be custom-designed around this subject's real works, projects, career history, and persona:\n`;
        backgroundArtDirective += `  "${userStory.slice(0, 1000)}"\n`;

        if (projectMatches.length > 0) {
            backgroundArtDirective += `  - SPECIFIC PROJECTS & SHOW TITLES TO FEATURE IN BACKGROUND:\n`;
            backgroundArtDirective += `    Prominently display authentic production posters, theatre marquees, cinema billings, and film clapperboards featuring the exact titles: ${projectMatches.map((p) => `"${p}"`).join(", ")}.\n`;
            backgroundArtDirective += `    Do NOT generate generic stock photos; the background posters, marquees, and monitors MUST specifically showcase these named works and iconic characters.\n`;
        }

        backgroundArtDirective += `  Illustrate a prestigious, cinematic, atmospheric environment celebrating their specific world (e.g. iconic TV & movie sets, theatrical staging, film production aesthetics, creative milestones) deeply woven into a luxury dark obsidian composition.\n`;
    }

    if (themeDirectives.length > 0) {
        backgroundArtDirective += `- Primary Environment Theme: ${themeDirectives.slice(0, 2).join(" blended with ")}\n`;
    } else if (!userStory) {
        backgroundArtDirective += `- Thematic Environment: Deep elegant dark obsidian with subtle white Carrara marble texture and rich dynamic contrast.\n`;
    }

    if (statMoodSignals.length > 0) {
        backgroundArtDirective += `- Personality Atmosphere: Subtly infuse ${statMoodSignals.slice(0, 2).join(" and ")} into the environment lighting.\n`;
    }

    if (rawNotes) {
        backgroundArtDirective += `- CUSTOM VISUAL NOTES: "${rawNotes}" — incorporate this aesthetic into the scene composition.\n`;
    }

    backgroundArtDirective += `- STRICT CLEANLINESS RULE: NO random neon speech bubbles, NO floating quote balloons with text, NO cartoonish isolated props on stools. Everything must be cohesive, grand, and cinematic.\n`;
    backgroundArtDirective += `- Color Palette & Tone: Deep elegant dark obsidian and rich cinematic atmospheric lighting tailored to the subject's world, with high dynamic contrast. Do NOT make the entire background solid gold.`;

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
        portraitDirective += `- Subject Persona & Story: ${profileInfo.description.trim().slice(0, 600)}\n`;
    }
    if (hobbiesFormatted) {
        portraitDirective += `- Passions & Lifestyle: ${hobbiesFormatted}\n`;
    }

    // Player honorary subtitle (title/bio, NOT design notes)
    const subtitleToPrint = dynamicResolved.bio || profileInfo?.description?.slice(0, 50) || "BORN TO BE LEGENDARY";

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

