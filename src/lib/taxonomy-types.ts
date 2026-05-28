import type { LocalizedText } from "@/data/artworks";

export type TaxonomyEntry = {
  id: string;
  label: LocalizedText;
  /** Стабильный ключ для React (не сохраняется в taxonomy.json) */
  clientKey?: string;
};

export type TaxonomyData = {
  categories: TaxonomyEntry[];
  authors: TaxonomyEntry[];
};
