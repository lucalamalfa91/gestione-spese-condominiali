---
name: gestione-spese-condominiali-design
description: Use this skill to generate well-branded interfaces and assets for Gestione Spese Condominiali (a professional, neutral condominium expense-management web app), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

Key files:
- `README.md` — product context, content fundamentals, visual foundations, iconography, index
- `colors_and_type.css` — all design tokens (colors, type, radii, shadows, spacing, motion; light + dark)
- `assets/` — logo mark, logo lockup, shared icon set (`icons.jsx`)
- `preview/` — design-system specimen cards
- `ui_kits/web-app/` — high-fidelity interactive recreation of the web app (real product CSS + JSX components)

Brand essentials: Italian-language, **professional and neutral**. Warm off-white surfaces,
single teal accent (`#01696f`), IBM Plex Sans type (Google Fonts), Lucide-style line icons (stroke 2,
round caps), tabular numerals for all euro amounts (it-IT format `1.234,56 €`), soft hairline
borders, minimal shadows, soft 16px card radii, one quiet ease-out for motion. No emoji, no
decorative gradients (except the faint login glow), no imagery. Sentence case copy.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create
static HTML files for the user to view. For production code, copy assets and read the rules here
to design as an expert in this brand. Reuse the UI kit components in `ui_kits/web-app/` and the
tokens in `colors_and_type.css` rather than reinventing.

If the user invokes this skill without other guidance, ask what they want to build or design,
ask a few focused questions, and act as an expert designer who outputs HTML artifacts or
production code, depending on the need.
