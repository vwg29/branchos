import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aura-os.app";
  
  const locales = ["en", "ar"];
  const pages = ["", "pricing", "about", "login", "register", "onboarding"];
  
  const urls = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page ? `/${page}` : ""}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page ? `/${page}` : ""}`,
          ar: `${baseUrl}/ar${page ? `/${page}` : ""}`,
        },
      },
    }))
  );

  return urls;
}