#!/usr/bin/env node
/**
 * Делает все PNG-иконки круглыми (прозрачные углы).
 * Требует: python3 + pillow (`pip install pillow`)
 * Запуск: npm run icons:round
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const py = `
from PIL import Image, ImageDraw
from pathlib import Path

root = Path(${JSON.stringify(root)})
paths = [
    "public/favicon-16x16.png",
    "public/favicon-32x32.png",
    "public/apple-touch-icon.png",
    "public/android-chrome-192x192.png",
    "public/android-chrome-512x512.png",
    "src/app/icon.png",
    "src/app/apple-icon.png",
]

def make_round(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, w - 1, h - 1), fill=255)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    out.save(path, "PNG")
    print("[icons:round]", path.relative_to(root))

for rel in paths:
    make_round(root / rel)

imgs = [
    Image.open(root / "public/favicon-32x32.png").convert("RGBA").resize((s, s), Image.Resampling.LANCZOS)
    for s in (16, 32, 48)
]
imgs[0].save(root / "public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=imgs[1:])
imgs[0].save(root / "src/app/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=imgs[1:])
print("[icons:round] favicon.ico")
`;

execSync(`python3 -c ${JSON.stringify(py)}`, { stdio: "inherit", cwd: root });
