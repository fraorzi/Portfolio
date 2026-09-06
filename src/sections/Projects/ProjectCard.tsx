import { motion } from 'motion/react';
import { projectsCopy, type Project } from '@/content/site';
import type { RepoSnapshot } from '@/lib/github';
import { formatDayMonth, formatRelative } from '@/lib/time';
import { useMounted } from '@/hooks/useMounted';
import { LanguageBar } from '@/sections/Projects/LanguageBar';

type ProjectCardProps = {
  project: Project;
  snapshot: RepoSnapshot | null;
  onOpen: () => void;
};

export function ProjectCard({ project, snapshot, onOpen }: ProjectCardProps) {
  const mounted = useMounted();
  const lastCommit = snapshot?.commits[0]?.date ?? snapshot?.pushedAt ?? null;

  return (
    <motion.article
      layoutId={`project-${project.slug}`}
      data-theme="light"
      aria-labelledby={`${project.slug}-title`}
      className="text-foreground relative"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`${projectsCopy.open}: ${project.title}`}
        className="absolute top-2 right-2 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-(--section-fg)/40 text-(--section-fg) transition-colors duration-300 hover:border-(--section-fg) hover:bg-(--section-fg) hover:text-(--section-bg)"
      >
        <span aria-hidden className="font-display text-md leading-none">
          i
        </span>
      </button>

      <div className="project-cutout bg-background flex min-h-[19rem] flex-col rounded-2xl p-6 md:p-7">
        <div className="pr-16">
          <h3
            id={`${project.slug}-title`}
            className="font-display text-xl tracking-tight"
          >
            {project.title}
          </h3>
          <p className="text-muted-foreground mt-1.5 text-xs">
            {project.platform}
          </p>
        </div>

        <p className="text-foreground/85 mt-6 max-w-[40ch] text-sm leading-relaxed">
          {project.summary}
        </p>

        <div className="mt-auto pt-8">
          {snapshot ? (
            <>
              <LanguageBar languages={snapshot.languages} labels={false} />
              <p className="text-muted-foreground mt-3 flex flex-wrap gap-x-3 text-xs tabular-nums">
                {lastCommit ? (
                  <span>
                    {projectsCopy.lastCommit}{' '}
                    <time dateTime={lastCommit} className="text-foreground">
                      {mounted
                        ? formatRelative(lastCommit)
                        : formatDayMonth(lastCommit)}
                    </time>
                  </span>
                ) : null}
                {snapshot.commitCount ? (
                  <span>
                    <span className="text-foreground">
                      {snapshot.commitCount}
                    </span>{' '}
                    {projectsCopy.commits}
                  </span>
                ) : null}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
