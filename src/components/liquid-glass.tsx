/**
 * LiquidGlass — ADZVO's in-flow port of liquid-glass-react
 * (https://github.com/rdev/liquid-glass-react, MIT © 2025 Max Rovensky).
 *
 * Same layers as the original:
 *   1. warp    — near-clear backdrop: blur + saturate, plus an SVG displacement
 *                filter that bends the background at the edges with an RGB
 *                (chromatic) split. The centre stays undistorted.
 *   2. tint    — very light colour wash (dark / light / gold / clear)
 *   3. rims    — two 1.5px gradient rings (screen + overlay blend) whose angle
 *                and brightness follow the pointer
 *   4. shine   — soft top highlight on hover, stronger on press
 *   5. elastic — the glass leans/stretches toward the pointer within 200px,
 *                and presses to 96% on click
 *
 * Differences from the npm package: it sits in normal layout (no absolute
 * centring, no sibling layers), pointer effects update via CSS variables
 * without React re-renders, the displacement map is generated to the element's
 * real size + corner radius, and refraction is only enabled in Chromium
 * (other browsers get blur + rims, which is what the original does in practice).
 */
import {
  createElement,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type Tint = "dark" | "light" | "gold" | "clear";

type LiquidGlassProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  style?: CSSProperties;
  /** corner radius in px (999 = pill) */
  radius?: number;
  tint?: Tint;
  /** edge refraction strength in px (Chromium only) */
  refraction?: number;
  /** RGB split at the edges */
  aberration?: number;
  blur?: number;
  saturation?: number;
  /** 0 disables the lean/stretch toward the pointer */
  elasticity?: number;
  /** adds press + hover shine */
  interactive?: boolean;
  // anything else (href, onClick, aria-*, …) is passed to the root element
  [key: string]: unknown;
};

const ACTIVATION = 200;

let chromiumCache: boolean | null = null;
function isChromium() {
  if (chromiumCache !== null) return chromiumCache;
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  // iOS browsers are all WebKit; Firefox ignores filter on backdrop output.
  chromiumCache = /Chrome\/|Chromium\/|Edg\//.test(ua) && !/CriOS|FxiOS|EdgiOS|Firefox/.test(ua);
  return chromiumCache;
}

/** Displacement map: rounded-rect SDF → vectors pointing inward near the edge. R = x, B = y, 128 = none. */
const mapCache = new Map<string, string>();
function displacementMap(w: number, h: number, r: number) {
  const W = Math.max(8, Math.round(w / 2));
  const H = Math.max(8, Math.round(h / 2));
  const R = Math.min(r / 2, W / 2, H / 2);
  const key = `${W}x${H}r${Math.round(R)}`;
  const hit = mapCache.get(key);
  if (hit) return hit;

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(W, H);
  const band = Math.max(6, Math.min(W, H) * 0.32); // how far in from the edge the bend reaches
  const hw = W / 2, hh = H / 2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = x + 0.5 - hw, py = y + 0.5 - hh;
      // signed distance to rounded rect (negative inside)
      const qx = Math.abs(px) - (hw - R), qy = Math.abs(py) - (hh - R);
      const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
      const d = Math.min(Math.max(qx, qy), 0) + Math.hypot(ox, oy) - R;
      const t = Math.min(1, Math.max(0, 1 + d / band)); // 0 inside the band's inner edge → 1 at the rim
      const s = t * t * (3 - 2 * t);
      // direction: outward normal of the nearest edge
      let nx = 0, ny = 0;
      if (qx > 0 && qy > 0) { const l = Math.hypot(ox, oy) || 1; nx = (ox / l) * Math.sign(px); ny = (oy / l) * Math.sign(py); }
      else if (qx > qy) nx = Math.sign(px);
      else ny = Math.sign(py);
      const i = (y * W + x) * 4;
      img.data[i] = 128 - nx * s * 127;      // R → x shift (sample from inside: lens magnifies toward the rim)
      img.data[i + 1] = 128;
      img.data[i + 2] = 128 - ny * s * 127;  // B → y shift
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const url = c.toDataURL();
  mapCache.set(key, url);
  return url;
}

