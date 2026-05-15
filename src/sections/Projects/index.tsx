import { useRef } from 'react';
import { Section } from '@/components/ui/Section';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/cn';

const projects = [
  {
    title: 'Lift Log',
    role: 'Expo · React Native',
    year: '2026',
    tag: 'Mobilna',
    description:
      'Aplikacja na iPhone do planowania treningów siłowych, zapisywania serii i śledzenia progresu w czasie.',
    features: ['Serie', 'Progres', 'Plany', 'Historia'],
    visualClass: 'from-primary-50 via-primary-200 to-ink/10',
  },
  {
    title: 'Image Forge',
    role: 'React · Narzędzia obrazów',
    year: '2025',
    tag: 'Narzędzie',
    description:
      'Narzędzie do optymalizacji zdjęć, konwersji formatów, usuwania tła i przygotowywania assetów do publikacji.',
    features: ['WebP', 'AVIF', 'Resize', 'Wycinanie tła'],
    visualClass: 'from-ink/10 via-primary-100 to-primary-300',
  },
  {
    title: 'Studio Panel',
    role: 'Next.js · Strapi · MySQL',
    year: '2025',
    tag: 'Full-stack',
    description:
      'Panel z autoryzacją, rolami użytkowników, CMS-em w Strapi i bazą MySQL dla treści oraz danych aplikacji.',
    features: ['Auth', 'CMS', 'Role', 'Dashboard'],
    visualClass: 'from-primary-100 via-paper to-ink/15',
  },
  {
    title: 'Webhook Operations',
    role: 'Java · Spring Boot · MySQL',
    year: '2026',
    tag: 'Backend',
    description:
      'Platforma do odbierania webhooków, walidacji podpisów HMAC, ponawiania zdarzeń i podglądu pracy systemu.',
    features: ['HMAC', 'Retry', 'Queue', 'Metrics'],
    visualClass: 'from-ink/15 via-primary-50 to-primary-200',
  },
  {
    title: 'Personal Search Engine',
    role: 'C++ · Indexing · CLI',
    year: '2026',
    tag: 'Engine',
    description:
      'Lokalna wyszukiwarka plików i notatek z własnym indeksem, rankingiem trafności oraz szybkim fuzzy search.',
    features: ['Index', 'Ranking', 'Fuzzy', 'CLI'],
    visualClass: 'from-primary-200 via-paper to-ink/20',
  },
];

export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <Section id="projects" theme="light">
      <div ref={ref}>
        <div className="flex items-end justify-between">
          <div>
            <p
              data-reveal
              className="text-2xs text-ink/50 tracking-[0.32em] uppercase"
            >
              03 — Projekty
            </p>
            <h2
              data-reveal
              className="text-ink mt-6 text-2xl leading-tight tracking-tight"
            >
              Pięć kierunków, które rozwijają realne kompetencje.
            </h2>
          </div>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.title} data-reveal>
              <a
                href="#projects"
                className="group border-ink/10 bg-paper hover:border-ink/25 ease-out-expo block rounded-2xl border p-6 transition-all duration-500 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)]"
              >
                <div
                  className={cn(
                    'ease-out-expo aspect-4/3 w-full rounded-xl bg-linear-to-br transition-transform duration-700 group-hover:scale-[1.01]',
                    p.visualClass,
                  )}
                />
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-md text-ink">{p.title}</h3>
                    <p className="text-ink/60 mt-1 text-xs">
                      {p.role} · {p.year}
                    </p>
                  </div>
                  <span className="text-2xs text-primary-700 tracking-[0.2em] uppercase">
                    {p.tag}
                  </span>
                </div>
                <p className="text-ink/65 mt-4 max-w-[46ch] text-sm leading-relaxed">
                  {p.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.features.map((feature) => (
                    <li
                      key={feature}
                      className="border-ink/10 bg-ink/[0.03] text-2xs text-ink/65 rounded-full border px-3 py-1 tracking-[0.12em] uppercase"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
