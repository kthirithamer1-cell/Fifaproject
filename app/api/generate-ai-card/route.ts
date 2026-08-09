import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { TUNISIA_STATS } from "@/app/constant";
import {
    getDynamicStatNote,
    extractNotesFromContext,
    resolveDynamicPositionAndTitle,
} from "@/app/generator/lib/tunisiaStats";

// Helper to get OpenAI client lazily with fallback for build time
function getOpenAIClient() {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { answers, profileInfo } = body;

        const combinedAnswers = answers || {};
        const gender = profileInfo?.gender === "female" ? "female" : "male";
        const ageNum = parseInt(String(profileInfo?.age || "25"), 10) || 25;
        const hobbiesStr = Array.isArray(profileInfo?.hobbies)
            ? profileInfo.hobbies.join(", ")
            : String(profileInfo?.hobbies || "");
        const descriptionStr = String(profileInfo?.description || "");
        const designNotesStr = String(profileInfo?.designNotes || "");

        // Build a compact stat list for the prompt
        const statListStr = TUNISIA_STATS.map(
            (s) => `${s.code}: ${s.meaning}`
        ).join("\n");

        // Build answers summary
        const answersStr = Object.entries(combinedAnswers)
            .map(([key, val]) => `- ${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
            .join("\n");

        const prompt = `You are a witty, culture-savvy personality analyzer for a premium Tunisian FIFA-style meme card generator.
Analyze the person's profile, lifestyle, and answers below to generate their card attributes.

SUBJECT PROFILE:
- Name: ${profileInfo?.name || "Legend"}
- Gender: ${gender} (${gender === "female" ? "FEMALE SUBJECT" : "MALE SUBJECT"})
- Age: ${ageNum} years old
- Hobbies & Passions: ${hobbiesStr || "None specified"}
- Self Description & Bio: ${descriptionStr || "None specified"}
- Special User Notes: ${designNotesStr || "None specified"}

INTERVIEW ANSWERS:
${answersStr || "- Standard profile assessment"}

AVAILABLE TUNISIAN STATS (pick EXACTLY 6 best-fitting stats):
${statListStr}

GENDER & AGE TITLE RULES:
1. GENDER SENSITIVITY (STRICT):
   - IF FEMALE: Position and Card Title MUST be feminine or female-empowering! Examples of positions: "QUEEN", "QWEEN", "LADY BOSS", "LA PATRONNE", "DIVA", "FASHIONISTA", "WARRIOR", "CHARMEUSE", "SUPERWOMAN", "DIRECTRICE", "MALIKA", "AMIRA", "MAESTRA", "DRAMA QUEEN", "VIBE QUEEN". NEVER return "BOSS", "KING", or male terms for female subjects!
   - IF MALE: Use masculine/epic titles: "BOSS", "KING", "LEADER", "EL PADRE", "PATRON", "SULTAN", "MAESTRO", "WARRIOR", "GENTLEMAN", "CAPTAIN", "GOAT".
2. AGE-APPROPRIATE ARCHETYPES:
   - Age 4-12: "WONDERKID", "PETIT PRINCE", "PRINCESSE", "MINI BOSS", "FUTURE GOAT"
   - Age 13-19: "NEXT GEN", "RISING STAR", "ROOKIE", "PHENOM", "CRACK"
   - Age 20-34: "QUEEN", "BOSS", "GOAT", "LEGEND", "ELITE", "MAESTRO", "LA PATRONNE"
   - Age 35-50: "CAPTAIN", "LA PATRONNE", "EL PADRE", "ICON", "VETERAN"
   - Age 51+: "GRANDMASTER", "MALIKA", "EL CHIKH", "TIMELESS QUEEN", "THE MATRIARCH"
3. DESCRIPTION & HOBBY ADAPTATION:
   - If description/hobbies mention fashion/style -> position e.g. "DIVA" or "FASHIONISTA"
   - If coffee/lounges -> position e.g. "9AHWA QUEEN" or "9AHWA BOSS"
   - If gaming -> position e.g. "GAMING QUEEN" or "ESPORTS BOSS"
   - If food/cooking -> position e.g. "CHEF MASTER" or "GOURMET QUEEN"
   - If gym/fitness -> position e.g. "FITNESS QUEEN" or "BEAST MODE"
   - If drama/humor -> position e.g. "DRAMA QUEEN" or "DHAHKA KING"
4. STAT EXPLANATION SUB-NOTES:
   - For each of the 6 stats, provide a humorous 1-2 words Franco-Arabe / Derja sub-note tailored to the score value and the person's description (e.g. 9HW: "5 EXPRESS / J", KRK: "PILOTE TUNIS", W9T: "RETARD 1H", S7R: "BATMAN 3AM", DHK: "DIMA YADH7AK", JAW: "JAWOU BEHI").

Respond with ONLY valid JSON in this exact structure, no extra text:
{
  "stats": [
    {"code": "DHK", "value": 92, "note": "DIMA YADH7AK"},
    {"code": "JAW", "value": 88, "note": "JAWOU BEHI"},
    {"code": "S7B", "value": 95, "note": "SA7BI FI KOUCHI"},
    {"code": "9HW", "value": 85, "note": "5 EXPRESS / J"},
    {"code": "DBR", "value": 78, "note": "YSALEK OMOROU"},
    {"code": "HRB", "value": 72, "note": "YSALEKHA"}
  ],
  "overall": 85,
  "position": "${gender === "female" ? "QUEEN" : "BOSS"}",
  "cardTitle": "${gender === "female" ? "THE QUEEN" : "THE LEGEND"}",
  "bio": "Short witty one-liner in English or French",
  "description": "Trait1 • Trait2 • Trait3 • Trait4"
}`;

        const openai = getOpenAIClient();
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a fun personality analyzer for a Tunisian FIFA-style card generator. Always respond with valid JSON only.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 450,
            temperature: 0.8,
            response_format: { type: "json_object" },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("AI returned empty response");
        }

        const parsed = JSON.parse(content);

        // Validate the response structure
        if (!parsed.stats || !Array.isArray(parsed.stats) || parsed.stats.length !== 6) {
            throw new Error("AI returned invalid stats format");
        }

        const contextAll = `${hobbiesStr} ${descriptionStr} ${designNotesStr} ${answersStr}`.toLowerCase();

        // Validate stat codes exist and ensure dynamic note fallback
        const validCodes = TUNISIA_STATS.map((s) => s.code);
        for (const stat of parsed.stats) {
            if (!validCodes.includes(stat.code)) {
                console.warn(`AI returned unknown stat code: ${stat.code}, replacing with DHK`);
                stat.code = "DHK";
            }
            stat.value = Math.max(40, Math.min(99, Math.round(stat.value)));
            if (!stat.note || typeof stat.note !== "string" || !stat.note.trim()) {
                stat.note = extractNotesFromContext(stat.code, stat.value, contextAll);
            }
        }

        // Recalculate overall to ensure accuracy
        const sum = parsed.stats.reduce((acc: number, s: { value: number }) => acc + s.value, 0);
        parsed.overall = Math.round(sum / 6);

        // Ensure gender consistency for position
        if (gender === "female" && (!parsed.position || parsed.position.toUpperCase() === "BOSS" || parsed.position.toUpperCase() === "KING" || parsed.position.toUpperCase() === "GOAT")) {
            const fallbackResolved = resolveDynamicPositionAndTitle({
                gender: "female",
                age: ageNum,
                description: descriptionStr,
                hobbies: hobbiesStr,
                designNotes: designNotesStr,
                answers: combinedAnswers,
            });
            parsed.position = fallbackResolved.position;
            if (!parsed.cardTitle || parsed.cardTitle.toUpperCase().includes("KING") || parsed.cardTitle.toUpperCase().includes("BOSS")) {
                parsed.cardTitle = fallbackResolved.title;
            }
        }

        console.log("[AI-CARD] Generated stats with notes & dynamic position:", JSON.stringify(parsed, null, 2));

        return NextResponse.json(parsed);

    } catch (error: any) {
        console.error("[AI-CARD] Error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to generate AI card data",
                details: {
                    message: error.message || null,
                    code: error.code || null,
                },
            },
            { status: 500 }
        );
    }
}

