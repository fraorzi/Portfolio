import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/cn';
import { scrollToId } from '@/lib/scroll';
import {
  contact,
  navCopy,
  navItems,
  sections,
  type SectionId,
} from '@/content/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMounted } from '@/hooks/useMounted';
import { Monogram } from '@/components/marks/Monogram';

type NavbarProps = {
  visible: boolean;
};

const SPRING = {
  type: 'spring',
  stiffness: 380,
  damping: 34,
  mass: 0.9,
} as const;

export function Navbar({ visible }: NavbarProps) {
  const mounted = useMounted();
  const active = useActiveSection(mounted);
  const hoverable = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const sectionTheme = sections.find((s) => s.id === active)?.theme ?? 'dark';
  const theme = sectionTheme === 'dark' ? 'light' : 'dark';
  const activeItem = navItems.find((item) => item.id === active) ?? null;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  const go = (id: SectionId) => {
    scrollToId(id);
    if (!hoverable) setOpen(false);
  };

  const layers = (layer: 'goo' | 'content') => (
    <div
      aria-hidden={layer === 'goo' ? true : undefined}
      className={cn(
        'flex items-center gap-2.5',
        layer === 'goo'
          ? 'pointer-events-none absolute inset-0 [filter:url(#nav-goo)_drop-shadow(0_10px_28px_rgba(0,0,0,0.16))]'
          : 'relative z-10',
      )}
    >
      <a
        href="#hero"
        aria-label={navCopy.home}
        tabIndex={layer === 'goo' ? -1 : undefined}
        onClick={(event) => {
          event.preventDefault();
          go('hero');
        }}
        className={cn(
          'flex h-10 items-center gap-2.5 rounded-full pr-4 pl-3',
          layer === 'goo'
            ? 'bg-background text-transparent'
            : 'text-foreground',
        )}
      >
        <Monogram className={cn('h-5 w-5', layer === 'goo' && 'invisible')} />
        <span className="font-display text-2xs hidden tracking-[0.16em] uppercase sm:inline">
          {contact.name}
        </span>
      </a>

      <motion.div
        layout
        transition={SPRING}
        className={cn(
          'flex h-10 items-center overflow-hidden rounded-full',
          layer === 'goo'
            ? 'bg-background text-transparent'
            : 'text-foreground',
        )}
      >
        {open ? (
          <motion.ul layout="position" className="flex items-center px-1.5">
            {navItems.map((item) => {
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    tabIndex={layer === 'goo' ? -1 : undefined}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      go(item.id);
                    }}
                    className={cn(
                      'text-2xs flex h-7 items-center gap-1.5 rounded-full px-3 tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-300',
                      layer === 'content' &&
                        (isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'),
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'h-1 w-1 rounded-full',
                        layer === 'content' && 'bg-ochre',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </motion.ul>
        ) : (
          <motion.button
            layout="position"
            type="button"
            tabIndex={layer === 'goo' ? -1 : undefined}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="text-2xs flex h-10 items-center gap-2 px-4 tracking-[0.16em] whitespace-nowrap uppercase"
          >
            <span
              aria-hidden
              className={cn(
                'h-1 w-1 rounded-full',
                layer === 'content' && 'bg-ochre',
              )}
            />
            {activeItem ? activeItem.label : navCopy.menu}
            <span className="sr-only">{navCopy.open}</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );

  return (
    <motion.header
      data-theme={theme}
      initial={false}
      animate={{ y: visible ? 0 : -24, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4 md:top-6"
    >
      <svg width="0" height="0" aria-hidden className="absolute">
        <filter
          id="nav-goo"
          x="-30%"
          y="-60%"
          width="160%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            result="goo"
          />
        </filter>
      </svg>

      <motion.nav
        ref={rootRef}
        aria-label={navCopy.label}
        layout
        transition={SPRING}
        onHoverStart={() => hoverable && setOpen(true)}
        onHoverEnd={() => hoverable && setOpen(false)}
        onBlur={handleBlur}
        onFocus={() => setOpen(true)}
        className="pointer-events-auto relative"
      >
        {layers('goo')}
        {layers('content')}
      </motion.nav>
    </motion.header>
  );
}
