export type SectionTheme = 'light' | 'dark';

export type SectionId =
  | 'hero'
  | 'about'
  | 'services'
  | 'projects'
  | 'skills'
  | 'process'
  | 'contact';

export type SectionMeta = {
  id: SectionId;
  index: number;
  label: string;
  theme: SectionTheme;
};

export const sections: readonly SectionMeta[] = [
  { id: 'hero', index: 0, label: 'Start', theme: 'dark' },
  { id: 'about', index: 1, label: 'O mnie', theme: 'light' },
  { id: 'services', index: 2, label: 'Zakres', theme: 'dark' },
  { id: 'projects', index: 3, label: 'Projekty', theme: 'light' },
  { id: 'skills', index: 4, label: 'Stack', theme: 'dark' },
  { id: 'process', index: 5, label: 'Proces', theme: 'light' },
  { id: 'contact', index: 6, label: 'Kontakt', theme: 'dark' },
];

export const navItems = sections.filter((s) => s.id !== 'hero');

export const contact = {
  email: 'orzechowskifranek@gmail.com',
  github: 'https://github.com/fraorzi',
  githubLabel: 'github.com/fraorzi',
  city: 'Warszawa',
  timeZone: 'Europe/Warsaw',
};

export const hero = {
  eyebrow: 'Front-end developer · Polska',
  title: 'Interfejsy z rytmem: umiar, ruch i detal, który zostaje w pamięci.',
  lead: 'Franciszek Orzechowski — front-end developer z zapleczem backendowym. Wybrane projekty, proces i sposób myślenia o sieci.',
  primaryCta: 'Zobacz projekty',
  secondaryCta: 'Napisz do mnie',
  scrollCue: 'Przewiń',
};

export const about = {
  title:
    'Front-end developer z zapleczem backendowym. Skupiam się na interfejsach, które są dopracowane i szybkie.',
  body: 'Pracuję głównie w React i TypeScript. Interesuje mnie motion design, 3D w przeglądarce i te małe decyzje, przez które produkt wydaje się przemyślany. Znam też drugą stronę — Node, Java, bazy danych — więc z backendem rozmawiam bez tłumacza.',
};

export type Service = {
  title: string;
  body: string;
  metric: { value: number; suffix: string; label: string };
};

export const services: readonly Service[] = [
  {
    title: 'Inżynieria interfejsów',
    body: 'Produkcyjne UI w React, TypeScript i Tailwind. Systemy komponentów, dostępność i wydajność mierzona, a nie zakładana.',
    metric: { value: 250, suffix: ' kB', label: 'budżet JS po gzip' },
  },
  {
    title: 'Motion i 3D',
    body: 'Scroll-driven storytelling, mikrointerakcje i sceny WebGL, które trzymają klatki również na telefonie.',
    metric: {
      value: 60,
      suffix: ' fps',
      label: 'cel na urządzeniach mobilnych',
    },
  },
  {
    title: 'Partnerstwo produktowe',
    body: 'Współpraca z designerami od konceptu do wdrożenia: doprecyzowanie flow, dopieszczenie detali, decyzje oparte na danych.',
    metric: { value: 4.5, suffix: ':1', label: 'minimalny kontrast tekstu' },
  },
];

export type Project = {
  slug: string;
  title: string;
  role: string;
  year: string;
  tag: string;
  description: string;
  detail: string;
  stack: readonly string[];
  href?: string;
};

