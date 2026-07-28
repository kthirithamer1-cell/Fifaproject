import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { buildDynamicPrompt } from "../../generator/lib/buildPrompt";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper to load reference image as base64
function loadReferenceImageBase64(filename: string): string | null {
    try {
        let imgPath = path.join(process.cwd(), filename);
        if (!fs.existsSync(imgPath)) {
            imgPath = path.join(process.cwd(), "public", "images", filename);
        }
        if (!fs.existsSync(imgPath)) {
            imgPath = path.join(process.cwd(), "public", "prompting", filename);
        }
        if (!fs.existsSync(imgPath)) {
            console.warn(`Reference image not found: ${filename}`);
            return null;
        }
        const buffer = fs.readFileSync(imgPath);
        return `data:image/png;base64,${buffer.toString("base64")}`;
    } catch (e) {
        console.error(`Failed to load reference image ${filename}:`, e);
        return null;
    }
}

// ─── Helper: process image response from gpt-image-1 ────────────────────────
async function processImageResponse(imageResponse: any): Promise<string> {
    const imageData = imageResponse.data?.[0];
    const base64Image = imageData?.b64_json;
    const imageUrl = imageData?.url;

    if (base64Image) {
        console.log("✅ Received b64_json response from gpt-image-1");
        return `data:image/png;base64,${base64Image}`;
    } else if (imageUrl) {
        console.log("✅ Received URL response, downloading...");
        const imgResponse = await fetch(imageUrl);
        if (!imgResponse.ok) {
            throw new Error("Failed to download generated card image");
        }
        const arrayBuffer = await imgResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        return `data:image/png;base64,${base64}`;
    } else {
        console.error("❌ gpt-image-1 returned no image data:", JSON.stringify(imageResponse.data));
        throw new Error("OpenAI returned no image data.");
    }
}

// ─── AI Card Generator ──────────────────────────────────────────────────

// ─── Full AI mode: generate the complete card ─────────────────────────────
async function generateFullAICard(
    photo: string,
    cardData: any,
    overallRating: number,
    profileInfo?: any,
    stats?: any[]
): Promise<string> {
    // 1. Read prompt template from public/prompting/prompt.txt
    const promptTemplatePath = path.join(process.cwd(), "public", "prompting", "prompt.txt");
    if (!fs.existsSync(promptTemplatePath)) {
        throw new Error("Prompt template not found");
    }
    const template = fs.readFileSync(promptTemplatePath, "utf-8");

    // 2. Build dynamic personalized prompt with all collected data as JSON
    const name = profileInfo?.name || cardData?.name || "LEGEND";
    const finalPrompt = buildDynamicPrompt(template, {
        name,
        overallRating: overallRating || 85,
        position: cardData?.position || "GOAT",
        stats: stats || cardData?.stats || [
            { code: "DHK", value: 85 },
            { code: "JAW", value: 90 },
            { code: "S7B", value: 88 },
            { code: "9HW", value: 80 },
            { code: "DBR", value: 82 },
            { code: "HRB", value: 75 },
        ],
        mood: cardData?.mood || "Legendary",
        recipient: cardData?.recipient || "Friend",
        profileInfo,
        designNotes: cardData?.designNotes || profileInfo?.designNotes,
        answers: cardData?.answers || cardData?.personality,
        personality: cardData?.personality,
        freeDescription: cardData?.freeDescription,
        title: `${name.toUpperCase()} - THE LEGEND`,
    });

    // 3. Convert base64 photo to Buffer for images.edit()
    const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
    const photoBuffer = Buffer.from(base64Data, "base64");

    console.log("Generating card with gpt-image-2 (photo passed directly, no Vision step)...");
    console.log("Final Prompt length:", finalPrompt.length, "chars");

    // 4. Generate card — pass the user's face photo directly to gpt-image-2
    //    No need for a separate Vision call to describe the face
    const imageResponse = await openai.images.edit({
        model: "gpt-image-2",
        image: new File([photoBuffer], "photo.png", { type: "image/png" }),
        prompt: finalPrompt,
        size: "auto",
    });

    return processImageResponse(imageResponse);
}

// ─── Cooldown Helper (24-Hour Rate Limit) ───────────────────────────────────
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function checkCooldown(req: NextRequest) {
    const cookie = req.cookies.get("card_last_gen");
    if (!cookie || !cookie.value) {
        return { isAllowed: true, remainingSeconds: 0 };
    }

    const lastGenTime = parseInt(cookie.value, 10);
    if (isNaN(lastGenTime)) {
        return { isAllowed: true, remainingSeconds: 0 };
    }

    const elapsed = Date.now() - lastGenTime;
    if (elapsed < COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        return {
            isAllowed: false,
            remainingSeconds,
            nextAllowedAt: new Date(lastGenTime + COOLDOWN_MS).toISOString(),
        };
    }

    return { isAllowed: true, remainingSeconds: 0 };
}

// ─── GET Handler: Check generation cooldown status ──────────────────────────
export async function GET(req: NextRequest) {
    const cooldown = checkCooldown(req);
    if (!cooldown.isAllowed) {
        return NextResponse.json({
            canGenerate: false,
            cooldownRemainingSeconds: cooldown.remainingSeconds,
            nextAllowedAt: cooldown.nextAllowedAt,
            message: "24-hour AI generation cooldown active. You can edit your card details freely or share on social media to unlock!",
        });
    }

    return NextResponse.json({
        canGenerate: true,
        cooldownRemainingSeconds: 0,
    });
}

// ─── DELETE Handler: Unlock 24-hour cooldown by social media share ─────────
export async function DELETE() {
    const response = NextResponse.json({
        success: true,
        message: "AI Card Regeneration unlocked via social media share! 🎉",
    });

    // Clear rate limit cookie
    response.cookies.set("card_last_gen", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    });

    return response;
}

// ─── Main POST handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        // Enforce 24-hour rate limit
        const cooldown = checkCooldown(req);
        if (!cooldown.isAllowed) {
            return NextResponse.json(
                {
                    error: `You can only generate an AI card once every 24 hours. You can still edit your existing card details freely! Next generation available in ${Math.floor((cooldown.remainingSeconds || 0) / 3600)}h ${Math.floor(((cooldown.remainingSeconds || 0) % 3600) / 60)}m.`,
                    cooldownRemainingSeconds: cooldown.remainingSeconds,
                    nextAllowedAt: cooldown.nextAllowedAt,
                },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { photo, cardData, overallRating, mode, backgroundStyle, freeDescription, profileInfo, stats } = body;

        if (!photo) {
            return NextResponse.json({ error: "Photo is required" }, { status: 400 });
        }

        console.log("=== FULL AI CARD GENERATION ===");
        const rawDataUrl = await generateFullAICard(photo, cardData, overallRating, profileInfo, stats);

        // Prepare response with HttpOnly cookie to enforce 24h limit
        const response = NextResponse.json({ imageUrl: rawDataUrl });
        response.cookies.set("card_last_gen", Date.now().toString(), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 86400, // 24 hours in seconds
        });

        return response;

    } catch (error: any) {
        console.error("API Route Error:", error);
        
        try {
            const logContent = `[${new Date().toISOString()}] API Route Error:\nMessage: ${error.message || ""}\nCode: ${error.code || ""}\nStatus: ${error.status || ""}\n\n`;
            fs.appendFileSync(path.join(process.cwd(), "api_error.log"), logContent);
        } catch (_) {}

        return NextResponse.json(
            { 
                error: error.message || "Failed to generate card",
                details: {
                    message: error.message || null,
                    code: error.code || null,
                    status: error.status || null,
                }
            },
            { status: 500 }
        );
    }
}
