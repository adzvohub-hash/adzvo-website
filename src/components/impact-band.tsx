/**
 * Home page "The ADZVO Impact" — a light band with big gold count-up numbers.
 * Stats come from the parent (admin-editable settings). Layout/visual CSS is
 * self-contained (IMPACT_CSS) so it doesn't depend on generated utilities.
 */
import { useEffect, useRef, useState } from "react";
import { Handshake, LayoutGrid, Rocket, Users, type LucideIcon } from "lucide-react";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";
import { ImpactCounter } from "@/components/impact-counter";

type Stat = { value: number; label: string };

const ICONS: LucideIcon[] = [Rocket, Handshake, Users, LayoutGrid];
const NOTES = ["Brands launched, grown and transformed", "Businesses that keep coming back", "Specialists and studios we build with", "Disciplines under one roof"];

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const Icon = ICONS[index] ?? Rocket;
  return (
    // "impact-stat-card" lets the counter replay its split-flap roll on hover
    <div className="imp-stat impact-stat-card" style={{ transitionDelay: `${index * 120}ms` }}>
      <span className="imp-icon"><Icon /></span>
      <div className="imp-num font-display">
        <div style={{ width: `${String(stat.value).length + 1.15}ch` }}><ImpactCounter value={stat.value} /></div>
      </div>
      <div className="imp-label" style={LOGO_FONT}>{stat.label}</div>
      <div className="imp-note">{NOTES[index]}</div>
    </div>
  );
}

export function ImpactBand({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLElement>(null);
  const [start, setStart] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) { setStart(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="impact" className={`imp ${start ? "is-in" : ""}`}>
      <span aria-hidden className="imp-grid" />
      <span aria-hidden className="imp-glow imp-glow-1" />
      <span aria-hidden className="imp-glow imp-glow-2" />
      <div className="page-shell imp-inner">
        <div className="imp-head">
          <SectionLabel>The ADZVO Impact</SectionLabel>
          <h2 className="font-display imp-title">Ideas in Motion, <Highlight>Impact in Numbers.</Highlight></h2>
          <p className="imp-sub">Creative thinking and technology, working together to move brands forward.</p>
        </div>
        <div className="imp-row">
          {stats.map((s, i) => <StatItem key={s.label} stat={s} index={i} />)}
        </div>
      </div>
      <style>{IMPACT_CSS}</style>
    </section>
  );
}

const IMPACT_CSS = `
.imp { position: relative; overflow: hidden; isolation: isolate; padding: 6rem 0 6.5rem; color: #0a0e1f;
  background: radial-gradient(70% 90% at 50% 100%, #fff6e0 0%, rgba(255,246,224,0) 70%), #f8f9fc; }
.imp-grid { position: absolute; inset: 0; z-index: -1; pointer-events: none; opacity: .6;
  background-image: linear-gradient(rgba(10,14,31,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,14,31,.05) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse at 50% 60%, #000 0%, transparent 72%); mask-image: radial-gradient(ellipse at 50% 60%, #000 0%, transparent 72%); }
.imp-glow { position: absolute; z-index: -1; border-radius: 999px; filter: blur(80px); pointer-events: none; }
.imp-glow-1 { width: 520px; height: 520px; left: 50%; bottom: -320px; transform: translateX(-50%); background: rgba(245,179,53,.22); }
.imp-glow-2 { width: 360px; height: 360px; right: -120px; top: -160px; background: rgba(245,179,53,.12); }

.imp-head { text-align: center; }
.imp-title { margin-top: 1.5rem; font-weight: 800; line-height: 1.15; color: #0a0e1f; font-size: clamp(1.6rem, 2.8vw, 2.5rem); }
.imp-sub { margin-top: 1rem; color: rgba(10,14,31,.62); font-size: clamp(1rem, 1.2vw, 1.1rem); }
@media (min-width: 1024px) { .imp-title, .imp-sub { white-space: nowrap; } }

.imp-row { margin-top: 4rem; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); row-gap: 3rem; }
@media (min-width: 1024px) { .imp-row { grid-template-columns: repeat(4, minmax(0,1fr)); } }

.imp-stat { position: relative; padding: 0 1.5rem; text-align: center;
  opacity: 0; transform: translateY(24px); transition: opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1); }
.imp.is-in .imp-stat { opacity: 1; transform: none; }
/* thin gold dividers between stats */
.imp-stat + .imp-stat::before { content: ""; position: absolute; left: 0; top: 12%; bottom: 12%; width: 1px;
  background: linear-gradient(180deg, transparent, rgba(229,160,32,.6), transparent); }
@media (max-width: 1023px) { .imp-stat:nth-child(3)::before { display: none; } }

.imp-icon { display: grid; margin: 0 auto; place-items: center; width: 44px; height: 44px; border-radius: 12px; color: #0a0e1f;
  background: #e5a020; box-shadow: 0 8px 18px -8px rgba(229,160,32,.8), inset 0 1px 0 rgba(255,255,255,.4); }
.imp-icon svg { width: 20px; height: 20px; stroke-width: 2.2; }

.imp-num { margin-top: 1.1rem; display: flex; justify-content: center;
  font-weight: 800; line-height: 1; letter-spacing: -.02em;
  font-size: clamp(3.25rem, 6.2vw, 5.5rem); color: #e5a020;
  text-shadow: 0 6px 22px rgba(229,160,32,.28); }
/* split-flap roll: flaps match the band background */
.imp .impact-stat-card { --impact-flap-surface: #f8f9fc; --impact-flap-seam: rgba(10,14,31,.12); }
.imp .impact-counter { width: 100%; }

.imp-label { margin-top: .9rem; font-size: .8rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: #0a0e1f; }
.imp-note { margin-top: .45rem; font-size: .9rem; line-height: 1.45; color: rgba(10,14,31,.58); }
/* dark theme */
.dark .imp { color: var(--adz-ink); background: radial-gradient(70% 90% at 50% 100%, rgba(229,160,32,.14) 0%, rgba(229,160,32,0) 70%), var(--adz-section); }
.dark .imp-grid { background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px); }
.dark .imp-title, .dark .imp-label { color: var(--adz-ink); }
.dark .imp-sub, .dark .imp-note { color: var(--adz-ink-soft); }
.dark .imp-num { color: #f5b335; text-shadow: 0 6px 26px rgba(229,160,32,.35); }
.dark .imp .impact-stat-card { --impact-flap-surface: var(--adz-page); --impact-flap-seam: rgba(255,255,255,.12); }
@media (prefers-reduced-motion: reduce) { .imp-stat { opacity: 1; transform: none; transition: none; } }
`;
