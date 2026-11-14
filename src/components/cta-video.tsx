import { useEffect, useRef } from "react";
import digital from "@/assets/videos/cta-digital-technology.mp4.asset.json";
import marketing from "@/assets/videos/cta-marketing-growth.mp4.asset.json";
import branding from "@/assets/videos/cta-branding-design.mp4.asset.json";
import film from "@/assets/videos/cta-film-video-photography.mp4.asset.json";
import animation from "@/assets/videos/cta-animation-content.mp4.asset.json";
import ai from "@/assets/videos/cta-ai-automation.mp4.asset.json";
import content from "@/assets/videos/cta-content-localization.mp4.asset.json";
import strategy from "@/assets/videos/cta-strategy-analytics.mp4.asset.json";

const videos: Record<string, string> = {
  "digital-technology": digital.url, "marketing-growth": marketing.url, "branding-design": branding.url,
  "film-video-photography": film.url, "animation-content": animation.url, "ai-automation": ai.url,
  "content-localization": content.url, "strategy-analytics": strategy.url,
};

/** 16:9 looping service clip for the closing call-to-action band; poster image as fallback. */
export function CtaVideo({ slug, poster, label }: { slug: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pause();
  }, []);
  return <video ref={ref} src={videos[slug]} poster={poster} aria-label={label} autoPlay loop muted playsInline preload="metadata"
    className="aspect-video w-full rounded-[2rem] border border-primary-foreground/10 object-cover shadow-2xl" />;
}
