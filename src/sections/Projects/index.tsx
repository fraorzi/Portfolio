import { useCallback, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { projects, projectsCopy, sections } from '@/content/site';
import { useRepoState } from '@/lib/repoStore';
import { SectionShell } from '@/components/layout/SectionShell';
import { Monogram } from '@/components/marks/Monogram';
import { TextReveal } from '@/components/ui/TextReveal';
import { ProjectCard } from '@/sections/Projects/ProjectCard';
import { ProjectModal } from '@/sections/Projects/ProjectModal';

const meta = sections[2];
const EASE = [0.16, 1, 0.3, 1] as const;

export function Projects() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { snapshots } = useRepoState();
  const open = projects.find((p) => p.slug === openSlug) ?? null;
  const close = useCallback(() => setOpenSlug(null), []);

  const enter = (fromLeft: boolean) =>
    reduce
      ? { opacity: 0 }
      : { opacity: 0, x: fromLeft ? -36 : 36, rotate: fromLeft ? -1.5 : 1.5 };

  return (
    <SectionShell meta={meta}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <TextReveal
            as="h2"
            text={projectsCopy.title}
            split="word"
            whileInView
            blur={4}
            yOffset="30%"
            className="text-2xl leading-tight tracking-tight"
          />
          <p className="text-muted-foreground mt-5 max-w-[32ch] text-sm">
            {projectsCopy.lead}
          </p>
        </div>

        <ul className="grid gap-5 md:col-span-8 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.li
              key={project.slug}
              initial={enter(i % 2 === 0)}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: EASE }}
            >
              <ProjectCard
                project={project}
                snapshot={snapshots[project.slug] ?? null}
                onOpen={() => setOpenSlug(project.slug)}
              />
            </motion.li>
          ))}

          <motion.li
            initial={enter(projects.length % 2 !== 0)}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
          >
            <article
              aria-labelledby="upcoming-title"
              className="border-border text-foreground flex min-h-[19rem] flex-col justify-between rounded-2xl border border-dashed p-6 md:p-7"
            >
              <Monogram
                className="text-muted-foreground h-8 w-8"
                strokeWidth={1.25}
              />
              <div>
                <h3
                  id="upcoming-title"
                  className="font-display text-xl tracking-tight"
                >
                  {projectsCopy.upcoming.title}
                </h3>
                <p className="text-muted-foreground mt-3 max-w-[30ch] text-sm leading-relaxed">
                  {projectsCopy.upcoming.body}
                </p>
              </div>
            </article>
          </motion.li>
        </ul>
      </div>

      <AnimatePresence>
        {open ? (
          <ProjectModal
            key={open.slug}
            project={open}
            snapshot={snapshots[open.slug] ?? null}
            onClose={close}
          />
        ) : null}
      </AnimatePresence>
    </SectionShell>
  );
}
