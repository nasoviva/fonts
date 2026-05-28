import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getLocalized } from "@/data/artworks";
import {
  getAdjacentArtworks,
  getArtworkBySlug,
} from "@/lib/artwork-store";
import { ArtworkDetailClient } from "@/components/artwork/ArtworkDetailClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { loadTaxonomy } from "@/lib/taxonomy";
import { buildPageMetadata } from "@/lib/seo";
import { buildArtworkJsonLd } from "@/lib/seo-json-ld";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork || artwork.hidden) {
    return { title: "Not found" };
  }

  const t = await getTranslations({ locale, namespace: "meta" });
  const title = getLocalized(artwork.title, locale);
  const description = getLocalized(artwork.description, locale);
  const pageTitle = t("artworkTitle", { title });
  const pageDescription = t("artworkDescription", { description });

  return buildPageMetadata({
    locale,
    path: `/artwork/${slug}`,
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogImage: artwork.images[0],
    ogType: "article",
  });
}

export default async function ArtworkPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const artwork = await getArtworkBySlug(slug);
  if (!artwork || artwork.hidden) notFound();

  const { prev, next } = await getAdjacentArtworks(slug, locale);
  const title = getLocalized(artwork.title, locale);
  const taxonomy = await loadTaxonomy();
  const author = taxonomy.authors.find((a) => a.id === artwork.authorId);
  const category = taxonomy.categories.find((c) => c.id === artwork.categoryId);
  const authorName =
    author?.label[locale as Locale] ?? author?.label.en ?? artwork.authorId;
  const categoryLabel =
    category?.label[locale as Locale] ?? category?.label.en ?? artwork.categoryId;

  const artworkJsonLd = buildArtworkJsonLd(
    artwork,
    locale as Locale,
    authorName,
    categoryLabel,
  );

  return (
    <>
      <JsonLd data={artworkJsonLd} />
      <ArtworkDetailClient
        artwork={artwork}
        locale={locale}
        title={title}
        prevSlug={prev?.slug ?? null}
        nextSlug={next?.slug ?? null}
      />
    </>
  );
}
