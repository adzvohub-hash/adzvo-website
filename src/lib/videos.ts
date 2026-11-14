// Vite resolves these imports at build time and emits the MP4 files as
// hashed static assets. The imported value is the public URL string.
import heroVideoSrc from "@/assets/videos/adzvo-hero-services.mp4";
import showreelSrc from "@/assets/videos/adzvo-showreel.mp4";
import showreelLandscapeSrc from "@/assets/videos/adzvo-showreel-landscape.mp4";
import digitalSrc from "@/assets/videos/cta-digital-technology.mp4";
import marketingSrc from "@/assets/videos/cta-marketing-growth.mp4";
import brandingSrc from "@/assets/videos/cta-branding-design.mp4";
import filmSrc from "@/assets/videos/cta-film-video-photography.mp4";
import animationSrc from "@/assets/videos/cta-animation-content.mp4";
import aiSrc from "@/assets/videos/cta-ai-automation.mp4";
import contentSrc from "@/assets/videos/cta-content-localization.mp4";
import strategySrc from "@/assets/videos/cta-strategy-analytics.mp4";

/** Hero section background video on the homepage and admin preview. */
export const HERO_VIDEO_URL = heroVideoSrc;

/** Showreel (portrait). */
export const SHOWREEL_URL = showreelSrc;

/** Showreel (landscape). */
export const SHOWREEL_LANDSCAPE_URL = showreelLandscapeSrc;

/**
 * Per-service CTA loop videos.
 * Keys must match the `slug` prop passed to <CtaVideo>.
 */
export const CTA_VIDEOS: Record<string, string> = {
  "digital-technology":    digitalSrc,
  "marketing-growth":      marketingSrc,
  "branding-design":       brandingSrc,
  "film-video-photography": filmSrc,
  "animation-content":     animationSrc,
  "ai-automation":         aiSrc,
  "content-localization":  contentSrc,
  "strategy-analytics":    strategySrc,
};
