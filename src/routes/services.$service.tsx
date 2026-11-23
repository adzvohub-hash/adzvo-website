import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SERVICE_SEO, seoHead } from "@/lib/seo";
import { GlassButton } from "@/components/glass-button";
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
import { SectionLabel } from "@/components/brand-logo";

export const Route = createFileRoute("/services/$service")({
  loader: ({ params }) => {
    const service = servicePages.find((item) => item.slug === params.service);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    const seo = loaderData ? SERVICE_SEO[loaderData.slug] : undefined;
    return seoHead(seo ?? { title: "Service not found | ADZVO", description: "This ADZVO service page is unavailable." }, `/services/${loaderData?.slug ?? ""}`);
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
      <p><SectionLabel>Coming soon</SectionLabel></p>
      <h2 className="mt-5 font-display text-3xl font-extrabold text-navy">More details are on the way.</h2>
      <p className="mt-4 max-w-xl text-muted-foreground">Our {service.title.toLowerCase()} page is taking shape. In the meantime, let’s talk about your project.</p>
      <GlassButton as={Link} to="/" hash="contact" className="mt-8">Start a Conversation <ArrowRight /></GlassButton>
    </section>}
    <Footer />
  </main>;
}
