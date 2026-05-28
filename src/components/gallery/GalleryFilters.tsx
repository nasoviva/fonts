"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { useTaxonomy } from "@/contexts/TaxonomyContext";
import { getAuthorLabel, getCategoryLabel } from "@/lib/taxonomy-labels";

type GalleryFiltersProps = {
  category: string;
  author: string;
  onCategoryChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
};

export function GalleryFilters({
  category,
  author,
  onCategoryChange,
  onAuthorChange,
}: GalleryFiltersProps) {
  const t = useTranslations("gallery");
  const taxonomy = useTaxonomy();
  const locale = useLocale();

  return (
    <div className="mb-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <FilterGroup
        label={t("filterCategory")}
        value={category}
        onChange={onCategoryChange}
        options={[
          { value: "all", label: t("all") },
          ...taxonomy.categories.map((c) => ({
            value: c.id,
            label: getCategoryLabel(taxonomy, c.id, locale),
          })),
        ]}
      />
      <FilterGroup
        label={t("filterAuthor")}
        value={author}
        onChange={onAuthorChange}
        options={[
          { value: "all", label: t("all") },
          ...taxonomy.authors.map((a) => ({
            value: a.id,
            label: getAuthorLabel(taxonomy, a.id, locale),
          })),
        ]}
      />
    </div>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-meta-label mb-3 text-cream-faint">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-meta-label transition-colors",
              value === opt.value
                ? "border-cream bg-cream text-ink"
                : "border-cream/20 text-cream-dim hover:border-cream-bright/40 hover:text-cream-bright"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
