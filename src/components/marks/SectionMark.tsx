import type { SectionId } from '@/content/site';
import { cn } from '@/lib/cn';

const marks: Record<SectionId, string> = {
  hero: 'M12 4v16M4 12h16',
  about: 'M10 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12ZM16 12h5',
  services: 'M4 7h16M4 12h11M4 17h6',
  projects:
    'M4 6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6ZM11 20h7a2 2 0 0 0 2-2v-7',
  skills:
    'M6 6h.01M12 6h.01M18 6h.01M6 12h.01M12 12h.01M18 12h.01M6 18h.01M12 18h.01M18 18h.01',
  process:
    'M3 12h4M10 12h4M17 12h4M7 12a1.5 1.5 0 1 0 0 .01M14 12a1.5 1.5 0 1 0 0 .01',
  contact: 'M4 13a8 8 0 0 1 14-5M18 4v4h-4',
};

type SectionMarkProps = {
  id: SectionId;
  className?: string;
};

export function SectionMark({ id, className }: SectionMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn('shrink-0', className)}
    >
      <path d={marks[id]} />
    </svg>
  );
}
