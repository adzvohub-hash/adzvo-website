import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Toaster, toast } from "sonner";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import contactImg from "@/assets/contact.jpg";
import { HERO_VIDEO_URL } from "@/lib/videos";
import { Button } from "@/components/ui/button";
import { ImpactCounter } from "@/components/impact-counter";
import { servicePages } from "@/lib/services";
import { Footer } from "@/components/site-footer";
import svc1 from "@/assets/svc-1.jpg";
import svc2 from "@/assets/svc-2.jpg";
import svc3 from "@/assets/svc-3.jpg";
import svc4 from "@/assets/svc-4.jpg";
import svc5 from "@/assets/svc-5.jpg";
import svc6 from "@/assets/svc-6.jpg";
import svc7 from "@/assets/svc-7.jpg";
import svc8 from "@/assets/svc-8.jpg";
import { ArrowRight, ArrowUpRight, Check, Cpu, Handshake, Lightbulb, Pause, Play, Target, TrendingUp, Users } from "lucide-react";

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

const SERVICES = [
  ["Digital & Technology", "Website development • Apps • E-commerce • Landing pages • Maintenance • UX/UI"],
  ["Marketing & Growth", "Social media • SEO & YouTube SEO • Email marketing • Google/Meta Ads • Lead generation • CRO"],
  ["Branding & Design", "Brand strategy • Logo & identity • Graphic design • Ad creatives • Packaging • Presentations"],
  ["Film, Video & Photography", "Ad & corporate films • Commercials • Product/brand shoots • Events • Podcasts • Weddings • Editing"],
  ["Animation & Content", "2D/3D animation • Motion graphics • Explainer videos • AI & short-form content • Music videos"],
  ["AI & Automation", "AI consulting • AI content & visuals • Creative workflows • Business automation"],
  ["Content & Localization", "Copywriting • Blogs • E-books • Storybooks • Translation • Subtitles • Multilingual content"],
  ["Strategy & Analytics", "Digital/marketing strategy • GA4 • Tag Manager • Dashboards • Reporting • Content strategy"],
];
const SVC_IMGS = [svc1, svc2, svc3, svc4, svc5, svc6, svc7, svc8];
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
    cta: "Let's Talk", link: "Explore our services", bar: true, tags: [] as string[],
  },
  {
    img: hero2,
    title: (<>Make your brand<br /><em className="italic">mean more.</em></>),
    body: "From brand identity and digital experiences to campaigns, content and intelligent solutions — we turn possibilities into work that connects with people and moves business.",
    cta: "Let's Build", link: "View our capabilities", bar: false, tags: ["Branding", "Digital", "Film & Content", "AI & Analytics"],
  },
  {
    img: hero3,
    title: (<>Your Next Big Idea<br /><em className="italic">Starts Here.</em></>),
    body: "From the first spark to the final result, ADZVO combines bold creativity, smart digital solutions and clear strategy to help your brand go further.",
    cta: "Start a Project", link: "Explore our services", bar: true, tags: [] as string[],
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(true);
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
    <section id="about" className="homepage-hero relative flex items-center overflow-hidden bg-navy pt-24 pb-20">
      <video
        ref={videoRef}
        src={HERO_VIDEO_URL}
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
            <Pill tone="hero">
              <span className="h-2 w-2 animate-pulse rounded-full bg-current" /> Creative Digital Agency
            </Pill>
            <h1 className="font-display mt-4 text-5xl leading-[1.04] font-extrabold tracking-normal text-primary-foreground sm:text-6xl lg:text-7xl xl:text-[4.75rem]">{s.title}</h1>
            {s.bar && <div className="mt-4 h-1 w-24 rounded-full bg-gold" />}
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/90 sm:text-lg">{s.body}</p>
            {s.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {s.tags.map((t, n) => (
                  <span key={t} className={`glass rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${n === 2 ? "text-gold" : "text-sky"}`}>{t}</span>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <a href="#contact" className="shadow-blue inline-flex items-center gap-2 rounded-xl bg-electric px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:-translate-y-1">
                {s.cta}
              </a>
              <a href="#services" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground sm:text-base">
                {s.link} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="page-shell absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
        {SLIDES.map((_, k) => (
          <Button variant="ghost" key={k} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className="group h-8 flex-1 max-w-24 rounded-none p-0 hover:bg-transparent">
            <span className="block h-0.5 w-full overflow-hidden rounded-full bg-primary-foreground/20">
              <span key={`${i}-${k}`} className={`block h-full bg-gold ${k === i ? (paused ? "w-full" : "animate-[progress_6.5s_linear_forwards]") : k < i ? "w-full" : "w-0"}`} />
            </span>
          </Button>
        ))}
        <Button variant="ghost" size="icon" type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play slides" : "Pause slides"} title={paused ? "Play slides" : "Pause slides"} className="ml-2 h-8 w-8 shrink-0 rounded-full border border-primary-foreground/30 text-primary-foreground/80 transition hover:border-gold hover:bg-transparent hover:text-gold">
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </Button>
        <span className="ml-2 text-xs font-semibold tracking-widest text-primary-foreground/60">0{i + 1} / 0{SLIDES.length}</span>
        <Button variant="ghost" size="icon" onClick={toggleVideo} aria-label={videoPlaying ? "Pause hero video" : "Play hero video"} title={videoPlaying ? "Pause hero video" : "Play hero video"} className="ml-auto h-9 w-9 shrink-0 rounded-full border border-primary-foreground/30 text-primary-foreground/80 hover:border-gold hover:bg-transparent hover:text-gold">
          {videoPlaying ? <Pause /> : <Play />}
        </Button>
      </div>
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
    <div className="overflow-hidden bg-gold py-4">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-bold uppercase tracking-[0.2em] text-navy">
            {t} <span className="h-1.5 w-1.5 rounded-full bg-navy" />
          </span>
        ))}
      </div>
    </div>
  );
}

