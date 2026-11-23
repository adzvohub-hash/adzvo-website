/**
 * Home page — "Why Choose ADZVO".
 * Centre: glass orb with the ADZVO mark on a glowing pedestal.
 * Around it: six faded-glass pill cards (orange-family accents), each linked
 * to the orb by a curved connector with flowing dashes.
 * The section cycles through the reasons; hover/focus a card to take over.
 * All layout/visual CSS is self-contained (WHY_CSS) so it doesn't depend on
 * which Tailwind utilities a build generates.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Cpu, Handshake, Lightbulb, Target, TrendingUp, Users } from "lucide-react";
import { BrandMark, Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";

type Reason = { icon: ReactNode; title: string; desc: string; from: string; to: string };

const REASONS: Reason[] = [
  { icon: <Lightbulb />,  title: "Creative Excellence",        desc: "Ideas that inspire and make an impact.",            from: "#F9C777", to: "#F5A524" }, // brand gold
  { icon: <Cpu />,        title: "Tech-Enabled Solutions",     desc: "Leveraging the latest tech for smarter outcomes.", from: "#F5A524", to: "#DC8E12" }, // amber gold
  { icon: <Users />,      title: "Experienced Team",           desc: "A passionate team that makes it happen.",          from: "#F9C777", to: "#F5A524" }, // soft gold
  { icon: <Target />,     title: "Strategic Approach",         desc: "Insights-driven, always a step ahead.",            from: "#F5A524", to: "#F5A524" }, // gold
  { icon: <Handshake />,  title: "Client-Centric Partnership", desc: "Your goals, our commitment.",                      from: "#F9C777", to: "#DC8E12" }, // honey
  { icon: <TrendingUp />, title: "Real Business Impact",       desc: "Measurable results for a brighter tomorrow.",      from: "#F5A524", to: "#DC8E12" }, // deep amber
];

/** where each connector meets the orb (degrees; 0 = right, 90 = down) */
const ORB_ANGLES = [215, 180, 145, -35, 0, 35];
const CYCLE_MS = 3200;

type Line = { d: string; sx: number; sy: number; ex: number; ey: number };

