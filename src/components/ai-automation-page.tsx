import { CtaVideo } from "@/components/cta-video";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { servicePages } from "@/lib/services";
import { Highlight, SectionLabel } from "@/components/brand-logo";
import { AiAutomationHero } from "@/components/ai-automation-hero";
import consulting from "@/assets/ai-consulting.jpg";
import content from "@/assets/ai-content.jpg";
import workflows from "@/assets/ai-workflows.jpg";
import automation from "@/assets/ai-automation.jpg";
import cta from "@/assets/ai-cta.jpg";

const offerings = [
  { title: "AI Consulting", text: "Identify the right opportunities and build a practical path to AI adoption.", tags: "Strategy • Use cases • AI roadmap", image: consulting },
  { title: "AI Content & Visuals", text: "Use AI to produce compelling, brand-aligned content and visuals at scale.", tags: "AI visuals • Content • Campaign assets", image: content },
  { title: "Creative Workflows", text: "Speed up ideation, production, and delivery with AI-powered workflows.", tags: "Ideation • Templates • Content workflows", image: workflows },
  { title: "Business Automation", text: "Transform repetitive tasks into smarter, connected workflows.", tags: "Process automation • Chatbots • Reporting", image: automation },
];

const expertBtn = "shadow-gold inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold uppercase tracking-wider text-navy transition hover:-translate-y-1 hover:brightness-110";

export function AiAutomationPage() {
  const others = servicePages.filter((s) => s.slug !== "ai-automation");
  return <>
    <AiAutomationHero />

    <section className="bg-background py-20">
      <p className="page-shell mx-auto max-w-4xl text-center text-lg leading-relaxed text-muted-foreground">
        We turn artificial intelligence into a practical advantage for your business. We help you identify the right AI opportunities, create high-quality content, streamline creative production, and automate repetitive processes. Whether you are exploring AI for the first time or ready to scale existing solutions, we make adoption simple, strategic, and results-driven.
      </p>
      <div className="page-shell mt-16 space-y-24">
        {offerings.map((o, i) => (
          <div key={o.title} className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
            <div className={i % 2 ? "md:order-2" : ""}>
              <h2 className="font-display text-4xl font-extrabold text-navy">{o.title}</h2>
              <p className="mt-6 max-w-sm text-foreground">{o.text}</p>
              <p className="mt-2 font-semibold text-navy">{o.tags}</p>
              <Link to="/" hash="contact" className={`${expertBtn} mt-8`}>Talk to an AI Expert</Link>
            </div>
            <img src={o.image} alt={o.title} loading="lazy" width={1024} height={1024}
              className={`aspect-[4/4.3] w-full max-w-sm rounded-[2rem] object-cover shadow-xl ${i % 2 ? "md:order-1" : "md:justify-self-end"}`} />
          </div>
        ))}
      </div>
    </section>

    <section className="relative overflow-hidden bg-navy py-16 text-primary-foreground sm:py-20" style={{ backgroundImage: "radial-gradient(50% 90% at 86% 40%, color-mix(in oklab, var(--gold) 20%, transparent), transparent 70%)" }}>
      <div className="page-shell grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <SectionLabel light>Start a Project</SectionLabel>
          <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Ready to work<br /><Highlight dark>smarter with AI?</Highlight></h2>
          <p className="mt-6 text-primary-foreground/85">Let's turn your ideas into intelligent solutions.</p>
          <Link to="/" hash="contact" className="mt-8 shadow-gold inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold uppercase tracking-wider text-navy transition hover:-translate-y-1 hover:brightness-110">Start Your AI Journey</Link>
        </div>
        <CtaVideo slug="ai-automation" poster={cta} label="Glowing AI network animation" />
      </div>
    </section>

    <section className="bg-off py-16 text-navy sm:py-20">
      <div className="page-shell">
        <SectionLabel>Explore More</SectionLabel>
        <h2 className="mt-5 font-display text-4xl font-extrabold">Other <Highlight>Services</Highlight></h2>
        <div className="mt-10 overflow-hidden pb-4">
          <div className="ai-services-track flex w-max gap-5">
          {[...others, ...others].map((s, i) => (
            <Link key={`${s.slug}-${i}`} to="/services/$service" params={{ service: s.slug }} aria-hidden={i >= others.length || undefined} tabIndex={i >= others.length ? -1 : undefined}
              className="group relative h-72 w-64 shrink-0 snap-start overflow-hidden rounded-lg bg-navy text-primary-foreground shadow-xl shadow-navy/20">
              <img src={s.image} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
              <ArrowUpRight className="absolute right-3 top-3 size-4" />
              <div className="absolute inset-x-4 bottom-4">
                <p className="font-display text-lg">{s.title}</p>
                <span className="mt-2 block h-0.5 w-8 bg-gold" />
              </div>
            </Link>
          ))}
          </div>
        </div>
        <Link to="/" hash="services" className="mt-6 inline-flex items-center gap-2 border-b-2 border-gold pb-0.5 font-semibold text-navy transition hover:gap-3">All services <ArrowRight className="size-4" /></Link>
      </div>
    </section>
  </>;
}
