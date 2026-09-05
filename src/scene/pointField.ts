import {
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';
import {
  SCENE_REGIONS,
  SCENE_STOPS,
  sceneProgress,
  sceneThemes,
} from '@/lib/sceneProgress';
import { buildTrail, regionAnchor, type TrailLayout } from '@/scene/targets';
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

const CAMERA_Z = 6;
const MAX_SMEAR = 0.45;

function buildGeometry(count: number, layout: TrailLayout) {
  const { positions, spines, info, reach } = buildTrail(count, layout);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aSpine', new BufferAttribute(spines, 3));
  geometry.setAttribute('aInfo', new BufferAttribute(info, 4));
  return { geometry, reach };
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
  const camera = new PerspectiveCamera(40, 1, 0.1, 40);
  camera.position.set(0, 0, CAMERA_Z);
  const viewHeight = 2 * CAMERA_Z * Math.tan((camera.fov * Math.PI) / 360);

  const anchors = Array.from({ length: SCENE_REGIONS }, () => new Vector2());
  const edges = new Array<number>(SCENE_STOPS).fill(-1000);

  const material = new ShaderMaterial({
    vertexShader: pointVertexShader,
    fragmentShader: pointFragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: NormalBlending,
    uniforms: {
      uAnchors: { value: anchors },
      uEdges: { value: edges },
      uThemes: { value: [...sceneThemes] },
      uTime: { value: 0 },
      uSize: { value: 2.2 },
      uPixelRatio: { value: 1 },
      uSmear: { value: 0 },
      uCameraY: { value: 0 },
      uViewHeight: { value: viewHeight },
      uInk: { value: tokenColor('--color-ink') },
      uPaper: { value: tokenColor('--color-paper') },
      uAccent: { value: tokenColor('--color-primary-600') },
      uOchre: { value: tokenColor('--color-ochre') },
      uOpacity: { value: 0 },
      uStrength: { value: 1 },
    },
  });

  const layoutFor = (width: number, height: number): TrailLayout => {
    const wide = width >= 768;
    return {
      wide,
      scale: wide ? 1 : 0.6,
      halfWidth: (viewHeight / 2) * (width / Math.max(1, height)),
    };
  };

  let layout = layoutFor(container.clientWidth, container.clientHeight);
  let built = buildGeometry(count, layout);
  let geometry = built.geometry;
  let reach = built.reach;
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

    const next = layoutFor(width, height);
    if (
      next.wide !== layout.wide ||
      Math.abs(next.halfWidth - layout.halfWidth) > 0.08
    ) {
      geometry.dispose();
      built = buildGeometry(count, next);
      geometry = built.geometry;
      reach = built.reach;
      points.geometry = geometry;
    }
    layout = next;
  };

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  let last = performance.now();
  let lastScroll = window.scrollY;
  let velocity = 0;
  let elapsed = 0;
  const stats = { frames: 0, slow: 0, reported: false };
  let visible = !document.hidden;

  const syncLayout = (unit: number, vh: number) => {
    const page = sceneProgress.layout;
    if (!page) return;
    for (let k = 0; k < SCENE_REGIONS; k += 1) {
      const anchor = regionAnchor(k, layout, reach);
      const top = page.tops[k];
      const centre =
        k === SCENE_STOPS
          ? top + page.heights[k] * 0.9
          : layout.wide
            ? top + Math.min(page.heights[k], vh * 1.5) / 2
            : top + vh * 0.19;
      anchors[k].set(anchor.x, -centre * unit + anchor.y);
    }
    for (let i = 0; i < SCENE_STOPS; i += 1) {
      edges[i] = -page.tops[i + 1] * unit;
    }
  };

  const tick = (now: number) => {
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    elapsed += delta;

    const vh = sceneProgress.layout?.vh ?? window.innerHeight;
    const unit = viewHeight / Math.max(1, vh);
    const scrollY = window.scrollY;
    const instant = delta > 0 ? (scrollY - lastScroll) / delta : 0;
    lastScroll = scrollY;
    velocity += (instant - velocity) * Math.min(1, delta * 5);

    syncLayout(unit, vh);

    camera.position.x = sceneProgress.pointerX * 0.12;
    camera.position.y =
      -(scrollY + vh / 2) * unit - sceneProgress.pointerY * 0.06;

    const u = material.uniforms;
    u.uTime.value = elapsed;
    u.uCameraY.value = camera.position.y;
    u.uViewHeight.value = viewHeight;
    u.uOpacity.value = Math.min(1, u.uOpacity.value + delta * 0.8);
    u.uStrength.value = layout.wide ? 1 : 0.6;
    u.uSmear.value = Math.max(
      -MAX_SMEAR,
      Math.min(MAX_SMEAR, -velocity * unit * 0.1),
    );

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
    lastScroll = window.scrollY;
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
