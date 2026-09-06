import { motion } from 'motion/react';
import { scrollToId } from '@/lib/scroll';
import { contact, hero, sections } from '@/content/site';
import { TextReveal } from '@/components/ui/TextReveal';

const meta = sections[0];
const EASE = [0.16, 1, 0.3, 1] as const;

type HeroProps = {
  ready: boolean;
};

const titleClass =
  'font-display text-hero-lg max-w-[30ch] leading-[1.12] font-medium tracking-[-0.02em]';

export function Hero({ ready }: HeroProps) {
  return (
    <section
      id={meta.id}
      data-theme={meta.theme}
      data-scene-index={meta.index}
      className="bg-background text-foreground relative flex min-h-svh w-full items-end overflow-hidden"
    >
      <div className="container-page relative z-20 grid gap-10 pt-32 pb-16 md:grid-cols-12 md:pb-20">
        <div className="md:col-span-7">
          {ready ? (
            <TextReveal
              as="h1"
              text={hero.title}
              split="char"
              stagger={0.014}
              delay={0.3}
              blur={6}
              yOffset="55%"
              className={titleClass}
            />
          ) : (
            <h1 className={titleClass}>{hero.title}</h1>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
            className="text-muted-foreground mt-7 max-w-[52ch] text-sm leading-relaxed"
          >
            {hero.lead}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, delay: 1.2, ease: EASE }}
          className="flex flex-col justify-end gap-6 md:col-span-4 md:col-start-9"
        >
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              onClick={(event) => {
                event.preventDefault();
                scrollToId('projects');
              }}
              className="bg-primary-600 text-paper hover:bg-primary-500 rounded-full px-4 py-2 text-sm transition-colors duration-300"
            >
              {hero.primaryCta}
            </a>
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                scrollToId('contact');
              }}
              className="border-border text-foreground hover:border-foreground/50 rounded-full border px-4 py-2 text-sm transition-colors duration-300"
            >
              {hero.secondaryCta}
            </a>
          </div>
          <p className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1 text-xs">
            <a
              href={`mailto:${contact.email}`}
              className="hover:text-foreground transition-colors"
            >
              {contact.email}
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {contact.githubLabel}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
