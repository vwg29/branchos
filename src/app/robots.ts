import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/login", "/register", "/onboarding"],
    },
    sitemap: "https://aura-os.app/sitemap.xml",
    host: "https://aura-os.app",
  };
}