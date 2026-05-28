# Hero font preview

Сравнение шрифтов для строки с именем в hero-блоке (Zhanna Kolesnik / Жанна Колесник).

## Варианты

- Great Vibes
- Great Vibes (swap)
- Poiret One
- Cormorant Garamond (300 italic)
- Roboto (300 italic)
- Bad Script
- Marck Script
- Без имени (только роль, без строки имени)

Переключатель **EN / RU** — тексты hero на двух языках.

## Статика (без Next.js)

Файл `public/hero-font-preview.html` — самодостаточная страница (Google Fonts через CDN).

Положите в `public/` основного проекта или откройте через любой static server:

```bash
npx serve public
# → /hero-font-preview.html
```

## Next.js (artist-producer)

Скопируйте дерево `src/` в основной проект (пути совпадают):

```
src/lib/hero-font-preview-fonts.ts
src/components/preview/HeroFontPreview.tsx
src/app/[locale]/(preview)/hero-font-preview/
public/hero-font-preview.html
```

Маршруты: `/en/hero-font-preview`, `/ru/hero-font-preview`.

Зависимости в основном проекте: `next/font/google`, `next-intl`, компоненты `Section`, `cn`, i18n `Link` / `usePathname`, namespace `hero` в `messages/en.json` и `messages/ru.json`, CSS-токены `text-hero-script`, `text-display`, `bg-ink`, `text-cream` в `globals.css`.