export const projects: readonly Project[] = [
  {
    slug: 'lift-log',
    title: 'Lift Log',
    role: 'Expo · React Native',
    year: '2026',
    tag: 'Mobilna',
    description:
      'Aplikacja na iPhone do planowania treningów siłowych, zapisywania serii i śledzenia progresu w czasie.',
    detail:
      'Offline-first, lokalna baza z synchronizacją w tle. Wykresy progresu liczone przyrostowo, żeby lista historii otwierała się natychmiast nawet po roku treningów.',
    stack: ['Expo', 'React Native', 'SQLite', 'Reanimated'],
  },
  {
    slug: 'image-forge',
    title: 'Image Forge',
    role: 'React · Narzędzia obrazów',
    year: '2025',
    tag: 'Narzędzie',
    description:
      'Narzędzie do optymalizacji zdjęć, konwersji formatów, usuwania tła i przygotowywania assetów do publikacji.',
    detail:
      'Przetwarzanie w Web Workerach, kolejka zadań z podglądem na żywo. WebP i AVIF przez WASM, bez wysyłania plików na serwer.',
    stack: ['React', 'Web Workers', 'WASM', 'Vite'],
  },
  {
    slug: 'studio-panel',
    title: 'Studio Panel',
    role: 'Next.js · Strapi · MySQL',
    year: '2025',
    tag: 'Full-stack',
    description:
      'Panel z autoryzacją, rolami użytkowników, CMS-em w Strapi i bazą MySQL dla treści oraz danych aplikacji.',
    detail:
      'Role i uprawnienia na poziomie pól, audyt zmian, podgląd treści przed publikacją. Frontend w Next.js z cache per rola.',
    stack: ['Next.js', 'Strapi', 'MySQL', 'Auth.js'],
  },
  {
    slug: 'webhook-operations',
    title: 'Webhook Operations',
    role: 'Java · Spring Boot · MySQL',
    year: '2026',
    tag: 'Backend',
    description:
      'Platforma do odbierania webhooków, walidacji podpisów HMAC, ponawiania zdarzeń i podglądu pracy systemu.',
    detail:
      'Idempotentne przyjmowanie zdarzeń, kolejka z wykładniczym retry, metryki i dashboard operacyjny do podglądu opóźnień.',
    stack: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
  },
];

export type SkillGroup = { label: string; items: readonly string[] };

export const skillGroups: readonly SkillGroup[] = [
  {
    label: 'Core',
    items: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind'],
  },
  {
    label: 'Motion i 3D',
    items: ['Motion', 'GSAP', 'Three.js', 'R3F', 'Lenis', 'GLSL'],
  },
  {
    label: 'Backend i infra',
    items: ['Node.js', 'Java · Spring', 'MySQL', 'PostgreSQL', 'Netlify'],
  },
  {
    label: 'Narzędzia',
    items: ['Bun', 'pnpm', 'ESLint', 'Prettier', 'Husky'],
  },
];

export type ProcessStep = { n: string; title: string; body: string };

export const processSteps: readonly ProcessStep[] = [
  {
    n: '01',
    title: 'Odkrywanie',
    body: 'Cel, odbiorca, ograniczenia. Szukam jednej rzeczy, która ma zostać w pamięci.',
  },
  {
    n: '02',
    title: 'Kierunek',
    body: 'Jedna wyraźna decyzja estetyczna. Wybór momentów, które naprawdę warto animować.',
  },
  {
    n: '03',
    title: 'Budowa',
    body: 'Pionowe wycinki: prawdziwe komponenty, prawdziwa treść, prawdziwy ruch. Poprawki w trakcie, nie na końcu.',
  },
  {
    n: '04',
    title: 'Szlif',
    body: 'Przebieg wydajnościowy, dostępnościowy i ruchowy. Detale, aż całość wydaje się przemyślana.',
  },
];

export const contactCopy = {
  title: 'Zbudujmy coś przemyślanego.',
  lead: 'Dostępny do wybranych projektów front-end i produktowych. Odpowiadam w ciągu jednego–dwóch dni.',
  fields: { name: 'Imię', email: 'E-mail', message: 'Wiadomość' },
  submit: 'Wyślij wiadomość',
  sending: 'Wysyłam',
  sent: 'Wysłane',
  failed: 'Spróbuj ponownie',
};

export const footer = {
  credit: 'React · Three.js · Tailwind',
  available: 'Dostępny od',
  availableFrom: 'października 2026',
};
