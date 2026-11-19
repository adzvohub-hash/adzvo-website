/**
 * Home page call-to-action strip — a full-width band in the brand gold that
 * separates the last section from the footer.
 * WhatsApp number: change WA_NUMBER below (country code + number, no + or spaces).
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { BrandMark } from "@/components/brand-logo";
import { GlassButton } from "@/components/glass-button";

const WA_NUMBER = "917012376221"; // +91 70123 76221

export function HomeCta() {
  return (
    <section className="hcta" aria-labelledby="hcta-title">
      <span aria-hidden className="hcta-shine" />
      <span aria-hidden className="hcta-mark-bg"><BrandMark className="hcta-mark-bg-svg" /></span>
      <div className="page-shell hcta-inner">
        <div className="hcta-copy">
          <h2 id="hcta-title" className="font-display hcta-title">Ready to make your brand mean more?</h2>
          <p className="hcta-sub">Let's turn your next idea into work that connects and delivers.</p>
        </div>
        <div className="hcta-actions">
          <GlassButton as={Link} to="/contact" variant="dark">Start a Project <ArrowRight /></GlassButton>
          <GlassButton as="a" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" variant="secondary">
            <MessageCircle /> Chat on WhatsApp
          </GlassButton>
        </div>
      </div>
      <style>{HCTA_CSS}</style>
    </section>
  );
}

const HCTA_CSS = `
.hcta { position: relative; overflow: hidden; isolation: isolate; color: #0a0e1f;
  background: linear-gradient(100deg, #f5b335 0%, #e5a020 45%, #f08a1c 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(10,14,31,.12); }
/* slow light sweep across the band */
.hcta-shine { position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.28) 50%, transparent 65%);
  background-size: 250% 100%; animation: hcta-sweep 7s ease-in-out infinite; }
@keyframes hcta-sweep { 0% { background-position: 120% 0; } 60%,100% { background-position: -120% 0; } }
/* oversized faint logo mark on the right */
.hcta-mark-bg { position: absolute; z-index: -1; right: -40px; top: 50%; transform: translateY(-50%) rotate(-8deg); opacity: .13; pointer-events: none; }
.hcta-mark-bg-svg { width: 260px; height: 260px; }

.hcta-inner { display: flex; flex-direction: column; gap: 1.5rem; padding-block: 2.5rem; }
@media (min-width: 900px) { .hcta-inner { flex-direction: row; align-items: center; justify-content: space-between; gap: 3rem; padding-block: 2.75rem; } }
.hcta-title { font-weight: 800; line-height: 1.2; font-size: clamp(1.4rem, 2.3vw, 2rem); color: #0a0e1f; }
.hcta-sub { margin-top: .5rem; font-size: clamp(.95rem, 1.1vw, 1.05rem); color: rgba(10,14,31,.75); }
.hcta-actions { display: flex; flex-wrap: wrap; gap: .8rem; flex-shrink: 0; }
@media (prefers-reduced-motion: reduce) { .hcta-shine { animation: none; } }
`;
