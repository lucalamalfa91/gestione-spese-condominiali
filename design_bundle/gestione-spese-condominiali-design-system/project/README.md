# Gestione Spese Condominiali — Design System

A design system for **Gestione Spese Condominiali** — a static web app for managing
condominium (HOA) expenses across multiple properties. The product is Italian-language,
single-owner, and deliberately **professional and neutral**: warm paper surfaces, a single
teal accent, IBM Plex Sans type, and quiet Lucide-style line icons. No marketing flourish — this
is a focused administrative tool.

> Brief from the owner: *"deve essere una platform professionale e neutra"* — it must be a
> professional, neutral platform. Keep that north star: restraint over decoration.

---

## What the product is

A logged-in owner manages one or more **immobili** (properties/houses). For each house they
record **dovuti** (amounts owed, e.g. budget quotes, balances, adjustments) and **versamenti**
(payments made), organized by a configurable **esercizio fiscale** (fiscal year, e.g. a
June–May cycle labelled `2024/2025`). The app computes per-year and overall **saldo** (balance:
eccedenza / debito / pareggio — surplus / debt / break-even), shows aggregate dashboard metrics,
and can **import an Excel "Lista Operazioni" from Banca Intesa** to match bank movements to
fiscal periods. Data persists to Supabase (Postgres + Row Level Security), deployed statically
on Vercel. Light/dark themes; fully responsive (nav rail on desktop, bottom nav + FAB on mobile).

**Primary surfaces (one product):**
- **Login / password-recovery** screens
- **App shell** — nav rail + header + main, with four top-level views:
  - **Panoramica** (overview/dashboard) — metrics, annual summary table, scadenzario
  - **Movimenti** (transactions) — Dovuti · Versamenti · Import banca · Situazione
  - **Dati** (data) — Backup (JSON import/export) · Registro
  - **Impostazioni** (settings) — Immobili · Account

---

## Sources used to build this system

Everything here was derived from the real product code, not screenshots.

- **GitHub repo:** https://github.com/lucalamalfa91/gestione-spese-condominiali
  *(The reader is encouraged to explore this repo directly — it is the canonical source for
  tokens, markup, and behavior. Build new designs against it for highest fidelity.)*
- **Local codebase** (mounted read-only): `gestione-spese-condominiali/`
  - `css/app.css` — the complete token system + component styles (source of truth for tokens)
  - `index.html` — full app shell markup, login, sheets, nav, forms
  - `js/render.js` — how metrics, tables, badges, and rows are composed
  - `js/utils.js` — currency/number formatting (`it-IT`, EUR)
  - `council/domain-context.md` — domain glossary, stakeholders, data model

---

## Index — files in this design system

| Path | What it is |
|---|---|
| `README.md` | This file — context, content + visual foundations, iconography, index |
| `colors_and_type.css` | All design tokens: colors, type scale, radii, shadows, spacing, motion (light + dark) |
| `SKILL.md` | Agent Skill manifest — load this to design as this brand |
| `assets/logo-mark.svg` | House mark (stroke, `currentColor`) |
| `assets/logo-lockup.svg` | Full brand lockup: chip + "Condominio / Gestione spese" |
| `assets/icons.jsx` | Shared React icon set (exact paths from the app) |
| `preview/*.html` | Design-system specimen cards (colors, type, components, etc.) |
| `ui_kits/web-app/` | High-fidelity recreation of the web app (index.html + JSX components) |

---

## CONTENT FUNDAMENTALS

**Language.** Italian only. All UI copy, labels, and microcopy are in Italian. Keep new copy
in Italian unless explicitly asked otherwise.

