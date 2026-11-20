import { Link } from "@tanstack/react-router";
import { HeroAurora } from "@/components/hero-aurora";
import { GlassButton } from "@/components/glass-button";
import { ArrowUpRight, ChartNoAxesCombined, Route, ShieldCheck } from "lucide-react";
import frost from "@/assets/animation-frosted.jpg";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";

export function StrategyAnalyticsHero() {
  return (
    <section className="strategy-hero" aria-labelledby="strategy-title">
      <img className="strategy-backdrop" src={frost} alt="" width={1920} height={1088} />
      <HeroAurora />
      <div className="strategy-ambient" aria-hidden="true" />
      <div className="page-shell relative z-10">
        <div className="strategy-intro">
          <SectionLabel>ADZVO Services</SectionLabel>
          <h1 id="strategy-title" className="mt-5 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl">
            Strategy <Highlight>& Analytics</Highlight>
          </h1>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-navy/70 sm:text-sm" style={LOGO_FONT}>
            Clarity for every next move
          </p>
          <GlassButton as={Link} to="/" hash="contact" className="mt-5">Build Your Roadmap <ArrowUpRight /></GlassButton>
        </div>

        <div className="strategy-showcase" aria-label="Illustrative market positioning matrix and strategic insight radar">
          <div className="strategy-board">
            <div className="strategy-board-heading">
              <div className="flex items-center gap-3">
                <span className="strategy-board-icon"><ChartNoAxesCombined className="size-5" /></span>
                <div>
                  <p className="text-sm font-semibold text-navy">Strategic market lens</p>
                  <p className="mt-0.5 text-xs text-navy/60">From signals to structured direction</p>
                </div>
              </div>
              <span className="strategy-sample-label">Illustrative framework</span>
            </div>

            <div className="strategy-board-grid">
              <div className="strategy-matrix-panel">
                <div className="strategy-panel-heading">
                  <span>Positioning matrix</span>
                  <span>Growth / differentiation</span>
                </div>
                <div className="strategy-matrix-plot">
                  <div className="strategy-matrix-quadrants" aria-hidden="true">
                    <span>Explore</span>
                    <span className="is-accent">Scale</span>
                    <span>Monitor</span>
                    <span>Focus</span>
                  </div>
                  <svg className="strategy-vectors" viewBox="0 0 420 210" role="img" aria-label="Three market positioning vectors moving toward growth and differentiation">
                    <defs>
                      <marker id="strategy-vector-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path className="strategy-arrow-head" d="M 0 0 L 10 5 L 0 10 z" />
                      </marker>
                    </defs>
                    <path className="strategy-vector strategy-vector-primary" d="M188 174 C235 151 266 97 326 48" markerEnd="url(#strategy-vector-arrow)" />
                    <path className="strategy-vector strategy-vector-secondary" d="M188 174 C238 176 277 158 325 140" markerEnd="url(#strategy-vector-arrow)" />
                    <path className="strategy-vector strategy-vector-tertiary" d="M188 174 C147 143 129 100 105 58" markerEnd="url(#strategy-vector-arrow)" />
                    <circle className="strategy-vector-origin" cx="188" cy="174" r="5" />
                    <circle className="strategy-vector-point strategy-point-primary" cx="326" cy="48" r="5" />
                    <circle className="strategy-vector-point strategy-point-secondary" cx="325" cy="140" r="4" />
                    <circle className="strategy-vector-point strategy-point-tertiary" cx="105" cy="58" r="4" />
                  </svg>
                </div>
                <div className="strategy-axis-labels" aria-hidden="true">
                  <span>↑ Growth potential</span>
                  <span>Market differentiation →</span>
                </div>
              </div>

              <div className="strategy-radar-panel">
                <div className="strategy-panel-heading">
                  <span>Insight radar</span>
                  <span>5 lenses</span>
                </div>
                <svg className="strategy-radar" viewBox="0 0 240 205" role="img" aria-label="Five-lens strategy radar covering market, customer, capability, brand and timing">
                  <g className="strategy-radar-grid">
                    <polygon points="120,30 186.6,81.6 161.2,167.4 78.8,167.4 53.4,81.6" />
                    <polygon points="120,54 163.2,87.5 146.7,143.5 93.3,143.5 76.8,87.5" />
                    <polygon points="120,77 140.9,93 133.5,121 106.5,121 99.1,93" />
                    <path d="M120 100V30 M120 100L186.6 81.6 M120 100L161.2 167.4 M120 100L78.8 167.4 M120 100L53.4 81.6" />
                  </g>
                  <polygon className="strategy-radar-shape" points="120,44 169,86 148,147 87,151 70,87" />
                  <g className="strategy-radar-points">
                    <circle cx="120" cy="44" r="4" /><circle cx="169" cy="86" r="4" />
                    <circle cx="148" cy="147" r="4" /><circle cx="87" cy="151" r="4" /><circle cx="70" cy="87" r="4" />
                  </g>
                  <g className="strategy-radar-labels">
                    <text x="120" y="17" textAnchor="middle">Market</text>
                    <text x="204" y="82" textAnchor="start">Customer</text>
                    <text x="168" y="190" textAnchor="start">Capability</text>
                    <text x="72" y="190" textAnchor="end">Brand</text>
                    <text x="36" y="82" textAnchor="end">Timing</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div className="strategy-float strategy-float-advantage">
            <ShieldCheck className="size-4" />
            <span>Competitive Advantage</span>
          </div>
          <div className="strategy-float strategy-float-roadmap">
            <Route className="size-4" />
            <span>Data-Backed Roadmap</span>
          </div>
        </div>
      </div>
    </section>
  );
}
