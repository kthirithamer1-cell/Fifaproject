import { TUNISIA_STATS, type TunisiaStat } from "../../constant";
export { TUNISIA_STATS, type TunisiaStat };

// ─── Canonical Dynamic Notes Dictionary (High / Mid / Low) ─────────────────

interface StatNoteTiers {
    high: string;
    mid: string;
    low: string;
}

const STAT_NOTES_MAP: Record<string, StatNoteTiers> = {
    DHK: { high: "DIMA YADH7AK", mid: "DHAHKA MREGLE", low: "SERIOUS 100%" },
    NKT: { high: "NOKTA LUXE", mid: "NOKTA BEHIA", low: "MA YDA7AKCH" },
    KLM: { high: "RADIO TUNIS", mid: "YEFHAMHA", low: "SAKET DIMA" },
    HDR: { high: "HADHRA 24/7", mid: "7KEYET BEHIA", low: "KELMTIN WAKAHW" },
    JAW: { high: "JAWOU BEHI", mid: "JAW 3ADI", low: "CALME 100%" },
    DRM: { high: "DRAMA QUEEN", mid: "CHWAYA DRAMA", low: "0% DRAMA" },
    HRB: { high: "MA TEL9AWECH", mid: "YSALEKHA", low: "DIMA 7ADHER" },
    KHD: { high: "KHADAM PRO", mid: "KHEDMA 3ADEYA", low: "REYAH DIMA" },
    MKH: { high: "EINSTEIN", mid: "DHKEY", low: "3ALA NYETOU" },
    DBR: { high: "YDAFFAS RASOU", mid: "YSALEK OMOROU", low: "YBLOCKI DIMA" },
    SBR: { high: "SABR AYOUB", mid: "YESBER", low: "MA YOSBORCH" },
    ZHR: { high: "ZHAROU METLA3", mid: "ZHAR 3ADI", low: "MA 3ANDOUCH ZHAR" },
    "7IL": { high: "THA3LEB", mid: "7ILAYLI", low: "NAYEF" },
    FRS: { high: "SHERLOCK", mid: "YCHOUFHA", low: "MA YFIQ BE CHAY" },
    CHK: { high: "CHKOUNDJIAN", mid: "NASNES", low: "MA YHÉMOUCH" },
    "3YN": { high: "RADAR 360°", mid: "YRA BEHI", low: "MA YRA CHAY" },
    WST: { high: "WASTA 5*", mid: "3ANDOU KTEF", low: "0% WASTA" },
    TKK: { high: "MILLIONAIRE", mid: "YDEBBER RASOU", low: "BROKE 0%" },
    CRZ: { high: "BANQUIER", mid: "MREGEL", low: "FLOSS CHNOWA?" },
    BKL: { high: "MA YMEDD CHAY", mid: "YE7SEBHA", low: "KARIM 100%" },
    SRF: { high: "SARRAF PRO", mid: "YOSROF 3ADI", low: "MA YOSROFCH" },
    MRG: { high: "MRIGUEL 100%", mid: "MREGEL CHWAYA", low: "MCHAWESH" },
    LBG: { high: "LABGA LUXE", mid: "LABEG 3ADI", low: "MA YRATESH" },
    GZR: { high: "GZARA NAFIKHA", mid: "CONFIDENT", low: "7ACHAM 100%" },
    TMS: { high: "RASOU S7I7", mid: "SHWAYA TMASSIK", low: "MEREN" },
    "3SB": { high: "A3SAB EN FEU", mid: "A3SAB 3ADI", low: "ZEN 100%" },
    HCH: { high: "0% HACHMA", mid: "MA YEST7ICH", low: "7ACHAM" },
    FDH: { high: "FDHI7A LIVE", mid: "GHAFFASS", low: "DISCRET" },
    MCH: { high: "TORNADE", mid: "CHWAYA FAWDHA", low: "MONADHAM" },
    L3B: { high: "CHAITAN", mid: "LA3BI", low: "SERIEUX" },
    TBR: { high: "TBARBIR PRO", mid: "YETBARR", low: "SAKET" },
    SDA: { high: "HAUT PARLEUR", mid: "SOUT BEHI", low: "HADI" },
    FRJ: { high: "FERJAWI", mid: "YETFARRAJ", low: "MA YHEMOUCH" },
    RKD: { high: "NOUM 24/7", mid: "8 SWEYE3", low: "EARLY BIRD 5AM" },
    "9HW": { high: "5 EXPRESS / J", mid: "CAPUCIN SBE7", low: "CHAY ONLY" },
    CHY: { high: "CHAY TAYMI", mid: "CHAY 3ADI", low: "MA YOCHROBCH" },
    TLF: { high: "GPS DAYE3", mid: "YDHAYA3 SA3AT", low: "GUIDE PRO" },
    SMS: { high: "SEMSAR PRO", mid: "YFAWADH", low: "MA YSEMSERCH" },
    BRG: { high: "BARGOUGA MASTER", mid: "YNEQES", low: "MA YFAWADHCH" },
    W9T: { high: "FI WAQTEX", mid: "5 MIN RETARD", low: "RETARD 24/7" },
    JRY: { high: "FORMULA 1", mid: "YETJARA", low: "MA YEJRICH" },
    S7B: { high: "SA7BI FI KOUCHI", mid: "WLED 7OUMA", low: "SOLO WOLF" },
    HOB: { high: "ROMANTIQUE", mid: "7NIN", low: "ROBOT" },
    KDB: { high: "PINOCCHIO", mid: "YZEED CHWAYA", low: "SADEQ 100%" },
    MSL: { high: "MAS2OUL PRO", mid: "9AD KHLAMTOU", low: "0% MAS2OULIYA" },
    TKL: { high: "MTAWAKEL", mid: "YTWAKKEL", low: "YE7SEBHA" },
    CHJ: { high: "9ALB ASAD", mid: "CHOUJA3", low: "KHAWAF" },
    BRD: { high: "GLAÇON", mid: "BERED", low: "SKHOUN" },
    NFS: { high: "COMPÉTITEUR", mid: "Y7EB YERBA7", low: "MA YHEMOUCH" },
    MAM: { high: "WELD OMMOU", mid: "YCHAWERHA", low: "INDÉPENDANT" },
    STP: { high: "LOUAGE PRO", mid: "YESTOPPI", low: "TAXI ONLY" },
    RCH: { high: "LOOK RICH", mid: "LABES 3LIH", low: "ZAWALI" },
    FRD: { high: "FRIDHA MASTER", mid: "YEFREDH", low: "DIMA FI BOSTOU" },
    NSS: { high: "NASNES FBI", mid: "YETFASSAS", low: "MA YCHOUFCH" },
    T7C: { high: "FLATTEUR PRO", mid: "YFAKHAR", low: "DIRECT 100%" },
    KRK: { high: "PILOTE F1", mid: "CHAUFFEUR", low: "MA YSO9CH" },
    ZDM: { high: "ZADDAM", mid: "YODKHEL", low: "YESTANA" },
    MTL: { high: "METLOUETI", mid: "YSALEKHA", low: "MA YETSARREFCH" },
    GLB: { high: "GHALAB", mid: "S3EEB", low: "YESTASLEM" },
    BRM: { high: "KALLAY PRO", mid: "YEKEL BEHI", low: "MA YEKEL CHAY" },
    S7R: { high: "BATMAN 3AM", mid: "YESHAR", low: "YORGOD BEKRI" },
    QRM: { high: "DERNIÈRE MINUTE", mid: "YEKHDEM BEKRI", low: "MONADHAM" },
    BKR: { high: "BEKRI 5AM", mid: "YFIQ SBE7", low: "NSSIFA" },
    TKR: { high: "TKARKIR MASTER", mid: "YETKARKER", low: "NACHIT" },
    DWR: { high: "TOURISTE", mid: "YDOUR CHWAYA", low: "DARDAR DIMA" },
    KHB: { high: "MOUSSIBA", mid: "CHA9I", low: "3AQEL" },
    MTR: { high: "MTARFES", mid: "MACHI 7ALOU", low: "DA9EEQ" },
};

