import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { buildCardHTML } from "./buildCardHTML";
import type { CardHTMLData } from "./buildCardHTML";

export async function POST(req: NextRequest) {
    let browser;
    try {
        const body: CardHTMLData & { format?: "png" | "pdf" } = await req.json();
        const exportFormat = body.format || "png";

        // Validate required fields
        if (!body.playerName || !body.baseImageUrl) {
            return NextResponse.json(
                { error: "playerName and baseImageUrl are required" },
                { status: 400 }
            );
        }

        // Build the self-contained HTML document
        const html = buildCardHTML(body);

        console.log(`[EXPORT] Launching Puppeteer for ${exportFormat.toUpperCase()} export...`);

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

        // Set viewport to exact card dimensions with 3x scale factor for 300 DPI print quality (2100×3150 pixels)
        await page.setViewport({
            width: 700,
            height: 1050,
            deviceScaleFactor: 3,
        });

        // Load the HTML content
        await page.setContent(html, {
            waitUntil: "load",
            timeout: 30000,
        });

        // Wait a bit more for fonts to render crisply
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (exportFormat === "pdf") {
            console.log("[EXPORT] Generating high-resolution printable PDF...");
            const pdfBuffer = await page.pdf({
                width: "700px",
                height: "1050px",
                printBackground: true,
                margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
                preferCSSPageSize: true,
            });

            await browser.close();
            browser = undefined;

            console.log("[EXPORT] ✅ PDF generated, size:", pdfBuffer.length, "bytes");

            return new NextResponse(pdfBuffer as any, {
                status: 200,
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="${body.playerName.replace(/\s+/g, "_")}_card.pdf"`,
                    "Content-Length": String(pdfBuffer.length),
                },
            });
        }

        console.log("[EXPORT] Capturing 300 DPI transparent PNG screenshot...");

        // Take screenshot of the card with transparent background
        const screenshot = await page.screenshot({
            type: "png",
            omitBackground: true, // 100% transparent background outside card shape
            clip: {
                x: 0,
                y: 0,
                width: 700,
                height: 1050,
            },
        });

        await browser.close();
        browser = undefined;

        console.log("[EXPORT] ✅ Transparent PNG captured, size:", screenshot.length, "bytes");

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
