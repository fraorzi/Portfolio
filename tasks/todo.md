# Portfolio — TODO

Living plan. Update as things land or new ideas drop in. Tick `[x]` when done.

---

## ✅ Done

### Scaffold

- [x] Stack: React 19 + Vite 8 + TS + Tailwind v4 + Bun
- [x] 8 section shells: Hero, About, Services, Projects, Skills, Process, Contact, Footer
- [x] Loading screen (Motion) — multi-stage jet-trail descent + curtain reveal
- [x] Floema-style navbar (pill, blur on scroll)
- [x] Lenis smooth scroll provider
- [x] `useReducedMotion` hook
- [x] Paleta morski + typografia (Space Grotesk + DM Sans)
- [x] ESLint flat / Prettier / Husky / lint-staged / commitlint
- [x] Netlify Forms contact + honeypot
- [x] `netlify.toml` + security headers
- [x] `CLAUDE.md` design brief
- [x] Push do GitHub
- [x] Rename `Franek` → `Franciszek` w całej bazie
- [x] Hero R3F: interaktywna konstelacja cząsteczek (click-to-burst, parallax, breathing)
- [x] Hide global scrollbar

---

## 🚧 W trakcie / kolejka

### Hero polish

- [ ] Text reveal split-type na headline
- [ ] Scroll cue animation (subtelna pętla / nudge)
- [ ] Mobile fallback dla canvas (poster img + lazy `Suspense`)

### Animacje (subtle, po hero)

- [x] GSAP ScrollTrigger reveals na każdej sekcji (mały `y` + opacity fade)
- [ ] Hover transitions polish na project cards (są bazowo, dopieścić)
- [ ] Opcjonalny pin/scrub gdzieś dla rytmu

### Assets

- [ ] `public/og.png` — prawdziwy OG image + ref w `index.html`
- [ ] Realne wizualizacje project cards (zamiast gradient placeholdera)
- [ ] Favicon — upiększyć

---

## ⏸️ Odłożone (świadomie na później)

### Deploy — Netlify (dziś później, jak będzie konto)

- [ ] Założyć konto Netlify
- [ ] Połączyć repo z Netlify (auto-deploy z `main`)
- [ ] Verify: Netlify wykrywa form po deployu

### Treść — placeholdery → real (PL) — na sam koniec

- [ ] **About** — prawdziwy paragraf PL o sobie
- [ ] **Services** — 3 prawdziwe capabilities z opisami
- [ ] **Projects** — 4 prawdziwe projekty (tytuł, rola, rok, status, link)
- [ ] **Skills** — przejrzeć listę techu i dopiąć
- [ ] **Process** — przejrzeć 4 kroki
- [ ] **Contact** — prawdziwy email + GitHub link (zamiast placeholderów)
- [ ] **Cała strona po PL** (teraz mix EN/PL — Hero copy nadal EN)

---

## 💡 Nice-to-have / backlog

- [ ] Custom cursor desktop (morski accent)
- [ ] GoatCounter analytics (no banner) — kiedyś
- [ ] Lazy-load 3D canvas (jeśli LCP wymaga)
- [ ] Real OG image generator (np. dynamic via edge function)

---

## 📝 Notatki / ideas (wrzucaj tu spontaniczne)

- _(puste — dorzucaj co przyjdzie do głowy, potem promuj do sekcji wyżej)_

---

## 🔄 Review log

Krótkie podsumowanie po każdej zamkniętej partii. Format: `YYYY-MM-DD — co zrobione`.

- 2026-05-07 — Reconstructed plan into living todo.md
- 2026-05-07 — GSAP ScrollTrigger reveals: `lib/gsap.ts`, Lenis↔ScrollTrigger sync via gsap ticker, `useScrollReveal` hook, applied `data-reveal` to About/Services/Projects/Skills/Process/Contact

---

## Gooey navbar — korekty (2026-09-16, `feat/gooey-navbar`)

