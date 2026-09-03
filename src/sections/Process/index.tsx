import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { processSteps, sections } from '@/content/site';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { SectionShell } from '@/components/layout/SectionShell';
import { TextReveal } from '@/components/ui/TextReveal';

const meta = sections[5];
const EASE = [0.16, 1, 0.3, 1] as const;

export function Process() {
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const desktop = useMediaQuery('(min-width: 768px)');
  const reduce = useReducedMotion();
  const distance = useMotionValue(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => {
      distance.set(Math.max(0, track.scrollWidth - track.clientWidth));
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [distance]);

  const pinned = desktop && !reduce;

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: pinned ? ['start start', 'end end'] : ['start 80%', 'end 60%'],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const x = useTransform(
    [smooth, distance],
    ([p, d]) => -(d as number) * (p as number),
  );
  const railOffset = useTransform(smooth, (p) => 1 - p);

  return (
    <div
      ref={frameRef}
      data-scene-frame
      className={pinned ? 'h-[260svh]' : undefined}
    >
      <SectionShell
        meta={meta}
        className={
          pinned
            ? 'sticky top-0 flex h-svh flex-col justify-center py-0 md:py-0'
            : undefined
        }
      >
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <TextReveal
              as="h2"
              text="Jak pracuję"
              split="word"
              whileInView
              blur={4}
              yOffset="30%"
              className="text-2xl leading-tight tracking-tight"
            />
            <p className="text-muted-foreground mt-5 max-w-[34ch] text-sm">
              Cztery kroki, jeden rytm. Każdy etap ma swój moment na decyzję.
            </p>
          </div>
        </div>

        <div className="relative mt-12 md:mt-16">
          <svg
            aria-hidden
            viewBox="0 0 1000 8"
            preserveAspectRatio="none"
            className="text-primary-600 absolute top-[5px] left-0 hidden h-2 w-full md:block"
          >
            <path
              d="M0 4H1000"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeDasharray="6 8"
              className="text-border"
            />
            <motion.path
              d="M0 4H1000"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              pathLength={1}
              strokeDasharray={1}
              style={{ strokeDashoffset: reduce ? 0 : railOffset }}
            />
          </svg>

          <div className="md:overflow-hidden">
            <motion.ol
              ref={trackRef}
              style={pinned ? { x } : undefined}
              className="flex flex-col gap-10 md:flex-row md:gap-8 md:pt-8 md:will-change-transform"
            >
              {processSteps.map((step, i) => (
                <motion.li
                  key={step.n}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: i * 0.06, ease: EASE }}
                  className="relative shrink-0 md:w-[min(38vw,30rem)]"
                >
                  <span
                    aria-hidden
                    className="bg-primary-600 ring-background absolute -top-[2.4rem] left-0 hidden h-2.5 w-2.5 rounded-full ring-4 md:block"
                  />
                  <div className="border-border bg-card/85 rounded-2xl border p-6 md:p-7">
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-ochre text-xs tabular-nums">
                        {step.n}
                      </span>
                      <span className="text-2xs text-muted-foreground tracking-[0.18em] uppercase">
                        Krok
                      </span>
                    </div>
                    <h3 className="font-display text-foreground mt-6 text-lg tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mt-3 max-w-[40ch] text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}