**Voice & person.** Direct and informal-but-respectful. The app addresses the user with the
informal **"tu"** in feedback (e.g. *"Sei in eccedenza"* / *"Sei in debito"* — "you're in
surplus / in debt") but stays businesslike in instructions. No exclamation marks, no hype,
no personality quirks. It reads like a calm, competent ledger.

**Casing.** **Sentence case** everywhere for titles, headings, and buttons
(*"Nuovo dovuto"*, *"Riepilogo annualità"*, *"Salva modifiche"*). The **only** uppercase is
the tracked **eyebrow/label** style — table column heads and small section labels are
`UPPERCASE` with `letter-spacing: .08em` (e.g. table `TH`, metric labels are sentence case but
muted). Buttons are sentence case, not Title Case, not UPPERCASE.

**Tone & vibe.** Quiet, precise, administrative. Trust comes from accuracy, not friendliness.
Numbers are king — everything orbits euro amounts and balances.

**Copy patterns & specifics:**
- **Buttons** are verbs/short phrases: *"Salva dovuto"*, *"Esporta JSON"*, *"Conferma import
  selezionati"*, *"Annulla modifica"*, *"Elimina casa"*. Add-actions use a literal `+` prefix:
  *"+ casa"*, *"+ Dovuto"*, *"+ Nuova casa"*.
- **Section subtitles** are one calm sentence ending in a period: *"Confronto per esercizio
  fiscale."*, *"Registra quote per esercizio fiscale."*, *"Esporta o importa backup JSON."*
- **Empty states** are plain and instructive: *"Nessun dovuto registrato."*, *"Nessun immobile
  registrato. Usa + Nuova casa per iniziare."*
- **Placeholders** show real examples: *"es. 2024/2025"*, *"Appartamento Milano"*,
  *"Preventivo, saldo, conguaglio…"*, *"Bonifico, contanti…"* (note the ellipsis character `…`).
- **Status words** are a fixed vocabulary: **Eccedenza** (surplus, success), **Debito** (debt,
  error), **Pareggio** (break-even, warning).
- **Currency** is always formatted `it-IT` EUR: `1.234,56 €` (comma decimal, dot thousands,
  trailing €, via `Intl.NumberFormat('it-IT', { style:'currency', currency:'EUR' })`).
- **Fiscal year labels** read like `2024/2025`.

**Emoji:** none. Never. The brand uses line icons only.

---

## VISUAL FOUNDATIONS

**Overall vibe.** Warm, calm, paper-like neutrality with one cool teal accent. Think
"well-kept accountant's ledger" rather than "fintech startup." Generous whitespace, soft
hairline borders, almost no shadow. Nothing shouts.

**Color.**
- Surfaces are a family of **warm off-whites** (`#f7f6f2` canvas → `#f9f8f5` cards →
  `#fbfbf9` inputs → `#f3f0ec` offset). They are not pure white — they carry a slight cream warmth.
- Text is a **warm near-black** `#28251d`, muted text `#7a7974`.
- A single brand accent: **teal `#01696f`** (hover `#0c4e54`), with a soft tint
  `#cedcd8` used as the fill behind active nav items, the logo chip, and primary highlights.
- Semantic trio, each with a desaturated highlight tint behind it:
  **success green `#437a22`**, **warning rust `#964219`**, **error magenta `#a12c7b`**.
  Note error is a magenta-leaning rose, not a fire-engine red — keep it.
- **Dark theme** inverts to warm charcoals (`#171614` canvas) with a lighter teal `#4f98a3`.
- Color is used sparingly: accent for interactive/active states, semantic colors only for
  balance status and badges. Bodies of screens are neutral.

**Typography.**
- One family: **IBM Plex Sans** (Google Fonts) at weights 400/500/600/700. Fallback `system-ui`.
- Fluid `clamp()` scale: xs → xl. Page titles use **700 (bold)**; metric values are 700 with
  tabular lining numerals. Panel titles 600. Body 400.
- **Numerals are always `font-variant-numeric: tabular-nums lining-nums`** in tables, metrics,
  and amounts so euro columns align — this is a defining detail.
- Tight tracking on big titles (`-0.01em`); wide tracking (`.08em`) only on uppercase eyebrows.

**Spacing.** A simple rem ramp: `.5 / .75 / 1 / 1.25 / 1.5 / 2`. Content max width 1200px,
centered. Nav rail 240px, header 72px.

**Backgrounds.** Flat warm color. **No imagery, no full-bleed photos, no patterns or textures,
no gradients** — with one tiny exception: the login screen uses a faint
`radial-gradient(circle at top, teal@12% → bg)` glow. That's the only gradient in the system.
Do not introduce decorative gradients elsewhere.

**Borders.** Hairline, low-contrast. Most are `1px solid rgba(0,0,0,.08)` or the
`--color-divider` token. Inputs use `rgba(0,0,0,.1)`. Borders do the structural work that
shadows would in a heavier UI.

**Corner radii.** Soft and consistent: inputs/buttons/small `md .5rem`, nav items & list rows
`lg .75rem`, cards & panels `xl 1rem`, pills/badges/avatars/FAB `full`. Cards are noticeably
rounded (16px).

**Cards.** `--color-surface` fill, `1px rgba(0,0,0,.08)` border, `--shadow-sm` (a barely-there
`0 1px 2px rgba(40,37,29,.06)`), `xl` radius, `--space-5` padding. Light and airy, not floaty.

**Shadow / elevation system.** Deliberately minimal:
- `--shadow-sm` — default for cards, menus' resting elevation.
- `--shadow-menu` (`0 8px 32px rgba(0,0,0,.12)`) — dropdowns, bottom sheets.
- `--shadow-fab` (`0 8px 24px rgba(1,105,111,.28)`) — the teal FAB, tinted with the brand color.
- No inner shadows. No layered/dramatic shadows.

**Transparency & blur.** Used purposefully: the sticky **header** and mobile **bottom nav**
use `color-mix(... 88–92%, transparent)` + `backdrop-filter: blur(8–10px)` so content scrolls
softly beneath. Modal **backdrops** are `rgba(0,0,0,.35)`. Active/hover tints use
`color-mix(in srgb, var(--color-primary) N%, transparent)` rather than hardcoded colors.

**Hover states.** Subtle. Buttons lift `translateY(-1px)`. Primary darkens to
`--color-primary-hover`. Nav/list/menu rows get a `--color-surface-offset` (or
`--color-primary-highlight` for nav) background. Links get a tinted background on hover.
No color-flips, no scale-ups.

**Press / active states.** Active nav items get a `--color-primary-highlight` fill plus a
`color-mix(primary 28%)` border. Disabled buttons drop to `opacity:.65` and remove the lift.

**Focus.** Visible and accessible: `outline: 2px solid var(--color-primary); outline-offset: 2px`
on `:focus-visible` for all interactive controls. Keep this — accessibility is intentional.

**Motion.** One easing: `--transition: 180ms cubic-bezier(0.16, 1, 0.3, 1)` (a soft ease-out).
Transitions apply to background, border, and transform only. Subviews fade in with a 200ms
`fadeIn` (opacity + 4px translateY). **No bounces, no springs, no long animations.** Quiet and quick.

**Layout rules.** Desktop: fixed 240px nav rail (full height) + sticky blurred header + scrolling
main, max 1200px centered. ≤860px: nav rail hides, a blurred **bottom nav** (4 tabs) and a teal
**FAB** appear; quick-add opens a bottom **sheet**; house management opens a right **drawer**.
Hit targets are ≥44px everywhere (inputs, buttons, nav). `env(safe-area-inset-*)` respected.

**Tables.** Borderless except bottom hairline rows; uppercase muted `TH`; tabular numerals;
amounts right-meaning emphasis via weight and semantic color (`.positive` green / `.negative` error).

**Badges.** Pill-shaped (`radius-full`), tiny (`text-xs`), semantic highlight-tint background +
matching text color. Three flavors: `success` / `warn` / `error`.

---

## ICONOGRAPHY

**System.** Hand-inlined **Lucide-style** line icons (Lucide is the clear lineage — the paths
match Lucide's grid). They are **inline `<svg>`**, never an icon font, never PNGs, never emoji,
never Unicode glyph icons.

**Style specs (match these exactly for any new icon):**
- `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`.
- Stroke width **2** for UI icons; **1.8** for the logo/brand house mark.
- `stroke-linecap="round"`, `stroke-linejoin="round"` (round caps/joins).
- Sized 18–22px in nav/buttons; color inherits via `currentColor` (teal in nav-icon chips,
  muted/ink elsewhere).

**Icons actually used in the product** (see `assets/icons.jsx` for exact paths):
- **House** — brand mark / logo (`M4 20V8.5L12 4l8 4.5V20` + door).
- **Grid (2×2 rects)** — Panoramica / overview.
- **Euro** — Movimenti / transactions.
- **Database (cylinder)** — Dati.
- **Gear / settings** — Impostazioni.
- **Sun** — theme toggle.
- **Lock** — password recovery.
- **Chevron-down** — menus / selects.
- **Plus** — add actions / FAB.

**Logo.** A teal house mark inside a `radius-lg`–`12px` chip filled with
`--color-primary-highlight`, paired with a two-line wordmark *"Condominio / Gestione spese"*.
See `assets/logo-lockup.svg` and `assets/logo-mark.svg`.

**Recommendation for new work.** Pull additional icons from **Lucide** (https://lucide.dev) —
stroke-width 2, round caps — to stay perfectly on-brand. Do **not** mix in filled/duotone icon
sets, and never substitute emoji.
