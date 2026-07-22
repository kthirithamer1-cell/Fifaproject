"use client";

import React from "react";
import type { CardStat, CardBadge } from "./CardComposer";

// ─── Types ────────────────────────────────────────────────────────────────

interface CardEditorProps {
    playerName: string;
    onPlayerNameChange: (v: string) => void;
    subtitle: string;
    onSubtitleChange: (v: string) => void;
    rating: number;
    onRatingChange: (v: number) => void;
    position: string;
    onPositionChange: (v: string) => void;
    stats: CardStat[];
    onStatsChange: (stats: CardStat[]) => void;
    badges: CardBadge[];
    onBadgesChange: (badges: CardBadge[]) => void;
    quoteFr: string;
    onQuoteFrChange: (v: string) => void;
    quoteAr: string;
    onQuoteArChange: (v: string) => void;
    hashtags: string[];
    onHashtagsChange: (tags: string[]) => void;
    description: string;
    onDescriptionChange: (v: string) => void;
    accentColor: string;
    onAccentColorChange: (v: string) => void;
}

// ─── Section Wrapper ────────────────────────────────────────────────────

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 font-space uppercase tracking-wider">
            {title}
        </h3>
        {children}
    </div>
);

// ─── Input Field ────────────────────────────────────────────────────────

const Field = ({
    label,
    value,
    onChange,
    placeholder,
    maxLength,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    maxLength?: number;
}) => (
    <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-space font-medium">
            {label}
        </label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 font-space focus:outline-none focus:border-[#E5A500] focus:ring-2 focus:ring-[#E5A500]/10 transition-all duration-200 placeholder:text-gray-400"
        />
    </div>
);

// ─── Slider Field ───────────────────────────────────────────────────────

const SliderField = ({
    label,
    value,
    onChange,
    min = 0,
    max = 99,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
}) => (
    <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 font-space font-medium w-28 truncate">
            {label}
        </span>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
                background: `linear-gradient(to right, #E5A500 0%, #E5A500 ${
                    ((value - min) / (max - min)) * 100
                }%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
            }}
        />
        <span className="text-sm text-gray-900 font-space font-black w-8 text-right tabular-nums">
            {value}
        </span>
    </div>
);

// ─── Component ──────────────────────────────────────────────────────────

export default function CardEditor({
    playerName,
    onPlayerNameChange,
    subtitle,
    onSubtitleChange,
    rating,
    onRatingChange,
    position,
    onPositionChange,
    stats,
    onStatsChange,
    badges,
    onBadgesChange,
    quoteFr,
    onQuoteFrChange,
    quoteAr,
    onQuoteArChange,
    hashtags,
    onHashtagsChange,
    description,
    onDescriptionChange,
    accentColor,
    onAccentColorChange,
}: CardEditorProps) {
    const updateStat = (index: number, field: keyof CardStat, value: string | number) => {
        const newStats = [...stats];
        if (field === "value") {
            newStats[index] = { ...newStats[index], value: Number(value) };
        } else {
            newStats[index] = { ...newStats[index], label: String(value) };
        }
        onStatsChange(newStats);
    };

    const updateBadge = (index: number, title: string) => {
        const newBadges = [...badges];
        newBadges[index] = { ...newBadges[index], title };
        onBadgesChange(newBadges);
    };

    return (
        <div className="space-y-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm overflow-y-auto max-h-[calc(100vh-140px)]">
            {/* Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E5A500"
                    strokeWidth="2"
                >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                <span className="font-space font-bold text-sm text-gray-900">
                    Card Editor
                </span>
                <span className="ml-auto text-[10px] font-space text-gray-400 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">
                    LIVE
                </span>
            </div>

            {/* Accent Color */}
            <Section title="Accent Color">
                <div className="flex gap-2">
                    {["#E5A500", "#d12559", "#2563EB", "#059669", "#7C3AED", "#DC2626"].map((color) => (
                        <button
                            key={color}
                            onClick={() => onAccentColorChange(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                                accentColor === color
                                    ? "border-gray-900 scale-110 shadow-md"
                                    : "border-gray-200 hover:border-gray-400"
                            }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </Section>

            {/* Identity */}
            <Section title="Identity">
                <Field
                    label="Player Name"
                    value={playerName}
                    onChange={onPlayerNameChange}
                    placeholder="Enter name"
                    maxLength={20}
                />
                <Field
                    label="Subtitle"
                    value={subtitle}
                    onChange={onSubtitleChange}
                    placeholder="Enter subtitle"
                    maxLength={30}
                />
                <Field
                    label="Position"
                    value={position}
                    onChange={onPositionChange}
                    placeholder="Enter position"
                    maxLength={10}
                />
            </Section>

            {/* Rating */}
            <Section title="Overall Rating">
                <SliderField
                    label="OVR"
                    value={rating}
                    onChange={onRatingChange}
                    min={0}
                    max={99}
                />
            </Section>

            {/* Stats */}
            <Section title="Stats">
                <div className="space-y-2">
                    {stats.map((stat, i) => (
                        <div key={i} className="space-y-1">
                            <input
                                type="text"
                                value={stat.label}
                                onChange={(e) =>
                                    updateStat(i, "label", e.target.value)
                                }
                                className="text-[10px] text-gray-500 font-space font-bold uppercase tracking-wider bg-transparent border-none outline-none w-full"
                                maxLength={20}
                            />
                            <SliderField
                                label={stat.label}
                                value={stat.value}
                                onChange={(v) => updateStat(i, "value", v)}
                            />
                        </div>
                    ))}
                </div>
            </Section>

            {/* Badges */}
            <Section title="Badges">
                <div className="space-y-2">
                    {badges.map((badge, i) => (
                        <Field
                            key={i}
                            label={`Badge ${i + 1}`}
                            value={badge.title}
                            onChange={(v) => updateBadge(i, v)}
                            maxLength={15}
                        />
                    ))}
                </div>
            </Section>

            {/* Description */}
            <Section title="Description">
                <Field
                    label="Description Line"
                    value={description}
                    onChange={onDescriptionChange}
                    placeholder="Skill • Charisma • Influence • Focus"
                    maxLength={60}
                />
            </Section>

            {/* Quotes */}
            <Section title="Quotes">
                <Field
                    label="French Quote"
                    value={quoteFr}
                    onChange={onQuoteFrChange}
                    placeholder="Born different, made legendary"
                    maxLength={50}
                />
                <Field
                    label="Arabic Quote"
                    value={quoteAr}
                    onChange={onQuoteArChange}
                    placeholder="أسطورة من تونس"
                    maxLength={50}
                />
            </Section>

            {/* Hashtags */}
            <Section title="Hashtags">
                <Field
                    label="Hashtags (space-separated)"
                    value={hashtags.join(" ")}
                    onChange={(v) =>
                        onHashtagsChange(
                            v
                                .split(/\s+/)
                                .filter(Boolean)
                        )
                    }
                    placeholder="TUNISIA LEGEND GOAT VIBES"
                    maxLength={80}
                />
            </Section>
        </div>
    );
}
