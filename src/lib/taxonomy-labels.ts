import type { TaxonomyData, TaxonomyEntry } from "@/lib/taxonomy-types";

export function getTaxonomyLabel(
  entries: TaxonomyEntry[],
  id: string,
  locale: string,
): string {
  const entry = entries.find((e) => e.id === id);
  if (!entry) return id;
  return locale === "ru" ? entry.label.ru : entry.label.en;
}

export function getCategoryLabel(
  taxonomy: TaxonomyData,
  id: string,
  locale: string,
): string {
  return getTaxonomyLabel(taxonomy.categories, id, locale);
}

export function getAuthorLabel(
  taxonomy: TaxonomyData,
  id: string,
  locale: string,
): string {
  return getTaxonomyLabel(taxonomy.authors, id, locale);
}
