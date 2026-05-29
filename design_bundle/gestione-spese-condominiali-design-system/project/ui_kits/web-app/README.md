# UI Kit — Web App (Gestione Spese Condominiali)

A high-fidelity, interactive recreation of the condominium expense web app. Built by reading
the real source (`gestione-spese-condominiali/`): `index.html` markup, `css/app.css` tokens,
and `js/render.js` composition logic. The stylesheet (`app.css`) is the **actual product CSS**,
copied verbatim, so visuals are pixel-accurate.

## Run
Open `index.html`. Loads React 18 + Babel from CDN and IBM Plex Sans from Google Fonts.

## What's interactive
- **Login** → click *Accedi* to enter the app (any credentials).
- **Nav** (rail on desktop, bottom nav + FAB on mobile) switches the four views.
- **House switcher** in the header swaps between two sample properties (different fiscal cycles).
- **Movimenti → Dovuti / Versamenti**: add a record; tables, period totals, dashboard metrics
  and badges all recompute live.
- **Theme**: user menu → *Cambia tema* (or the sun on login) toggles light/dark.
- **User menu**, sub-nav tabs (Dovuti · Versamenti · Import banca · Situazione), settings forms.

## Components

| File | Exports | Notes |
|---|---|---|
| `Icons.jsx` | `Icon` | Lucide-style line icon set (exact product paths) |
| `Data.jsx` | `fmt`, `fmtSigned`, `SAMPLE_HOUSES`, `houseTotals`, `Badge`, `periodStatus` | it-IT EUR formatting, sample data, status pills |
| `Login.jsx` | `Login` | Login screen with brand lockup + theme toggle |
| `Shell.jsx` | `Shell` | Nav rail, sticky header, house switcher, user menu, bottom nav, FAB |
| `Overview.jsx` | `Overview` | Panoramica: metric cards, annual table, scadenzario |
| `Movimenti.jsx` | `Movimenti` | Dovuti/Versamenti forms + tables, Import banca, Situazione |
| `Settings.jsx` | `Dati`, `Impostazioni` | Backup/registro + immobili/account |

Components share scope via `window` assignment (each Babel script is isolated). Each script
must be loaded before the one that uses it — see the order in `index.html`.

## Fidelity notes
- Tokens, spacing, radii, shadows, and component classes come straight from `app.css`.
- The "Movimenti" nav glyph uses the same Lucide currency path as the product (reads as an
  S-curve) — kept faithful to source rather than swapped for a literal € sign.
- These are cosmetic recreations: forms mutate local React state only; there's no Supabase,
  no Excel parsing, no persistence. Out-of-scope flows (recovery, real bank import) are
  represented statically.
