import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronDown, RotateCw, type LucideIcon } from "lucide-react";

export type Capability = { icon: LucideIcon; title: string; text: string };

const EASE = [0.22, 1, 0.36, 1] as const;
const num = (i: number) => String(i + 1).padStart(2, "0");

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const riseVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/* ════════════════════════════════════════════════════════════════════════════
   1. 3D TILT — Digital & Technology
   The card leans toward the cursor. Icon, title and text sit on separate
   depth layers, and a soft glare follows the pointer.
   ════════════════════════════════════════════════════════════════════════════ */

function TiltCard({ icon: Icon, title, text, index }: Capability & { index: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 220, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [11, -11]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-13, 13]), spring);
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(380px circle at ${glareX} ${glareY}, color-mix(in oklab, white 20%, transparent), transparent 60%)`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div variants={riseVariants} className="[perspective:1100px]">
      <motion.article
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full rounded-3xl bg-navy p-7 text-primary-foreground shadow-xl shadow-navy/25 transition-shadow duration-300 hover:shadow-2xl hover:shadow-navy/40"
      >
        {/* backdrop + glare stay flat on the card surface */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-3xl"
          style={{
            backgroundImage:
              "radial-gradient(70% 80% at 100% 0%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 70%)",
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
        <div aria-hidden className="absolute inset-0 rounded-3xl border border-white/10" />

        {/* depth layers */}
        <div className="relative flex items-start justify-between" style={{ transform: "translateZ(60px)" }}>
          <span className="shadow-gold grid size-14 place-items-center rounded-2xl bg-gold text-navy">
            <Icon className="size-7" strokeWidth={2} />
          </span>
          <span className="text-sm font-semibold tabular-nums tracking-widest text-white/35">{num(index)}</span>
        </div>
        <h3 className="relative mt-7 text-xl font-semibold" style={{ transform: "translateZ(42px)" }}>
          {title}
        </h3>
        <p className="relative mt-2 text-sm leading-relaxed text-white/70" style={{ transform: "translateZ(24px)" }}>
          {text}
        </p>
        <span
          className="relative mt-6 block h-0.5 w-8 rounded-full bg-gold transition-all duration-300 group-hover:w-16"
          style={{ transform: "translateZ(24px)" }}
        />
      </motion.article>
    </motion.div>
  );
}

export function CapabilityTilt({ capabilities }: { capabilities: Capability[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {capabilities.map((cap, i) => (
          <TiltCard key={cap.title} {...cap} index={i} />
        ))}
      </motion.div>
    </MotionConfig>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   2. CINEMATIC EXPANDING PANELS — Film, Video & Photography
   A film strip of six frames. The active frame widens to show the scene;
   the rest narrow to a vertical title. Becomes an accordion on small screens.
   ════════════════════════════════════════════════════════════════════════════ */

const sprockets = {
  backgroundImage:
    "repeating-linear-gradient(90deg, color-mix(in oklab, white 30%, transparent) 0 12px, transparent 12px 28px)",
};

export function CapabilityPanels({ capabilities }: { capabilities: Capability[] }) {
  const [active, setActive] = useState(0);

  return (
    <motion.div
      className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-4 py-5 shadow-2xl shadow-navy/30 sm:px-6"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div aria-hidden className="mx-2 h-2.5 rounded-sm" style={sprockets} />

      {/* Desktop: horizontal expanding frames */}
      <div className="my-4 hidden h-[26rem] gap-2 lg:flex">
        {capabilities.map(({ icon: Icon, title, text }, i) => {
          const on = i === active;
          return (
            <div
              key={title}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`relative min-w-0 basis-0 cursor-pointer overflow-hidden rounded-xl border outline-none transition-[flex-grow,border-color,background-color] duration-700 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-2 focus-visible:ring-gold motion-reduce:transition-none ${
                on ? "grow-[6] border-gold/60 bg-navy" : "grow border-white/10 bg-white/[0.04]"
              }`}
              style={
                on
                  ? {
                      backgroundImage:
                        "radial-gradient(80% 70% at 100% 0%, color-mix(in oklab, var(--gold) 26%, transparent), transparent 70%)",
                    }
                  : undefined
              }
            >
              {/* narrow state */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between py-6 transition-opacity duration-300 ${
                  on ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="text-xs font-semibold tabular-nums tracking-widest text-gold">{num(i)}</span>
                <span className="rotate-180 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.25em] text-white/75 [writing-mode:vertical-rl]">
                  {title}
                </span>
                <Icon className="size-5 text-white/50" strokeWidth={1.8} />
              </div>

              {/* wide state — fixed width so text doesn't reflow while the frame opens */}
              <div
                className={`absolute inset-y-0 left-0 flex w-[26rem] flex-col justify-between p-8 transition-opacity duration-500 ${
                  on ? "opacity-100 delay-200" : "pointer-events-none opacity-0"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-navy">
                    Scene {num(i)}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
                    <span className="size-1.5 animate-pulse rounded-full bg-red-500" /> Rec
                  </span>
                </div>
                <div>
                  <span className="grid size-14 place-items-center rounded-2xl bg-gold text-navy">
                    <Icon className="size-7" strokeWidth={2} />
                  </span>
                  <h3 className="mt-6 font-display text-3xl font-bold text-white">{title}</h3>
                  <p className="mt-3 max-w-sm leading-relaxed text-white/70">{text}</p>
                  <span className="mt-6 block h-0.5 w-16 rounded-full bg-gold" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile / tablet: accordion */}
      <div className="my-4 space-y-2 lg:hidden">
        {capabilities.map(({ icon: Icon, title, text }, i) => {
          const on = i === active;
          return (
            <div
              key={title}
              className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
                on ? "border-gold/60 bg-navy" : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setActive(i)}
                className="flex w-full items-center gap-4 px-4 py-4 text-left"
              >
                <span className="text-xs font-semibold tabular-nums tracking-widest text-gold">{num(i)}</span>
                <Icon className={`size-5 shrink-0 ${on ? "text-gold" : "text-white/55"}`} strokeWidth={1.8} />
                <span className="flex-1 font-semibold text-white">{title}</span>
                <ChevronDown className={`size-4 text-white/50 transition-transform duration-300 ${on ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-500 ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <p className="overflow-hidden px-4 text-sm leading-relaxed text-white/70">
                  <span className="block pb-5">{text}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div aria-hidden className="mx-2 h-2.5 rounded-sm" style={sprockets} />
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   3. 3D FLIP CARDS — Animation & Content
   Cards swing in one after another, then rotate 180° on hover (or tap) to a
   gold back face holding the description.
   ════════════════════════════════════════════════════════════════════════════ */

const flipInVariants = {
  hidden: { opacity: 0, rotateY: -80 },
  visible: { opacity: 1, rotateY: 0, transition: { duration: 0.7, ease: EASE } },
};

function FlipCard({ icon: Icon, title, text, index }: Capability & { index: number }) {
  const [flipped, setFlipped] = useState(false);
  const face = "absolute inset-0 flex flex-col rounded-3xl p-7 [backface-visibility:hidden]";
  return (
    <motion.div variants={flipInVariants} style={{ transformPerspective: 1200 }} className="[perspective:1200px]">
      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((v) => !v)}
        onMouseLeave={() => setFlipped(false)}
        className="group block h-64 w-full rounded-3xl text-left outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
      >
        <span
          className={`relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] motion-reduce:transition-none ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* front */}
          <span className={`${face} border border-navy/10 bg-white shadow-lg shadow-navy/10`}>
            <span className="flex items-start justify-between">
              <span className="grid size-16 place-items-center rounded-2xl bg-navy text-gold">
                <Icon className="size-8" strokeWidth={1.8} />
              </span>
              <span className="font-display text-4xl font-bold text-navy/10">{num(index)}</span>
            </span>
            <span className="mt-auto block text-xl font-semibold text-navy">{title}</span>
            <span className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-navy/45">
              <RotateCw className="size-3.5" /> Flip
            </span>
          </span>
          {/* back */}
          <span className={`${face} justify-center bg-gold text-navy shadow-gold [transform:rotateY(180deg)]`}>
            <Icon className="size-7" strokeWidth={2} />
            <span className="mt-4 block text-lg font-bold">{title}</span>
            <span className="mt-2 block text-sm leading-relaxed text-navy/80">{text}</span>
            <span className="mt-5 block h-0.5 w-12 rounded-full bg-navy" />
          </span>
        </span>
      </button>
    </motion.div>
  );
}

