import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, MotionConfig, useInView, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { CapabilityScene } from "@/components/capability-scenes";

type Capability = { icon: LucideIcon; title: string; text: string };

const AUTO_ADVANCE_MS = 5000;

/**
 * Interactive capability showcase: a numbered list on one side and a stage on
 * the other that plays a small animated scene for the selected capability.
 * It advances on its own while in view, and pauses while the visitor is
 * hovering or keyboard-focused inside it.
 */
export function CapabilityShowcase({ capabilities }: { capabilities: Capability[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-120px" });
  const reducedMotion = useReducedMotion();
  const autoplay = inView && !paused && !reducedMotion;

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % capabilities.length), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, active, capabilities.length]);

  const current = capabilities[active] ?? capabilities[0];
  if (!current) return null;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        ref={rootRef}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-14 grid max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14"
      >
        {/* Stage */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-navy lg:order-2"
          style={{
            // Scenes are drawn with the old blue tokens; inside the stage they resolve to slate and near-white so only navy, gold and white show.
            "--electric": "color-mix(in oklab, var(--navy) 55%, white)",
            "--sky": "color-mix(in oklab, white 84%, var(--navy))",
            backgroundImage:
              "radial-gradient(70% 80% at 100% 0%, color-mix(in oklab, var(--gold) 20%, transparent), transparent 70%), radial-gradient(60% 70% at 0% 100%, color-mix(in oklab, white 8%, transparent), transparent 70%)",
            boxShadow: "0 30px 70px -30px color-mix(in oklab, var(--navy) 70%, transparent)",
          } as CSSProperties}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(color-mix(in oklab, white 16%, transparent) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              className="absolute inset-0 p-4 sm:p-8"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <CapabilityScene title={current.title} icon={current.icon} />
            </motion.div>
          </AnimatePresence>
          <p className="absolute left-5 top-4 text-xs font-semibold tabular-nums tracking-widest text-white/50 sm:left-7 sm:top-6">
            {String(active + 1).padStart(2, "0")} <span className="text-white/25">/ {String(capabilities.length).padStart(2, "0")}</span>
          </p>
          <p aria-live="polite" className="absolute bottom-6 left-7 text-sm font-medium text-white/80 max-sm:sr-only">{current.title}</p>
        </div>

        {/* List */}
        <ul className="lg:order-1">
          {capabilities.map(({ icon: Icon, title, text }, index) => {
            const selected = index === active;
            return (
              <li key={title} className="relative border-b border-navy/10 last:border-b-0">
                <button
                  type="button"
                  aria-expanded={selected}
                  onClick={() => setActive(index)}
                  onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(index); }}
                  className="group flex w-full items-start gap-4 py-4 pl-5 pr-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-navy"
                >
                  <span className={`mt-1 text-xs font-semibold tabular-nums tracking-widest transition-colors ${selected ? "text-navy" : "text-navy/45"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`flex items-center gap-3 text-lg font-medium transition-colors sm:text-xl ${selected ? "text-navy" : "text-navy/55 group-hover:text-navy"}`}>
                      {title}
                      <Icon className={`size-5 shrink-0 transition-all duration-300 ${selected ? "translate-x-0 text-gold opacity-100" : "-translate-x-2 opacity-0"}`} />
                    </span>
                    <AnimatePresence initial={false}>
                      {selected && (
                        <motion.span
                          className="block overflow-hidden text-sm leading-relaxed text-muted-foreground"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <span className="block max-w-md pt-2">{text}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>

                {/* Left rail: fills over the auto-advance interval for the active item */}
                <span aria-hidden className="absolute inset-y-3 left-0 w-0.5 overflow-hidden rounded-full bg-navy/10">
                  {selected && (
                    <motion.span
                      key={`${active}-${autoplay}`}
                      className="block size-full origin-top bg-gold"
                      initial={{ scaleY: autoplay ? 0 : 1 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: autoplay ? AUTO_ADVANCE_MS / 1000 : 0, ease: "linear" }}
                    />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </MotionConfig>
  );
}
