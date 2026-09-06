import { useEffect, useState } from 'react';
import { contact, footer, footerTheme } from '@/content/site';
import { Monogram } from '@/components/marks/Monogram';

const timeFormatter = new Intl.DateTimeFormat('pl-PL', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: contact.timeZone,
});

export function Footer() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(timeFormatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer
      data-theme={footerTheme}
      className="bg-background text-foreground relative w-full"
    >
      <div className="container-page relative z-20 flex flex-col gap-6 py-10 text-xs md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-3">
          <Monogram className="h-5 w-5" />
          <span>{contact.name}</span>
        </p>

        <p className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1">
          <a
            href={`mailto:${contact.email}`}
            className="hover:text-foreground transition-colors"
          >
            {contact.email}
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            {contact.githubLabel}
          </a>
        </p>

        <p className="text-muted-foreground tabular-nums">
          {contact.city}, {footer.localTime}{' '}
          <span className="text-foreground inline-block min-w-[5ch]">
            {time}
          </span>
        </p>
      </div>
    </footer>
  );
}
