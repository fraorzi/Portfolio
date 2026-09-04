# Portfolio — Franciszek Orzechowski

Source of truth for design direction and engineering conventions. Read before making changes.

---

## 1. Project goal

One-page portfolio for Franciszek Orzechowski — front-end developer with backend experience.

The site must feel **editorial-warm**: creamy paper, tinted ink, magazine-like restraint, with one persistent particle thread as the counterpoint. Premium, art-directed, non-template. Fast on mid-tier mobile.

Copy: Polish. Code, identifiers, commits, file names: English.

---

## 2. Stack (locked-in)

- **Runtime / package manager:** Bun
- **Build:** `bun run build` = `scripts/fetch-github.ts` → `tsc -b` → `vite build` → `scripts/prerender.ts` (renders `src/entry-server.tsx` into `dist/index.html`, inlines the CSS). `src/main.tsx` hydrates when `#root` has children.
- **Framework:** React 19 + TypeScript (strict)
- **Styling:** Tailwind v4, CSS-first via `@theme` in `src/styles/globals.css`
- **Animation:** Motion (`motion/react`) for everything React-side — variants, `whileInView`, `useScroll`/`useTransform`, `layoutId`, `AnimatePresence`. Lenis for smooth scroll (`src/lib/lenis.tsx`, `src/lib/scroll.ts`; `lockScroll` for modals).
- **3D:** vanilla `three` (no R3F) — one `Points` mesh with a custom `ShaderMaterial`, lazy-loaded. See §3.6.
- **UI primitives:** beUI (beui.dev) copied into `src/components/ui/` — `TextReveal`, `Button`, `StatefulButton`. Treat them as project code; edit freely. Cards, modal and navbar are bespoke.
- **GitHub data:** `src/lib/github.ts` (REST, optional `GITHUB_TOKEN`), `scripts/fetch-github.ts` writes `src/data/github.json` at build time, `src/lib/repoStore.ts` (`useSyncExternalStore`) serves it and refreshes client-side after hydration. Netlify build needs `GITHUB_TOKEN` to avoid rate limits; the cached JSON is the fallback.
- **Utilities:** `cn` from `@/lib/cn` (clsx + tailwind-merge), `lucide-react`, `src/lib/time.ts` (Polish relative dates)
- **Hosting:** Netlify (`netlify.toml`), Netlify Forms for contact (`data-netlify="true"` + `bot-field` honeypot)
- **Perf tooling:** `react-scan` injected in dev by `vite.config.ts` (`REACT_SCAN=false` disables). `bun run doctor` / `bun run doctor:trace` run react-doctor.
- **Analytics:** none. No cookies, no consent banner.
- **Tooling:** ESLint flat · Prettier (+ tailwindcss plugin) · Husky · lint-staged · commitlint

**Do not introduce:** GSAP, React Three Fiber / drei, CSS-in-JS, `cva`, a CMS, i18n libraries, another framework, test runners, new UI libraries as dependencies (copy-paste only).

---

## 3. Design direction

### 3.1 Page rhythm

Sections have fixed backgrounds (`bg-background` flips per `data-theme`); the page never lerps colour. The particle field sits `fixed` behind everything (`z-10`) and is the only thing that changes colour with scroll. Order and theme (`src/content/site.ts` `sections`):

1. Hero — dark · 2. About — light · 3. Projects — dark · 4. Scope — light · 5. Recent — dark · 6. Contact — light · Footer — dark

