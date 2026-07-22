import type { CardStat, CardBadge } from "../../_components/generator/CardComposer";

// ─── Types ────────────────────────────────────────────────────────────────

export interface CardHTMLData {
    baseImageUrl: string;
    playerName: string;
    subtitle: string;
    rating: number;
    position: string;
    stats: CardStat[];
    badges: CardBadge[];
    quoteFr: string;
    quoteAr: string;
    hashtags: string[];
    description: string;
    accentColor?: string;
}

// ─── SVG Helpers ──────────────────────────────────────────────────────────

const crownSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:28px;height:auto;fill:#24115d"><path d="M2 4l3 12h14l3-12-5 4-4-6-4 6-5-4zM5 18h14v2H5v-2z"/></svg>`;

const heartSVG = (size = 24, stroke = "#d12559", fill = "none") =>
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="${stroke}" stroke-width="2" fill="${fill}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

const flagSVG = `<svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%"><rect width="60" height="40" fill="#c1004f" rx="3"/><circle cx="30" cy="20" r="10" fill="white"/><path d="M28 14.5 A 5.5 5.5 0 1 0 28 25.5 A 4.5 4.5 0 1 1 29.5 23.5 A 5.5 5.5 0 0 0 28 14.5 Z" fill="#c1004f"/><polygon points="33.5,15.5 34.7,18.6 38.0,18.6 35.3,20.6 36.4,23.9 33.5,21.8 30.6,23.9 31.7,20.6 29.0,18.6 32.3,18.6" fill="#c1004f"/></svg>`;

const statIcons = [
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l4 12 4-12-3-6"/><path d="M2 9h20"/></svg>`,
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    heartSVG(20, "currentColor", "none"),
];

const badgeIcons = [
    `<svg viewBox="0 0 64 64" fill="currentColor" width="28" height="28"><path d="M48,22h-6v-6c0-2.2-1.8-4-4-4s-4,1.8-4,4v6h-4v-8c0-2.2-1.8-4-4-4s-4,1.8-4,4v8h-4v-6c0-2.2-1.8-4-4-4s-4,1.8-4,4v18.7c-2.2,0.8-3.7,2.9-3.7,5.3v5c0,3.3,2.7,6,6,6h20.3c5.3,0,9.7-4.3,9.7-9.7v-13.3c0-2.2-1.8-4-4-4S48,19.8,48,22z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 2.2c-.4 0-.8.2-1.1.5L6.5 7.1C5.7 7.9 5.2 9 5.2 10.1v3.2c0 .6.2 1.2.6 1.7L4 18.8c-.3.4-.2 1 .2 1.3.2.1.4.2.6.2.3 0 .5-.1.7-.3l3.8-3.8c.5.4 1.1.6 1.7.6h3.2c1.1 0 2.2-.5 3-1.3l4.4-4.4c.3-.3.5-.7.5-1.1V6.2C22 4 19.8 2.2 12 2.2zm4 7.8c-.8 0-1.5-.7-1.5-1.5S15.2 7 16 7s1.5.7 1.5 1.5S16.8 10 16 10z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 5.5c-.3-1.2-1.4-2-2.7-2-1.8 0-3.3 1.5-3.3 3.3 0 .7.2 1.4.6 2C4.3 9.4 3 11.5 3 14c0 2.8 2.2 5 5 5 .7 0 1.4-.2 2-.5.5.9 1.4 1.5 2.5 1.5s2-.6 2.5-1.5c.6.3 1.3.5 2 .5 2.8 0 5-2.2 5-5 0-2.5-1.3-4.6-3.6-5.2.4-.6.6-1.3.6-2 0-1.8-1.5-3.3-3.3-3.3-1.3 0-2.4.8-2.7 2z"/></svg>`,
];

// ─── Main Builder ─────────────────────────────────────────────────────────

export function buildCardHTML(data: CardHTMLData): string {
    const {
        baseImageUrl,
        playerName,
        subtitle,
        rating,
        position,
        stats,
        badges,
        quoteFr,
        quoteAr,
        hashtags,
        description,
        accentColor = "#E5A500",
    } = data;

    const hashtagStr = hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ");

    const statsHTML = stats
        .slice(0, 6)
        .map((stat, i) => {
            const icon = statIcons[i % statIcons.length];
            const divider =
                i < Math.min(stats.length, 6) - 1
                    ? `<div style="position:absolute;right:0;top:15%;height:70%;width:1px;background:rgba(255,255,255,0.25)"></div>`
                    : "";
            return `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;position:relative">
                <div style="width:46px;height:46px;border-radius:50%;border:2px solid ${accentColor};background:rgba(36,17,93,0.4);display:flex;align-items:center;justify-content:center;color:#fff;margin-bottom:6px;box-shadow:0 4px 8px rgba(0,0,0,0.15)">
                    ${icon}
                </div>
                <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:9.5px;color:#fff;text-align:center;margin-bottom:2px;white-space:nowrap;opacity:0.9">${stat.label}</div>
                <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;font-weight:bold;color:#fff;text-align:center;line-height:1">${stat.value}</div>
                ${divider}
            </div>`;
        })
        .join("");

    const badgesHTML = badges
        .slice(0, 3)
        .map((badge, i) => {
            const icon = badgeIcons[i % badgeIcons.length];
            return `
            <div style="width:96px;height:84px;background:rgba(255,255,255,0.88);border:2px solid ${accentColor}33;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;box-shadow:0 4px 10px rgba(0,0,0,0.08)">
                <span style="font-family:'Bebas Neue',sans-serif;font-size:11px;color:${accentColor};letter-spacing:0.5px;margin-bottom:4px;text-align:center;white-space:nowrap">${badge.title}</span>
                <span style="color:${accentColor};display:flex;align-items:center;justify-content:center">${icon}</span>
            </div>`;
        })
        .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;700;800;900&family=Caveat:wght@400;700&family=Caveat+Brush&family=Dancing+Script:wght@700&family=Satisfy&family=Kaushan+Script&family=Tajawal:wght@700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: transparent; display: flex; justify-content: center; align-items: flex-start; font-family: 'Montserrat', sans-serif; }
    </style>
