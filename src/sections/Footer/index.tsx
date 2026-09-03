import { useEffect, useState } from 'react';
import { contact, footer } from '@/content/site';
import { Monogram } from '@/components/marks/Monogram';

const timeFormatter = new Intl.DateTimeFormat('pl-PL', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: contact.timeZone,
});

function formatTime(date: Date) {
  return timeFormatter.format(date);
}

export function Footer() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer
      data-theme="light"
      className="text-foreground relative w-full py-10"
    >
      <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Monogram className="h-5 w-5" />
          <p className="text-2xs text-muted-foreground tracking-[0.18em] uppercase">
            © {new Date().getFullYear()} Franciszek Orzechowski
          </p>
        </div>

        <p className="text-2xs text-muted-foreground tracking-[0.18em] uppercase tabular-nums">
          {contact.city} · {time ?? '--:--'}
        </p>

        <p className="text-2xs text-muted-foreground tracking-[0.18em] uppercase">
          <span className="text-ochre">{footer.available}</span>{' '}
          {footer.availableFrom} · {footer.credit}
        </p>
      </div>
    </footer>
  );
}
