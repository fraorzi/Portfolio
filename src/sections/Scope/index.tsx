import { scope, scopeCopy, sections } from '@/content/site';
import { SectionShell } from '@/components/layout/SectionShell';

const meta = sections[3];

export function Scope() {
  return (
    <SectionShell meta={meta}>
      <div className="max-w-4xl">
        <h2 className="font-display text-2xl leading-tight tracking-tight">
          {scopeCopy.title}
        </h2>

        <ul className="border-border mt-10 border-t">
          {scope.map((area) => (
            <li
              key={area.title}
              className="border-border grid gap-4 border-b py-8 md:grid-cols-[10rem_1fr_13rem] md:gap-10"
            >
              <h3 className="font-display text-foreground text-lg tracking-tight">
                {area.title}
              </h3>
              <p className="text-muted-foreground max-w-[52ch] text-sm leading-relaxed">
                {area.body}
              </p>
              <p className="text-foreground text-xs leading-relaxed md:text-right">
                {area.tools.join(', ')}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
