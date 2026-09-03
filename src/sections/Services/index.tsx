import { motion, useReducedMotion } from 'motion/react';
import { sections, services } from '@/content/site';
import { SectionShell } from '@/components/layout/SectionShell';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { TextReveal } from '@/components/ui/TextReveal';

const meta = sections[2];
const EASE = [0.76, 0, 0.24, 1] as const;

function formatMetric(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(1).replace('.', ',');
}

export function Services() {
  const reduce = useReducedMotion();

  return (
    <SectionShell meta={meta}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <TextReveal
            as="h2"
            text="Co robię"
            split="word"
            whileInView
            blur={4}
            yOffset="30%"
            className="text-2xl leading-tight tracking-tight"
          />
          <p className="text-muted-foreground mt-5 max-w-[30ch] text-sm">
            Trzy obszary, w których biorę odpowiedzialność za efekt, nie tylko
            za kod.
          </p>
        </div>

        <ol className="md:col-span-8">
          {services.map((service, i) => (
            <motion.li
              key={service.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
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
                className="grid grid-cols-[2.5rem_1fr] gap-4 py-8 md:grid-cols-[2.5rem_1fr_9rem] md:gap-8"
              >
                <span className="font-display text-ochre text-xs tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-foreground text-lg tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 max-w-[52ch] text-sm leading-relaxed">
                    {service.body}
                  </p>
                </div>
                <div className="col-start-2 md:col-start-3 md:text-right">
                  <p className="font-display text-foreground text-2xl tracking-tight tabular-nums">
                    <AnimatedNumber
                      value={service.metric.value}
                      duration={1.4}
                      format={formatMetric}
                    />
                    <span className="text-muted-foreground text-md">
                      {service.metric.suffix}
                    </span>
                  </p>
                  <p className="text-2xs text-muted-foreground mt-1 tracking-[0.18em] uppercase">
                    {service.metric.label}
                  </p>
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
        </ol>
      </div>
    </SectionShell>
  );
}
