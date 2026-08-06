import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { TUNISIA_STATS } from "@/app/constant";

// Helper to get OpenAI client lazily with fallback for build time
function getOpenAIClient() {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { answers, profileInfo, gender } = body;

        if (!answers || Object.keys(answers).length === 0) {
            return NextResponse.json(
                { error: "Interview answers are required" },
                { status: 400 }
            );
        }

        const userGender = (gender || profileInfo?.gender || "").toLowerCase();
        const isFemale = userGender === "female" || userGender === "woman" || userGender === "f";
        const personName = profileInfo?.name || "THE PLAYER";

        // Build a compact stat list for the prompt
        const statListStr = TUNISIA_STATS.map(
            (s) => `${s.code}: ${s.meaning}`
        ).join("\n");

        // Build answers summary
        const answersStr = Object.entries(answers)
            .map(([key, val]) => `- ${key}: ${val}`)
            .join("\n");

        const positionExamples = isFemale
            ? `"QUEEN", "DIVA", "ICON", "STAR", "CHIC", "GLAM", "BOSS", "JAW", "HERO", "VIP", "PRO"`
            : `"KING", "BOSS", "DEV", "JAW", "PRO", "CEO", "VIP", "HERO", "SNIPER"`;

        const cardTitleExamples = isFemale
            ? `"THE QUEEN", "CAFFEINE QUEEN", "DRAMA QUEEN", "GLAM ICON", "CHIC BOSS", "UNSTOPPABLE QUEEN"`
            : `"THE LEGEND", "CAFFEINE KING", "DRAMA BOSS", "CHAMPION"`;

        const samplePosition = isFemale ? "QUEEN" : "BOSS";

        const prompt = `You are analyzing a Tunisian ${isFemale ? "woman / female" : "person"}'s personality based on their interview answers.
Name: ${personName}
Gender: ${isFemale ? "FEMALE" : "MALE"}

Based on their answers below:
1. Pick EXACTLY 6 stats from the Tunisian stats list that best match their personality.
2. Generate a dynamic role/position (${positionExamples}) tailored strictly to their gender and persona.
3. Generate 3 dynamic attribute badges tailored to their personality (e.g. Skill move stars "SKILL 5★", Weak foot "WEAK 5★", Work rate "WORK H/H" or custom personality traits).

INTERVIEW ANSWERS:
${answersStr}

AVAILABLE TUNISIAN STATS (pick exactly 6):
${statListStr}

Respond with ONLY valid JSON in this exact format, no extra text:
{
  "stats": [
    {"code": "DHK", "value": 92},
    {"code": "JAW", "value": 88},
    {"code": "S7B", "value": 95},
    {"code": "9HW", "value": 85},
    {"code": "DBR", "value": 78},
    {"code": "HRB", "value": 72}
  ],
  "overall": 85,
  "position": "${samplePosition}",
  "badges": [
    {"title": "SKILL 5★"},
    {"title": "WEAK 5★"},
    {"title": "WORK H/H"}
  ],
  "cardTitle": ${isFemale ? '"THE QUEEN"' : '"THE LEGEND"'},
  "bio": "Born to spread good vibes and drink 9ahwa",
  "description": "Humor • Good vibes • Friendship • Coffee"
}

Rules:
- Pick stats that strongly match the personality shown in the answers
- The "overall" must be the mathematical average of the 6 stat values, rounded
- "position" MUST fit their gender: ${isFemale ? "Use feminine or empowering short titles like QUEEN, DIVA, ICON, STAR, CHIC, GLAM, BOSS, HERO, PRO, VIP, JAW" : "Use masculine/neutral titles like KING, BOSS, DEV, JAW, PRO, CEO, HERO, VIP"}
- "badges" must contain 3 dynamic 2-3 word attribute badges (e.g., "SKILL 5★", "WEAK 5★", "WORK H/H" or custom traits)
- "cardTitle" should be a fun 2-3 word title in caps (${cardTitleExamples})
- "bio" should be a short witty one-liner about this person
- "description" should be 4 trait keywords separated by bullet points (•)
- Use ONLY stat codes from the provided list`;

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
            max_tokens: 220,
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

        // Validate stat codes exist
        const validCodes = TUNISIA_STATS.map((s) => s.code);
        for (const stat of parsed.stats) {
            if (!validCodes.includes(stat.code)) {
                console.warn(`AI returned unknown stat code: ${stat.code}, replacing with DHK`);
                stat.code = "DHK";
            }
            stat.value = Math.max(40, Math.min(99, Math.round(stat.value)));
        }

        // Recalculate overall to ensure accuracy
        const sum = parsed.stats.reduce((acc: number, s: { value: number }) => acc + s.value, 0);
        parsed.overall = Math.round(sum / 6);

        console.log("[AI-CARD] Generated stats:", JSON.stringify(parsed, null, 2));

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
