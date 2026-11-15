import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Heart, Mail, Sparkles, Users, Zap } from "lucide-react";
import { Footer } from "@/components/site-footer";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers at ADZVO — Join Our Team" },
      { name: "description", content: "We're always looking for curious, creative and driven people to join the ADZVO team. Reach out and let's talk." },
      { property: "og:title", content: "Careers at ADZVO" },
      { property: "og:description", content: "Join a team that creates bold brand experiences and digital solutions for ambitious businesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareersPage,
});

const values = [
  {
    icon: Sparkles,
    title: "Creative at the core",
    text: "We believe the best work starts with curiosity. We push ideas further and aren't afraid to do things differently.",
  },
  {
    icon: Zap,
    title: "Move with purpose",
    text: "We work fast without cutting corners — always focused on what actually moves the needle for our clients.",
  },
  {
    icon: Users,
    title: "Collaboration first",
    text: "No silos here. Strategy, design, tech and content work together from day one on every project.",
  },
  {
    icon: Heart,
    title: "Care about the craft",
    text: "We take pride in what we make. Every detail matters, and we never settle for 'good enough'.",
  },
];

const disciplines = [
  "Brand Strategy & Identity",
  "UI / UX Design",
  "Frontend Development",
  "Video & Photography",
  "Motion & Animation",
  "Content & Copywriting",
  "Digital Marketing & SEO",
  "AI & Automation",
];

function CareersPage() {
  return (
    <div className="bg-ink min-h-screen">
      {/* Hero */}
      <section className="page-shell pt-32 pb-20">
        <SectionLabel>Careers</SectionLabel>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl" style={LOGO_FONT}>
          Work that{" "}
          <Highlight>means something</Highlight>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/60">
          ADZVO is a full-service creative and digital agency. We build brands, campaigns and digital experiences for businesses that want to grow. We're a small, focused team — and we're always open to meeting talented people who care deeply about their craft.
        </p>
      </section>

      {/* Values */}
      <section className="page-shell pb-24">
        <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl" style={LOGO_FONT}>
          How we work
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass rounded-2xl p-6 border border-primary-foreground/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
                <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-sm font-bold uppercase tracking-widest text-primary-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/55">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disciplines */}
      <section className="page-shell pb-24">
        <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.03] p-10 lg:p-14">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
              <Briefcase className="h-5 w-5 text-gold" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl" style={LOGO_FONT}>
                What we're always interested in
              </h2>
              <p className="mt-3 text-primary-foreground/55 max-w-xl">
                We don't always have open roles listed — but we're constantly on the lookout for talented people across these disciplines.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {disciplines.map((d) => (
              <span key={d} className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-2 text-sm font-medium text-primary-foreground/70">
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-shell pb-32">
        <div className="relative overflow-hidden rounded-3xl bg-gold px-10 py-16 text-center lg:px-20">
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl" style={LOGO_FONT}>
              Think you'd be a good fit?
            </h2>
            <p className="mt-4 text-navy/70 max-w-lg mx-auto">
              We'd love to hear from you. Send us a short note about yourself, what you do and what excites you — and we'll be in touch if there's a match.
            </p>
            <a
              href="mailto:hr@adzvo.com?subject=Careers%20at%20ADZVO"
              className="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-navy px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Mail className="h-4 w-4" />
              hr@adzvo.com
            </a>
            <p className="mt-5 text-xs text-navy/50">
              No formal application needed — just introduce yourself.
            </p>
          </div>
          {/* decorative circles */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-navy/5" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-navy/5" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
