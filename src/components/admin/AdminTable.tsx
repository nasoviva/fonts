"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  SortableTableHeader,
  type SortDirection,
} from "@/components/admin/SortableTableHeader";
import { type Artwork, getLocalized } from "@/data/artworks";
import { useArtworksData } from "@/hooks/useArtworksData";
import { useTaxonomyData } from "@/hooks/useTaxonomyData";
import { getAuthorLabel, getCategoryLabel } from "@/lib/taxonomy-labels";
import type { TaxonomyData } from "@/lib/taxonomy-types";
import { notifyArtworksUpdated } from "@/lib/artworks-sync";
import {
  MAX_HOME_FEATURED,
  countHomeFeatured,
} from "@/lib/artwork-featured";

const cellPad = "py-4 pr-4";
const firstCellPad = "py-4 pl-5 pr-4 md:pl-6";
const lastCellPad = "py-4 pl-4 pr-5 md:pr-6";

type SortKey = "title" | "category" | "author" | "description";

function resolveAdminError(
  t: ReturnType<typeof useTranslations<"admin.dashboard">>,
  e: unknown,
): string {
  const code = e instanceof Error ? e.message : "";
  if (code === "featured_max") return t("errorFeaturedMax");
  if (code === "featured_hidden") return t("errorFeaturedHidden");
  if (code === "storage_readonly" || code === "blob_not_configured") {
    return t("errorStorage");
  }
  return t("errorAction");
}

