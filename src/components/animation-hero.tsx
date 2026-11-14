import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import frost from "@/assets/animation-frosted.jpg";
import ribbon from "@/assets/animation-ribbon.jpg";
import glass from "@/assets/animation-glass.jpg";
import play from "@/assets/animation-play.jpg";

const artwork = [
  { image: ribbon, label: "Sculpted stories", category: "3D & CGI", alt: "Coral ribbon wrapped around a sculptural chrome ring" },
  { image: glass, label: "Ideas in motion", category: "Motion design", alt: "Lime glass loops surrounding a mint sphere" },
  { image: play, label: "A little unexpected", category: "Visual storytelling", alt: "Blue sculptural star and yellow sphere above a lavender platform" },
];

export function AnimationHero() {
  return (
    <section className="animation-hero" aria-labelledby="animation-title">
      <img className="animation-backdrop" src={frost} alt="" width={1920} height={1088} />
      <div className="page-shell relative z-10">
        <div className="animation-intro">
          <h1 id="animation-title" className="font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl">Animation <span className="italic">& Content</span></h1>
          <p className="mt-4 text-lg font-semibold uppercase tracking-wide text-navy sm:text-2xl">Make every frame move with purpose</p>
          <Button asChild variant="outline" className="animation-project-link"><Link to="/" hash="contact">Create with us <ArrowUpRight className="size-4" /></Link></Button>
        </div>
        <div className="animation-gallery">
          {artwork.map((item, index) => (
            <figure className="animation-artwork" key={item.label}>
              <div className="animation-artwork-image">
                <img src={item.image} alt={item.alt} width={1024} height={1024} />
                <span className="animation-artwork-index" aria-hidden="true">0{index + 1}</span>
              </div>
              <figcaption className="animation-artwork-caption">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs text-navy/60">{item.category}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}