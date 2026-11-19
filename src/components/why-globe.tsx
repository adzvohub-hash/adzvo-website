/**
 * WhyGlobe — rotating 3D globe for the home page "Why Choose ADZVO" section.
 *
 * - Dotted globe with organic "land" patches in brand blue, glassy fresnel rim
 * - Six gold hubs (one per reason), linked by arcs carrying travelling pulses
 * - Tilted orbit ring with gold satellites
 * - When `active` is set, the globe turns to bring that hub to the front
 *
 * `three` is loaded dynamically, so the section still renders without WebGL.
 */
import { useEffect, useRef, useState } from "react";

export const HUBS: { lat: number; lon: number }[] = [
  { lat: 28, lon: 0 },
  { lat: -12, lon: 62 },
  { lat: 42, lon: 122 },
  { lat: -30, lon: 182 },
  { lat: 14, lon: 242 },
  { lat: -42, lon: 300 },
];

const BLUE = 0xf08a1c; // globe accent — brand orange (name kept for the shader uniforms)
const GOLD = 0xe5a020;
const NAVY = 0x0a0e1f;

export function WhyGlobe({ active, className = "" }: { active: number | null; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<number | null>(active);
  const [ready, setReady] = useState(false);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import("three")
      .then((THREE) => {
        if (cancelled) return;
        cleanup = build(THREE, canvas, activeRef);
        setReady(true);
      })
      .catch((err) => console.error("Globe failed to load:", err));
    return () => { cancelled = true; cleanup?.(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function build(THREE: any, canvas: HTMLCanvasElement, activeRef: { current: number | null }) {
  const R = 2;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 10.4);

  const tilt = new THREE.Group(); // fixed axial tilt + pointer parallax
  tilt.rotation.x = 0.32;
  tilt.rotation.z = -0.12;
  scene.add(tilt);
  const globe = new THREE.Group(); // spins
  tilt.add(globe);

  const disposables: any[] = [];
  const track = <T,>(o: T) => { disposables.push(o); return o; };

  /* ── Glass core with fresnel rim ─────────────────────────────── */
  const coreMat = track(new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uBlue: { value: new THREE.Color(BLUE) } },
    vertexShader: `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uBlue; varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.4);
        vec3 inner = vec3(1.0, 0.982, 0.955);
        vec3 col = mix(inner, uBlue, f * 0.7);
        // soft top-left specular
        float spec = pow(max(dot(vN, normalize(vec3(-0.5, 0.6, 0.65))), 0.0), 24.0);
        col += spec * 0.35;
        gl_FragColor = vec4(col, 0.5 + f * 0.35);
      }`,
  }));
  globe.add(new THREE.Mesh(track(new THREE.SphereGeometry(R * 0.995, 96, 96)), coreMat));

  /* ── Atmosphere halo (back faces, outside the sphere) ─────────── */
  const haloMat = track(new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    uniforms: { uBlue: { value: new THREE.Color(BLUE) } },
    vertexShader: `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uBlue; varying vec3 vN; varying vec3 vV;
      void main() {
        float i = pow(max(0.0, 0.62 + dot(vN, vV)), 3.0);
        gl_FragColor = vec4(uBlue, i * 0.32);
      }`,
  }));
  tilt.add(new THREE.Mesh(track(new THREE.SphereGeometry(R * 1.22, 64, 64)), haloMat));

  /* ── Dotted surface with organic land patches ─────────────────── */
  const N = 5200;
  const pos = new Float32Array(N * 3);
  const land = new Float32Array(N);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const noise = (x: number, y: number, z: number) =>
    Math.sin(x * 2.1 + 1.3) * Math.sin(y * 2.7 + 0.4) * Math.sin(z * 1.9 + 2.2) +
    0.55 * Math.sin(x * 4.3 + y * 1.7 + 0.9) * Math.sin(z * 3.9 - y * 1.1) +
    0.3 * Math.sin(x * 7.1 - z * 5.3 + y * 2.9);
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const x = Math.cos(th) * r;
    const z = Math.sin(th) * r;
    pos[i * 3] = x * R * 1.003;
    pos[i * 3 + 1] = y * R * 1.003;
    pos[i * 3 + 2] = z * R * 1.003;
    land[i] = noise(x * 1.6, y * 1.6, z * 1.6) > 0.18 ? 1 : 0;
  }
  const dotGeo = track(new THREE.BufferGeometry());
  dotGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  dotGeo.setAttribute("aLand", new THREE.BufferAttribute(land, 1));
  const dotMat = track(new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uPx: { value: renderer.getPixelRatio() },
      uBlue: { value: new THREE.Color(BLUE) },
      uNavy: { value: new THREE.Color(0x0a0e1f) },
    },
    vertexShader: `
      attribute float aLand; uniform float uPx;
      varying float vFace; varying float vLand;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normalize(position));
        vFace = dot(n, normalize(-mv.xyz));
        vLand = aLand;
        float s = mix(1.3, 3.2, aLand) * uPx;
        gl_PointSize = s * (9.0 / -mv.z) * (vFace > 0.0 ? 1.0 : 0.7);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uBlue; uniform vec3 uNavy;
      varying float vFace; varying float vLand;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        if (dot(c, c) > 0.25) discard;
        float front = smoothstep(-0.15, 0.35, vFace);
        vec3 col = mix(uBlue * 1.05, mix(uBlue, uNavy, 0.14), vLand);
        float a = mix(0.06, mix(0.13, 0.95, vLand), front);
        gl_FragColor = vec4(col, a);
      }`,
  }));
  globe.add(new THREE.Points(dotGeo, dotMat));

  /* ── Latitude / longitude hairlines ──────────────────────────── */
  const gridMat = track(new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.1 }));
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts = [];
    const rr = Math.cos((lat * Math.PI) / 180) * R * 1.004;
    const yy = Math.sin((lat * Math.PI) / 180) * R * 1.004;
    for (let a = 0; a <= 128; a++) {
      const t = (a / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * rr, yy, Math.sin(t) * rr));
    }
    globe.add(new THREE.Line(track(new THREE.BufferGeometry().setFromPoints(pts)), gridMat));
  }

  /* ── Hubs ────────────────────────────────────────────────────── */
  const toVec = (lat: number, lon: number, rad = R) => {
    const la = (lat * Math.PI) / 180;
    const lo = (lon * Math.PI) / 180;
    return new THREE.Vector3(Math.cos(la) * Math.sin(lo) * rad, Math.sin(la) * rad, Math.cos(la) * Math.cos(lo) * rad);
  };
  const hubGeo = track(new THREE.SphereGeometry(0.065, 20, 20));
  const ringGeo = track(new THREE.RingGeometry(0.1, 0.13, 48));
  const beamGeo = track(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 8));
  beamGeo.translate(0, 0.25, 0);
  const hubs = HUBS.map(({ lat, lon }) => {
    const p = toVec(lat, lon, R * 1.01);
    const g = new THREE.Group();
    g.position.copy(p);
    g.lookAt(p.clone().multiplyScalar(2)); // +Z points outward
    const dot = new THREE.Mesh(hubGeo, track(new THREE.MeshBasicMaterial({ color: NAVY })));
    const ringMat = track(new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
    const ring = new THREE.Mesh(ringGeo, ringMat);
    const beamMat = track(new THREE.MeshBasicMaterial({ color: NAVY, transparent: true, opacity: 0 }));
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.x = Math.PI / 2; // point beam along +Z (outward)
    g.add(dot, ring, beam);
    globe.add(g);
    return { g, dot, ring, ringMat, beam, beamMat, lon, phase: Math.random() * Math.PI * 2, focus: 0 };
  });

  /* ── Arcs with travelling pulses ─────────────────────────────── */
  const PAIRS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 4], [2, 5]];
  const arcMats: any[] = [];
  PAIRS.forEach(([a, b], k) => {
    const va = toVec(HUBS[a]!.lat, HUBS[a]!.lon).normalize();
    const vb = toVec(HUBS[b]!.lat, HUBS[b]!.lon).normalize();
    const ang = va.angleTo(vb);
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      // true great-circle slerp, so arcs hug the globe instead of cutting through it
      const so = Math.sin(ang);
      const v = so < 1e-4 ? va.clone() : va.clone().multiplyScalar(Math.sin((1 - t) * ang) / so).add(vb.clone().multiplyScalar(Math.sin(t * ang) / so));
      const lift = 1 + Math.sin(Math.PI * t) * (0.05 + ang * 0.05);
      pts.push(v.multiplyScalar(R * 1.01 * lift));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const mat = track(new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uOff: { value: k * 0.37 },
        uSpeed: { value: 0.18 + (k % 3) * 0.05 },
        uGold: { value: new THREE.Color(NAVY) },
        uBlue: { value: new THREE.Color(BLUE) },
        uBoost: { value: 0 },
      },
      vertexShader: `varying float vT; void main(){ vT = uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uTime; uniform float uOff; uniform float uSpeed; uniform float uBoost;
        uniform vec3 uGold; uniform vec3 uBlue; varying float vT;
        void main(){
          float head = fract(uTime * uSpeed + uOff);
          float d = vT - head; if (d > 0.0) d -= 1.0;           // distance behind the head
          float tail = smoothstep(-0.28, 0.0, d) * step(d, 0.0);
          float ends = smoothstep(0.0, 0.06, vT) * smoothstep(1.0, 0.94, vT);
          vec3 col = mix(uBlue, uGold, tail);
          float a = (0.1 + uBoost * 0.22 + tail * 0.9) * ends;
          gl_FragColor = vec4(col, a);
        }`,
    }));
    arcMats.push({ mat, a, b });
    globe.add(new THREE.Mesh(track(new THREE.TubeGeometry(curve, 120, 0.011, 6, false)), mat));
  });

  /* ── Orbit rings + satellites ────────────────────────────────── */
  const orbit = new THREE.Group();
  orbit.rotation.set(1.22, 0, 0.42);
  scene.add(orbit);
  const orbitMat = track(new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.32 }));
  orbit.add(new THREE.Mesh(track(new THREE.TorusGeometry(R * 1.3, 0.006, 8, 220)), orbitMat));
  const orbit2 = new THREE.Group();
  orbit2.rotation.set(1.75, 0.3, -0.55);
  scene.add(orbit2);
  orbit2.add(new THREE.Mesh(track(new THREE.TorusGeometry(R * 1.42, 0.004, 8, 220)), track(new THREE.MeshBasicMaterial({ color: NAVY, transparent: true, opacity: 0.18 }))));
  const satGeo = track(new THREE.SphereGeometry(0.06, 16, 16));
  const sats = [0, 2.1, 4.2].map((o, i) => {
    const m = new THREE.Mesh(satGeo, track(new THREE.MeshBasicMaterial({ color: i === 1 ? NAVY : BLUE })));
    (i === 1 ? orbit2 : orbit).add(m);
    return { m, o, r: i === 1 ? R * 1.42 : R * 1.3, speed: i === 1 ? -0.22 : 0.3 };
  });

  /* ── Pointer parallax ────────────────────────────────────────── */
  let px = 0, py = 0, tx = 0, ty = 0;
  const onPointer = (e: PointerEvent) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 0.25;
    ty = (e.clientY / window.innerHeight - 0.5) * 0.18;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  /* ── Size / visibility ───────────────────────────────────────── */
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  let visible = true;
  const io = new IntersectionObserver((e) => { visible = e[0]?.isIntersecting ?? true; });
  io.observe(canvas);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clock = new THREE.Clock();
  let spin = 0.6;
  let raf = 0;
  const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const act = activeRef.current;

    // Spin: auto-rotate, or ease round to face the active hub.
    if (act !== null && hubs[act]) {
      const target = -(hubs[act].lon * Math.PI) / 180;
      spin += wrap(target - spin) * Math.min(1, dt * 2.6);
    } else {
      spin += dt * (reduce ? 0.04 : 0.16);
    }
    globe.rotation.y = spin;

    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;
    tilt.rotation.x = 0.32 + py;
    tilt.rotation.y = px;

    hubs.forEach((h, i) => {
      h.focus += ((act === i ? 1 : 0) - h.focus) * Math.min(1, dt * 5);
      const pulse = (t * 0.9 + h.phase) % 1;
      const s = 1 + pulse * (1.6 + h.focus * 2.2);
      h.ring.scale.setScalar(s);
      h.ringMat.opacity = (1 - pulse) * (0.55 + h.focus * 0.45);
      h.dot.scale.setScalar(1 + h.focus * 0.9);
      h.beamMat.opacity = h.focus * 0.85;
      h.beam.scale.set(1, 0.4 + h.focus * 0.9, 1);
    });
    arcMats.forEach(({ mat, a, b }) => {
      mat.uniforms.uTime.value = t;
      const boost = act !== null && (a === act || b === act) ? 1 : 0;
      mat.uniforms.uBoost.value += (boost - mat.uniforms.uBoost.value) * Math.min(1, dt * 4);
    });
    sats.forEach((s) => {
      const a = s.o + t * s.speed;
      s.m.position.set(Math.cos(a) * s.r, Math.sin(a) * s.r, 0);
    });
    orbit.rotation.z = 0.42 + t * 0.03;

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onPointer);
    ro.disconnect();
    io.disconnect();
    disposables.forEach((d) => d?.dispose?.());
    renderer.dispose();
  };
}
