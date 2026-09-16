// Adapted from beui.dev/components/motion/text-animation

import { motion, type Transition, useInView } from 'motion/react';
import { useMemo, useRef, type ReactNode } from 'react';
import { EASE_OUT } from '@/lib/ease';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

type SplitMode = 'word' | 'char';
type Tag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4';

export type TextRevealProps = {
  text: string | string[];
  as?: Tag;
  className?: string;
  split?: SplitMode;
  stagger?: number;
  delay?: number;
  blur?: number;
  yOffset?: string | number;
  spring?: { stiffness?: number; damping?: number; mass?: number };
  once?: boolean;
  whileInView?: boolean;
  children?: ReactNode;
};

const DEFAULT_SPRING = { stiffness: 140, damping: 26, mass: 1.2 };

type Unit = { key: string; text: string; index: number };
type Group = { key: string; units: Unit[] };
type Line = { key: string; groups: Group[] };

function tokenize(lines: string[], split: SplitMode): Line[] {
  let index = 0;
  return lines.map((line, lineIdx) => {
    const chunks = line.match(/\S+\s*|\s+/g) ?? [];
    const groups = chunks.map((chunk, groupIdx) => {
      const key = `${lineIdx}-${groupIdx}`;
      const pieces = split === 'char' ? Array.from(chunk) : [chunk];
      const units = pieces.map((text, unitIdx) => ({
        key: `${key}-${unitIdx}`,
        text,
        index: index++,
      }));
      return { key, units };
    });
    return { key: `${lineIdx}`, groups };
  });
}

export function TextReveal({
  text,
  as: Comp = 'span',
  className,
  split = 'word',
  stagger = 0.09,
  delay = 0,
  blur = 12,
  yOffset = '40%',
  spring,
  once = true,
  whileInView = false,
  children,
}: TextRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once, amount: 0.4 });
  const reduce = useReducedMotion();
  const shouldAnimate = whileInView ? inView : true;

  const lines = useMemo(
    () => tokenize(Array.isArray(text) ? text : [text], split),
    [text, split],
  );
  const s = { ...DEFAULT_SPRING, ...spring };

  const renderUnit = (unit: Unit) => {
    const d = delay + unit.index * stagger;
    const initial = reduce
      ? { opacity: 0 }
      : { y: yOffset, opacity: 0, filter: `blur(${blur}px)` };
    const animate = shouldAnimate
      ? reduce
        ? { opacity: 1 }
        : { y: 0, opacity: 1, filter: 'blur(0px)' }
      : initial;
    const transition: Transition = reduce
      ? { opacity: { duration: 0.25, ease: EASE_OUT, delay: d * 0.3 } }
      : {
          y: { type: 'spring' as const, ...s, delay: d },
          opacity: { duration: 0.7, ease: EASE_OUT, delay: d },
          filter: { duration: 0.9, ease: EASE_OUT, delay: d },
        };
    return (
      <motion.span
        key={unit.key}
        initial={initial}
        animate={animate}
        transition={transition}
        className="inline-block whitespace-pre will-change-transform"
      >
        {unit.text}
      </motion.span>
    );
  };

  return (
    <Comp ref={ref} className={cn('block', className)}>
      {lines.map((line) => (
        <span key={line.key} className="block">
          {line.groups.map((group) =>
            split === 'char' ? (
              <span key={group.key} className="inline-block whitespace-pre">
                {group.units.map(renderUnit)}
              </span>
            ) : (
              group.units.map(renderUnit)
            ),
          )}
        </span>
      ))}
      {children}
    </Comp>
  );
}
