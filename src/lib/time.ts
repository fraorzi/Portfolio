const relative = new Intl.RelativeTimeFormat('pl-PL', { numeric: 'auto' });
const dayMonth = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'short',
});
const monthYear = new Intl.DateTimeFormat('pl-PL', {
  month: 'long',
  year: 'numeric',
});

const UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
];

export function formatRelative(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return relative.format(Math.round(seconds / size), unit);
    }
  }
  return relative.format(0, 'minute');
}

export function formatDayMonth(iso: string): string {
  return dayMonth.format(new Date(iso));
}

export function formatMonthYear(iso: string): string {
  return monthYear.format(new Date(iso));
}