export function WhySection() {
  const [auto, setAuto] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const active = hover ?? auto;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => setInView(e[0]?.isIntersecting ?? false), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || hover !== null) return;
    const id = window.setInterval(() => setAuto((a) => (a + 1) % REASONS.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [inView, hover]);

  /* Connector geometry, measured from the real layout (desktop only) */
  const measure = useCallback(() => {
    const stage = stageRef.current, orb = orbRef.current;
    if (!stage || !orb || window.innerWidth < 1024) { setLines([]); return; }
    const s = stage.getBoundingClientRect();
    const o = orb.getBoundingClientRect();
    const cx = o.left + o.width / 2 - s.left, cy = o.top + o.height / 2 - s.top, r = o.width / 2;
    const next: Line[] = [];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const c = card.getBoundingClientRect();
      const left = i < 3;
      const sx = (left ? c.right : c.left) - s.left;
      const sy = c.top + c.height / 2 - s.top;
      const a = (ORB_ANGLES[i]! * Math.PI) / 180;
      const ex = cx + Math.cos(a) * (r + 6);
      const ey = cy + Math.sin(a) * (r + 6);
      const dx = ex - sx;
      next.push({ sx, sy, ex, ey, d: `M ${sx} ${sy} C ${sx + dx * 0.55} ${sy}, ${ex - dx * 0.35} ${ey}, ${ex} ${ey}` });
    });
    setLines(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 600); // after fonts settle
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); window.clearTimeout(t); };
  }, [measure]);

  const card = (i: number) => {
    const r = REASONS[i]!;
    const left = i < 3;
    const style = { "--a1": r.from, "--a2": r.to } as CSSProperties;
    return (
      <article
        key={r.title}
        ref={(el) => { cardRefs.current[i] = el; }}
        tabIndex={0}
        onMouseEnter={() => setHover(i)}
        onMouseLeave={() => { setHover(null); setAuto(i); }}
        onFocus={() => setHover(i)}
        onBlur={() => { setHover(null); setAuto(i); }}
        className={`why2-card ${left ? "why2-left" : "why2-right"} why2-pos-${i % 3} ${active === i ? "is-active" : ""}`}
        style={style}
      >
        <span className="why2-icon">{r.icon}</span>
        <span className="why2-body">
          <span className="why2-num" style={LOGO_FONT}>{String(i + 1).padStart(2, "0")}</span>
          <span className="font-display why2-title">{r.title}</span>
          <span className="why2-desc">{r.desc}</span>
        </span>
      </article>
    );
  };

  return (
    <section ref={sectionRef} id="why" className="why2">
      {/* background: warm glow + flowing light ribbons */}
      <div aria-hidden className="why2-bg">
        <svg viewBox="0 0 1440 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="why2-rib1" x1="0" x2="1">
              <stop offset="0" stopColor="#F5A524" stopOpacity="0" />
              <stop offset=".35" stopColor="#F5A524" stopOpacity=".55" />
              <stop offset=".7" stopColor="#F5A524" stopOpacity=".35" />
              <stop offset="1" stopColor="#F5A524" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="why2-rib2" x1="0" x2="1">
              <stop offset="0" stopColor="#F9C777" stopOpacity="0" />
              <stop offset=".5" stopColor="#F5A524" stopOpacity=".35" />
              <stop offset="1" stopColor="#F9C777" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M-50 770 C 300 690, 520 820, 860 730 S 1300 650, 1500 720" stroke="url(#why2-rib1)" strokeWidth="60" fill="none" opacity=".3" />
          <path d="M-50 790 C 360 730, 560 830, 900 760 S 1290 690, 1500 740" stroke="url(#why2-rib2)" strokeWidth="1.5" fill="none" opacity=".6" />
          <path d="M-50 750 C 340 680, 600 800, 880 715 S 1280 640, 1500 690" stroke="url(#why2-rib1)" strokeWidth="1.2" fill="none" opacity=".6" />
          <path d="M-50 200 C 260 120, 480 260, 760 170 S 1200 60, 1500 140" stroke="url(#why2-rib2)" strokeWidth="1.5" fill="none" opacity=".7" />
        </svg>
      </div>

      <div className="page-shell why2-inner">
        <div className="reveal why2-head">
          <SectionLabel>Why Choose ADZVO</SectionLabel>
          <h2 className="font-display why2-h2">More Than a Service. <Highlight>A Strategic Partner.</Highlight></h2>
          <p className="why2-sub">Creativity, technology and strategy — working together for your brand.</p>
        </div>

        <div ref={stageRef} className="reveal why2-stage">
          {/* connectors */}
          {lines.length > 0 && (
            <svg className="why2-lines" aria-hidden>
              <defs>
                {REASONS.map((r, i) => (
                  <linearGradient key={i} id={`why2-l${i}`} gradientUnits="userSpaceOnUse"
                    x1={lines[i]?.sx ?? 0} y1={lines[i]?.sy ?? 0} x2={lines[i]?.ex ?? 0} y2={lines[i]?.ey ?? 0}>
                    <stop offset="0" stopColor={r.to} />
                    <stop offset="1" stopColor={r.from} />
                  </linearGradient>
                ))}
              </defs>
              {lines.map((l, i) => (
                <g key={i} className={`why2-line ${active === i ? "is-active" : ""}`}>
                  <path d={l.d} stroke={`url(#why2-l${i})`} className="why2-path" />
                  <path d={l.d} stroke={REASONS[i]!.to} className="why2-flow" />
                  <circle cx={l.sx} cy={l.sy} r="4.5" fill={REASONS[i]!.to} className="why2-dot" />
                  <circle cx={l.ex} cy={l.ey} r="4" fill={REASONS[i]!.to} className="why2-dot" />
                </g>
              ))}
            </svg>
          )}

          <div className="why2-col why2-col-left">{[0, 1, 2].map(card)}</div>

          <div className="why2-center">
            <div className="why2-halo" aria-hidden />
            <div ref={orbRef} className="why2-orb">
              <span aria-hidden className="why2-orb-rim" />
              <span aria-hidden className="why2-orb-spec" />
              <div className="why2-logo">
                <span className="why2-mark-wrap">
                  <BrandMark className="why2-mark" />
                  <svg aria-hidden className="why2-spark" viewBox="0 0 24 24"><path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z" /></svg>
                </span>
                <span className="why2-word" style={LOGO_FONT}>ADZVO</span>
                <span className="why2-tag" style={LOGO_FONT}>IDEAS · PEOPLE · IMPACT</span>
              </div>
            </div>
            {/* navy platform with a gold rim — same as the landing platform on the About page */}
            <div className="why2-pedestal" aria-hidden>
              <span className="why2-plat-shadow" />
              <span className="why2-plat-side" />
              <span className="why2-plat-top" />
              <span className="why2-plat-glow" />
            </div>
          </div>

          <div className="why2-col why2-col-right">{[3, 4, 5].map(card)}</div>
        </div>
      </div>
      <style>{WHY_CSS}</style>
    </section>
  );
}

