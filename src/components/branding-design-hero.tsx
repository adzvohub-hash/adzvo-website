import { Link } from "@tanstack/react-router";
import { HeroAurora } from "@/components/hero-aurora";
import { GlassButton } from "@/components/glass-button";
import { ArrowUpRight } from "lucide-react";
import frost from "@/assets/animation-frosted.jpg";

const palette = [
  { name: "Gold", hex: "#F5A524" },
  { name: "Navy", hex: "#0B0F1E" },
  { name: "Slate", hex: "#3B4257" },
  { name: "Off-white", hex: "#F7F8FC" },
];
import { BrandMark, Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";

export function BrandingDesignHero() {
  return (
    <section className="branding-hero" aria-labelledby="branding-title">
      <img className="branding-backdrop" src={frost} alt="" width={1920} height={1088} />
      <HeroAurora />
      <div className="branding-ambient" aria-hidden="true" />
      <div className="page-shell relative z-10">
        <div className="branding-intro">
          <SectionLabel>ADZVO Services</SectionLabel>
          <h1 id="branding-title" className="mt-5 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl">
            Branding <Highlight>& Design</Highlight>
          </h1>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-navy/70 sm:text-sm" style={LOGO_FONT}>
            Build a brand people recognize and remember
          </p>
          <GlassButton as={Link} to="/" hash="contact" className="mt-5">Build a Brand <ArrowUpRight /></GlassButton>
        </div>

        <div className="branding-showcase" aria-label="ADZVO brand identity specimen board">
          <article className="branding-card branding-type-card">
            <div className="branding-card-heading">
              <span>Typography</span><span>01 / Type</span>
            </div>
            <div className="branding-type-specimen">
              <span className="font-display">Aa</span>
              <i className="branding-type-baseline" aria-hidden="true" />
            </div>
            <div className="branding-type-meta">
              <div><strong>Playfair Display</strong><span>Editorial serif</span></div>
              <span>0123456789</span>
            </div>
          </article>

          <article className="branding-card branding-palette-card">
            <div className="branding-card-heading">
              <span>Core palette</span><span>04 tokens</span>
            </div>
            <div className="branding-palette-grid">
              {palette.map((color) => (
                <div className="branding-swatch" key={color.name}>
                  <i style={{ background: color.hex }} />
                  <span>{color.name}</span>
                  <code>{color.hex}</code>
                </div>
              ))}
            </div>
            <p className="branding-palette-note">Bold / Clear / Confident</p>
          </article>

          <article className="branding-card branding-mark-card">
            <div className="branding-card-heading">
              <span>Primary lockup</span><span>03 / Mark</span>
            </div>
            <div className="branding-mark-lockup">
              <BrandMark className="size-20" />
              <strong>ADZVO</strong>
              <span>Brand system</span>
            </div>
            <div className="branding-mark-meta"><span>Primary mark</span><span>Clear space 1×</span></div>
          </article>
        </div>
      </div>
    </section>
  );
}
