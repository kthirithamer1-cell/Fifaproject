import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

// ─── Dynamic OG Meta Tags ──────────────────────────────────────────────────
// When Facebook/Twitter/WhatsApp scrape this URL, they read the meta tags.
// og:image points to /api/og-image/[id] which serves the actual card image.
// This approach works because:
//   1. Facebook fetches this page → reads og:image URL
//   2. Facebook fetches /api/og-image/[id] → gets the PNG
//   3. Facebook shows the card image in the post preview

type Props = {
    params: Promise<{ id: string }>;
};

function cardExists(shareId: string): boolean {
    const sharedDir = path.join(process.cwd(), "public", "shared-cards");
    if (!fs.existsSync(sharedDir)) return false;

    const extensions = ["png", "jpg", "webp"];
    return extensions.some((ext) =>
        fs.existsSync(path.join(sharedDir, `${shareId}.${ext}`))
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    if (!cardExists(id)) {
        return { title: "Card Not Found - Flawless" };
    }

    // Dynamically detect host & protocol from request headers (works seamlessly with ngrok, Vercel, tunnels)
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const proto = headersList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`;

    // Point og:image to the dynamic API endpoint that serves the actual image
    const ogImageUrl = `${siteUrl}/api/og-image/${id}`;
    const sharePageUrl = `${siteUrl}/share/${id}`;

    return {
        title: "My Legendary Flawless Card ⚽🔥",
        description:
            "شوف الكارطة متاعي! أنت وصاحبك الأنتيم... أساطير في كارطة! مع Flawless — #1 Custom Meme Cards in Tunisia 🇹🇳",
        openGraph: {
            title: "My Legendary Flawless Card ⚽🔥",
            description:
                "شوف الكارطة متاعي! أنت وصاحبك الأنتيم... أساطير في كارطة! مع Flawless 🇹🇳",
            url: sharePageUrl,
            siteName: "Flawless",
            images: [
                {
                    url: ogImageUrl,
                    width: 700,
                    height: 1050,
                    alt: "My Legendary Flawless Card",
                    type: "image/png",
                },
            ],
            locale: "ar_TN",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "My Legendary Flawless Card ⚽🔥",
            description:
                "شوف الكارطة متاعي! أنت وصاحبك الأنتيم... أساطير في كارطة! مع Flawless 🇹🇳",
            images: [ogImageUrl],
        },
    };
}

// ─── Page Component ─────────────────────────────────────────────────────────
// Human visitors see the card + a CTA to make their own.
// Bot crawlers (Facebook, Twitter) only read the meta tags above.
export default async function SharePage({ params }: Props) {
    const { id } = await params;

    if (!cardExists(id)) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center">
            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/[0.05] rounded-full blur-[200px]" />
                <div className="absolute bottom-[-30%] left-[-10%] w-[50%] h-[50%] bg-[#F6D365]/[0.04] rounded-full blur-[200px]" />
            </div>

            <div className="relative z-10 max-w-md space-y-8">
                {/* Card Image — served via API for consistency */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-[0_12px_40px_rgba(212,175,55,0.25)]">
                    <img
                        src={`/api/og-image/${id}`}
                        alt="Legendary Flawless Card"
                        className="w-full h-auto"
                    />
                </div>

                {/* CTA */}
                <div className="space-y-4">
                    <h1 className="text-2xl font-black text-white">
                        صمّم كارطتك{" "}
                        <span className="bg-gradient-to-r from-[#E5A500] to-[#C98600] bg-clip-text text-transparent">
                            الأسطورية
                        </span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        أنت وصاحبك الأنتيم... أساطير في كارطة! مع Flawless 🇹🇳
                    </p>
                    <a
                        href="/generator"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E5A500] to-[#C98600] text-white font-bold rounded-2xl shadow-[0_4px_20px_rgba(229,165,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-lg"
                    >
                        + صمّم كارطتي
                    </a>
                </div>
            </div>
        </div>
    );
}
