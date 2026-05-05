# Portfolio — Franek Orzechowski

This file is the source of truth for design direction and engineering conventions in this repo. Read it before making changes.

---

## 1. Project goal

A **one-page personal portfolio** for Franek Orzechowski — front-end developer with backend experience.

The site must feel:

- **Premium**, original, art-directed.
- **Non-template** — no generic AI aesthetics, no overused patterns.
- **Minimal and refined**, with one strong visual moment in the hero.
- **Polished and performant**, including on mobile.

Target language: Polish (PL only at launch). Code, identifiers, commit messages, file names: English.

---

## 2. Stack (locked-in)

- **Runtime / package manager:** Bun
- **Build:** Vite 8
- **Framework:** React 19 + TypeScript (strict)
- **Styling:** Tailwind v4 (CSS-first via `@theme` in `src/styles/globals.css`)
- **Animations:**
  - **Motion** — React component animations, gestures, layout, microinteractions
  - **GSAP + ScrollTrigger** — scroll-driven sequences, parallax, pin/scrub
  - **Lenis** — smooth scroll (wired via `src/lib/lenis.tsx`)
  - **React Three Fiber + Drei + postprocessing** — 3D hero scene
  - **split-type** — text reveals
- **Utilities:** `clsx` + `tailwind-merge` (use `cn` from `@/lib/cn`), `lucide-react`
- **Hosting:** Netlify (config in `netlify.toml`)
- **Forms:** Netlify Forms (contact form already wired with `data-netlify="true"` and honeypot)
- **Analytics:** none on launch (no cookies, no consent banner). Add later via env-gated script if needed.
- **Tooling:** ESLint flat · Prettier (with `prettier-plugin-tailwindcss`) · Husky · lint-staged · commitlint (conventional commits)

**Do not introduce:**

- CSS-in-JS libraries (styled-components, emotion, vanilla-extract, etc.)
- `cva` (use `cn` only)
- A CMS
- i18n libraries (until/unless explicitly asked)
- Next.js, Remix, or any other framework
- Test runners (until explicitly asked)

---

## 3. Design direction

### 3.1 Section rhythm

The page alternates **light** and **dark** sections to create rhythm and depth:

1. **Hero** — dark
2. **About** — light
3. **Services** — dark
4. **Selected projects** — light
5. **Skills / stack** — dark
6. **Process** — light
7. **Contact** — dark
8. **Footer** — light

- Light sections: airy, editorial, calm. Use `bg-paper text-ink` or the `.section-light` utility.
- Dark sections: premium, focused, elegant — **never cyberpunk or neon**. Use `bg-ink text-paper` or `.section-dark`.
- Transitions between them must feel intentional. Match spacing, typographic scale, and primary accents across both.

### 3.2 Color palette

Neutrals dominate. The morski (teal) primary is the unifying accent across both light and dark sections.

Defined in `src/styles/globals.css` under `@theme`:

- `--color-paper: #fafaf7` — light base (off-white)
- `--color-ink: #050505` — dark base (near-black)
- `--color-primary-50…950` centered on `#008B7A` (= `primary-600`)

Use Tailwind tokens: `bg-paper`, `bg-ink`, `text-paper`, `text-ink`, `bg-primary-600`, etc.

**Primary usage rules:**

- The primary color is an **accent**, not a fill. Most surfaces stay neutral.
- Use it for: small CTAs, hover states, focus rings, chart-like data viz, hero accents.
- Avoid filling large surfaces with primary.

### 3.3 Typography

- **Display / headings:** `Space Grotesk Variable` (`font-display`)
- **Body:** `DM Sans Variable` (`font-body`, default)
- **No italic, no oblique, no slanted text anywhere.** Enforced via `font-style: normal` in base layer.

**Type scale (defined in `@theme`):**

