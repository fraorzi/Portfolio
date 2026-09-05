export type SectionTheme = 'light' | 'dark';

export type SectionId =
  | 'hero'
  | 'about'
  | 'projects'
  | 'scope'
  | 'recent'
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
  { id: 'projects', index: 2, label: 'Projekty', theme: 'dark' },
  { id: 'scope', index: 3, label: 'Zakres', theme: 'light' },
  { id: 'recent', index: 4, label: 'Ostatnio', theme: 'dark' },
  { id: 'contact', index: 5, label: 'Kontakt', theme: 'light' },
];

export const footerTheme: SectionTheme = 'dark';

export const navItems = sections.filter((s) => s.id !== 'hero');

export const navCopy = {
  label: 'Nawigacja',
  menu: 'Menu',
  open: ', otwórz nawigację',
  home: 'Do początku strony',
};

export const contact = {
  name: 'Franciszek Orzechowski',
  email: 'orzechowskifranek@gmail.com',
  github: 'https://github.com/fraorzi',
  githubLabel: 'github.com/fraorzi',
  city: 'Warszawa',
  timeZone: 'Europe/Warsaw',
};

export const hero = {
  title: 'Front-end developer. Interfejsy, ruch i\u00a03D w\u00a0przeglądarce',
  lead: 'Franciszek Orzechowski, Warszawa. Na co dzień React i TypeScript; kiedy trzeba zejść niżej — Node, Java, Swift i bazy danych.',
  primaryCta: 'Zobacz projekt',
  secondaryCta: 'Napisz do mnie',
};

export const about = {
  title:
    'Piszę front-end od kilku lat. Backend znam na tyle, żeby projektować całość, nie tylko warstwę widoku',
  body: 'Pracuję głównie w React i TypeScript. Interesują mnie ruch, 3D w przeglądarce i te małe decyzje, przez które produkt wydaje się przemyślany. Ostatnio dużo czasu spędzam w Swift i C, pisząc narzędzie do przeglądu kodu. Znam też drugą stronę — Node, Java, bazy danych — więc z backendem rozmawiam bez tłumacza.',
  facts: [
    { label: 'Baza', value: 'Warszawa' },
    { label: 'Praca', value: 'zdalnie lub hybrydowo' },
    { label: 'Języki', value: 'polski, angielski' },
  ],
};

export type Project = {
  slug: string;
  repo: { owner: string; name: string };
  title: string;
  summary: string;
  role: string;
  platform: string;
  detail: readonly string[];
  stack: readonly string[];
};

export const projects: readonly Project[] = [
  {
    slug: 'diffscope',
    repo: { owner: 'fraorzi', name: 'diffscope_swift' },
    title: 'DiffScope',
    summary:
      'Aplikacja macOS do przeglądu diffów w lokalnych repozytoriach Git. Dopasowuje zmiany strukturalnie, nie tylko liniami — i nigdy nie ukrywa różnicy w tekście.',
    role: 'Solo: produkt, architektura, silnik diffów',
    platform: 'macOS · tylko odczyt · bez sieci',
    detail: [
      'Silnik w C wyrównuje edycje strukturalnie: usunięty wrapper JSX, przestawione propsy czy przeformatowany plik czytają się jako to, czym są.',
      'Trzy tryby widoku — strukturalny, rozszerzony, surowy — zawsze side-by-side. Dokładny tekst źródłowy jest źródłem prawdy.',
      'Diff strukturalny dla TS, TSX, JS i JSX; pozostałe pliki jako czytelnie oznaczony diff tekstowy.',
    ],
    stack: ['Swift', 'C', 'SwiftUI', 'Git'],
  },
];

export const projectsCopy = {
  title: 'Nad czym pracuję',
  lead: 'Jeden projekt opublikowany, drugi w trakcie. Ostatni commit, języki i liczba commitów pochodzą z GitHuba.',
  open: 'Szczegóły projektu',
  close: 'Zamknij',
  repoLink: 'Repozytorium',
  lastCommit: 'ostatni commit',
  commits: 'commitów',
  commitsLabel: 'Commity',
  roleLabel: 'Rola',
  since: 'Start',
  upcoming: {
    title: 'Drugi projekt',
    body: 'W trakcie. Repozytorium pojawi się tutaj, gdy będzie co pokazać.',
  },
};

export type ScopeArea = {
  title: string;
  body: string;
  tools: readonly string[];
};

export const scope: readonly ScopeArea[] = [
  {
    title: 'Interfejsy',
    body: 'Produkcyjne UI w React i TypeScript. Systemy komponentów, dostępność i wydajność, którą się mierzy, a nie zakłada.',
    tools: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind'],
  },
  {
    title: 'Ruch i 3D',
    body: 'Scroll-driven storytelling, mikrointerakcje i sceny WebGL, które trzymają klatki także na telefonie.',
    tools: ['Motion', 'Three.js', 'GLSL', 'Lenis'],
  },
  {
    title: 'Zaplecze',
    body: 'API, bazy danych i narzędzia natywne. Wystarczająco dużo backendu, żeby projektować całość, a nie tylko warstwę widoku.',
    tools: ['Node.js', 'Java, Spring', 'Swift', 'C', 'MySQL', 'PostgreSQL'],
  },
];

export const scopeCopy = {
  title: 'Czym się zajmuję',
};

export const recentCopy = {
  title: 'Ostatnie commity',
  lead: 'Tempo pracy z ostatnich dwunastu tygodni.',
  commits: (weeks: number) => `commitów w ostatnich ${weeks} tygodniach`,
  activityLabel: 'Commity tygodniowo',
  empty: 'GitHub chwilowo nie odpowiada — pokazuję ostatni zapisany stan.',
};

export const contactCopy = {
  title: 'Napisz do mnie',
  lead: 'Odpowiadam w jeden, dwa dni. Dostępny do projektów front-endowych i produktowych od października 2026.',
  fields: { name: 'Imię', email: 'E-mail', message: 'Wiadomość' },
  submit: 'Wyślij',
  sending: 'Wysyłam',
  sent: 'Wysłane',
  failed: 'Spróbuj ponownie',
  note: 'Formularz obsługuje Netlify. Bez ciasteczek.',
  honeypot: 'Nie wypełniaj tego pola:',
};

export const footer = {
  localTime: 'czas lokalny',
};
