import { motion } from 'motion/react';
import { hero, sections } from '@/content/site';
import { TextReveal } from '@/components/ui/TextReveal';

const meta = sections[0];
const EASE = [0.16, 1, 0.3, 1] as const;

type HeroProps = {
  ready: boolean;
};

export function Hero({ ready }: HeroProps) {
  return (
    <section
      id={meta.id}
      data-theme={meta.theme}
      data-scene-index={meta.index}
      className="text-foreground relative flex min-h-svh w-full items-center overflow-hidden"
    >
      <div className="container-page relative grid gap-10 pt-28 pb-24 md:grid-cols-12 md:pt-32">
        <div className="md:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="eyebrow text-muted-foreground flex items-center gap-3"
          >
            <span
              aria-hidden
              className="bg-primary-500 h-1.5 w-1.5 rounded-full"
            />
            {hero.eyebrow}
          </motion.p>

          {ready ? (
            <TextReveal
              as="h1"
              text={hero.title}
              split="char"
              stagger={0.014}
              delay={0.45}
              blur={6}
              yOffset="55%"
              className="font-cut text-hero-lg mt-7 max-w-[24ch] leading-[1.12] font-medium tracking-[-0.02em]"
            />
          ) : (
            <h1 className="font-cut text-hero-lg mt-7 max-w-[24ch] leading-[1.12] font-medium tracking-[-0.02em]">
              {hero.title}
            </h1>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
            className="text-muted-foreground mt-7 max-w-[46ch] text-sm"
          >
            {hero.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="bg-primary-600 text-paper text-2xs hover:bg-primary-500 rounded-full px-5 py-2.5 tracking-[0.18em] uppercase transition-colors duration-300"
            >
              {hero.primaryCta}
            </a>
            <a
              href="#contact"
              className="border-border text-foreground text-2xs hover:border-foreground/50 rounded-full border px-5 py-2.5 tracking-[0.18em] uppercase transition-colors duration-300"
            >
              {hero.secondaryCta}
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.8 }}
        className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-2xs text-muted-foreground tracking-[0.32em] uppercase">
          {hero.scrollCue}
        </span>
        <span className="relative block h-12 w-px overflow-hidden">
          <motion.span
            aria-hidden
            initial={{ y: '-100%' }}
            animate={ready ? { y: ['-100%', '0%', '100%'] } : undefined}
            transition={{
              duration: 2.2,
              times: [0, 0.5, 1],
              ease: ['easeOut', 'easeIn'],
              repeat: Infinity,
              repeatDelay: 0.4,
            }}
            className="bg-foreground/60 absolute inset-0"
          />
        </span>
      </motion.div>
    </section>
  );
}
