import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const adminDisallow = routing.locales.flatMap((locale) => [
    `/${locale}/admin`,
    `/${locale}/admin/`,
  ]);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...adminDisallow],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
