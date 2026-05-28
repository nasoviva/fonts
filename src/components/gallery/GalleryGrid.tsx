"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Artwork } from "@/data/artworks";
import { ArtworkCard } from "@/components/gallery/ArtworkCard";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { Pagination } from "@/components/ui/Pagination";
import { useArtworksData } from "@/hooks/useArtworksData";
import { sortArtworksByTitle } from "@/lib/artwork-preview";
import { PRIORITY_ARTWORK_COUNT_GALLERY } from "@/lib/image-loading";

/** Кратно 3 — на lg полные ряды по три карточки */
const PAGE_SIZE = 18;

const HEADER_SCROLL_OFFSET = 88;

function scrollGalleryIntoView(anchor: HTMLElement | null) {
  if (!anchor) return;
  const top =
    anchor.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  console.log("[Gallery] scroll to top", { top });
}

type GalleryGridProps = {
  initialArtworks?: Artwork[];
};

export function GalleryGrid({ initialArtworks }: GalleryGridProps) {
  const locale = useLocale();
  const t = useTranslations("gallery");
  const { artworks, loading } = useArtworksData({ initialArtworks });
  const [category, setCategory] = useState("all");
  const [author, setAuthor] = useState("all");
  const [page, setPage] = useState(1);
  const galleryTopRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(
    () => sortArtworksByTitle(artworks ?? [], locale),
    [artworks, locale],
  );

  const filtered = useMemo(() => {
    return sorted.filter((a) => {
      const matchCat = category === "all" || a.categoryId === category;
      const matchAuth = author === "all" || a.authorId === author;
      return matchCat && matchAuth;
    });
  }, [sorted, category, author]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
    console.log("[Gallery] filters changed, reset page", { category, author });
  }, [category, author]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function handlePageChange(next: number) {
    setPage(next);
    requestAnimationFrame(() => {
      scrollGalleryIntoView(galleryTopRef.current);
    });
  }

  if (loading) {
    return (
      <p className="text-body py-16 text-center text-cream-faint">{t("loading")}</p>
    );
  }

  return (
    <>
      <GalleryFilters
        category={category}
        author={author}
        onCategoryChange={setCategory}
        onAuthorChange={setAuthor}
      />

      {filtered.length === 0 ? (
        <p className="text-body text-center text-cream-faint">{t("empty")}</p>
      ) : (
        <>
          <div ref={galleryTopRef} className="scroll-mt-24" aria-hidden />
          {filtered.length > PAGE_SIZE && (
            <p className="text-meta-label mb-6 text-center text-cream-faint md:text-right">
              {t("showing", {
                from: (page - 1) * PAGE_SIZE + 1,
                to: Math.min(page * PAGE_SIZE, filtered.length),
                total: filtered.length,
              })}
            </p>
          )}
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((artwork, index) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                locale={locale}
                priority={page === 1 && index < PRIORITY_ARTWORK_COUNT_GALLERY}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            prevLabel={t("prevPage")}
            nextLabel={t("nextPage")}
            pageLabel={t("pageOf", { page, total: totalPages })}
          />
        </>
      )}
    </>
  );
}
