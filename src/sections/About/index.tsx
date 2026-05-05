import { Section } from '@/components/ui/Section';

export function About() {
  return (
    <Section id="about" theme="light">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-2xs text-ink/50 tracking-[0.32em] uppercase">
            01 — About
          </p>
        </div>
        <div className="md:col-span-8">
          <h2 className="text-ink text-2xl leading-tight tracking-tight">
            Front-end developer with backend experience, focused on building
            polished, performant interfaces.
          </h2>
          <p className="text-ink/70 mt-6 max-w-[62ch] text-sm">
            I work mostly in React and TypeScript, with a strong interest in
            motion design, 3D, and the small details that make a product feel
            considered.
          </p>
        </div>
      </div>
    </Section>
  );
}
