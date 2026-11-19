import { Link } from "@tanstack/react-router";
import { GlassButton } from "@/components/glass-button";
import { ArrowUpRight, Braces, Cloud, Code2, Gauge, LayoutDashboard, Layers3, MonitorSmartphone, Settings2 } from "lucide-react";
import frost from "@/assets/animation-frosted.jpg";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";
import { HeroWaterfall } from "@/components/hero-waterfall";

export function DigitalTechnologyHero() {
  return (
    <section className="digital-hero hero-glass-brand" aria-labelledby="digital-title">
      <img className="digital-backdrop" src={frost} alt="" width={1920} height={1088} />
      <HeroWaterfall />
      <div className="digital-ambient" aria-hidden="true" />
      <div className="page-shell relative z-10">
        <div className="digital-intro">
          <SectionLabel>ADZVO Services</SectionLabel>
          <h1 id="digital-title" className="mt-5 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl">
            Digital <Highlight>& Technology</Highlight>
          </h1>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-navy/70 sm:text-sm" style={LOGO_FONT}>
            Digital experiences built to perform
          </p>
          <GlassButton as={Link} to="/" hash="contact" className="mt-5">Talk to an Expert <ArrowUpRight /></GlassButton>
        </div>

        <div className="digital-showcase" aria-label="Digital product interface concept">
          <div className="digital-browser">
            <div className="digital-browser-bar">
              <div className="digital-browser-dots" aria-hidden="true">
                <i className="digital-dot-coral" /><i className="digital-dot-gold" /><i className="digital-dot-mint" />
              </div>
              <span className="digital-address">ADZVO / Digital workspace</span>
              <span className="digital-concept-label">Interface concept</span>
            </div>

            <div className="digital-browser-body">
              <aside className="digital-sidebar" aria-hidden="true">
                <span className="digital-sidebar-mark"><Layers3 className="size-4" /></span>
                <span className="digital-sidebar-item is-active"><LayoutDashboard className="size-4" /></span>
                <span className="digital-sidebar-item"><Code2 className="size-4" /></span>
                <span className="digital-sidebar-item"><Cloud className="size-4" /></span>
                <span className="digital-sidebar-item mt-auto"><Settings2 className="size-4" /></span>
              </aside>

              <div className="digital-workspace">
                <div className="digital-workspace-heading">
                  <div>
                    <p className="digital-ui-eyebrow">Product overview</p>
                    <p className="mt-1 text-base font-semibold text-navy">Connected digital experiences</p>
                  </div>
                </div>

                <div className="digital-ui-grid">
                  <div className="digital-ui-panel digital-ui-primary">
                    <div className="flex items-center justify-between gap-3">
                      <span className="digital-ui-panel-title"><Braces className="size-4" /> Experience layer</span>
                      <span className="digital-ui-chip">Modular UI</span>
                    </div>
                    <div className="digital-wireframe" aria-hidden="true">
                      <div className="digital-wireframe-copy">
                        <i className="digital-wireline digital-wireline-short" />
                        <i className="digital-wireline digital-wireline-title" />
                        <i className="digital-wireline" />
                      </div>
                      <div className="digital-wireframe-art"><span /><span /><span /></div>
                    </div>
                    <div className="digital-ui-actions" aria-hidden="true"><i /><i /><i /></div>
                  </div>

                  <div className="digital-ui-panel digital-responsive-panel">
                    <span className="digital-responsive-icon"><MonitorSmartphone className="size-5" /></span>
                    <p className="mt-2 text-xs font-semibold text-navy">Responsive by design</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-navy/55">Every screen.<br />One connected system.</p>
                    <div className="digital-device-lines" aria-hidden="true"><i /><i /><i /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="digital-float digital-float-code">
            <span className="digital-float-icon"><Code2 className="size-4" /></span>
            <div>
              <p className="text-sm font-bold text-navy">React</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/55">Cloud Native</p>
            </div>
          </div>

          <div className="digital-float digital-float-performance">
            <span className="digital-float-icon digital-float-icon-sky"><Gauge className="size-4" /></span>
            <div>
              <p className="text-xl font-bold leading-none text-navy">99.9%</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-navy/55">Performance score</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
