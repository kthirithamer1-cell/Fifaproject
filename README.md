# 🏆 Flawless AI PVC Card Generator — System Blueprint & Prompting Roadmap

> **High-end AI Collectible Card Engine** powered by Next.js 15, OpenAI GPT-4o-mini & GPT-Image-2, SVG Die-Cut Clipping, and Puppeteer 300 DPI Print Export.

---

## 📐 System Architecture Blueprint

```
                     ┌─────────────────────────────────────────┐
                     │            User Input Flow              │
                     │  Photo + Hobbies + Gender + Interview   │
                     └────────────────────┬────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Step 1: Personality & Stat Analyzer API (/api/generate-ai-card)                 │
│  - Model: gpt-4o-mini                                                            │
│  - Evaluates interview answers & gender                                          │
│  - Outputs: 6 Tunisian stats, OVR rating, Gender Role (QUEEN/BOSS), Badges, Bio │
└─────────────────────────────────────────┬────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Step 2: Dynamic Prompt Builder Engine (buildPrompt.ts)                          │
│  - Maps 40+ hobby keywords to visual 3D art directives                           │
│  - Formats Gender Roles + Personality Context + Card Model Base Palette          │
│  - Assembles compact structured JSON for OpenAI Prompt Caching                   │
└─────────────────────────────────────────┬────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Step 3: 3D Image Generation API (/api/generate-card)                            │
│  - Model: gpt-image-2 (images.edit)                                              │
│  - Input 1: User Face Photo (Buffer)                                             │
│  - Input 2: PVC Shield Shape Reference Model (save.png Buffer)                   │
│  - Outputs: 300 DPI high-resolution 3D card visual (Base64)                      │
└─────────────────────────────────────────┬────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Step 4: Real-Time PVC Canvas & Export Engine                                    │
│  - PvcCardFrame.tsx: SVG ClipPath overlay for identical PVC die-cut printing     │
│  - export-card: Puppeteer high-res PNG & PDF print rendering (700x1050 px)       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Prompting System Blueprint

### 1. Master Prompt Structure (`public/prompting/prompt.txt`)

```plaintext
# ROLE & GOAL
FUT master card 3D concept artist. Create a AAA sports collectible PVC card matching uploaded face photo.

# VISUAL DIRECTION
1. PVC CARD SILHOUETTE (CRITICAL): Vertical FUT shield card shape. Top: arched header with central M-shaped double-crown notch. Sides: clean straight vertical borders. Bottom: pointed shield apex. 3D brushed gold double-line bevel frame. Transparent PNG background outside card frame.
2. BACKGROUND & ATMOSPHERE: Style: {BACKGROUND_STYLE}. Mood: {MOOD}. Theme: {PERSONALITY_CONTEXT}. The background MUST visually reflect the player's hobbies and personality traits described above.
3. PORTRAIT: Heroic 3D sports illustration from uploaded face. Preserve exact facial identity. Matching jersey or stylish outfit.
4. BADGES & OVERLAYS: Top-left: OVR rating + dynamic position/role. Below OVR: Tunisia flag badge (🇹🇳) + shield badge displaying "b FLAWLESS" brand logo with golden crown/diamond motif (NEVER generic football club). Top-right: 3 attribute chips from JSON attributes.
5. BOTTOM: Bold player name centered under portrait + 6 stat columns in a row.

