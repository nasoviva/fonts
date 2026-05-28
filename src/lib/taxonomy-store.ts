import { readJsonStore, writeJsonStore } from "@/lib/json-persistence";
import type { TaxonomyData, TaxonomyEntry } from "@/lib/taxonomy-types";
import { findTaxonomyIssue } from "@/lib/taxonomy-validate";
import { slugifyId } from "@/lib/slugify";

export { slugifyId };

const DEFAULT_TAXONOMY: TaxonomyData = {
  categories: [
    { id: "painting", label: { en: "Painting", ru: "Живопись" } },
    { id: "sculpture", label: { en: "Sculpture", ru: "Скульптура" } },
    { id: "photography", label: { en: "Photography", ru: "Фотография" } },
    { id: "mixed-media", label: { en: "Mixed media", ru: "Смешанная техника" } },
    { id: "digital", label: { en: "Digital art", ru: "Цифровое искусство" } },
  ],
  authors: [
    { id: "ivan-petrov", label: { en: "Ivan Petrov", ru: "Иван Петров" } },
    { id: "maria-sokolova", label: { en: "Maria Sokolova", ru: "Мария Соколова" } },
    { id: "elena-kuznetsova", label: { en: "Elena Kuznetsova", ru: "Елена Кузнецова" } },
    { id: "dmitry-orlov", label: { en: "Dmitry Orlov", ru: "Дмитрий Орлов" } },
    { id: "anna-volkova", label: { en: "Anna Volkova", ru: "Анна Волкова" } },
  ],
};

function normalizeEntry(entry: TaxonomyEntry): TaxonomyEntry {
  return {
    id: entry.id.trim(),
    label: {
      en: entry.label.en.trim(),
      ru: entry.label.ru.trim(),
    },
  };
}

function validateTaxonomy(data: TaxonomyData) {
  return findTaxonomyIssue(data);
}

export async function readTaxonomy(): Promise<TaxonomyData> {
  try {
    const raw = await readJsonStore("taxonomy");
    if (raw === null) {
      await writeTaxonomy(DEFAULT_TAXONOMY);
      return DEFAULT_TAXONOMY;
    }
    const parsed = JSON.parse(raw) as TaxonomyData;
    const issue = validateTaxonomy(parsed);
    if (issue) {
      console.log("[Taxonomy] invalid file, using defaults", issue);
      return DEFAULT_TAXONOMY;
    }
    return parsed;
  } catch {
    await writeTaxonomy(DEFAULT_TAXONOMY);
    return DEFAULT_TAXONOMY;
  }
}

export async function writeTaxonomy(data: TaxonomyData): Promise<void> {
  const normalized: TaxonomyData = {
    categories: data.categories.map(normalizeEntry),
    authors: data.authors.map(normalizeEntry),
  };
  const issue = validateTaxonomy(normalized);
  if (issue) throw new Error(JSON.stringify(issue));

  await writeJsonStore("taxonomy", JSON.stringify(normalized, null, 2));
  console.log("[Taxonomy] saved", {
    categories: normalized.categories.length,
    authors: normalized.authors.length,
  });
}