export const IMPACT_STATS = [
  { value: 120, label: "Projects Delivered" },
  { value: 50, label: "Trusted Clients" },
  { value: 36, label: "Partners & Collaborators" },
  { value: 8, label: "Service Categories" },
] as const;

function Impact() {
  const cardStyles = [
    { card: "from-navy/90 to-navy/75 border-gold/30", number: "text-gold glow-gold", label: "text-primary-foreground/50" },
    { card: "from-electric/25 to-electric/10 border-sky/40", number: "text-sky glow-sky", label: "text-navy/60" },
    { card: "from-gold/25 to-gold/10 border-gold/45", number: "text-navy", label: "text-navy/55" },
    { card: "from-mint/20 to-mint/5 border-mint/40", number: "text-mint glow-mint", label: "text-navy/55" },
  ];
  return (
    <section id="impact" className="bg-soft py-20 sm:py-24">
      <div className="page-shell flex flex-col items-center gap-10">
        <div className="reveal mx-auto flex w-full flex-col items-center text-center">
          <Pill>The ADZVO Impact</Pill>
          <h2 className="font-display mt-6 text-4xl leading-tight font-extrabold text-navy sm:text-5xl">
            Ideas in Motion.<br /><span className="italic text-electric">Impact in Numbers.</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Creative thinking and technology, working together to move brands forward.
          </p>
        </div>
        <div className="reveal grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
            {IMPACT_STATS.map((stat, index) => (
              <div key={stat.label} className={`impact-stat-card flex min-w-0 flex-col justify-center rounded-2xl border bg-gradient-to-br px-4 py-3 text-left shadow-[0_8px_32px_-8px] shadow-navy/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 sm:px-5 ${cardStyles[index]?.card}`}>
                <div className={`font-display text-2xl font-extrabold sm:text-3xl ${cardStyles[index]?.number}`}><ImpactCounter value={stat.value} /></div>
                <div className={`mt-1 text-xs font-semibold sm:text-sm ${cardStyles[index]?.label}`}>{stat.label}</div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-services grain relative overflow-hidden py-20 sm:py-24">
      <div className="page-shell relative">
          <div className="reveal mx-auto flex flex-col items-center text-center">
            <Pill tone="white">What We Do</Pill>
            <h2 className="font-display mt-6 text-4xl leading-tight font-extrabold text-primary-foreground sm:text-5xl">
              Full-Spectrum
              <br />
              Digital Services
            </h2>
            <p className="mt-5 max-w-2xl text-primary-foreground/60">
              From strategy to execution — every discipline you need under one roof, built for Indian brands that want to grow.
            </p>
            <a href="#contact" className="group mt-8 inline-flex items-center gap-2 font-semibold text-gold">
              Start a Project <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>

        <div className="mt-16 grid w-full gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map(([t, d], i) => {
            const service = servicePages.find((item) => item.title === t);
            if (!service) return null;
            return (
            <Link
              key={t}
              to="/services/$service"
              params={{ service: service.slug }}
              aria-label={t}
              className="reveal group relative block aspect-square w-full min-w-0 overflow-hidden rounded-2xl border border-primary-foreground/15 shadow-xl outline-none transition duration-500 hover:-translate-y-1.5 hover:border-primary-foreground/30 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-gold"
              style={{ transitionDelay: `${(i % 4) * 70}ms` }}
            >
              <img src={SVC_IMGS[i]} alt={t} width={768} height={960} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110 group-focus:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/5 transition duration-500 group-hover:via-navy/80 group-hover:to-navy/40 group-focus:via-navy/80 group-focus:to-navy/40" />
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r opacity-0 transition group-hover:opacity-100 ${ACCENTS[i % 4]}`} />
              <div className="glass absolute top-5 left-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
              <ArrowUpRight className="absolute top-6 right-6 h-5 w-5 text-primary-foreground/60 transition duration-500 group-hover:rotate-45 group-hover:text-gold" />
              <div className="absolute inset-x-0 bottom-0 p-4.5">
                <h3 className="font-display text-xl leading-tight font-bold text-primary-foreground sm:text-2xl xl:text-xl">{t}</h3>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
                  <ul className="flex flex-wrap gap-1 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:delay-100 group-focus:opacity-100 [@media(hover:none)]:opacity-100">
                    <li aria-hidden className="h-2 w-full" />
                    {(d ?? "").split(" • ").map((x) => (
                      <li key={x} className="min-w-0 max-w-full rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-2 py-0.5 text-[13px] leading-tight font-medium break-words text-primary-foreground sm:text-sm backdrop-blur">{x}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2.5 h-0.5 w-10 rounded-full bg-gold transition-all duration-500 group-hover:w-20" />
              </div>
            </Link>
          );
          })}
        </div>
      </div>
    </section>
  );
}

const WHY_TONES = [
  "text-electric",
  "text-gold",
  "text-coral",
  "text-violet",
  "text-mint",
  "text-sky",
] as const;

function Why() {
  return (
    <section id="why" className="bg-soft relative overflow-hidden py-20 sm:py-24">
      <div className="page-shell relative flex flex-col items-center gap-10">
        <div className="reveal mx-auto flex w-full flex-col items-center text-center">
          <Pill>Why Choose ADZVO</Pill>
          <h2 className="font-display mt-6 text-4xl leading-tight font-extrabold text-navy sm:text-5xl">
            More Than a Service.<br /><span className="italic text-electric">A Strategic Partner.</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            We combine creativity, technology and strategy to help ambitious brands build, connect and grow — in today's digital world and beyond.
          </p>
        </div>
        <div className="reveal grid w-full grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 [transition-delay:150ms]">
          {WHY.map(([icon, title], index) => (
            <div key={title} className="flex items-center justify-center gap-2.5">
              <span className={`shrink-0 [&_svg]:size-[18px] ${WHY_TONES[index]}`}>{icon}</span>
              <h3 className="text-sm font-semibold text-navy sm:text-base">{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sending, setSending] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    setTimeout(() => {
      setSending(false);
      form.reset();
      toast.success("Thanks! We'll get back to you within one business day.");
    }, 700);
  };
  const input = "w-full rounded-[10px] border border-border bg-off px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted-foreground/60 focus:border-electric focus:ring-[3px] focus:ring-electric/10";
  const bars = [
    ["Social & Content", 78, "from-electric to-sky", "bg-electric shadow-electric"],
    ["Branding & Web", 62, "from-gold to-coral", "bg-gold shadow-gold"],
    ["Paid Media", 55, "from-mint to-sky", "bg-mint shadow-mint"],
  ] as const;
  return (
    <section id="contact" className="bg-off py-20 sm:py-24">
      <div className="page-shell grid gap-8 lg:grid-cols-[11fr_13fr]">
      <div className="shadow-contact relative min-w-0 overflow-hidden rounded-3xl bg-navy p-6 sm:p-10 xl:p-12">
        <img src={contactImg} alt="" width={1024} height={1280} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/85 to-navy/60" />
        <div className="orb -top-20 -right-20 h-80 w-80 bg-gold/20" />
        <div className="orb -bottom-20 -left-20 h-80 w-80 bg-electric/25 [animation-delay:-5s]" />
        <div className="reveal relative w-full">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">Start a Project</div>
          <h2 className="font-display mt-5 text-4xl leading-tight font-extrabold text-primary-foreground sm:text-5xl">
            Your Next Big Idea <span className="text-gradient-gold italic">Starts Here.</span>
          </h2>
          <p className="mt-5 text-primary-foreground/45">Tell us about your brand and your goals. We'll come back with a clear plan — no fluff, no obligation.</p>
          <div className="mt-10 border-t border-primary-foreground/20 pt-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">What our clients invest in</div>
            <div className="mt-5 space-y-4">
              {bars.map(([l, p, g, d]) => (
                <div key={l} className="flex items-center gap-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full shadow-[0_0_10px] ${d}`} />
                  <span className="w-28 shrink-0 text-sm text-primary-foreground/80">{l}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-[3px] bg-primary-foreground/10">
                    <div className={`h-full rounded-[3px] bg-gradient-to-r ${g}`} style={{ width: `${p}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm font-semibold text-primary-foreground">{p}%</span>
                </div>
              ))}
            </div>
          </div>
          <ul className="mt-8 space-y-3">
            {["Response within 24 hours", "Free initial strategy session", "No long-term lock-in contracts"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-primary-foreground/80">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint/20 text-mint shadow-[0_0_14px] shadow-mint/40">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="shadow-contact min-w-0 rounded-3xl border border-border bg-primary-foreground p-6 sm:p-10 xl:p-12">
        <form onSubmit={submit} className="reveal w-full space-y-4">
          <h3 className="font-display text-3xl font-bold text-navy">Send us an enquiry</h3>
          <p className="pb-2 text-sm text-muted-foreground">We'll get back to you within one business day.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required className={input} placeholder="Rahul" aria-label="First name" />
            <input required className={input} placeholder="Sharma" aria-label="Last name" />
          </div>
          <input required type="email" className={input} placeholder="rahul@company.com" aria-label="Email" />
          <select required defaultValue="" className={input} aria-label="Service">
            <option value="" disabled>Select a service</option>
            {SERVICES.map(([t]) => <option key={t}>{t}</option>)}
            <option>Full-Service Partnership</option>
          </select>
          <textarea required rows={5} className={input} placeholder="Tell us about your project, goals and budget (₹)…" aria-label="Project description" />
          <Button type="submit" disabled={sending} className="h-auto w-full rounded-xl bg-navy py-4 font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-electric hover:shadow-blue disabled:opacity-60">
            {sending ? "Sending…" : "Send Enquiry →"}
          </Button>
        </form>
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
      <Marquee />
      <Impact />
      <Services />
      <Why />
      <Contact />
      <Footer />
    </main>
  );
}
