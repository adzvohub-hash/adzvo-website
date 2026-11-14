import { CtaVideo } from "@/components/cta-video";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { servicePages } from "@/lib/services";
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

const expertBtn = "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-coral via-violet to-electric px-7 py-3 font-medium text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5";

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
              <h2 className="text-4xl text-navy">{o.title}</h2>
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

    <section className="bg-ai-plum py-16 text-primary-foreground">
      <div className="page-shell grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">Ready to work<br />smarter with AI?</h2>
          <p className="mt-4 text-primary-foreground/85">Let's turn your ideas into intelligent solutions.</p>
          <Link to="/" hash="contact" className="mt-8 inline-flex rounded-md bg-sky px-6 py-3 font-medium text-navy hover:brightness-110">Start Your AI Journey</Link>
        </div>
        <CtaVideo slug="ai-automation" poster={cta} label="Glowing AI network animation" />
      </div>
    </section>

    <section className="bg-electric py-16 text-primary-foreground">
      <div className="page-shell">
        <h2 className="text-4xl font-extrabold">Other Services</h2>
        <div className="mt-10 overflow-hidden pb-4">
          <div className="ai-services-track flex w-max gap-5">
          {[...others, ...others].map((s, i) => (
            <Link key={`${s.slug}-${i}`} to="/services/$service" params={{ service: s.slug }} aria-hidden={i >= others.length || undefined} tabIndex={i >= others.length ? -1 : undefined}
              className="group relative h-72 w-64 shrink-0 snap-start overflow-hidden rounded-lg bg-navy">
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
        <Link to="/" hash="services" className="mt-6 inline-flex items-center gap-2 font-semibold">All services <ArrowRight className="size-4" /></Link>
      </div>
    </section>
  </>;
}
