# Cerebri Sans Pro (WOFF2)

Fonts live under **`src/lib/assets/fonts/`** (same as geko-frontend). `src/typography.scss` references them via Vite with `$lib/assets/fonts/...` so they are bundled with correct URLs for dev and production.

Required files:

- `CerebriSansPro-Regular.woff2`
- `CerebriSansPro-Bold.woff2`
- `CerebriSansPro-ExtraBold.woff2`

Copy from `geko-frontend/src/lib/assets/fonts/` or your licensed source. If you cannot commit binaries, copy them into `src/lib/assets/fonts/` in CI before `yarn build` (e.g. from secrets or object storage).
