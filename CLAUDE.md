# Portfolio — Franciszek Orzechowski

Source of truth for design direction and engineering conventions. Read before making changes.

---

## 1. Project goal

One-page portfolio for Franciszek Orzechowski — front-end developer with backend experience.

The site must feel **editorial-warm**: creamy paper, tinted ink, magazine-like restraint, with one persistent 3D point field as the counterpoint. Premium, art-directed, non-template. Fast on mid-tier mobile.

Copy: Polish. Code, identifiers, commits, file names: English.

---

## 2. Stack (locked-in)

- **Runtime / package manager:** Bun
- **Build:** Vite 8 SPA + post-build prerender (`scripts/prerender.ts` renders `src/entry-server.tsx` into `dist/index.html`, inlines the CSS). `src/main.tsx` hydrates when `#root` has children.
- **Framework:** React 19 + TypeScript (strict)
- **Styling:** Tailwind v4, CSS-first via `@theme` in `src/styles/globals.css`
- **Animation:** Motion (`motion/react`) for everything React-side — variants, `whileInView`, `useScroll`/`useTransform`/`useSpring`, `layoutId`. Lenis for smooth scroll (`src/lib/lenis.tsx`, `src/lib/scroll.ts`).
- **3D:** vanilla `three` (no R3F) — one `Points` mesh with a custom `ShaderMaterial`, lazy-loaded. See §3.6.
- **UI primitives:** beUI (beui.dev) copied into `src/components/ui/` — TiltCard, Tabs, MorphingModal, TextReveal, AnimatedNumber, Button, StatefulButton. Imports rewritten to `@/lib/cn`, `@/hooks/useHoverCapable`, `@/lib/presenceGate`. Treat them as project code; edit freely.
- **Utilities:** `cn` from `@/lib/cn` (clsx + tailwind-merge), `lucide-react`
- **Hosting:** Netlify (`netlify.toml`), Netlify Forms for contact (`data-netlify="true"` + `bot-field` honeypot)
- **Perf tooling:** `react-scan` injected in dev by `vite.config.ts` (`REACT_SCAN=false` disables). `bun run doctor` / `bun run doctor:trace` run react-doctor.
- **Analytics:** none. No cookies, no consent banner.
- **Tooling:** ESLint flat · Prettier (+ tailwindcss plugin) · Husky · lint-staged · commitlint

**Do not introduce:** GSAP, React Three Fiber / drei, CSS-in-JS, `cva`, a CMS, i18n libraries, another framework, test runners, new UI libraries as dependencies (copy-paste only).

---

## 3. Design direction

### 3.1 Page rhythm

Sections are transparent. `document.body` background lerps paper ↔ ink as you scroll (`useSceneScroll` + `sceneProgress.bgMix`), and the 3D field sits `fixed` behind everything. Order and theme (`src/content/site.ts` `sections`):

1. Hero — dark · 2. About — light · 3. Services — dark · 4. Projects — light · 5. Skills — dark · 6. Process — light · 7. Contact — dark · Footer — light

