import { useRef } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { about, sections } from '@/content/site';
import { SectionShell } from '@/components/layout/SectionShell';
import { Monogram } from '@/components/marks/Monogram';
import { TextReveal } from '@/components/ui/TextReveal';

const meta = sections[1];
const words = about.body.split(' ');
const DIM = 0.18;

export function About() {
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: bodyRef,
    offset: ['start 80%', 'end 45%'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const el = bodyRef.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLSpanElement>('[data-word]');
    const total = spans.length;
    const band = 0.12;
    spans.forEach((span, i) => {
      const start = (i / total) * (1 - band);
      const t = reduce
        ? 1
        : Math.min(1, Math.max(0, (progress - start) / band));
      span.style.opacity = String(DIM + (1 - DIM) * t);
    });
  });

  return (
    <SectionShell meta={meta}>
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <TextReveal
            as="h2"
            text={about.title}
            split="word"
            stagger={0.04}
            blur={4}
            yOffset="30%"
            whileInView
            className="text-2xl leading-tight tracking-tight"
          />
          <p
            ref={bodyRef}
            className="text-foreground text-md mt-8 max-w-[60ch] leading-relaxed"
          >
            {words.map((word, i) => (
              <span key={`${word}-${i}`}>
                <span
                  data-word
                  className="inline-block motion-reduce:opacity-100!"
                  style={{ opacity: DIM }}
                >
                  {word}
                </span>
                {i < words.length - 1 ? ' ' : null}
              </span>
            ))}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-10 md:col-span-4 md:col-start-9">
          <Monogram
            draw="inView"
            strokeWidth={1.25}
            className="text-foreground h-20 w-20 md:h-24 md:w-24"
          />
          <dl className="border-border grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t pt-5 text-xs">
            {about.facts.map((fact) => (
              <div key={fact.label} className="contents">
                <dt className="text-muted-foreground">{fact.label}</dt>
                <dd className="text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SectionShell>
  );
}
