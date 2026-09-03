import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { projects, sections, type Project } from '@/content/site';
import { SectionShell } from '@/components/layout/SectionShell';
import { ProjectCover } from '@/components/marks/ProjectCover';
import { MorphingModal } from '@/components/ui/MorphingModal';
import { TextReveal } from '@/components/ui/TextReveal';
import { TiltCard } from '@/components/ui/TiltCard';

const meta = sections[3];
const EASE = [0.16, 1, 0.3, 1] as const;

export function Projects() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const open = projects.find((p) => p.slug === openSlug) ?? null;

  return (
    <SectionShell meta={meta}>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <TextReveal
            as="h2"
            text="Cztery kierunki, które budują realne kompetencje."
            split="word"
            whileInView
            blur={4}
            yOffset="30%"
            className="text-2xl leading-tight tracking-tight"
          />
          <p className="text-muted-foreground mt-5 max-w-[30ch] text-sm">
            Okładki są generowane z nazwy projektu. Każda jest inna, żadna nie
            jest zdjęciem.
          </p>
        </div>

        <ul className="grid gap-5 md:col-span-8 md:grid-cols-2">
          {projects.map((project, i) => {
            const fromLeft = i % 2 === 0;
            return (
              <motion.li
                key={project.slug}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        x: fromLeft ? -36 : 36,
                        rotate: fromLeft ? -1.5 : 1.5,
                      }
                }
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, delay: (i % 2) * 0.1, ease: EASE }}
              >
                <TiltCard max={5} className="rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setOpenSlug(project.slug)}
                    aria-haspopup="dialog"
                    className="group border-border bg-card hover:border-foreground/30 block w-full rounded-2xl border p-4 text-left transition-[border-color,box-shadow] duration-500 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)]"
                  >
                    <div className="bg-background text-foreground aspect-4/3 w-full overflow-hidden rounded-xl">
                      <ProjectCover
                        seed={project.slug}
                        className="transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-md text-foreground tracking-tight">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {project.role} · {project.year}
                        </p>
                      </div>
                      <span className="text-2xs text-primary-600 shrink-0 tracking-[0.2em] uppercase">
                        {project.tag}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <span className="text-2xs text-foreground/70 group-hover:text-foreground mt-5 inline-flex items-center gap-1.5 tracking-[0.18em] uppercase transition-colors">
                      Szczegóły
                      <ArrowUpRight className="h-3 w-3" aria-hidden />
                    </span>
                  </button>
                </TiltCard>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <MorphingModal
        viewId={openSlug}
        onClose={() => setOpenSlug(null)}
        placement="center"
        className="border-border bg-background text-foreground max-w-md rounded-2xl shadow-[0_24px_64px_-24px_rgba(0,0,0,0.35)]"
      >
        {open ? (
          <ProjectDetail project={open} onClose={() => setOpenSlug(null)} />
        ) : null}
      </MorphingModal>
    </SectionShell>
  );
}

function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="project-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xs text-primary-600 tracking-[0.2em] uppercase">
            {project.tag}
          </p>
          <h3
            id="project-title"
            className="font-display text-foreground mt-2 text-xl tracking-tight"
          >
            {project.title}
          </h3>
          <p className="text-muted-foreground mt-1 text-xs">
            {project.role} · {project.year}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zamknij"
          className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 rounded-full border p-1.5 transition-colors"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      <div className="bg-card text-foreground mt-5 aspect-[2/1] w-full overflow-hidden rounded-xl">
        <ProjectCover seed={project.slug} />
      </div>

      <p className="text-foreground mt-5 text-sm leading-relaxed">
        {project.description}
      </p>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        {project.detail}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <li
            key={item}
            className="border-border text-2xs text-muted-foreground rounded-full border px-3 py-1 tracking-[0.12em] uppercase"
          >
            {item}
          </li>
        ))}
      </ul>

      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className="text-2xs text-foreground hover:text-primary-600 mt-6 inline-flex items-center gap-1.5 tracking-[0.18em] uppercase transition-colors"
        >
          Zobacz projekt
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