- [x] Mobile: łączniki między elementami w jednej linii pod łącznikiem hamburgera (`right-3.5`)
- [x] Mobile: elementy 148×44 → 120×40, krok 60 → 56, hamburger i logo 40 px
- [x] Desktop: logo i pille 44 → 40 px wysokości
- [x] Desktop: pille 88 → 80 px szerokości
- [x] Desktop: szyjka między pillami 8 → 12 px (`waist = thickness/2 - 6`)
- [x] Czarny nav: nieaktywne labele w kolorze foreground (`in-data-[theme=dark]:text-foreground`), jasny nav bez zmian

### Review

Zmiany w `Navbar.tsx` (stałe `MOBILE_SIZE/WIDTH/STEP`, wysokość kontenera filtra liczona z `navItems.length`), `GooeyNav.tsx`, `lib/gooeyNav.ts`. Typecheck, eslint, prettier czyste. Zweryfikowane w przeglądarce przez pomiar DOM i zrzuty na 1024 px i 375 px.

---

## Scena, czytelność i meta (2026-10-02, `fix/scene-readability-meta`)

- [x] Kolor cząsteczek na krawędzi sekcji: `uSplitY` liczone w klatce renderu z bieżącego `scrollY` (dziś canvas jest klatkę za DOM, przy szybkim scrollu Lenisa linia zostaje ~10-15% w tyle)
- [x] About: reveal słowo po słowie kończy się wcześniej (`end 45%` → `end 60%`)
- [x] Cząsteczki na tekście: usunąć nieograniczony obrót `elapsed * 0.02` (po kilku minutach kształty przejeżdżają nad tekst), helisa w Recent poza listą commitów; pomiar pokrycia tekstu na desktopie i mobile
- [x] Em dashe: copy w `site.ts`, `index.html`, wiadomości commitów z GitHuba
- [x] Meta: absolutne URL-e (Netlify `URL`), canonical, `og:url`, `og:site_name`, alt obrazka, author, apple-touch-icon, JSON-LD; nowy `og.png` zgodny z obecnym designem

### Review

- Kolor: `useSceneScroll` → `useSceneLayout` (tylko pomiar sekcji), `readSceneFrame()` w ticku `pointField.ts`. Test: przewinięcie w rAF i odczyt pikseli z WebGL w następnej klatce. Przed: krawędź DOM 300 px, zmiana koloru 450 px. Po: 300/300, 550/550, 200/200; w trakcie scrolla Lenisa zgodność co do 4 px.
- Nachodzenie: obrót to parallax + `sin` (±0.08 rad); orbita wokół monogramu, oplot pod kartami, helisa pionowo w lewej kolumnie Recent; mesh skalowany szerokością treści / wysokością (0.6-1.2); offset sekcji jako przesunięcie w przestrzeni ekranu (`uShift`) zamiast ruchu kamery, bez wygładzania; mobile: pas kształtów wyżej (`shiftY 1.4`, `scale 0.55`), mniejsza spirala. Pomiar: rzut punktów kontra prostokąty tekstu (pad 6-8 px) dla 1024×768, 1280×800, 1440×700, 1440×900, 1512×945, 1920×1080, 2560×1440, 768×1024, 360×640, 375×812, 390×664, 430×932, przy każdej pozycji scrolla z ukształtowaną figurą: 0% (najgorszy przypadek z parallaxem 1.7% przy 1440×700). Realny render WebGL 1440×900: 0% pikseli cząsteczek na tekście we wszystkich sekcjach.
- Reveal About: ostatnie słowo ma krycie 1.00 przy dole akapitu na 60% ekranu (0.72 przy 62%).
- Em dashe: 0 w DOM, atrybutach i `<head>`; wiadomości commitów normalizowane w `github.ts` (`—` → `-`).
- Meta: build z `URL=https://franciszek-test.netlify.app` daje absolutne canonical/OG/Twitter/JSON-LD, brak `%SITE_URL%` w `dist/index.html`. Nowe `og.png` (1200×630) i `apple-touch-icon.png` (180×180) narysowane z geometrii `targets.ts` i fontów strony.
- Typecheck, lint (1 stare ostrzeżenie w `StatefulButton.tsx`), Prettier czyste.
