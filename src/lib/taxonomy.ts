import { readTaxonomy } from "@/lib/taxonomy-store";

export type { TaxonomyData, TaxonomyEntry } from "@/lib/taxonomy-types";
export {
  getAuthorLabel,
  getCategoryLabel,
  getTaxonomyLabel,
} from "@/lib/taxonomy-labels";

export async function loadTaxonomy() {
  return readTaxonomy();
}
