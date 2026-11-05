# SensiBrew — Development rules for AI agents

Single source of truth for any AI (Cursor, Claude Code, opencode…) working on
this repo. Read it fully before changing anything. If a request conflicts with
these rules, point out the conflict and ask.

## 1. Guiding principle: KISS

- Always ship **the simplest solution that works**. Between two options, pick
  the one with fewer moving parts.
- **No premature abstractions**: no layers, services, contexts, generic hooks
  or "just in case" helpers. Write direct code first; extract only when the
  same logic repeats **three times**.
- **One way to do each thing**: reuse what already exists before adding a new
  pattern (see section 5).
- **New dependencies only if they remove real complexity**, and justify them
  in your answer. If CSS, static data or ~20 lines of TS solve it, install
  nothing.
- Prefer **static data and generated CSS/SVG/emoji** over databases, APIs or
  image assets.
- Small, reviewable changes. Do not refactor what was not requested.

## 2. Stack (this is NOT Next.js)

- **Vite 8 + React 19 + strict TypeScript** (SPA, no SSR).
- **Tailwind CSS v4** (`@import 'tailwindcss'` + `@theme` in `src/index.css`,
  no `tailwind.config`).
- **vite-plugin-pwa** (Workbox precache, offline-first), **Recharts**,
  **Framer Motion**, **Lucide React**, **react-router-dom**.
- **No backend, no database, no Zod, no state library.** Data is static JSON
  bundled with the app.

## 3. Language policy (strict)

| What | Language |
| --- | --- |
| Identifiers (variables, functions, types, props), file and folder names | English |
| Comments and JSDoc | English |
| JSON keys and enum values (`'meat'`, `'light'`) | English |
| CSS classes/hooks, `data-*` attributes, `localStorage` keys, element ids | English |
| Visible UI text, `aria-label`, `alt`, page titles/meta | **Spanish** |
| Data text values (style descriptions, dish names, glass names) | **Spanish** |
| URLs (`/estilo/:id`) | **Spanish** (public, indexed in `public/sitemap.xml`) |

Never mix languages inside an identifier (`toggleCategoria` is wrong,
`toggleCategory` is right).

## 4. Naming conventions

- `camelCase` for variables, functions, props and JSON keys.
- `PascalCase` for components, types and interfaces.
- `SCREAMING_SNAKE_CASE` for module-level constant tables (`SORT_ORDERS`,
  `DISH_CATEGORIES`, `SRM_SCALE`).
- One exported component per file, file named after it (`BeerCard.tsx`).
- Hooks start with `use` and live in `src/hooks/`.
- Named exports only (except `App` default export used by `main.tsx`).

## 5. Project structure and existing building blocks

```
src/
├── data/beers-2021.json   # BJCP 2021 catalog
├── data/beers-2015.json   # BJCP 2015 catalog
├── data/beers.ts          # catalogs, getCategories, getBeerById, searchBeers
├── types/beer.ts          # the single data model: Beer (+ Guide, Range…)
├── lib/srm.ts             # srmMid, srmToColor, shade, SRM_GRADIENT
├── lib/range.ts           # formatRange
├── lib/pairing.ts         # DISH_CATEGORIES (labels, icons, gradients)
├── lib/storage.ts         # readStorage / writeStorage (never throw)
├── hooks/                 # useBeers, useInstallPrompt, usePageMeta
├── components/            # flat folder, no sub-folders
└── pages/                 # Home, BeerDetail, NotFound
```

Reuse these instead of re-implementing:

- `localStorage` → `readStorage` / `writeStorage`. Never call it directly
  (the inline theme script in `index.html` is the only exception).
- SRM color → `srmToColor(srmMid(range))`.
- Page title/description → `usePageMeta`.
- Section headings → `SectionTitle`. Primary button → `btn-accent` utility.
  Panels → `glass-panel` utility.

## 6. Data model

- There is **one** model: `Beer` in `src/types/beer.ts`. Do not add parallel
  models; extend `Beer` and both JSON files together.
- Ranges are `[min, max]` tuples or `null` (variable). Radar intensity is 0–5.
- `glass.type` values are Spanish and are keys of `SILHOUETTES` in
  `BeerGlass.tsx`; adding a new glass means adding its silhouette.
- JSON is cast with `as unknown as Beer[]` in `data/beers.ts`; keep the shape
  in sync with the type.

## 7. Styling

- Use the theme tokens `sb-*` (`bg-sb-bg`, `text-sb-muted`, `border-sb-border`…)
  so light/dark themes work. Theme switches via `html[data-theme='light']`.
- Palette: `slate`/`zinc` backgrounds + `amber`/`yellow` accents. Never
  `gray`/`stone`.
- Images: generate them with CSS/SVG/emoji. No heavy assets unless asked.

## 8. Accessibility and motion (mandatory)

- ARIA roles on tabs (`tablist`/`tab`/`tabpanel`), arrow-key navigation,
  `focus-visible` rings on every interactive element.
- Respect `prefers-reduced-motion` (`useReducedMotion()` from Framer Motion
  and the CSS media query).
- Animate with Framer Motion; never animate Recharts' internal `<path>`
  elements — animate the container.

## 9. Git (hard rule: read-only)

- **NEVER run `git commit`, `git push`**, or anything that creates history or
  publishes the repo (`gh repo create`, `gh release`, CLI deploys). The person
  always does history and pushes, even if asked in the moment: remind them of
  the commands and stop there.
- Do not run `git add`, `git mv`, `git rm` or otherwise modify the index:
  leave changes in the working tree for review. Move files with plain `mv`.
- Read-only git only when asked: `status`, `diff`, `log`, `show`, `remote -v`.
- Never rewrite history (`push --force`, `reset --hard`, `filter-branch`) or
  touch credentials, tokens or SSH keys.

## 10. Verification (after every change)

```bash
npm run check   # TypeScript + oxlint
npm run build   # production build + service worker
```

A task is **not done** if `check` or `build` fail. The Husky pre-commit hook
runs `npm run lint && npm run build`; never bypass it with `--no-verify`
without a justified reason.

## 11. Out of scope (unless explicitly requested)

Automated tests, Prettier, backend/DB, i18n libraries, additional UI or state
libraries, and new data models.
