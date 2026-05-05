import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const TRAIL_LENGTH = '42vh';
const DESCENT_DURATION = 0.85;
const DESCENT_EASE = [0.5, 0, 0.75, 0] as const;
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

type Stage = 0 | 1 | 2 | 3;

export function LoadingScreen() {
  const [stage, setStage] = useState<Stage>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      const t = window.setTimeout(() => setStage(3), 1600);
      return () => window.clearTimeout(t);
    }
    const timers = [
      window.setTimeout(() => setStage(1), 1100),
      window.setTimeout(() => setStage(2), 2050),
      window.setTimeout(() => setStage(3), 2800),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduced]);

  if (stage === 3) return null;

  if (reduced) {
    return (
      <motion.div
        className="bg-ink fixed inset-0 z-[100] flex items-center justify-center"
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
      className="bg-ink fixed inset-0 z-[100] overflow-hidden"
      initial={{ y: 0 }}
      animate={{ y: stage >= 2 ? '-100%' : 0 }}
      transition={{ duration: 0.75, ease: CURTAIN_EASE }}
    >
      <motion.div
        aria-hidden
        className="to-paper/40 absolute top-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-b from-transparent blur-md"
        style={{ width: '12px' }}
        initial={{ height: 0 }}
        animate={{ height: stage >= 1 ? TRAIL_LENGTH : 0 }}
        transition={{ duration: DESCENT_DURATION, ease: DESCENT_EASE }}
      />
      <motion.div
        aria-hidden
        className="to-paper absolute top-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-b from-transparent"
        style={{ width: '1.5px' }}
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
            y: stage >= 1 ? TRAIL_LENGTH : 0,
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
