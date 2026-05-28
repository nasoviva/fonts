import { readJsonStore, writeJsonStore } from "@/lib/json-persistence";
import {
  buildDefaultArtworks,
  type Artwork,
  type LocalizedText,
} from "@/data/artworks";
import { getPublicArtworks } from "@/lib/artwork-public";
import { sortArtworksByTitle } from "@/lib/artwork-preview";
import { slugifyId } from "@/lib/slugify";

import { MAX_HOME_FEATURED, countHomeFeatured } from "@/lib/artwork-featured";

export { MAX_HOME_FEATURED } from "@/lib/artwork-featured";

function normalizeArtwork(artwork: Artwork): Artwork {
  return {
    id: artwork.id.trim(),
    slug: artwork.slug.trim(),
    categoryId: artwork.categoryId.trim(),
    authorId: artwork.authorId.trim(),
    hidden: Boolean(artwork.hidden),
    featuredOnHome: Boolean(artwork.featuredOnHome) && !artwork.hidden,
    images: artwork.images.map((u) => u.trim()).filter(Boolean),
    title: {
      en: artwork.title.en.trim(),
      ru: artwork.title.ru.trim(),
    },
    description: {
      en: artwork.description.en.trim(),
      ru: artwork.description.ru.trim(),
    },
  };
}

export function validateArtwork(artwork: Artwork): string | null {
  const a = normalizeArtwork(artwork);
  if (!a.id) return "missing_id";
  if (!a.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug)) return "invalid_slug";
  if (!a.categoryId) return "missing_category";
  if (!a.authorId) return "missing_author";
  if (!a.title.en || !a.title.ru) return "missing_title";
  if (!a.description.en || !a.description.ru) return "missing_description";
  if (a.images.length === 0) return "missing_images";
  return null;
}

export async function readArtworks(): Promise<Artwork[]> {
  try {
    const raw = await readJsonStore("artworks");
    if (raw === null) {
      console.log("[Artworks] no file, seeding defaults");
      const defaults = buildDefaultArtworks();
      await writeArtworks(defaults);
      return defaults;
    }
    const parsed = JSON.parse(raw) as Artwork[];
    if (!Array.isArray(parsed)) {
      throw new Error("invalid_format");
    }
    const normalized = parsed.map(normalizeArtwork);
    console.log("[Artworks] read", { count: normalized.length });
    return normalized;
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? (error as NodeJS.ErrnoException).code
        : undefined;
    console.error("[Artworks] read failed, re-seeding defaults", error);
    const defaults = buildDefaultArtworks();
    await writeArtworks(defaults);
    return defaults;
  }
}

export async function writeArtworks(artworks: Artwork[]): Promise<void> {
  const normalized = artworks.map(normalizeArtwork);
  const slugs = new Set<string>();
  const ids = new Set<string>();

  for (const artwork of normalized) {
    const err = validateArtwork(artwork);
    if (err) throw new Error(err);
    if (ids.has(artwork.id)) throw new Error("duplicate_id");
    if (slugs.has(artwork.slug)) throw new Error("duplicate_slug");
    ids.add(artwork.id);
    slugs.add(artwork.slug);
  }

  await writeJsonStore("artworks", JSON.stringify(normalized, null, 2));
  console.log("[Artworks] saved", { count: normalized.length });
}

