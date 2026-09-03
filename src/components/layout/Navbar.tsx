import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/cn';
import { scrollToId } from '@/lib/scroll';
import { navItems, sections, type SectionId } from '@/content/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useMounted } from '@/hooks/useMounted';
import { Monogram } from '@/components/marks/Monogram';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';

type NavbarProps = {
  visible: boolean;
};

export function Navbar({ visible }: NavbarProps) {
  const mounted = useMounted();
  const active = useActiveSection(mounted);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const theme = sections.find((s) => s.id === active)?.theme ?? 'dark';

  const handleSelect = (value: string) => {
    scrollToId(value as SectionId);
  };

  return (
    <motion.header
      data-theme={theme}
      initial={false}
      animate={{ y: visible ? 0 : -24, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-foreground pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4 md:top-6"
    >
      <nav
        aria-label="Nawigacja"
        className={cn(
          'pointer-events-auto flex items-center gap-2 rounded-full border py-1.5 pr-1.5 pl-3 transition-[background-color,border-color,box-shadow] duration-500',
          scrolled
            ? 'border-border bg-background/70 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md'
            : 'border-transparent bg-transparent',
        )}
      >
        <a
          href="#hero"
          aria-label="Do początku strony"
          className="flex items-center gap-2.5 pr-2"
        >
          <Monogram className="h-5 w-5" />
          <span className="font-display text-2xs hidden tracking-[0.18em] uppercase sm:inline">
            Franciszek Orzechowski
          </span>
        </a>

        <Tabs
          value={active}
          onValueChange={handleSelect}
          variant="pill"
          className="hidden md:block"
        >
          <TabsList className="bg-transparent p-0">
            {navItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                indicatorClassName="bg-foreground/[0.07]"
                className={cn(
                  'text-2xs px-3 py-1.5 tracking-[0.18em] uppercase',
                  active === item.id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className={cn(
                      'bg-ochre h-1 w-1 rounded-full transition-opacity duration-300',
                      active === item.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {item.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <a
          href="#contact"
          className="bg-foreground text-background text-2xs hover:bg-primary-600 hover:text-paper rounded-full px-4 py-2 tracking-[0.18em] uppercase transition-colors duration-300"
        >
          Zatrudnij mnie
        </a>
      </nav>
    </motion.header>
  );
}
