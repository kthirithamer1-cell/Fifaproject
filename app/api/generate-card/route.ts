import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { buildDynamicPrompt } from "../../generator/lib/buildPrompt";

export const dynamic = "force-dynamic";

// Helper to get OpenAI client lazily with fallback for build time
function getOpenAIClient() {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
    });
}

// Helper to load reference image as base64
function loadReferenceImageBase64(filename: string): string | null {
    try {
        const cleanName = path.basename(filename);
        let imgPath = path.join(process.cwd(), "public", "images", cleanName);
        if (!fs.existsSync(imgPath)) {
            imgPath = path.join(process.cwd(), "public", "prompting", cleanName);
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

// ─── Helper: process image response from gpt-image-2 ─────────────────────────
async function processImageResponse(imageResponse: any): Promise<string> {
    const imageData = imageResponse.data?.[0];
    const base64Image = imageData?.b64_json;
    const imageUrl = imageData?.url;

    let imageBuffer: Buffer;

    if (base64Image) {
        console.log("✅ Received b64_json response from gpt-image-2");
        imageBuffer = Buffer.from(base64Image, "base64");
    } else if (imageUrl) {
        console.log("✅ Received URL response, downloading...");
        const imgResponse = await fetch(imageUrl);
        if (!imgResponse.ok) {
            throw new Error("Failed to download generated card image");
        }
        const arrayBuffer = await imgResponse.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
    } else {
        console.error("❌ gpt-image-2 returned no image data:", JSON.stringify(imageResponse.data));
        throw new Error("OpenAI returned no image data.");
    }

    return `data:image/png;base64,${imageBuffer.toString("base64")}`;
}

// ─── Full AI Card Generator ────────────────────────────────────────────────────
async function generateFullAICard(
    photo: string,
    cardData: any,
    overallRating: number,
    profileInfo?: any,
    stats?: any[]
): Promise<string> {
    const promptTemplatePath = path.join(process.cwd(), "public", "prompting", "prompt.txt");
    if (!fs.existsSync(promptTemplatePath)) {
        throw new Error("Prompt template not found");
    }
    const template = fs.readFileSync(promptTemplatePath, "utf-8");

    const name = profileInfo?.name || cardData?.name || "LEGEND";
    const defaultPosition = profileInfo?.gender === "female" ? "QUEEN" : "BOSS";
    const finalPrompt = buildDynamicPrompt(template, {
        name,
        overallRating: overallRating || 85,
        position: cardData?.position || profileInfo?.position || defaultPosition,
        stats: stats || cardData?.stats || [
            { code: "DHK", value: 85 },
            { code: "JAW", value: 90 },
            { code: "S7B", value: 88 },
            { code: "ZHR", value: 80 },
            { code: "DBR", value: 82 },
            { code: "HRB", value: 75 },
        ],
        mood: cardData?.mood || "Legendary",
        recipient: cardData?.recipient || "Friend",
        modelId: cardData?.modelId,
        backgroundStyle: cardData?.backgroundStyle || profileInfo?.backgroundStyle || (cardData?.selectedBgUrl ? `Selected background: ${cardData.selectedBgUrl}` : undefined),
        badges: cardData?.badges,
        profileInfo,
        designNotes: cardData?.designNotes || profileInfo?.designNotes,
        answers: cardData?.answers || cardData?.personality,
        personality: cardData?.personality,
        freeDescription: cardData?.freeDescription,
        title: `${name.toUpperCase()} - ${profileInfo?.gender === "female" ? "THE QUEEN" : "THE LEGEND"}`,
    });

    const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
    const photoBuffer = Buffer.from(base64Data, "base64");

    const shapeRefBase64 = loadReferenceImageBase64("images/save.png");

    console.log("Generating card with gpt-image-2 (user photo + model reference)...");

    const imageInputs: any[] = [
        new File([photoBuffer], "photo.png", { type: "image/png" }),
    ];

    if (shapeRefBase64) {
        const shapeBase64Data = shapeRefBase64.replace(/^data:image\/\w+;base64,/, "");
        const shapeBuffer = Buffer.from(shapeBase64Data, "base64");
        imageInputs.push(new File([shapeBuffer], "card_model_reference.png", { type: "image/png" }));
    }

    const openai = getOpenAIClient();

    const shapePromptSuffix = shapeRefBase64
        ? "\n\nCRITICAL REFERENCE INSTRUCTION: Follow the exact shield silhouette and 3D gold frame border from the reference image (card_model_reference.png). Ensure 100% transparency outside the card frame and keep the entire shield uncropped."
        : "";

    const imageResponse = await openai.images.edit({
        model: "gpt-image-2",
        image: imageInputs,
        prompt: finalPrompt + shapePromptSuffix,
        size: "auto",
    });

    return processImageResponse(imageResponse);
}

// ─── Cooldown & Rate Limit Helper (3 Generations per 24 Hours) ────────────────
const MAX_GENERATIONS = 3;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

interface RateLimitStatus {
    canGenerate: boolean;
    remainingGenerations: number;
    totalGenerations: number;
    usedGenerations: number;
    cooldownRemainingSeconds: number;
    windowStart: number;
}

function getGenerationStatus(req: NextRequest): RateLimitStatus {
    const cookie = req.cookies.get("card_limit_data");
    let count = 0;
    let windowStart = Date.now();

    if (cookie && cookie.value) {
        try {
            const parsed = JSON.parse(cookie.value);
            if (typeof parsed.count === "number" && typeof parsed.windowStart === "number") {
                count = parsed.count;
                windowStart = parsed.windowStart;
            }
        } catch (e) {
            // fallback
        }
    } else {
        const legacyCookie = req.cookies.get("card_last_gen");
        if (legacyCookie && legacyCookie.value) {
            const legacyTime = parseInt(legacyCookie.value, 10);
            if (!isNaN(legacyTime)) {
                windowStart = legacyTime;
                count = 1;
            }
        }
    }

    const elapsed = Date.now() - windowStart;

    if (elapsed >= COOLDOWN_MS) {
        return {
            canGenerate: true,
            remainingGenerations: MAX_GENERATIONS,
            totalGenerations: MAX_GENERATIONS,
            usedGenerations: 0,
            cooldownRemainingSeconds: 0,
            windowStart: Date.now(),
        };
    }

    const remainingGenerations = Math.max(0, MAX_GENERATIONS - count);
    const cooldownRemainingSeconds = remainingGenerations === 0 ? Math.ceil((COOLDOWN_MS - elapsed) / 1000) : 0;

    return {
        canGenerate: remainingGenerations > 0,
        remainingGenerations,
        totalGenerations: MAX_GENERATIONS,
        usedGenerations: count,
        cooldownRemainingSeconds,
        windowStart,
    };
}

// ─── GET Handler: Check generation status & remaining attempts ─────────────
export async function GET(req: NextRequest) {
    const status = getGenerationStatus(req);
    return NextResponse.json(status);
}

// ─── Synchronous POST Handler ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const status = getGenerationStatus(req);
        if (!status.canGenerate) {
            return NextResponse.json(
                {
                    error: "You have used all 3 AI card generations for today. Your attempts will refresh automatically after 24 hours. You can still edit your existing card details freely!",
                    remainingGenerations: 0,
                    totalGenerations: MAX_GENERATIONS,
                    cooldownRemainingSeconds: status.cooldownRemainingSeconds,
                },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { photo, cardData, overallRating, profileInfo, stats } = body;

        if (!photo) {
            return NextResponse.json({ error: "Photo is required" }, { status: 400 });
        }

        console.log("=== FULL AI CARD GENERATION (Synchronous) ===");
        const rawDataUrl = await generateFullAICard(photo, cardData, overallRating, profileInfo, stats);

        const newCount = status.usedGenerations + 1;
        const newWindowStart = status.usedGenerations === 0 ? Date.now() : status.windowStart;
        const newRemaining = Math.max(0, MAX_GENERATIONS - newCount);
        const cooldownRemainingSeconds = newRemaining === 0 ? Math.ceil((COOLDOWN_MS - (Date.now() - newWindowStart)) / 1000) : 0;

        const response = NextResponse.json({
            imageUrl: rawDataUrl,
            remainingGenerations: newRemaining,
            totalGenerations: MAX_GENERATIONS,
            cooldownRemainingSeconds,
        });

        response.cookies.set("card_limit_data", JSON.stringify({ count: newCount, windowStart: newWindowStart }), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 86400,
        });

        return response;

    } catch (error: any) {
        console.error("API Route Error:", error);
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

// ─── DELETE Handler: Reset / Unlock rate limit (e.g. on social share) ─────────
export async function DELETE() {
    const response = NextResponse.json({
        success: true,
        canGenerate: true,
        remainingGenerations: MAX_GENERATIONS,
        totalGenerations: MAX_GENERATIONS,
        usedGenerations: 0,
        cooldownRemainingSeconds: 0,
    });

    response.cookies.set("card_limit_data", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    });

    response.cookies.set("card_last_gen", "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    });

    return response;
}