| Token          | Size | Use                               |
| -------------- | ---- | --------------------------------- |
| `text-2xs`     | 10px | overline labels, tags, fine print |
| `text-xs`      | 11px |                                   |
| `text-sm`      | 12px | body                              |
| `text-base`    | 13px | default body                      |
| `text-md`      | 14px | emphasized body, link labels      |
| `text-lg`      | 16px | small headings                    |
| `text-xl`      | 18px | sub-section heads                 |
| `text-2xl`     | 20px | section H2 (max in body sections) |
| `text-hero-lg` | 24px | **hero H1 ceiling**               |

- Hero typography: `text-hero-sm`/`md`/`lg` (20–24px). **Never exceed 24px anywhere on the page.**
- Body sections: cap at 20px (`text-2xl`).
- Tracking: tight on display (`tracking-tight`/`-0.02em`). Wide uppercase on overlines (`tracking-[0.32em]`).

### 3.4 Layout & spacing

- Wrap content with `container-page` (centers, max 1280px, padded).
- Compact, restrained spacing. No giant hero text. No big buttons.
- Use a 12-column grid (`md:grid-cols-12`) for body sections — typically `4 / 8` split (label vs content).
- Cards / blocks rounded — `rounded-xl`, `rounded-2xl`. **No square-only aesthetic.**
- No `//` slash motifs anywhere (no decorative slashes, no slash separators).

### 3.5 Animation rules

- The **hero is the only loud moment**. Expressive 3D scene, scroll cue, strong type entrance.
- After the hero, animations become **subtle**:
  - Reveal-on-scroll (small `y` offset, opacity fade)
  - Hover transitions (color, border, micro-scale ≤ 1.02)
  - Smooth section transitions (Lenis handles inertia)
- No loud effects outside the hero.
- Always respect `prefers-reduced-motion` — base CSS strips animations and `useReducedMotion()` hook short-circuits Lenis and complex sequences.
- Mobile: provide a static fallback for the 3D scene if FPS drops are observed (lazy-load the canvas, render a poster image otherwise).

### 3.6 Navbar

