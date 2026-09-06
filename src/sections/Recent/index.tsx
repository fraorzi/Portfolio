import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { projects, recentCopy, sections } from '@/content/site';
import { WEEKS } from '@/lib/github';
import { useRepoState } from '@/lib/repoStore';
import { formatDayMonth, formatRelative } from '@/lib/time';
import { useMounted } from '@/hooks/useMounted';
import { SectionShell } from '@/components/layout/SectionShell';

const meta = sections[4];
const EASE = [0.16, 1, 0.3, 1] as const;
const primary = projects[0];

export function Recent() {
  const mounted = useMounted();
  const { snapshots, failed } = useRepoState();
  const snapshot = snapshots[primary.slug] ?? null;
  const weekly = snapshot?.weekly ?? new Array<number>(WEEKS).fill(0);
  const peak = Math.max(1, ...weekly);
  const total = weekly.reduce((sum, n) => sum + n, 0);

  return (
    <SectionShell meta={meta}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-2xl leading-tight tracking-tight">
            {recentCopy.title}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            {failed ? recentCopy.empty : recentCopy.lead}
          </p>
        </div>
        {snapshot ? (
          <a
            href={snapshot.url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            {snapshot.fullName}
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </a>
        ) : null}
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-8">
        <p className="text-xs md:col-span-4">
          <span className="font-display block text-2xl tracking-tight tabular-nums">
            {total}
          </span>
          <span className="text-muted-foreground mt-1 block max-w-[18ch]">
            {recentCopy.commits(WEEKS)}
          </span>
        </p>

        <div className="md:col-span-8">
          <motion.ol
            aria-label={recentCopy.activityLabel}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="grid h-24 grid-cols-12 items-end gap-1.5 md:gap-2.5"
          >
            {weekly.map((count, i) => (
              <li
                key={`week-${WEEKS - i}`}
                className="flex h-full flex-col justify-end"
              >
                <motion.span
                  variants={{
                    hidden: { scaleY: 0 },
                    visible: { scaleY: 1 },
                  }}
                  transition={{ duration: 0.9, delay: i * 0.04, ease: EASE }}
                  className={
                    count
                      ? 'bg-foreground block w-full origin-bottom rounded-sm'
                      : 'bg-border block w-full origin-bottom rounded-sm'
                  }
                  style={{ height: `${Math.max(3, (count / peak) * 100)}%` }}
                />
                <span className="sr-only">{count}</span>
              </li>
            ))}
          </motion.ol>

          <ol className="border-border mt-10 border-t">
            {(snapshot?.commits ?? []).map((commit) => (
              <li
                key={commit.sha}
                className="border-border grid grid-cols-[5.5rem_1fr] gap-4 border-b py-4 text-sm md:grid-cols-[7rem_1fr_5rem]"
              >
                <time
                  dateTime={commit.date}
                  className="text-muted-foreground text-xs tabular-nums"
                >
                  {mounted
                    ? formatRelative(commit.date)
                    : formatDayMonth(commit.date)}
                </time>
                <a
                  href={commit.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary-500 truncate transition-colors"
                >
                  {commit.message}
                </a>
                <span className="text-muted-foreground hidden text-right text-xs tabular-nums md:block">
                  {commit.sha}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
}
