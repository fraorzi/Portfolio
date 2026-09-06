import { useCallback, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { projects, projectsCopy, sections } from '@/content/site';
import { useRepoState } from '@/lib/repoStore';
import { SectionShell } from '@/components/layout/SectionShell';
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

  const enter = reduce ? { opacity: 0 } : { opacity: 0, y: 14 };
  const shown = reduce ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <SectionShell meta={meta}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="font-display text-2xl leading-tight tracking-tight">
            {projectsCopy.title}
          </h2>
          <p className="text-muted-foreground mt-5 max-w-[34ch] text-sm leading-relaxed">
            {projectsCopy.lead}
          </p>
        </div>

        <ul className="grid gap-5 md:col-span-8 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.li
              key={project.slug}
              initial={enter}
              whileInView={shown}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
            >
              <ProjectCard
                project={project}
                snapshot={snapshots[project.slug] ?? null}
                onOpen={() => setOpenSlug(project.slug)}
              />
            </motion.li>
          ))}

          <motion.li
            initial={enter}
            whileInView={shown}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              delay: projects.length * 0.08,
              ease: EASE,
            }}
          >
            <article
              aria-labelledby="upcoming-title"
              className="border-border text-foreground flex min-h-[19rem] flex-col justify-end rounded-2xl border border-dashed p-6 md:p-7"
            >
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
