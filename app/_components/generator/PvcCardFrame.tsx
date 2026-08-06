"use client";

import React from "react";

// ─── SVG PVC Card Frame Overlay ───
// Shape precisely traced from reference image (save.png):
// - Arched top header with central crown double-notch (M-shape)
// - Straight-ish vertical sides with a very gentle concave curve
// - NO protruding "wing ears" on the sides
// - Smooth pointed shield apex at bottom
// - Rounded corners throughout

// viewBox: 0 0 700 1050
export const PVC_CARD_SHAPE_PATH = `
  M 350,28
  C 332,44 318,58 290,58
  C 262,58 248,44 210,44
  C 140,44 80,68 62,110
  L 42,110
  C 32,110 25,120 25,132
  L 25,800
  C 25,810 30,818 38,822
  C 52,920 168,985 350,1025
  C 532,985 648,920 662,822
  C 670,818 675,810 675,800
  L 675,132
  C 675,120 668,110 658,110
  L 638,110
  C 620,68 560,44 490,44
  C 452,44 438,58 410,58
  C 382,58 368,44 350,28
  Z
`;

// Inner gold border line path (offset ~14px inward)
export const PVC_CARD_INNER_PATH = `
  M 350,44
  C 334,58 322,70 296,70
  C 270,70 256,56 220,56
  C 154,56 96,78 78,118
  L 58,118
  C 50,118 42,126 42,136
  L 42,792
  C 42,800 46,808 52,812
  C 66,906 178,968 350,1006
  C 522,968 634,906 648,812
  C 654,808 658,800 658,792
  L 658,136
  C 658,126 650,118 642,118
  L 622,118
  C 604,78 546,56 480,56
  C 444,56 430,70 404,70
  C 378,70 366,58 350,44
  Z
`;

interface PvcCardFrameProps {
    strokeColor?: string;
    children?: React.ReactNode;
    className?: string;
}

const PvcCardFrame = React.forwardRef<HTMLDivElement, PvcCardFrameProps>(
    (
        {
            strokeColor = "#D4AF37",
            children,
            className = "",
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={`relative overflow-hidden ${className}`}
                style={{
                    width: 700,
                    height: 1050,
                    filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.45))",
                }}
            >
            {/* SVG Clip Path Definition */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="pvcCardClipPath" clipPathUnits="userSpaceOnUse">
                        <path d={PVC_CARD_SHAPE_PATH} />
                    </clipPath>
                </defs>
            </svg>

            {/* Clipped Card Container */}
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    clipPath: "url(#pvcCardClipPath)",
                    WebkitClipPath: "url(#pvcCardClipPath)",
                    position: "relative",
                }}
            >
                {children}
            </div>

            {/* 3D Metallic Gold Frame SVG Overlay */}
            <svg
                viewBox="0 0 700 1050"
                width="700"
                height="1050"
                className="absolute inset-0 pointer-events-none z-30"
            >
                <defs>
                    {/* Metallic Gold Gradient */}
                    <linearGradient id="pvcGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFEAA7" />
                        <stop offset="25%" stopColor={strokeColor} />
                        <stop offset="50%" stopColor="#FFF3A1" />
                        <stop offset="75%" stopColor="#997700" />
                        <stop offset="100%" stopColor="#FFEAA7" />
                    </linearGradient>

                    {/* Dark Gold Shadow for inner line */}
                    <linearGradient id="pvcGoldShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFEAA7" />
                        <stop offset="50%" stopColor={strokeColor} />
                        <stop offset="100%" stopColor="#3D2B00" />
                    </linearGradient>

                    {/* Glossy highlight gradient for top edge */}
                    <linearGradient id="pvcGlossHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Outer Bevel Frame Line (thick gold border) */}
                <path
                    d={PVC_CARD_SHAPE_PATH}
                    fill="none"
                    stroke="url(#pvcGoldGrad)"
                    strokeWidth="12"
                    strokeLinejoin="round"
                />

                {/* Outer dark edge line (thin black contour) */}
                <path
                    d={PVC_CARD_SHAPE_PATH}
                    fill="none"
                    stroke="#1A1200"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />

                {/* Inner Double Gold Inline Accent Line */}
                <path
                    d={PVC_CARD_INNER_PATH}
                    fill="none"
                    stroke="url(#pvcGoldShadow)"
                    strokeWidth="3.5"
                    strokeDasharray="none"
                    opacity="0.9"
                />

                {/* Top Crown Notch Decorative Highlight */}
                <path
                    d="M 296,70 C 322,70 334,58 350,44 C 366,58 378,70 404,70"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    opacity="0.7"
                />

                {/* Top arch gloss highlight */}
                <path
                    d="M 220,56 C 256,56 270,70 296,70"
                    fill="none"
                    stroke="url(#pvcGlossHighlight)"
                    strokeWidth="2"
                />
                <path
                    d="M 404,70 C 430,70 444,56 480,56"
                    fill="none"
                    stroke="url(#pvcGlossHighlight)"
                    strokeWidth="2"
                />
            </svg>
        </div>
    );
});

PvcCardFrame.displayName = "PvcCardFrame";

export default PvcCardFrame;
