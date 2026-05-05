export function Footer() {
  return (
    <footer className="section-light border-ink/10 border-t">
      <div className="container-page text-2xs text-ink/50 flex flex-col gap-4 py-10 tracking-[0.24em] uppercase md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} Franek Orzechowski</span>
        <span>Built with React · Three.js · Motion · GSAP</span>
      </div>
    </footer>
  );
}
