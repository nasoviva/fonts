export type ArtworkFormField =
  | "titleEn"
  | "titleRu"
  | "descriptionEn"
  | "descriptionRu"
  | "category"
  | "author"
  | "images";

export type ArtworkFormIssue = {
  field: ArtworkFormField;
  code:
    | "empty_title_en"
    | "empty_title_ru"
    | "empty_description_en"
    | "empty_description_ru"
    | "empty_category"
    | "empty_author"
    | "empty_images";
};

export type ArtworkFormValues = {
  titleEn: string;
  titleRu: string;
  descriptionEn: string;
  descriptionRu: string;
  categoryId: string;
  authorId: string;
  imageCount: number;
};

export function findArtworkFormIssues(values: ArtworkFormValues): ArtworkFormIssue[] {
  const issues: ArtworkFormIssue[] = [];

  if (!values.titleEn.trim()) {
    issues.push({ field: "titleEn", code: "empty_title_en" });
  }
  if (!values.titleRu.trim()) {
    issues.push({ field: "titleRu", code: "empty_title_ru" });
  }
  if (!values.descriptionEn.trim()) {
    issues.push({ field: "descriptionEn", code: "empty_description_en" });
  }
  if (!values.descriptionRu.trim()) {
    issues.push({ field: "descriptionRu", code: "empty_description_ru" });
  }
  if (!values.categoryId.trim()) {
    issues.push({ field: "category", code: "empty_category" });
  }
  if (!values.authorId.trim()) {
    issues.push({ field: "author", code: "empty_author" });
  }
  if (values.imageCount < 1) {
    issues.push({ field: "images", code: "empty_images" });
  }

  return issues;
}
