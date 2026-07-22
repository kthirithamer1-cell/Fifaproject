import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { buildDynamicPrompt } from "../../generator/lib/buildPrompt";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper to load reference image as base64
function loadReferenceImageBase64(filename: string): string | null {
    try {
        const imgPath = path.join(process.cwd(), "public", "prompting", filename);
        if (!fs.existsSync(imgPath)) {
            console.warn(`Reference image not found: ${imgPath}`);
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

// ─── Hybrid/Custom mode: generate background + portrait only ──────────────────
async function generateHybridCard(photo: string, mood: string, backgroundStyle: string): Promise<string> {
    // 1. Read the hybrid prompt template (visual-only, no text)
    const hybridTemplatePath = path.join(process.cwd(), "public", "prompting", "prompt_hybrid.txt");
    if (!fs.existsSync(hybridTemplatePath)) {
        throw new Error("Hybrid prompt template not found");
    }
    let template = fs.readFileSync(hybridTemplatePath, "utf-8");

    // 2. Fill in placeholders
    template = template
        .replace(/{MOOD}/g, mood || "Legendary")
        .replace(/{BACKGROUND_STYLE}/g, backgroundStyle || "Tunisian-inspired background with Sidi Bou Said architecture, subtle Tunisian flag and warm golden-hour lighting.");

    // 3. Simplified Vision call — face description only (no style references needed)
    console.log("[HYBRID] Analyzing face photo with gpt-4o Vision...");
    let faceDescription = "A person with detailed facial features as shown in the photo.";
    try {
        const visionResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Describe this person's face in one detailed sentence: gender, hair color/style, skin tone, expression, and distinctive features. Be direct and affirmative."
                        },
                        {
                            type: "image_url",
                            image_url: { url: photo }
                        }
                    ]
                }
            ],
            max_tokens: 120,
        });
        const desc = visionResponse.choices[0]?.message?.content;
        if (desc && !desc.toLowerCase().includes("sorry") && !desc.toLowerCase().includes("apologiz")) {
            faceDescription = desc.trim();
            console.log("[HYBRID] Face Description:", faceDescription);
        }
    } catch (e: any) {
        console.error("[HYBRID] Error calling gpt-4o Vision:", e);
    }

    // 4. Inject face description into the prompt
    const finalPrompt = template.replace(
        "Use the uploaded photo as the face reference",
        `The person's face matches: ${faceDescription}`
    );

    console.log("[HYBRID] Generating background + portrait with gpt-image-1...");
    console.log("[HYBRID] Prompt length:", finalPrompt.length, "chars");

    // 5. Generate the visual-only card
    const imageResponse = await openai.images.generate({
        model: "gpt-image-1",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
    });

    return processImageResponse(imageResponse);
}

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

    // 2. Build dynamic personalized prompt using profile info & 6 stats if provided
    let prompt: string;
    if (stats && Array.isArray(stats) && stats.length > 0) {
        prompt = buildDynamicPrompt(template, {
            name: profileInfo?.name || "LEGEND",
            age: profileInfo?.age,
            gender: profileInfo?.gender,
            hobbies: profileInfo?.hobbies,
            description: profileInfo?.description,
            overallRating: overallRating || 85,
            stats: stats,
            mood: cardData?.mood || "Legendary",
            title: profileInfo?.name ? `${profileInfo.name.toUpperCase()} - THE LEGEND` : "THE LEGEND",
        });
    } else {
        prompt = buildDynamicPrompt(template, {
            name: "LEGEND",
            overallRating: overallRating || 85,
            stats: [
                { code: "DHK", value: 85 },
                { code: "JAW", value: 90 },
                { code: "S7B", value: 88 },
                { code: "9HW", value: 80 },
                { code: "DBR", value: 82 },
                { code: "HRB", value: 75 },
            ],
            mood: cardData?.mood || "Legendary",
        });
    }

    // 3. Load reference style images as base64
    const ref1 = loadReferenceImageBase64("image.png");
    const ref2 = loadReferenceImageBase64("image2.png");

    // 4. Multimodal Vision step using gpt-4o
    // We pass the user's face photo AND the two style examples to gpt-4o,
    // and ask it to describe:
    //   a) The user's face & character details
    //   b) The precise card style, colors, fonts, and layout based on the design examples
    console.log("Analyzing face photo and style templates with gpt-4o Vision...");
    
    const visionMessages: any[] = [
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: `You are a design style analyzer. I am providing 3 images:
1. Image 1 (User Photo): The face of the person who should be the main character inside the card.
2. Image 2 & 3 (Style References): Examples of the target collectible card design style.

Analyze the user photo and provide a detailed one-sentence description of the person's face (gender, hair, skin tone, expression, features).
Analyze the style reference images and extract key design details (scalloped top border, magenta/purple paint splash transitions, layout, golden/pink color scheme, text, stats rows).

Provide a highly cohesive and combined summary description for a text-to-image generator that merges the user's appearance with the exact collectible card format and style. Do not mention policy refusals. Keep the description direct and affirmative.`
                },
                {
                    type: "image_url",
                    image_url: { url: photo }
                }
            ]
        }
    ];

    // Add style references if they exist
    if (ref1) {
        visionMessages[0].content.push({
            type: "image_url",
            image_url: { url: ref1 }
        });
    }
    if (ref2) {
        visionMessages[0].content.push({
            type: "image_url",
            image_url: { url: ref2 }
        });
    }

    let combinedStyleAndFaceDescription = "A premium ornate arched card design, featuring a Tunisian medina flag background, with detailed facial features inspired by the photo.";
    try {
        const visionResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: visionMessages,
            max_tokens: 250,
        });
        const desc = visionResponse.choices[0]?.message?.content;
        if (desc && !desc.toLowerCase().includes("sorry") && !desc.toLowerCase().includes("help") && !desc.toLowerCase().includes("apologiz")) {
            combinedStyleAndFaceDescription = desc.trim();
            console.log("gpt-4o Style & Face Description:", combinedStyleAndFaceDescription);
        } else {
            console.warn("gpt-4o Vision returned policy refusal. Using styled fallback description.");
        }
    } catch (e: any) {
        console.error("Error calling gpt-4o Vision:", e);
    }

    // 5. Replace prompt instructions with the style & face description
    const finalPrompt = prompt
        .replace(
            "Use the uploaded photo as the face reference",
            `The main character's face matches: ${combinedStyleAndFaceDescription}`
        )
        .replace(
            "Generate a premium collectible portrait card in EXACTLY the same visual style as the two reference images provided. Match every design element precisely.",
            `The card's design, colors, frame shape, icons, and layout must match this style template description: ${combinedStyleAndFaceDescription}`
        );

    console.log("Generating card with gpt-image-1...");
    console.log("Final Prompt:\n", finalPrompt);

    // 6. Generate premium card using gpt-image-1
    const imageResponse = await openai.images.generate({
        model: "gpt-image-1",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024", // gpt-image-1 standard square size
    });

    return processImageResponse(imageResponse);
}

