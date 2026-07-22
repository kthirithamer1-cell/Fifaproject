import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Full Tunisia stats dataset for AI context
const TUNISIA_STATS = [
    { code: "DHK", stat: "Dhahka", meaning: "Humor 😂" },
    { code: "NKT", stat: "Nokta", meaning: "Joke quality 🎭" },
    { code: "KLM", stat: "Klem", meaning: "Talking ability 🗣️" },
    { code: "HDR", stat: "Hadhra", meaning: "Storytelling 🎤" },
    { code: "JAW", stat: "Jaw", meaning: "Good vibes 😎" },
    { code: "DRM", stat: "Drama", meaning: "Drama creation 🎭" },
    { code: "HRB", stat: "Hroub", meaning: "Escaping responsibilities 🏃" },
    { code: "KHD", stat: "Khidma", meaning: "Work ethic 💼" },
    { code: "MKH", stat: "Mekh", meaning: "Intelligence 🧠" },
    { code: "DBR", stat: "Debber Rassek", meaning: "Problem solving 🛠️" },
    { code: "SBR", stat: "Sabr", meaning: "Patience 😇" },
    { code: "ZHR", stat: "zhar", meaning: "Luck 🍀" },
    { code: "7IL", stat: "Hila", meaning: "Tricks & cleverness 🎩" },
    { code: "FRS", stat: "Frassa", meaning: "Detective skills 🕵️" },
    { code: "CHK", stat: "Chkoun?", meaning: "Curiosity / Gossip 👂" },
    { code: "3YN", stat: "3in", meaning: "Observation 👀" },
    { code: "WST", stat: "Wasta", meaning: "Connections 🤝" },
    { code: "TKK", stat: "TEKTEK", meaning: "Money-making 💰" },
    { code: "CRZ", stat: "Corza", meaning: "Financial management 💳" },
    { code: "BKL", stat: "Bokhl", meaning: "Stinginess 💵" },
    { code: "SRF", stat: "Sarf", meaning: "Spending money 💸" },
    { code: "MRG", stat: "Mriguel", meaning: "Style 😎" },
    { code: "LBG", stat: "Labga", meaning: "Elegance 👔" },
    { code: "GZR", stat: "Gzara", meaning: "Boldness 🔥" },
    { code: "TMS", stat: "Tmassik", meaning: "Stubbornness 😤" },
    { code: "3SB", stat: "A3sab", meaning: "Anger 😡" },
    { code: "HCH", stat: "Hachma Resistance", meaning: "Shamelessness 😂" },
    { code: "FDH", stat: "Fdhou7", meaning: "Embarrassing moments 🤦" },
    { code: "MCH", stat: "Mchawech", meaning: "Chaos 🌪️" },
    { code: "L3B", stat: "La3b", meaning: "Mischief 😈" },
    { code: "TBR", stat: "Tbarbir", meaning: "Complaining 😤" },
    { code: "SDA", stat: "Sda3", meaning: "Noise level 🔊" },
    { code: "FRJ", stat: "Ferja", meaning: "Watching others 👀" },
    { code: "RKD", stat: "Rekd", meaning: "Sleeping 😴" },
    { code: "9HW", stat: "9ahwa", meaning: "Coffee addiction ☕" },
    { code: "CHY", stat: "Chay", meaning: "Tea addiction 🍵" },
    { code: "W9T", stat: "Wakt", meaning: "Punctuality ⏰" },
    { code: "SMS", stat: "Semsara", meaning: "Negotiation 🤝" },
    { code: "S7B", stat: "S7ab", meaning: "Friendship 🤜🤛" },
    { code: "HOB", stat: "Hob", meaning: "Romance ❤️" },
    { code: "KDB", stat: "Kedhb", meaning: "Lying skill 😅" },
    { code: "MSL", stat: "Mas2ouliya", meaning: "Responsibility 📋" },
    { code: "CHJ", stat: "Maywakherhech", meaning: "Courage 🦁" },
    { code: "BRD", stat: "Broud", meaning: "Calmness 🧊" },
    { code: "NFS", stat: "Nefs", meaning: "Competitiveness ⚔️" },
    { code: "MAM", stat: "Weld omo", meaning: "Still calls mom for everything 😂" },
    { code: "STP", stat: "Stopet", meaning: "Can find a louage instantly 🚐" },
    { code: "GLB", stat: "Ghalba", meaning: "Surviving difficult situations 💪" },
    { code: "BRM", stat: "Barmil", meaning: "Eats everything 🍔" },
    { code: "S7R", stat: "S7our", meaning: "Late-night energy 🌙" },
    { code: "DWR", stat: "Dawran", meaning: "Wandering around for no reason 🚶" },
    { code: "KHB", stat: "Khabtha", meaning: "Creating trouble 💥" },
];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { answers } = body;

        if (!answers || Object.keys(answers).length === 0) {
            return NextResponse.json(
                { error: "Interview answers are required" },
                { status: 400 }
            );
        }

        // Build a compact stat list for the prompt
        const statListStr = TUNISIA_STATS.map(
            (s) => `${s.code}: ${s.meaning}`
        ).join("\n");

        // Build answers summary
        const answersStr = Object.entries(answers)
            .map(([key, val]) => `- ${key}: ${val}`)
            .join("\n");

        const prompt = `You are analyzing a Tunisian person's personality based on their interview answers.
Based on their answers below, pick EXACTLY 6 stats from the Tunisian stats list that best match their personality.
For each stat, give a value between 40 and 99 that reflects how strong that trait is for this person.

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
  "position": "JAW",
  "cardTitle": "THE LEGEND",
  "bio": "Born to spread good vibes and drink 9ahwa",
  "description": "Humor • Good vibes • Friendship • Coffee"
}

Rules:
- Pick stats that strongly match the personality shown in the answers
- The "overall" must be the mathematical average of the 6 stat values, rounded
- "position" should be the stat code that's most dominant for this person
- "cardTitle" should be a fun 2-3 word title in caps (like "THE LEGEND", "CAFFEINE KING", "DRAMA BOSS")
- "bio" should be a short witty one-liner about this person
- "description" should be 4 trait keywords separated by bullet points (•)
- Use ONLY stat codes from the provided list`;

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
            max_tokens: 400,
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
