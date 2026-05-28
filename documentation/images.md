# Image loading

## Favicon & PWA icons

Monogram **ZK** — **круглая** маска (прозрачные углы), фон `#121212` внутри круга. Пересобрать: `npm run icons:round` (нужен `pip install pillow`).

| File | Use |
|------|-----|
| `src/app/favicon.ico` | Next.js auto favicon |
| `src/app/icon.png` | Tab / UI icon (32×32 source) |
| `src/app/apple-icon.png` | iOS home screen |
| `public/favicon-16x16.png`, `favicon-32x32.png` | Explicit sizes in metadata |
| `public/apple-touch-icon.png` | Apple touch (180×180) |
| `public/android-chrome-*.png` | `site.webmanifest` |
| `public/site.webmanifest` | PWA manifest |

Regenerate from source: [favicon.io](https://favicon.io) or replace files in `public/` and `src/app/`.

# Image loading

## `ContentImage`

All public images use `src/components/ui/ContentImage.tsx`:

- **Local** (`/images/…`, `/uploads/artworks/…`) — Next.js optimizer (WebP/AVIF, resized `sizes`).
- **External** (http/https) — `unoptimized`, browser loads directly (Wikimedia, Picsum).
- **`priority`** — no lazy load, `loading="eager"` (hero, first cards on home/gallery).
- **Placeholder** — parent has `aspect-ratio` + `bg-ink-muted` so layout does not jump.

## Priority counts

See `src/lib/image-loading.ts`:

- Home portfolio: 4 eager images.
- Gallery page 1: 6 eager, rest lazy.

## Preload

`src/app/[locale]/layout.tsx` preloads hero and producer portrait.

## Admin uploads

Prefer images ≤ 2000px wide; optimizer serves smaller variants to the browser.
