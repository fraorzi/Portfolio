import { useMemo } from 'react';

const COUNT = 260;

function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ScenePoster() {
  const dots = useMemo(() => {
    const random = createRandom(7);
    return Array.from({ length: COUNT }, (_, i) => {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const r = 170;
      const x = 900 + r * Math.sin(phi) * Math.cos(theta);
      const y = 330 + r * Math.cos(phi);
      const depth = (Math.sin(phi) * Math.sin(theta) + 1) / 2;
      return {
        x,
        y,
        r: 1 + depth * 1.8,
        o: 0.15 + depth * 0.35,
        accent: i % 12 === 0,
      };
    });
  }, []);

  return (
    <svg
      viewBox="0 0 1280 720"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="text-foreground/60 absolute inset-0 hidden h-full w-full md:block"
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill="currentColor"
          opacity={d.o}
          className={d.accent ? 'text-primary-500' : undefined}
        />
      ))}
    </svg>
  );
}
