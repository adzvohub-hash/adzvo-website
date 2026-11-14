import { useRef, type PointerEvent } from "react";
import { motion, MotionConfig } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Capability = { icon: LucideIcon; title: string; text: string };

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

/**
 * Dark "spotlight" capability grid.
 * A soft glow follows the pointer across the whole grid: every card reads the
 * pointer position relative to itself (--mx / --my), so borders of neighbouring
 * cards light up too as the cursor passes between them.
 */
export function CapabilitySpotlight({ capabilities }: { capabilities: Capability[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  function trackPointer(event: PointerEvent<HTMLDivElement>) {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-spot-card]");
    cards?.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  }

  function clearPointer() {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-spot-card]");
    cards?.forEach((card) => {
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
    });
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative mx-auto mt-14 max-w-6xl overflow-hidden rounded-[2rem] bg-navy px-5 py-10 sm:px-10 sm:py-14"
        style={{
          backgroundImage:
            "radial-gradient(60% 70% at 100% 0%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 70%), radial-gradient(50% 60% at 0% 100%, color-mix(in oklab, white 8%, transparent), transparent 70%)",
        }}
      >
        {/* Faint dot grid so the panel has texture even without a pointer */}
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
          onPointerMove={trackPointer}
          onPointerLeave={clearPointer}
          className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {capabilities.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              data-spot-card
              variants={cardVariants}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 22 } }}
              className="group relative rounded-2xl p-px"
              style={{
                // 1px gradient border: bright where the pointer is, hairline elsewhere
                background:
                  "radial-gradient(340px circle at var(--mx, -999px) var(--my, -999px), color-mix(in oklab, var(--gold) 95%, transparent), transparent 60%), color-mix(in oklab, white 12%, transparent)",
              }}
            >
              <div
                className="relative h-full overflow-hidden rounded-[15px] p-6 sm:p-7"
                style={{ background: "color-mix(in oklab, var(--navy) 90%, white)" }}
              >
                {/* Inner glow that follows the pointer */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(420px circle at var(--mx, -999px) var(--my, -999px), color-mix(in oklab, var(--gold) 13%, transparent), transparent 65%)",
                  }}
                />

                <div className="relative flex items-start justify-between">
                  <span
                    className="grid size-12 place-items-center rounded-xl bg-gold text-navy transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  >
                    <Icon className="size-6" strokeWidth={2.2} />
                  </span>
                  <span className="text-sm font-semibold tabular-nums tracking-widest text-white/30 transition-colors duration-300 group-hover:text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative mt-6 text-lg font-semibold text-white">{title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/65">{text}</p>
                <span className="relative mt-5 block h-0.5 w-8 rounded-full bg-gold transition-all duration-300 group-hover:w-16" />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </MotionConfig>
  );
}
