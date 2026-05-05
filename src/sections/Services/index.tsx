import { Section } from '@/components/ui/Section';

const items = [
  {
    title: 'Interface engineering',
    body: 'Production-grade UI in React, TypeScript, Tailwind. Component systems, accessibility, performance.',
  },
  {
    title: 'Motion & 3D',
    body: 'Scroll-driven storytelling, microinteractions, WebGL/Three.js scenes that stay performant.',
  },
  {
    title: 'Product & design partnership',
    body: 'Collaborating with designers from concept to ship — refining flows and pushing details.',
  },
];

export function Services() {
  return (
    <Section id="services" theme="dark">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-2xs text-paper/50 tracking-[0.32em] uppercase">
            02 — Services
          </p>
          <h2 className="text-paper mt-6 text-2xl leading-tight tracking-tight">
            What I do
          </h2>
        </div>

        <ul className="bg-paper/10 grid gap-px md:col-span-8">
          {items.map((it) => (
            <li
              key={it.title}
              className="bg-ink hover:bg-ink/80 p-8 transition-colors"
            >
              <h3 className="font-display text-md text-paper">{it.title}</h3>
              <p className="text-paper/70 mt-3 max-w-[52ch] text-sm">
                {it.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
