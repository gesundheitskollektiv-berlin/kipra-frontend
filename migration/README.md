# Kipra Kinderpraxis → Strapi migrations

One-shot scripts that push **embedded Jekyll snapshots** from [`geko-kinderpraxis`](../../../geko-kinderpraxis) (`collections/_blocks`, `_pages`, `_page_settings`, `_employees`, `_notifications`) into Strapi (`kipra-*` types). Sources are hardened as JS under `migration/data/` — the migration **does not read markdown from disk at runtime**.

## Configuration

Env vars (**required**: `STRAPI_URL`; **recommended**: `STRAPI_AUTH_TOKEN`):

| Variable | Purpose |
|---------|---------|
| `STRAPI_URL` | Strapi base URL; if unset, **`PUBLIC_STRAPI_URL`** from `kipra-frontend/.env` is used |
| `STRAPI_AUTH_TOKEN` | Strapi API token (Bearer); omit only if endpoints are open |
| `STRAPI_REQUEST_TIMEOUT_MS` | HTTP timeout per request (default `60000`); lower for faster failure on bad URLs |

Loading order (`dotenv`):

1. **`kipra-frontend/.env`** (same file the Svelte/Vite app uses — usually defines `PUBLIC_STRAPI_URL`).
2. **`kipra-frontend/.env.local`** (overrides 1.).
3. `migration/.env`
4. `migration/.env.local` (**overrides** the above)

If **`STRAPI_URL`** is unset but **`PUBLIC_STRAPI_URL`** is set (typical frontend layout), migrations copy it into **`STRAPI_URL`** (same URL normalisation as the app).

Strapi tokens: **`STRAPI_AUTH_TOKEN`** is preferred; legacy **`STRAPI_TOKEN`** is also accepted if **`STRAPI_AUTH_TOKEN`** is empty.

Example: [`migration/.env.example`](./.env.example).

Install dependencies once in **`migration/`** (axios, dotenv):

```bash
cd kipra-frontend/migration && npm install
```

## Script: `migrate:content`

From **`kipra-frontend`** (after `migration/npm install`):

```bash
npm run migrate:content
```

Equivalent:

```bash
cd kipra-frontend/migration && STRAPI_URL=… STRAPI_AUTH_TOKEN=… node migrate-content.js
```

### Selective runs (`--only`)

Run parts of the pipeline in isolation. Selected steps always run in the **default order** (meta → personnel → privacy → announcements → landing), no matter how you list them:

```bash
node migrate-content.js --only=personnel
node migrate-content.js --only news
node migrate-content.js --only announcements,landing
npm run migrate:content -- --only=privacy
```

Aliases: **`personnel`** (`persons`, `team`), **`privacy`** (`datenschutz`), **`announcements`** (`news`), **`landing`** (`page`). Run `node migrate-content.js --help` for details.

Writes in order (idempotent personnel / announcements where possible):

1. **`kipra-meta`** (`de`, `en`) — company/contact fields (banner upload left for manual CMS if needed).
2. **`kipra-personnels`** — **not** localized; upsert by `first_name` + `last_name`; **`position`** is **German only** (migration omits `locale` and never writes EN copy); images skipped. The `/en` layout still receives the same API rows (German roles) until you add UX translation if desired.
3. **`kipra-page-datenschutzerklaerung`** — privacy markdown → blocks (`de`, `en`); publishes.
4. **`kipra-announcements`** — merged “notifications” migration; deterministic DE title **`Diverses`** for lookups; **`is_urgent: false`** (`title` shown).
5. **`kipra-page-landing`** — **replaces** full `content` dynamic zone (`de`, `en`) with welcome → announcements strip → transcript **Sprechstunden** (`sprechstundenData.js`) → termine → kontakt → über uns → empfehlungen → footer (**`purple`** for lilac legacy, **`green`** footer).

API token permission must allow **find/create/update/publish** on those types (`meta`, Datenschutz, personnel, announcements, landing).

### Sprechzeiten fidelity

Timetables are transcribed into nested `kipra-page-blocks.sprechstunden` components (German includes **Telefonsprechzeiten** block; EN matches EN Jekyll shorthand). **`doctors`** on slots stays empty unless you extend the migration to relate personnel.

After changing schemas, rebuild Strapi (`npm run build` / `develop`) and re-run **`strapi ts:generate-types`** in your toolchain if you keep `types/generated` in sync.
