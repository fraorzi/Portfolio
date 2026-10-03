import {
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';
import {
  readSceneFrame,
  SCENE_STOPS,
  sceneProgress,
  sectionShift,
  type ScreenPoint,
} from '@/lib/sceneProgress';
import {
  buildTargets,
  CAMERA_FOV,
  CAMERA_Z,
  TILT,
  type Viewport,
} from '@/scene/targets';
import { pointFragmentShader, pointVertexShader } from '@/scene/shaders';

const INK = new Color('#12110f');
const PAPER = new Color('#f4f1ea');
const ACCENT = new Color('#0f6e63');
const OCHRE = new Color('#c89b3c');

const REFERENCE_AREA = 1512 * 982;
const MAX_DENSITY = 2.5;
const MORPH_STIFFNESS = 3.2;
const MORPH_LEAD = 2 / MORPH_STIFFNESS;
const MAX_PROGRESS_RATE = 3;

function densityFor({ width, height }: Viewport) {
  return Math.min(MAX_DENSITY, Math.max(1, (width * height) / REFERENCE_AREA));
}

export type PointFieldOptions = {
  container: HTMLElement;
  count: number;
  onSlowFrames?: () => void;
};

export type PointFieldHandle = {
  dispose: () => void;
};

type Anchors = readonly (ScreenPoint | null)[];

function anchorKey(anchors: Anchors) {
  return anchors
    .map((a) => (a ? `${Math.round(a.x)},${Math.round(a.y)}` : '-'))
    .join('|');
}

function buildGeometry(count: number, viewport: Viewport, anchors: Anchors) {
  const targets = buildTargets(count, viewport, anchors);
  const { positions, thread, seeds } = targets;
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions[0], 3));
  for (let i = 1; i < positions.length; i += 1) {
    geometry.setAttribute(`aT${i}`, new BufferAttribute(positions[i], 3));
  }
  geometry.setAttribute('aThread', new BufferAttribute(thread, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  geometry.computeBoundingSphere();
  return {
    geometry,
    pivots: targets.pivots,
    threadPivot: targets.threadPivot,
  };
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
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.pointerEvents = 'none';
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 30);
  camera.position.set(0, 0, CAMERA_Z);

  const material = new ShaderMaterial({
    vertexShader: pointVertexShader,
    fragmentShader: pointFragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: NormalBlending,
    uniforms: {
      uProgress: { value: 0 },
      uShift: { value: 0 },
      uPivots: {
        value: Array.from({ length: SCENE_STOPS }, () => new Vector3()),
      },
      uThreadPivot: { value: new Vector3() },
      uYaw: { value: 0 },
      uPitch: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 2.2 },
      uPixelRatio: { value: 1 },
      uSplitY: { value: 2 },
      uThemeAbove: { value: 1 },
      uThemeBelow: { value: 1 },
      uInk: { value: INK },
      uPaper: { value: PAPER },
      uAccent: { value: ACCENT },
      uOchre: { value: OCHRE },
      uOpacity: { value: 0 },
      uStrength: { value: 1 },
    },
  });

  const measure = (): Viewport => ({
    width: container.clientWidth,
    height: container.clientHeight,
  });
  let viewport = measure();
  let wide = viewport.width >= 768;
  let density = densityFor(viewport);
  let sectionLayout = sceneProgress.layout;
  let builtAnchors = '';

  const build = () => {
    const anchors = sceneProgress.layout?.anchors ?? [];
    builtAnchors = anchorKey(anchors);
    const built = buildGeometry(Math.round(count * density), viewport, anchors);
    const u = material.uniforms;
    built.pivots.forEach((pivot, i) => u.uPivots.value[i].set(...pivot));
    u.uThreadPivot.value.set(...built.threadPivot);
    return built.geometry;
  };

  let geometry = build();
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  let rebuildTimer = 0;
  const rebuild = () => {
    rebuildTimer = 0;
    viewport = measure();
    wide = viewport.width >= 768;
    density = densityFor(viewport);
    geometry.dispose();
    geometry = build();
    points.geometry = geometry;
  };
  const scheduleRebuild = () => {
    window.clearTimeout(rebuildTimer);
    rebuildTimer = window.setTimeout(rebuild, 200);
  };

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = Math.min(width >= 768 ? 1.5 : 1, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
    material.uniforms.uPixelRatio.value = dpr;

    if (width === viewport.width && height === viewport.height) return;
    scheduleRebuild();
  };

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  let last = performance.now();
  let smoothProgress = 0;
  let progressVelocity = 0;
  let progressRate = 0;
  let lastValue = 0;
  let yaw = 0;
  let pitch = 0;
  let elapsed = 0;
  const stats = { frames: 0, slow: 0, reported: false };
  let visible = !document.hidden;

  const tick = (now: number) => {
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    elapsed += delta;

    if (sceneProgress.layout !== sectionLayout) {
      sectionLayout = sceneProgress.layout;
      if (anchorKey(sectionLayout?.anchors ?? []) !== builtAnchors) {
        scheduleRebuild();
      }
    }

    const frame = readSceneFrame();
    if (delta > 0) {
      progressRate +=
        ((frame.value - lastValue) / delta - progressRate) *
        Math.min(1, delta * 8);
    }
    lastValue = frame.value;
    const rate = Math.max(
      -MAX_PROGRESS_RATE,
      Math.min(MAX_PROGRESS_RATE, progressRate),
    );
    const target = Math.min(
      Math.ceil(frame.value),
      Math.max(Math.floor(frame.value), frame.value + rate * MORPH_LEAD),
    );
    progressVelocity +=
      (MORPH_STIFFNESS * MORPH_STIFFNESS * (target - smoothProgress) -
        2 * MORPH_STIFFNESS * progressVelocity) *
      delta;
    smoothProgress += progressVelocity * delta;

    const u = material.uniforms;
    u.uProgress.value = smoothProgress;
    u.uShift.value = sectionShift(frame, smoothProgress) * 2;
    u.uTime.value = elapsed;
    u.uOpacity.value = Math.min(1, u.uOpacity.value + delta * 0.8);
    u.uSplitY.value = frame.splitY;
    u.uThemeAbove.value = frame.themeAbove;
    u.uThemeBelow.value = frame.themeBelow;
    u.uStrength.value = (wide ? 1 : 0.5) / Math.sqrt(density);

    const targetYaw =
      sceneProgress.pointerX * TILT.pointerYaw +
      Math.sin(elapsed * 0.15) * TILT.swayYaw;
    const targetPitch = -sceneProgress.pointerY * TILT.pointerPitch;
    yaw += (targetYaw - yaw) * Math.min(1, delta * 2.5);
    pitch += (targetPitch - pitch) * Math.min(1, delta * 2.5);
    u.uYaw.value = yaw;
    u.uPitch.value = pitch;

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
      window.clearTimeout(rebuildTimer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
