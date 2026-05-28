"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { useTaxonomyData } from "@/hooks/useTaxonomyData";
import { getAuthorLabel, getCategoryLabel } from "@/lib/taxonomy-labels";
import { useLocale } from "next-intl";
import type { LocalizedText } from "@/data/artworks";
import {
  findArtworkFormIssues,
  type ArtworkFormField,
  type ArtworkFormIssue,
} from "@/lib/artwork-form-validate";
import { notifyArtworksUpdated } from "@/lib/artworks-sync";

export type ArtworkFormInitial = {
  title: LocalizedText;
  description: LocalizedText;
  images: string[];
  categoryId: string;
  authorId: string;
  hidden: boolean;
};

type ArtworkFormProps = {
  mode: "create" | "edit";
  artworkId?: string;
  initial?: ArtworkFormInitial;
};

function issueMessage(
  t: ReturnType<typeof useTranslations<"admin.form">>,
  issue: ArtworkFormIssue,
): string {
  const key = {
    empty_title_en: "validationEmptyTitleEn",
    empty_title_ru: "validationEmptyTitleRu",
    empty_description_en: "validationEmptyDescriptionEn",
    empty_description_ru: "validationEmptyDescriptionRu",
    empty_category: "validationEmptyCategory",
    empty_author: "validationEmptyAuthor",
    empty_images: "validationEmptyImages",
  }[issue.code] as Parameters<typeof t>[0];

  return t(key);
}

