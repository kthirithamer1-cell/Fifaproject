"use client";

import React, { forwardRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────

export interface CardStat {
    label: string;
    value: number;
}

export interface CardBadge {
    title: string;
}

export interface CardComposerProps {
    baseImageUrl: string;
    userPhotoUrl?: string | null;
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
    className?: string;
}

// ─── SVG Icons (inline for portability) ────────────────────────────────────

const CrownIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: "auto", fill: "#24115d" }}>
        <path d="M2 4l3 12h14l3-12-5 4-4-6-4 6-5-4zM5 18h14v2H5v-2z" />
    </svg>
);

const HeartIcon = ({ size = 24, stroke = "currentColor", fill = "none" }: { size?: number; stroke?: string; fill?: string }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} stroke={stroke} strokeWidth="2" fill={fill}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const DiamondIcon = () => (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3h12l4 6-10 12L2 9z" />
        <path d="M11 3 8 9l4 12 4-12-3-6" />
        <path d="M2 9h20" />
    </svg>
);

const StarIcon = () => (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const TargetIcon = () => (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

const BoltIcon = () => (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const STAT_ICONS = [DiamondIcon, StarIcon, InstagramIcon, TargetIcon, BoltIcon, HeartIcon];

// ─── Tunisian Flag SVG ─────────────────────────────────────────────────────

const TunisianFlag = () => (
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <rect width="60" height="40" fill="#c1004f" rx="3" />
        <circle cx="30" cy="20" r="10" fill="white" />
        <path d="M28 14.5 A 5.5 5.5 0 1 0 28 25.5 A 4.5 4.5 0 1 1 29.5 23.5 A 5.5 5.5 0 0 0 28 14.5 Z" fill="#c1004f" />
        <polygon points="33.5,15.5 34.7,18.6 38.0,18.6 35.3,20.6 36.4,23.9 33.5,21.8 30.6,23.9 31.7,20.6 29.0,18.6 32.3,18.6" fill="#c1004f" />
    </svg>
);

// ─── Badge Icons ────────────────────────────────────────────────────────────

const FistIcon = () => (
    <svg viewBox="0 0 64 64" fill="currentColor" width={28} height={28}>
        <path d="M48,22h-6v-6c0-2.2-1.8-4-4-4s-4,1.8-4,4v6h-4v-8c0-2.2-1.8-4-4-4s-4,1.8-4,4v8h-4v-6c0-2.2-1.8-4-4-4s-4,1.8-4,4v18.7c-2.2,0.8-3.7,2.9-3.7,5.3v5c0,3.3,2.7,6,6,6h20.3c5.3,0,9.7-4.3,9.7-9.7v-13.3c0-2.2-1.8-4-4-4S48,19.8,48,22z" />
    </svg>
);

const RocketIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={28} height={28}>
        <path d="M12 2.2c-.4 0-.8.2-1.1.5L6.5 7.1C5.7 7.9 5.2 9 5.2 10.1v3.2c0 .6.2 1.2.6 1.7L4 18.8c-.3.4-.2 1 .2 1.3.2.1.4.2.6.2.3 0 .5-.1.7-.3l3.8-3.8c.5.4 1.1.6 1.7.6h3.2c1.1 0 2.2-.5 3-1.3l4.4-4.4c.3-.3.5-.7.5-1.1V6.2C22 4 19.8 2.2 12 2.2zm4 7.8c-.8 0-1.5-.7-1.5-1.5S15.2 7 16 7s1.5.7 1.5 1.5S16.8 10 16 10z" />
    </svg>
);

const BrainIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={28} height={28}>
        <path d="M12 5.5c-.3-1.2-1.4-2-2.7-2-1.8 0-3.3 1.5-3.3 3.3 0 .7.2 1.4.6 2C4.3 9.4 3 11.5 3 14c0 2.8 2.2 5 5 5 .7 0 1.4-.2 2-.5.5.9 1.4 1.5 2.5 1.5s2-.6 2.5-1.5c.6.3 1.3.5 2 .5 2.8 0 5-2.2 5-5 0-2.5-1.3-4.6-3.6-5.2.4-.6.6-1.3.6-2 0-1.8-1.5-3.3-3.3-3.3-1.3 0-2.4.8-2.7 2z" />
    </svg>
);

const BADGE_ICONS = [FistIcon, RocketIcon, BrainIcon];

// ─── Component ──────────────────────────────────────────────────────────────

const CardComposer = forwardRef<HTMLDivElement, CardComposerProps>(
    (
        {
            baseImageUrl,
            userPhotoUrl,
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
            accentColor = "#D4AF37",
            className = "",
        },
        ref
    ) => {
        return (
            <>
                {/* Google Fonts for card typography */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;500;700;800;900&family=Caveat:wght@400;700&family=Caveat+Brush&family=Dancing+Script:wght@700&family=Satisfy&family=Kaushan+Script&family=Tajawal:wght@700&display=swap"
                    rel="stylesheet"
                />

                <div
                    ref={ref}
                    className={className}
                    style={{
                        position: "relative",
                        width: 700,
                        height: 1050,
                        filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.35))",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                            backgroundImage: `url(${baseImageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            overflow: "hidden",
                        borderRadius: "24px",
                        fontFamily: "'Montserrat', sans-serif",
                        }}
                    >
                    {/* USER PHOTO PORTRAIT OVERLAY */}
                 
                    {/* CROWN */}
                    <div style={{ position: "absolute", top: "5.2%", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
                        <CrownIcon />
                    </div>

                    {/* TOP PLAYER NAME */}
                    <h1
                        style={{
                            position: "absolute",
                            top: "7.2%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 82,
                            fontWeight: "bold",
                            color: accentColor,
                            letterSpacing: 2,
                            textAlign: "center",
                            zIndex: 10,
                            lineHeight: 1,
                            margin: 0,
                            padding: 0,
                            whiteSpace: "nowrap",
                        }}
                    >
                        {playerName}
                    </h1>

                    {/* TOP SUBTITLE */}
                    <div
                        style={{
                            position: "absolute",
                            top: "15.2%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontFamily: "'Satisfy', 'Dancing Script', cursive",
                            fontSize: 34,
                            color: "#24115d",
                            fontWeight: 700,
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            zIndex: 10,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {subtitle}
                        <HeartIcon size={24} stroke={accentColor} />
                    </div>

                    {/* LEFT COLUMN */}
                    <div
                        style={{
                            position: "absolute",
                            top: "18.5%",
                            left: "11.5%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            zIndex: 10,
                            width: 130,
                        }}
                    >
                        {/* Rating */}
                        <div
                            style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: 115,
                                fontWeight: 900,
                                color: "#24115d",
                                lineHeight: 0.85,
                                textAlign: "center",
                            }}
                        >
                            {rating}
                        </div>

                        {/* Position */}
                        <div
                            style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: 32,
                                color: accentColor,
                                letterSpacing: 1.5,
                                textAlign: "center",
                                marginTop: 2,
                            }}
                        >
                            {position}
                        </div>

                        {/* Flag */}
                        <div
                            style={{
                                marginTop: 15,
                                width: 76,
                                height: 50,
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                                borderRadius: 4,
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <TunisianFlag />
                        </div>

                        {/* Made in Tunisia */}
                        <div
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 900,
                                fontSize: 11,
                                color: "#24115d",
                                textAlign: "center",
                                marginTop: 12,
                                letterSpacing: 0.5,
                                whiteSpace: "nowrap",
                            }}
                        >
                            MADE IN TUNISIA
                        </div>

                        {/* Instagramable */}
                        <div
                            style={{
                                fontFamily: "'Satisfy', 'Dancing Script', cursive",
                                fontSize: 24,
                                color: "#24115d",
                                textAlign: "center",
                                marginTop: 8,
                                whiteSpace: "nowrap",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                lineHeight: 1.1,
                            }}
                        >
                            Instagramable
                            <svg viewBox="0 0 24 24" fill="none" stroke="#24115d" strokeWidth="2" width={16} height={16} style={{ marginTop: 2 }}>
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                    </div>

                    {/* RIGHT BADGES */}
                    <div
                        style={{
                            position: "absolute",
                            top: "41.5%",
                            right: "11.5%",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            zIndex: 10,
                        }}
                    >
                        {badges.slice(0, 3).map((badge, i) => {
                            const BadgeIcon = BADGE_ICONS[i % BADGE_ICONS.length];
                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: 96,
                                        height: 84,
                                        background: "rgba(255, 255, 255, 0.88)",
                                        border: `2px solid ${accentColor}33`,
                                        borderRadius: 12,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 6,
                                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "'Bebas Neue', sans-serif",
                                            fontSize: 11,
                                            color: accentColor,
                                            letterSpacing: 0.5,
                                            marginBottom: 4,
                                            textAlign: "center",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {badge.title}
                                    </span>
                                    <span style={{ color: accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <BadgeIcon />
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* BOTTOM MIDDLE */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "20%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            zIndex: 10,
                        }}
                    >
                        {/* Brush Name */}
                        <div
                            style={{
                                fontFamily: "'Caveat Brush', 'Kaushan Script', cursive",
                                fontSize: 88,
                                fontWeight: 700,
                                color: "#ffffff",
                                lineHeight: 0.8,
                                textShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            {playerName}
                            <HeartIcon size={32} stroke={accentColor} />
                        </div>

                        {/* Description */}
                        <div
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 700,
                                fontSize: 15,
                                color: "#ffffff",
                                marginTop: 8,
                                letterSpacing: 0.5,
                                whiteSpace: "nowrap",
                                opacity: 0.95,
                            }}
                        >
                            {description}
                        </div>

                        {/* Hashtags */}
                        <div
                            style={{
                                marginTop: 12,
                                background: "rgba(255, 255, 255, 0.85)",
                                padding: "5px 18px",
                                borderRadius: 20,
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontWeight: 900,
                                    fontSize: 11,
                                    color: "#24115d",
                                    letterSpacing: 0.5,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")}
                            </span>
                        </div>
                    </div>

                    {/* STATS SECTION */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "9%",
                            left: "8%",
                            width: "84%",
                            display: "flex",
                            justifyContent: "space-between",
                            zIndex: 10,
                        }}
                    >
                        {stats.slice(0, 6).map((stat, i) => {
                            const StatIcon = STAT_ICONS[i % STAT_ICONS.length];
                            const isLast = i === Math.min(stats.length, 6) - 1;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        position: "relative",
                                    }}
                                >
                                    {/* Stat circle */}
                                    <div
                                        style={{
                                            width: 46,
                                            height: 46,
                                            borderRadius: "50%",
                                            border: `2px solid ${accentColor}`,
                                            background: "rgba(36, 17, 93, 0.4)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#ffffff",
                                            marginBottom: 6,
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                                        }}
                                    >
                                        <StatIcon />
                                    </div>

                                    {/* Label */}
                                    <div
                                        style={{
                                            fontFamily: "'Montserrat', sans-serif",
                                            fontWeight: 700,
                                            fontSize: 9.5,
                                            color: "#ffffff",
                                            textAlign: "center",
                                            marginBottom: 2,
                                            whiteSpace: "nowrap",
                                            opacity: 0.9,
                                        }}
                                    >
                                        {stat.label}
                                    </div>

                                    {/* Value */}
                                    <div
                                        style={{
                                            fontFamily: "'Bebas Neue', sans-serif",
                                            fontSize: 24,
                                            fontWeight: "bold",
                                            color: "#ffffff",
                                            textAlign: "center",
                                            lineHeight: 1,
                                        }}
                                    >
                                        {stat.value}
                                    </div>

                                    {/* Divider */}
                                    {!isLast && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                right: 0,
                                                top: "15%",
                                                height: "70%",
                                                width: 1,
                                                background: "rgba(255, 255, 255, 0.25)",
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* BOTTOM QUOTES */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "2.2%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 3,
                            zIndex: 10,
                        }}
                    >
                        {/* French quote */}
                        <div
                            style={{
                                fontFamily: "'Satisfy', 'Dancing Script', cursive",
                                fontSize: 23,
                                color: accentColor,
                                fontWeight: 700,
                                textAlign: "center",
                                whiteSpace: "nowrap",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            &quot;{quoteFr}&quot;
                            <HeartIcon size={14} stroke={accentColor} fill={accentColor} />
                            <HeartIcon size={14} stroke={accentColor} fill={accentColor} />
                        </div>

                        {/* Arabic quote */}
                        <div
                            style={{
                                fontFamily: "'Tajawal', sans-serif",
                                fontSize: 19,
                                fontWeight: 700,
                                color: accentColor,
                                textAlign: "center",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {quoteAr}
                        </div>
                    </div>
                </PvcCardFrame>
            </>
    );
    }
);

CardComposer.displayName = "CardComposer";

export default CardComposer;
