import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import {
  LOADING_SCREEN_SCROLL_DURATION,
  LOADING_SCREEN_SCROLL_EASE,
} from '@/components/loading/constants';
import { Navbar } from '@/components/nav/Navbar';
import { SmoothScrollProvider } from '@/lib/lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Services } from '@/sections/Services';
import { Projects } from '@/sections/Projects';
import { Skills } from '@/sections/Skills';
import { Process } from '@/sections/Process';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';

type IntroPhase = 'active' | 'exiting' | 'done';

export default function App() {
  const [introPhase, setIntroPhase] = useState<IntroPhase>('active');
  const reduced = useReducedMotion();
  const introVisible = introPhase !== 'done';

  const handleExitStart = useCallback(() => setIntroPhase('exiting'), []);
  const handleComplete = useCallback(() => setIntroPhase('done'), []);

  useEffect(() => {
    if (!introVisible) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [introVisible]);

  return (
    <SmoothScrollProvider>
      <LoadingScreen
        onComplete={handleComplete}
        onExitStart={handleExitStart}
      />
      <motion.div
        aria-hidden={introVisible}
        className="min-h-screen"
        inert={introVisible ? true : undefined}
        initial={false}
        animate={{
          y: !reduced && introPhase === 'active' ? '100svh' : 0,
        }}
        transition={{
          duration: LOADING_SCREEN_SCROLL_DURATION,
          ease: LOADING_SCREEN_SCROLL_EASE,
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Projects />
          <Skills />
          <Process />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </SmoothScrollProvider>
  );
}
