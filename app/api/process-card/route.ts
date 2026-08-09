import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { buildDynamicPrompt } from "../../generator/lib/buildPrompt";
import { createServerSupabase } from "../../../lib/supabase";

// ─── OpenAI Client ────────────────────────────────────────────────────────────
function getOpenAIClient() {
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build",
    });
}

// ─── Helper: load reference image as base64 ───────────────────────────────────
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

    if (base64Image) {
        console.log("✅ Received b64_json response from gpt-image-2");
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
        console.error("❌ gpt-image-2 returned no image data:", JSON.stringify(imageResponse.data));
        throw new Error("OpenAI returned no image data.");
    }
}

// ─── Full AI Card Generation (the slow 15-30s OpenAI call) ────────────────────
async function generateFullAICard(
    photo: string,
    cardData: any,
    overallRating: number,
    profileInfo?: any,
    stats?: any[]
): Promise<string> {
    // 1. Read prompt template
    const promptTemplatePath = path.join(process.cwd(), "public", "prompting", "prompt.txt");
    if (!fs.existsSync(promptTemplatePath)) {
        throw new Error("Prompt template not found");
    }
    const template = fs.readFileSync(promptTemplatePath, "utf-8");

    // 2. Build dynamic personalized prompt
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
            { code: "9HW", value: 80 },
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

    console.log("[process-card] modelId:", cardData?.modelId || "none");
    console.log("[process-card] mood:", cardData?.mood || "default");
    console.log("[process-card] hobbies:", profileInfo?.hobbies || "none");

    // 3. Convert base64 photo to Buffer
    const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
    const photoBuffer = Buffer.from(base64Data, "base64");

    // 4. Load the reference shape model image (save.png)
    const shapeRefBase64 = loadReferenceImageBase64("images/save.png");

    console.log("Generating card with gpt-image-2 (user photo + model reference)...");
    console.log("Final Prompt length:", finalPrompt.length, "chars");
    console.log("Model reference loaded:", shapeRefBase64 ? "YES" : "NO");

    // 5. Build image inputs — user photo + model reference
    const imageInputs: any[] = [
        new File([photoBuffer], "photo.png", { type: "image/png" }),
    ];

    if (shapeRefBase64) {
        const shapeBase64Data = shapeRefBase64.replace(/^data:image\/\w+;base64,/, "");
        const shapeBuffer = Buffer.from(shapeBase64Data, "base64");
        imageInputs.push(new File([shapeBuffer], "card_model_reference.png", { type: "image/png" }));
    }

    // 6. Generate card — user photo + model reference → gpt-image-2
    const openai = getOpenAIClient();

    const shapePromptSuffix = shapeRefBase64
        ? "\n\nCRITICAL SHAPE INSTRUCTION: The second image (card_model_reference.png) shows the EXACT gold frame outline your card MUST follow. Copy this shield silhouette precisely: small crown notch at top center, slightly concave curved sides, gentle inward curve at bottom. The gold border style, thickness, and 3D metallic sheen must match. Everything OUTSIDE this gold frame must be 100% transparent. Do NOT make a rectangular card. Do NOT invent a different shape."
        : "";

    const imageResponse = await openai.images.edit({
        model: "gpt-image-2",
        image: imageInputs,
        prompt: finalPrompt + shapePromptSuffix,
        size: "auto",
    });

    return processImageResponse(imageResponse);
}

// ─── POST Handler: Background worker that processes the OpenAI call ───────────
export async function POST(req: NextRequest) {
    const supabase = createServerSupabase();

    try {
        const { jobId } = await req.json();

        if (!jobId) {
            return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
        }

        // 1. Fetch the job from Supabase
        const { data: job, error: fetchError } = await supabase
            .from("card_jobs")
            .select("*")
            .eq("id", jobId)
            .single();

        if (fetchError || !job) {
            console.error("[process-card] Job not found:", jobId, fetchError);
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        if (job.status !== "pending") {
            console.log("[process-card] Job already processed:", jobId, job.status);
            return NextResponse.json({ ok: true, status: job.status });
        }

        // 2. Mark job as processing
        await supabase
            .from("card_jobs")
            .update({ status: "processing", updated_at: new Date().toISOString() })
            .eq("id", jobId);

        // 3. Run the slow OpenAI generation
        const input = job.input;
        const { photo, cardData, overallRating, profileInfo, stats } = input;

        console.log(`[process-card] Starting OpenAI generation for job ${jobId}...`);
        const imageUrl = await generateFullAICard(photo, cardData, overallRating, profileInfo, stats);

        // 4. Mark job as done with the result
        await supabase
            .from("card_jobs")
            .update({
                status: "done",
                image_url: imageUrl,
                updated_at: new Date().toISOString(),
            })
            .eq("id", jobId);

        console.log(`[process-card] ✅ Job ${jobId} completed successfully`);
        return NextResponse.json({ ok: true });

    } catch (error: any) {
        console.error("[process-card] Error:", error);

        // Try to mark the job as failed
        try {
            const body = await req.clone().json().catch(() => null);
            const jobId = body?.jobId;
            if (jobId) {
                await supabase
                    .from("card_jobs")
                    .update({
                        status: "failed",
                        error: error.message || "Unknown error during generation",
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", jobId);
            }
        } catch (_) {}

        return NextResponse.json(
            { error: error.message || "Processing failed" },
            { status: 500 }
        );
    }
}
