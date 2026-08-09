import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable or fallback to production URL / localhost
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BASE_URL ||
    "https://beflawless.art";

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/generator`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // If you add more public pages in the future (e.g. /about, /faq, /cards), list them here:
  ];
}
