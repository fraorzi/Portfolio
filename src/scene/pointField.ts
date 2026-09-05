import {
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { sceneProgress } from '@/lib/sceneProgress';
import { buildTargets } from '@/scene/targets';
import { pointFragmentShader, pointVertexShader } from '@/scene/shaders';

function tokenColor(name: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return new Color(value);
}

export type PointFieldOptions = {
  container: HTMLElement;
  count: number;
  onSlowFrames?: () => void;
};

export type PointFieldHandle = {
  dispose: () => void;
};

function buildGeometry(count: number, wide: boolean) {
  const { positions, thread, seeds } = buildTargets(count, wide);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions[0], 3));
  for (let i = 1; i < positions.length; i += 1) {
    geometry.setAttribute(`aT${i}`, new BufferAttribute(positions[i], 3));
  }
  geometry.setAttribute('aThread', new BufferAttribute(thread, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  geometry.computeBoundingSphere();
  return geometry;
}

export function createPointField({
  container,
  count,
  onSlowFrames,
}: PointFieldOptions): PointFieldHandle {
  const renderer = new WebGLRenderer({
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: false,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.inset = '0';
  renderer.domElement.style.pointerEvents = 'none';
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 30);
  camera.position.set(0, 0, 6);
  const viewHeight = 2 * 6 * Math.tan((camera.fov * Math.PI) / 360);

  const ink = tokenColor('--color-ink');
  const paper = tokenColor('--color-paper');
  const accent = tokenColor('--color-primary-600');
  const ochre = tokenColor('--color-ochre');

  const material = new ShaderMaterial({
    vertexShader: pointVertexShader,
    fragmentShader: pointFragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: NormalBlending,
    uniforms: {
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 2.2 },
      uPixelRatio: { value: 1 },
      uSplitY: { value: 2 },
      uThemeAbove: { value: 1 },
      uThemeBelow: { value: 1 },
      uInk: { value: ink },
      uPaper: { value: paper },
      uAccent: { value: accent },
      uOchre: { value: ochre },
      uOpacity: { value: 0 },
      uStrength: { value: 1 },
    },
  });

  let wide = container.clientWidth >= 768;
  let geometry = buildGeometry(count, wide);
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = Math.min(width >= 768 ? 1.5 : 1, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
    material.uniforms.uPixelRatio.value = dpr;

    const nextWide = width >= 768;
    if (nextWide !== wide) {
      wide = nextWide;
      geometry.dispose();
      geometry = buildGeometry(count, wide);
      points.geometry = geometry;
    }
  };

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  let last = performance.now();
  let smoothProgress = 0;
  let smoothOffset = 0;
  let elapsed = 0;
  const stats = { frames: 0, slow: 0, reported: false };
  let visible = !document.hidden;

  const tick = (now: number) => {
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    elapsed += delta;

    smoothProgress +=
      (sceneProgress.value - smoothProgress) * Math.min(1, delta * 6);
    smoothOffset +=
      (sceneProgress.offset - smoothOffset) * Math.min(1, delta * 8);
    camera.position.y = -smoothOffset * viewHeight;

    const u = material.uniforms;
    u.uProgress.value = smoothProgress;
    u.uTime.value = elapsed;
    u.uOpacity.value = Math.min(1, u.uOpacity.value + delta * 0.8);
    u.uSplitY.value = sceneProgress.splitY;
    u.uThemeAbove.value = sceneProgress.themeAbove;
    u.uThemeBelow.value = sceneProgress.themeBelow;
    u.uStrength.value = wide ? 1 : 0.5;

    const targetY = sceneProgress.pointerX * 0.18 + elapsed * 0.02;
    const targetX = -sceneProgress.pointerY * 0.12;
    points.rotation.y +=
      (targetY - points.rotation.y) * Math.min(1, delta * 2.5);
    points.rotation.x +=
      (targetX - points.rotation.x) * Math.min(1, delta * 2.5);

    renderer.render(scene, camera);

    if (onSlowFrames && !stats.reported && elapsed > 2.5) {
      stats.frames += 1;
      if (delta > 1 / 38) stats.slow += 1;
      if (stats.frames >= 90) {
        stats.reported = true;
        if (stats.slow / stats.frames > 0.4) onSlowFrames();
      }
    }
  };

  const onVisibility = () => {
    visible = !document.hidden;
    last = performance.now();
  };
  document.addEventListener('visibilitychange', onVisibility);
  renderer.setAnimationLoop(tick);

  return {
    dispose() {
      renderer.setAnimationLoop(null);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
