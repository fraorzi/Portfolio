import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Theme = 'light' | 'dark';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id: string;
  theme?: Theme;
  children: ReactNode;
  full?: boolean;
}

export function Section({
  id,
  theme = 'light',
  full = false,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={cn(
        'relative w-full',
        theme === 'light' ? 'section-light' : 'section-dark',
        full ? 'min-h-screen' : 'py-24 md:py-32',
        className,
      )}
      {...rest}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}
