import type { TaxonomyData, TaxonomyEntry } from "@/lib/taxonomy-types";

export type TaxonomyListKind = "categories" | "authors";

export type TaxonomyValidationIssue = {
  kind: TaxonomyListKind;
  index: number;
  field: "id" | "labelEn" | "labelRu";
  code:
    | "invalid_id"
    | "placeholder_id"
    | "duplicate_id"
    | "empty_label_en"
    | "empty_label_ru";
  id: string;
};

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isPlaceholderId(id: string, kind: TaxonomyListKind): boolean {
  return kind === "categories"
    ? id.startsWith("new-category")
    : id.startsWith("new-author");
}

function validateList(
  items: TaxonomyEntry[],
  kind: TaxonomyListKind,
): TaxonomyValidationIssue | null {
  const ids = new Map<string, number>();

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const id = item.id.trim();
    const en = item.label.en.trim();
    const ru = item.label.ru.trim();

    if (!id) {
      return { kind, index, field: "id", code: "invalid_id", id: "—" };
    }

    if (isPlaceholderId(id, kind)) {
      return { kind, index, field: "id", code: "placeholder_id", id };
    }

    if (!ID_PATTERN.test(id)) {
      return { kind, index, field: "id", code: "invalid_id", id };
    }

    if (ids.has(id)) {
      return { kind, index, field: "id", code: "duplicate_id", id };
    }
    ids.set(id, index);

    if (!en) {
      return { kind, index, field: "labelEn", code: "empty_label_en", id };
    }

    if (!ru) {
      return { kind, index, field: "labelRu", code: "empty_label_ru", id };
    }
  }

  return null;
}

/** Первая найденная ошибка (для API и краткого сообщения). */
export function findTaxonomyIssue(
  data: TaxonomyData,
): TaxonomyValidationIssue | null {
  return (
    validateList(data.categories, "categories") ??
    validateList(data.authors, "authors")
  );
}

/** Все ошибки (для подсветки нескольких полей). */
export function findAllTaxonomyIssues(
  data: TaxonomyData,
): TaxonomyValidationIssue[] {
  const issues: TaxonomyValidationIssue[] = [];

  const collect = (items: TaxonomyEntry[], kind: TaxonomyListKind) => {
    const seen = new Set<string>();
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const id = item.id.trim();
      const en = item.label.en.trim();
      const ru = item.label.ru.trim();

      if (!id || !ID_PATTERN.test(id) || isPlaceholderId(id, kind)) {
        issues.push({
          kind,
          index,
          field: "id",
          code: !id
            ? "invalid_id"
            : isPlaceholderId(id, kind)
              ? "placeholder_id"
              : "invalid_id",
          id: id || "—",
        });
      } else if (seen.has(id)) {
        issues.push({ kind, index, field: "id", code: "duplicate_id", id });
      } else {
        seen.add(id);
      }

      if (!en) {
        issues.push({
          kind,
          index,
          field: "labelEn",
          code: "empty_label_en",
          id: id || `row-${index + 1}`,
        });
      }
      if (!ru) {
        issues.push({
          kind,
          index,
          field: "labelRu",
          code: "empty_label_ru",
          id: id || `row-${index + 1}`,
        });
      }
    }
  };

  collect(data.categories, "categories");
  collect(data.authors, "authors");
  return issues;
}

export function fieldErrorKey(
  kind: TaxonomyListKind,
  index: number,
  field: TaxonomyValidationIssue["field"],
): string {
  return `${kind}:${index}:${field}`;
}
