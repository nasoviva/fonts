import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GalleryPageClient } from "@/components/gallery/GalleryPageClient";
import { getVisibleArtworks } from "@/lib/artwork-store";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const keywords = t("galleryKeywords")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return buildPageMetadata({
    locale,
    path: "/gallery",
    title: t("galleryTitle"),
    description: t("galleryDescription"),
    keywords,
    ogTitle: t("galleryTitle"),
    ogDescription: t("galleryDescription"),
  });
}

export default async function GalleryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const initialArtworks = await getVisibleArtworks();
  console.log("[GalleryPage] server load", { count: initialArtworks.length });
  return <GalleryPageClient initialArtworks={initialArtworks} />;
}
