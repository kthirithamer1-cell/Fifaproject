import path from "path";
import fs from "fs";
import sharp from "sharp";

let cachedLogoBuffer: Buffer | null = null;

/**
 * Loads and extracts the official 3D gold FLAWLESS shield emblem with transparent background.
 */
async function getFlawlessEmblem(): Promise<Buffer> {
    if (cachedLogoBuffer) {
        return cachedLogoBuffer;
    }

    const faviPath = path.join(process.cwd(), "public", "images", "favi.png");
    const logoPath = path.join(process.cwd(), "public", "images", "logo.png");

    // Prefer extracting the high-res transparent emblem from logo.png if available
    if (fs.existsSync(logoPath)) {
        try {
            const logoMetadata = await sharp(logoPath).metadata();
            const width = logoMetadata.width || 1000;
            const height = logoMetadata.height || 300;

            // The 'F' emblem in logo.png occupies the left portion (~27% width)
            const emblemWidth = Math.round(width * 0.275);
            const emblemHeight = height;

            cachedLogoBuffer = await sharp(logoPath)
                .extract({
                    left: 0,
                    top: 0,
                    width: emblemWidth,
                    height: emblemHeight,
                })
                .trim()
                .png()
                .toBuffer();

            return cachedLogoBuffer;
        } catch (err) {
            console.warn("[stampLogo] Failed to extract emblem from logo.png, falling back to favi.png", err);
        }
    }

    if (fs.existsSync(faviPath)) {
        cachedLogoBuffer = await sharp(faviPath).png().toBuffer();
        return cachedLogoBuffer;
    }

    throw new Error("FLAWLESS emblem asset not found in public/images/");
}

export interface StampLogoOptions {
    stampHeader?: boolean;
    stampBottom?: boolean;
}

/**
 * Deterministically stamps the official 3D gold FLAWLESS logo onto a card image buffer.
 * - Header Badge: Placed at the official badge slot (next to the flag).
 * - Bottom Watermark: Placed centered at the bottom edge.
 */
export async function stampFlawlessLogo(
    cardImageBuffer: Buffer,
    options: StampLogoOptions = { stampHeader: true, stampBottom: true }
): Promise<Buffer> {
    try {
        const emblemBuffer = await getFlawlessEmblem();
        const cardMetadata = await sharp(cardImageBuffer).metadata();
        const cardWidth = cardMetadata.width || 1024;
        const cardHeight = cardMetadata.height || 1024;

        const composites: sharp.OverlayOptions[] = [];

        // 1. Header Badge: Top-left under OVR, next to Tunisia flag
        if (options.stampHeader !== false) {
            const headerLogoWidth = Math.round(cardWidth * 0.075);
            const resizedHeaderLogo = await sharp(emblemBuffer)
                .resize({
                    width: headerLogoWidth,
                    fit: "contain",
                    background: { r: 0, g: 0, b: 0, alpha: 0 },
                })
                .toBuffer();

            const headerLeft = Math.round(cardWidth * 0.175);
            const headerTop = Math.round(cardHeight * 0.305);

            composites.push({
                input: resizedHeaderLogo,
                left: headerLeft,
                top: headerTop,
                blend: "over",
            });
        }

        // 2. Bottom Center Watermark: Centered at bottom shield point
        if (options.stampBottom !== false) {
            const bottomLogoWidth = Math.round(cardWidth * 0.055);
            const resizedBottomLogo = await sharp(emblemBuffer)
                .resize({
                    width: bottomLogoWidth,
                    fit: "contain",
                    background: { r: 0, g: 0, b: 0, alpha: 0 },
                })
                .toBuffer();

            const bottomLeft = Math.round((cardWidth - bottomLogoWidth) / 2);
            const bottomTop = Math.round(cardHeight * 0.94);

            composites.push({
                input: resizedBottomLogo,
                left: bottomLeft,
                top: bottomTop,
                blend: "over",
            });
        }

        if (composites.length === 0) {
            return cardImageBuffer;
        }

        const outputBuffer = await sharp(cardImageBuffer)
            .composite(composites)
            .png()
            .toBuffer();

        return outputBuffer;
    } catch (error) {
        console.error("[stampLogo] Error compositing logo:", error);
        // Graceful fallback to raw image if compositing fails
        return cardImageBuffer;
    }
}
