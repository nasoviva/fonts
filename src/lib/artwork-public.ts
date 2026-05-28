import type { Artwork } from "@/data/artworks";

/** Те же работы, что в админ-таблице, но без скрытых (hidden). */
export function getPublicArtworks(all: Artwork[]): Artwork[] {
  return all.filter((a) => !a.hidden);
}
