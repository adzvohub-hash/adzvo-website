import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { Toaster, toast } from "sonner";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { HERO_VIDEO_URL } from "@/lib/videos";
import { Button } from "@/components/ui/button";
import { ImpactCounter } from "@/components/impact-counter";
import { servicePages } from "@/lib/services";
import { BrandMark, Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";
import { Footer } from "@/components/site-footer";
import svc1 from "@/assets/svc-1.jpg";
import svc2 from "@/assets/svc-2.jpg";
import svc3 from "@/assets/svc-3.jpg";
import svc4 from "@/assets/svc-4.jpg";
import svc5 from "@/assets/svc-5.jpg";
import svc6 from "@/assets/svc-6.jpg";
import svc7 from "@/assets/svc-7.jpg";
import svc8 from "@/assets/svc-8.jpg";
import { ArrowRight, ArrowUpRight, CheckCircle2, Cpu, Handshake, Lightbulb, Monitor, TrendingUp as TrendingUpIcon, Palette, Film, Sparkles, Bot, Globe, BarChart3, Pause, Play, Target, TrendingUp, Users, LayoutGrid, Rocket } from "lucide-react";
import { getSettings, getServiceImages } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ADZVO — Ideas That Inspire. Digital That Delivers." },
      {
        name: "description",
        content:
          "ADZVO is a full-service creative digital agency in India — branding, social, web, video, SEO and paid media that move the needle.",
      },
      { property: "og:title", content: "ADZVO — Creative Digital Agency, India" },
      {
        property: "og:description",
        content: "Brands, campaigns and digital experiences that move people — and move the needle.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SERVICES: [string, string, string[], React.ElementType][] = [
  ["Digital & Technology", "Websites, apps and digital products built to perform and scale.", ["Website & app development", "E-commerce & landing pages", "UX/UI design", "Maintenance & support"], Monitor],
  ["Marketing & Growth", "Full-funnel strategies that attract, convert and retain customers.", ["Social media management", "SEO & paid ads", "Email & lead generation", "CRO & analytics"], TrendingUpIcon],
  ["Branding & Design", "Identities that make your brand impossible to ignore.", ["Brand strategy & logo", "Graphic & ad design", "Packaging design", "Presentations & decks"], Palette],
  ["Film, Video & Photography", "Visual storytelling that moves audiences and builds brands.", ["Brand & corporate films", "TV commercials", "Product & event shoots", "Editing & post-production"], Film],
  ["Animation & Content", "Motion and content that explain, engage and entertain.", ["2D/3D animation", "Motion graphics", "Explainer videos", "Short-form & AI content"], Sparkles],
  ["AI & Automation", "Intelligent tools that save time and unlock new possibilities.", ["AI consulting & strategy", "AI content & visuals", "Creative workflows", "Business automation"], Bot],
  ["Content & Localization", "Words and voice that connect across cultures and languages.", ["Copywriting & blogs", "Translation & subtitles", "Multilingual campaigns", "E-books & storybooks"], Globe],
  ["Strategy & Analytics", "Data-led planning and reporting that drives smarter decisions.", ["Digital & marketing strategy", "GA4 & Tag Manager", "Dashboards & reporting", "Content strategy"], BarChart3],
];
const SVC_IMGS_DEFAULT = [svc1, svc2, svc3, svc4, svc5, svc6, svc7, svc8];
const ACCENTS = ["from-gold to-coral", "from-electric to-sky", "from-coral to-gold", "from-mint to-sky"];

const WHY = [
  [<Lightbulb key="i" />, "Creative Excellence", "Fresh ideas, compelling stories and design that makes an impact.", "from-electric to-sky"],
  [<Cpu key="i" />, "Tech-Enabled Solutions", "From websites to AI-driven tools, we use technology to create smarter, faster and scalable solutions.", "from-gold to-coral"],
  [<Target key="i" />, "Strategic Approach", "Data-led insights, clear planning and measurable outcomes for long-term success.", "from-coral to-gold"],
  [<Users key="i" />, "Experienced Team", "A skilled team of strategists, creators, marketers and tech experts — working as one, for your brand.", "from-violet to-electric"],
  [<Handshake key="i" />, "Client-Centric Partnership", "Your goals become our goals. We stay collaborative, transparent and committed at every step.", "from-mint to-sky"],
  [<TrendingUp key="i" />, "Real Business Impact", "Not just campaigns — we create experiences that build brands and drive growth.", "from-gold to-coral"],
] as const;

function useReveal() {
  useEffect(() => {
    // Scan on scroll/resize so content always appears, even after live updates
    // or when the observer misses tall elements.
    let raf = 0;
    const scan = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("in");
          else if (r.bottom <= 0) el.classList.add("in");
        });
      });
    };
    scan();
    window.addEventListener("scroll", scan, { passive: true });
    window.addEventListener("resize", scan);
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", scan);
      window.removeEventListener("resize", scan);
      mo.disconnect();
    };
  }, []);
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#" className="font-display text-2xl font-extrabold tracking-tight">
      <span className={dark ? "text-navy" : "text-primary-foreground"}>ADZ</span>
      <span className="text-gold">VO</span>
    </a>
  );
}