export function CapabilityFlip({ capabilities }: { capabilities: Capability[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {capabilities.map((cap, i) => (
          <FlipCard key={cap.title} {...cap} index={i} />
        ))}
      </motion.div>
    </MotionConfig>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   4. STACKING PAGES — Content & Localization
   Each card sticks below the header and the next slides up on top of it,
   slightly offset, like pages in a book. Every page carries a letter from a
   different script.
   ════════════════════════════════════════════════════════════════════════════ */

const GLYPHS = ["A", "अ", "ع", "文", "Я", "あ"];

function StackCard({
  cap,
  index,
  total,
  progress,
}: {
  cap: Capability;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { icon: Icon, title, text } = cap;
  const reduce = useReducedMotion();
  // Pages already in the stack shrink a little as later ones land on top.
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * 0.035]);
  const dark = index % 2 === 1;
  return (
    <div className="sticky" style={{ top: `calc(6.5rem + ${index * 14}px)` }}>
      <motion.article
        style={{ scale: reduce ? 1 : scale, transformOrigin: "top center" }}
        className={`relative flex min-h-56 items-center gap-6 overflow-hidden rounded-3xl border p-7 shadow-[0_-10px_40px_-18px_rgb(0_0_0/0.35)] sm:gap-9 sm:p-10 ${
          dark ? "border-white/10 bg-navy text-primary-foreground" : "border-navy/10 bg-white text-navy"
        }`}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute -right-2 -bottom-10 select-none text-[11rem] font-bold leading-none sm:text-[14rem] ${
            dark ? "text-gold/15" : "text-gold/25"
          }`}
        >
          {GLYPHS[index % GLYPHS.length]}
        </span>
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gold text-navy sm:size-16">
          <Icon className="size-7 sm:size-8" strokeWidth={2} />
        </span>
        <div className="relative max-w-xl">
          <p className={`text-xs font-semibold tabular-nums tracking-[0.25em] ${dark ? "text-white/45" : "text-navy/45"}`}>
            {num(index)} / {String(total).padStart(2, "0")}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{title}</h3>
          <p className={`mt-3 leading-relaxed ${dark ? "text-white/70" : "text-muted-foreground"}`}>{text}</p>
        </div>
      </motion.article>
    </div>
  );
}

export function CapabilityStack({ capabilities }: { capabilities: Capability[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className="mx-auto mt-14 max-w-4xl space-y-8 pb-6">
      {capabilities.map((cap, i) => (
        <StackCard key={cap.title} cap={cap} index={i} total={capabilities.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   5. BENTO GRID WITH LIVE MINI-CHARTS — Strategy & Analytics
   Uneven tiles, each with a small animated data graphic that plays when the
   grid scrolls into view.
   ════════════════════════════════════════════════════════════════════════════ */

const inView = { initial: "hidden", whileInView: "visible", viewport: { once: true } } as const;

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!seen || !ref.current) return;
    const node = ref.current;
    if (reduce) {
      node.textContent = to.toLocaleString();
      return;
    }
    const controls = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => (node.textContent = Math.round(v).toLocaleString()),
    });
    return () => controls.stop();
  }, [seen, to, reduce]);
  return <span ref={ref} className="tabular-nums">0</span>;
}

/** Radar target: rings draw in, a sweep rotates, the bullseye pulses. */
function TargetViz() {
  return (
    <motion.svg viewBox="0 0 200 200" className="h-full max-h-56 w-auto" {...inView} aria-hidden>
      {[90, 62, 34].map((r, i) => (
        <motion.circle
          key={r}
          cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth="1.5"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 1.1, delay: i * 0.2 } } }}
        />
      ))}
      <path d="M100 4v192M4 100h192" stroke="currentColor" strokeOpacity={0.12} />
      <motion.g
        style={{ transformOrigin: "100px 100px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <path d="M100 100 L100 10 A90 90 0 0 1 163.6 36.4 Z" fill="var(--gold)" fillOpacity={0.22} />
        <path d="M100 100 L100 10" stroke="var(--gold)" strokeWidth="2" />
      </motion.g>
      {[[140, 62], [58, 128], [128, 142]].map(([x, y], i) => (
        <motion.circle
          key={i} cx={x} cy={y} r="4" fill="var(--gold)"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}
      <motion.circle
        cx="100" cy="100" r="8" fill="var(--gold)"
        style={{ transformOrigin: "100px 100px" }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  );
}

/** Line chart that draws itself, with a counter above it. */
function LineViz() {
  const line = "M0 62 C22 58 30 40 52 44 S86 60 104 34 S140 30 158 16 S186 14 200 6";
  return (
    <div className="flex h-full flex-col justify-end">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">Sessions</p>
      <p className="text-2xl font-bold"><Counter to={12480} /></p>
      <motion.svg viewBox="0 0 200 70" preserveAspectRatio="none" className="mt-2 h-16 w-full overflow-visible" {...inView} aria-hidden>
        <motion.path
          d={`${line} V70 H0 Z`} fill="var(--gold)"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.16, transition: { duration: 1, delay: 1 } } }}
        />
        <motion.path
          d={line} fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 1.8, ease: "easeInOut" } } }}
        />
      </motion.svg>
    </div>
  );
}

/** Three connected tags firing in sequence. */
function TagsViz() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="h-px w-3 bg-current opacity-30" />}
          <motion.span
            className="grid size-8 place-items-center rounded-lg border border-current/25 text-[10px] font-bold"
            animate={{ backgroundColor: ["rgba(0,0,0,0)", "var(--gold)", "rgba(0,0,0,0)"] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6, times: [0, 0.25, 0.6] }}
          >
            {"</>"[i]}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/** Bars growing from the baseline. */
function BarsViz() {
  const bars = [38, 62, 46, 84, 70, 100];
  return (
    <motion.div className="flex h-14 items-end gap-1.5" {...inView} aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className={`w-3 origin-bottom rounded-t-sm ${i === bars.length - 1 ? "bg-navy" : "bg-navy/35"}`}
          style={{ height: `${h}%` }}
          variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: { duration: 0.7, delay: 0.2 + i * 0.1, ease: EASE } } }}
        />
      ))}
    </motion.div>
  );
}

/** Donut drawing in beside report lines. */
function ReportViz() {
  return (
    <motion.div className="flex items-center gap-4" {...inView} aria-hidden>
      <svg viewBox="0 0 60 60" className="size-16 -rotate-90">
        <circle cx="30" cy="30" r="24" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth="8" />
        <motion.circle
          cx="30" cy="30" r="24" fill="none" stroke="var(--gold)" strokeWidth="8" strokeLinecap="round"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 0.72, transition: { duration: 1.6, ease: "easeOut", delay: 0.3 } } }}
        />
      </svg>
      <div className="w-20 space-y-2">
        {[100, 72, 88].map((w, i) => (
          <motion.span
            key={i}
            className="block h-1.5 origin-left rounded-full bg-current opacity-30"
            style={{ width: `${w}%` }}
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.6, delay: 0.5 + i * 0.15 } } }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/** Checklist ticking itself off. */
function ChecklistViz() {
  return (
    <motion.div className="w-28 space-y-2.5" {...inView} aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" className="size-5 shrink-0">
            <rect x="1" y="1" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth="1.5" />
            <motion.path
              d="M5.5 10.5l3 3 6-7" fill="none" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
              variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 0.4, delay: 0.6 + i * 0.5 } } }}
            />
          </svg>
          <span className="h-1.5 flex-1 rounded-full bg-current opacity-25" />
        </div>
      ))}
    </motion.div>
  );
}

const BENTO: { span: string; tone: string; viz: () => ReactNode }[] = [
  { span: "sm:col-span-2 lg:row-span-2", tone: "bg-navy text-primary-foreground border-white/10", viz: TargetViz },
  { span: "sm:col-span-2", tone: "bg-white text-navy border-navy/10", viz: LineViz },
  { span: "", tone: "bg-white text-navy border-navy/10", viz: TagsViz },
  { span: "", tone: "bg-gold text-navy border-transparent", viz: BarsViz },
  { span: "sm:col-span-2", tone: "bg-white text-navy border-navy/10", viz: ReportViz },
  { span: "sm:col-span-2", tone: "bg-navy text-primary-foreground border-white/10", viz: ChecklistViz },
];

export function CapabilityBento({ capabilities }: { capabilities: Capability[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:auto-rows-[13.5rem] lg:grid-cols-4"
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {capabilities.map(({ icon: Icon, title, text }, i) => {
          const { span, tone, viz: Viz } = BENTO[i % BENTO.length]!;
          const hero = i % BENTO.length === 0;
          const wide = span.includes("col-span-2") && !hero;
          const onDark = tone.includes("bg-navy");
          const muted = onDark ? "text-white/70" : tone.includes("bg-gold") ? "text-navy/75" : "text-muted-foreground";
          return (
            <motion.article
              key={title}
              variants={riseVariants}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 22 } }}
              className={`group relative flex overflow-hidden rounded-3xl border p-6 shadow-lg shadow-navy/10 ${span} ${tone} ${
                hero ? "flex-col" : wide ? "items-stretch gap-5" : "flex-col"
              }`}
            >
              {hero ? (
                <>
                  <div className="flex min-h-40 flex-1 items-center justify-center text-white">
                    <Viz />
                  </div>
                  <div className="mt-4">
                    <span className="grid size-11 place-items-center rounded-xl bg-gold text-navy"><Icon className="size-5" strokeWidth={2.2} /></span>
                    <h3 className="mt-4 font-display text-2xl font-bold">{title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{text}</p>
                  </div>
                </>
              ) : wide ? (
                <>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className={`grid size-10 place-items-center rounded-xl ${onDark ? "bg-gold text-navy" : "bg-navy text-gold"}`}>
                      <Icon className="size-5" strokeWidth={2.2} />
                    </span>
                    <h3 className="mt-auto pt-4 text-lg font-semibold">{title}</h3>
                    <p className={`mt-1.5 text-sm leading-relaxed ${muted}`}>{text}</p>
                  </div>
                  <div className="flex w-36 shrink-0 items-center justify-center sm:w-44">
                    <div className="w-full"><Viz /></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone.includes("bg-gold") ? "bg-navy text-gold" : "bg-navy text-gold"}`}>
                      <Icon className="size-5" strokeWidth={2.2} />
                    </span>
                    <Viz />
                  </div>
                  <h3 className="mt-auto pt-4 text-lg font-semibold">{title}</h3>
                  <p className={`mt-1.5 text-sm leading-snug ${muted}`}>{text}</p>
                </>
              )}
            </motion.article>
          );
        })}
      </motion.div>
    </MotionConfig>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   6. GLOW-BORDER SPOTLIGHT — AI & Automation
   Dark glass cards. A gold light follows the cursor across the whole grid and
   lights the borders of nearby cards; the hovered card gets a slowly rotating
   gradient edge.
   ════════════════════════════════════════════════════════════════════════════ */

