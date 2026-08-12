import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable or fallback to production URL / localhost
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BASE_URL ||
    "https://beflawless.art";

  const cardSlugs = ["karim-gharbi", "youssef", "kader", "sousou", "dellai"];
  const cardUrls: MetadataRoute.Sitemap = cardSlugs.map((slug) => ({
    url: `${baseUrl}/cards/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: slug === "karim-gharbi" ? 0.9 : 0.8,
  }));

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
    {
      url: `${baseUrl}/cards`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...cardUrls,
  ];
}
