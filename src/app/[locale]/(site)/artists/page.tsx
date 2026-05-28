import type { Metadata } from "next";
import { AudienceDetailPageContent } from "@/components/sections/AudienceDetailPageContent";
import { SITE_IMAGES } from "@/data/site-images";
import { paths } from "@/i18n/paths";
import { buildPageMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return buildPageMetadata({
    locale,
    path: "/artists",
    title: t("artistsPageTitle"),
    description: t("artistsPageDescription"),
    ogTitle: t("artistsPageTitle"),
    ogDescription: t("artistsPageDescription"),
  });
}

export default async function ArtistsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "audience.artists" });
  console.log("[ArtistsPage] render", { locale });

  return (
    <AudienceDetailPageContent
      namespace="artists"
      imageSrc={SITE_IMAGES.audienceArtists}
      imageOnRight={false}
      ctas={[{ href: paths.contact, label: t("cta"), variant: "solid" }]}
    />
  );
}
