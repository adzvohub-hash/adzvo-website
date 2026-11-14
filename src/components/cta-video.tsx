import { useEffect, useRef } from "react";
import { CTA_VIDEOS } from "@/lib/videos";

/** 16:9 looping service clip for the closing call-to-action band; poster image as fallback. */
export function CtaVideo({ slug, poster, label }: { slug: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pause();
  }, []);
  return <video ref={ref} src={CTA_VIDEOS[slug]} poster={poster} aria-label={label} autoPlay loop muted playsInline preload="metadata"
    className="aspect-video w-full rounded-[2rem] border border-primary-foreground/10 object-cover shadow-2xl" />;
}
