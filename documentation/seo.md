# SEO

Настройка поисковой выдачи и превью в соцсетях для сайта Жанны Колесник.

## Что включено

- **Meta-теги**: `title`, `description`, `keywords`, canonical, `hreflang` для `en` / `ru`
- **Open Graph и Twitter Card**: заголовок, описание, изображение (портрет на главной, превью работы на карточке)
- **JSON-LD**:
  - главная: `WebSite`, `Person`, `ProfessionalService`
  - работа: `VisualArtwork` + `Offer` (доступно коллекционерам)
- **`/sitemap.xml`**: главная, галерея, все видимые работы × локали
- **`/robots.txt`**: индексация публичных страниц, закрыт `/api/` и `/[locale]/admin`

## Переменные окружения

В production задайте в `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Без этого URL в sitemap и OG будут `http://localhost:3000`.

## Тексты и ключевые слова

Редактируются в `messages/ru.json` и `messages/en.json`, секция `meta`:

- `keywords` — главная (через запятую)
- `galleryKeywords` — галерея
- `galleryTitle`, `galleryDescription`
- `artworkTitle`, `artworkDescription` — шаблоны с `{title}` и `{description}`

## Код

| Файл | Назначение |
|------|------------|
| `src/lib/seo.ts` | URL, alternates, `buildPageMetadata` |
| `src/lib/seo-json-ld.ts` | схемы Schema.org |
| `src/components/seo/JsonLd.tsx` | вставка JSON-LD в `<head>` |
| `src/app/sitemap.ts` | карта сайта |
| `src/app/robots.ts` | правила для роботов |

## После деплоя

1. Проверить [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Отправить sitemap в Google Search Console: `https://your-domain.com/sitemap.xml`
3. Проверить превью: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Админка

Страницы `/[locale]/admin/*` с `noindex, nofollow` — в поиск не попадают.
