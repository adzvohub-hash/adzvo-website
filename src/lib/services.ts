import digital from "@/assets/svc-1.jpg";
import marketing from "@/assets/svc-2.jpg";
import branding from "@/assets/svc-3.jpg";
import film from "@/assets/svc-4.jpg";
import animation from "@/assets/svc-5.jpg";
import ai from "@/assets/svc-6.jpg";
import content from "@/assets/svc-7.jpg";
import strategy from "@/assets/svc-8.jpg";

export const servicePages = [
  { slug: "digital-technology", title: "Digital & Technology", image: digital },
  { slug: "marketing-growth", title: "Marketing & Growth", image: marketing },
  { slug: "branding-design", title: "Branding & Design", image: branding },
  { slug: "film-video-photography", title: "Film, Video & Photography", image: film },
  { slug: "animation-content", title: "Animation & Content", image: animation },
  { slug: "ai-automation", title: "AI & Automation", image: ai },
  { slug: "content-localization", title: "Content & Localization", image: content },
  { slug: "strategy-analytics", title: "Strategy & Analytics", image: strategy },
] as const;