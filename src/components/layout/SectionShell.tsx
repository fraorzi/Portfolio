import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { SectionMeta } from '@/content/site';

type SectionShellProps = {
  meta: SectionMeta;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function SectionShell({
  meta,
  children,
  className,
  contentClassName,
}: SectionShellProps) {
  return (
    <section
      id={meta.id}
      data-theme={meta.theme}
      data-scene-index={meta.index}
      className={cn(
        'bg-background text-foreground relative flex min-h-svh w-full scroll-mt-24 flex-col justify-end [--section-bg:var(--background)] [--section-fg:var(--foreground)] md:justify-center',
        className,
      )}
    >
      <div
        className={cn(
          'container-page relative z-20 w-full pt-[36svh] pb-24 md:py-36',
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
