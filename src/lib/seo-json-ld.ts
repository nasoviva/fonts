import { getSiteUrl, localizedPath, absoluteUrl } from "@/lib/seo";
import { SITE_IMAGES } from "@/data/site-images";
import type { Artwork } from "@/data/artworks";
import { getLocalized } from "@/data/artworks";
import type { Locale } from "@/i18n/routing";

type SiteJsonLdInput = {
  locale: Locale;
  siteName: string;
  personName: string;
  jobTitle: string;
  description: string;
  email: string;
};

export function buildSiteJsonLd(input: SiteJsonLdInput) {
  const base = getSiteUrl();
  const homeUrl = `${base}${localizedPath(input.locale)}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${homeUrl}#website`,
      url: homeUrl,
      name: input.siteName,
      description: input.description,
      inLanguage: input.locale === "ru" ? "ru-RU" : "en-US",
      publisher: { "@id": `${homeUrl}#person` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${homeUrl}#person`,
      name: input.personName,
      jobTitle: input.jobTitle,
      description: input.description,
      image: absoluteUrl(SITE_IMAGES.producerPortrait),
      email: input.email,
      url: homeUrl,
      knowsAbout: [
        "art production",
        "artist representation",
        "art curation",
        "art acquisition",
        "contemporary art",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${homeUrl}#service`,
      name: input.siteName,
      description: input.description,
      url: homeUrl,
      image: absoluteUrl(SITE_IMAGES.producerPortrait),
      provider: { "@id": `${homeUrl}#person` },
      areaServed: "Worldwide",
      serviceType: [
        "Artist representation",
        "Art curation",
        "Exhibition production",
        "Art acquisition for collectors",
      ],
    },
  ];
}

export function buildArtworkJsonLd(
  artwork: Artwork,
  locale: Locale,
  authorName: string,
  categoryLabel: string,
) {
  const pageUrl = absoluteUrl(localizedPath(locale, `/artwork/${artwork.slug}`));
  const title = getLocalized(artwork.title, locale);
  const description = getLocalized(artwork.description, locale);
  const image = artwork.images[0];

  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "@id": `${pageUrl}#artwork`,
    name: title,
    description,
    url: pageUrl,
    image,
    artMedium: categoryLabel,
    creator: {
      "@type": "Person",
      name: authorName,
    },
    provider: {
      "@type": "ProfessionalService",
      name: "Zhanna Kolesnik",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: pageUrl,
      seller: {
        "@type": "Person",
        name: "Zhanna Kolesnik",
      },
    },
  };
}
