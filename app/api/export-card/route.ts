import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { buildCardHTML } from "./buildCardHTML";
import type { CardHTMLData } from "./buildCardHTML";

export async function POST(req: NextRequest) {
    let browser;
    try {
        const body: CardHTMLData = await req.json();

        // Validate required fields
        if (!body.playerName || !body.baseImageUrl) {
            return NextResponse.json(
                { error: "playerName and baseImageUrl are required" },
                { status: 400 }
            );
        }

        // Build the self-contained HTML document
        const html = buildCardHTML(body);

        console.log("[EXPORT] Launching Puppeteer...");

        // Launch headless Chromium
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

        // Set viewport to exact card dimensions
        await page.setViewport({
            width: 700,
            height: 1050,
            deviceScaleFactor: 2, // 2x for high-res output (1400×2100 actual pixels)
        });

        // Load the HTML content
        await page.setContent(html, {
            waitUntil: "load", // Wait until load event fires
            timeout: 30000,
        });

        // Wait a bit more for fonts to render
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("[EXPORT] Taking screenshot...");

        // Take screenshot of the card
        const screenshot = await page.screenshot({
            type: "png",
            omitBackground: true, // Transparent background
            clip: {
                x: 0,
                y: 0,
                width: 700,
                height: 1050,
            },
        });

        await browser.close();
        browser = undefined;

        console.log("[EXPORT] ✅ Screenshot captured, size:", screenshot.length, "bytes");

        // Return PNG as binary response
        return new NextResponse(screenshot as any, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Content-Disposition": `attachment; filename="${body.playerName.replace(/\s+/g, "_")}_card.png"`,
                "Content-Length": String(screenshot.length),
            },
        });
    } catch (error: any) {
        console.error("[EXPORT] Error:", error);

        if (browser) {
            try {
                await browser.close();
            } catch (_) {}
        }

        return NextResponse.json(
            {
                error: error.message || "Failed to export card",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
