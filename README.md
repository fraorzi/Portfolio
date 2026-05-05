# Portfolio — Franciszek Orzechowski

One-page portfolio. React 19 + TypeScript + Tailwind v4 + Vite. Animations: Motion, GSAP/ScrollTrigger, Lenis, R3F (Three.js).

## Stack

- **Runtime / package manager:** Bun
- **Build:** Vite 8
- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind v4 (CSS-first, `@theme`)
- **Animation:** Motion · GSAP · Lenis · React Three Fiber + Drei + postprocessing · split-type
- **Hosting:** Netlify (with Netlify Forms for contact)
- **Tooling:** ESLint flat · Prettier · Husky · lint-staged · commitlint

## Scripts

```bash
bun run dev         # dev server
bun run build       # type check + production build
bun run preview     # preview built app
bun run lint        # eslint
bun run lint:fix    # eslint with autofix
bun run format      # prettier write
bun run typecheck   # tsc --noEmit
```

## Project structure

```
src/
  App.tsx
  main.tsx
  styles/globals.css       Tailwind v4 theme + base styles
  lib/                     cn util, Lenis provider
  hooks/                   useReducedMotion
  three/                   R3F scene, canvas
  components/
    nav/                   Navbar (floema-style)
    loading/               LoadingScreen
    ui/                    Section helper
  sections/                Hero, About, Services, Projects, Skills, Process, Contact, Footer
public/                    favicon, static assets
```

## Design direction

See `CLAUDE.md` for the full design brief.
