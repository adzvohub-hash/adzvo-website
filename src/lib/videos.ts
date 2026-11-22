import { R2_BASE as R2 } from "@/lib/api";

/** Hero section background video on the homepage. */
export const HERO_VIDEO_URL = `${R2}/videos/adzvo-hero-services.mp4`;

/** Showreel (portrait). */
export const SHOWREEL_URL = `${R2}/videos/adzvo-showreel.mp4`;

/** Showreel (landscape). */
export const SHOWREEL_LANDSCAPE_URL = `${R2}/videos/adzvo-showreel-landscape.mp4`;

/**
 * Per-service CTA loop videos.
 * Keys must match the `slug` prop passed to <CtaVideo>.
 */
export const CTA_VIDEOS: Record<string, string> = {
  "digital-technology":     `${R2}/videos/cta-digital-technology.mp4`,
  "marketing-growth":       `${R2}/videos/cta-marketing-growth.mp4`,
  "branding-design":        `${R2}/videos/cta-branding-design.mp4`,
  "film-video-photography": `${R2}/videos/cta-film-video-photography.mp4`,
  "animation-content":      `${R2}/videos/cta-animation-content.mp4`,
  "ai-automation":          `${R2}/videos/cta-ai-automation.mp4`,
  "content-localization":   `${R2}/videos/cta-content-localization.mp4`,
  "strategy-analytics":     `${R2}/videos/cta-strategy-analytics.mp4`,
};
