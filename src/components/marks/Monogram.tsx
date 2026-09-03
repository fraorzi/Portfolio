import { motion } from 'motion/react';
import { cn } from '@/lib/cn';

type MonogramProps = {
  className?: string;
  draw?: 'none' | 'mount' | 'inView';
  strokeWidth?: number;
};

const DRAW_EASE = [0.16, 1, 0.3, 1] as const;
const DRAW_FROM = { pathLength: 0, opacity: 0 };
const DRAW_TO = { pathLength: 1, opacity: 1 };

export function Monogram({
  className,
  draw = 'none',
  strokeWidth = 1.75,
}: MonogramProps) {
  const animated = draw !== 'none';
  const initial = animated ? DRAW_FROM : undefined;
  const animate = draw === 'mount' ? DRAW_TO : undefined;
  const whileInView = draw === 'inView' ? DRAW_TO : undefined;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn('shrink-0', className)}
    >
      <motion.path
        d="M7 27V5h12M7 15.5h8"
        initial={initial}
        animate={animate}
        whileInView={whileInView}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: DRAW_EASE }}
      />
      <motion.circle
        cx="21.5"
        cy="20.5"
        r="6.5"
        initial={initial}
        animate={animate}
        whileInView={whileInView}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, delay: 0.3, ease: DRAW_EASE }}
      />
      <motion.circle
        cx="21.5"
        cy="20.5"
        r="1.4"
        stroke="none"
        className="fill-primary-500"
        initial={animated ? { scale: 0, opacity: 0 } : undefined}
        animate={draw === 'mount' ? { scale: 1, opacity: 1 } : undefined}
        whileInView={draw === 'inView' ? { scale: 1, opacity: 1 } : undefined}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 1.0, ease: DRAW_EASE }}
        style={{ originX: '21.5px', originY: '20.5px' }}
      />
    </svg>
  );
}
