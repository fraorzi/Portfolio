import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

const links = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'process', label: 'Process' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[padding,backdrop-filter] duration-500 ease-[var(--ease-out-expo)]',
        scrolled ? 'pt-3' : 'pt-6',
      )}
    >
      <nav
        className={cn(
          'container-page flex items-center justify-between',
          'rounded-full border px-5 py-2 transition-all duration-500 ease-[var(--ease-out-expo)]',
          scrolled
            ? 'border-ink/10 bg-paper/80 backdrop-blur-md'
            : 'border-transparent bg-transparent',
        )}
      >
        <a
          href="#hero"
          className="font-display text-md text-ink tracking-tight"
        >
          Franciszek Orzechowski
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className="text-2xs text-ink/70 hover:text-ink tracking-[0.18em] uppercase transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className={cn(
            'border-ink/15 text-2xs text-ink rounded-full border px-4 py-1.5 tracking-[0.18em] uppercase',
            'hover:border-primary-600 hover:text-primary-600 transition-all duration-300',
          )}
        >
          Hire me
        </a>
      </nav>
    </header>
  );
}
