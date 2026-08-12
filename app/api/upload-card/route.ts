import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// Directory to store shared card images
const SHARED_DIR = path.join(process.cwd(), "public", "shared-cards");

function ensureSharedDir() {
    if (!fs.existsSync(SHARED_DIR)) {
        fs.mkdirSync(SHARED_DIR, { recursive: true });
    }
}

// POST: Upload a card image and return a share ID
export async function POST(req: NextRequest) {
    try {
        const { imageData } = await req.json();

        if (!imageData) {
            return NextResponse.json({ error: "imageData is required" }, { status: 400 });
        }

        ensureSharedDir();

        // Generate unique ID
        const shareId = crypto.randomBytes(8).toString("hex");

        // Extract base64 data — supports both data URLs and raw base64
        let base64 = imageData;
        let mimeType = "image/png";
        if (imageData.startsWith("data:")) {
            const match = imageData.match(/^data:(image\/\w+);base64,(.+)$/);
            if (match) {
                mimeType = match[1];
                base64 = match[2];
            } else {
                base64 = imageData.split(",")[1] || imageData;
            }
        }

        const ext = mimeType.includes("webp") ? "webp" : mimeType.includes("jpeg") || mimeType.includes("jpg") ? "jpg" : "png";
        const filename = `${shareId}.${ext}`;
        const filePath = path.join(SHARED_DIR, filename);

        // Save to disk
        fs.writeFileSync(filePath, Buffer.from(base64, "base64"));

        console.log(`[SHARE] Card saved: ${filename} (${fs.statSync(filePath).size} bytes)`);

        // Build the share URL (relative — the client will prepend the origin)
        return NextResponse.json({
            success: true,
            shareId,
            imagePath: `/shared-cards/${filename}`,
            shareUrl: `/share/${shareId}`,
        });
    } catch (error: any) {
        console.error("[SHARE] Upload error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload card" },
            { status: 500 }
        );
    }
}
