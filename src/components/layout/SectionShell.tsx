import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { sections, type SectionMeta } from '@/content/site';
import { SectionMark } from '@/components/marks/SectionMark';

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
  const folio = `${String(meta.index).padStart(2, '0')} / ${String(
    sections.length - 1,
  ).padStart(2, '0')}`;

  return (
    <section
      id={meta.id}
      data-theme={meta.theme}
      data-scene-index={meta.index}
      className={cn(
        'text-foreground relative w-full scroll-mt-24 py-28 md:py-40',
        className,
      )}
    >
      <div className={cn('container-page relative', contentClassName)}>
        <div className="text-muted-foreground mb-14 flex items-center gap-4 md:mb-20">
          <SectionMark id={meta.id} className="text-primary-600 h-4 w-4" />
          <span className="eyebrow">{meta.label}</span>
          <span className="bg-border h-px flex-1" aria-hidden />
          <span className="text-2xs text-ochre tabular-nums">{folio}</span>
        </div>
        {children}
      </div>
    </section>
  );
}
