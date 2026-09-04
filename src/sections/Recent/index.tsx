import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { projects, recentCopy, sections } from '@/content/site';
import { WEEKS } from '@/lib/github';
import { useRepoState } from '@/lib/repoStore';
import { formatDayMonth, formatRelative } from '@/lib/time';
import { useMounted } from '@/hooks/useMounted';
import { SectionShell } from '@/components/layout/SectionShell';
import { TextReveal } from '@/components/ui/TextReveal';

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
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <TextReveal
            as="h2"
            text={recentCopy.title}
            split="word"
            whileInView
            blur={4}
            yOffset="30%"
            className="text-2xl leading-tight tracking-tight"
          />
          <p className="text-muted-foreground mt-5 max-w-[32ch] text-sm">
            {recentCopy.lead}
          </p>
          {failed ? (
            <p className="text-muted-foreground mt-3 max-w-[32ch] text-xs">
              {recentCopy.empty}
            </p>
          ) : null}
        </div>

        <div className="md:col-span-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <p className="text-xs">
              <span className="font-display text-2xl tracking-tight tabular-nums">
                {total}
              </span>
              <span className="text-muted-foreground ml-2">
                {recentCopy.commits(WEEKS)}
              </span>
            </p>
            {snapshot ? (
              <a
                href={snapshot.url}
                target="_blank"
                rel="noreferrer"
                className="text-2xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 tracking-[0.16em] uppercase transition-colors"
              >
                {snapshot.fullName}
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            ) : null}
          </div>

          <motion.ol
            aria-label={recentCopy.activityLabel}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="mt-6 grid h-28 grid-cols-12 items-end gap-1.5 md:gap-2.5"
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
            {(snapshot?.commits ?? []).map((commit, i) => (
              <motion.li
                key={commit.sha}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
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
                <span className="text-muted-foreground font-display hidden text-right text-xs tracking-wide md:block">
                  {commit.sha}
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
}
