import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="bg-ink fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          <motion.div
            className="text-paper flex items-center gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="bg-primary-500 block size-2 rounded-full" />
            <span className="font-display text-md tracking-tight">
              Franek Orzechowski
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