function Pill({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "white" | "gold" | "hero" }) {
  const cls = {
    blue: "bg-electric/10 text-electric border-electric/20",
    white: "bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20",
    gold: "bg-gold/10 text-gold border-gold/30",
    hero: "homepage-hero-badge",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur ${cls}`}>
      {children}
    </span>
  );
}

const SLIDES = [
  {
    img: hero1,
    title: (<>Ideas That <em className="italic">Inspire.</em><br />Digital That Delivers.</>),
    body: "We bring strategy, creativity and technology together to help ambitious brands stand out and move forward.",
    cta: "Let's Talk", link: "Explore Our Services", bar: true, tags: [] as string[],
  },
  {
    img: hero2,
    title: (<>Make your brand<br /><em className="italic">mean more.</em></>),
    body: "From brand identity and digital experiences to campaigns, content and intelligent solutions — we turn possibilities into work that connects with people and moves business.",
    cta: "Let's Build", link: "View Our Capabilities", bar: false, tags: ["Branding", "Digital", "Film & Content", "AI & Analytics"],
  },
  {
    img: hero3,
    title: (<>Your Next Big Idea<br /><em className="italic">Starts Here.</em></>),
    body: "From the first spark to the final result, ADZVO combines bold creativity, smart digital solutions and clear strategy to help your brand go further.",
    cta: "Start a Project", link: "Explore Our Services", bar: true, tags: [] as string[],
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [heroVideoUrl, setHeroVideoUrl] = useState(HERO_VIDEO_URL);
  useEffect(() => {
    void getSettings().then((s) => { if (s.hero_video_url) setHeroVideoUrl(s.hero_video_url); }).catch(() => {});
  }, []);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
      setPaused(true);
    }
  }, []);
  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setVideoPlaying(false));
    else video.pause();
  };
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % SLIDES.length), 6500);
    return () => clearTimeout(t);
  }, [i, paused]);
  return (
    <section id="about" className="homepage-hero relative flex items-center overflow-hidden bg-navy pt-24 pb-32">
      <video
        ref={videoRef}
        src={heroVideoUrl}
        poster={hero1}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="ADZVO creative services showreel"
        onPlay={() => setVideoPlaying(true)}
        onPause={() => setVideoPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="homepage-hero-overlay pointer-events-none absolute inset-0" />

      <div className="page-shell relative grid">
        {SLIDES.map((s, k) => (
          <div key={k} aria-hidden={k !== i}
            className={`homepage-hero-copy col-start-1 row-start-1 mx-auto flex w-full max-w-4xl flex-col items-center text-center transition-all duration-[1200ms] ease-out ${k === i ? "translate-y-0 opacity-100 delay-300" : "pointer-events-none translate-y-6 opacity-0"}`}>
            <SectionLabel light>Creative Digital Agency</SectionLabel>
            <h1 className="font-display mt-4 text-5xl leading-[1.04] font-extrabold tracking-normal text-primary-foreground sm:text-6xl lg:text-7xl xl:text-[4.75rem]">{s.title}</h1>
            {s.bar && <div className="mt-4 h-1 w-24 rounded-full bg-gold" />}
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg">{s.body}</p>
            {s.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="glass rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">{t}</span>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <a href="/contact" className="shadow-gold inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-navy transition hover:-translate-y-1 hover:brightness-110">
                {s.cta}
              </a>
              <a href="#services" className="group inline-flex items-center gap-2 text-sm font-semibold text-gold sm:text-base">
                {s.link} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-[4.5rem] left-1/2 flex -translate-x-1/2 items-center gap-3">
        {SLIDES.map((_, k) => (
          <Button variant="ghost" key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className="group h-8 w-20 rounded-none p-0 hover:bg-transparent">
            <span className="block h-0.5 w-full overflow-hidden rounded-full bg-primary-foreground/20">
              <span key={`${i}-${k}`} className={`block h-full bg-gold ${k === i ? (paused ? "w-full" : "animate-[progress_6.5s_linear_forwards]") : k < i ? "w-full" : "w-0"}`} />
            </span>
          </Button>
        ))}
        {/* Slide pause/play, counter, and video controls hidden — slides and video run automatically in the background */}
      </div>

      {/* Frosted strip sits over the hero so the video shows through it */}
      <Marquee />
    </section>
  );
}

function FloatPill({ className, icon, big, small }: { className: string; icon: string; big: string; small: string }) {
  return (
    <div className={`glass-light absolute flex animate-[float_7s_ease-in-out_infinite] items-center gap-3 rounded-2xl px-4 py-3 ${className}`}>
      <span className="text-2xl">{icon}</span>
      <div className="leading-tight">
        <div className="text-sm font-bold text-navy">{big}</div>
        <div className="text-xs text-muted-foreground">{small}</div>
      </div>
    </div>
  );
}

function Marquee() {
  const items = ["Social Media", "Branding & Identity", "Web & App Development", "SEO & Growth", "Video Production", "Paid Media", "Influencer Marketing", "Content Strategy"];
  const row = [...items, ...items];
  return (
    <div className="hero-strip-glass absolute inset-x-0 bottom-0 z-10 overflow-hidden py-4">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-bold uppercase tracking-[0.2em] text-white">
            {t} <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}

export const IMPACT_STATS_DEFAULT = [
  { value: 120, label: "Projects Delivered" },
  { value: 50, label: "Trusted Clients" },
  { value: 36, label: "Partners & Collaborators" },
  { value: 8, label: "Service Categories" },
];
// Keep the old const name for any components still importing it
export const IMPACT_STATS = IMPACT_STATS_DEFAULT;

function Impact() {
  const [stats, setStats] = useState(IMPACT_STATS_DEFAULT);
  useEffect(() => {
    void getSettings().then((s) => {
      setStats([
        { value: s.metric_projects,   label: "Projects Delivered" },
        { value: s.metric_clients,    label: "Trusted Clients" },
        { value: s.metric_partners,   label: "Partners & Collaborators" },
        { value: s.metric_categories, label: "Service Categories" },
      ]);
    }).catch(() => {});
  }, []);
  // Logo palette only: navy, gold and white. The first card is the navy anchor.
  const icons = [Rocket, Handshake, Users, LayoutGrid];
  return (
    <section id="impact" className="bg-off py-28 sm:py-32">
      <div className="page-shell flex flex-col items-center gap-16">
        <div className="reveal mx-auto flex w-full flex-col items-center text-center">
          <SectionLabel>The ADZVO Impact</SectionLabel>
          <h2 className="font-display mt-6 text-3xl leading-tight font-extrabold text-navy sm:text-4xl whitespace-nowrap">
            Ideas in Motion, <Highlight>Impact in Numbers.</Highlight>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Creative thinking and technology, working together to move brands forward.
          </p>
        </div>
        <div className="reveal grid w-full grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
            {stats.map((stat, index) => {
              const Icon = icons[index] ?? TrendingUp;
              const anchor = index === 0;
              return (
              <div key={stat.label} className={`impact-stat-card group flex min-w-0 flex-col rounded-3xl border p-6 text-left transition duration-300 hover:-translate-y-1.5 sm:p-7 ${anchor ? "border-navy bg-navy text-primary-foreground shadow-[0_18px_40px_-18px] shadow-navy/60" : "border-navy/10 bg-card text-navy shadow-[0_14px_36px_-20px] shadow-navy/30 hover:border-gold"}`}>
                <span className="grid size-11 place-items-center rounded-xl bg-gold text-navy transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon className="size-5" strokeWidth={2.4} />
                </span>
                <div className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl" style={LOGO_FONT}><ImpactCounter value={stat.value} /></div>
                <div className={`mt-2 text-xs font-semibold sm:text-sm ${anchor ? "text-primary-foreground/75" : "text-navy/65"}`}>{stat.label}</div>
                <span className="mt-6 block h-1 w-8 rounded-full bg-gold transition-all duration-300 group-hover:w-16" />
              </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

function Services() {
  // svcImgs is indexed by service slug — falls back to default static images
  const [svcImgs, setSvcImgs] = useState<Record<string, string>>({});
  useEffect(() => {
    void getServiceImages().then((imgs) => {
      const map: Record<string, string> = {};
      imgs.forEach(({ slug, image_url }) => { if (image_url) map[slug] = image_url; });
      setSvcImgs(map);
    }).catch(() => {});
  }, []);

  return (
    <section id="services" className="bg-services grain relative overflow-hidden py-20 sm:py-24">
      <div className="page-shell relative">
          <div className="reveal mx-auto flex flex-col items-center text-center">
            <SectionLabel light>What We Do</SectionLabel>
            <h2 className="font-display mt-6 text-4xl leading-tight font-extrabold text-primary-foreground sm:text-5xl whitespace-nowrap">
              Full-Spectrum <Highlight dark>Digital Services</Highlight>
            </h2>
            <p className="mt-5 max-w-xl text-primary-foreground/60">
              From strategy to execution — every discipline you need, under one roof.
            </p>
          </div>

        <div className="mt-16 grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map(([t, desc, bullets, Icon], i) => {
            const service = servicePages.find((item) => item.title === t);
            if (!service) return null;
            return (
              <Link
                key={t}
                to="/services/$service"
                params={{ service: service.slug }}
                aria-label={t}
                className="reveal group relative block aspect-square w-full min-w-0 overflow-hidden rounded-2xl shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-gold"
                style={{ transitionDelay: `${(i % 4) * 60}ms` }}
              >
                {/* Background image — always visible, zooms on hover */}
                <img
                  src={svcImgs[service.slug] ?? SVC_IMGS_DEFAULT[i]}
                  alt={t}
                  width={768} height={768}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Default overlay — dark gradient + icon + title */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-navy/10 transition-opacity duration-400 group-hover:opacity-0" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 transition-opacity duration-400 group-hover:opacity-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary-foreground/60 bg-navy/30 backdrop-blur-sm">
                    <Icon className="h-6 w-6 text-primary-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-center text-base font-bold uppercase tracking-widest text-primary-foreground drop-shadow sm:text-lg">{t}</h3>
                </div>

                {/* Hover overlay — dark panel with description + bullets + CTA */}
                <div className="absolute inset-0 flex flex-col justify-center bg-navy/90 p-6 opacity-0 backdrop-blur-sm transition-opacity duration-400 group-hover:opacity-100">
                  {/* gold top bar */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gold" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-gold/10 mb-3">
                    <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-widest text-primary-foreground">{t}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-primary-foreground/70">{desc}</p>
                  <ul className="mt-3 space-y-1.5">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-primary-foreground/80">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold">
                    More <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <a href="/contact" className="group inline-flex items-center gap-2 font-semibold text-gold">
            Start a Project <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

const WHY_ORBITAL = [
  { icon: <Lightbulb />, title: "Creative Excellence",       desc: "Ideas that inspire and make an impact.",              color: "from-amber-400 to-orange-500",   shadow: "shadow-amber-400/40"   },
  { icon: <Cpu />,       title: "Tech-Enabled Solutions",    desc: "Leveraging the latest tech for smarter outcomes.",   color: "from-purple-500 to-indigo-600",  shadow: "shadow-purple-500/40"  },
  { icon: <Users />,     title: "Experienced Team",          desc: "A passionate team that makes it happen.",            color: "from-blue-400 to-cyan-500",      shadow: "shadow-blue-400/40"    },
  { icon: <Target />,    title: "Strategic Approach",        desc: "Insights-driven, always a step ahead.",             color: "from-pink-400 to-rose-500",      shadow: "shadow-pink-400/40"    },
  { icon: <Handshake />, title: "Client-Centric Partnership",desc: "Your goals, our commitment.",                       color: "from-teal-400 to-emerald-500",   shadow: "shadow-teal-400/40"    },
  { icon: <TrendingUp />,title: "Real Business Impact",      desc: "Measurable results for a brighter tomorrow.",       color: "from-indigo-500 to-blue-700",    shadow: "shadow-indigo-500/40"  },
] as const;

function WhyCard({ item, side }: { item: typeof WHY_ORBITAL[number]; side: "left" | "right" }) {
  return (
    <div
      className="why-orbital-card group flex w-full items-center gap-4 px-4 py-3.5 transition-all duration-300 hover:-translate-y-1 sm:w-72"
      style={{
        borderRadius: "1.1rem",
        background: "linear-gradient(145deg, rgba(255,255,255,0.82) 0%, rgba(240,236,255,0.55) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.75)",
        boxShadow: "0 2px 0 0 rgba(255,255,255,0.9) inset, 0 -1px 0 0 rgba(180,160,255,0.18) inset, 2px 0 0 0 rgba(255,255,255,0.7) inset, -1px 0 0 0 rgba(180,160,255,0.12) inset, 0 8px 24px rgba(130,100,220,0.10), 0 2px 6px rgba(100,80,180,0.08)",
      }}
    >
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg ${item.shadow} [&_svg]:size-5 [&_svg]:stroke-[2] transition-transform duration-300 group-hover:scale-110`}>
        {item.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {side === "right" && <span className="text-[9px] font-bold tracking-widest text-purple-400" style={LOGO_FONT}>——</span>}
          <span className="text-[10px] font-bold tracking-widest text-purple-400" style={LOGO_FONT}>{String(WHY_ORBITAL.indexOf(item) + 1).padStart(2, "0")}</span>
          {side === "left" && <span className="text-[9px] font-bold tracking-widest text-purple-400" style={LOGO_FONT}>——</span>}
        </div>
        <h3 className="font-display text-sm font-bold leading-tight text-navy">{item.title}</h3>
        <p className="mt-0.5 text-xs leading-snug text-navy/55">{item.desc}</p>
      </div>
    </div>
  );
}