export async function getArtworkById(id: string): Promise<Artwork | undefined> {
  const all = await readArtworks();
  return all.find((a) => a.id === id);
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | undefined> {
  const all = await readArtworks();
  return all.find((a) => a.slug === slug);
}

export async function getVisibleArtworks(): Promise<Artwork[]> {
  const all = await readArtworks();
  return getPublicArtworks(all);
}

/** Тот же порядок, что в галерее: видимые работы, A→Z по названию в текущей локали. */
export async function getAdjacentArtworks(slug: string, locale: string) {
  const visible = await getVisibleArtworks();
  const ordered = sortArtworksByTitle(visible, locale);
  const index = ordered.findIndex((a) => a.slug === slug);
  console.log("[Artworks] adjacent", {
    slug,
    locale,
    index,
    total: ordered.length,
  });
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}

export function nextArtworkId(artworks: Artwork[]): string {
  const max = artworks.reduce((m, a) => Math.max(m, Number.parseInt(a.id, 10) || 0), 0);
  return String(max + 1);
}

export function uniqueSlug(
  artworks: Artwork[],
  base: string,
  excludeId?: string,
): string {
  let slug = slugifyId(base) || "artwork";
  let n = 1;
  while (artworks.some((a) => a.slug === slug && a.id !== excludeId)) {
    slug = `${slugifyId(base) || "artwork"}-${n++}`;
  }
  return slug;
}

export type ArtworkInput = {
  title: LocalizedText;
  description: LocalizedText;
  categoryId: string;
  authorId: string;
  hidden: boolean;
  featuredOnHome?: boolean;
  images: string[];
  slug?: string;
};

export async function createArtwork(input: ArtworkInput): Promise<Artwork> {
  const all = await readArtworks();
  const id = nextArtworkId(all);
  const slug = uniqueSlug(
    all,
    input.slug ?? input.title.en,
  );
  const artwork: Artwork = {
    id,
    slug,
    categoryId: input.categoryId,
    authorId: input.authorId,
    hidden: input.hidden,
    featuredOnHome: false,
    images: input.images,
    title: input.title,
    description: input.description,
  };
  const err = validateArtwork(artwork);
  if (err) throw new Error(err);
  await writeArtworks([...all, artwork]);
  return artwork;
}

export async function updateArtwork(
  id: string,
  patch: Partial<ArtworkInput> & {
    slug?: string;
    hidden?: boolean;
    featuredOnHome?: boolean;
  },
): Promise<Artwork> {
  const all = await readArtworks();
  const index = all.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("not_found");

  const current = all[index];
  const hidden = patch.hidden ?? current.hidden;
  const next: Artwork = {
    ...current,
    ...patch,
    title: patch.title ?? current.title,
    description: patch.description ?? current.description,
    images: patch.images ?? current.images,
    hidden,
    featuredOnHome:
      patch.featuredOnHome !== undefined
        ? patch.featuredOnHome && !hidden
        : current.featuredOnHome && !hidden,
  };

  if (patch.slug !== undefined) {
    next.slug = uniqueSlug(all, patch.slug, id);
  } else if (patch.title?.en) {
    const candidate = slugifyId(patch.title.en);
    if (candidate && candidate !== current.slug) {
      next.slug = uniqueSlug(all, candidate, id);
    }
  }

  const err = validateArtwork(next);
  if (err) throw new Error(err);

  const updated = [...all];
  updated[index] = next;
  await writeArtworks(updated);
  return next;
}

export async function deleteArtwork(id: string): Promise<void> {
  const all = await readArtworks();
  const next = all.filter((a) => a.id !== id);
  if (next.length === all.length) throw new Error("not_found");
  await writeArtworks(next);
}

export async function setArtworkHidden(
  id: string,
  hidden: boolean,
): Promise<Artwork> {
  return updateArtwork(id, { hidden });
}

export async function setArtworkFeaturedOnHome(
  id: string,
  featured: boolean,
): Promise<Artwork> {
  const all = await readArtworks();
  const current = all.find((a) => a.id === id);
  if (!current) throw new Error("not_found");

  if (featured) {
    if (current.hidden) throw new Error("featured_hidden");
    const count = countHomeFeatured(all);
    if (!current.featuredOnHome && count >= MAX_HOME_FEATURED) {
      throw new Error("featured_max");
    }
  }

  console.log("[Artworks] set featuredOnHome", { id, featured });
  return updateArtwork(id, { featuredOnHome: featured });
}
