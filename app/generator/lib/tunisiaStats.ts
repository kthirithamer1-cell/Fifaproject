// ─── Tunisia Stats Dataset ────────────────────────────────────────────────
// All 68 Tunisian cultural stats extracted from `public/static tunisia.xlsx`
// ──────────────────────────────────────────────────────────────────────────

export interface TunisiaStat {
    code: string;
    stat: string;
    meaning: string;
    emoji: string;
}

export const TUNISIA_STATS: TunisiaStat[] = [
    { code: "DHK", stat: "Dhahka", meaning: "Humor", emoji: "😂" },
    { code: "NKT", stat: "Nokta", meaning: "Joke quality", emoji: "🎭" },
    { code: "KLM", stat: "Klem", meaning: "Talking ability", emoji: "🗣️" },
    { code: "HDR", stat: "Hadhra", meaning: "Storytelling", emoji: "🎤" },
    { code: "JAW", stat: "Jaw", meaning: "Good vibes", emoji: "😎" },
    { code: "DRM", stat: "Drama", meaning: "Drama creation", emoji: "🎭" },
    { code: "HRB", stat: "Hroub", meaning: "Escaping responsibilities", emoji: "🏃" },
    { code: "KHD", stat: "Khidma", meaning: "Work ethic", emoji: "💼" },
    { code: "MKH", stat: "Mekh", meaning: "Intelligence", emoji: "🧠" },
    { code: "DBR", stat: "Debber Rassek", meaning: "Problem solving", emoji: "🛠️" },
    { code: "SBR", stat: "Sabr", meaning: "Patience", emoji: "😇" },
    { code: "ZHR", stat: "zhar", meaning: "Luck", emoji: "🍀" },
    { code: "7IL", stat: "Hila", meaning: "Tricks & cleverness", emoji: "🎩" },
    { code: "FRS", stat: "Frassa", meaning: "Detective skills", emoji: "🕵️" },
    { code: "CHK", stat: "Chkoun?", meaning: "Curiosity / Gossip", emoji: "👂" },
    { code: "3YN", stat: "3in", meaning: "Observation", emoji: "👀" },
    { code: "WST", stat: "Wasta", meaning: "Connections", emoji: "🤝" },
    { code: "TKK", stat: "TEKTEK", meaning: "Money-making", emoji: "💰" },
    { code: "CRZ", stat: "Corza", meaning: "Financial management", emoji: "💳" },
    { code: "BKL", stat: "Bokhl", meaning: "Stinginess", emoji: "💵" },
    { code: "SRF", stat: "Sarf", meaning: "Spending money", emoji: "💸" },
    { code: "MRG", stat: "Mriguel", meaning: "Style", emoji: "😎" },
    { code: "LBG", stat: "Labga", meaning: "Elegance", emoji: "👔" },
    { code: "GZR", stat: "Gzara", meaning: "Boldness", emoji: "🔥" },
    { code: "TMS", stat: "Tmassik", meaning: "Stubbornness", emoji: "😤" },
    { code: "3SB", stat: "A3sab", meaning: "Anger", emoji: "😡" },
    { code: "HCH", stat: "Hachma Resistance", meaning: "Shamelessness", emoji: "😂" },
    { code: "FDH", stat: "Fdhou7", meaning: "Embarrassing moments", emoji: "🤦" },
    { code: "MCH", stat: "Mchawech", meaning: "Chaos", emoji: "🌪️" },
    { code: "L3B", stat: "La3b", meaning: "Mischief", emoji: "😈" },
    { code: "TBR", stat: "Tbarbir", meaning: "Complaining", emoji: "😤" },
    { code: "SDA", stat: "Sda3", meaning: "Noise level", emoji: "🔊" },
    { code: "FRJ", stat: "Ferja", meaning: "Watching others", emoji: "👀" },
    { code: "RKD", stat: "Rekd", meaning: "Sleeping", emoji: "😴" },
    { code: "9HW", stat: "9ahwa", meaning: "Coffee addiction", emoji: "☕" },
    { code: "CHY", stat: "Chay", meaning: "Tea addiction", emoji: "🍵" },
    { code: "TLF", stat: "Talaf", meaning: "Getting lost", emoji: "🗺️" },
    { code: "SMS", stat: "Semsara", meaning: "Negotiation", emoji: "🤝" },
    { code: "BRG", stat: "Bargouga", meaning: "Bargaining", emoji: "🤑" },
    { code: "W9T", stat: "Wakt", meaning: "Punctuality", emoji: "⏰" },
    { code: "JRY", stat: "Jary", meaning: "Running errands", emoji: "🚗" },
    { code: "S7B", stat: "S7ab", meaning: "Friendship", emoji: "🤜🤛" },
    { code: "HOB", stat: "Hob", meaning: "Romance", emoji: "❤️" },
    { code: "KDB", stat: "Kedhb", meaning: "Lying skill", emoji: "😅" },
    { code: "MSL", stat: "Mas2ouliya", meaning: "Responsibility", emoji: "📋" },
    { code: "TKL", stat: "Twakkel", meaning: "Reliance on luck", emoji: "🙏" },
    { code: "CHJ", stat: "Maywakherhech", meaning: "Courage", emoji: "🦁" },
    { code: "BRD", stat: "Broud", meaning: "Calmness", emoji: "🧊" },
    { code: "NFS", stat: "Nefs", meaning: "Competitiveness", emoji: "⚔️" },
    { code: "MAM", stat: "Weld omo", meaning: "Still calls mom for everything", emoji: "😂" },
    { code: "STP", stat: "Stopet", meaning: "Can find a louage instantly", emoji: "🚐" },
    { code: "RCH", stat: "Richness Appearance", meaning: "Looks rich, isn't", emoji: "💸" },
    { code: "FRD", stat: "Fridha", meaning: "Ability to disappear from work", emoji: "🏃" },
    { code: "NSS", stat: "Nasnes", meaning: "Watches everyone", emoji: "👀" },
    { code: "T7C", stat: "T7in", meaning: "Flattery level", emoji: "🤝" },
    { code: "KRK", stat: "Karhba", meaning: "Driving style", emoji: "🚗" },
    { code: "ZDM", stat: "Zdem", meaning: "Crowding and pushing through", emoji: "🚶" },
    { code: "MTL", stat: "Metloui", meaning: "Flexibility in excuses", emoji: "😅" },
    { code: "GLB", stat: "Ghalba", meaning: "Surviving difficult situations", emoji: "💪" },
    { code: "BRM", stat: "Barmil", meaning: "Eats everything", emoji: "🍔" },
    { code: "S7R", stat: "S7our", meaning: "Late-night energy", emoji: "🌙" },
    { code: "QRM", stat: "GHASRET EL KLEB", meaning: "Last-minute studying", emoji: "📚" },
    { code: "BKR", stat: "Bekri", meaning: "Waking up early", emoji: "⏰" },
    { code: "TKR", stat: "Tkarkir", meaning: "Complaining continuously", emoji: "😤" },
    { code: "DWR", stat: "Dawran", meaning: "Wandering around for no reason", emoji: "🚶" },
    { code: "KHB", stat: "Khabtha", meaning: "Creating trouble", emoji: "💥" },
    { code: "MTR", stat: "Mtarfis", meaning: "FAT", emoji: "🤦" },
];

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
}

export function calculateOverall(stats: SelectedStat[]): number {
    if (stats.length === 0) return 0;
    const sum = stats.reduce((acc, s) => acc + s.value, 0);
    return Math.round(sum / stats.length);
}
