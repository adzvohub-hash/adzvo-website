import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import frost from "@/assets/animation-frosted.jpg";

const palette = [
  { name: "Coral", hex: "#E76F51", className: "branding-swatch-coral" },
  { name: "Champagne", hex: "#D9A441", className: "branding-swatch-gold" },
  { name: "Violet", hex: "#8E6BC8", className: "branding-swatch-violet" },
  { name: "Navy", hex: "#17182C", className: "branding-swatch-navy" },
];

export function BrandingDesignHero() {
  return (
    <section className="branding-hero" aria-labelledby="branding-title">
      <img className="branding-backdrop" src={frost} alt="" width={1920} height={1088} />
      <div className="branding-ambient" aria-hidden="true" />
      <div className="page-shell relative z-10">
        <div className="branding-intro">
          <h1 id="branding-title" className="font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl">
            Branding <span className="italic">& Design</span>
          </h1>
          <p className="mt-4 text-lg font-semibold uppercase tracking-wide text-navy sm:text-2xl">
            Build a brand people recognize and remember
          </p>
          <Button asChild variant="outline" className="branding-project-link">
            <Link to="/" hash="contact">Build A Brand <ArrowUpRight className="size-4" /></Link>
          </Button>
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
                  <i className={color.className} />
                  <span>{color.name}</span>
                  <code>{color.hex}</code>
                </div>
              ))}
            </div>
            <p className="branding-palette-note">Warm / Expressive / Distinct</p>
          </article>

          <article className="branding-card branding-mark-card">
            <div className="branding-card-heading">
              <span>Primary lockup</span><span>03 / Mark</span>
            </div>
            <div className="branding-mark-lockup">
              <span className="branding-monogram font-display">A</span>
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
