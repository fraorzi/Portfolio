import { useMemo } from 'react';

const COUNT = 420;

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
      const t = random() * Math.PI * 2;
      const size = 78;
      const spread = (random() - 0.5) * 14;
      const x = 900 + (Math.sin(t) + 2 * Math.sin(2 * t)) * size + spread;
      const y = 360 + (Math.cos(t) - 2 * Math.cos(2 * t)) * size + spread;
      const depth = (Math.sin(3 * t) + 1) / 2;
      return {
        x,
        y,
        r: 1 + depth * 1.6,
        o: 0.2 + depth * 0.4,
        accent: i % 12 === 0,
      };
    });
  }, []);

  return (
    <svg
      viewBox="0 0 1280 720"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="text-paper absolute inset-0 hidden h-full w-full mix-blend-difference md:block"
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill="currentColor"
          opacity={d.o}
          className={d.accent ? 'text-primary-400' : undefined}
        />
      ))}
    </svg>
  );
}
