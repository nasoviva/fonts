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
    path: "/collectors",
    title: t("collectorsPageTitle"),
    description: t("collectorsPageDescription"),
    ogTitle: t("collectorsPageTitle"),
    ogDescription: t("collectorsPageDescription"),
  });
}

export default async function CollectorsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "audience.collectors" });
  const tHero = await getTranslations({ locale, namespace: "hero" });
  console.log("[CollectorsPage] render", { locale });

  return (
    <AudienceDetailPageContent
      namespace="collectors"
      imageSrc={SITE_IMAGES.audienceCollectors}
      imageOnRight
      ctas={[
        { href: paths.contact, label: tHero("ctaContact"), variant: "solid" },
        { href: paths.gallery, label: t("cta"), variant: "outline" },
      ]}
    />
  );
}
