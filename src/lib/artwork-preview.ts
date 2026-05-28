import type { Artwork } from "@/data/artworks";
import { getLocalized } from "@/data/artworks";
import { getPublicArtworks } from "@/lib/artwork-public";

/** Порядок по умолчанию в админ-таблице: название A→Z. */
export function sortArtworksByTitle(
  artworks: Artwork[],
  locale: string,
): Artwork[] {
  return [...artworks].sort((a, b) =>
    getLocalized(a.title, locale).localeCompare(
      getLocalized(b.title, locale),
      locale,
      { sensitivity: "base" },
    ),
  );
}

/**
 * Избранные для главной (до N): только `featuredOnHome`, без скрытых,
 * порядок по названию как в админ-таблице.
 */
export function getPortfolioPreviewArtworks(
  artworks: Artwork[],
  locale: string,
  limit = 4,
): Artwork[] {
  const sorted = sortArtworksByTitle(artworks, locale);
  const visible = getPublicArtworks(sorted);
  const preview = visible.filter((a) => a.featuredOnHome).slice(0, limit);
  console.log("[PortfolioPreview] pick featured", {
    locale,
    featured: preview.map((a) => a.id),
  });
  return preview;
}
