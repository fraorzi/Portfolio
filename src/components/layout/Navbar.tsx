import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { scrollToId } from '@/lib/scroll';
import { getGooeyNavPath } from '@/lib/gooeyNav';
import {
  contact,
  navCopy,
  navItems,
  sections,
  type SectionId,
} from '@/content/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useMounted } from '@/hooks/useMounted';
import { GooeyNav } from '@/components/layout/GooeyNav';
import { Monogram } from '@/components/marks/Monogram';

type NavbarProps = {
  visible: boolean;
};

export function Navbar({ visible }: NavbarProps) {
  const mounted = useMounted();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const active = useActiveSection(mounted, rootRef);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sectionTheme =
    sections.find((section) => section.id === active)?.theme ?? 'dark';

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus({ preventScroll: true });
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      )
        setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const go = (id: SectionId) => {
    scrollToId(id);
    if (open) {
      setOpen(false);
      toggleRef.current?.focus({ preventScroll: true });
    }
  };

  return (
    <motion.header
      data-theme={sectionTheme === 'dark' ? 'light' : 'dark'}
      initial={false}
      animate={{ y: visible ? 0 : -24, opacity: visible ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      inert={!visible}
      className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4 md:top-6"
    >
      <nav
        ref={rootRef}
        aria-label={navCopy.label}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpen(false);
        }}
        className="pointer-events-auto relative"
      >
        <div className="hidden lg:block">
          <GooeyNav items={sections} active={active} onNavigate={go} />
        </div>
        <div className="relative lg:hidden">
          <div className="relative flex h-11 w-[182px] gap-2.5 sm:w-[370px]">
            <svg
              aria-hidden
              className="text-background pointer-events-none absolute inset-0 h-full w-full sm:hidden"
            >
              <path
                d={getGooeyNavPath({
                  segments: [
                    { offset: 0, size: 44 },
                    { offset: 54, size: 128 },
                  ],
                  thickness: 44,
                })}
                fill="currentColor"
              />
            </svg>
            <svg
              aria-hidden
              className="text-background pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
            >
              <path
                d={getGooeyNavPath({
                  segments: [
                    { offset: 0, size: 232 },
                    { offset: 242, size: 128 },
                  ],
                  thickness: 44,
                })}
                fill="currentColor"
              />
            </svg>
            <a
              href="#hero"
              aria-label={navCopy.home}
              onClick={(event) => {
                event.preventDefault();
                go('hero');
              }}
              className="text-foreground hover:text-primary-600 relative flex h-11 w-11 items-center justify-center gap-2.5 rounded-full transition-colors sm:w-[232px]"
            >
              <Monogram className="h-5 w-5" />
              <span className="font-display text-2xs hidden tracking-[0.16em] whitespace-nowrap uppercase sm:inline">
                {contact.name}
              </span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((value) => !value)}
              className="font-display text-foreground text-2xs hover:text-primary-600 relative flex h-11 w-32 items-center justify-center gap-2 rounded-full tracking-[0.16em] whitespace-nowrap uppercase transition-colors"
            >
              {navItems.find((item) => item.id === active)?.label ??
                navCopy.menu}
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
              >
                <ChevronDown className="h-3 w-3" aria-hidden />
              </motion.span>
            </button>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-navigation"
                initial={{ opacity: 0, y: reduce ? 0 : -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -8 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
                className="absolute top-full left-1/2 mt-3 max-h-[calc(100svh-6rem)] -translate-x-1/2 overflow-y-auto p-1"
              >
                <GooeyNav
                  items={navItems}
                  active={active}
                  onNavigate={go}
                  vertical
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.header>
  );
}
