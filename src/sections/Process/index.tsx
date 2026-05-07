import { useRef } from 'react';
import { Section } from '@/components/ui/Section';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const steps = [
  {
    n: '01',
    title: 'Discover',
    body: 'Understand the goal, the audience, and the constraints. Look for the one thing that should be unforgettable.',
  },
  {
    n: '02',
    title: 'Direct',
    body: 'Commit to a clear aesthetic direction. Pick the moments worth animating.',
  },
  {
    n: '03',
    title: 'Build',
    body: 'Ship in vertical slices — real components, real content, real motion — refining as I go.',
  },
  {
    n: '04',
    title: 'Polish',
    body: 'Performance pass, a11y pass, motion pass. Details until it feels considered.',
  },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  return (
    <Section id="process" theme="light">
      <div ref={ref} className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p
            data-reveal
            className="text-2xs text-ink/50 tracking-[0.32em] uppercase"
          >
            05 — Process
          </p>
          <h2
            data-reveal
            className="text-ink mt-6 text-2xl leading-tight tracking-tight"
          >
            How I work
          </h2>
        </div>

        <ol className="space-y-px md:col-span-8">
          {steps.map((s) => (
            <li
              key={s.n}
              data-reveal
              className="border-ink/10 grid grid-cols-[60px_1fr] items-start gap-6 border-t py-6 first:border-t-0"
            >
              <span className="font-display text-primary-600 text-sm tracking-tight">
                {s.n}
              </span>
              <div>
                <h3 className="font-display text-md text-ink">{s.title}</h3>
                <p className="text-ink/70 mt-2 max-w-[58ch] text-sm">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
