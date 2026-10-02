import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { Navbar } from '@/components/layout/Navbar';
import { SmoothScrollProvider } from '@/lib/lenis';
import { refreshRepos } from '@/lib/repoStore';
import { useMounted } from '@/hooks/useMounted';
import { useSceneLayout } from '@/hooks/useSceneLayout';
import { Scene } from '@/scene/Scene';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Projects } from '@/sections/Projects';
import { Scope } from '@/sections/Scope';
import { Recent } from '@/sections/Recent';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';

type IntroPhase = 'active' | 'exiting' | 'done';

export default function App() {
  const mounted = useMounted();
  const [introPhase, setIntroPhase] = useState<IntroPhase>('active');
  const introVisible = introPhase !== 'done';

  useSceneLayout(mounted);

  useEffect(() => {
    refreshRepos();
  }, []);

  const handleExitStart = useCallback(() => setIntroPhase('exiting'), []);
  const handleComplete = useCallback(() => setIntroPhase('done'), []);

  useLayoutEffect(() => {
    if (!introVisible) return;
    const previousRestoration = window.history.scrollRestoration;
    const previousOverflow = document.documentElement.style.overflow;
    window.history.scrollRestoration = 'manual';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return () => {
      window.history.scrollRestoration = previousRestoration;
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [introVisible]);

  return (
    <SmoothScrollProvider>
      {introVisible ? (
        <LoadingScreen
          exiting={introPhase === 'exiting'}
          onExitStart={handleExitStart}
          onComplete={handleComplete}
        />
      ) : null}

      <Scene active={mounted} />

      <div aria-hidden={introVisible} inert={introVisible ? true : undefined}>
        <Navbar visible={introPhase !== 'active'} />
        <main>
          <Hero ready={introPhase !== 'active'} />
          <About />
          <Projects />
          <Scope />
          <Recent />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
