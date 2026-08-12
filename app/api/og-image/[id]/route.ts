import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// ─── Dynamic OG Image Endpoint ──────────────────────────────────────────────
// Serves the uploaded card image as image/png.
// Facebook's crawler hits this URL (from the og:image meta tag) and gets the actual image.
//
// URL: /api/og-image/[id]
// Example: /api/og-image/a1b2c3d4e5f6g7h8

type Props = {
    params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: Props) {
    const { id } = await params;

    // Sanitize ID to prevent path traversal
    const safeId = id.replace(/[^a-zA-Z0-9]/g, "");
    if (!safeId || safeId !== id) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const sharedDir = path.join(process.cwd(), "public", "shared-cards");
    const extensions = ["png", "jpg", "webp"];
    let filePath: string | null = null;
    let contentType = "image/png";

    for (const ext of extensions) {
        const candidate = path.join(sharedDir, `${safeId}.${ext}`);
        if (fs.existsSync(candidate)) {
            filePath = candidate;
            contentType = ext === "webp" ? "image/webp" : ext === "jpg" ? "image/jpeg" : "image/png";
            break;
        }
    }

    if (!filePath) {
        // Return a 1x1 transparent PNG fallback so Facebook doesn't error
        const fallbackPng = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "base64"
        );
        return new NextResponse(fallbackPng, {
            status: 404,
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "no-cache",
            },
        });
    }

    const imageBuffer = fs.readFileSync(filePath);

    return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
            "Content-Type": contentType,
            "Content-Length": String(imageBuffer.length),
            // Allow Facebook/Twitter crawlers to cache for 1 hour
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