# PLAYER DATA
{PLAYER_DATA_JSON}
```

---

### 2. Dynamic Placeholders Reference

| Placeholder | Origin | Example Output |
| :--- | :--- | :--- |
| `{BACKGROUND_STYLE}` | `cardModels.ts` + `HOBBY_DIRECTIVES` | `EA TOTY electrifying blue crystal sapphire... \| Cyberpunk RGB esports arena...` |
| `{MOOD}` | User Selection / Interview | `Savage`, `Legendary`, `Funny`, `Unstoppable` |
| `{PERSONALITY_CONTEXT}` | `buildPersonalityContext()` | `Hobbies: Music, DJ, Coffee. Identity: Tunisian DJ Queen. Custom: Warm golden lights.` |
| `{PLAYER_DATA_JSON}` | `buildPrompt.ts` | `{"name":"MARIEM","rating":95,"pos":"QUEEN","club":"b FLAWLESS","stats":["DHK 99","JAW 98"],"attributes":["SKILL 5★","WEAK 5★","WORK H/H"]}` |

---

### 3. 40+ Keyword Hobby Visual Directives Catalog

| Category | Keywords | 3D Visual Art Direction Injected |
| :--- | :--- | :--- |
| **Gaming & Tech** | `game`, `gaming`, `valorant`, `code`, `tech`, `hacker` | Cyberpunk RGB esports arena, neon cyan/magenta glow, holographic HUD overlays, matrix particle rain |
| **Food & Coffee** | `coffee`, `kahwa`, `9ahwa`, `cooking`, `tea`, `food` | Modern Tunisian lounge café, espresso & chicha aesthetic, warm golden lighting, floating spice particles |
| **Sports** | `football`, `kora`, `gym`, `boxing`, `basketball`, `swimming` | Floodlit stadium at night, golden confetti rain, high-contrast gym lighting, fierce champion spotlight |
| **Music & Arts** | `music`, `dj`, `rap`, `singer`, `guitar`, `piano`, `art`, `dance` | Neon concert stage setup, gold microphone spotlight aura, vinyl beats, purple/cyan lasers, paint splashes |
| **Vehicles & Travel** | `car`, `driving`, `motorcycle`, `travel`, `adventure` | Sleek night drive on coastal highway, neon city reflection on sports car, airplane window golden sunset |
| **Water & Nature** | `fishing`, `siyada`, `bahr`, `beach`, `nature` | Mediterranean coastal breeze, Bizerte sea boat sunset, turquoise water, tropical beach sunset glow |
| **Education & Work** | `study`, `reading`, `medical`, `doctor`, `engineering`, `business` | Grand library aesthetic, towering bookshelves, warm reading lamp, futuristic medical blue lab, penthouse skyline |
| **Fashion & Style** | `fashion`, `style`, `shopping` | High-end runway aesthetic, dramatic catwalk lighting, luxury boutique golden accessories |
| **Anime & Cinema** | `anime`, `manga`, `movie`, `cinema` | Japanese anime cherry blossom petals, dramatic manga speed lines, Hollywood premiere red carpet glow |

---

### 4. Gender-Aware Role & Title Matrix

The system dynamically detects gender and injects gender-tailored role titles and card header titles:

```
                  ┌────────────────────────────────────────┐
                  │       Gender Detection Filter          │
                  └───────────────────┬────────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
     Female Profile (female/woman)                   Male Profile (male/man)
  ┌─────────────────────────────────┐             ┌─────────────────────────────────┐
  │ Positions: QUEEN, DIVA, ICON,   │             │ Positions: KING, BOSS, DEV,     │
  │ STAR, CHIC, GLAM, HERO, PRO, VIP│             │ JAW, PRO, CEO, VIP, HERO, SNIPER│
  │                                 │             │                                 │
  │ Titles: "THE QUEEN", "CAFFEINE  │             │ Titles: "THE LEGEND", "CAFFEINE │
  │ QUEEN", "DRAMA QUEEN", "GLAM    │             │ KING", "DRAMA BOSS", "CHAMPION" │
  │ ICON", "CHIC BOSS", "UNSTOPPABLE"│            │                                 │
  │                                 │             │ Default Fallback: BOSS          │
  │ Default Fallback: QUEEN         │             └─────────────────────────────────┘
  └─────────────────────────────────┘
