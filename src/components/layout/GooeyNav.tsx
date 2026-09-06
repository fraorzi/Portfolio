import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';
import { getGooeyNavPath, type NavSegment } from '@/lib/gooeyNav';
import {
  contact,
  navCopy,
  type SectionId,
  type SectionMeta,
} from '@/content/site';
import { Monogram } from '@/components/marks/Monogram';

type GooeyNavProps = {
  items: readonly SectionMeta[];
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  vertical?: boolean;
};

export function GooeyNav({
  items,
  active,
  onNavigate,
  vertical = false,
}: GooeyNavProps) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const [focused, setFocused] = useState<SectionId | null>(null);
  const engaged = hovered ?? focused;
  const transition = reduce
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 } as const);
  let offset = 0;
  const segments: NavSegment[] = [];
  for (const [index, item] of items.entries()) {
    const size = vertical ? 44 : item.id === 'hero' ? 232 : 88;
    segments.push({ offset, size });
    offset += size;
    if (index < items.length - 1) {
      offset +=
        item.id === engaged || items[index + 1]?.id === engaged ? 26 : 10;
    }
  }

  return (
    <motion.div
      initial={false}
      animate={vertical ? { height: offset } : { width: offset }}
      transition={transition}
      onHoverEnd={() => setHovered(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(null);
      }}
      className={cn('relative', vertical ? 'w-48' : 'h-11')}
    >
      <svg
        aria-hidden
        className="text-background pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <motion.path
          initial={false}
          animate={{
            d: getGooeyNavPath({
              segments,
              thickness: vertical ? 192 : 44,
              vertical,
            }),
          }}
          transition={transition}
          fill="currentColor"
        />
      </svg>
      <ul>
        {items.map((item, index) => (
          <motion.li
            key={item.id}
            initial={false}
            animate={
              vertical
                ? { y: segments[index].offset }
                : { x: segments[index].offset }
            }
            transition={transition}
            style={vertical ? { width: 192 } : { width: segments[index].size }}
            className="absolute top-0 left-0 h-11"
          >
            <motion.a
              href={`#${item.id}`}
              aria-label={item.id === 'hero' ? navCopy.home : undefined}
              aria-current={active === item.id ? 'location' : undefined}
              onHoverStart={() => setHovered(item.id)}
              onFocus={() => setFocused(item.id)}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.id);
              }}
              className={cn(
                'font-display text-2xs hover:text-primary-600 focus-visible:text-primary-600 active:text-primary-700 relative flex h-full w-full items-center justify-center gap-2.5 rounded-full tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-200',
                active === item.id
                  ? 'text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {item.id === 'hero' ? (
                <>
                  <Monogram className="h-5 w-5" />
                  <span>{contact.name}</span>
                </>
              ) : (
                item.label
              )}
              {active === item.id && (
                <span
                  aria-hidden
                  className="bg-ochre absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                />
              )}
            </motion.a>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
