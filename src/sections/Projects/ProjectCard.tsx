import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
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
      className="bg-background text-foreground relative flex min-h-[19rem] flex-col rounded-2xl p-6 md:p-7"
    >
      <div
        aria-hidden
        className="absolute -top-px -right-px h-16 w-[4.5rem] rounded-bl-[24px] bg-(--section-bg)"
      >
        <span className="absolute top-0 -left-4 h-4 w-4 bg-[radial-gradient(circle_at_0_100%,transparent_15.5px,var(--section-bg)_16px)]" />
        <span className="absolute right-0 -bottom-4 h-4 w-4 bg-[radial-gradient(circle_at_0_100%,transparent_15.5px,var(--section-bg)_16px)]" />
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`${projectsCopy.open}: ${project.title}`}
        className="absolute top-2 right-2 flex h-11 w-11 items-center justify-center rounded-full border border-(--section-fg)/40 text-(--section-fg) transition-colors duration-300 hover:border-(--section-fg) hover:bg-(--section-fg) hover:text-(--section-bg)"
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </button>

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
    </motion.article>
  );
}