```

---

## 📡 API Reference & Payloads

### 1. Personality & Stat Analyzer: `POST /api/generate-ai-card`

#### Request Body
```json
{
  "answers": {
    "q1": "I love playing music and drinking 9ahwa",
    "q2": "I'm super energetic and friendly"
  },
  "profileInfo": {
    "name": "MARIEM",
    "gender": "female",
    "hobbies": ["Music", "Coffee", "Gaming"]
  },
  "gender": "female"
}
```

#### Response Body
```json
{
  "stats": [
    { "code": "DHK", "value": 99 },
    { "code": "JAW", "value": 98 },
    { "code": "S7B", "value": 95 },
    { "code": "9HW", "value": 92 },
    { "code": "DBR", "value": 90 },
    { "code": "HRB", "value": 88 }
  ],
  "overall": 94,
  "position": "QUEEN",
  "badges": [
    { "title": "SKILL 5★" },
    { "title": "WEAK 5★" },
    { "title": "WORK H/H" }
  ],
  "cardTitle": "THE QUEEN",
  "bio": "Born to spread good vibes and drink 9ahwa",
  "description": "Humor • Music • Vibes • Coffee"
}
```

---

### 2. 3D Card Generation: `POST /api/generate-card`

#### Request Body
```json
{
  "photo": "data:image/png;base64,iVBORw0KGgo...",
  "overallRating": 94,
  "profileInfo": {
    "name": "MARIEM",
    "gender": "female",
    "hobbies": ["Music", "Coffee"]
  },
  "cardData": {
    "modelId": "toty_blue",
    "mood": "Savage",
    "position": "QUEEN",
    "badges": [
      { "title": "SKILL 5★" },
      { "title": "WEAK 5★" },
      { "title": "WORK H/H" }
    ]
  },
  "stats": [
    { "code": "DHK", "value": 99 },
    { "code": "JAW", "value": 98 }
  ]
}
```

#### Response Body
```json
{
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..."
}
```

---

### 3. Print-Ready Card Exporter: `POST /api/export-card`

#### Request Body
```json
{
  "baseImageUrl": "data:image/png;base64,iVBORw...",
  "playerName": "MARIEM",
  "format": "pdf"
}
```

#### Response
- Returns `200 OK` with binary `application/pdf` or `image/png` attachment formatted to **700×1050 px (300 DPI print standard)**.

---

## ✂️ PVC Card Die-Cut Shape Specifications

Every generated card matches the physical PVC cutting die silhouette:

- **Dimensions**: `700px` width × `1050px` height (5:7 ratio)
- **Top Header**: Curved concave arch with central M-shaped double-crown notch
- **Sides**: Straight vertical borders with subtle concave inward taper (NO wing ears)
- **Bottom Apex**: Smooth pointed heraldic shield apex
- **Clipping Engine**: Applied via SVG `<clipPath id="pvcCardClipPath">` in `PvcCardFrame.tsx` and `<clipPath id="exportCardClip">` in `buildCardHTML.ts`.

---

## 🗺️ Project Roadmap & Future Enhancements

- [x] **10 PVC Card Background Models** (Classic Gold, Dark Obsidian, TOTY Sapphire, Emerald Imperial, Ruby Inferno, Platinum Silver, Cyber Synthwave, Rose Gold, Cosmic Nebula, Carrara Marble)
- [x] **40+ Keyword Hobby Visual Art Directives**
- [x] **Gender-Aware Roles & Titles** (`QUEEN`, `DIVA`, `ICON`, `KING`, `BOSS`)
- [x] **b FLAWLESS Brand Logo Overlay Integration**
- [x] **Exact FUT Crown Notch & Shield Die-Cut Shape**
- [x] **Puppeteer 300 DPI PDF & PNG Export Engine**
- [x] **OpenAI Token Caching Optimization**
- [ ] **Phase 2: Batch Printing Queue for Physical PVC Orders**
- [ ] **Phase 3: Embedded NFC Chip Dynamic Profile Link**
- [ ] **Phase 4: AR (Augmented Reality) 3D Card Viewer**
