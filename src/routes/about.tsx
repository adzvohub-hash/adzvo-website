/**
 * ADZVO — About Page (v4 redesign)
 *
 * Layout: a split "story" — readable text chapters on the left, a sticky
 * framed 3D stage on the right. Text and animation never overlap, so the
 * copy stays the primary read and the animation illustrates it.
 *
 * The animation is one continuous marble run that mirrors the chapters:
 *   01 The brief  → ball drops in
 *   02 Explore    → plinko board (testing every angle)
 *   03 Shape      → helix (refined turn by turn)
 *   04 Align      → rings (checked against goals)
 *   05 Deliver    → lands on the platform
 *
 * Only dependency: `three` (loaded dynamically, so the page still renders
 * all of its text if WebGL or the package is unavailable).
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassButton } from "@/components/glass-button";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowDown, ArrowRight, Check, Eye, Handshake, Target } from "lucide-react";
import { Footer } from "@/components/site-footer";
/* Faint, colour-washed photos behind each chapter (desktop backdrop). Swap any of these for your own images. */
import skyImg0 from "@/assets/about-hero.jpg";
import skyImg1 from "@/assets/insights-hero.jpg";
import skyImg2 from "@/assets/film-behind-scenes.jpg";
import skyImg3 from "@/assets/contact.jpg";
import skyImg4 from "@/assets/projects-hero.jpg";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";

/* ─── Route ──────────────────────────────────────────────────────────── */
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

/* ─── Content ────────────────────────────────────────────────────────── */
const CHAPTERS = [
  { step: "The brief", caption: "Every project starts with a single idea." },
  { step: "Explore",   caption: "We test every angle before choosing a path." },
  { step: "Shape",     caption: "Strategy and craft refine it, turn by turn." },
  { step: "Align",     caption: "Each stage is checked against your goals." },
  { step: "Deliver",   caption: "It lands — on brand, with real impact." },
];

const LENSES = [
  { title: "The brand",         text: "Who you are and how you should feel." },
  { title: "The audience",      text: "Who you need to reach, and where." },
  { title: "The message",       text: "What needs to be said, clearly." },
  { title: "The business goal", text: "What success actually looks like." },
];

const CAPABILITIES = ["Brand identity", "Content", "Websites & apps", "Campaigns", "Film production", "AI-enabled solutions"];

const PILLARS = [
  { icon: Target,    label: "Our Mission", text: "To help brands communicate with clarity and grow with confidence by combining creative thinking, digital capability and purposeful technology." },
  { icon: Eye,       label: "Our Vision",  text: "To become a trusted creative and digital partner for businesses looking to build meaningful brands, experiences and lasting connections." },
  { icon: Handshake, label: "Our Promise", text: "Thoughtful strategy. Relevant creativity. Reliable execution. Every project begins with listening and stays focused on what matters to the client." },
];

const APPROACH = [
  { title: "We listen first", text: "Every brief starts with understanding your story, audience and ambition." },
  { title: "We build around you", text: "A solution shaped to what you need — never a one-size-fits-all package." },
  { title: "We keep it clear", text: "Considered, transparent collaboration from the first conversation to delivery." },
];

/* Subtitle shown with each step on the phone/tablet timeline (desktop shows it in the chapter tag). */
const STEP_SUBTITLES = ["", "What we do", "What guides us", "How we work with you", "The result"];

/* Fade-up when a block scrolls into view (class added by IntersectionObserver). */
const REVEAL = "opacity-0 translate-y-6 transition-all duration-700 ease-out [&.is-in]:opacity-100 [&.is-in]:translate-y-0";

