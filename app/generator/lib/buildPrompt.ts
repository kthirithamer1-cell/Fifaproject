import { ProfileInfo } from "../page";
import { SelectedStat, getStatByCode } from "./tunisiaStats";

export interface DynamicPromptInput {
    name: string;
    age?: string;
    gender?: string;
    hobbies?: string;
    description?: string;
    overallRating: number;
    stats: SelectedStat[]; // Exactly 6 stats
    mood?: string;
    title?: string;
}

export function buildDynamicPrompt(
    template: string,
    input: DynamicPromptInput
): string {
    const {
        name,
        age,
        gender,
        hobbies,
        description,
        overallRating,
        stats,
        mood = "Legendary",
        title = "THE LEGEND",
    } = input;

    // 1. Format personality details
    const bioParts: string[] = [];
    if (age) bioParts.push(`Age: ${age}`);
    if (gender) bioParts.push(`Gender: ${gender}`);
    if (hobbies) bioParts.push(`Hobbies: ${hobbies}`);
    if (description) bioParts.push(`Bio: ${description}`);
    const personalityText = bioParts.join(" • ") || "A legendary person from Tunisia.";

    // 2. Format 6 stats section for the card
    const statsFormatted = stats
        .slice(0, 6)
        .map((s) => {
            const detail = getStatByCode(s.code);
            const label = detail ? `${s.code} (${detail.meaning})` : s.code;
            return `  ${label}: ${s.value}`;
        })
        .join("\n");

    // 3. Replace dynamic placeholders in prompt template
    let prompt = template
        .replace(/{NAME}/g, name.toUpperCase() || "LEGEND")
        .replace(/{NICKNAME}/g, title)
        .replace(/{OVR}/g, overallRating.toString())
        .replace(/{MOOD}/g, mood)
        .replace(/{PERSONALITY}/g, personalityText)
        .replace(/{TITLE}/g, title);

    // Replace old hardcoded stats block if present in template with our dynamic 6 stats
    const oldStatsBlockPattern = /DHK {DHK}[\s\S]*?TKK {TKK}/g;
    if (oldStatsBlockPattern.test(prompt)) {
        prompt = prompt.replace(oldStatsBlockPattern, statsFormatted);
    } else {
        prompt += `\n\nSIX STATS ON CARD:\n${statsFormatted}`;
    }

    return prompt;
}
