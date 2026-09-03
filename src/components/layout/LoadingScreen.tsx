import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Monogram } from '@/components/marks/Monogram';

const INTRO_HOLD_MS = 1150;
const INTRO_EXIT_S = 0.9;
const INTRO_EASE = [0.76, 0, 0.24, 1] as const;

type LoadingScreenProps = {
  exiting: boolean;
  onExitStart: () => void;
  onComplete: () => void;
};

export function LoadingScreen({
  exiting,
  onExitStart,
  onComplete,
}: LoadingScreenProps) {
  useEffect(() => {
    const id = window.setTimeout(onExitStart, INTRO_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [onExitStart]);

  return (
    <motion.div
      role="status"
      aria-label="Ładowanie"
      initial={false}
      animate={{ y: exiting ? '-100%' : '0%' }}
      transition={{ duration: INTRO_EXIT_S, ease: INTRO_EASE }}
      onAnimationComplete={() => {
        if (exiting) onComplete();
      }}
      className="bg-ink text-paper fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="flex items-center gap-4">
        <Monogram draw="mount" className="h-7 w-7" />
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-sm tracking-[0.22em] uppercase"
        >
          Franciszek Orzechowski
        </motion.span>
      </div>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: INTRO_HOLD_MS / 1000,
          ease: [0.65, 0, 0.35, 1],
        }}
        className="bg-primary-600 absolute bottom-0 left-0 h-px w-full origin-left"
      />
    </motion.div>
  );
}
