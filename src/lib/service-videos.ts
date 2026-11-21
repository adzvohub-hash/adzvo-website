/**
 * Service pages — the looping video in the closing "Start a Project" band.
 *
 * Each video can be replaced from the admin (Services tab). The new video is
 * uploaded to R2 and its link saved under "video-<service slug>". If no link
 * is saved (or the video fails to load), the original video below is used.
 */
import { servicePages } from "@/lib/services";
import { CTA_VIDEOS } from "@/lib/videos";
import type { MediaSlot } from "@/lib/about-images";

export const serviceVideoKey = (slug: string) => `video-${slug}`;

export const SERVICE_VIDEO_SLOTS: MediaSlot[] = servicePages.map((svc) => ({
  key: serviceVideoKey(svc.slug),
  label: svc.title,
  hint: "Closing “Start a Project” band · 16:9 landscape · MP4 or WebM, short loop",
  fallback: CTA_VIDEOS[svc.slug] ?? "",
}));

/** The original videos: these are the fallbacks, so they are never deleted from R2. */
export const BUILT_IN_SERVICE_VIDEOS = Object.values(CTA_VIDEOS);
