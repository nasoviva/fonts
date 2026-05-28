#!/usr/bin/env node
/**
 * Портрет из Instagram: https://www.instagram.com/p/DD_ALSdOVAc/
 * Запуск: npm run fetch:producer
 *
 * Если не сработало — откройте пост, сохраните фото (img_index=2) как:
 * public/images/zhanna-kolesnik.jpg
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const POST_URL = "https://www.instagram.com/p/DD_ALSdOVAc/?img_index=2";
const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images",
  "zhanna-kolesnik.jpg",
);

const UA = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
};

mkdirSync(dirname(out), { recursive: true });

function pickUrlFromHtml(html) {
  const patterns = [
    /property="og:image" content="([^"]+)"/,
    /"og:image":"([^"]+)"/,
    /"display_url":"([^"]+)"/,
    /"src":"(https:\\\/\\\/[^"]+?scontent[^"]+)"/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) {
      return m[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    }
  }
  return null;
}

async function fromOembed() {
  const api = `https://api.instagram.com/oembed?url=${encodeURIComponent(POST_URL)}`;
  const res = await fetch(api, { headers: UA });
  if (!res.ok) return null;
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json.thumbnail_url ?? null;
  } catch {
    return null;
  }
}

async function fromPageHtml() {
  const res = await fetch(POST_URL, { headers: UA });
  if (!res.ok) return null;
  const html = await res.text();
  return pickUrlFromHtml(html);
}

let imageUrl = await fromOembed();
if (!imageUrl) imageUrl = await fromPageHtml();

if (!imageUrl) {
  console.error(
    "Не удалось скачать с Instagram автоматически.\n\n" +
      "Сделайте вручную:\n" +
      "1. Откройте https://www.instagram.com/p/DD_ALSdOVAc/?img_index=2\n" +
      "2. Сохраните нужное фото\n" +
      "3. Положите в public/images/zhanna-kolesnik.jpg\n" +
      "4. Обновите страницу (Cmd+Shift+R)\n",
  );
  process.exit(1);
}

console.log("[fetch:producer]", imageUrl);
const imgRes = await fetch(imageUrl, { headers: UA });
if (!imgRes.ok) {
  console.error("Download failed:", imgRes.status);
  process.exit(1);
}
const buf = Buffer.from(await imgRes.arrayBuffer());
writeFileSync(out, buf);
try {
  execSync(`sips -Z 1200 "${out}"`, { stdio: "ignore" });
} catch {
  /* optional */
}
console.log(`Saved ${out} (${(buf.length / 1024).toFixed(0)} KB)`);
