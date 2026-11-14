import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { servicePages } from "@/lib/services";
import { AnimationHero } from "@/components/animation-hero";
import { MarketingGrowthHero } from "@/components/marketing-growth-hero";
import { DigitalTechnologyHero } from "@/components/digital-technology-hero";
import { BrandingDesignHero } from "@/components/branding-design-hero";
import { FilmVideoPhotographyHero } from "@/components/film-video-photography-hero";
import { StrategyAnalyticsHero } from "@/components/strategy-analytics-hero";
import { ContentLocalizationHero } from "@/components/content-localization-hero";
import { AiAutomationPage } from "@/components/ai-automation-page";
import { ServiceContentBody, serviceBodies } from "@/components/service-content-body";
import { Footer } from "@/components/site-footer";

export const Route = createFileRoute("/services/$service")({
  loader: ({ params }) => {
    const service = servicePages.find((item) => item.slug === params.service);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — ADZVO` : "Service unavailable — ADZVO";
    const description = loaderData?.slug === "marketing-growth"
      ? "Explore ADZVO Marketing & Growth: social media marketing, SEO and YouTube SEO, email and lifecycle marketing, Google and Meta ads, lead generation and conversion optimization."
      : loaderData?.slug === "animation-content"
      ? "Explore Animation & Content at ADZVO: expressive motion design, 3D artwork and visual storytelling."
      : loaderData?.slug === "film-video-photography"
        ? "Explore ADZVO and LCA Film Studio: ad films, corporate films, commercials, podcasts, photography and end-to-end production."
        : loaderData?.slug === "content-localization"
          ? "Explore ADZVO content and localization: copywriting, blogs, e-books, storybooks, translation, subtitles and multilingual content."
          : loaderData?.slug === "strategy-analytics"
            ? "Explore ADZVO strategy and analytics: digital and marketing strategy, GA4, Tag Manager, dashboards, reporting and content strategy."
            : loaderData ? `Explore ${loaderData.title} at ADZVO. Full service details are coming soon.` : "This ADZVO service page is unavailable.";
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: ServicePage,
});

const serviceHeroes = {
  "marketing-growth": MarketingGrowthHero,
  "digital-technology": DigitalTechnologyHero,
  "branding-design": BrandingDesignHero,
  "film-video-photography": FilmVideoPhotographyHero,
  "strategy-analytics": StrategyAnalyticsHero,
  "content-localization": ContentLocalizationHero,
} as const;

function ServicePage() {
  const service = Route.useLoaderData();
  if (service.slug === "ai-automation") return <main><AiAutomationPage /><Footer /></main>;
  if (service.slug === "animation-content") return <main className="bg-off"><AnimationHero /><ServiceContentBody slug={service.slug} /><Footer /></main>;
  const Hero = serviceHeroes[service.slug];
  return <main className="bg-off">
    <Hero />
    {serviceBodies[service.slug] ? <ServiceContentBody slug={service.slug} /> : <section className="page-shell py-16 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-electric">Coming soon</p>
      <h2 className="mt-4 font-display text-3xl text-navy">More details are on the way.</h2>
      <p className="mt-4 max-w-xl text-muted-foreground">Our {service.title.toLowerCase()} page is taking shape. In the meantime, let’s talk about your project.</p>
      <Button asChild className="mt-8"><Link to="/" hash="contact">Start a conversation <ArrowRight /></Link></Button>
    </section>}
    <Footer />
  </main>;
}
