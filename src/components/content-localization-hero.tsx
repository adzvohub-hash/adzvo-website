import { Link } from "@tanstack/react-router";
import { GlassButton } from "@/components/glass-button";
import { ArrowUpRight, Globe2, Languages } from "lucide-react";
import frost from "@/assets/animation-frosted.jpg";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";

export function ContentLocalizationHero() {
  return (
    <section className="localization-hero" aria-labelledby="localization-title">
      <img className="localization-backdrop" src={frost} alt="" width={1920} height={1088} />
      <div className="localization-ambient" aria-hidden="true" />
      <div className="page-shell relative z-10">
        <div className="localization-intro">
          <SectionLabel>ADZVO Services</SectionLabel>
          <h1 id="localization-title" className="mt-5 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl">
            Content <Highlight>& Localization</Highlight>
          </h1>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-navy/70 sm:text-sm" style={LOGO_FONT}>
            One voice. Every culture.
          </p>
          <GlassButton as={Link} to="/" hash="contact" className="mt-5">Localize Your Story <ArrowUpRight /></GlassButton>
        </div>

        <div className="localization-showcase" aria-label="A campaign headline adapted across English, Hindi and Japanese">
          <div className="localization-stack">
            <article className="localization-card localization-hindi" lang="hi">
              <div className="localization-card-heading">
                <span>हिन्दी</span>
                <span>02 / सृजनात्मक रूपांतरण</span>
              </div>
              <p className="localization-headline">कहानियाँ, जो हर जगह दिल छू जाएँ।</p>
              <div className="localization-card-footer">
                <span>सांस्कृतिक रूप से सहज अभिव्यक्ति</span>
                <Languages className="size-4" />
              </div>
            </article>

            <article className="localization-card localization-english" lang="en">
              <div className="localization-card-heading">
                <span>English</span>
                <span>01 / Source voice</span>
              </div>
              <p className="localization-headline font-display">Stories that resonate, <span>everywhere.</span></p>
              <div className="localization-card-footer">
                <span>Clear · Warm · Human</span>
                <Languages className="size-4" />
              </div>
            </article>

            <article className="localization-card localization-japanese" lang="ja">
              <div className="localization-card-heading">
                <span>日本語</span>
                <span>03 / 文化的適応</span>
              </div>
              <p className="localization-headline">どこでも、心に響く物語。</p>
              <div className="localization-card-footer">
                <span>自然な表現、一貫した声</span>
                <Languages className="size-4" />
              </div>
            </article>
          </div>

          <div className="localization-global-badge">
            <span className="localization-globe"><Globe2 className="size-5" /></span>
            <div>
              <p>Global reach</p>
              <strong>Cross-Market Resonance</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
