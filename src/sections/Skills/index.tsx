import { Section } from '@/components/ui/Section';

const groups = [
  {
    label: 'Core',
    items: ['React', 'TypeScript', 'Next.js', 'Vite', 'Tailwind'],
  },
  {
    label: 'Motion & 3D',
    items: ['Motion', 'GSAP', 'Three.js', 'R3F', 'Lenis'],
  },
  {
    label: 'Backend & infra',
    items: ['Node.js', 'PostgreSQL', 'Prisma', 'Vercel', 'Netlify'],
  },
  {
    label: 'Tooling',
    items: ['Bun', 'pnpm', 'ESLint', 'Prettier', 'Husky'],
  },
];

export function Skills() {
  return (
    <Section id="skills" theme="dark">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-2xs text-paper/50 tracking-[0.32em] uppercase">
            04 — Stack
          </p>
          <h2 className="text-paper mt-6 text-2xl leading-tight tracking-tight">
            Tools I reach for
          </h2>
        </div>

        <div className="space-y-8 md:col-span-8">
          {groups.map((g) => (
            <div
              key={g.label}
              className="border-paper/10 grid grid-cols-1 gap-3 border-t pt-6 md:grid-cols-[140px_1fr]"
            >
              <p className="text-2xs text-paper/50 tracking-[0.24em] uppercase">
                {g.label}
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {g.items.map((i) => (
                  <li key={i} className="text-paper text-sm">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
