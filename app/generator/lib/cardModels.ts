// ─── 10 PVC Card Models (Identical PVC Die-Cut Shape, 10 Distinct Visual Models) ───

export interface CardModel {
    id: string;
    label: string;
    accentColor: string;
    bgGradient: string;
    promptStyle: string;
    svgBg: string;
    thumbnail: string;
}

// SVG Background Generator Helpers
function createSvgDataUrl(svgString: string): string {
    const encoded = encodeURIComponent(svgString)
        .replace(/'/g, "%27")
        .replace(/"/g, "%22");
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

// 1. Classic Gold
const classicGoldSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1050" width="700" height="1050">
  <defs>
    <radialGradient id="cgRadial" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#FFF3A1"/>
      <stop offset="30%" stop-color="#D4AF37"/>
      <stop offset="70%" stop-color="#7A5600"/>
      <stop offset="100%" stop-color="#1A1200"/>
    </radialGradient>
    <linearGradient id="cgRay" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFEAA7" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="cgSheen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25"/>
      <stop offset="50%" stop-color="#D4AF37" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect width="700" height="1050" fill="url(#cgRadial)"/>
  <!-- Sunburst Rays -->
  <g opacity="0.35">
    <polygon points="350,420 0,0 70,0" fill="url(#cgRay)"/>
    <polygon points="350,420 180,0 270,0" fill="url(#cgRay)"/>
    <polygon points="350,420 380,0 470,0" fill="url(#cgRay)"/>
    <polygon points="350,420 580,0 670,0" fill="url(#cgRay)"/>
    <polygon points="350,420 700,100 700,190" fill="url(#cgRay)"/>
    <polygon points="350,420 700,320 700,410" fill="url(#cgRay)"/>
    <polygon points="350,420 700,540 700,630" fill="url(#cgRay)"/>
    <polygon points="350,420 700,760 700,850" fill="url(#cgRay)"/>
    <polygon points="350,420 0,200 0,290" fill="url(#cgRay)"/>
    <polygon points="350,420 0,430 0,520" fill="url(#cgRay)"/>
    <polygon points="350,420 0,660 0,750" fill="url(#cgRay)"/>
  </g>
  <!-- Sparkles -->
  <circle cx="200" cy="250" r="3" fill="#FFF" opacity="0.8"/>
  <circle cx="500" cy="280" r="2.5" fill="#FFF" opacity="0.9"/>
  <circle cx="150" cy="550" r="2" fill="#FFF" opacity="0.6"/>
  <circle cx="550" cy="620" r="3.5" fill="#FFF" opacity="0.7"/>
  <circle cx="350" cy="180" r="4" fill="#FFEAA7" opacity="0.8"/>
  <rect width="700" height="1050" fill="url(#cgSheen)"/>
</svg>`;

// 2. Dark Obsidian
const darkObsidianSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1050" width="700" height="1050">
  <defs>
    <radialGradient id="doGrad" cx="50%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#2D281E"/>
      <stop offset="45%" stop-color="#141310"/>
      <stop offset="100%" stop-color="#070706"/>
    </radialGradient>
    <pattern id="hexGrid" width="30" height="52" patternUnits="userSpaceOnUse">
      <path d="M15 0 L30 8.66 L30 25.98 L15 34.64 L0 25.98 L0 8.66 Z M15 52 L30 43.34 L30 25.98 L15 34.64 L0 25.98 L0 43.34 Z" fill="none" stroke="#D4AF37" stroke-width="0.75" opacity="0.12"/>
    </pattern>
    <linearGradient id="goldLaser" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF3A1" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#D4AF37" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#141310" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="700" height="1050" fill="url(#doGrad)"/>
  <rect width="700" height="1050" fill="url(#hexGrid)"/>
  <line x1="-100" y1="200" x2="800" y2="700" stroke="url(#goldLaser)" stroke-width="4"/>
  <line x1="-100" y1="350" x2="800" y2="850" stroke="url(#goldLaser)" stroke-width="2"/>
  <circle cx="350" cy="380" r="280" fill="#D4AF37" opacity="0.06"/>
</svg>`;

// 3. TOTY Sapphire Blue
const totyBlueSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1050" width="700" height="1050">
  <defs>
    <radialGradient id="totyGrad" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#00E5FF"/>
      <stop offset="25%" stop-color="#0066FF"/>
      <stop offset="60%" stop-color="#051336"/>
      <stop offset="100%" stop-color="#020817"/>
    </radialGradient>
    <linearGradient id="cyanFacet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0044AA" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="700" height="1050" fill="url(#totyGrad)"/>
  <polygon points="350,150 550,280 480,500 220,500 150,280" fill="url(#cyanFacet)" opacity="0.4"/>
  <polygon points="350,50 650,250 500,600 200,600 50,250" fill="none" stroke="#00E5FF" stroke-width="1.5" opacity="0.3"/>
  <circle cx="350" cy="350" r="220" fill="#00E5FF" opacity="0.12"/>
  <circle cx="180" cy="220" r="3" fill="#FFF"/>
  <circle cx="520" cy="260" r="3" fill="#FFF"/>
  <circle cx="480" cy="650" r="4" fill="#00E5FF"/>
</svg>`;

// 4. Emerald Imperial
const emeraldSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1050" width="700" height="1050">
  <defs>
    <radialGradient id="emGrad" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="35%" stop-color="#045D3B"/>
      <stop offset="75%" stop-color="#022B17"/>
      <stop offset="100%" stop-color="#01140A"/>
    </radialGradient>
    <linearGradient id="emVein" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="700" height="1050" fill="url(#emGrad)"/>
  <path d="M 50,100 Q 200,300 350,200 T 650,400" stroke="url(#emVein)" stroke-width="3" fill="none"/>
  <path d="M 100,500 Q 300,400 450,600 T 600,800" stroke="url(#emVein)" stroke-width="2" fill="none"/>
  <circle cx="350" cy="380" r="240" fill="#10B981" opacity="0.12"/>
</svg>`;

// 5. Ruby Inferno
const rubySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1050" width="700" height="1050">
  <defs>
    <radialGradient id="rbGrad" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#FF416C"/>
      <stop offset="30%" stop-color="#8B0000"/>
      <stop offset="70%" stop-color="#3B0008"/>
      <stop offset="100%" stop-color="#140003"/>
    </radialGradient>
    <linearGradient id="flame" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#FF4B2B" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#FF416C" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="700" height="1050" fill="url(#rbGrad)"/>
  <polygon points="350,1000 100,600 250,300 450,300 600,600" fill="url(#flame)"/>
  <circle cx="350" cy="350" r="230" fill="#FF416C" opacity="0.15"/>
</svg>`;

// 6. Platinum Silver
const silverSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1050" width="700" height="1050">
  <defs>
    <linearGradient id="slvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="25%" stop-color="#CBD5E1"/>
      <stop offset="50%" stop-color="#64748B"/>
      <stop offset="75%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="700" height="1050" fill="url(#slvGrad)"/>
  <circle cx="350" cy="380" r="250" fill="#FFFFFF" opacity="0.12"/>
</svg>`;

// 7. Cyber Synthwave
const cyberSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1050" width="700" height="1050">
  <defs>
    <linearGradient id="cybGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1A0033"/>
      <stop offset="40%" stop-color="#5C0047"/>
      <stop offset="70%" stop-color="#A2006D"/>
      <stop offset="100%" stop-color="#1A0033"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FF007F" stroke-width="1" opacity="0.25"/>
    </pattern>
  </defs>
  <rect width="700" height="1050" fill="url(#cybGrad)"/>
  <rect y="450" width="700" height="600" fill="url(#grid)"/>
  <circle cx="350" cy="450" r="180" fill="#FF007F" opacity="0.3"/>
</svg>`;

// 8. Rose Gold Luxe
const roseGoldSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1050" width="700" height="1050">
  <defs>
    <radialGradient id="rgGrad" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#FCD5CE"/>
      <stop offset="30%" stop-color="#E8A598"/>
      <stop offset="70%" stop-color="#6E3D2E"/>
      <stop offset="100%" stop-color="#2B1810"/>
    </radialGradient>
  </defs>
  <rect width="700" height="1050" fill="url(#rgGrad)"/>
  <circle cx="350" cy="380" r="250" fill="#FCD5CE" opacity="0.15"/>
</svg>`;

// 9. Cosmic Nebula
const cosmicSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1050" width="700" height="1050">
  <defs>
    <radialGradient id="cosGrad" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#A855F7"/>
      <stop offset="35%" stop-color="#5B21B6"/>
      <stop offset="75%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#0F0728"/>
    </radialGradient>
  </defs>
  <rect width="700" height="1050" fill="url(#cosGrad)"/>
  <circle cx="350" cy="380" r="260" fill="#A855F7" opacity="0.18"/>
  <circle cx="200" cy="200" r="2" fill="#FFF"/>
  <circle cx="500" cy="300" r="2.5" fill="#FFF"/>
  <circle cx="150" cy="600" r="3" fill="#A855F7"/>
  <circle cx="550" cy="700" r="2" fill="#FFF"/>
</svg>`;

// 10. Carrara Gold Marble
const marbleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 1050" width="700" height="1050">
  <defs>
    <linearGradient id="mbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <linearGradient id="mbGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#997700"/>
    </linearGradient>
  </defs>
  <rect width="700" height="1050" fill="url(#mbGrad)"/>
  <path d="M 0,200 Q 250,150 400,350 T 700,300" stroke="url(#mbGold)" stroke-width="4" fill="none"/>
  <path d="M 0,600 Q 300,500 500,700 T 700,850" stroke="url(#mbGold)" stroke-width="3" fill="none"/>
  <path d="M 200,0 Q 350,400 300,1050" stroke="url(#mbGold)" stroke-width="2.5" fill="none"/>
</svg>`;

export const CARD_MODELS: CardModel[] = [
    {
        id: "classic_gold",
        label: "1. Classic Gold",
        accentColor: "#D4AF37",
        bgGradient: "radial-gradient(circle at 50% 40%, #FFF3A1 0%, #D4AF37 30%, #7A5600 70%, #1A1200 100%)",
        promptStyle: "3D brushed classic gold metallic card frame, warm golden sunburst lighting, polished gold chamfers.",
        svgBg: createSvgDataUrl(classicGoldSvg),
        thumbnail: createSvgDataUrl(classicGoldSvg),
    },
    {
        id: "dark_obsidian",
        label: "2. Dark Obsidian",
        accentColor: "#F6D365",
        bgGradient: "radial-gradient(circle at 50% 35%, #2D281E 0%, #141310 45%, #070706 100%)",
        promptStyle: "Stealth matte obsidian black background with glowing 3D gold border trim, geometric carbon grid mesh & golden rim light.",
        svgBg: createSvgDataUrl(darkObsidianSvg),
        thumbnail: createSvgDataUrl(darkObsidianSvg),
    },
    {
        id: "toty_blue",
        label: "3. TOTY Sapphire",
        accentColor: "#00E5FF",
        bgGradient: "radial-gradient(circle at 50% 40%, #00E5FF 0%, #0066FF 25%, #051336 60%, #020817 100%)",
        promptStyle: "EA TOTY special edition electrifying blue crystal sapphire background, icy cyan light rays & neon stardust aura.",
        svgBg: createSvgDataUrl(totyBlueSvg),
        thumbnail: createSvgDataUrl(totyBlueSvg),
    },
    {
        id: "emerald_imperial",
        label: "4. Emerald Imperial",
        accentColor: "#50E3C2",
        bgGradient: "radial-gradient(circle at 50% 40%, #10B981 0%, #045D3B 35%, #022B17 75%, #01140A 100%)",
        promptStyle: "Deep royal imperial emerald green background with 3D gold leaf veining, jade shimmer & emerald rim lighting.",
        svgBg: createSvgDataUrl(emeraldSvg),
        thumbnail: createSvgDataUrl(emeraldSvg),
    },
    {
        id: "ruby_inferno",
        label: "5. Ruby Inferno",
        accentColor: "#FF416C",
        bgGradient: "radial-gradient(circle at 50% 40%, #FF416C 0%, #8B0000 30%, #3B0008 70%, #140003 100%)",
        promptStyle: "Intense ruby red lava core with floating fiery magma embers, gold flame accents & volcanic glow.",
        svgBg: createSvgDataUrl(rubySvg),
        thumbnail: createSvgDataUrl(rubySvg),
    },
    {
        id: "platinum_silver",
        label: "6. Platinum Silver",
        accentColor: "#E2E8F0",
        bgGradient: "linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 25%, #64748B 50%, #334155 75%, #0F172A 100%)",
        promptStyle: "Brushed metallic silver & liquid chrome background with diamond starburst reflections & white-hot platinum glow.",
        svgBg: createSvgDataUrl(silverSvg),
        thumbnail: createSvgDataUrl(silverSvg),
    },
    {
        id: "cyber_synthwave",
        label: "7. Cyber Synthwave",
        accentColor: "#FF007F",
        bgGradient: "linear-gradient(180deg, #1A0033 0%, #5C0047 40%, #A2006D 70%, #1A0033 100%)",
        promptStyle: "Retro futuristic synthwave dusk background with magenta & cyan laser grid landscape & cyberpunk neon glow.",
        svgBg: createSvgDataUrl(cyberSvg),
        thumbnail: createSvgDataUrl(cyberSvg),
    },
    {
        id: "rose_gold",
        label: "8. Rose Gold Luxe",
        accentColor: "#F4A261",
        bgGradient: "radial-gradient(circle at 50% 40%, #FCD5CE 0%, #E8A598 30%, #6E3D2E 70%, #2B1810 100%)",
        promptStyle: "Luxury champagne rose gold foil background with silk texture waves & soft diamond sparkle dust.",
        svgBg: createSvgDataUrl(roseGoldSvg),
        thumbnail: createSvgDataUrl(roseGoldSvg),
    },
    {
        id: "cosmic_nebula",
        label: "9. Cosmic Nebula",
        accentColor: "#A855F7",
        bgGradient: "radial-gradient(circle at 50% 40%, #A855F7 0%, #5B21B6 35%, #1E1B4B 75%, #0F0728 100%)",
        promptStyle: "Deep space cosmic violet galaxy nebula with glowing star constellations & golden stardust aura.",
        svgBg: createSvgDataUrl(cosmicSvg),
        thumbnail: createSvgDataUrl(cosmicSvg),
    },
    {
        id: "carrara_marble",
        label: "10. Carrara Marble",
        accentColor: "#D4AF37",
        bgGradient: "linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 50%, #CBD5E1 100%)",
        promptStyle: "Pure white Carrara marble base texture with dramatic 3D gold wireframe veining & ambient luxury lighting.",
        svgBg: createSvgDataUrl(marbleSvg),
        thumbnail: createSvgDataUrl(marbleSvg),
    },
];

export function getCardModelById(id: string): CardModel {
    return CARD_MODELS.find((m) => m.id === id) || CARD_MODELS[0];
}