// ─── Helper: get dynamic stat note based on code and value ─────────────────
export function getDynamicStatNote(code: string, value: number): string {
    const cleanCode = (code || "").toUpperCase().trim();
    const tiers = STAT_NOTES_MAP[cleanCode];

    if (tiers) {
        if (value >= 80) return tiers.high;
        if (value >= 50) return tiers.mid;
        return tiers.low;
    }

    // Default fallback based on score range
    if (value >= 80) return "LEGENDARY";
    if (value >= 50) return "BALANCED";
    return "0% SKILL";
}

// ─── Helper: Extract customized contextual note from description & hobbies ──
export function extractNotesFromContext(
    code: string,
    value: number,
    contextText: string = ""
): string {
    const cleanCode = (code || "").toUpperCase().trim();
    const lower = contextText.toLowerCase();

    // Check for explicit user notes formatting like "DHK: DIMA YADH7AK" or "9HW = 10 EXPRESS"
    const explicitRegex = new RegExp(`(?:${cleanCode})\\s*[:=-]\\s*([a-zA-Z0-9\u0600-\u06FF\\s/%+*]{2,20})`, "i");
    const explicitMatch = contextText.match(explicitRegex);
    if (explicitMatch && explicitMatch[1]) {
        const customCandidate = explicitMatch[1].trim().toUpperCase();
        if (customCandidate.length >= 2 && customCandidate.length <= 18) {
            return customCandidate;
        }
    }

    // 9HW: Coffee / Kahwa
    if (cleanCode === "9HW") {
        if (lower.includes("express") || lower.includes("serré") || lower.includes("اكسبريس") || lower.includes("سيري")) return "5 EXPRESS / J";
        if (lower.includes("capucin") || lower.includes("direct") || lower.includes("كابوسان") || lower.includes("ديركت")) return "CAPUCIN SBE7";
        if (lower.includes("nuit") || lower.includes("3am") || lower.includes("late") || lower.includes("ليل")) return "9AHWA 3AM";
        if (lower.includes("addict") || lower.includes("dima") || lower.includes("قهوة") || lower.includes("9ahwa") || lower.includes("kahwa")) return "9AHWETJEY PRO";
    }

    // DHK & NKT: Humor / Laughter
    if (cleanCode === "DHK" || cleanCode === "NKT") {
        if (lower.includes("yadh7ak") || lower.includes("dima yadhak") || lower.includes("ضحك") || lower.includes("يضحك") || lower.includes("نكت") || lower.includes("فدلاك")) return "DIMA YADH7AK";
        if (lower.includes("serious") || lower.includes("serieux") || lower.includes("جدي") || lower.includes("ما يضحكش")) return "SERIOUS 100%";
        if (lower.includes("meme") || lower.includes("funny") || lower.includes("humour") || lower.includes("ضامر")) return "NOKTA LUXE";
    }

    // KRK: Driving / Cars
    if (cleanCode === "KRK") {
        if (lower.includes("golf") || lower.includes("clio") || lower.includes("bmw") || lower.includes("audi") || lower.includes("mercedes") || lower.includes("كرهبة") || lower.includes("سياقة")) return "PILOTE TUNIS";
        if (lower.includes("vitesse") || lower.includes("speed") || lower.includes("fast") || lower.includes("جري") || lower.includes("فورمولا")) return "FORMULA 1";
        if (lower.includes("embouteillage") || lower.includes("z7am") || lower.includes("زحمة") || lower.includes("تاكسي")) return "Z7AM MASTER";
    }

    // W9T: Punctuality & Delays
    if (cleanCode === "W9T") {
        if (lower.includes("retard") || lower.includes("late") || lower.includes("مخر") || lower.includes("روطار") || lower.includes("dima retard")) return "RETARD 1H";
        if (lower.includes("pile") || lower.includes("punctual") || lower.includes("exact") || lower.includes("وقت") || lower.includes("في وقتو")) return "FI WAQTEX 100%";
    }

    // S7R & RKD: Sleep / Night Owl
    if (cleanCode === "S7R" || cleanCode === "RKD") {
        if (lower.includes("nuit") || lower.includes("sleep") || lower.includes("insomnia") || lower.includes("3am") || lower.includes("4am") || lower.includes("سهر") || lower.includes("ليل")) return "BATMAN 3AM";
        if (lower.includes("noum") || lower.includes("ragad") || lower.includes("re9ed") || lower.includes("نوم") || lower.includes("راقد")) return "NOUM 24/7";
        if (lower.includes("bekri") || lower.includes("early") || lower.includes("5am") || lower.includes("صباح") || lower.includes("بكري")) return "EARLY BIRD 5AM";
    }

    // L3B & MKH: Gaming, Coding, Intelligence
    if (cleanCode === "L3B" || cleanCode === "MKH") {
        if (lower.includes("fifa") || lower.includes("gaming") || lower.includes("valorant") || lower.includes("league") || lower.includes("جيمنغ") || lower.includes("فيفا")) return "ESPORTS KING";
        if (lower.includes("code") || lower.includes("dev") || lower.includes("program") || lower.includes("برمجة") || lower.includes("كود")) return "MATRIX CODER";
        if (lower.includes("chess") || lower.includes("echecs") || lower.includes("smart") || lower.includes("شطرنج") || lower.includes("ذكي")) return "EINSTEIN";
    }

    // TKK, CRZ, SRF: Money, Business, Shopping
    if (cleanCode === "TKK" || cleanCode === "CRZ" || cleanCode === "SRF") {
        if (lower.includes("flous") || lower.includes("money") || lower.includes("business") || lower.includes("crypto") || lower.includes("فلوس") || lower.includes("تكتاك") || lower.includes("تجارة")) return "MILLIONAIRE";
        if (lower.includes("shopping") || lower.includes("sarf") || lower.includes("spend") || lower.includes("صرف") || lower.includes("شوبينغ")) return "SARRAF PRO";
    }

    // DRM: Drama
    if (cleanCode === "DRM") {
        if (lower.includes("drama") || lower.includes("action") || lower.includes("film") || lower.includes("دراما") || lower.includes("مشاكل")) return "DRAMA QUEEN";
        if (lower.includes("calm") || lower.includes("zen") || lower.includes("peace") || lower.includes("رايض") || lower.includes("هادئ")) return "0% DRAMA";
    }

    // LBG & MRG: Fashion, Style, Elegance
    if (cleanCode === "LBG" || cleanCode === "MRG") {
        if (lower.includes("fashion") || lower.includes("style") || lower.includes("look") || lower.includes("chic") || lower.includes("لبسة") || lower.includes("أناقة") || lower.includes("شياكة")) return "HAUTE COUTURE";
        if (lower.includes("parfum") || lower.includes("luxe") || lower.includes("عطر") || lower.includes("لوكس")) return "LOOK LUXE 100%";
    }

    // S7B & JAW: Friendship & Vibes
    if (cleanCode === "S7B" || cleanCode === "JAW") {
        if (lower.includes("sahbi") || lower.includes("friends") || lower.includes("7ouma") || lower.includes("صاحبي") || lower.includes("عشرة") || lower.includes("أصحاب")) return "SA7BI FI KOUCHI";
        if (lower.includes("vibe") || lower.includes("jaw") || lower.includes("dima fer7an") || lower.includes("جو") || lower.includes("أجواء")) return "JAWOU BEHI";
    }

    // KHD: Work Ethic
    if (cleanCode === "KHD") {
        if (lower.includes("khidma") || lower.includes("travail") || lower.includes("work") || lower.includes("خدمة") || lower.includes("خدام")) return "KHADAM PRO";
        if (lower.includes("reyah") || lower.includes("repos") || lower.includes("راحة") || lower.includes("مرتاح")) return "REYAH DIMA";
    }

    // Default to score tier note
    return getDynamicStatNote(cleanCode, value);
}