/* ─── Page ───────────────────────────────────────────────────────────── */
function AboutPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const journey = useRef(0);
  const [active, setActive] = useState(0);
  const [glReady, setGlReady] = useState(false);

  /* Reveal-on-scroll */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Liquid-glass sheen follows the pointer across any glass surface */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(".lg-glass") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* Scroll position → journey value J in [0, 5] (chapter index + progress through it) */
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const read = () => {
      const vh = window.innerHeight;
      let j = CHAPTERS.length;
      const story = storyRef.current;
      if (window.innerWidth >= 1024 && story) {
        // Desktop: text and animation are both pinned; progress = how far through the story we've scrolled.
        const r = story.getBoundingClientRect();
        const span = Math.max(1, r.height - vh);
        j = Math.min(1, Math.max(0, -r.top / span)) * CHAPTERS.length;
      } else {
        // Mobile: chapters scroll normally under the sticky animation band.
        const mid = vh * 0.5;
        const els = chapterRefs.current;
        for (let i = 0; i < els.length; i++) {
          const el = els[i];
          if (!el) continue;
          const r = el.getBoundingClientRect();
          if (mid < r.top) { j = i; break; }
          if (mid <= r.bottom) { j = i + (mid - r.top) / r.height; break; }
        }
      }
      journey.current = j;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${Math.min(1, j / CHAPTERS.length)})`;
      const idx = Math.min(CHAPTERS.length - 1, Math.floor(j));
      // background word drifts slowly through each chapter (0 → 1)
      skyRef.current?.style.setProperty("--about-drift", String(Math.min(1, Math.max(0, j - idx)).toFixed(3)));
      if (idx !== last) { last = idx; setActive(idx); }
      raf = requestAnimationFrame(read);
    };
    raf = requestAnimationFrame(read);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* 3D marble run */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    let started = false;
    // Phones and tablets get the simple timeline layout: the 3D code isn't even downloaded there.
    const mq = window.matchMedia("(min-width: 1024px)");
    const start = () => {
      if (started || !mq.matches) return;
      started = true;
      import("three")
        .then((mod) => {
          if (cancelled) return;
          cleanup = buildScene(mod, canvas, journey);
          setGlReady(true);
        })
        .catch((err) => console.error("About page 3D stage failed to load:", err));
    };
    start();
    mq.addEventListener("change", start);

    return () => { cancelled = true; mq.removeEventListener("change", start); cleanup?.(); };
  }, []);

  const chapter = CHAPTERS[active] ?? CHAPTERS[0]!;
  const setChapterRef = (i: number) => (el: HTMLElement | null) => { chapterRefs.current[i] = el; };

  return (
    <main className="about-page relative text-navy">
      <div ref={storyRef} className="relative">

        {/* ── STAGE: centred animation, pinned while the story scrolls ── */}
        <div className="about-bg hidden lg:sticky lg:top-0 lg:z-0 lg:block lg:h-screen">
          <div className="about-bg relative h-full overflow-hidden">
            {/* creative backdrop: colour + giant outlined word that change per chapter (behind the 3D) */}
            <AboutSky active={active} skyRef={skyRef} />
            <canvas
              ref={canvasRef}
              aria-hidden
              className={`about-canvas absolute inset-0 h-full w-full transition-opacity duration-1000 ${glReady ? "opacity-100" : "opacity-0"}`}
            />
            {/* soft white fade at top/bottom so it melts into the page */}
            <div aria-hidden className="about-stage-fade pointer-events-none absolute inset-0" />

            {/* caption + stepper, centred under the animation */}
            <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-md px-4 pb-4 text-center lg:pb-7">
              <div key={active} className="animate-[stageCaption_600ms_ease-out]">
                <p className="font-display text-base font-bold uppercase tracking-wider sm:text-xl">{chapter.step}</p>
                <p className="mt-0.5 hidden text-sm text-navy/60 sm:block">{chapter.caption}</p>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {CHAPTERS.map((c, i) => (
                  <div key={c.step} className={`h-1 rounded-full transition-colors duration-500 ${i <= active ? "bg-[#e5a020]" : "bg-[#0a0e1f]/10"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── STORY: heading on top, content on either side of the animation ── */}
        <div className="relative z-10 lg:-mt-[100vh]">
          {/* Desktop: this layer is pinned and chapters cross-fade inside it */}
          <div className="lg:sticky lg:top-0 lg:-mb-[100vh] lg:h-screen">

          {/* 01 · Hero */}
          <Chapter
            refCb={setChapterRef(0)}
            index={0}
            current={active === 0}
            top={<>
              <div data-reveal className={REVEAL}><SectionLabel>About ADZVO</SectionLabel></div>
              <h1 data-reveal className={`${REVEAL} font-display mt-5 text-[2rem] font-extrabold leading-[1.12] sm:text-4xl lg:text-[clamp(2rem,2.8vw,3rem)]`}>
                An advertising &amp; digital agency built around an <Highlight>integrated</Highlight> way of working.
              </h1>
            </>}
            left={<>
              <p data-reveal className={`${REVEAL} text-xl leading-relaxed text-navy/75 xl:text-2xl xl:leading-relaxed`}>
                We look beyond individual deliverables to understand the bigger picture — so every piece of work moves the whole brand forward.
              </p>
              <div data-reveal className={`${REVEAL} mt-8 hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-navy/40 lg:flex`} style={LOGO_FONT}>
                <ArrowDown className="size-4 animate-bounce" /> Scroll to follow the idea
              </div>
            </>}
            right={<>
              <p data-reveal className={`${REVEAL} text-xl leading-relaxed text-navy/75 xl:text-2xl xl:leading-relaxed`}>
                Brand, content, digital, film and AI — connected by one team and one way of thinking.
              </p>
              <div data-reveal className={`${REVEAL} mt-7 flex flex-wrap gap-3`}>
                <GlassButton as={Link} to="/contact">Work With Us <ArrowRight /></GlassButton>
                <GlassButton as={Link} to="/projects" variant="secondary">See Our Projects</GlassButton>
              </div>
            </>}
          />

          {/* 02 · What we do */}
          <Chapter
            refCb={setChapterRef(1)}
            index={1}
            current={active === 1}
            top={<>
              <ChapterTag n={2} label="Explore · What we do" />
              <h2 data-reveal className={`${REVEAL} font-display mt-5 text-3xl font-extrabold leading-[1.12] sm:text-4xl lg:text-[clamp(2rem,2.8vw,3rem)]`}>
                Creativity, technology and strategy — <Highlight>together.</Highlight>
              </h2>
            </>}
            left={<>
              <p data-reveal className={`${REVEAL} text-xl leading-relaxed text-navy/75 xl:text-2xl xl:leading-relaxed`}>
                We help businesses build stronger brands, connect with the right audiences and create meaningful digital experiences.
              </p>
              <div data-reveal className={`${REVEAL} mt-7 flex flex-wrap gap-2`}>
                {CAPABILITIES.map((c) => (
                  <span key={c} className="lg-glass rounded-full px-4 py-2.5 text-base font-semibold text-navy/85">{c}</span>
                ))}
              </div>
            </>}
            right={<>
              <p data-reveal className={`${REVEAL} text-sm font-bold uppercase tracking-[0.2em] text-navy/50`} style={LOGO_FONT}>Before we act, we look at</p>
              <div className="mt-4 space-y-3">
                {LENSES.map((l, i) => (
                  <div key={l.title} data-reveal className={`${REVEAL} lg-glass flex gap-4 rounded-2xl p-4`}>
                    <span className="text-base font-bold text-[#e5a020]" style={LOGO_FONT}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-display text-lg font-bold">{l.title}</p>
                      <p className="mt-0.5 text-base leading-relaxed text-navy/65">{l.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>}
          />

          {/* 03 · What guides us */}
          <Chapter
            refCb={setChapterRef(2)}
            index={2}
            current={active === 2}
            top={<>
              <ChapterTag n={3} label="Shape · What guides us" />
              <h2 data-reveal className={`${REVEAL} font-display mt-5 text-3xl font-extrabold leading-[1.12] sm:text-4xl lg:text-[clamp(2rem,2.8vw,3rem)]`}>
                Purpose that <Highlight>shapes</Highlight> every decision.
              </h2>
            </>}
            left={<div className="space-y-4">{PILLARS.slice(0, 2).map((p) => <PillarCard key={p.label} {...p} />)}</div>}
            right={<div className="space-y-4">{PILLARS.slice(2).map((p) => <PillarCard key={p.label} {...p} />)}</div>}
          />

          {/* 04 · Client approach */}
          <Chapter
            refCb={setChapterRef(3)}
            index={3}
            current={active === 3}
            top={<>
              <ChapterTag n={4} label="Align · How we work with you" />
              <h2 data-reveal className={`${REVEAL} font-display mt-5 text-3xl font-extrabold leading-[1.12] sm:text-4xl lg:text-[clamp(2rem,2.8vw,3rem)]`}>
                Every business has a different story, audience and <Highlight>ambition.</Highlight>
              </h2>
            </>}
            left={
              <p data-reveal className={`${REVEAL} text-xl leading-relaxed text-navy/75 xl:text-2xl xl:leading-relaxed`}>
                So we take time to understand each brief, and build the solution around what you actually need — not a one-size-fits-all package.
              </p>
            }
            right={
              <ol className="space-y-5">
                {APPROACH.map((a) => (
                  <li key={a.title} data-reveal className={`${REVEAL} flex gap-4`}>
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#0a0e1f] text-[#e5a020]">
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="font-display text-xl font-bold">{a.title}</p>
                      <p className="mt-1 text-lg leading-relaxed text-navy/70">{a.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            }
          />

          {/* 05 · Deliver */}
          <Chapter
            refCb={setChapterRef(4)}
            index={4}
            current={active === 4}
            top={<>
              <ChapterTag n={5} label="Deliver · The result" />
              <h2 data-reveal className={`${REVEAL} font-display mt-5 text-3xl font-extrabold leading-[1.12] sm:text-4xl lg:text-[clamp(2rem,2.8vw,3rem)]`}>
                We turn ambitious ideas into connected brand and <Highlight>digital experiences.</Highlight>
              </h2>
            </>}
            left={
              <p data-reveal className={`${REVEAL} text-xl leading-relaxed text-navy/75 xl:text-2xl xl:leading-relaxed`}>
                Have an idea that needs to land? Let's talk about where you want to take your brand.
              </p>
            }
            right={
              <div data-reveal className={`${REVEAL} flex flex-wrap gap-3`}>
                <GlassButton as={Link} to="/contact">Get in Touch <ArrowRight /></GlassButton>
                <GlassButton as={Link} to="/" hash="services" variant="secondary">Explore Our Services</GlassButton>
              </div>
            }
          />
          </div>
          {/* Desktop scroll length that drives the story (≈ 85vh per chapter) */}
          <div aria-hidden className="hidden lg:block lg:h-[525vh]" />
        </div>
      </div>

      {/* thin overall progress line along the top of the viewport */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div ref={progressRef} className="h-full origin-left bg-[#e5a020]" style={{ transform: "scaleX(0)" }} />
      </div>

      <style>{`@keyframes stageCaption { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

      <div className="relative z-10"><Footer /></div>
    </main>
  );
}

/* Background words, one per chapter (shown behind the animation, desktop). */
const SKY_WORDS = ["Brief", "Explore", "Shape", "Align", "Deliver"];
/* One photo per chapter, in the same order as SKY_WORDS. */
const SKY_IMAGES = [skyImg0, skyImg1, skyImg2, skyImg3, skyImg4];

/** Desktop backdrop behind the 3D stage: soft colour fields + a giant outlined word, both cross-fading per chapter. */
function AboutSky({ active, skyRef }: { active: number; skyRef: RefObject<HTMLDivElement | null> }) {
  const [reached, setReached] = useState(0);
  useEffect(() => { setReached((r) => Math.max(r, active)); }, [active]);
  return (
    <div ref={skyRef} aria-hidden className="about-sky">
      {SKY_WORDS.map((w, i) => <span key={`l${w}`} className={`about-sky-layer about-sky-${i} ${i === active ? "is-on" : ""}`} />)}
      {/* photos load only as they're reached (current + next chapter), then stay */}
      {SKY_IMAGES.map((src, i) => (
        <span key={`p${i}`} className={`about-sky-photo ${i === active ? "is-on" : ""}`}>
          {i <= reached + 1 && <img src={src} alt="" decoding="async" />}
        </span>
      ))}
      <span className="about-sky-stars" />
      {SKY_WORDS.map((w, i) => <span key={w} className={`about-sky-word about-sky-word-${i} ${i === active ? "is-on" : ""}`}>{w}</span>)}
    </div>
  );
}

/**
 * One chapter: heading centred on top, then two side columns with an empty
 * centre lane that the pinned animation shows through (desktop).
 * Phones/tablets (<1024px): no animation; chapters stack along a gold timeline.
 */
function Chapter({ refCb, index, current, top, left, right }: {
  refCb: (el: HTMLElement | null) => void;
  index: number;
  current: boolean;
  top: ReactNode;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <section
      ref={refCb}
      className={`about-ch flex flex-col py-12 sm:py-14 lg:absolute lg:inset-0 lg:min-h-0 lg:pb-40 lg:pt-24 lg:transition-all lg:duration-700 lg:ease-out ${current ? "lg:translate-y-0 lg:opacity-100" : "lg:pointer-events-none lg:translate-y-6 lg:opacity-0"}`}
    >
      <div className="page-shell flex flex-1 flex-col">
        <div className="about-ch-body flex flex-1 flex-col">
          {/* phones/tablets: step marker on the timeline */}
          <p className="about-step lg:hidden" style={LOGO_FONT}>
            {CHAPTERS[index]?.step}{STEP_SUBTITLES[index] ? ` · ${STEP_SUBTITLES[index]}` : ""}
          </p>
          <div className="mx-auto w-full max-w-[880px] lg:text-center lg:[&_.chapter-tag]:justify-center">{top}</div>
          <div className="mt-8 grid flex-1 content-start items-start gap-8 sm:grid-cols-2 lg:mt-6 lg:content-normal lg:items-center lg:grid-cols-[minmax(0,1fr)_minmax(220px,21vw)_minmax(0,1fr)] lg:gap-0">
            {/* side columns hug the animation and tuck slightly over its edges */}
            <div className="relative min-w-0 lg:-mr-8 about-halo">{left}</div>
            <div aria-hidden className="hidden lg:block" />
            <div className="relative min-w-0 lg:-ml-8 about-halo">{right}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PillarCard({ icon: Icon, label, text }: (typeof PILLARS)[number]) {
  return (
    <article data-reveal className={`${REVEAL} lg-glass rounded-2xl p-5`}>
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e5a020] text-navy">
          <Icon className="size-5" strokeWidth={2.4} />
        </span>
        <h3 className="font-display text-xl font-bold">{label}</h3>
      </div>
      <p className="mt-3 text-lg leading-relaxed text-navy/70">{text}</p>
    </article>
  );
}

function ChapterTag({ label }: { n?: number; label: string }) {
  return (
    <div data-reveal className={`${REVEAL} chapter-tag flex items-center gap-3`}>
      <span className="h-px w-8 bg-[#e5a020]/70" />
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-navy/55" style={LOGO_FONT}>{label}</span>
    </div>
  );
}

/* ─── 3D scene ───────────────────────────────────────────────────────── */
/* `three` is loaded dynamically, so it is typed loosely here. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildScene(THREE: any, canvas: HTMLCanvasElement, journey: { current: number }) {
  const isDark = () => document.documentElement.classList.contains("dark");
  const BG = isDark() ? 0x0a0e1d : 0xffffff;
  const GOLD = 0xe5a020;
  const BALL_R = 0.34;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0); // transparent: the AboutSky backdrop shows through
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG, 14, 32);
  const applySceneTheme = () => {
    const c = isDark() ? 0x0a0e1d : 0xffffff;
    scene.fog = new THREE.Fog(c, 14, 32);
    hemi.groundColor = new THREE.Color(isDark() ? 0x1a2142 : 0xdfe5f2);
    hemi.intensity = isDark() ? 1.0 : 1.4;
  };
  window.addEventListener("adzvo-theme", applySceneTheme);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80);
  camera.position.set(0, 1.6, 12.5);

  /* Lights */
  const hemi = new THREE.HemisphereLight(0xffffff, 0xdfe5f2, 1.4);
  scene.add(hemi);
  applySceneTheme();
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 8, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfd0ff, 0.9);
  rim.position.set(-6, 2, -5);
  scene.add(rim);
  const ballLight = new THREE.PointLight(GOLD, 6, 5, 1.6);
  scene.add(ballLight);

  /* Ball */
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(BALL_R, 48, 48),
    new THREE.MeshPhysicalMaterial({ color: 0xf2ac22, metalness: 0.35, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15, emissive: 0x6b4300, emissiveIntensity: 0.5 }),
  );
  scene.add(ball);

  /* Dust for depth */
  {
    const N = 420;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = 9 - Math.random() * 34;
      pos[i * 3 + 2] = -1.5 - Math.random() * 7;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x9aa6c4, size: 0.04, transparent: true, opacity: 0.45 })));
  }

  /* 02 · Plinko pegs, floating — no backing plate (y 4.2 → -3) */

  const ROW_Y = [3.4, 2.2, 1.0, -0.2, -1.4, -2.6];
  const pegs: { mesh: any; glow: number }[] = [];
  const pegGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.7, 24);
  ROW_Y.forEach((y, r) => {
    const xs = r % 2 === 0 ? [-2.4, -0.8, 0.8, 2.4] : [-1.6, 0, 1.6];
    xs.forEach((x) => {
      const m = new THREE.Mesh(pegGeo, new THREE.MeshStandardMaterial({ color: 0x3b7bff, roughness: 0.3, metalness: 0.15, emissive: 0x6fa8ff, emissiveIntensity: 0 }));
      m.rotation.x = Math.PI / 2;
      m.position.set(x, y, -0.05);
      scene.add(m);
      pegs.push({ mesh: m, glow: 0 });
    });
  });
  // Path weaves through the gaps between pegs, row by row.
  const HELIX_R = 1.4;
  const HELIX_TOP = -3.6;
  const plinko = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 4.6, 0),
    new THREE.Vector3(0, 3.4, 0),
    new THREE.Vector3(0.8, 2.2, 0),
    new THREE.Vector3(0, 1.0, 0),
    new THREE.Vector3(-0.8, -0.2, 0),
    new THREE.Vector3(0, -1.4, 0),
    new THREE.Vector3(0.8, -2.6, 0),
    new THREE.Vector3(HELIX_R, HELIX_TOP, 0),
  ]);

  /* 03 · Helix (y -3.6 → -12) */
  const TURNS = 3;
  const HELIX_BOTTOM = -12;
  const hPts = [];
  for (let i = 0; i <= 300; i++) {
    const t = i / 300;
    const a = t * TURNS * Math.PI * 2;
    hPts.push(new THREE.Vector3(Math.cos(a) * HELIX_R, HELIX_TOP + (HELIX_BOTTOM - HELIX_TOP) * t, Math.sin(a) * HELIX_R));
  }
  const helix = new THREE.CatmullRomCurve3(hPts);
  const helixMat = new THREE.MeshStandardMaterial({ color: 0x3f6fe0, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.32, emissive: 0x2b5cff, emissiveIntensity: 0.08, depthWrite: false });
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(helix, 500, 0.46, 20, false), helixMat));

  /* 04 · Rings (y -13.8 → -18.2) */
  const RING_Y = [-13.8, -16, -18.2];
  const rings = RING_Y.map((y) => {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.08, 20, 96),
      new THREE.MeshStandardMaterial({ color: 0xe5a020, metalness: 0.55, roughness: 0.25, emissive: GOLD, emissiveIntensity: 0.12 }),
    );
    m.rotation.x = Math.PI / 2;
    m.position.y = y;
    scene.add(m);
    return m;
  });
  const helixEnd = helix.getPoint(1);
  const ringPath = new THREE.CatmullRomCurve3([
    helixEnd.clone(),
    new THREE.Vector3(0.7, -12.6, 0),
    new THREE.Vector3(0, -13.4, 0),
    new THREE.Vector3(0, -16, 0),
    new THREE.Vector3(0, -18.9, 0),
  ]);

  /* 05 · Platform (top at y -20.6) */
  const PLAT_TOP = -20.6;
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.4, 0.26, 80),
    new THREE.MeshStandardMaterial({ color: 0x1d2547, metalness: 0.3, roughness: 0.4 }),
  );
  platform.position.y = PLAT_TOP - 0.13;
  scene.add(platform);
  const rimMat = new THREE.MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0.4 });
  const rimRing = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.05, 12, 96), rimMat);
  rimRing.rotation.x = Math.PI / 2;
  rimRing.position.y = PLAT_TOP + 0.01;
  scene.add(rimRing);
  const rippleMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 });
  const ripple = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.035, 12, 96), rippleMat);
  ripple.rotation.x = Math.PI / 2;
  ripple.position.y = PLAT_TOP + 0.02;
  scene.add(ripple);
  const platLight = new THREE.PointLight(GOLD, 0, 7, 1.5);
  platLight.position.set(0, PLAT_TOP + 1, 1);
  scene.add(platLight);

  /* Journey state */
  const camTarget = new THREE.Vector3(0, 1.6, 12.5);
  const lookTarget = new THREE.Vector3(0, 1.2, 0);
  const look = lookTarget.clone();
  const tmp = new THREE.Vector3();
  const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
  const easeIn = (t: number) => t * t;

  let smoothJ = journey.current;
  // On desktop the chapter heading sits on top, so frame the run a little lower.
  let frameLift = 0;
  let impact = 0;

  function place(j: number, time: number) {
    const seg = Math.min(4, Math.floor(j));
    const t = clamp01(j - seg);
    ball.scale.set(1, 1, 1);
    impact = 0;

    if (seg === 0) {
      // The brief: idle hover, then drop into the board.
      const u = clamp01((t - 0.45) / 0.55);
      const bob = (1 - u) * Math.sin(time * 1.6) * 0.14;
      ball.position.set(0, 5.5 + (4.6 - 5.5) * easeIn(u) + bob, 0);
      camTarget.set(0, 1.8, 17);
      lookTarget.set(0, 1.4 + frameLift, 0);
    } else if (seg === 1) {
      plinko.getPoint(t, tmp);
      ball.position.copy(tmp);
      camTarget.set(0, tmp.y + 0.9, 16);
      lookTarget.set(0, tmp.y - 0.3 + frameLift, 0);
    } else if (seg === 2) {
      helix.getPoint(t, tmp);
      ball.position.copy(tmp);
      camTarget.set(0, tmp.y + 3.4, 14.5);
      lookTarget.set(0, tmp.y - 0.9 + frameLift, 0);
    } else if (seg === 3) {
      ringPath.getPointAt(t, tmp);
      ball.position.copy(tmp);
      camTarget.set(0, tmp.y + 3.8, 14);
      lookTarget.set(0, tmp.y - 1.3 + frameLift, 0);
    } else {
      // Deliver: fall, land, settle with damped bounces.
      const rest = PLAT_TOP + BALL_R;
      let y: number;
      if (t < 0.3) {
        y = -18.9 + (rest + 18.9) * easeIn(t / 0.3);
      } else {
        const u = (t - 0.3) / 0.7;
        const b = Math.abs(Math.sin(u * Math.PI * 3)) * 1.1 * Math.pow(1 - u, 2);
        y = rest + b;
        impact = 1 - u * 0.6;
        const contact = 1 - clamp01(b / 0.2);
        const sq = contact * 0.25 * (1 - u);
        ball.scale.set(1 + sq, 1 - sq, 1 + sq);
        y -= sq * BALL_R;
        ripple.scale.setScalar(1 + u * 3.6);
        rippleMat.opacity = (1 - u) * 0.85;
      }
      ball.position.set(0, y, 0);
      camTarget.set(0, PLAT_TOP + 3.4, 14.5);
      lookTarget.set(0, PLAT_TOP + 0.4 + frameLift, 0);
    }
    if (seg < 4 || t < 0.3) rippleMat.opacity = 0;
  }

  /* Pointer parallax */
  let px = 0;
  let pxTarget = 0;
  const onPointer = (e: PointerEvent) => { pxTarget = (e.clientX / window.innerWidth - 0.5) * 0.9; };
  window.addEventListener("pointermove", onPointer, { passive: true });

  /* Size to the stage card */
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the 6.6-wide board in frame on narrow (portrait) stages.
    camera.fov = w / h < 0.85 ? 52 : 45;
    frameLift = w >= 1024 ? 2.6 : 0;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* Pause rendering when the stage is offscreen */
  let visible = true;
  const io = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? true; });
  io.observe(canvas);

  const clock = new THREE.Clock();
  let raf = 0;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const time = clock.getElapsedTime();

    smoothJ += (journey.current - smoothJ) * 0.085;
    place(smoothJ, time);

    ball.rotation.x = smoothJ * 9;
    ball.rotation.z = smoothJ * 5;
    ballLight.position.set(ball.position.x, ball.position.y + 0.5, ball.position.z + 1.3);

    // Pegs glow when the ball passes, then fade.
    for (const p of pegs) {
      const dx = ball.position.x - p.mesh.position.x;
      const dy = ball.position.y - p.mesh.position.y;
      const hit = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 1.1);
      p.glow = Math.max(p.glow * 0.94, hit);
      // Blue pegs light up brighter blue as the ball passes, then fade back.
      p.mesh.material.emissiveIntensity = p.glow * 0.9;
    }
    // Rings light up and swell as the ball passes through.
    rings.forEach((r: any) => {
      const near = Math.max(0, 1 - Math.abs(ball.position.y - r.position.y) / 1.1);
      r.material.emissiveIntensity = 0.12 + near * 1.6;
      r.scale.setScalar(1 + near * 0.12);
      r.rotation.z += 0.004;
    });
    helixMat.opacity = 0.28 + (Math.floor(smoothJ) === 2 ? 0.1 : 0);

    rimMat.emissiveIntensity = 0.4 + impact * 1.8;
    platLight.intensity = impact * 9;

    px += (pxTarget - px) * 0.05;
    camera.position.x += (camTarget.x + px - camera.position.x) * 0.07;
    camera.position.y += (camTarget.y - camera.position.y) * 0.07;
    camera.position.z += (camTarget.z - camera.position.z) * 0.07;
    look.lerp(lookTarget, 0.09);
    camera.lookAt(look);

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("adzvo-theme", applySceneTheme);
    window.removeEventListener("pointermove", onPointer);
    ro.disconnect();
    io.disconnect();
    scene.traverse((o: any) => {
      o.geometry?.dispose?.();
      const m = o.material;
      if (Array.isArray(m)) m.forEach((x) => x.dispose?.());
      else m?.dispose?.();
    });
    renderer.dispose();
  };
}
