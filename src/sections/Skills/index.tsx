import { motion } from 'motion/react';
import { sections, skillGroups } from '@/content/site';
import { SectionShell } from '@/components/layout/SectionShell';
import { TextReveal } from '@/components/ui/TextReveal';

const meta = sections[4];
const GOLDEN_ANGLE = 2.399963;

function radialOffset(index: number) {
  const angle = index * GOLDEN_ANGLE;
  const distance = 28 + (index % 4) * 10;
  return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
}

const groupStarts = skillGroups.reduce<number[]>((acc, _group, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + skillGroups[i - 1].items.length);
  return acc;
}, []);

export function Skills() {
  return (
    <SectionShell meta={meta}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <TextReveal
            as="h2"
            text="Narzędzia, po które sięgam"
            split="word"
            whileInView
            blur={4}
            yOffset="30%"
            className="text-2xl leading-tight tracking-tight"
          />
          <p className="text-muted-foreground mt-5 max-w-[30ch] text-sm">
            Stack dobieram do problemu. Te elementy powtarzają się najczęściej.
          </p>
        </div>

        <div className="space-y-10 md:col-span-8">
          {skillGroups.map((group, groupIndex) => (
            <div
              key={group.label}
              className="grid grid-cols-1 gap-4 md:grid-cols-[140px_1fr]"
            >
              <p className="text-2xs text-muted-foreground pt-2 tracking-[0.24em] uppercase">
                {group.label}
              </p>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item, itemIndex) => {
                  const index = groupStarts[groupIndex] + itemIndex;
                  const offset = radialOffset(index);
                  return (
                    <motion.li
                      key={item}
                      initial={{
                        opacity: 0,
                        scale: 0.7,
                        x: offset.x,
                        y: offset.y,
                      }}
                      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{
                        type: 'spring',
                        stiffness: 220,
                        damping: 22,
                        mass: 0.8,
                        delay: (index % 12) * 0.045,
                      }}
                      className="border-border bg-card/60 text-foreground hover:border-primary-500/60 rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-300"
                    >
                      {item}
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
