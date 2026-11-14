import a1 from "@/assets/svc-1.jpg";
import a2 from "@/assets/svc-2.jpg";
import a3 from "@/assets/svc-3.jpg";
import a4 from "@/assets/svc-4.jpg";
import a5 from "@/assets/svc-5.jpg";
import a6 from "@/assets/svc-6.jpg";
import a7 from "@/assets/svc-7.jpg";
import a8 from "@/assets/svc-8.jpg";
import b1 from "@/assets/ai-workflows.jpg";
import b2 from "@/assets/ai-content.jpg";
import b3 from "@/assets/film-cinema-still.jpg";
import b5 from "@/assets/film-behind-scenes.jpg";
import b6 from "@/assets/impact.jpg";
import b7 from "@/assets/services.jpg";
import b8 from "@/assets/team.jpg";

export type Post = { tag: string; title: string; excerpt: string; body: string; images: string[] };
export const posts: Post[] = [
  { tag: "AI & Automation", title: "Where AI Agents Actually Save Time in a Marketing Team", excerpt: "A practical look at the repetitive tasks worth automating first, and the ones that still need people.", body: "Most teams start with content generation, but the biggest gains often come from reporting, lead routing and briefing. We break down where automation pays back fastest and how to keep quality guardrails in place.", images: [b1, a6, b2] },
  { tag: "Branding", title: "Building a Brand System That Scales Across Markets", excerpt: "How typography, colour and voice rules help a brand stay recognisable from Mumbai to Dubai.", body: "A strong identity is more than a logo. We share how to document a flexible system that local teams can use confidently without diluting the brand.", images: [a3, b7, a4] },
  { tag: "Film & Video", title: "Planning a Brand Film That People Watch to the End", excerpt: "Story structure, pacing and production choices that keep audiences engaged.", body: "From the first three seconds to the final frame, we explain the creative and production decisions that turn a brand film into something people share.", images: [b3, b5, a5] },
  { tag: "Marketing", title: "Performance Marketing in 2026: Signals Over Spend", excerpt: "Why better first-party data now matters more than bigger budgets.", body: "With privacy changes reshaping targeting, the brands winning on Meta and Google are the ones feeding platforms cleaner conversion signals. Here is how to set that up.", images: [a2, b6, a8] },
  { tag: "Localization", title: "Transcreation vs Translation: Speaking to Every Culture", excerpt: "Why literal translation falls flat and how to adapt campaigns for Hindi, Tamil and Arabic audiences.", body: "Great localization keeps the intent, emotion and humour of a message. We walk through our transcreation process and common pitfalls.", images: [a7, b2, b8] },
  { tag: "Strategy", title: "Choosing the Dashboards Your Leadership Team Needs", excerpt: "Fewer metrics, clearer decisions: a framework for useful reporting.", body: "GA4 and Looker Studio can show everything, which is exactly the problem. We outline how to pick the handful of measures that drive real decisions.", images: [a8, b6, a1] },
];