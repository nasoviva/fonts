# Home page layout

Order of sections (top to bottom):

1. **Hero** — intro, CTA, hero image
2. **Quote** — light band, quotation (inline quote marks on mobile)
3. **Directions** — «Направления работы» / areas of work (4 items)
4. **About** — portrait + bio (`#about`), photo right
5. **Services** — titled block «С кем я работаю»; cream cards with **Подробнее** → `/artists`, `/collectors` and primary CTA
6. **Portfolio preview** — up to 4 featured works (`featuredOnHome` in admin); checkbox in admin table
7. **Marquee** — `ART CONSULTING` (faster on viewports ≤767px)
8. **Contact** — form (`#contact`)

Detailed audience copy lives on dedicated pages:

- `/[locale]/artists` — `audience.artists` in `messages/*.json`
- `/[locale]/collectors` — `audience.collectors`

Nav: **For Artists** / **For Collectors** → those routes (not home hashes).

Images: `SITE_IMAGES` in `src/data/site-images.ts`.