function Why() {
  return (
    <section id="why" className="relative overflow-hidden py-24 sm:py-32">
      {/* Light pastel background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #faf9ff 40%, #eff6ff 100%)" }} />

      {/* Decorative wave lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-50" viewBox="0 0 1300 700" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden>
        <path d="M-100 520 Q200 400 500 460 Q800 520 1050 420 Q1200 360 1450 440" stroke="url(#wg1)" strokeWidth="1.8" />
        <path d="M-100 570 Q300 450 620 510 Q920 570 1150 480 Q1300 420 1450 490" stroke="url(#wg2)" strokeWidth="1.4" />
        <defs>
          <linearGradient id="wg1" x1="0" y1="0" x2="1300" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="65%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wg2" x1="0" y1="0" x2="1300" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="35%" stopColor="#a855f7" />
            <stop offset="75%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>


      <div className="page-shell relative z-10 flex flex-col items-center gap-14">
        {/* Header */}
        <div className="reveal text-center">
          <SectionLabel>Why Choose ADZVO</SectionLabel>
          <h2 className="font-display mt-6 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            More Than a Service. <Highlight>A Strategic Partner.</Highlight>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            Creativity, technology and strategy — working together for your brand.
          </p>
        </div>

        {/* Mobile grid */}
        <div className="reveal grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {WHY_ORBITAL.map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-4" style={{ borderRadius:"1.1rem", background:"linear-gradient(145deg,rgba(255,255,255,0.82) 0%,rgba(240,236,255,0.55) 100%)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,0.75)", boxShadow:"0 2px 0 0 rgba(255,255,255,0.9) inset,0 -1px 0 0 rgba(180,160,255,0.18) inset,2px 0 0 0 rgba(255,255,255,0.7) inset,-1px 0 0 0 rgba(180,160,255,0.12) inset,0 8px 24px rgba(130,100,220,0.10),0 2px 6px rgba(100,80,180,0.08)" }}>
              <span className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg [&_svg]:size-5 [&_svg]:stroke-[2]`}>{item.icon}</span>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-purple-400" style={LOGO_FONT}>{String(WHY_ORBITAL.indexOf(item) + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-sm font-bold text-navy">{item.title}</h3>
                <p className="mt-0.5 text-xs text-navy/55">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop orbital layout */}
        <div className="reveal hidden w-full items-center justify-center gap-6 lg:flex xl:gap-10">
          {/* Left cards */}
          <div className="flex flex-col items-end gap-5">
            {WHY_ORBITAL.slice(0, 3).map((item) => <WhyCard key={item.title} item={item} side="left" />)}
          </div>

          {/* Center sphere */}
          <div className="relative mx-2 flex shrink-0 items-center justify-center xl:mx-6">
            {/* Outer orbit rings */}
            <div className="why-orbit-ring absolute h-[340px] w-[340px] rounded-full border border-purple-200/50 border-dashed" />
            <div className="why-orbit-ring-slow absolute h-[290px] w-[290px] rounded-full border border-purple-300/40" />

            {/* Connecting dots on orbit */}
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute h-2.5 w-2.5 rounded-full bg-purple-400/70 shadow-sm shadow-purple-400/50"
                style={{ transform: `rotate(${-30 + i * -50}deg) translateX(-145px) rotate(${30 - i * -50}deg)` }} />
            ))}
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute h-2.5 w-2.5 rounded-full bg-purple-400/70 shadow-sm shadow-purple-400/50"
                style={{ transform: `rotate(${30 + i * 50}deg) translateX(145px) rotate(${-(30 + i * 50)}deg)` }} />
            ))}

            {/* Sphere */}
            <div className="relative flex h-56 w-56 flex-col items-center justify-center rounded-full" style={{
              background: "radial-gradient(circle at 35% 32%, rgba(255,255,255,0.98), rgba(220,215,255,0.65) 55%, rgba(180,200,255,0.45))",
              boxShadow: "0 0 60px 20px rgba(168,139,250,0.22), 0 0 120px 40px rgba(99,102,241,0.12), inset 0 0 50px rgba(255,255,255,0.85), 0 20px 50px rgba(99,102,241,0.18), inset 0 -10px 30px rgba(200,210,255,0.3)"
            }}>
              <div className="absolute inset-3 rounded-full" style={{ background: "radial-gradient(circle at 38% 38%, rgba(255,255,255,0.9), rgba(230,225,255,0.2))", border: "1px solid rgba(200,185,255,0.35)" }} />
              <div className="relative z-10 flex flex-col items-center gap-1">
                <BrandMark className="size-14" />
                <span className="mt-1 text-lg font-extrabold tracking-[0.2em] text-navy" style={LOGO_FONT}>ADZVO</span>
                <span className="text-[8px] font-semibold tracking-[0.28em] text-navy/45" style={LOGO_FONT}>IDEAS · PEOPLE · IMPACT</span>
              </div>
            </div>
          </div>

          {/* Right cards */}
          <div className="flex flex-col items-start gap-5">
            {WHY_ORBITAL.slice(3, 6).map((item) => <WhyCard key={item.title} item={item} side="right" />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  useReveal();
  return (
    <main className="bg-off">
      <Toaster position="top-center" richColors />
      <Hero />
      <Impact />
      <Services />
      <Why />
      <Footer />
    </main>
  );
}