// ─── Dynamic Title & Position Engine ──────────────────────────────────────
export interface DynamicTitleInput {
    gender?: "male" | "female" | string;
    age?: string | number;
    description?: string;
    hobbies?: string | string[];
    dominantStatCode?: string;
    designNotes?: string;
    answers?: Record<string, any>;
}

export function resolveDynamicPositionAndTitle(input: DynamicTitleInput): {
    position: string;
    title: string;
    bio: string;
} {
    const gender = input.gender === "female" ? "female" : "male";
    const ageNum = typeof input.age === "number" ? input.age : parseInt(String(input.age || "25"), 10) || 25;
    const hobbiesStr = Array.isArray(input.hobbies) ? input.hobbies.join(" ") : String(input.hobbies || "");
    const combinedText = `${input.description || ""} ${input.designNotes || ""} ${hobbiesStr} ${JSON.stringify(input.answers || "")}`.toLowerCase();

    // 1. Age Archetype Defaults
    const isChild = ageNum < 13;
    const isTeen = ageNum >= 13 && ageNum < 20;
    const isVeteran = ageNum >= 35 && ageNum < 51;
    const isSenior = ageNum >= 51;

    // 2. Keyword & Domain Context Resolution
    if (gender === "female") {
        // Female Specific dynamic titles
        if (combinedText.includes("fashion") || combinedText.includes("style") || combinedText.includes("mode") || combinedText.includes("shopping") || combinedText.includes("chic")) {
            return { position: "DIVA", title: "THE FASHIONISTA", bio: "Always runway ready and iconic" };
        }
        if (combinedText.includes("coffee") || combinedText.includes("9ahwa") || combinedText.includes("kahwa") || combinedText.includes("direct")) {
            return { position: "9AHWA QUEEN", title: "CAFFEINE QUEEN", bio: "Fuelled by pure Tunisian coffee" };
        }
        if (combinedText.includes("game") || combinedText.includes("gaming") || combinedText.includes("gamer") || combinedText.includes("stream")) {
            return { position: "GAMING QUEEN", title: "ESPORTS ICON", bio: "Ruling every lobby and match" };
        }
        if (combinedText.includes("gym") || combinedText.includes("fitness") || combinedText.includes("sport") || combinedText.includes("workout")) {
            return { position: "FITNESS QUEEN", title: "UNSTOPPABLE WARRIOR", bio: "Discipline, strength and pure determination" };
        }
        if (combinedText.includes("drama") || combinedText.includes("queen") || combinedText.includes("chicha")) {
            return { position: "DRAMA QUEEN", title: "THE SUPREME QUEEN", bio: "100% royal energy and unapologetic vibes" };
        }
        if (combinedText.includes("business") || combinedText.includes("work") || combinedText.includes("money") || combinedText.includes("khidma") || combinedText.includes("ceo")) {
            return { position: "LA PATRONNE", title: "LADY BOSS", bio: "Building an empire step by step" };
        }
        if (combinedText.includes("food") || combinedText.includes("cooking") || combinedText.includes("chef") || combinedText.includes("makla")) {
            return { position: "CHEF QUEEN", title: "GOURMET MAESTRA", bio: "Master of exquisite flavors" };
        }
        if (combinedText.includes("code") || combinedText.includes("tech") || combinedText.includes("dev")) {
            return { position: "TECH QUEEN", title: "ALGORITHM MAESTRA", bio: "Writing futuristic code and algorithms" };
        }
        if (combinedText.includes("music") || combinedText.includes("sing") || combinedText.includes("dance")) {
            return { position: "SUPERSTAR", title: "MELODY QUEEN", bio: "Bringing rhythm, grace and melody" };
        }
        if (combinedText.includes("car") || combinedText.includes("karhba") || combinedText.includes("drive")) {
            return { position: "PILOTE QUEEN", title: "SPEED QUEEN", bio: "Fast lane lifestyle with unmatched precision" };
        }

        // Female Age-based Fallbacks
        if (isChild) {
            return { position: "PRINCESSE", title: "LITTLE QUEEN", bio: "Brightest smile and future legend" };
        }
        if (isTeen) {
            return { position: "RISING STAR", title: "NEXT-GEN QUEEN", bio: "Fresh talent with infinite potential" };
        }
        if (isSenior) {
            return { position: "MALIKA", title: "TIMELESS QUEEN", bio: "Eternal grace, wisdom and royal prestige" };
        }
        if (isVeteran) {
            return { position: "LA PATRONNE", title: "ICONIC LEADER", bio: "Experience, elegance and commanding authority" };
        }

        // Prime Adult Female Default
        return { position: "QUEEN", title: "THE QUEEN", bio: "Born to inspire, lead and shine" };

    } else {
        // Male Specific dynamic titles
        if (combinedText.includes("fashion") || combinedText.includes("style") || combinedText.includes("chic") || combinedText.includes("luxe")) {
            return { position: "GENTLEMAN", title: "STYLE ICON", bio: "Timeless class and sharp elegance" };
        }
        if (combinedText.includes("coffee") || combinedText.includes("9ahwa") || combinedText.includes("kahwa") || combinedText.includes("direct")) {
            return { position: "9AHWA BOSS", title: "SULTAN EL 9AHWA", bio: "5 express a day and sharp focus" };
        }
        if (combinedText.includes("game") || combinedText.includes("gaming") || combinedText.includes("gamer") || combinedText.includes("fifa")) {
            return { position: "ESPORTS BOSS", title: "GAMING MONSTER", bio: "Dominating every tournament and match" };
        }
        if (combinedText.includes("car") || combinedText.includes("karhba") || combinedText.includes("drive") || combinedText.includes("f1")) {
            return { position: "PILOTE F1", title: "SPEED DEMON", bio: "Adrenaline seeker and highway pilot" };
        }
        if (combinedText.includes("gym") || combinedText.includes("fitness") || combinedText.includes("kasa") || combinedText.includes("muscu")) {
            return { position: "BEAST MODE", title: "IRON CHAMPION", bio: "Unbreakable strength and supreme discipline" };
        }
        if (combinedText.includes("business") || combinedText.includes("money") || combinedText.includes("flous") || combinedText.includes("tektek")) {
            return { position: "EL PATRON", title: "MONEY MAKER", bio: "Always closing deals and making moves" };
        }
        if (combinedText.includes("football") || combinedText.includes("soccer") || combinedText.includes("kora")) {
            return { position: "GOAT", title: "DERBY LEGEND", bio: "Championship mindset and magical touch" };
        }
        if (combinedText.includes("code") || combinedText.includes("dev") || combinedText.includes("tech")) {
            return { position: "DEV GURU", title: "CYBER ARCHITECT", bio: "Turning coffee into production code" };
        }
        if (combinedText.includes("food") || combinedText.includes("chef") || combinedText.includes("barmil")) {
            return { position: "MASTER CHEF", title: "CULINARY BOSS", bio: "King of the kitchen and hearty meals" };
        }

        // Male Age-based Fallbacks
        if (isChild) {
            return { position: "WONDERKID", title: "PETIT PRINCE", bio: "The future GOAT in the making" };
        }
        if (isTeen) {
            return { position: "NEXT GEN", title: "RISING STAR", bio: "Pure talent and unstoppable ambition" };
        }
        if (isSenior) {
            return { position: "GRANDMASTER", title: "EL CHIKH", bio: "Timeless wisdom, honor and living legend" };
        }
        if (isVeteran) {
            return { position: "CAPTAIN", title: "EL PADRE", bio: "Seasoned veteran and natural leader" };
        }

        // Prime Adult Male Default
        return { position: "BOSS", title: "THE LEGEND", bio: "Born to conquer and inspire" };
    }
}

// ─── Helper: search stats by query ────────────────────────────────────────
export function searchStats(query: string): TunisiaStat[] {
    if (!query.trim()) return TUNISIA_STATS;
    const q = query.toLowerCase().trim();
    return TUNISIA_STATS.filter(
        (s) =>
            s.code.toLowerCase().includes(q) ||
            s.stat.toLowerCase().includes(q) ||
            s.meaning.toLowerCase().includes(q)
    );
}

// ─── Helper: get stat by code ──────────────────────────────────────────────
export function getStatByCode(code: string): TunisiaStat | undefined {
    return TUNISIA_STATS.find((s) => s.code === code);
}

// ─── Helper: calculate overall from stat values ────────────────────────────
export interface SelectedStat {
    code: string;
    value: number;
    note?: string;
}

export function calculateOverall(stats: SelectedStat[]): number {
    if (stats.length === 0) return 0;
    const sum = stats.reduce((acc, s) => acc + s.value, 0);
    return Math.round(sum / stats.length);
}

