"use client";

import { useTranslations } from "next-intl";
import { LocaleRouteLink } from "@/components/navigation/LocaleRouteLink";
import { paths } from "@/i18n/paths";
import { Section } from "@/components/ui/Section";
import { ImageCarousel } from "@/components/artwork/ImageCarousel";
import { ContactForm } from "@/components/forms/ContactForm";
import { useAuthorLabel, useCategoryLabel } from "@/contexts/TaxonomyContext";
import { getLocalized, type Artwork } from "@/data/artworks";

type ArtworkDetailClientProps = {
  artwork: Artwork;
  locale: string;
  title: string;
  prevSlug: string | null;
  nextSlug: string | null;
};

export function ArtworkDetailClient({
  artwork,
  locale,
  title,
  prevSlug,
  nextSlug,
}: ArtworkDetailClientProps) {
  const t = useTranslations("artwork");
  const tCta = useTranslations("artwork.cta");
  const categoryLabel = useCategoryLabel(artwork.categoryId, locale);
  const authorLabel = useAuthorLabel(artwork.authorId, locale);

  const description = getLocalized(artwork.description, locale);
  const defaultMessage = tCta("messagePlaceholder", { title });

  return (
    <>
      <Section tone="dark" spacing="compact" className="!pt-28 md:!pt-36">
        <LocaleRouteLink
          href={paths.gallery}
          className="text-meta-label mb-6 inline-block text-cream-faint hover:text-cream"
        >
          ← {t("back")}
        </LocaleRouteLink>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <ImageCarousel images={artwork.images} alt={title} />

          <div>
            <h1 className="text-display break-words text-3xl text-cream-bright md:text-4xl">
              {title}
            </h1>

            <dl className="mt-8 space-y-4">
              <div>
                <dt className="text-meta-label text-cream-faint">{t("category")}</dt>
                <dd className="text-body mt-1">{categoryLabel}</dd>
              </div>
              <div>
                <dt className="text-meta-label text-cream-faint">{t("author")}</dt>
                <dd className="text-body mt-1">{authorLabel}</dd>
              </div>
              <div>
                <dt className="text-meta-label text-cream-faint">
                  {t("description")}
                </dt>
                <dd className="text-body mt-1 break-words text-cream-dim">
                  {description}
                </dd>
              </div>
            </dl>

            <div className="mt-12 flex flex-wrap gap-4 border-t hairline-dark pt-8">
              {prevSlug && (
                <LocaleRouteLink
                  href={`/artwork/${prevSlug}`}
                  className="text-meta-label text-cream-dim hover:text-cream"
                >
                  ← {t("prev")}
                </LocaleRouteLink>
              )}
              {nextSlug && (
                <LocaleRouteLink
                  href={`/artwork/${nextSlug}`}
                  className="ml-auto text-meta-label text-cream-dim hover:text-cream"
                >
                  {t("next")} →
                </LocaleRouteLink>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light" spacing="compact">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-caption text-ink">{tCta("caption")}</p>
          <h2 className="text-subheader mt-2 uppercase text-ink">
            {tCta("title")}
          </h2>
          <p className="text-body mt-4 text-ink-dim">{tCta("description")}</p>
        </div>
        <div className="mt-8">
          <ContactForm tone="light" defaultMessage={defaultMessage} />
        </div>
      </Section>
    </>
  );
}
