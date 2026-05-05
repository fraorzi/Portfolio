import { LoadingScreen } from '@/components/loading/LoadingScreen';
import { Navbar } from '@/components/nav/Navbar';
import { SmoothScrollProvider } from '@/lib/lenis';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Services } from '@/sections/Services';
import { Projects } from '@/sections/Projects';
import { Skills } from '@/sections/Skills';
import { Process } from '@/sections/Process';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';

export default function App() {
  return (
    <SmoothScrollProvider>
      <LoadingScreen />
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
    </SmoothScrollProvider>
  );
}
