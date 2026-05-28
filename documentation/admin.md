# Admin panel

## Routes

| URL | Description |
|-----|-------------|
| `/[locale]/admin` | Login |
| `/[locale]/admin/dashboard` | Works table (protected) |
| `/[locale]/admin/artwork/new` | Add work (protected) |
| `/[locale]/admin/artwork/[id]/edit` | Edit work (protected) |
| `/[locale]/admin/taxonomy` | Categories & authors (protected) |

## Authentication

- Email + password checked against env vars `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- On success, an HMAC-signed session cookie `admin_session` is set (httpOnly, 7 days).
- Middleware redirects unauthenticated users away from protected routes.
- Logout clears the cookie via `POST /api/admin/logout`.

## Environment

Copy `.env.example` to `.env.local` and set:

```
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...   # min 16 characters
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Vercel (сохранение галочек, скрытие, редактирование работ)

На Vercel диск **только для чтения**. Без Blob Store все действия в таблице дают ошибку.

1. **Vercel** → ваш проект → **Storage** → **Create Database / Store** → **Blob**
2. **Connect to Project** — переменная `BLOB_READ_WRITE_TOKEN` появится автоматически
3. **Redeploy** production

Локально (`npm run dev`) файл `data/artworks.json` используется как раньше; Blob не нужен.

Default dev credentials (if unset): `admin@artistproducer.com` / `change-me`.

## API

- `POST /api/admin/login` — body: `{ "email", "password" }`
- `POST /api/admin/logout`

## Taxonomy (categories & authors)

- Stored in `data/taxonomy.json` (labels EN/RU).
- Public read: `GET /api/taxonomy`
- Admin write: `PUT /api/admin/taxonomy` (requires session)
- UI: `/admin/taxonomy` — add, edit, delete entries
- Cannot save if an artwork still references a removed category/author id

## Artworks (works list)

- Stored in `data/artworks.json` via `src/lib/artwork-store.ts`.
- Public list (visible only): `GET /api/artworks` — `Cache-Control: no-store`, `dynamic = force-dynamic`.
- Admin list (incl. hidden): `GET /api/admin/artworks`.
- Delete: `DELETE /api/admin/artworks/[id]` — removes from JSON immediately.
- Public gallery shows the same works as the admin table **except** rows marked hidden (`hidden: true`).
- After save / delete / hide in admin, the gallery and home portfolio update immediately (same tab or another open tab) via `notifyArtworksUpdated()` + server `revalidateArtworkPages()`.
- **Home featured:** column «На главной» / «Home» — **checkbox** per row (up to **4** visible works, `featuredOnHome: true`). Hidden works cannot be featured. Home «Gallery» block shows only featured works; if none are selected, only the heading and «All works» CTA appear.

## Future

- Replace env-based auth with Supabase Auth.
- Persist CRUD to Supabase instead of `data/artworks.json`.
