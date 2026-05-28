"use client";

import { useCallback, useEffect, useState } from "react";
import type { TaxonomyData } from "@/lib/taxonomy-types";

export function useTaxonomyData() {
  const [taxonomy, setTaxonomy] = useState<TaxonomyData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/taxonomy");
      if (!res.ok) throw new Error("failed");
      setTaxonomy((await res.json()) as TaxonomyData);
    } catch {
      setTaxonomy(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { taxonomy, loading, reload: load };
}
