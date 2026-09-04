import { motion, useReducedMotion } from 'motion/react';
import { scope, scopeCopy, sections } from '@/content/site';
import { SectionShell } from '@/components/layout/SectionShell';
import { TextReveal } from '@/components/ui/TextReveal';

const meta = sections[3];
const EASE = [0.76, 0, 0.24, 1] as const;

export function Scope() {
  const reduce = useReducedMotion();

  return (
    <SectionShell meta={meta}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <TextReveal
            as="h2"
            text={scopeCopy.title}
            split="word"
            whileInView
            blur={4}
            yOffset="30%"
            className="text-2xl leading-tight tracking-tight"
          />
        </div>

        <ul className="border-border border-t md:col-span-8">
          {scope.map((area, i) => (
            <motion.li
              key={area.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="relative"
            >
              <motion.div
                variants={
                  reduce
                    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                    : {
                        hidden: { clipPath: 'inset(0% 100% 0% 0%)' },
                        visible: { clipPath: 'inset(0% 0% 0% 0%)' },
                      }
                }
                transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
                className="grid gap-5 py-9 md:grid-cols-[11rem_1fr] md:gap-10"
              >
                <h3 className="font-display text-foreground text-lg tracking-tight">
                  {area.title}
                </h3>
                <div>
                  <p className="text-muted-foreground max-w-[54ch] text-sm leading-relaxed">
                    {area.body}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {area.tools.map((tool) => (
                      <li
                        key={tool}
                        className="border-border text-2xs text-foreground rounded-full border px-3 py-1 tracking-[0.12em] uppercase"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              <motion.span
                aria-hidden
                variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
                transition={{
                  duration: 1.1,
                  delay: 0.2 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="bg-border absolute inset-x-0 bottom-0 h-px origin-left"
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