Each section is wrapped in `SectionShell` (`src/components/layout/SectionShell.tsx`) which sets `id`, `data-theme`, `data-scene-index`, the folio (`01 / 07`) and its `SectionMark`. Semantic colors (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`) flip per `data-theme`; use them instead of hard-coding paper/ink inside sections.

### 3.2 Palette (`@theme`)

- `--color-paper: #f4f1ea`, `--color-paper-2: #ebe6da` (cards on light)
- `--color-ink: #12110f`, `--color-ink-2: #1c1a17` (cards on dark)
- `--color-primary-50…950` around `#0f6e63` (600). Accent only: CTAs, hover, focus ring, small marks, ~8% of scene points.
- `--color-ochre: #c89b3c` — decorative only (dot, folio, nav indicator, one cover field). Never as text color (contrast on paper ≈ 2.2:1).

Neutrals dominate; primary and ochre stay small.

### 3.3 Typography

- Hero H1 only: `font-cut` (Cut Grotesk, local woff2 in `public/fonts`). Web license still to confirm.
- Display / headings: `font-display` (Space Grotesk Variable). Body: `font-body` (DM Sans Variable, default).
- `font-style: normal` enforced in base layer — no italic anywhere.
- Scale: `text-2xs` 10px → `text-2xl` 20px for body sections; `text-hero-sm/md/lg` 20–24px for the hero. **24px is the ceiling on the page.**
- Tracking: `tracking-tight` on display; `.eyebrow` utility (uppercase, `0.32em`) for overlines.

### 3.4 Layout & spacing

- `container-page` wraps content (max 1280px). Body sections use `md:grid-cols-12`, usually 4/8 or 5/7.
- Compact UI, small type, restrained spacing. Radii `rounded-xl` / `rounded-2xl`.
- No decorative `//` slashes.

### 3.5 Motion rules

Hero is the loud moment; everything after is one characteristic move per section, then quiet:

- **Hero** — TextReveal per character, scroll cue as a drawing line.
- **About** — paragraph reveals word-by-word with scroll (`useScroll`, opacity 0.25 → 1); monogram draws in.
- **Services** — rows wipe in with `clip-path`, rule line draws, AnimatedNumber metrics.
- **Projects** — cards alternate in from left/right with ±1.5° rotation; TiltCard on hover; MorphingModal for detail.
- **Skills** — chips spring in radially while the point field condenses into a lattice.
- **Process** — desktop: pinned horizontal scrub of 4 steps with an SVG rail drawing (`useScroll` + `useSpring`); mobile: vertical, no pin.
- **Contact** — labels slide up, underline draws, StatefulButton idle → loading → success/error.
- **Footer** — static; local time ticks.

Hover: color / border / scale ≤ 1.02. `prefers-reduced-motion`: base CSS strips animation, `useReducedMotion()` disables Lenis, scene falls back to poster.

### 3.6 Scene (`src/scene/`)

- `Scene.tsx` picks a tier (`quality.ts`: high 24k / mid 9k / poster) from `deviceMemory`, `hardwareConcurrency`, pointer + viewport; downgrades on slow frames (`pointField.ts` probe after 2.5 s). Poster is `ScenePoster.tsx` (SVG, desktop only).
- `targets.ts` builds 7 target buffers (sphere, page, rings, cloud, lattice, helix, dust); `shaders.ts` morphs between `floor(uProgress)` and `+1` with noise drift. `uProgress` and `bgMix` come from `sceneProgress` (`src/lib/sceneProgress.ts`), driven by `useSceneScroll`.
- Point color lerps ink ↔ paper with the background; ~8% primary, ~1% ochre. Pointer parallax on fine pointers only. dpr ≤ 1.5 desktop, 1 on mobile.
- Keep the scene calm: no bursts, no bloom, no neon.

### 3.7 Shell

- **Navbar** — floema-style pill, beUI Tabs with `layoutId` indicator in ochre, active section from `useActiveSection` (IntersectionObserver). Theme follows the active section.
- **Loader** — monogram draw + name on ink, ~1.15 s hold, slides up. It masks scene init; hero `TextReveal` starts after it.
- **Marks** (`src/components/marks/`) — `Monogram` (FO, also favicon), `SectionMark` (7 glyphs, one stroke family), `ProjectCover` (generative SVG seeded by slug: contours / weave / halftone / arcs).

### 3.8 Forbidden

Inter/Roboto, purple gradients, italic, `//` motifs, neon or glow-heavy dark, type > 24px, heavy shadows (use `shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)]`-style), large primary fills, ochre text, runtime CSS libraries.

---

## 4. Engineering conventions

### 4.1 Imports & exports

- `@/` alias for everything in `src/`.
- Named exports for components; `App.tsx` is the only default export.
- Inline type imports: `import { useState, type ReactNode } from 'react'`.

### 4.2 Components & content

- One component per file. Sections at `src/sections/<Name>/index.tsx`, always wrapped in `SectionShell`.
- All copy and section metadata live in `src/content/site.ts`. Sections import from there; no inline Polish strings.
- Compose classes with `cn(...)`. Extract a component only for real reuse or real complexity.
- No code comments unless asked.

### 4.3 SSR safety

Everything renders on the server via `renderToString`. Rules that keep hydration clean:

- Browser-only values (time, `matchMedia`, `window`) go through `useMounted`, `useMediaQuery`, or `useSyncExternalStore`; never read them during render.
- No `setState` inside effects to "detect client"; use the hooks above.
- Motion `initial` props are fine (they render as inline styles). Anything that must be visible before JS must not start hidden.

### 4.4 Styling

Tailwind utilities first. Custom CSS only in `globals.css`: `@theme` tokens, `@theme inline` semantic colors, base layer, named utilities (`container-page`, `eyebrow`). Semantic colors over raw paper/ink inside sections.

### 4.5 TypeScript

`strict`. Explicit prop types with `type`; `interface` only for extension/merging. No `any`.

### 4.6 Commits

Conventional commits, enforced by commitlint. `feat:` for visual / styling / asset / token changes; `refactor:` only for real restructuring. Never add `Co-Authored-By:`.

### 4.7 Pre-commit

`bunx lint-staged` (ESLint --fix + Prettier) and `bunx commitlint` run via Husky.

---

## 5. Performance budget

- Initial JS ≈ 140 kB gz (React + Motion + Lenis + app). `three` chunk (~127 kB gz) loads lazily after hydration, only on canvas tiers. Total ≈ 267 kB gz — over the 250 kB goal; the only big lever left is replacing `three` with raw WebGL.
- Lighthouse mobile (preview build): 90–100 depending on throttling method; LCP is the prerendered hero H1.
- Before merging perf-sensitive changes: `bun run build`, then Lighthouse mobile against `bunx vite preview`, plus `bun run doctor`.
- Known react-doctor noise to ignore: `use-lazy-motion` (deliberate), anchor targets (ids are dynamic), beUI's `will-change` and `AnimatePresence` patterns, `prefer-html-dialog` (MorphingModal).

---

## 6. Accessibility

- Keyboard reachable everything; focus ring in `primary-500`.
- AA contrast: primary-600 on paper 5.4:1, paper on ink ≥ 15:1. Ochre never carries text.
- Decorative SVGs are `aria-hidden`; covers are decorative (title sits beside them).
- Every form input has a `<label>`; honeypot hidden visually.
- Loader is `role="status"`; the page behind it is `inert` until it exits.

---

## 7. Open follow-ups

- Confirm Cut Grotesk web license.
- Real project list (slug, role, year, stack, link) in `src/content/site.ts`.
- Optional: raw-WebGL point field to drop the `three` chunk and land under 250 kB gz.
- Optional: `LazyMotion` + `m` components if Motion's share needs trimming.
- Analytics if ever needed: GoatCounter (no banner).
