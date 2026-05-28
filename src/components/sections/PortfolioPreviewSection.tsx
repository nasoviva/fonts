"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArtworkCard } from "@/components/gallery/ArtworkCard";
import type { Artwork } from "@/data/artworks";
import { useArtworksData } from "@/hooks/useArtworksData";
import { getPortfolioPreviewArtworks } from "@/lib/artwork-preview";
import { PRIORITY_ARTWORK_COUNT_HOME } from "@/lib/image-loading";
import { paths } from "@/i18n/paths";

type PortfolioPreviewSectionProps = {
  /** Все видимые работы с сервера (для синхронизации с API). */
  initialArtworks: Artwork[];
  /** Первые 4 с сервера (порядок как в админ-таблице). */
  initialPreview: Artwork[];
};

export function PortfolioPreviewSection({
  initialArtworks,
  initialPreview,
}: PortfolioPreviewSectionProps) {
  const t = useTranslations("portfolio");
  const locale = useLocale();
  const { artworks } = useArtworksData({ initialArtworks });

  const preview = useMemo(() => {
    if (artworks) return getPortfolioPreviewArtworks(artworks, locale, 4);
    return initialPreview;
  }, [artworks, initialPreview, locale]);

  return (
    <Section tone="dark" spacing="compact">
      <SectionHeading
        caption={t("caption")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {preview.length > 0 && (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((artwork, index) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              locale={locale}
              className="h-full"
              priority={index < PRIORITY_ARTWORK_COUNT_HOME}
            />
          ))}
        </div>
      )}

      <div
        className={
          preview.length > 0
            ? "mt-10 flex justify-center md:mt-12"
            : "mt-8 flex justify-center"
        }
      >
        <Button href={paths.gallery} variant="solid">
          {t("cta")}
        </Button>
      </div>
    </Section>
  );
}
