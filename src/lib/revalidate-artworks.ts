import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";

/** Сброс кэша страниц галереи и главной после изменений в админке. */
export function revalidateArtworkPages(): void {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}/gallery`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/artwork`, "layout");
  }
  console.log("[Artworks] revalidated public pages");
}
