/**
 * Orange call-to-action strip shown on top of the footer on every page.
 * Rendered by <Footer /> (site-footer.tsx); <Footer cta={false} /> hides it.
 * WhatsApp number: change WA_NUMBER below (country code + number, no + or spaces).
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { GlassButton } from "@/components/glass-button";
import { gtagEvent } from "@/routes/__root";

const WA_NUMBER = "917012376221"; // +91 70123 76221

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25d366" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6L3 21z" />
    </svg>
  );
}

export function HomeCta() {
  return (
    <section className="hcta" aria-labelledby="hcta-title">
      <span aria-hidden className="hcta-shine" />
      <span aria-hidden className="hcta-word">ADZVO</span>
      <div className="page-shell hcta-inner">
        <div className="hcta-copy">
          <p className="hcta-eyebrow">Have a project in mind?</p>
          <h2 id="hcta-title" className="hcta-title">
            Let’s build something <span className="hcta-title-2">people remember.</span>
          </h2>
        </div>
        <div className="hcta-actions">
          <GlassButton as={Link} to="/contact" variant="dark">Contact Us Today <ArrowRight /></GlassButton>
          <GlassButton as="a" href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" variant="secondary" onClick={() => gtagEvent("whatsapp_clicked", { location: "cta_strip" })}>
            <WhatsAppIcon /> WhatsApp Us
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
/* giant outlined wordmark, like the footer's, sitting low on the right */
.hcta-word { position: absolute; z-index: -1; right: -.04em; bottom: -.2em; pointer-events: none; user-select: none; white-space: nowrap;
  font-family: 'Space Grotesk', Inter, system-ui, sans-serif; font-weight: 700; letter-spacing: .1em; line-height: 1;
  font-size: clamp(5rem, 12vw, 10.5rem); color: transparent; -webkit-text-stroke: 1.5px rgba(10,14,31,.16);
  background: linear-gradient(180deg, rgba(255,255,255,.28), rgba(255,255,255,0) 80%); -webkit-background-clip: text; background-clip: text; }

.hcta-inner { display: flex; flex-direction: column; gap: 1.25rem; padding-block: 2.25rem 2.5rem; }
@media (min-width: 1024px) { .hcta-inner { flex-direction: row; align-items: center; justify-content: space-between; gap: 2.5rem; padding-block: 2.1rem 2.4rem; } }
/* soft fade on the bottom edge so the band melts into the footer */
.hcta::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 22px; z-index: -1; pointer-events: none;
  background: linear-gradient(180deg, rgba(5,7,15,0), rgba(5,7,15,.35)); }
.hcta-eyebrow { margin: 0; font-size: .7rem; font-weight: 700; letter-spacing: .24em; text-transform: uppercase; color: rgba(10,14,31,.72); }
.hcta-title { margin: .55rem 0 0; font-family: Inter, system-ui, sans-serif; font-weight: 800; letter-spacing: -.02em; line-height: 1.06;
  font-size: clamp(1.6rem, 3.4vw, 2.5rem); color: #0a0e1f; }
.hcta-title-2 { display: block; color: #fff; text-shadow: 0 2px 18px rgba(150,70,0,.35); }
.hcta-actions { display: flex; flex-wrap: wrap; gap: .85rem; flex-shrink: 0; }
.hcta-actions svg { width: 18px; height: 18px; }
@media (prefers-reduced-motion: reduce) { .hcta-shine { animation: none; } }
`;
