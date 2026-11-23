import { createFileRoute, Link } from "@tanstack/react-router";
import { PAGE_SEO, seoHead } from "@/lib/seo";
import { GlassButton } from "@/components/glass-button";
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
import { WhySection } from "@/components/why-section";
import { ImpactBand } from "@/components/impact-band";
import { LiquidGlass } from "@/components/liquid-glass";
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
  head: () => seoHead(PAGE_SEO.home, "/"),
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
    title: (<>Ideas That <em className="not-italic">Inspire.</em><br />Digital That Delivers.</>),
    body: "A Bangalore-based creative and digital agency bringing strategy, creativity and technology together to help ambitious brands across India stand out and grow.",
    cta: "Let's Talk", link: "Explore Our Services", bar: true, tags: [] as string[],
  },
  {
    img: hero2,
    title: (<>Make your brand<br /><em className="not-italic">mean more.</em></>),
    body: "From brand identity and digital experiences to campaigns, content and intelligent solutions — we turn possibilities into work that connects with people and moves business.",
    cta: "Let's Build", link: "View Our Capabilities", bar: false, tags: ["Branding", "Digital", "Film & Content", "AI & Analytics"],
  },
  {
    img: hero3,
    title: (<>Your Next Big Idea<br /><em className="not-italic">Starts Here.</em></>),
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

      <div className="page-shell relative flex flex-col items-center">
        {/* The page's one H1: what ADZVO is and where. The big rotating slogans below are styled text, not headings. */}
        <h1 className="homepage-hero-copy relative z-10 text-center">
          <SectionLabel light>Creative Digital Agency in Bangalore</SectionLabel>
        </h1>
      <div className="relative grid w-full">
        {SLIDES.map((s, k) => (
          <div key={k} aria-hidden={k !== i}
            className={`homepage-hero-copy col-start-1 row-start-1 mx-auto flex w-full max-w-4xl flex-col items-center text-center transition-all duration-[1200ms] ease-out ${k === i ? "translate-y-0 opacity-100 delay-300" : "pointer-events-none translate-y-6 opacity-0"}`}>
            <p className="font-display mt-4 text-[2.4rem] leading-[1.06] min-[400px]:text-5xl sm:leading-[1.04] font-extrabold tracking-normal text-primary-foreground sm:text-6xl lg:text-7xl xl:text-[4.75rem]">{s.title}</p>
            {s.bar && <div className="mt-4 h-1 w-24 rounded-full bg-gold" />}
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/90 sm:text-lg">{s.body}</p>
            {s.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {s.tags.map((t) => (
                  <LiquidGlass key={t} as="span" tint="clear" radius={12} refraction={12} elasticity={0.08}
                    contentClassName="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider">
                    {t}
                  </LiquidGlass>
                ))}
              </div>
            )}
            <div className="mt-6 flex w-full max-w-[22rem] flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
              <GlassButton as="a" href="/contact" className="w-full sm:w-auto">{s.cta} <ArrowRight /></GlassButton>
              <GlassButton as="a" href="#services" variant="secondary" on="dark" className="w-full sm:w-auto">{s.link} <ArrowUpRight /></GlassButton>
            </div>
          </div>
        ))}
      </div>
      </div>

      <div className="absolute bottom-[4.5rem] left-1/2 -translate-x-1/2">
       <LiquidGlass tint="clear" radius={999} refraction={14} elasticity={0.1} contentClassName="gap-3 px-4 py-1">
        {SLIDES.map((_, k) => (
          <Button variant="ghost" key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className="group h-8 w-20 rounded-none p-0 hover:bg-transparent">
            <span className="block h-0.5 w-full overflow-hidden rounded-full bg-primary-foreground/20">
              <span key={`${i}-${k}`} className={`block h-full bg-gold ${k === i ? (paused ? "w-full" : "animate-[progress_6.5s_linear_forwards]") : k < i ? "w-full" : "w-0"}`} />
            </span>
          </Button>
        ))}
        {/* Slide pause/play, counter, and video controls hidden — slides and video run automatically in the background */}
       </LiquidGlass>
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
    <div className="hero-strip-glass hero-strip-gold absolute inset-x-0 bottom-0 z-10 overflow-hidden py-4">
      <span aria-hidden className="hero-strip-shine" />
      <div className="animate-marquee relative flex w-max gap-8 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="hero-strip-item flex items-center gap-8 text-sm font-bold uppercase tracking-[0.2em]">
            {t} <span className="hero-strip-dot" />
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
  return <ImpactBand stats={stats} />;
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
    <section id="services" className="svc-sec relative overflow-hidden py-20 sm:py-24">
      <div aria-hidden className="svc-sec-glow" />
      <div className="page-shell relative">
          <div className="svc-sec-head reveal mx-auto flex flex-col items-center text-center">
            <SectionLabel light>What We Do</SectionLabel>
            <h2 className="font-display mt-6 text-3xl leading-tight font-extrabold text-primary-foreground sm:text-4xl lg:text-5xl lg:whitespace-nowrap">
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
                className="reveal svc-tile group relative block aspect-square w-full min-w-0 overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-gold"
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

                {/* Default: frosted glass fading up from the bottom, with the icon + title sitting on it (no box) */}
                <div className="svc-frost transition-opacity duration-500 group-hover:opacity-0" aria-hidden />
                <div className="svc-label transition-all duration-500 group-hover:translate-y-2 group-hover:opacity-0">
                  <span className="svc-badge"><Icon className="svc-badge-svg" strokeWidth={2} /></span>
                  <h3 className="font-display text-sm font-bold uppercase leading-snug tracking-widest text-white sm:text-[15px]">{t}</h3>
                </div>
                {/* glass sheen + glass edge on top of everything */}
                <span className="svc-sheen" aria-hidden />

                {/* Hover: the whole tile turns to dark frosted glass (no inner panel / borders) */}
                <div
                  className="invisible absolute inset-0 opacity-0 transition-all duration-500 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"
                  style={{
                    background: "linear-gradient(180deg, rgba(12,16,32,0.42) 0%, rgba(12,16,32,0.58) 55%, rgba(12,16,32,0.72) 100%)",
                    backdropFilter: "blur(14px) saturate(150%)",
                    WebkitBackdropFilter: "blur(14px) saturate(150%)",
                  }}
                >
                 <div className="flex h-full flex-col items-start justify-center p-6 text-primary-foreground" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                  <span className="mb-3 grid shrink-0 place-items-center rounded-xl bg-gold text-navy" style={{ width: 40, height: 40, boxShadow: "0 6px 16px -6px rgba(245,165,36,0.8)" }}>
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <p aria-hidden className="font-display text-sm font-bold uppercase tracking-widest text-primary-foreground">{t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/85">{desc}</p>
                  <ul className="mt-3 space-y-1.5">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13px] text-primary-foreground/90">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold">
                    More <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                 </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <GlassButton as={Link} to="/contact">Start a Project <ArrowRight /></GlassButton>
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
      <WhySection />
      <Footer />
    </main>
  );
}
