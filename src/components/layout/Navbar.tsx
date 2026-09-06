import { useEffect, useRef, useState } from 'react';
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
import { GooeyNav } from '@/components/layout/GooeyNav';

type NavbarProps = {
  visible: boolean;
};

export function Navbar({ visible }: NavbarProps) {
  const mounted = useMounted();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const active = useActiveSection(mounted, rootRef);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileOpen = open && !desktop;
  const transition = {
    duration: reducedMotion ? 0 : 0.42,
    ease: [0.22, 1, 0.36, 1],
  } as const;
  const mobileItems = navItems.map((item, index) => ({
    item,
    index,
    animate: {
      y: mobileOpen
        ? reducedMotion
          ? (index + 1) * 60
          : Array.from(
              { length: navItems.length + 1 },
              (_, step) => Math.min(step, index + 1) * 60,
            )
        : 0,
      width: mobileOpen
        ? reducedMotion
          ? 148
          : Array.from({ length: navItems.length + 1 }, (_, step) =>
              step > index ? 148 : 44,
            )
        : 44,
    },
    transition: {
      ...transition,
      duration: reducedMotion ? 0 : mobileOpen ? navItems.length * 0.16 : 0.32,
      delay:
        !mobileOpen && !reducedMotion
          ? (navItems.length - index - 1) * 0.065
          : 0,
    },
  }));
  const sectionTheme =
    sections.find((section) => section.id === active)?.theme ?? 'dark';

  useEffect(() => {
    if (!mobileOpen) return;
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
      ) {
        setOpen(false);
      }
    };
    const onResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileOpen]);

  const go = (id: SectionId) => {
    if (mobileOpen) toggleRef.current?.focus({ preventScroll: true });
    setOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
      data-theme={sectionTheme === 'dark' ? 'light' : 'dark'}
      initial={false}
      animate={{
        y: visible || reducedMotion ? 0 : -24,
        opacity: visible ? 1 : 0,
      }}
      transition={transition}
      inert={!visible}
      className="pointer-events-none fixed inset-x-0 top-4 z-40 px-4 md:top-6 md:px-10"
    >
      <svg width="0" height="0" aria-hidden className="absolute">
        <filter
          id="nav-goo"
          x="-20%"
          y="-60%"
          width="140%"
          height="240%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
      <div className="mx-auto flex w-full max-w-7xl items-start justify-between gap-6">
        <a
          href="#hero"
          aria-label={navCopy.home}
          onClick={(event) => {
            event.preventDefault();
            go('hero');
          }}
          className="bg-background text-foreground hover:bg-card pointer-events-auto flex h-11 shrink-0 items-center gap-3 rounded-full px-3 transition-colors lg:pr-5"
        >
          <Monogram className="h-5 w-5" />
          <span className="font-display text-2xs hidden tracking-[0.16em] whitespace-nowrap uppercase lg:inline">
            {contact.name}
          </span>
        </a>

        <nav
          ref={rootRef}
          aria-label={navCopy.label}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setOpen(false);
            }
          }}
          className="pointer-events-auto relative"
        >
          <div className="hidden lg:block">
            <GooeyNav items={navItems} active={active} onNavigate={go} />
          </div>

          <div className="relative size-11 lg:hidden">
            <button
              ref={toggleRef}
              type="button"
              aria-label={mobileOpen ? navCopy.close : navCopy.open}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!mobileOpen)}
              className="text-foreground hover:text-primary active:text-primary relative z-10 flex size-11 items-center justify-center rounded-full transition-colors"
            >
              <span aria-hidden className="relative h-4 w-[18px]">
                <motion.span
                  initial={false}
                  animate={{
                    y: mobileOpen ? 0 : -3,
                    rotate: mobileOpen ? 45 : 0,
                  }}
                  transition={transition}
                  className="absolute top-1/2 left-0 h-px w-full bg-current"
                />
                <motion.span
                  initial={false}
                  animate={{
                    y: mobileOpen ? 0 : 3,
                    rotate: mobileOpen ? -45 : 0,
                  }}
                  transition={transition}
                  className="absolute top-1/2 left-0 h-px w-full bg-current"
                />
              </span>
            </button>
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 right-0 h-[344px] w-[148px] [filter:url(#nav-goo)]"
            >
              <div className="bg-background absolute top-0 right-0 size-11 rounded-full" />
              {mobileItems.map(
                ({ item, index, animate, transition: itemTransition }) => (
                  <motion.div
                    key={item.id}
                    initial={false}
                    animate={animate}
                    transition={itemTransition}
                    className="bg-background absolute top-0 right-0 h-11 rounded-full"
                  >
                    <motion.div
                      initial={false}
                      animate={{ scaleY: mobileOpen ? 1 : 0 }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.16,
                        delay: mobileOpen && !reducedMotion ? index * 0.16 : 0,
                      }}
                      className={cn(
                        'bg-background absolute -top-[18px] h-5 w-3 origin-bottom rounded-full',
                        index === 0 ? 'right-4' : 'right-[68px]',
                      )}
                    />
                  </motion.div>
                ),
              )}
            </div>
            <ul
              id="mobile-navigation"
              inert={!mobileOpen}
              aria-hidden={!mobileOpen}
              className="pointer-events-none absolute top-0 right-0 w-[148px]"
            >
              {mobileItems.map(
                ({ item, index, animate, transition: itemTransition }) => (
                  <motion.li
                    key={item.id}
                    initial={false}
                    animate={animate}
                    transition={itemTransition}
                    className="absolute top-0 right-0 h-11"
                  >
                    <motion.a
                      href={`#${item.id}`}
                      aria-current={item.id === active ? 'location' : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        go(item.id);
                      }}
                      initial={false}
                      animate={{ opacity: mobileOpen ? 1 : 0 }}
                      transition={{
                        duration: reducedMotion ? 0 : 0.18,
                        delay:
                          mobileOpen && !reducedMotion
                            ? index * 0.16 + 0.12
                            : 0,
                      }}
                      className={cn(
                        'hover:text-foreground focus-visible:text-foreground flex h-11 items-center justify-center gap-2 rounded-full text-xs tracking-[0.16em] whitespace-nowrap uppercase transition-colors',
                        mobileOpen && 'pointer-events-auto',
                        item.id === active
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'bg-ochre size-1 rounded-full',
                          item.id !== active && 'opacity-0',
                        )}
                      />
                      {item.label}
                    </motion.a>
                  </motion.li>
                ),
              )}
            </ul>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
