"use client";

import { useTranslations } from "next-intl";
import type { Artwork } from "@/data/artworks";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

type GalleryPageClientProps = {
  initialArtworks: Artwork[];
};

export function GalleryPageClient({ initialArtworks }: GalleryPageClientProps) {
  const t = useTranslations("gallery");

  return (
    <Section tone="dark" spacing="compact" className="!pt-28 md:!pt-36">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <GalleryGrid initialArtworks={initialArtworks} />
      <ScrollToTop label={t("scrollTop")} />
    </Section>
  );
}
