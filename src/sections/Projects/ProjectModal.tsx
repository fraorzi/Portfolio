import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { projectsCopy, type Project } from '@/content/site';
import type { RepoSnapshot } from '@/lib/github';
import { lockScroll } from '@/lib/scroll';
import { formatDayMonth, formatMonthYear, formatRelative } from '@/lib/time';
import { useMounted } from '@/hooks/useMounted';
import { LanguageBar } from '@/sections/Projects/LanguageBar';

type ProjectModalProps = {
  project: Project;
  snapshot: RepoSnapshot | null;
  onClose: () => void;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProjectModal({
  project,
  snapshot,
  onClose,
}: ProjectModalProps) {
  const mounted = useMounted();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [onClose]);

  const titleId = `${project.slug}-dialog-title`;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 md:items-center md:p-8">
      <motion.button
        type="button"
        aria-label={projectsCopy.close}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-ink/70 absolute inset-0 backdrop-blur-sm"
      />

      <motion.div
        layoutId={`project-${project.slug}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-theme="light"
        transition={{ type: 'spring', stiffness: 210, damping: 28 }}
        className="bg-background text-foreground relative max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="grid gap-10 p-6 md:grid-cols-12 md:gap-12 md:p-10"
        >
          <div className="flex flex-col md:col-span-5">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3
                  id={titleId}
                  className="font-display text-2xl tracking-tight"
                >
                  {project.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-xs">
                  {project.platform}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={projectsCopy.close}
                className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 shrink-0 rounded-full border p-2 transition-colors"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>

            <p className="text-foreground/85 mt-6 text-sm leading-relaxed">
              {project.summary}
            </p>

            <dl className="border-border mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 border-t pt-6 text-xs">
              <dt className="text-muted-foreground">
                {projectsCopy.roleLabel}
              </dt>
              <dd>{project.role}</dd>
              {snapshot ? (
                <>
                  <dt className="text-muted-foreground">
                    {projectsCopy.since}
                  </dt>
                  <dd>{formatMonthYear(snapshot.createdAt)}</dd>
                  {snapshot.commitCount ? (
                    <>
                      <dt className="text-muted-foreground">
                        {projectsCopy.commitsLabel}
                      </dt>
                      <dd className="tabular-nums">{snapshot.commitCount}</dd>
                    </>
                  ) : null}
                </>
              ) : null}
            </dl>

            <p className="text-muted-foreground mt-6 text-xs">
              {project.stack.join(', ')}
            </p>

            {snapshot ? (
              <a
                href={snapshot.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary-600 mt-auto inline-flex items-center gap-1.5 pt-8 text-sm transition-colors"
              >
                {projectsCopy.repoLink}
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            ) : null}
          </div>

          <div className="md:col-span-7">
            <ul className="space-y-4">
              {project.detail.map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.25 + i * 0.07,
                    ease: EASE,
                  }}
                  className="border-border text-sm leading-relaxed [&:not(:first-child)]:border-t [&:not(:first-child)]:pt-4"
                >
                  {line}
                </motion.li>
              ))}
            </ul>

            {snapshot ? (
              <div className="mt-10">
                <LanguageBar languages={snapshot.languages} />
                <ol className="border-border mt-8 border-t">
                  {snapshot.commits.slice(0, 4).map((commit) => (
                    <li
                      key={commit.sha}
                      className="border-border grid grid-cols-[6rem_1fr] gap-4 border-b py-3 text-xs"
                    >
                      <time
                        dateTime={commit.date}
                        className="text-muted-foreground tabular-nums"
                      >
                        {mounted
                          ? formatRelative(commit.date)
                          : formatDayMonth(commit.date)}
                      </time>
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary-600 truncate transition-colors"
                      >
                        {commit.message}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </div>,
    document.body,
  );
}
