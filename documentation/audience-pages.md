# Audience detail pages

## Routes

| Locale path | Component | Copy namespace |
|-------------|-----------|----------------|
| `/en/artists`, `/ru/artists` | `AudienceDetailPageContent` (`namespace="artists"`) | `audience.artists` |
| `/en/collectors`, `/ru/collectors` | `AudienceDetailPageContent` (`namespace="collectors"`) | `audience.collectors` |

## Behaviour

- Back link → home (`audiencePage.back`)
- CTAs (equal width via `CTA_BUTTON_CLASS`): artists → contact; collectors → gallery + contact (`hero.ctaContact`)
- Images: `SITE_IMAGES.audienceArtists` / `audienceCollectors` with archive fallback on error

## Home cards

`ServicesSection` links **Learn more** / **Подробнее** to these pages. Short descriptions stay on the home cards; full paragraphs only on detail pages.