export function LiquidGlass({
  as = "div",
  children,
  className = "",
  contentClassName = "",
  style,
  radius = 999,
  tint = "dark",
  refraction = 28,
  aberration = 2,
  blur = 6,
  saturation = 150,
  elasticity = 0.15,
  interactive = false,
  ...rest
}: LiquidGlassProps) {
  const rootRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const rawId = useId();
  const filterId = `lgf-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [map, setMap] = useState("");
  const [refract, setRefract] = useState(false);

  useEffect(() => { setRefract(isChromium() && refraction > 0); }, [refraction]);

  // Track size → regenerate displacement map
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let t = 0;
    const ro = new ResizeObserver(([e]) => {
      if (!e) return;
      // offset size = border box, unaffected by the elastic transform
      const w = Math.round((e.target as HTMLElement).offsetWidth), h = Math.round((e.target as HTMLElement).offsetHeight);
      window.clearTimeout(t);
      t = window.setTimeout(() => setSize((s) => (s && s.w === w && s.h === h ? s : { w, h })), 60);
    });
    ro.observe(el);
    return () => { ro.disconnect(); window.clearTimeout(t); };
  }, []);
  useEffect(() => {
    if (!refract || !size || !size.w || !size.h) return;
    setMap(displacementMap(size.w, size.h, Math.min(radius, size.h / 2, size.w / 2)));
  }, [refract, size, radius]);

  // Pointer: rim angle/brightness + elastic lean, written straight to CSS vars / transform
  useEffect(() => {
    const root = rootRef.current;
    const body = bodyRef.current;
    if (!root || !body) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, lx = 0, ly = 0, pressed = false;

    const apply = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = lx - cx, dy = ly - cy;
      const ex = Math.max(0, Math.abs(dx) - r.width / 2), ey = Math.max(0, Math.abs(dy) - r.height / 2);
      const edge = Math.hypot(ex, ey);
      const fade = edge > ACTIVATION ? 0 : 1 - edge / ACTIVATION;
      const mx = fade ? (dx / r.width) * 100 : 0;
      const my = fade ? (dy / r.height) * 100 : 0;
      root.style.setProperty("--lg-mx", mx.toFixed(2));
      root.style.setProperty("--lg-my", my.toFixed(2));
      root.style.setProperty("--lg-ax", Math.min(Math.abs(mx), 60).toFixed(2));

      if (reduce || !elasticity) { body.style.transform = pressed ? "scale(0.97)" : ""; return; }
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(dist / 300, 1) * elasticity * fade;
      const nx = Math.abs(dx / dist), ny = Math.abs(dy / dist);
      const sx = Math.max(0.8, 1 + nx * k * 0.3 - ny * k * 0.15);
      const sy = Math.max(0.8, 1 + ny * k * 0.3 - nx * k * 0.15);
      const tx = dx * elasticity * 0.1 * fade, ty = dy * elasticity * 0.1 * fade;
      body.style.transform = pressed
        ? `translate(${tx}px, ${ty}px) scale(0.96)`
        : `translate(${tx}px, ${ty}px) scaleX(${sx}) scaleY(${sy})`;
    };
    const onMove = (e: PointerEvent) => { lx = e.clientX; ly = e.clientY; if (!raf) raf = requestAnimationFrame(apply); };
    const onDown = () => { pressed = true; if (!raf) raf = requestAnimationFrame(apply); };
    const onUp = () => { pressed = false; if (!raf) raf = requestAnimationFrame(apply); };
    window.addEventListener("pointermove", onMove, { passive: true });
    if (interactive) { root.addEventListener("pointerdown", onDown); window.addEventListener("pointerup", onUp); }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [elasticity, interactive]);

  const warpStyle: CSSProperties = {
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    filter: refract && map ? `url(#${filterId})` : undefined,
  };

  return createElement(
    as,
    {
      ...rest,
      ref: rootRef,
      className: `lqg lqg-${tint} ${interactive ? "lqg-interactive" : ""} ${className}`,
      style: { ...style, "--lg-radius": `${radius}px` } as CSSProperties,
    },
    <span ref={bodyRef} className="lqg-body">
      {refract && map && size && (
        <svg className="lqg-svg" width="0" height="0" aria-hidden focusable="false">
          <filter id={filterId} x="0" y="0" width={size.w} height={size.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage href={map} x="0" y="0" width={size.w} height={size.h} preserveAspectRatio="none" result="MAP" />
            <feDisplacementMap in="SourceGraphic" in2="MAP" scale={refraction} xChannelSelector="R" yChannelSelector="B" result="DR" />
            <feColorMatrix in="DR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="R" />
            <feDisplacementMap in="SourceGraphic" in2="MAP" scale={refraction * (1 - aberration * 0.05)} xChannelSelector="R" yChannelSelector="B" result="DG" />
            <feColorMatrix in="DG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="G" />
            <feDisplacementMap in="SourceGraphic" in2="MAP" scale={refraction * (1 - aberration * 0.1)} xChannelSelector="R" yChannelSelector="B" result="DB" />
            <feColorMatrix in="DB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="B" />
            <feBlend in="G" in2="B" mode="screen" result="GB" />
            <feBlend in="R" in2="GB" mode="screen" />
          </filter>
        </svg>
      )}
      <span aria-hidden className="lqg-warp" style={warpStyle} />
      <span aria-hidden className="lqg-tint" />
      <span aria-hidden className="lqg-rim lqg-rim-a" />
      <span aria-hidden className="lqg-rim lqg-rim-b" />
      <span aria-hidden className="lqg-shine" />
      <span className={`lqg-content ${contentClassName}`}>{children}</span>
    </span>,
  );
}