export function AdminTable() {
  const t = useTranslations("admin.dashboard");
  const locale = useLocale();
  const { taxonomy, loading: taxonomyLoading } = useTaxonomyData();
  const {
    artworks,
    loading: artworksLoading,
    reload,
  } = useArtworksData({ admin: true });
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [actionError, setActionError] = useState<string | null>(null);

  const featuredCount = useMemo(
    () => (artworks ? countHomeFeatured(artworks) : 0),
    [artworks],
  );

  const sorted = useMemo(() => {
    if (!taxonomy || !artworks) return [];

    const list = [...artworks];
    const dir = sortDir === "asc" ? 1 : -1;

    list.sort((a, b) => {
      let av = "";
      let bv = "";
      switch (sortKey) {
        case "title":
          av = getLocalized(a.title, locale);
          bv = getLocalized(b.title, locale);
          break;
        case "category":
          av = getCategoryLabel(taxonomy, a.categoryId, locale);
          bv = getCategoryLabel(taxonomy, b.categoryId, locale);
          break;
        case "author":
          av = getAuthorLabel(taxonomy, a.authorId, locale);
          bv = getAuthorLabel(taxonomy, b.authorId, locale);
          break;
        case "description":
          av = getLocalized(a.description, locale);
          bv = getLocalized(b.description, locale);
          break;
      }
      return av.localeCompare(bv, locale, { sensitivity: "base" }) * dir;
    });

    return list;
  }, [taxonomy, artworks, sortKey, sortDir, locale]);

  async function toggleFeatured(artwork: Artwork) {
    setActionError(null);
    const next = !artwork.featuredOnHome;
    console.log("[AdminTable] toggle featured", {
      id: artwork.id,
      next,
      featuredCount,
    });
    try {
      const res = await fetch(`/api/admin/artworks/${artwork.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredOnHome: next }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (data.error === "featured_max") throw new Error("featured_max");
        if (data.error === "featured_hidden") throw new Error("featured_hidden");
        throw new Error("featured_failed");
      }
      notifyArtworksUpdated();
      await reload();
    } catch (e) {
      setActionError(resolveAdminError(t, e));
    }
  }

  async function toggleHidden(artwork: Artwork) {
    setActionError(null);
    console.log("[AdminTable] toggle hidden", { id: artwork.id, hidden: !artwork.hidden });
    try {
      const res = await fetch(`/api/admin/artworks/${artwork.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !artwork.hidden }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "toggle_failed");
      }
      notifyArtworksUpdated();
      await reload();
    } catch (e) {
      setActionError(resolveAdminError(t, e));
    }
  }

  async function deleteArtwork(artwork: Artwork) {
    if (!confirm(t("confirmDelete"))) return;
    setActionError(null);
    console.log("[AdminTable] delete", artwork.id);
    try {
      const res = await fetch(`/api/admin/artworks/${artwork.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete_failed");
      notifyArtworksUpdated();
      await reload();
    } catch {
      setActionError(t("errorAction"));
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      console.log("[AdminTable] sort toggle", { key, dir: sortDir === "asc" ? "desc" : "asc" });
    } else {
      setSortKey(key);
      setSortDir("asc");
      console.log("[AdminTable] sort column", { key, dir: "asc" });
    }
  }

  if (taxonomyLoading || artworksLoading || !taxonomy || !artworks) {
    return (
      <p className="text-body py-16 text-center text-cream-faint">{t("loading")}</p>
    );
  }

  if (artworks.length === 0) {
    return (
      <p className="text-body py-16 text-center text-cream-faint">{t("empty")}</p>
    );
  }

  const sortAsc = t("sortAsc");
  const sortDesc = t("sortDesc");

  return (
    <>
      <p className="text-body mb-4 text-center text-cream-dim">
        {t("featuredHint", { count: featuredCount, max: MAX_HOME_FEATURED })}
      </p>
      {actionError && (
        <p className="text-body mb-6 text-center text-sm text-red-400" role="alert">
          {actionError}
        </p>
      )}
      <ul className="flex flex-col gap-4 lg:hidden">
        {sorted.map((artwork) => (
          <li
            key={artwork.id}
            className="rounded-card border hairline-dark p-4 pl-5 md:p-5 md:pl-6"
          >
            <ArtworkCardMobile
              artwork={artwork}
              locale={locale}
              taxonomy={taxonomy}
              t={t}
              featuredCount={featuredCount}
              onToggleFeatured={() => toggleFeatured(artwork)}
              onToggleHidden={() => toggleHidden(artwork)}
              onDelete={() => deleteArtwork(artwork)}
            />
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-card border hairline-dark lg:block">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b hairline-dark bg-cream/5 text-left">
              <th className={`text-meta-label ${firstCellPad}`}>
                {t("columns.image")}
              </th>
              <SortableTableHeader
                label={t("columns.title")}
                active={sortKey === "title"}
                direction={sortDir}
                onSort={() => toggleSort("title")}
                className={cellPad}
                sortAscLabel={sortAsc}
                sortDescLabel={sortDesc}
              />
              <SortableTableHeader
                label={t("columns.category")}
                active={sortKey === "category"}
                direction={sortDir}
                onSort={() => toggleSort("category")}
                className={`hidden xl:table-cell ${cellPad}`}
                sortAscLabel={sortAsc}
                sortDescLabel={sortDesc}
              />
              <SortableTableHeader
                label={t("columns.author")}
                active={sortKey === "author"}
                direction={sortDir}
                onSort={() => toggleSort("author")}
                className={`hidden xl:table-cell ${cellPad}`}
                sortAscLabel={sortAsc}
                sortDescLabel={sortDesc}
              />
              <SortableTableHeader
                label={t("columns.description")}
                active={sortKey === "description"}
                direction={sortDir}
                onSort={() => toggleSort("description")}
                className={`hidden 2xl:table-cell ${cellPad}`}
                sortAscLabel={sortAsc}
                sortDescLabel={sortDesc}
              />
              <th className={`text-meta-label text-center ${cellPad}`}>
                {t("columns.homeFeatured")}
              </th>
              <th className={`text-meta-label ${lastCellPad}`}>
                {t("columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((artwork) => (
              <tr
                key={artwork.id}
                className="border-b hairline-dark text-body text-cream-dim transition-colors last:border-b-0 hover:bg-cream/[0.03]"
              >
                <td className={firstCellPad}>
                  <ArtworkThumb artwork={artwork} size="md" />
                </td>
                <td className={cellPad}>
                  <ArtworkTitle
                    artwork={artwork}
                    locale={locale}
                    hiddenLabel={t("hidden")}
                  />
                  <p className="text-meta-label mt-1 text-cream-faint xl:hidden">
                    {getCategoryLabel(taxonomy, artwork.categoryId, locale)} ·{" "}
                    {getAuthorLabel(taxonomy, artwork.authorId, locale)}
                  </p>
                </td>
                <td className={`hidden xl:table-cell ${cellPad}`}>
                  {getCategoryLabel(taxonomy, artwork.categoryId, locale)}
                </td>
                <td className={`hidden xl:table-cell ${cellPad}`}>
                  {getAuthorLabel(taxonomy, artwork.authorId, locale)}
                </td>
                <td
                  className={`hidden max-w-xs truncate 2xl:table-cell ${cellPad} opacity-70`}
                >
                  {getLocalized(artwork.description, locale)}
                </td>
                <td className={`${cellPad} text-center`}>
                  <FeaturedToggle
                    artwork={artwork}
                    featuredCount={featuredCount}
                    t={t}
                    onToggle={() => toggleFeatured(artwork)}
                  />
                </td>
                <td className={lastCellPad}>
                  <ArtworkActions
                    artwork={artwork}
                    t={t}
                    onToggleHidden={() => toggleHidden(artwork)}
                    onDelete={() => deleteArtwork(artwork)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function FeaturedToggle({
  artwork,
  featuredCount,
  t,
  onToggle,
}: {
  artwork: Artwork;
  featuredCount: number;
  t: ReturnType<typeof useTranslations<"admin.dashboard">>;
  onToggle: () => void;
}) {
  const atMax =
    !artwork.featuredOnHome &&
    featuredCount >= MAX_HOME_FEATURED &&
    !artwork.hidden;
  const disabled = artwork.hidden || atMax;

  const title = artwork.hidden
    ? t("featuredHiddenTitle")
    : atMax
      ? t("featuredMaxTitle")
      : artwork.featuredOnHome
        ? t("featuredRemoveTitle")
        : t("featuredAddTitle");

  return (
    <label
      className={`inline-flex cursor-pointer justify-center ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
      title={title}
    >
      <input
        type="checkbox"
        checked={Boolean(artwork.featuredOnHome)}
        disabled={disabled}
        onChange={() => {
          if (!disabled) onToggle();
        }}
        className="h-4 w-4 shrink-0 rounded border-cream/40 bg-transparent accent-cream text-cream focus:ring-cream/30 disabled:cursor-not-allowed"
        aria-label={title}
      />
    </label>
  );
}

function ArtworkCardMobile({
  artwork,
  locale,
  taxonomy,
  t,
  featuredCount,
  onToggleFeatured,
  onToggleHidden,
  onDelete,
}: {
  artwork: Artwork;
  locale: string;
  taxonomy: TaxonomyData;
  t: ReturnType<typeof useTranslations<"admin.dashboard">>;
  featuredCount: number;
  onToggleFeatured: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <div className="flex gap-4">
        <ArtworkThumb artwork={artwork} size="lg" />
        <div className="min-w-0 flex-1">
          <ArtworkTitle
            artwork={artwork}
            locale={locale}
            hiddenLabel={t("hidden")}
          />
          <p className="text-meta-label mt-1 text-cream-faint">
            {getCategoryLabel(taxonomy, artwork.categoryId, locale)}
          </p>
          <p className="text-meta-label text-cream-faint">
            {getAuthorLabel(taxonomy, artwork.authorId, locale)}
          </p>
          <p className="text-body mt-2 line-clamp-2 text-sm text-cream-faint">
            {getLocalized(artwork.description, locale)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 border-t hairline-dark pt-4">
        <div className="flex justify-center">
          <FeaturedToggle
            artwork={artwork}
            featuredCount={featuredCount}
            t={t}
            onToggle={onToggleFeatured}
          />
        </div>
        <ArtworkActions
          artwork={artwork}
          t={t}
          onToggleHidden={onToggleHidden}
          onDelete={onDelete}
        />
      </div>
    </>
  );
}

function ArtworkThumb({
  artwork,
  size,
}: {
  artwork: Artwork;
  size: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-16 w-16" : "h-14 w-14";
  return (
    <div
      className={`relative ${dim} shrink-0 overflow-hidden rounded-lg bg-cream/5`}
    >
      <Image
        src={artwork.images[0]}
        alt=""
        fill
        className="object-cover"
        sizes={size === "lg" ? "64px" : "56px"}
      />
    </div>
  );
}

function ArtworkTitle({
  artwork,
  locale,
  hiddenLabel,
}: {
  artwork: Artwork;
  locale: string;
  hiddenLabel: string;
}) {
  return (
    <p className="text-body font-medium text-cream">
      {getLocalized(artwork.title, locale)}
      {artwork.hidden && (
        <span className="text-meta-label ml-2 text-cream-faint">
          ({hiddenLabel})
        </span>
      )}
    </p>
  );
}

function ArtworkActions({
  artwork,
  t,
  onToggleHidden,
  onDelete,
}: {
  artwork: Artwork;
  t: ReturnType<typeof useTranslations<"admin.dashboard">>;
  onToggleHidden: () => void;
  onDelete: () => void;
}) {
  const actionClass =
    "w-full rounded-full border px-3 py-1.5 text-center text-meta-label";

  return (
    <div className="flex min-w-[7.5rem] flex-col gap-2">
      <Link
        href={`/admin/artwork/${artwork.id}/edit`}
        className={`${actionClass} hairline-dark hover:bg-cream/5`}
      >
        {t("actions.edit")}
      </Link>
      <button
        type="button"
        className={`${actionClass} hairline-dark hover:bg-cream/5`}
        onClick={onToggleHidden}
      >
        {artwork.hidden ? t("actions.show") : t("actions.hide")}
      </button>
      <button
        type="button"
        className={`${actionClass} border-red-500/40 text-red-400 hover:bg-red-500/10`}
        onClick={onDelete}
      >
        {t("actions.delete")}
      </button>
    </div>
  );
}