Inspired by [floema.com/en](https://floema.com/en):

- Pill-shaped, floating at top.
- Subtle backdrop-blur on scroll, transparent at top.
- Tight letter-spacing on uppercase nav items.
- Minimal: brand name on the left, nav center/right, single CTA ("Hire me") on the right.

### 3.7 Loading screen

- Simple, brand-only entry: small primary dot + name in display font on `bg-ink`.
- Fades out after ~1.6s. Used to mask the heaviest first paint (3D scene init).

### 3.8 Forbidden patterns

- Generic AI aesthetics: Inter/Roboto fonts, purple-on-white gradients, predictable hero layouts.
- Italic / oblique text.
- `//` slash decorative motifs.
- Neon, cyberpunk, glow-heavy dark sections.
- Type larger than 24px.
- Heavy drop-shadows. Use `shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)]`-style soft shadows when needed.
- CSS-in-JS or runtime CSS libraries.

---

## 4. Engineering conventions

### 4.1 Imports

- Use `@/` alias for everything inside `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).
- Use **named exports** for components (e.g., `export function Hero()`), except `App.tsx` which is `export default`.
- Use inline type imports: `import { useState, type ReactNode } from 'react'`.

### 4.2 Component patterns

- One component per file. Section files live at `src/sections/<Name>/index.tsx`.
- Compose Tailwind classes with `cn(...)` from `@/lib/cn`.
- Don't extract inline JSX into a new component unless there's real reuse or significant complexity.
- No comments in code unless asked. Self-documenting names instead.

### 4.3 Styling

- Tailwind utilities first. Custom CSS only in `globals.css` (theme tokens, base layer, named utilities).
- Theme additions go in the `@theme` block, not in a `tailwind.config.js` (Tailwind v4 is CSS-first).
- Section helpers: `.section-light`, `.section-dark`, `.container-page`.

### 4.4 TypeScript

- `strict` mode is on (via scaffold defaults). Don't disable rules locally without reason.
- Type props explicitly. Avoid `any`.
- Use `type` for prop shapes; reserve `interface` only when extending or declaration-merging.

### 4.5 Commits

- **Conventional commits**, enforced by commitlint:
  `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`, `ci:`, `build:`, `revert:`
- Use `feat:` for visual / styling / asset / design-token changes.
- Reserve `refactor:` for actual code restructuring.
- **Never** add `Co-Authored-By:` lines.

### 4.6 Pre-commit

- `bunx lint-staged` runs ESLint --fix and Prettier on staged files.
- `bunx commitlint` validates the commit message.

---

## 5. Section catalog

### Hero (`src/sections/Hero`)

- Full viewport, dark background.
- R3F canvas absolutely positioned behind the content layer.
- Headline, sub-copy, two CTAs, scroll cue.
- The strongest visual moment of the site.

### About (`src/sections/About`)

- Light, editorial. 4/8 split: section label / headline + paragraph.

### Services (`src/sections/Services`)

- Dark. 4/8 split. List of 3 capabilities, each as a row with title + short description.

### Projects (`src/sections/Projects`)

- Light. Section label + heading. 2-column grid of project cards.
- Each card: aspect-[4/3] visual block (currently a primary gradient placeholder), title, role + year, status tag.
- Hover: subtle border darken + 1px scale + soft shadow.

### Skills (`src/sections/Skills`)

- Dark. 4/8 split. Grouped tech stack: Core / Motion & 3D / Backend & infra / Tooling.

### Process (`src/sections/Process`)

- Light. 4/8 split. Numbered 4-step process (Discover, Direct, Build, Polish).

### Contact (`src/sections/Contact`)

- Dark. Heading + email + GitHub link, plus a Netlify Form (name, email, message).
- The form has `data-netlify="true"` and a `bot-field` honeypot.
- Submission email lands at `orzechowskifranek@gmail.com` once the form is detected by Netlify post-deploy.

### Footer (`src/sections/Footer`)

- Light. Compact bar with copyright + tech stack credit.

---

## 6. Performance budget

- Target LCP < 2.5s on a mid-tier mobile.
- Lazy-load anything heavy. The 3D canvas mounts inside Hero immediately — if it becomes a budget problem, gate it behind `Suspense` + dynamic import and provide a static poster fallback.
- Use `dpr={[1, 1.75]}` on the R3F canvas (already set) to cap on retina.
- Compress GLB assets with Draco when they're added (`@react-three/drei` includes the loader).
- Keep total JS shipped under ~250 kB gzipped if possible.

---

## 7. Accessibility

- All interactive elements must be reachable by keyboard.
- Color contrast: keep primary on dark/light backgrounds at AA minimum.
- Respect `prefers-reduced-motion` — already wired via base CSS and `useReducedMotion`.
- Forms: every input has a `<label>`. The Netlify honeypot is hidden visually but accessible to bots only.

---

## 8. Original design brief (verbatim, kept for reference)

> Do not make the whole page white. Instead, create a balanced rhythm of alternating light and dark sections.
> Hero stays the strongest visual moment; the rest of the page is minimal, subtle, refined.
> Compact layout, small UI, small typography, restrained spacing.
> White sections feel airy and editorial; dark sections feel premium and focused — never cyberpunk or neon.
> Project cards rounded; hover states subtle.
> Hero can be expressive; after the hero, animations become much more subtle (microinteractions, small reveals, hover transitions, smooth section transitions).
> Navbar inspired by floema.com/en.
> Heading font: Space Grotesk. Body font: DM Sans. No italic, no oblique, no slanted text. Small typography. Original, premium, non-template look.
> No `//` slash motifs anywhere.
> Polish copy at launch.

---

## 9. Open follow-ups

- Wire GSAP scroll reveals across sections (subtle).
- Replace project card placeholders with real visuals.
- Add a real OG image to `public/og.png` and reference it in `index.html`.
- Consider a custom cursor on desktop (cohesive with the morski accent).
- Decide on analytics: GoatCounter (no banner) is the recommended drop-in if/when needed.
