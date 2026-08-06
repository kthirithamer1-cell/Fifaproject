"use client";

import React from "react";
import { STATIC_BACKGROUNDS } from "@/app/constant";

interface BackgroundPickerProps {
    selectedBgUrl: string | null;
    onSelect: (url: string) => void;
    onGenerateAI: () => void;
    isGeneratingBg: boolean;
}

export default function BackgroundPicker({
    selectedBgUrl,
    onSelect,
    onGenerateAI,
    isGeneratingBg,
}: BackgroundPickerProps) {
    return (
        <div className="space-y-4">
            <div className="text-sm font-semibold text-gray-700 font-space">
                Choose Background
            </div>

            {/* 10 PVC Card Models grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {STATIC_BACKGROUNDS.map((bg) => {
                    const isSelected = selectedBgUrl === bg.url;
                    return (
                        <button
                            key={bg.id}
                            type="button"
                            onClick={() => onSelect(bg.url)}
                            className={`relative group aspect-[2/3] rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                                isSelected
                                    ? "border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.35)] scale-[1.02]"
                                    : "border-gray-200 hover:border-[#D4AF37]/50"
                            }`}
                        >
                            <img
                                src={bg.thumbnail}
                                alt={bg.label}
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Label */}
                            <div className="absolute bottom-2 left-2 right-2 text-left">
                                <span className="text-white font-space text-xs font-bold drop-shadow-sm block truncate">
                                    {bg.label}
                                </span>
                            </div>

                            {/* Selected indicator */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center">
                                    <svg
                                        width={12}
                                        height={12}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="3"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 font-space text-xs">or</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* AI Generate Button */}
            <button
                onClick={onGenerateAI}
                disabled={isGeneratingBg}
                className={`w-full group relative py-3.5 px-6 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                    isGeneratingBg
                        ? "border-[#D4AF37]/50 bg-[#D4AF37]/5 opacity-70 pointer-events-none"
                        : "border-[#D4AF37]/30 bg-[#D4AF37]/5 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
                }`}
            >
                <div className="flex items-center justify-center gap-3">
                    {isGeneratingBg ? (
                        <>
                            <svg
                                className="w-5 h-5 text-[#D4AF37] animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray="31.4 31.4"
                                    strokeDashoffset="10"
                                />
                            </svg>
                            <span className="text-[#C89B3C] font-space text-sm font-semibold">
                                Generating with AI...
                            </span>
                        </>
                    ) : (
                        <>
                            <svg
                                width={20}
                                height={20}
                                viewBox="0 0 24 24"
                                fill="none"
                                className="text-[#D4AF37]"
                            >
                                <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                    fill="currentColor"
                                    fillOpacity="0.15"
                                />
                            </svg>
                            <span className="text-[#C89B3C] font-space text-sm font-semibold">
                                Generate AI Background
                            </span>
                        </>
                    )}
                </div>
            </button>
        </div>
    );
}
