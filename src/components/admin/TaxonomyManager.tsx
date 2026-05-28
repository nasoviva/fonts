"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { TaxonomyData, TaxonomyEntry } from "@/lib/taxonomy-types";
import { slugifyId } from "@/lib/slugify";
import {
  fieldErrorKey,
  findAllTaxonomyIssues,
  type TaxonomyValidationIssue,
} from "@/lib/taxonomy-validate";
import { cn } from "@/lib/cn";

type ListKind = "categories" | "authors";

function newClientKey(): string {
  return crypto.randomUUID();
}

function withClientKeys(data: TaxonomyData): TaxonomyData {
  return {
    categories: data.categories.map((e) => ({
      ...e,
      clientKey: e.clientKey ?? newClientKey(),
    })),
    authors: data.authors.map((e) => ({
      ...e,
      clientKey: e.clientKey ?? newClientKey(),
    })),
  };
}

function isPlaceholderId(id: string, kind: ListKind): boolean {
  return kind === "categories"
    ? id.startsWith("new-category")
    : id.startsWith("new-author");
}

function formatIssueMessage(
  t: ReturnType<typeof useTranslations<"admin.taxonomy">>,
  issue: TaxonomyValidationIssue,
): string {
  const section =
    issue.kind === "categories" ? t("categoriesTitle") : t("authorsTitle");
  const row = issue.index + 1;
  const params = { id: issue.id, section, row };

  switch (issue.code) {
    case "invalid_id":
      return t("validationInvalidId", params);
    case "placeholder_id":
      return t("validationPlaceholderId", params);
    case "duplicate_id":
      return t("validationDuplicateId", params);
    case "empty_label_en":
      return t("validationEmptyEn", params);
    case "empty_label_ru":
      return t("validationEmptyRu", params);
  }
}

function parseServerIssue(raw: unknown): TaxonomyValidationIssue | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (
    (o.kind === "categories" || o.kind === "authors") &&
    typeof o.index === "number" &&
    (o.field === "id" || o.field === "labelEn" || o.field === "labelRu") &&
    typeof o.code === "string" &&
    typeof o.id === "string"
  ) {
    return o as TaxonomyValidationIssue;
  }
  return null;
}

