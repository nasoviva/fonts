# Artist Producer — Landing

Минималистичный лендинг продюсера художников (Next.js App Router, Tailwind v4, next-intl en/ru).

## Запуск

```bash
cd ~/Desktop/artist-producer
npm install
npm run dev
```

Откройте [http://127.0.0.1:3032](http://127.0.0.1:3032) после `npm run dev` — middleware перенаправит на `/en` или `/ru`.

**Сравнение шрифтов hero:** [http://127.0.0.1:3032/hero-font-preview.html](http://127.0.0.1:3032/hero-font-preview.html) (статика, надёжнее) или `/ru/hero-font-preview`.

## Структура

| Путь | Описание |
|------|----------|
| `/[locale]` | Главная (hero, about, services, portfolio, contact) |
| `/[locale]/gallery` | Галерея с фильтрами |
| `/[locale]/artwork/[slug]` | Страница работы + CTA-форма |
| `/[locale]/admin` | Вход (заглушка, без Supabase) |
| `/[locale]/admin/dashboard` | Таблица работ |
| `/[locale]/admin/artwork/new` | Добавление |
| `/[locale]/admin/artwork/[id]/edit` | Редактирование |

## Дизайн-система (`src/app/globals.css`)

- **Цвета:** `--color-ink` (#000), `--color-cream` (#f5f2eb)
- **Шрифты:** Playfair Display (display), Cormorant Garamond 300 italic (accent), Inter (body)
- **Токены:** `text-display`, `text-caption`, `text-subheader`, `text-body`, `text-lead`, `text-meta-label`
- **UI:** hairline borders, pill buttons, `rounded-3xl` images

## Локализация

Тексты в `messages/en.json` и `messages/ru.json`. Мок-данные работ — `src/data/artworks.ts`.

## Дальше

- Подключить Supabase Auth на `/admin`
- CRUD работ через Supabase Storage + DB
