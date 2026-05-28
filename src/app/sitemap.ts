import type { MetadataRoute } from "next";
import { getVisibleArtworks } from "@/lib/artwork-store";
import { routing } from "@/i18n/routing";
import { absoluteUrl, localizedPath } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const visibleArtworks = await getVisibleArtworks();

  const staticPaths = ["", "/gallery"] as const;

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, path)),
        lastModified,
        changeFrequency: path === "" ? "weekly" : "daily",
        priority: path === "" ? (locale === routing.defaultLocale ? 1 : 0.9) : 0.85,
      });
    }
  }

  for (const artwork of visibleArtworks) {
    for (const locale of routing.locales) {
      entries.push({
        url: absoluteUrl(localizedPath(locale, `/artwork/${artwork.slug}`)),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