const WHY_CSS = `
.why2 { position: relative; overflow: hidden; padding: 6rem 0 7rem;
  background: radial-gradient(60% 55% at 50% 58%, #F7F0E8 0%, rgba(247,242,235,0) 70%), linear-gradient(180deg, #fffefa 0%, #F7F5F3 55%, #fffbf3 100%); }
.why2-bg { position: absolute; inset: 0; pointer-events: none; }
.why2-bg svg { width: 100%; height: 100%; }
.why2-inner { position: relative; z-index: 1; }

.why2-head { text-align: center; }
.why2-h2 { margin-top: 1.5rem; font-weight: 800; line-height: 1.15; color: #0C1020; font-size: clamp(1.5rem, 2.6vw, 2.5rem); }
.why2-sub { margin-top: 1.1rem; color: rgba(12,16,32,.62); font-size: clamp(1rem, 1.3vw, 1.125rem); }
@media (min-width: 1024px) { .why2-h2, .why2-sub { white-space: nowrap; } }

/* ── stage ───────────────────────────────────────────── */
.why2-stage { position: relative; margin-top: 3rem; display: grid; gap: 1.25rem;
  grid-template-columns: minmax(0,1fr); grid-template-areas: "center" "left" "right"; }
.why2-col { display: grid; gap: 1rem; grid-template-columns: minmax(0,1fr); position: relative; z-index: 2; }
.why2-col-left { grid-area: left; }
.why2-col-right { grid-area: right; }
.why2-center { grid-area: center; position: relative; display: grid; place-items: center; padding-bottom: 70px; }
@media (min-width: 640px) { .why2-col { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (min-width: 1024px) {
  .why2-stage { margin-top: 3.5rem; align-items: center; gap: 0;
    grid-template-columns: minmax(0,1fr) minmax(360px, 440px) minmax(0,1fr); grid-template-areas: "left center right"; }
  .why2-col { grid-template-columns: minmax(0,1fr); gap: 1.6rem; }
  .why2-col-left { justify-items: end; padding-right: 2.5rem; }
  .why2-col-right { justify-items: start; padding-left: 2.5rem; }
  /* arc: top & bottom cards tuck in toward the orb, the middle one sits further out */
  .why2-card { max-width: min(410px, calc(100% - 3rem)); }
  .why2-left.why2-pos-0,  .why2-left.why2-pos-2  { margin-right: -1.25rem; }
  .why2-right.why2-pos-0, .why2-right.why2-pos-2 { margin-left: -1.25rem; }
  .why2-left.why2-pos-1  { margin-right: 1.75rem; }
  .why2-right.why2-pos-1 { margin-left: 1.75rem; }
}
.why2-lines { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 1; }

/* ── connectors ───────────────────────────────────────── */
.why2-path { fill: none; stroke-width: 1.6; opacity: .55; transition: opacity .5s ease, stroke-width .5s ease; }
.why2-flow { fill: none; stroke-width: 2; stroke-dasharray: 3 12; stroke-linecap: round; opacity: 0; animation: why2-flow 1.6s linear infinite; transition: opacity .5s ease; }
.why2-dot { opacity: .75; transition: opacity .4s ease; }
.why2-line.is-active .why2-path { opacity: 1; stroke-width: 2.2; }
.why2-line.is-active .why2-flow { opacity: .9; }
.why2-line.is-active .why2-dot { opacity: 1; filter: drop-shadow(0 0 6px currentColor); }
@keyframes why2-flow { to { stroke-dashoffset: -30; } }

/* ── cards: faded glass pills ─────────────────────────── */
.why2-card { position: relative; display: flex; align-items: center; gap: 1.1rem; width: 100%; max-width: 410px;
  padding: 1rem 1.6rem 1rem 1rem; border-radius: 2.25rem; cursor: default; outline: none;
  background:
    linear-gradient(100deg, color-mix(in srgb, var(--a1) 34%, transparent) 0%, color-mix(in srgb, var(--a1) 10%, transparent) 38%, rgba(255,255,255,.35) 70%, rgba(255,255,255,.55) 100%),
    rgba(255,255,255,.45);
  -webkit-backdrop-filter: blur(14px) saturate(170%); backdrop-filter: blur(14px) saturate(170%);
  border: 1px solid rgba(255,255,255,.9);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,1), inset 0 -10px 24px rgba(255,255,255,.35),
    0 16px 36px -18px color-mix(in srgb, var(--a2) 55%, transparent), 0 2px 6px rgba(12,16,32,.04);
  transition: transform .5s cubic-bezier(.2,.8,.2,1), box-shadow .5s ease, background .5s ease; }
/* glass sheen along the top edge */
.why2-card::after { content: ""; position: absolute; inset: 1px 18px auto 18px; height: 45%; border-radius: 2rem 2rem 50% 50% / 2rem 2rem 100% 100%;
  background: linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,0)); pointer-events: none; }
.why2-card.is-active { transform: translateY(-4px) scale(1.02);
  background:
    linear-gradient(100deg, color-mix(in srgb, var(--a1) 48%, transparent) 0%, color-mix(in srgb, var(--a1) 18%, transparent) 40%, rgba(255,255,255,.45) 72%, rgba(255,255,255,.62) 100%),
    rgba(255,255,255,.5);
  box-shadow:
    inset 0 1px 0 #fff, inset 0 -10px 24px rgba(255,255,255,.4),
    0 0 0 1.5px color-mix(in srgb, var(--a2) 45%, transparent),
    0 24px 48px -18px color-mix(in srgb, var(--a2) 70%, transparent); }
.why2-card:focus-visible { box-shadow: 0 0 0 2px var(--a2); }

.why2-icon { position: relative; z-index: 1; flex-shrink: 0; display: grid; place-items: center; width: 4rem; height: 4rem; border-radius: 999px;
  color: #fff; background: radial-gradient(circle at 30% 25%, var(--a1), var(--a2) 75%);
  border: 3px solid rgba(255,255,255,.75);
  box-shadow: 0 10px 22px -6px color-mix(in srgb, var(--a2) 80%, transparent), inset 0 2px 4px rgba(255,255,255,.55), inset 0 -4px 8px rgba(0,0,0,.08); }
.why2-icon svg { width: 1.6rem; height: 1.6rem; stroke-width: 2; filter: drop-shadow(0 1px 1px rgba(0,0,0,.15)); }
.why2-card.is-active .why2-icon::after { content: ""; position: absolute; inset: -6px; border-radius: inherit; border: 2px solid var(--a1);
  animation: why2-ping 1.6s ease-out infinite; }
@keyframes why2-ping { from { transform: scale(.9); opacity: .9; } to { transform: scale(1.35); opacity: 0; } }

.why2-body { position: relative; z-index: 1; display: flex; flex-direction: column; min-width: 0; }
.why2-num { font-size: .95rem; font-weight: 800; letter-spacing: .08em; color: var(--a2); }
.why2-title { margin-top: .1rem; font-size: 1.05rem; font-weight: 800; line-height: 1.25; color: #0C1020; letter-spacing: .01em; }
.why2-desc { margin-top: .3rem; font-size: .9rem; line-height: 1.45; color: rgba(12,16,32,.62); }

/* ── orb ───────────────────────────────────────────────── */
.why2-orb { position: relative; z-index: 2; width: min(78vw, 360px); aspect-ratio: 1; border-radius: 999px; display: grid; place-items: center;
  background:
    radial-gradient(circle at 34% 26%, rgba(255,255,255,1) 0%, rgba(255,255,255,.92) 22%, rgba(247,245,243,.7) 50%, rgba(249,199,119,.4) 78%, rgba(245,165,36,.28) 100%);
  -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
  box-shadow:
    inset 0 0 0 1.5px rgba(255,255,255,.95),
    inset 18px 22px 50px rgba(255,255,255,.9),
    inset -26px -34px 70px rgba(245,165,36,.22),
    0 0 0 10px rgba(255,255,255,.35),
    0 0 60px 10px rgba(245,165,36,.22),
    0 40px 80px -30px rgba(220,142,18,.45);
  animation: why2-float 6s ease-in-out infinite; }
@keyframes why2-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.why2-orb-rim { position: absolute; inset: -2px; border-radius: inherit; padding: 2.5px; pointer-events: none;
  background: conic-gradient(from 0deg, rgba(255,255,255,.95), #F5A524, rgba(255,255,255,.2), #F5A524, rgba(255,255,255,.95), #F5A524, rgba(255,255,255,.2), rgba(255,255,255,.95));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude;
  animation: why2-spin 14s linear infinite; }
@keyframes why2-spin { to { transform: rotate(360deg); } }
.why2-orb-spec { position: absolute; top: 9%; left: 17%; width: 38%; height: 22%; border-radius: 50%; pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(255,255,255,.95), rgba(255,255,255,0) 70%); transform: rotate(-28deg); filter: blur(2px); }
.why2-halo { position: absolute; z-index: 0; top: 50%; left: 50%; width: min(92vw, 430px); aspect-ratio: 1; border-radius: 999px; transform: translate(-50%, calc(-50% - 35px));
  border: 1px solid rgba(245,165,36,.28); box-shadow: 0 0 0 26px rgba(247,236,220,.25), 0 0 90px 20px rgba(245,165,36,.25); pointer-events: none; }

.why2-logo { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; }
.why2-mark-wrap { position: relative; display: inline-flex; }
.why2-mark { width: 6rem; height: 6rem; filter: drop-shadow(0 14px 22px rgba(220,142,18,.35)); }
.why2-spark { position: absolute; top: -14px; right: -22px; width: 26px; height: 26px; fill: #F5A524; filter: drop-shadow(0 0 6px rgba(245,165,36,.7)); animation: why2-twinkle 2.4s ease-in-out infinite; }
@keyframes why2-twinkle { 0%,100% { transform: scale(1) rotate(0); opacity: 1; } 50% { transform: scale(.7) rotate(25deg); opacity: .6; } }
.why2-word { margin-top: 1rem; font-size: 1.9rem; font-weight: 800; letter-spacing: .28em; color: #0C1020; padding-left: .28em; }
.why2-tag { margin-top: .35rem; font-size: .6rem; font-weight: 600; letter-spacing: .32em; color: rgba(12,16,32,.5); }

/* ── pedestal: navy platform + gold rim (matches the About page) ── */
.why2-pedestal { position: absolute; z-index: 1; left: 50%; bottom: 0; width: min(74vw, 330px); height: 96px; transform: translateX(-50%); pointer-events: none; }
.why2-pedestal > span { position: absolute; left: 50%; transform: translateX(-50%); border-radius: 50%; }
/* soft contact shadow on the page */
.why2-plat-shadow { bottom: -6px; width: 112%; height: 36px; background: radial-gradient(50% 50% at 50% 50%, rgba(12,16,32,.28), rgba(12,16,32,0)); filter: blur(4px); }
/* the cylinder's side: metallic navy with a light sheen */
.why2-plat-side { bottom: 4px; width: 100%; height: 64px;
  background: linear-gradient(90deg, #1D2441 0%, #373E54 18%, #3B4257 42%, #3B4257 60%, #212844 82%, #141A35 100%);
  box-shadow: inset 0 -6px 12px rgba(0,0,0,.35); }
/* the top face: deep navy with the gold rim */
.why2-plat-top { bottom: 26px; width: 94%; height: 46px;
  background: radial-gradient(60% 70% at 50% 35%, #232A46 0%, #11162E 55%, #0B0F1E 100%);
  border: 4px solid #F5A524;
  box-shadow: 0 0 0 1px rgba(220,142,18,.7), inset 0 2px 6px rgba(255,255,255,.12), inset 0 -8px 14px rgba(0,0,0,.45), 0 0 18px rgba(245,165,36,.45); }
/* warm light from the orb landing on the platform */
.why2-plat-glow { bottom: 34px; width: 46%; height: 22px; background: radial-gradient(50% 50% at 50% 50%, rgba(245,165,36,.55), rgba(245,165,36,0)); filter: blur(3px); animation: why2-pulse 3s ease-in-out infinite; }
@keyframes why2-pulse { 0%,100% { opacity: .55; transform: translateX(-50%) scale(1); } 50% { opacity: 1; transform: translateX(-50%) scale(1.12); } }

/* ── dark theme ───────────────────────────────────────── */
.dark .why2 { background: radial-gradient(60% 55% at 50% 58%, rgba(245,165,36,.16) 0%, rgba(245,165,36,0) 70%), var(--adz-page); }
.dark .why2-bg { opacity: .5; }
.dark .why2-h2, .dark .why2-title { color: var(--adz-ink); }
.dark .why2-sub, .dark .why2-desc { color: var(--adz-ink-soft); }
.dark .why2-card {
  background:
    linear-gradient(100deg, color-mix(in srgb, var(--a1) 22%, transparent) 0%, color-mix(in srgb, var(--a1) 6%, transparent) 40%, rgba(255,255,255,.03) 72%, rgba(255,255,255,.05) 100%),
    rgba(18,24,49,.72);
  border-color: rgba(255,255,255,.1);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 18px 40px -18px rgba(0,0,0,.8); }
.dark .why2-card::after { background: linear-gradient(180deg, rgba(255,255,255,.1), rgba(255,255,255,0)); }
.dark .why2-card.is-active {
  background:
    linear-gradient(100deg, color-mix(in srgb, var(--a1) 32%, transparent) 0%, color-mix(in srgb, var(--a1) 10%, transparent) 42%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.07) 100%),
    rgba(26,33,63,.8);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.16), 0 0 0 1.5px color-mix(in srgb, var(--a2) 55%, transparent), 0 24px 48px -18px color-mix(in srgb, var(--a2) 45%, transparent); }
.dark .why2-icon { border-color: rgba(255,255,255,.22); }
.dark .why2-orb {
  background: radial-gradient(circle at 34% 26%, rgba(255,255,255,.22) 0%, rgba(59,66,87,.45) 30%, rgba(20,27,55,.75) 62%, rgba(245,165,36,.22) 100%);
  box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.18), inset 18px 22px 50px rgba(255,255,255,.08), inset -26px -34px 70px rgba(245,165,36,.2),
    0 0 0 10px rgba(255,255,255,.04), 0 0 70px 10px rgba(245,165,36,.2), 0 40px 80px -30px rgba(0,0,0,.8); }
.dark .why2-orb-spec { opacity: .45; }
.dark .why2-word { color: var(--adz-ink); }
.dark .why2-tag { color: var(--adz-ink-soft); }
.dark .why2-halo { border-color: rgba(245,165,36,.22); box-shadow: 0 0 0 26px rgba(245,165,36,.04), 0 0 90px 20px rgba(245,165,36,.12); }
.dark .why2-plat-shadow { background: radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.6), rgba(0,0,0,0)); }
.dark .why2-plat-side { background: linear-gradient(90deg, #141A35 0%, #2A314B 18%, #3B4257 42%, #343B52 60%, #171E3D 82%, #0F1428 100%); }

/* desktop: a more compact cards + globe area (about 80% of the original size); the heading stays as in other sections */
@media (min-width: 1024px) {
  .why2-stage { margin-top: 2.5rem; grid-template-columns: minmax(0,1fr) minmax(300px, 360px) minmax(0,1fr); }
  .why2-col { gap: 1.2rem; }
  .why2-card { max-width: min(340px, calc(100% - 3rem)); gap: .9rem; padding: .8rem 1.3rem .8rem .8rem; border-radius: 1.9rem; }
  .why2-icon { width: 3.25rem; height: 3.25rem; }
  .why2-icon svg { width: 1.3rem; height: 1.3rem; }
  .why2-num { font-size: .8rem; }
  .why2-title { font-size: .95rem; }
  .why2-desc { margin-top: .2rem; font-size: .82rem; }
  .why2-center { padding-bottom: 58px; }
  .why2-orb { width: 290px; }
  .why2-halo { width: 348px; transform: translate(-50%, calc(-50% - 29px)); }
  .why2-mark { width: 4.75rem; height: 4.75rem; }
  .why2-spark { width: 21px; height: 21px; }
  .why2-word { margin-top: .8rem; font-size: 1.55rem; }
  .why2-tag { font-size: .55rem; }
  .why2-pedestal { width: 270px; height: 80px; }
}

/* small laptops: shrink the centre so the cards keep room for their text */
@media (min-width: 1024px) and (max-width: 1279px) {
  .why2-stage { grid-template-columns: minmax(0,1fr) 250px minmax(0,1fr); }
  .why2-col-left { padding-right: 1.25rem; }
  .why2-col-right { padding-left: 1.25rem; }
  .why2-card { max-width: calc(100% - 1rem); }
  .why2-left.why2-pos-0, .why2-left.why2-pos-2 { margin-right: -.5rem; }
  .why2-right.why2-pos-0, .why2-right.why2-pos-2 { margin-left: -.5rem; }
  .why2-orb { width: 236px; }
  .why2-halo { width: 284px; transform: translate(-50%, calc(-50% - 26px)); }
  .why2-mark { width: 3.9rem; height: 3.9rem; }
  .why2-word { font-size: 1.3rem; }
  .why2-pedestal { width: 220px; height: 70px; }
  .why2-center { padding-bottom: 52px; }
}

@media (prefers-reduced-motion: reduce) {
  .why2-orb, .why2-orb-rim, .why2-spark, .why2-plat-glow, .why2-flow, .why2-card.is-active .why2-icon::after { animation: none; }
}
`;