export function TaxonomyManager() {
  const t = useTranslations("admin.taxonomy");
  const [data, setData] = useState<TaxonomyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/taxonomy");
      if (!res.ok) throw new Error("load_failed");
      const json = (await res.json()) as TaxonomyData;
      setData(withClientKeys(json));
      console.log("[Taxonomy] loaded", json);
    } catch {
      setError(t("errorLoad"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  function clearFieldError(kind: ListKind, index: number, field?: "id" | "labelEn" | "labelRu") {
    setFieldErrors((prev) => {
      if (!field) {
        const next = new Set(prev);
        for (const key of prev) {
          if (key.startsWith(`${kind}:${index}:`)) next.delete(key);
        }
        return next;
      }
      const next = new Set(prev);
      next.delete(fieldErrorKey(kind, index, field));
      return next;
    });
    setValidationMessages([]);
    setError(null);
  }

  function applyValidationIssues(issues: TaxonomyValidationIssue[]) {
    setFieldErrors(
      new Set(issues.map((i) => fieldErrorKey(i.kind, i.index, i.field))),
    );
    setValidationMessages(issues.map((i) => formatIssueMessage(t, i)));
    setError(null);
    setSuccess(false);
    console.log("[Taxonomy] validation failed", issues);
  }

  function updateList(kind: ListKind, entries: TaxonomyEntry[]) {
    if (!data) return;
    setData({ ...data, [kind]: entries });
    setSuccess(false);
  }

  function addEntry(kind: ListKind) {
    if (!data) return;
    const base = kind === "categories" ? "new-category" : "new-author";
    let id = base;
    let n = 1;
    const ids = new Set(data[kind].map((e) => e.id));
    while (ids.has(id)) {
      id = `${base}-${n++}`;
    }
    updateList(kind, [
      ...data[kind],
      { id, label: { en: "", ru: "" }, clientKey: newClientKey() },
    ]);
  }

  function updateEntry(
    kind: ListKind,
    index: number,
    patch: Partial<TaxonomyEntry>,
  ) {
    if (!data) return;
    const list = [...data[kind]];
    list[index] = { ...list[index], ...patch };
    if (patch.label) {
      list[index].label = { ...list[index].label, ...patch.label };
    }
    if (patch.id !== undefined) clearFieldError(kind, index, "id");
    if (patch.label?.en !== undefined) clearFieldError(kind, index, "labelEn");
    if (patch.label?.ru !== undefined) clearFieldError(kind, index, "labelRu");
    updateList(kind, list);
  }

  function removeEntry(kind: ListKind, index: number) {
    if (!data) return;
    if (!confirm(t("confirmDelete"))) return;
    updateList(
      kind,
      data[kind].filter((_, i) => i !== index),
    );
  }

  function stripClientKeys(taxonomy: TaxonomyData): TaxonomyData {
    return {
      categories: taxonomy.categories.map(({ id, label }) => ({ id, label })),
      authors: taxonomy.authors.map(({ id, label }) => ({ id, label })),
    };
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    const payload = stripClientKeys(data);

    const clientIssues = findAllTaxonomyIssues(payload);
    if (clientIssues.length > 0) {
      applyValidationIssues(clientIssues);
      setSaving(false);
      return;
    }

    setFieldErrors(new Set());
    setValidationMessages([]);
    console.log("[Taxonomy] save", payload);

    try {
      const res = await fetch("/api/admin/taxonomy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.error === "in_use") {
          setValidationMessages([]);
          setFieldErrors(new Set());
          setError(t("errorInUse"));
        } else if (json.error === "validation_failed" && json.details) {
          const issue = parseServerIssue(json.details);
          if (issue) {
            applyValidationIssues([issue]);
          } else {
            setError(t("errorSave"));
          }
        } else {
          setValidationMessages([]);
          setFieldErrors(new Set());
          setError(t("errorSave"));
        }
        return;
      }
      setSuccess(true);
      await load();
    } catch {
      setValidationMessages([]);
      setFieldErrors(new Set());
      setError(t("errorSave"));
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data) {
    return (
      <p className="text-body py-16 text-center text-cream-faint">
        {loading ? t("loading") : error}
      </p>
    );
  }

  return (
    <div className="space-y-12">
      <TaxonomySection
        kind="categories"
        title={t("categoriesTitle")}
        addLabel={t("addCategory")}
        entries={data.categories}
        idLabel={t("id")}
        enLabel={t("labelEn")}
        ruLabel={t("labelRu")}
        onAdd={() => addEntry("categories")}
        onChange={(index, patch) => updateEntry("categories", index, patch)}
        onRemove={(index) => removeEntry("categories", index)}
        fieldErrors={fieldErrors}
        slugifyFromEn
      />

      <TaxonomySection
        kind="authors"
        title={t("authorsTitle")}
        addLabel={t("addAuthor")}
        entries={data.authors}
        idLabel={t("id")}
        enLabel={t("labelEn")}
        ruLabel={t("labelRu")}
        onAdd={() => addEntry("authors")}
        onChange={(index, patch) => updateEntry("authors", index, patch)}
        onRemove={(index) => removeEntry("authors", index)}
        fieldErrors={fieldErrors}
        slugifyFromEn
      />

      {validationMessages.length > 0 && (
        <div
          role="alert"
          className="mx-auto max-w-2xl rounded-xl border border-red-400/40 bg-red-950/20 px-5 py-4"
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
        <p className="text-body text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-body text-center text-sm text-cream">{t("saved")}</p>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-cream px-8 py-3 text-meta-label text-ink hover:bg-cream-muted disabled:opacity-50"
        >
          {saving ? t("saving") : t("save")}
        </button>
        <Link
          href="/admin/dashboard"
          className="rounded-full border hairline-dark px-8 py-3 text-meta-label hover:bg-cream/5"
        >
          {t("back")}
        </Link>
      </div>
    </div>
  );
}

function fieldInputClass(hasError: boolean, extra?: string) {
  return cn(
    "input-underline text-body w-full text-cream",
    extra,
    hasError && "border-red-400 !border-b-red-400 ring-1 ring-red-400/40",
  );
}

function TaxonomySection({
  kind,
  title,
  addLabel,
  entries,
  idLabel,
  enLabel,
  ruLabel,
  onAdd,
  onChange,
  onRemove,
  fieldErrors,
  slugifyFromEn,
}: {
  kind: ListKind;
  title: string;
  addLabel: string;
  entries: TaxonomyEntry[];
  idLabel: string;
  enLabel: string;
  ruLabel: string;
  onAdd: () => void;
  onChange: (index: number, patch: Partial<TaxonomyEntry>) => void;
  onRemove: (index: number) => void;
  fieldErrors: Set<string>;
  slugifyFromEn?: boolean;
}) {
  const t = useTranslations("admin.taxonomy");

  const hasError = (index: number, field: "id" | "labelEn" | "labelRu") =>
    fieldErrors.has(fieldErrorKey(kind, index, field));

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-subheader text-xl uppercase text-cream-bright">{title}</h2>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full border hairline-dark px-4 py-2 text-meta-label hover:bg-cream/5"
        >
          + {addLabel}
        </button>
      </div>

      <ul className="flex flex-col gap-3 lg:hidden">
        {entries.map((entry, index) => (
          <li
            key={entry.clientKey ?? entry.id}
            className="rounded-card border hairline-dark p-4 pl-5 space-y-3"
          >
            <TaxonomyFields
              kind={kind}
              index={index}
              entry={entry}
              idLabel={idLabel}
              enLabel={enLabel}
              ruLabel={ruLabel}
              fieldErrors={fieldErrors}
              onChange={(patch) => onChange(index, patch)}
              slugifyFromEn={slugifyFromEn}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-meta-label text-red-400 hover:text-red-300"
            >
              {t("delete")}
            </button>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-card border hairline-dark lg:block">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b hairline-dark bg-cream/5 text-left">
              <th className="text-meta-label py-3 pl-5 pr-3 md:pl-6">{idLabel}</th>
              <th className="text-meta-label py-3 pr-3">{enLabel}</th>
              <th className="text-meta-label py-3 pr-3">{ruLabel}</th>
              <th className="text-meta-label py-3 pr-5 md:pr-6" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr
                key={entry.clientKey ?? entry.id}
                className="border-b hairline-dark last:border-b-0"
              >
                <td className="py-3 pl-5 pr-3 md:pl-6">
                  <input
                    value={entry.id}
                    onChange={(e) => onChange(index, { id: e.target.value })}
                    className={fieldInputClass(
                      hasError(index, "id"),
                      "min-w-[8rem]",
                    )}
                    placeholder="id"
                    aria-invalid={hasError(index, "id")}
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    value={entry.label.en}
                    onChange={(e) =>
                      onChange(index, {
                        label: { en: e.target.value, ru: entry.label.ru },
                      })
                    }
                    onBlur={(e) => {
                      if (!slugifyFromEn) return;
                      const en = e.target.value;
                      const slug = slugifyId(en);
                      if (slug && isPlaceholderId(entry.id, kind)) {
                        onChange(index, {
                          id: slug,
                          label: { en, ru: entry.label.ru },
                        });
                      }
                    }}
                    className={fieldInputClass(
                      hasError(index, "labelEn"),
                      "min-w-[10rem]",
                    )}
                    aria-invalid={hasError(index, "labelEn")}
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    value={entry.label.ru}
                    onChange={(e) =>
                      onChange(index, {
                        label: { en: entry.label.en, ru: e.target.value },
                      })
                    }
                    className={fieldInputClass(
                      hasError(index, "labelRu"),
                      "min-w-[10rem]",
                    )}
                    aria-invalid={hasError(index, "labelRu")}
                  />
                </td>
                <td className="py-3 pr-5 text-right md:pr-6">
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-meta-label text-red-400 hover:text-red-300"
                  >
                    {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TaxonomyFields({
  kind,
  index,
  entry,
  idLabel,
  enLabel,
  ruLabel,
  fieldErrors,
  onChange,
  slugifyFromEn,
}: {
  kind: ListKind;
  index: number;
  entry: TaxonomyEntry;
  idLabel: string;
  enLabel: string;
  ruLabel: string;
  fieldErrors: Set<string>;
  onChange: (patch: Partial<TaxonomyEntry>) => void;
  slugifyFromEn?: boolean;
}) {
  const hasError = (field: "id" | "labelEn" | "labelRu") =>
    fieldErrors.has(fieldErrorKey(kind, index, field));

  return (
    <>
      <div>
        <label className="text-meta-label mb-1 block text-cream-faint">{idLabel}</label>
        <input
          value={entry.id}
          onChange={(e) => onChange({ id: e.target.value })}
          className={fieldInputClass(hasError("id"))}
          aria-invalid={hasError("id")}
        />
      </div>
      <div>
        <label className="text-meta-label mb-1 block text-cream-faint">{enLabel}</label>
        <input
          value={entry.label.en}
          onChange={(e) =>
            onChange({ label: { en: e.target.value, ru: entry.label.ru } })
          }
          onBlur={(e) => {
            if (!slugifyFromEn) return;
            const en = e.target.value;
            const slug = slugifyId(en);
            if (slug && isPlaceholderId(entry.id, kind)) {
              onChange({ id: slug, label: { en, ru: entry.label.ru } });
            }
          }}
          className={fieldInputClass(hasError("labelEn"))}
          aria-invalid={hasError("labelEn")}
        />
      </div>
      <div>
        <label className="text-meta-label mb-1 block text-cream-faint">{ruLabel}</label>
        <input
          value={entry.label.ru}
          onChange={(e) =>
            onChange({ label: { en: entry.label.en, ru: e.target.value } })
          }
          className={fieldInputClass(hasError("labelRu"))}
          aria-invalid={hasError("labelRu")}
        />
      </div>
    </>
  );
}
