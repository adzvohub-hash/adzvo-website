import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Handshake, Target } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import team from "@/assets/team.jpg";
import partnership from "@/assets/why-partnership.jpg";
import { Footer } from "@/components/site-footer";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ADZVO — Integrated Advertising & Digital Agency" },
      { name: "description", content: "ADZVO brings creativity, technology and strategy together to help businesses build stronger brands and meaningful digital experiences." },
      { property: "og:title", content: "About ADZVO" },
      { property: "og:description", content: "An advertising and digital agency built around an integrated way of working." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  { icon: Target, label: "Our Mission", text: "To help brands communicate with clarity and grow with confidence by combining creative thinking, digital capability and purposeful technology." },
  { icon: Eye, label: "Our Vision", text: "To become a trusted creative and digital partner for businesses looking to build meaningful brands, experiences and lasting connections." },
  { icon: Handshake, label: "Our Promise", text: "Thoughtful strategy. Relevant creativity. Reliable execution. Every project begins with listening and stays focused on what matters to the client." },
];

const lens = ["The brand", "The audience", "The message", "The business goal"];

function AboutPage() {
  return (
    <main className="bg-off">
      <section className="relative isolate flex min-h-[92vh] flex-col justify-end overflow-hidden bg-navy pb-16 pt-40 text-primary-foreground">
        <img src={aboutHero} alt="ADZVO team collaborating in the studio" width={1920} height={1088} className="about-hero-img absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/80 to-navy/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-navy to-transparent" />
        <div className="page-shell relative">
          <div className="max-w-3xl">
            <p><SectionLabel light>About ADZVO · Brand promise</SectionLabel></p>
            <h1 className="mt-7 font-display text-4xl font-extrabold leading-[1.08] sm:text-6xl lg:text-7xl">
              An advertising and digital agency built around an <Highlight dark>integrated</Highlight> way of working.
            </h1>
            <div className="mt-8 max-w-2xl space-y-4 text-lg text-primary-foreground/80">
              <p>We look beyond individual deliverables to understand the bigger picture: the brand, the audience, the message and the business goal.</p>
              <p>Then we bring the right mix of creative thinking, digital execution and specialist expertise to make the work happen.</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/" hash="contact" className="shadow-gold inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-navy transition hover:-translate-y-1 hover:brightness-110">Work With Us <ArrowRight className="size-4" /></Link>
              <Link to="/projects" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-7 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-primary-foreground/10">See Our Projects</Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 backdrop-blur-md md:grid-cols-4">
            {lens.map((l, i) => (
              <div key={l} className="bg-navy/50 p-5 transition hover:bg-navy/30">
                <span className="text-xs font-bold tracking-widest text-gold" style={LOGO_FONT}>{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-display text-xl font-bold">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell grid items-center gap-14 py-24 lg:grid-cols-2">
        <img src={team} alt="ADZVO team collaborating" loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-xl" />
        <div>
          <p><SectionLabel>What we do</SectionLabel></p>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl">Creativity, technology and strategy — <Highlight>together.</Highlight></h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            We bring creativity, technology and strategy together to help businesses build stronger brands, connect with the right audiences and create meaningful digital experiences. From brand identity and content to websites, campaigns, film production and AI-enabled solutions, ADZVO connects the capabilities needed to turn ideas into action.
          </p>
        </div>
      </section>

      <section className="bg-card py-24">
        <div className="page-shell">
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Mission · Vision · Promise</SectionLabel>
            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight text-navy sm:text-5xl">What <Highlight>guides us</Highlight></h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {pillars.map(({ icon: Icon, label, text }) => (
              <article key={label} className="group rounded-3xl border border-navy/10 bg-off p-8 transition duration-300 hover:-translate-y-1.5 hover:border-navy hover:bg-navy">
                <span className="grid size-12 place-items-center rounded-xl bg-gold text-navy transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"><Icon className="size-5" strokeWidth={2.4} /></span>
                <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-navy transition-colors duration-300 group-hover:text-gold" style={LOGO_FONT}>{label}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-primary-foreground/80">{text}</p>
                <span className="mt-6 block h-1 w-8 rounded-full bg-gold transition-all duration-300 group-hover:w-16" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell grid items-center gap-14 py-24 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p><SectionLabel>Client-focused</SectionLabel></p>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl">Every business has a different story, audience and <Highlight>ambition.</Highlight></h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">We take time to understand each brief and build a solution around what the client needs—not a one-size-fits-all package.</p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Our goal is to make collaboration clear, considered and valuable from the first conversation to delivery.</p>
        </div>
        <img src={partnership} alt="Client partnership" loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-xl" />
      </section>

      <section className="bg-navy py-20 text-center text-primary-foreground">
        <div className="page-shell">
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-5xl">We turn ambitious ideas into connected brand and <Highlight dark>digital experiences.</Highlight></h2>
          <Link to="/" hash="services" className="shadow-gold mt-10 inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-sm font-bold text-navy transition hover:-translate-y-1 hover:brightness-110">
            Explore Our Work <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
