/**
 * About page — one background photo per chapter.
 *
 * Each photo can be replaced from the admin (About tab). The chosen image is
 * uploaded to R2 and its link is stored with the other site images under the
 * key below. If no R2 link is saved (or it fails to load), the built-in image
 * from src/assets is used instead.
 */
import aboutBrief from "@/assets/about-hero.jpg";
import aboutExplore from "@/assets/insights-hero.jpg";
import aboutShape from "@/assets/film-behind-scenes.jpg";
import aboutAlign from "@/assets/contact.jpg";
import aboutDeliver from "@/assets/projects-hero.jpg";

export type MediaSlot = {
  /** Storage key (saved alongside the service images). */
  key: string;
  /** Chapter name shown in the admin. */
  label: string;
  /** What the chapter is about, as a hint for choosing the photo. */
  hint: string;
  /** Built-in fallback (bundled image, or the original R2 file). */
  fallback: string;
};

export const ABOUT_IMAGE_SLOTS: MediaSlot[] = [
  {
    key: "about-brief",
    label: "The Brief",
    hint: "Every project starts with a single idea.",
    fallback: aboutBrief,
  },
  {
    key: "about-explore",
    label: "Explore",
    hint: "What we do — testing every angle.",
    fallback: aboutExplore,
  },
  {
    key: "about-shape",
    label: "Shape",
    hint: "What guides us — mission, vision, promise.",
    fallback: aboutShape,
  },
  { key: "about-align", label: "Align", hint: "How we work with you.", fallback: aboutAlign },
  {
    key: "about-deliver",
    label: "Deliver",
    hint: "The result — work that lands.",
    fallback: aboutDeliver,
  },
];

export const ABOUT_IMAGE_KEYS = ABOUT_IMAGE_SLOTS.map((s) => s.key);

export function isAboutImageKey(key: string) {
  return ABOUT_IMAGE_KEYS.includes(key);
}
