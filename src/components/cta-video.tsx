import { useEffect, useRef, type ReactNode } from "react";
import { CTA_VIDEOS } from "@/lib/videos";

/** 16:9 looping service clip; poster image as fallback. (Kept for any standalone use.) */
export function CtaVideo({ slug, poster, label }: { slug: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pause();
  }, []);
  return <video ref={ref} src={CTA_VIDEOS[slug]} poster={poster} aria-label={label} autoPlay loop muted playsInline preload="metadata"
    className="aspect-video w-full rounded-[2rem] border border-primary-foreground/10 object-cover shadow-2xl" />;
}

/**
 * Closing "Start a Project" band for service pages.
 * The video runs edge-to-edge on the right and melts into solid navy on the
 * left, so the copy sits on dark and the footage is in full view on the right.
 * Layout is plain CSS (below) so it doesn't depend on generated utilities.
 */
export function CtaBand({ slug, poster, label, children }: { slug: string; poster: string; label: string; children: ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pause();
  }, []);
  return (
    <section className="cta-band text-primary-foreground">
      <video ref={ref} className="cta-band-video" src={CTA_VIDEOS[slug]} poster={poster} aria-label={label}
        autoPlay loop muted playsInline preload="metadata" />
      <div aria-hidden className="cta-band-fade" />
      <div className="page-shell cta-band-inner">
        <div className="cta-band-copy">{children}</div>
      </div>
      <style>{CTA_BAND_CSS}</style>
    </section>
  );
}

const CTA_BAND_CSS = `
.cta-band { position: relative; overflow: hidden; background: #0a0e1f; isolation: isolate; }
.cta-band-video { position: absolute; z-index: 0; top: 0; right: 0; height: 100%; width: 100%; object-fit: cover; object-position: center; }
.cta-band-fade { position: absolute; inset: 0; z-index: 1; pointer-events: none;
  /* mobile: footage behind, darkened enough for the copy */
  background:
    linear-gradient(180deg, rgba(10,14,31,0.55) 0%, rgba(10,14,31,0.78) 55%, #0a0e1f 100%); }
.cta-band-inner { position: relative; z-index: 2; display: flex; align-items: center; min-height: 460px; padding-block: 4rem; }
.cta-band-copy { max-width: 34rem; }

@media (min-width: 768px) {
  /* desktop: video fills the right ~70%, navy holds the left, long soft blend between */
  .cta-band-video { width: 72%; }
  .cta-band-fade {
    background:
      linear-gradient(90deg, #0a0e1f 0%, #0a0e1f 30%, rgba(10,14,31,0.92) 38%, rgba(10,14,31,0.7) 46%, rgba(10,14,31,0.35) 56%, rgba(10,14,31,0.1) 66%, rgba(10,14,31,0) 74%),
      linear-gradient(180deg, rgba(10,14,31,0.35) 0%, rgba(10,14,31,0) 18%, rgba(10,14,31,0) 82%, rgba(10,14,31,0.4) 100%);
  }
  .cta-band-inner { min-height: clamp(420px, 34vw, 560px); padding-block: 4.5rem; }
  .cta-band-copy { max-width: 30rem; }
}
`;
