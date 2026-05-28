"use client";

import { createContext, useContext } from "react";
import type { TaxonomyData } from "@/lib/taxonomy-types";
import { getAuthorLabel, getCategoryLabel } from "@/lib/taxonomy-labels";

const TaxonomyContext = createContext<TaxonomyData | null>(null);

export function TaxonomyProvider({
  taxonomy,
  children,
}: {
  taxonomy: TaxonomyData;
  children: React.ReactNode;
}) {
  return (
    <TaxonomyContext.Provider value={taxonomy}>{children}</TaxonomyContext.Provider>
  );
}

export function useTaxonomy() {
  const taxonomy = useContext(TaxonomyContext);
  if (!taxonomy) {
    throw new Error("useTaxonomy must be used within TaxonomyProvider");
  }
  return taxonomy;
}

export function useCategoryLabel(categoryId: string, locale: string) {
  const taxonomy = useTaxonomy();
  return getCategoryLabel(taxonomy, categoryId, locale);
}

export function useAuthorLabel(authorId: string, locale: string) {
  const taxonomy = useTaxonomy();
  return getAuthorLabel(taxonomy, authorId, locale);
}
