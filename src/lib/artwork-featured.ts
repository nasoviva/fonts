import type { Artwork } from "@/data/artworks";

export const MAX_HOME_FEATURED = 4;

export function countHomeFeatured(artworks: Artwork[]): number {
  return artworks.filter((a) => a.featuredOnHome && !a.hidden).length;
}
