import { TUNISIA_STATS, type TunisiaStat } from "../../constant";
export { TUNISIA_STATS, type TunisiaStat };

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
