import { Link } from "@tanstack/react-router";
import { HeroAurora } from "@/components/hero-aurora";
import { GlassButton } from "@/components/glass-button";
import { ArrowUpRight, BadgeDollarSign, Gauge, TrendingUp } from "lucide-react";
import frost from "@/assets/animation-frosted.jpg";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";
import { HeroWaterfall } from "@/components/hero-waterfall";

export function MarketingGrowthHero() {
  return (
    <section className="marketing-hero hero-glass-pearl" aria-labelledby="marketing-title">
      <img className="marketing-backdrop" src={frost} alt="" width={1920} height={1088} />
      <HeroAurora />
      <HeroWaterfall />
      <div className="marketing-ambient" aria-hidden="true" />
      <div className="page-shell relative z-10">
        <div className="marketing-intro">
          <SectionLabel>ADZVO Services</SectionLabel>
          <h1 id="marketing-title" className="mt-5 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl">
            Marketing <Highlight>& Growth</Highlight>
          </h1>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-navy/70 sm:text-sm" style={LOGO_FONT}>
            Turn attention into measurable growth
          </p>
          <GlassButton as={Link} to="/" hash="contact" className="mt-5">Grow With Us <ArrowUpRight /></GlassButton>
        </div>

        <div className="marketing-showcase" aria-label="Illustrative marketing performance dashboard">
          <div className="marketing-dashboard">
            <div className="marketing-dashboard-heading">
              <div className="flex items-center gap-3">
                <span className="marketing-dashboard-icon"><TrendingUp className="size-5" /></span>
                <div>
                  <p className="text-sm font-semibold text-navy">Growth momentum</p>
                  <p className="mt-0.5 text-xs text-navy/60">Campaign performance</p>
                </div>
              </div>
              <span className="marketing-sample-label">Illustrative view</span>
            </div>

            <div className="marketing-pipeline">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-navy/60">Pipeline scale</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-navy sm:text-4xl">+180%</p>
              </div>
              <span className="marketing-period">Growth trajectory</span>
            </div>

            <svg className="marketing-chart" viewBox="0 0 640 180" role="img" aria-label="A rising growth curve">
              <defs>
                <linearGradient id="marketing-chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--electric)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="var(--mint)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <g className="marketing-chart-grid">
                <path d="M8 40H632" />
                <path d="M8 90H632" />
                <path d="M8 140H632" />
              </g>
              <path
                className="marketing-chart-area"
                d="M8 153 C55 148 78 133 116 137 C158 141 179 117 220 120 C265 124 287 102 326 105 C365 108 391 77 430 84 C475 92 501 55 538 62 C574 68 593 36 632 24 L632 176 L8 176 Z"
              />
              <path
                className="marketing-chart-line"
                d="M8 153 C55 148 78 133 116 137 C158 141 179 117 220 120 C265 124 287 102 326 105 C365 108 391 77 430 84 C475 92 501 55 538 62 C574 68 593 36 632 24"
              />
              <circle className="marketing-chart-point" cx="632" cy="24" r="6" />
            </svg>

            <div className="marketing-channels" aria-label="Connected growth channels">
              <span><i className="marketing-channel-dot marketing-dot-electric" />Paid media</span>
              <span><i className="marketing-channel-dot marketing-dot-mint" />SEO & content</span>
              <span><i className="marketing-channel-dot marketing-dot-gold" />Lifecycle</span>
            </div>
          </div>

          <div className="marketing-float marketing-float-roas">
            <span className="marketing-float-icon"><BadgeDollarSign className="size-4" /></span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/60">ROAS</p>
              <p className="mt-0.5 text-2xl font-bold text-navy">4.2×</p>
            </div>
          </div>

          <div className="marketing-float marketing-float-cac">
            <span className="marketing-float-icon marketing-float-icon-mint"><Gauge className="size-4" /></span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/60">CAC</p>
              <p className="mt-0.5 text-2xl font-bold text-navy">−35%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
