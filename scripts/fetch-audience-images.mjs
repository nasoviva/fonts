#!/usr/bin/env node
/**
 * Секции «Художникам» / «Коллекционерам» — живопись (PD, Wikimedia).
 * Запуск: npm run fetch:audience
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
const UA = { "User-Agent": "artist-producer/1.0 (local setup)" };

const assets = [
  {
    name: "audience-artists.jpg",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Marie-Denise_Villers_-_Young_Woman_Drawing_-_Google_Art_Project.jpg",
    label: "Villers — Young Woman Drawing",
  },
  {
    name: "audience-collectors.jpg",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Interior_view_of_the_Saatchi_Gallery%2C_London.jpg",
    label: "Saatchi Gallery interior, London",
  },
];

mkdirSync(root, { recursive: true });

for (const { name, url, label } of assets) {
  const out = join(root, name);
  console.log(`[fetch:audience] ${label}`);
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(out, buf);
  try {
    execSync(`sips -Z 1400 "${out}"`, { stdio: "ignore" });
  } catch {
    /* optional */
  }
  console.log(`  → ${out} (${(buf.length / 1024).toFixed(0)} KB)`);
}

console.log("[fetch:audience] done");
