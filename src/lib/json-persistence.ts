import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";

const DATA_DIR = path.join(process.cwd(), "data");

/** Имена файлов в Blob / в папке data/ */
export const JSON_STORE = {
  artworks: "artworks.json",
  taxonomy: "taxonomy.json",
} as const;

type JsonStoreKey = keyof typeof JSON_STORE;

function localPath(key: JsonStoreKey): string {
  return path.join(DATA_DIR, JSON_STORE[key]);
}

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function readFromBlob(pathname: string): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return null;

  const { blobs } = await list({ prefix: pathname, limit: 20, token });
  const match = blobs.find((b) => b.pathname === pathname);
  if (!match) {
    console.log("[JsonStore] blob miss", { pathname });
    return null;
  }

  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) {
    console.error("[JsonStore] blob fetch failed", { pathname, status: res.status });
    return null;
  }
  console.log("[JsonStore] blob read", { pathname });
  return res.text();
}

async function writeToBlob(pathname: string, content: string): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) throw new Error("blob_not_configured");

  await put(pathname, content, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
  });
  console.log("[JsonStore] blob write", { pathname, bytes: content.length });
}

/** Читает JSON: сначала Blob (если настроен), затем файл из репозитория / data/. */
export async function readJsonStore(key: JsonStoreKey): Promise<string | null> {
  const pathname = JSON_STORE[key];

  if (useBlobStorage()) {
    const blob = await readFromBlob(pathname);
    if (blob !== null) return blob;
  }

  try {
    const raw = await readFile(localPath(key), "utf8");
    console.log("[JsonStore] file read", { key, blob: useBlobStorage() });
    return raw;
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? (error as NodeJS.ErrnoException).code
        : undefined;
    if (code === "ENOENT") return null;
    throw error;
  }
}

/** Пишет JSON: Blob на Vercel, иначе файл data/*.json */
export async function writeJsonStore(key: JsonStoreKey, content: string): Promise<void> {
  const pathname = JSON_STORE[key];

  if (useBlobStorage()) {
    await writeToBlob(pathname, content);
    return;
  }

  if (process.env.VERCEL === "1") {
    console.error("[JsonStore] write blocked on Vercel without BLOB_READ_WRITE_TOKEN");
    throw new Error("storage_readonly");
  }

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(localPath(key), content, "utf8");
  console.log("[JsonStore] file write", { key, bytes: content.length });
}

export function isBlobStorageEnabled(): boolean {
  return useBlobStorage();
}
