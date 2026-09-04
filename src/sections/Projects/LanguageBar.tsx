import { cn } from '@/lib/cn';
import type { RepoLanguage } from '@/lib/github';

type LanguageBarProps = {
  languages: readonly RepoLanguage[];
  className?: string;
  labels?: boolean;
};

const SWATCHES = [
  'bg-foreground',
  'bg-primary-600',
  'bg-ochre',
  'bg-foreground/35',
];

export function LanguageBar({
  languages,
  className,
  labels = true,
}: LanguageBarProps) {
  if (!languages.length) return null;
  return (
    <div className={cn('text-2xs', className)}>
      <div className="bg-border flex h-1 w-full gap-px overflow-hidden rounded-full">
        {languages.map((language, i) => (
          <span
            key={language.name}
            className={cn('h-full', SWATCHES[i % SWATCHES.length])}
            style={{ width: `${Math.max(1.5, language.share * 100)}%` }}
          />
        ))}
      </div>
      {labels ? (
        <ul className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {languages.map((language, i) => (
            <li key={language.name} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  SWATCHES[i % SWATCHES.length],
                )}
              />
              {language.name}
              <span className="tabular-nums">
                {Math.round(language.share * 100)}%
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
