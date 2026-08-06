import fs from "fs";
import path from "path";

export interface CardHTMLData {
    baseImageUrl: string;
    playerName?: string;
}

export function buildCardHTML(data: CardHTMLData): string {
    let { baseImageUrl } = data;

    // ── Convert relative URLs (/prompting/image.webp, /images/...) to base64 data URLs ──
    if (baseImageUrl && baseImageUrl.startsWith("/")) {
        try {
            const relativePath = baseImageUrl.replace(/^\//, "");
            const fullPath = path.join(process.cwd(), "public", relativePath);
            if (fs.existsSync(fullPath)) {
                const buffer = fs.readFileSync(fullPath);
                const ext = path.extname(fullPath).replace(".", "").toLowerCase() || "png";
                const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "svg" ? "image/svg+xml" : `image/${ext}`;
                baseImageUrl = `data:${mime};base64,${buffer.toString("base64")}`;
            }
        } catch (e) {
            console.error("[EXPORT] Failed to convert relative baseImageUrl to base64:", e);
        }
    }

    const safeImageHref = (baseImageUrl || "").replace(/"/g, '&quot;');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @page {
            size: 700px 1050px;
            margin: 0px;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        html, body {
            width: 700px;
            height: 1050px;
            overflow: hidden;
            background: transparent;
        }
        img {
            width: 700px;
            height: 1050px;
            display: block;
            object-fit: contain;
            border: none;
            outline: none;
        }
    </style>
</head>
<body>
    <img src="${safeImageHref}" width="700" height="1050" alt="FIFA Card" />
</body>
</html>`;
}
