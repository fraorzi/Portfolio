import { Section } from '@/components/ui/Section';

const projects = [
  {
    title: 'Project One',
    role: 'Front-end · Design',
    year: '2026',
    tag: 'In progress',
  },
  {
    title: 'Project Two',
    role: 'Front-end',
    year: '2025',
    tag: 'Case study',
  },
  {
    title: 'Project Three',
    role: 'Full-stack',
    year: '2025',
    tag: 'Live',
  },
  {
    title: 'Project Four',
    role: 'Front-end · Motion',
    year: '2024',
    tag: 'Archived',
  },
];

export function Projects() {
  return (
    <Section id="projects" theme="light">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xs text-ink/50 tracking-[0.32em] uppercase">
            03 — Selected work
          </p>
          <h2 className="text-ink mt-6 text-2xl leading-tight tracking-tight">
            Selected projects
          </h2>
        </div>
      </div>

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <li key={p.title}>
            <a
              href="#projects"
              className="group border-ink/10 bg-paper hover:border-ink/25 block rounded-2xl border p-6 transition-all duration-500 ease-[var(--ease-out-expo)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)]"
            >
              <div className="from-primary-100 to-primary-300 aspect-[4/3] w-full rounded-xl bg-gradient-to-br transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.01]" />
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
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
