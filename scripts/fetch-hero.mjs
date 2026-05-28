#!/usr/bin/env node
/**
 * Скачивает Reggianini «Admiration» в public/images/hero-reggianini.jpg
 * Запуск: npm run fetch:hero
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const url =
  "https://upload.wikimedia.org/wikipedia/commons/8/8b/Admiration%2C_by_Vittorio_Reggianini.jpg";

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images",
  "hero-reggianini.jpg",
);

mkdirSync(dirname(out), { recursive: true });

const res = await fetch(url, {
  headers: { "User-Agent": "artist-producer/1.0 (local setup)" },
});
if (!res.ok) {
  console.error(`Failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const buf = Buffer.from(await res.arrayBuffer());
writeFileSync(out, buf);
try {
  execSync(`sips -Z 1920 "${out}"`, { stdio: "ignore" });
} catch {
  /* optional: macOS sips */
}
const { size } = await import("node:fs").then((fs) => fs.statSync(out));
console.log(`Saved ${out} (${(size / 1024).toFixed(0)} KB)`);
