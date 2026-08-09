import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.BASE_URL ||
        "https://beflawless.art";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // Disallow crawling internal API routes and private endpoints
                disallow: ["/api/", "/admin/"],
            },
        ],
        // Points search engine crawlers directly to your sitemap
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
