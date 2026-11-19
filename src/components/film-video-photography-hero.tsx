import { Link } from "@tanstack/react-router";
import { GlassButton } from "@/components/glass-button";
import { ArrowUpRight } from "lucide-react";
import frost from "@/assets/animation-frosted.jpg";
import cinemaStill from "@/assets/film-cinema-still.jpg";
import behindScenes from "@/assets/film-behind-scenes.jpg";
import automotiveMotion from "@/assets/film-automotive-motion.jpg";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";

export function FilmVideoPhotographyHero() {
  return (
    <section className="film-hero" aria-labelledby="film-title">
      <img className="film-backdrop" src={frost} alt="" width={1920} height={1088} />
      <div className="film-ambient" aria-hidden="true" />
      <div className="page-shell relative z-10">
        <div className="film-intro">
          <SectionLabel>ADZVO Services</SectionLabel>
          <h1 id="film-title" className="mt-5 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl">
            Film, Video <Highlight>& Photography</Highlight>
          </h1>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-navy/70 sm:text-sm" style={LOGO_FONT}>
            Bring your story into focus
          </p>
          <GlassButton as={Link} to="/" hash="contact" className="mt-5">Start a Production <ArrowUpRight /></GlassButton>
        </div>

        <div className="film-showcase" aria-label="Cinematic production frame and film stills">
          <figure className="film-cell film-cell-left">
            <div className="film-cell-frames">
              <img src={behindScenes} alt="Camera crew preparing a cinema camera on set" width={672} height={992} />
              <img className="film-frame-alt" src={behindScenes} alt="" aria-hidden="true" width={672} height={992} />
            </div>
            <figcaption>Behind the scenes / 01</figcaption>
          </figure>

          <div className="film-cinema-frame">
            <div className="film-screen">
              <img src={cinemaStill} alt="Director and film crew composing a cinematic scene" width={1280} height={720} />
              <div className="film-screen-shade" aria-hidden="true" />
              <span className="film-rec"><i /> REC</span>
              <span className="film-resolution">4K / 24 FPS</span>
              <span className="film-crop film-crop-tl" aria-hidden="true" />
              <span className="film-crop film-crop-tr" aria-hidden="true" />
              <span className="film-crop film-crop-bl" aria-hidden="true" />
              <span className="film-crop film-crop-br" aria-hidden="true" />
              <span className="film-focus-point" aria-hidden="true" />
              <div className="film-frame-caption"><span>Director's frame</span><span>Scene 01 · Take 04</span></div>
            </div>
          </div>

          <figure className="film-cell film-cell-right">
            <div className="film-cell-frames">
              <img src={automotiveMotion} alt="Sports coupe moving through warm cinematic studio light" width={672} height={992} />
              <img className="film-frame-alt" src={automotiveMotion} alt="" aria-hidden="true" width={672} height={992} />
            </div>
            <figcaption>Motion study / 02</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
