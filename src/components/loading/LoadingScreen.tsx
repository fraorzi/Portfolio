import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  LOADING_SCREEN_SCROLL_DURATION,
  LOADING_SCREEN_SCROLL_EASE,
} from '@/components/loading/constants';

const TRAIL_LENGTH = '42vh';
const NAME_TRAIL_GAP = '32px';
const NAME_DESCENT = `calc(${TRAIL_LENGTH} + ${NAME_TRAIL_GAP})`;
const DESCENT_DURATION = 0.85;
const DESCENT_EASE = [0.5, 0, 0.75, 0] as const;
const EXIT_START_MS = 2050;
const COMPLETE_MS = 3025;

type Stage = 0 | 1 | 2 | 3;

type LoadingScreenProps = {
  onComplete?: () => void;
  onExitStart?: () => void;
};

export function LoadingScreen({ onComplete, onExitStart }: LoadingScreenProps) {
  const [stage, setStage] = useState<Stage>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(() => {
        setStage(3);
        onComplete?.();
      }, 1600);
      return () => window.clearTimeout(t);
    }
    const timers = [
      window.setTimeout(() => setStage(1), 1100),
      window.setTimeout(() => {
        setStage(2);
        onExitStart?.();
      }, EXIT_START_MS),
      window.setTimeout(() => {
        setStage(3);
        onComplete?.();
      }, COMPLETE_MS),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onComplete, onExitStart, reduced]);

  if (stage === 3) return null;

  if (reduced) {
    return (
      <motion.div
        className="bg-ink fixed inset-0 z-100 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="text-paper flex items-center gap-3">
          <span className="bg-primary-500 block size-2 rounded-full" />
          <span className="font-display text-md tracking-tight">
            Franciszek Orzechowski
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-ink fixed inset-0 z-100 overflow-hidden"
      initial={{ y: 0 }}
      animate={{ y: stage >= 2 ? '-100svh' : 0 }}
      transition={{
        duration: LOADING_SCREEN_SCROLL_DURATION,
        ease: LOADING_SCREEN_SCROLL_EASE,
      }}
    >
      <motion.div
        aria-hidden
        className="to-paper/40 absolute top-1/2 left-1/2 -translate-x-1/2 bg-linear-to-b from-transparent blur-md"
        style={{ width: '9px' }}
        initial={{ height: 0 }}
        animate={{ height: stage >= 1 ? TRAIL_LENGTH : 0 }}
        transition={{ duration: DESCENT_DURATION, ease: DESCENT_EASE }}
      />
      <motion.div
        aria-hidden
        className="to-paper absolute top-1/2 left-1/2 -translate-x-1/2 bg-linear-to-b from-transparent"
        style={{ width: '1px' }}
        initial={{ height: 0 }}
        animate={{ height: stage >= 1 ? TRAIL_LENGTH : 0 }}
        transition={{ duration: DESCENT_DURATION, ease: DESCENT_EASE }}
      />
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
        <motion.span
          aria-hidden
          className="bg-primary-500 block size-2 rounded-full"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: stage >= 1 ? 0 : 1,
            scale: 1,
          }}
          transition={{
            opacity: { duration: 0.4, ease: [0.19, 1, 0.22, 1] },
            scale: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
          }}
        />
        <motion.span
          className="text-paper font-display text-md tracking-tight whitespace-nowrap"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: 1,
            y: stage >= 1 ? NAME_DESCENT : 0,
          }}
          transition={{
            opacity: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
            y: { duration: DESCENT_DURATION, ease: DESCENT_EASE },
          }}
        >
          Franciszek Orzechowski
        </motion.span>
      </div>
    </motion.div>
  );
}