Each section is wrapped in `SectionShell` (`src/components/layout/SectionShell.tsx`): `id`, `data-theme`, `data-scene-index`, `min-h-svh`, content centred on desktop and bottom-aligned on mobile (top 36svh belongs to the particle shape). It also exposes `--section-bg` / `--section-fg` so nested elements (project card island) can match the parent surface. Semantic colours (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`) over raw paper/ink inside sections.

**No folios, section numbers, eyebrows, mini-titles or tag rows.** Headings carry the section on their own.

### 3.2 Palette (`@theme`)

- `--color-paper: #f4f1ea`, `--color-paper-2: #ebe6da` (cards on light)
- `--color-ink: #12110f`, `--color-ink-2: #1c1a17` (cards on dark)
- `--color-primary-50…950` around `#0f6e63` (600). Accent only: CTAs, hover, focus ring, monogram dot, ~8% of scene points, one language swatch.
- `--color-ochre: #c89b3c` — decorative only (nav indicator dot, ~1% of points, one language swatch). Never as text colour (contrast on paper ≈ 2.2:1).

Neutrals dominate; primary and ochre stay small.

### 3.3 Typography

- Display / headings: `font-display` (Space Grotesk Variable). Body: `font-body` (DM Sans Variable, default). Both local woff2 in `public/fonts`. No third face.
- `font-style: normal` enforced in base layer — no italic anywhere.
- Scale: `text-2xs` 10px → `text-2xl` 20px for body sections; `text-hero-sm/md/lg` 20–24px for the hero. **24px is the ceiling on the page.**
- Tracking: `tracking-tight` on display; uppercase labels use `tracking-[0.16em]`–`[0.2em]`.

### 3.4 Layout & spacing

- `container-page` wraps content (max 1280px). Body sections use `md:grid-cols-12`, usually 4/8 or 5/7.
- Compact UI, small type, restrained spacing. Radii `rounded-xl` / `rounded-2xl`; pills `rounded-full`.
- No decorative `//` slashes.

### 3.5 Motion rules

Hero is the loud moment; everything after is one characteristic move per section, then quiet:

- **Hero** — `TextReveal` per character after the loader.
- **About** — paragraph reveals word-by-word with scroll (`useScroll`, opacity 0.18 → 1); monogram draws in.
- **Projects** — card fades/rises in; island `i` opens `ProjectModal` via shared `layoutId` (card morphs into the modal, modal is a different, denser design). Placeholder card for the next project.
- **Scope** — rows wipe in with `clip-path`, rule line draws, tool chips.
- **Recent** — weekly bars `scaleY` in, commits stagger in.
- **Contact** — labels slide up, underline draws, `StatefulButton` idle → loading → success/error.
- **Footer** — static; local time ticks.

Hover: colour / border / scale ≤ 1.02. `prefers-reduced-motion`: base CSS strips animation, `useReducedMotion()` disables Lenis, scene falls back to poster.

### 3.6 Scene (`src/scene/`)

- `Scene.tsx` picks a tier (`quality.ts`: high 24k / mid 9k / poster) from `deviceMemory`, `hardwareConcurrency`, pointer + viewport; downgrades on slow frames (`pointField.ts` probe after 2.5 s). Poster is `ScenePoster.tsx` (SVG knot, `mix-blend-difference`, desktop only).
- `targets.ts` builds one line-based shape per section — knot, orbit, braid, rings, helix, coil — plus a vertical `thread`. Shapes are placed beside content (right column on desktop, top band on mobile) via the `layout` object.
- `shaders.ts`: `uProgress` is the sum of boundary crossings (0 → 5). Between integers the points collapse into the thread and re-form as the next shape (`viaThread`), so a section boundary on screen reads as a line running between sections.
- Colour: per point, `mix(uInk, uPaper, theme)` where `theme` is chosen by the point's NDC y against `uSplitY` (the nearest section edge on screen, from `src/lib/sceneProgress.ts`). Points above the edge take the theme of the section above, below take the one below. ~8% primary, ~1% ochre.
- `sceneProgress.offset`: how far the current section's top has scrolled past the viewport (≤ 0.55 vh); `pointField.ts` moves the camera so the shape scrolls away with its section instead of hovering over text.
- Pointer parallax on fine pointers only. dpr ≤ 1.5 desktop, 1 mobile. Keep it calm: no bursts, no bloom, no neon.

### 3.7 Shell

- **Navbar** — gooey morphing pill (`Navbar.tsx`): two identical `layout`-animated layers, one under an SVG `feGaussianBlur` + `feColorMatrix` filter for the blob, one crisp for content. Monogram pill + label pill; hover/focus expands to the list on desktop, tap toggles on touch. Pill theme is the inverse of the active section. Active item from `useActiveSection`.
- **Loader** — monogram draw + name on ink, ~1.15 s hold, slides up. It masks scene init; hero `TextReveal` starts after it.
- **Marks** (`src/components/marks/`) — `Monogram` (F + O with a primary dot; also favicon and About mark), `ProjectCover` (generative SVG seeded by slug).

### 3.8 Forbidden

Inter/Roboto, purple gradients, italic, `//` motifs, neon or glow-heavy dark, type > 24px, heavy shadows (use `shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)]`-style), large primary fills, ochre text, runtime CSS libraries, folios/eyebrows/section numbering, "role · location" tag rows.

---

## 4. Engineering conventions

### 4.1 Imports & exports

- `@/` alias for everything in `src/`.
- Named exports for components; `App.tsx` is the only default export.
- Inline type imports: `import { useState, type ReactNode } from 'react'`.

### 4.2 Components & content

- One component per file. Sections at `src/sections/<Name>/index.tsx`, always wrapped in `SectionShell`. Section-local pieces (`ProjectCard`, `ProjectModal`, `LanguageBar`) live next to their section.
- All copy and section metadata live in `src/content/site.ts`. Sections import from there; no inline Polish strings (including `aria-label`s).
- Compose classes with `cn(...)`. Extract a component only for real reuse or real complexity.
- No code comments unless asked.

### 4.3 SSR safety

Everything renders on the server via `renderToString`. Rules that keep hydration clean:

- Browser-only values (time, `matchMedia`, `window`) go through `useMounted`, `useMediaQuery`, or `useSyncExternalStore`; never read them during render.
- No `setState` inside effects to "detect client"; use the hooks above.
- Motion `initial` props are fine (they render as inline styles). Anything that must be visible before JS must not start hidden.
- GitHub data renders from `src/data/github.json` on the server; relative dates render as absolute until mounted.

### 4.4 Styling

Tailwind utilities first. Custom CSS only in `globals.css`: `@theme` tokens, `@theme inline` semantic colours, base layer, named utilities (`container-page`). Semantic colours over raw paper/ink inside sections.

### 4.5 TypeScript

`strict`. Explicit prop types with `type`; `interface` only for extension/merging. No `any`.

### 4.6 Commits

Conventional commits, enforced by commitlint. `feat:` for visual / styling / asset / token changes; `refactor:` only for real restructuring. Never add `Co-Authored-By:`.

### 4.7 Branches

Short, descriptive, slash-separated names (`fix/loading-scroll-hero`), never a `codex/` prefix.

### 4.8 Pre-commit

`bunx lint-staged` (ESLint --fix + Prettier) and `bunx commitlint` run via Husky.

---

## 5. Performance budget

- Initial JS ≈ 140 kB gz (React + Motion + Lenis + app). `three` chunk (~127 kB gz) loads lazily after hydration, only on canvas tiers. Total ≈ 267 kB gz — over the 250 kB goal; the only big lever left is replacing `three` with raw WebGL.
- Lighthouse mobile (preview build): 90–100 depending on throttling method; LCP is the prerendered hero H1.
- Before merging perf-sensitive changes: `bun run build`, then Lighthouse mobile against `bunx vite preview`, plus `bun run doctor`.
- Known react-doctor noise to ignore: `use-lazy-motion` (deliberate), anchor targets (ids are dynamic), beUI's `will-change` and `AnimatePresence` patterns. Lighthouse `errors-in-console` 403 = GitHub rate limit on the client refresh; cached JSON covers it.

---

## 6. Accessibility

- Keyboard reachable everything; focus ring in `primary-500`.
- AA contrast: primary-600 on paper 5.4:1, paper on ink ≥ 15:1. Ochre never carries text.
- Decorative SVGs are `aria-hidden`; covers are decorative (title sits beside them).
- Every form input has a `<label>`; honeypot hidden visually.
- Loader is `role="status"`; the page behind it is `inert` until it exits.
- `ProjectModal`: `role="dialog"`, `aria-modal`, Escape closes, focus moves in and back, body scroll locked.

---

## 7. Open follow-ups

- Second project: fill the placeholder card once a repo exists (`projects` in `src/content/site.ts`).
- Set `GITHUB_TOKEN` in Netlify env so build-time fetch never falls back to the cached JSON.
- Optional: raw-WebGL point field to drop the `three` chunk and land under 250 kB gz.
- Optional: `LazyMotion` + `m` components if Motion's share needs trimming.
- Analytics if ever needed: GoatCounter (no banner).
