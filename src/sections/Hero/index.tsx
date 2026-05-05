import { HeroCanvas } from '@/three/HeroCanvas';

export function Hero() {
  return (
    <section
      id="hero"
      data-theme="dark"
      className="section-dark relative flex min-h-screen w-full items-center overflow-hidden"
    >
      <HeroCanvas />

      <div className="container-page relative z-10">
        <p className="text-2xs text-paper/60 tracking-[0.32em] uppercase">
          Front-end developer · PL
        </p>
        <h1 className="text-paper mt-6 max-w-[20ch] text-[length:var(--text-hero-lg)] leading-[1.1] tracking-[-0.02em]">
          Designing interfaces with restraint, motion, and a strong point of
          view.
        </h1>
        <p className="text-paper/70 mt-6 max-w-[44ch] text-sm">
          Portfolio of Franek Orzechowski — selected work, process, and how I
          think about the web.
        </p>
        <div className="mt-10 flex items-center gap-3">
          <a
            href="#projects"
            className="bg-primary-600 text-2xs text-paper hover:bg-primary-500 rounded-full px-5 py-2 tracking-[0.18em] uppercase transition-colors"
          >
            View work
          </a>
          <a
            href="#contact"
            className="border-paper/20 text-2xs text-paper hover:border-paper/60 rounded-full border px-5 py-2 tracking-[0.18em] uppercase transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <span className="text-2xs text-paper/40 tracking-[0.32em] uppercase">
          Scroll
        </span>
      </div>
    </section>
  );
}