</head>
<body>
    <div style="position:relative;width:700px;height:1050px;background-image:url('${baseImageUrl}');background-size:cover;background-position:center;background-repeat:no-repeat;overflow:hidden;clip-path:polygon(13% 0%, 87% 0%, 100% 13%, 100% 77%, 50% 100%, 0% 77%, 0% 13%)">

        <!-- CROWN -->
        <div style="position:absolute;top:5.2%;left:50%;transform:translateX(-50%);z-index:10">${crownSVG}</div>

        <!-- TOP NAME -->
        <h1 style="position:absolute;top:7.2%;left:50%;transform:translateX(-50%);font-family:'Bebas Neue',sans-serif;font-size:82px;font-weight:bold;color:${accentColor};letter-spacing:2px;text-align:center;z-index:10;line-height:1;margin:0;padding:0;white-space:nowrap">${playerName}</h1>

        <!-- TOP SUBTITLE -->
        <div style="position:absolute;top:15.2%;left:50%;transform:translateX(-50%);font-family:'Satisfy','Dancing Script',cursive;font-size:34px;color:#24115d;font-weight:700;text-align:center;white-space:nowrap;z-index:10;display:flex;align-items:center;gap:8px">
            ${subtitle}
            ${heartSVG(24, accentColor)}
        </div>

        <!-- LEFT COLUMN -->
        <div style="position:absolute;top:18.5%;left:11.5%;display:flex;flex-direction:column;align-items:center;z-index:10;width:130px">
            <div style="font-family:'Bebas Neue',sans-serif;font-size:115px;font-weight:900;color:#24115d;line-height:0.85;text-align:center">${rating}</div>
            <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:${accentColor};letter-spacing:1.5px;text-align:center;margin-top:2px">${position}</div>
            <div style="margin-top:15px;width:76px;height:50px;box-shadow:0 4px 10px rgba(0,0,0,0.15);border-radius:4px;overflow:hidden;display:flex;align-items:center;justify-content:center">${flagSVG}</div>
            <div style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:11px;color:#24115d;text-align:center;margin-top:12px;letter-spacing:0.5px;white-space:nowrap">MADE IN TUNISIA</div>
            <div style="font-family:'Satisfy','Dancing Script',cursive;font-size:24px;color:#24115d;text-align:center;margin-top:8px;white-space:nowrap;display:flex;flex-direction:column;align-items:center;line-height:1.1">
                Instagramable
                <svg viewBox="0 0 24 24" fill="none" stroke="#24115d" stroke-width="2" width="16" height="16" style="margin-top:2px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
        </div>

        <!-- RIGHT BADGES -->
        <div style="position:absolute;top:41.5%;right:11.5%;display:flex;flex-direction:column;gap:12px;z-index:10">
            ${badgesHTML}
        </div>

        <!-- BOTTOM MIDDLE -->
        <div style="position:absolute;bottom:20%;left:50%;transform:translateX(-50%);width:100%;display:flex;flex-direction:column;align-items:center;z-index:10">
            <div style="font-family:'Caveat Brush','Kaushan Script',cursive;font-size:88px;font-weight:700;color:#fff;line-height:0.8;text-shadow:0 4px 10px rgba(0,0,0,0.3);display:flex;align-items:center;gap:10px">
                ${playerName}
                ${heartSVG(32, accentColor)}
            </div>
            <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:15px;color:#fff;margin-top:8px;letter-spacing:0.5px;white-space:nowrap;opacity:0.95">${description}</div>
            <div style="margin-top:12px;background:rgba(255,255,255,0.85);padding:5px 18px;border-radius:20px;box-shadow:0 4px 10px rgba(0,0,0,0.1)">
                <span style="font-family:'Montserrat',sans-serif;font-weight:900;font-size:11px;color:#24115d;letter-spacing:0.5px;white-space:nowrap">${hashtagStr}</span>
            </div>
        </div>

        <!-- STATS -->
        <div style="position:absolute;bottom:9%;left:8%;width:84%;display:flex;justify-content:space-between;z-index:10">
            ${statsHTML}
        </div>

        <!-- QUOTES -->
        <div style="position:absolute;bottom:2.2%;left:50%;transform:translateX(-50%);width:100%;display:flex;flex-direction:column;align-items:center;gap:3px;z-index:10">
            <div style="font-family:'Satisfy','Dancing Script',cursive;font-size:23px;color:${accentColor};font-weight:700;text-align:center;white-space:nowrap;display:flex;align-items:center;gap:6px">
                &quot;${quoteFr}&quot;
                ${heartSVG(14, accentColor, accentColor)}
                ${heartSVG(14, accentColor, accentColor)}
            </div>
            <div style="font-family:'Tajawal',sans-serif;font-size:19px;font-weight:700;color:${accentColor};text-align:center;white-space:nowrap">${quoteAr}</div>
        </div>

    </div>
</body>
</html>`;
}