export type GlowItem = { title: string; text: string; tags: string; image: string };

export function GlowGrid({ items }: { items: GlowItem[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  function track(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    gridRef.current?.querySelectorAll<HTMLElement>("[data-glow]").forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  }
  function clear() {
    gridRef.current?.querySelectorAll<HTMLElement>("[data-glow]").forEach((card) => {
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-navy px-5 py-10 sm:px-10 sm:py-14"
        style={{
          backgroundImage:
            "radial-gradient(60% 70% at 100% 0%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 70%), radial-gradient(50% 60% at 0% 100%, color-mix(in oklab, white 8%, transparent), transparent 70%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(color-mix(in oklab, white 16%, transparent) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent)",
            WebkitMaskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent)",
          }}
        />
        <motion.div
          ref={gridRef}
          onPointerMove={track}
          onPointerLeave={clear}
          className="relative grid gap-5 md:grid-cols-2"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {items.map((item, i) => (
            <motion.article
              key={item.title}
              data-glow
              variants={riseVariants}
              className="group relative overflow-hidden rounded-3xl p-px"
              style={{
                // static gold hairline on touch devices, pointer-lit border with a mouse
                background:
                  "radial-gradient(420px circle at var(--mx, -999px) var(--my, -999px), color-mix(in oklab, var(--gold) 95%, transparent), transparent 60%), color-mix(in oklab, var(--gold) 22%, color-mix(in oklab, white 10%, transparent))",
              }}
            >
              {/* rotating gradient edge on the hovered card */}
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              >
                <span
                  className="block size-full animate-spin [animation-duration:5s] motion-reduce:animate-none"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0 62%, var(--gold) 80%, white 88%, transparent 96%)",
                  }}
                />
              </span>

              <div
                className="relative flex h-full flex-col overflow-hidden rounded-[23px] sm:flex-row"
                style={{ background: "color-mix(in oklab, var(--navy) 92%, white)" }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10"
                  style={{
                    background:
                      "radial-gradient(480px circle at var(--mx, -999px) var(--my, -999px), color-mix(in oklab, var(--gold) 13%, transparent), transparent 65%)",
                  }}
                />
                <div className="relative aspect-[16/10] shrink-0 overflow-hidden sm:aspect-auto sm:w-2/5">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent sm:bg-gradient-to-l" />
                </div>
                <div className="relative flex flex-1 flex-col p-6 sm:p-7">
                  <span className="text-sm font-semibold tabular-nums tracking-widest text-white/30 transition-colors duration-300 group-hover:text-gold">
                    {num(i)}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{item.text}</p>
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {item.tags.split(" • ").map((tag) => (
                      <li key={tag} className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs font-medium text-white/75">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </MotionConfig>
  );
}