// ─── Helper: Apply FUT card shape mask via Puppeteer ────────────────────────
async function applyFUTCardMask(imageUrl: string): Promise<string> {
    console.log("[MASK] Launching Puppeteer to apply card shape mask...");
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });

        const page = await browser.newPage();
        await page.setViewport({
            width: 700,
            height: 1050,
            deviceScaleFactor: 1,
        });

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: transparent; display: flex; justify-content: center; align-items: flex-start; }
        .card {
            width: 700px;
            height: 1050px;
            background-image: url('${imageUrl}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            clip-path: polygon(13% 0%, 87% 0%, 100% 13%, 100% 77%, 50% 100%, 0% 77%, 0% 13%);
        }
    </style>
</head>
<body>
    <div class="card"></div>
</body>
</html>`;

        await page.setContent(html, { waitUntil: "load" });
        
        const screenshot = await page.screenshot({
            type: "png",
            omitBackground: true,
            clip: {
                x: 0,
                y: 0,
                width: 700,
                height: 1050,
            },
        });

        await browser.close();
        browser = undefined;

        console.log("[MASK] ✅ Card masked successfully");
        return `data:image/png;base64,${Buffer.from(screenshot).toString("base64")}`;
    } catch (e) {
        console.error("[MASK] Error masking card background:", e);
        if (browser) {
            try {
                await browser.close();
            } catch (_) {}
        }
        return imageUrl;
    }
}

// ─── Main POST handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { photo, cardData, overallRating, mode, backgroundStyle, freeDescription, profileInfo, stats } = body;

        if (!photo) {
            return NextResponse.json({ error: "Photo is required" }, { status: 400 });
        }

        let dataUrl: string;

        if (mode === "custom") {
            // ── HYBRID MODE: generate background + portrait only ──
            console.log("=== HYBRID MODE ===");
            // Use free description to inform the mood/background if provided
            const moodFromDesc = freeDescription
                ? `Based on this person's description: "${freeDescription}". Create a mood that matches their personality.`
                : (cardData?.mood || "Legendary");
            dataUrl = await generateHybridCard(photo, moodFromDesc, backgroundStyle);
        } else {
            // ── FULL AI MODE: generate the complete card (default) ──
            console.log("=== FULL AI MODE ===");
            dataUrl = await generateFullAICard(photo, cardData, overallRating, profileInfo, stats);
        }

        // Return generated image directly without mask
        return NextResponse.json({ imageUrl: dataUrl });

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