export function ArtworkForm({ mode, artworkId, initial }: ArtworkFormProps) {
  const t = useTranslations("admin.form");
  const locale = useLocale();
  const router = useRouter();
  const { taxonomy, loading } = useTaxonomyData();
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isHidden, setIsHidden] = useState(() => Boolean(initial?.hidden));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Set<ArtworkFormField>>(
    new Set(),
  );

  useEffect(() => {
    setIsHidden(Boolean(initial?.hidden));
    setImages(initial?.images ?? []);
    setMainImageIndex(0);
    console.log("[ArtworkForm] sync from initial", {
      artworkId,
      hidden: Boolean(initial?.hidden),
      images: initial?.images?.length ?? 0,
    });
  }, [artworkId, initial?.hidden, initial?.images]);

  async function handleFilesSelected(fileList: FileList | null) {
    if (!fileList?.length) return;

    setUploadError(null);
    setUploading(true);
    const added: string[] = [];

    try {
      for (const file of Array.from(fileList)) {
        const body = new FormData();
        body.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.log("[ArtworkForm] upload failed", json);
          setUploadError(t("errorUpload"));
          break;
        }

        if (typeof json.url === "string") {
          added.push(json.url);
          console.log("[ArtworkForm] uploaded", json.url);
        }
      }

      if (added.length > 0) {
        setImages((prev) => [...prev, ...added]);
        clearFieldError("images");
      }
    } catch {
      setUploadError(t("errorUpload"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function clearFieldError(field: ArtworkFormField) {
    setFieldErrors((prev) => {
      if (!prev.has(field)) return prev;
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
    setValidationMessages([]);
    setError(null);
  }

  function mapServerError(code: string): string {
    const map: Record<string, string> = {
      missing_title: t("errorMissingTitle"),
      missing_description: t("errorMissingDescription"),
      missing_images: t("errorMissingImages"),
      missing_category: t("errorMissingCategory"),
      missing_author: t("errorMissingAuthor"),
      invalid_slug: t("errorInvalidSlug"),
      duplicate_slug: t("errorDuplicateSlug"),
    };
    return map[code] ?? t("errorSave");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setValidationMessages([]);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const titleEn = String(fd.get("title-en") ?? "").trim();
    const titleRu = String(fd.get("title-ru") ?? "").trim();
    const descriptionEn = String(fd.get("description-en") ?? "").trim();
    const descriptionRu = String(fd.get("description-ru") ?? "").trim();
    const categoryId = String(fd.get("category") ?? "").trim();
    const authorId = String(fd.get("author") ?? "").trim();
    const hidden = isHidden;

    const issues = findArtworkFormIssues({
      titleEn,
      titleRu,
      descriptionEn,
      descriptionRu,
      categoryId,
      authorId,
      imageCount: images.length,
    });

    if (issues.length > 0) {
      setFieldErrors(new Set(issues.map((i) => i.field)));
      setValidationMessages(issues.map((i) => issueMessage(t, i)));
      console.log("[ArtworkForm] validation failed", issues);
      return;
    }

    setFieldErrors(new Set());
    setSaving(true);

    const imageList = [
      images[mainImageIndex],
      ...images.filter((_, i) => i !== mainImageIndex),
    ];

    const payload = {
      title: { en: titleEn, ru: titleRu },
      description: { en: descriptionEn, ru: descriptionRu },
      categoryId,
      authorId,
      hidden,
      images: imageList,
    };

    console.log("[ArtworkForm] save", { mode, artworkId, payload });

    try {
      const url =
        mode === "edit" && artworkId
          ? `/api/admin/artworks/${artworkId}`
          : "/api/admin/artworks";
      const method = mode === "edit" ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(mapServerError(json.error ?? "save_failed"));
        return;
      }

      console.log("[ArtworkForm] saved", json);
      notifyArtworksUpdated();
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError(t("errorSave"));
    } finally {
      setSaving(false);
    }
  }

  const labelClass = "text-meta-label mb-2 block text-cream-dim";
  const inputClass = "input-underline text-body w-full text-cream";

  const fieldClass = (field: ArtworkFormField, extra?: string) =>
    cn(
      inputClass,
      extra,
      fieldErrors.has(field) &&
        "border-red-400 !border-b-red-400 ring-1 ring-red-400/40",
    );

  if (loading || !taxonomy) {
    return (
      <p className="text-body py-12 text-center text-cream-faint">{t("loading")}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-10" noValidate>
      <div>
        <label className={labelClass}>{t("images")}</label>
        <p className="text-body mb-4 text-sm text-cream-faint">{t("imagesHint")}</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        {images.length > 0 && (
          <>
            <div
              className={cn(
                "grid grid-cols-2 gap-3 sm:grid-cols-3 rounded-xl p-1",
                fieldErrors.has("images") && "ring-1 ring-red-400/40",
              )}
            >
              {images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => {
                    setMainImageIndex(index);
                    clearFieldError("images");
                    console.log("[ArtworkForm] set main image", { index, src });
                  }}
                  className={cn(
                    "relative aspect-[4/5] overflow-hidden rounded-xl border hairline-dark bg-cream/5",
                    index === mainImageIndex && "ring-2 ring-cream",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 200px"
                    unoptimized
                  />
                  {index === mainImageIndex && (
                    <span className="absolute bottom-2 left-2 rounded bg-ink/80 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cream">
                      {t("mainBadge")}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-meta-label mt-4 text-cream-faint">{t("mainImage")}</p>
          </>
        )}

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed hairline-dark bg-cream/5 px-6 py-10 transition-colors hover:bg-cream/10 disabled:cursor-wait disabled:opacity-60",
            images.length === 0 ? "mt-0" : "mt-4",
            images.length === 0 &&
              fieldErrors.has("images") &&
              "border-red-400/60 ring-1 ring-red-400/40",
          )}
        >
          <span className="text-meta-label text-cream-faint">
            {uploading ? t("uploading") : `+ ${t("upload")}`}
          </span>
        </button>

        {images.length === 0 && !uploading && (
          <p
            className={cn(
              "text-body mt-3 text-sm",
              fieldErrors.has("images") ? "text-red-400" : "text-cream-faint",
            )}
          >
            {t("noImagesYet")}
          </p>
        )}

        {uploadError && (
          <p className="text-body mt-2 text-sm text-red-400" role="alert">
            {uploadError}
          </p>
        )}
      </div>

      <p className="rounded-xl border hairline-dark bg-cream/5 px-4 py-3 text-sm text-cream-faint">
        {t("localeHint")}
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          label={t("titleEn")}
          id="title-en"
          name="title-en"
          defaultValue={initial?.title.en ?? ""}
          hasError={fieldErrors.has("titleEn")}
          inputClassName={fieldClass("titleEn")}
          onEdit={() => clearFieldError("titleEn")}
        />
        <Field
          label={t("titleRu")}
          id="title-ru"
          name="title-ru"
          defaultValue={initial?.title.ru ?? ""}
          hasError={fieldErrors.has("titleRu")}
          inputClassName={fieldClass("titleRu")}
          onEdit={() => clearFieldError("titleRu")}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          label={t("descriptionEn")}
          id="description-en"
          name="description-en"
          textarea
          defaultValue={initial?.description.en ?? ""}
          hasError={fieldErrors.has("descriptionEn")}
          inputClassName={fieldClass("descriptionEn")}
          onEdit={() => clearFieldError("descriptionEn")}
        />
        <Field
          label={t("descriptionRu")}
          id="description-ru"
          name="description-ru"
          textarea
          defaultValue={initial?.description.ru ?? ""}
          hasError={fieldErrors.has("descriptionRu")}
          inputClassName={fieldClass("descriptionRu")}
          onEdit={() => clearFieldError("descriptionRu")}
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          {t("category")}
        </label>
        <select
          id="category"
          name="category"
          className={fieldClass("category")}
          defaultValue={initial?.categoryId ?? ""}
          onChange={() => clearFieldError("category")}
          aria-invalid={fieldErrors.has("category")}
        >
          <option value="">{t("selectPlaceholder")}</option>
          {taxonomy.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {getCategoryLabel(taxonomy, c.id, locale)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="author" className={labelClass}>
          {t("author")}
        </label>
        <select
          id="author"
          name="author"
          className={fieldClass("author")}
          defaultValue={initial?.authorId ?? ""}
          onChange={() => clearFieldError("author")}
          aria-invalid={fieldErrors.has("author")}
        >
          <option value="">{t("selectPlaceholder")}</option>
          {taxonomy.authors.map((a) => (
            <option key={a.id} value={a.id}>
              {getAuthorLabel(taxonomy, a.id, locale)}
            </option>
          ))}
        </select>
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name="hidden"
          checked={isHidden}
          onChange={(e) => {
            setIsHidden(e.target.checked);
            console.log("[ArtworkForm] hidden toggled", e.target.checked);
          }}
          className="h-4 w-4 rounded border hairline-dark bg-cream/5 accent-cream"
        />
        <span className="text-body text-cream-dim">{t("hidden")}</span>
      </label>

      {validationMessages.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/40 bg-red-950/20 px-5 py-4"
        >
          <p className="text-body text-sm font-medium text-red-300">
            {t("validationSummary")}
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-400">
            {validationMessages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="text-body text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-cream px-8 py-3 text-meta-label text-ink hover:bg-cream-muted disabled:opacity-50"
        >
          {saving ? t("saving") : t("save")}
        </button>
        <Link
          href="/admin/dashboard"
          className="rounded-full border hairline-dark px-8 py-3 text-meta-label hover:bg-cream/5"
        >
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  name,
  defaultValue,
  textarea,
  hasError,
  inputClassName,
  onEdit,
}: {
  label: string;
  id: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
  hasError?: boolean;
  inputClassName: string;
  onEdit: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-meta-label mb-2 block text-cream-dim">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          defaultValue={defaultValue}
          onChange={onEdit}
          className={cn(inputClassName, "resize-none")}
          aria-invalid={hasError}
        />
      ) : (
        <input
          id={id}
          name={name}
          type="text"
          defaultValue={defaultValue}
          onChange={onEdit}
          className={inputClassName}
          aria-invalid={hasError}
        />
      )}
    </div>
  );
}
