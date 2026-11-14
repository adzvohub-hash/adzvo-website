import { getInsights, type Insight } from "@/lib/api";
import { R2_BASE } from "@/lib/api";

export { type Insight } from "@/lib/api";

// Legacy alias used by some public pages
export type Post = Insight;

const r2 = (name: string) => `${R2_BASE}/images/${name}`;

/** Seed data shown before the API responds (SSR / first paint). */
export const postsSeed: Insight[] = [
  {
    id: "ai-saves-time", tag: "AI & Automation",
    title: "Where AI Agents Actually Save Time in a Marketing Team",
    excerpt: "A practical look at the repetitive tasks worth automating first, and the ones that still need people.",
    body: "Most teams start with content generation, but the biggest gains often come from reporting, lead routing and briefing. We break down where automation pays back fastest and how to keep quality guardrails in place.",
    images: [r2("svc-6.jpg"), r2("svc-7.jpg")],
    sort_order: 0, created_at: "", updated_at: "",
  },
  {
    id: "brand-scales", tag: "Branding",
    title: "Building a Brand System That Scales Across Markets",
    excerpt: "How typography, colour and voice rules help a brand stay recognisable from Mumbai to Dubai.",
    body: "A strong identity is more than a logo. We share how to document a flexible system that local teams can use confidently without diluting the brand.",
    images: [r2("svc-3.jpg"), r2("svc-4.jpg")],
    sort_order: 1, created_at: "", updated_at: "",
  },
  {
    id: "brand-film", tag: "Film & Video",
    title: "Planning a Brand Film That People Watch to the End",
    excerpt: "Story structure, pacing and production choices that keep audiences engaged.",
    body: "From the first three seconds to the final frame, we explain the creative and production decisions that turn a brand film into something people share.",
    images: [r2("svc-3.jpg"), r2("svc-5.jpg")],
    sort_order: 2, created_at: "", updated_at: "",
  },
  {
    id: "perf-marketing-2026", tag: "Marketing",
    title: "Performance Marketing in 2026: Signals Over Spend",
    excerpt: "Why better first-party data now matters more than bigger budgets.",
    body: "With privacy changes reshaping targeting, the brands winning on Meta and Google are the ones feeding platforms cleaner conversion signals. Here is how to set that up.",
    images: [r2("svc-5.jpg"), r2("svc-8.jpg")],
    sort_order: 3, created_at: "", updated_at: "",
  },
  {
    id: "transcreation", tag: "Localization",
    title: "Transcreation vs Translation: Speaking to Every Culture",
    excerpt: "Why literal translation falls flat and how to adapt campaigns for Hindi, Tamil and Arabic audiences.",
    body: "Great localization keeps the intent, emotion and humour of a message. We walk through our transcreation process and common pitfalls.",
    images: [r2("svc-7.jpg"), r2("svc-2.jpg")],
    sort_order: 4, created_at: "", updated_at: "",
  },
  {
    id: "dashboard-leadership", tag: "Strategy",
    title: "Choosing the Dashboards Your Leadership Team Needs",
    excerpt: "Fewer metrics, clearer decisions: a framework for useful reporting.",
    body: "GA4 and Looker Studio can show everything, which is exactly the problem. We outline how to pick the handful of measures that drive real decisions.",
    images: [r2("svc-8.jpg"), r2("svc-1.jpg")],
    sort_order: 5, created_at: "", updated_at: "",
  },
];

/** Fetch live insights from D1. Falls back to seed on error. */
export async function fetchInsights(): Promise<Insight[]> {
  try {
    const data = await getInsights();
    return data.length > 0 ? data : postsSeed;
  } catch {
    return postsSeed;
  }
}

// Keep old export names for any components that still import `posts`
export const posts = postsSeed;
