import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LoadingScreen } from '@/components/loading/LoadingScreen';
import {
  LOADING_SCREEN_SCROLL_DURATION,
  LOADING_SCREEN_SCROLL_EASE,
} from '@/components/loading/constants';
import { Navbar } from '@/components/nav/Navbar';
import { SmoothScrollProvider } from '@/lib/lenis';
import { ScrollTrigger } from '@/lib/gsap';
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

const INTRO_STORAGE_KEY = 'portfolio:intro-seen';

function canUseSessionStorage() {
  try {
    window.sessionStorage.getItem(INTRO_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

function hasSeenIntro() {
  if (!canUseSessionStorage()) return false;
  return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === 'true';
}

function markIntroSeen() {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
}

function getInitialIntroPhase(): IntroPhase {
  return hasSeenIntro() ? 'done' : 'active';
}

export default function App() {
  const [introPhase, setIntroPhase] =
    useState<IntroPhase>(getInitialIntroPhase);
  const reduced = useReducedMotion();
  const introVisible = introPhase !== 'done';

  const handleExitStart = useCallback(() => setIntroPhase('exiting'), []);
  const handleComplete = useCallback(() => {
    markIntroSeen();
    setIntroPhase('done');
  }, []);

  useLayoutEffect(() => {
    if (!introVisible) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    window.history.scrollRestoration = 'manual';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousScrollRestoration;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [introVisible]);

  useEffect(() => {
    if (introPhase !== 'done') return;
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [introPhase]);

  return (
    <SmoothScrollProvider>
      {introVisible ? (
        <LoadingScreen
          onComplete={handleComplete}
          onExitStart={handleExitStart}
        />
      ) : null}
      <motion.div
        aria-hidden={introVisible}
        className="bg-ink min-h-screen"
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
