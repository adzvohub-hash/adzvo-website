import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Small looping SVG scenes for the capability showcase.
 * Every scene draws in a 400 x 300 viewBox and loops on its own clock, so a
 * scene simply restarts when it is mounted (the showcase re-keys it on change).
 */

const HEART = "M0 6 C-8 0 -8 -7 -3.5 -7 C-1.5 -7 0 -5.5 0 -4 C0 -5.5 1.5 -7 3.5 -7 C8 -7 8 0 0 6Z";

function Frame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 300" className="size-full" fill="none" aria-hidden>
      {children}
    </svg>
  );
}

/** Keyframed loop: all elements of one scene share the same duration. */
const loop = (duration: number, times: number[]) => ({
  duration,
  times,
  repeat: Infinity,
  ease: "easeInOut" as const,
});

// ── Social Media: a post collects reactions and followers ────────────────────
function SocialScene() {
  const hearts = [
    { x: 292, delay: 0, cls: "fill-gold", s: 1.5 },
    { x: 318, delay: 0.7, cls: "fill-sky", s: 1.1 },
    { x: 300, delay: 1.4, cls: "fill-white/70", s: 0.9 },
    { x: 330, delay: 2.1, cls: "fill-gold", s: 1.2 },
  ];
  return (
    <Frame>
      <rect x="140" y="28" width="120" height="244" rx="18" className="fill-white/5 stroke-white/25" strokeWidth="1.5" />
      <circle cx="160" cy="56" r="8" className="fill-sky" />
      <rect x="174" y="50" width="48" height="5" rx="2.5" className="fill-white/40" />
      <rect x="174" y="59" width="28" height="4" rx="2" className="fill-white/20" />
      <rect x="152" y="76" width="96" height="96" rx="10" className="fill-electric/60" />
      <circle cx="224" cy="100" r="10" className="fill-gold" />
      <path d="M152 162 L184 126 L206 148 L222 134 L248 162 V172 H152Z" className="fill-navy/50" />
      <g transform="translate(162 192)">
        <motion.path
          d={HEART}
          className="fill-gold"
          animate={{ scale: [1, 1.7, 1, 1] }}
          transition={loop(1.4, [0, 0.2, 0.45, 1])}
        />
      </g>
      <rect x="178" y="188" width="30" height="6" rx="3" className="fill-white/30" />
      <rect x="152" y="212" width="96" height="5" rx="2.5" className="fill-white/20" />
      <rect x="152" y="224" width="64" height="5" rx="2.5" className="fill-white/15" />

      {hearts.map((heart) => (
        <motion.g
          key={heart.delay}
          initial={{ x: heart.x, y: 240, opacity: 0 }}
          animate={{ y: [240, 60], opacity: [0, 1, 0], x: [heart.x, heart.x + 12, heart.x - 6] }}
          transition={{ duration: 2.8, delay: heart.delay, repeat: Infinity, ease: "easeOut" }}
        >
          <path d={HEART} className={heart.cls} transform={`scale(${heart.s})`} />
        </motion.g>
      ))}

      {[{ y: 104, delay: 0.3 }, { y: 170, delay: 1.5 }].map((chip) => (
        <motion.g
          key={chip.y}
          style={{ originX: 1, originY: 0.5 }}
          animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ ...loop(3.2, [0, 0.12, 0.8, 1]), delay: chip.delay }}
        >
          <rect x="36" y={chip.y} width="88" height="34" rx="17" className="fill-white/10 stroke-white/20" />
          <circle cx="54" cy={chip.y + 17} r="8" className={chip.y === 104 ? "fill-gold" : "fill-sky"} />
          <rect x="68" y={chip.y + 11} width="42" height="5" rx="2.5" className="fill-white/50" />
          <rect x="68" y={chip.y + 20} width="26" height="4" rx="2" className="fill-white/25" />
        </motion.g>
      ))}
    </Frame>
  );
}

// ── SEO: your result climbs from third to first ──────────────────────────────
function SeoScene() {
  const D = 5;
  const T = [0, 0.35, 0.55, 1];
  return (
    <Frame>
      <rect x="60" y="34" width="280" height="40" rx="20" className="fill-white/10 stroke-white/25" />
      <circle cx="84" cy="53" r="6" className="stroke-white/60" strokeWidth="2" />
      <path d="M88.5 57.5 L93 62" className="stroke-white/60" strokeWidth="2" strokeLinecap="round" />
      <motion.rect
        x="104" y="49" height="9" rx="4.5" className="fill-white/55"
        animate={{ width: [0, 130, 130, 130] }}
        transition={loop(D, [0, 0.28, 0.9, 1])}
      />

      {[100, 160].map((y) => (
        <motion.g key={y} animate={{ y: [0, 0, 60, 60] }} transition={loop(D, T)}>
          <rect x="60" y={y} width="280" height="46" rx="10" className="fill-white/5 stroke-white/15" />
          <rect x="76" y={y + 13} width="120" height="6" rx="3" className="fill-white/30" />
          <rect x="76" y={y + 26} width="190" height="5" rx="2.5" className="fill-white/15" />
        </motion.g>
      ))}

      <motion.g animate={{ y: [120, 120, 0, 0] }} transition={loop(D, T)}>
        <rect x="60" y="100" width="280" height="46" rx="10" className="fill-electric/45 stroke-sky" strokeWidth="1.5" />
        <rect x="76" y="113" width="130" height="6" rx="3" className="fill-white" />
        <rect x="76" y="126" width="180" height="5" rx="2.5" className="fill-white/50" />
        <motion.g
          style={{ originX: 0.5, originY: 0.5 }}
          animate={{ scale: [0, 0, 1.25, 1, 1] }}
          transition={loop(D, [0, 0.55, 0.63, 0.7, 1])}
        >
          <circle cx="314" cy="123" r="14" className="fill-gold" />
          <text x="314" y="127.5" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-navy">#1</text>
        </motion.g>
      </motion.g>
    </Frame>
  );
}

// ── Email: one message fans out to many inboxes ──────────────────────────────
function EmailScene() {
  const targets = [
    { x: 150, y: -92 }, { x: 165, y: 0 }, { x: 150, y: 92 },
    { x: -150, y: -92 }, { x: -165, y: 0 }, { x: -150, y: 92 },
  ];
  return (
    <Frame>
      <motion.circle
        cx="200" cy="150" r="118" className="stroke-white/15" strokeDasharray="4 8"
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      {targets.map((target, i) => (
        <motion.g
          key={i}
          initial={{ x: 200, y: 150, opacity: 0, scale: 0.4 }}
          animate={{ x: [200, 200 + target.x], y: [150, 150 + target.y], opacity: [0, 1, 1, 0], scale: [0.4, 1] }}
          transition={{ duration: 2.4, delay: 0.35 * i, repeat: Infinity, repeatDelay: 0.6, ease: "easeOut" }}
        >
          <rect x="-15" y="-11" width="30" height="22" rx="4" className={i % 2 ? "fill-sky" : "fill-gold"} />
          <path d="M-15 -8 L0 3 L15 -8" className="stroke-navy/70" strokeWidth="1.5" />
        </motion.g>
      ))}
      <motion.g
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="140" y="106" width="120" height="88" rx="12" className="fill-electric stroke-sky" strokeWidth="1.5" />
        <path d="M144 114 L200 158 L256 114" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      <motion.g
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ scale: [0, 1.2, 1, 1, 0] }}
        transition={loop(3, [0, 0.12, 0.2, 0.85, 1])}
      >
        <circle cx="258" cy="108" r="13" className="fill-gold" />
        <path d="M252 108 L256.5 112.5 L264 104" className="stroke-navy" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </Frame>
  );
}

// ── Ads: a click on the ad turns into rising results ─────────────────────────
function AdsScene() {
  const D = 4.5;
  const bars = [38, 66, 98, 138];
  return (
    <Frame>
      <rect x="40" y="66" width="150" height="168" rx="14" className="fill-white/10 stroke-white/25" />
      <rect x="52" y="78" width="28" height="16" rx="4" className="fill-gold" />
      <text x="66" y="90" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-navy">Ad</text>
      <rect x="52" y="102" width="126" height="62" rx="8" className="fill-electric/60" />
      <rect x="52" y="174" width="100" height="6" rx="3" className="fill-white/40" />
      <rect x="52" y="186" width="70" height="5" rx="2.5" className="fill-white/20" />
      <motion.rect
        x="52" y="202" width="74" height="22" rx="11" className="fill-sky"
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ scale: [1, 1, 0.9, 1, 1] }}
        transition={loop(D, [0, 0.26, 0.3, 0.36, 1])}
      />
      <motion.circle
        cx="96" cy="213" r="16" className="stroke-white" strokeWidth="2"
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ scale: [0, 0, 1.8, 1.8], opacity: [0, 0.8, 0, 0] }}
        transition={loop(D, [0, 0.28, 0.45, 1])}
      />
      <motion.path
        d="M0 0 L0 17 L4.5 13 L8 20 L11 18.5 L7.5 12 L13 12 Z" className="fill-white stroke-navy" strokeWidth="1"
        animate={{ x: [176, 96, 96, 176], y: [262, 213, 213, 262] }}
        transition={loop(D, [0, 0.25, 0.8, 1])}
      />

      {/* Chart is drawn in a flipped group so bars grow upward from the baseline */}
      <path d="M222 236 H366" className="stroke-white/25" strokeWidth="1.5" />
      <g transform="translate(0 234) scale(1 -1)">
        {bars.map((height, i) => (
          <motion.rect
            key={height}
            x={230 + i * 35} y="0" width="22" rx="4"
            className={i === bars.length - 1 ? "fill-gold" : "fill-sky/80"}
            animate={{ height: [0, 0, height, height, 0] }}
            transition={loop(D, [0, 0.34, 0.5 + i * 0.05, 0.92, 1])}
          />
        ))}
      </g>
      <motion.path
        d="M226 196 L262 172 L298 142 L346 84" className="stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 6"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={loop(D, [0, 0.6, 0.72, 0.92, 1])}
      />
    </Frame>
  );
}

// ── Lead Generation: many visitors in, qualified leads out ───────────────────
function LeadScene() {
  const visitors = [92, 128, 160, 196, 232, 268, 304, 146, 250];
  return (
    <Frame>
      <path d="M104 72 H296 L228 158 V214 H172 V158 Z" className="fill-white/10 stroke-white/30" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M126 100 H274" className="stroke-white/15" />
      <path d="M150 130 H250" className="stroke-white/15" />
      {visitors.map((x, i) => (
        <motion.circle
          key={i} r="5" className={i % 3 === 0 ? "fill-sky" : "fill-white/60"}
          initial={{ cx: x, cy: 24, opacity: 0 }}
          animate={{ cx: [x, x, 200], cy: [24, 70, 150], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, delay: i * 0.3, repeat: Infinity, repeatDelay: 0.5, ease: "easeIn" }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i} cx="200" r="6" className="fill-gold"
          initial={{ cy: 214, opacity: 0 }}
          animate={{ cy: [214, 250], opacity: [0, 1, 0] }}
          transition={{ duration: 1, delay: 0.9 + i * 1, repeat: Infinity, repeatDelay: 2, ease: "easeIn" }}
        />
      ))}
      <motion.g
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1, delay: 0.9, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="140" y="246" width="120" height="34" rx="17" className="fill-gold/20 stroke-gold" strokeWidth="1.5" />
        <circle cx="160" cy="263" r="8" className="fill-gold" />
        <rect x="176" y="257" width="52" height="5" rx="2.5" className="fill-white/70" />
        <rect x="176" y="266" width="34" height="4" rx="2" className="fill-white/35" />
      </motion.g>
    </Frame>
  );
}

// ── CRO: an A/B test where variant B wins ────────────────────────────────────
function CroScene() {
  const D = 5;
  const card = (x: number, winner: boolean) => (
    <>
      <rect x={x} y="62" width="124" height="176" rx="14" className={winner ? "fill-white/10 stroke-gold" : "fill-white/10 stroke-white/25"} strokeWidth="1.5" />
      <rect x={x + 14} y="78" width="96" height="46" rx="8" className={winner ? "fill-electric/70" : "fill-white/15"} />
      <rect x={x + 14} y="134" width="80" height="6" rx="3" className="fill-white/40" />
      <rect x={x + 14} y="146" width="56" height="5" rx="2.5" className="fill-white/20" />
      <rect x={x + 14} y="162" width="64" height="20" rx="10" className={winner ? "fill-gold" : "fill-white/30"} />
      <rect x={x + 14} y="208" width="96" height="8" rx="4" className="fill-white/15" />
      <motion.rect
        x={x + 14} y="208" height="8" rx="4" className={winner ? "fill-gold" : "fill-sky/80"}
        animate={{ width: [0, winner ? 86 : 34, winner ? 86 : 34, 0] }}
        transition={loop(D, [0, 0.4, 0.92, 1])}
      />
      <circle cx={x + 62} cy="62" r="13" className={winner ? "fill-gold" : "fill-white/30"} />
      <text x={x + 62} y="66.5" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-navy">{winner ? "B" : "A"}</text>
    </>
  );
  return (
    <Frame>
      <motion.g animate={{ opacity: [1, 1, 0.45, 0.45, 1] }} transition={loop(D, [0, 0.45, 0.55, 0.92, 1])}>
        {card(58, false)}
      </motion.g>
      <motion.g animate={{ y: [0, 0, -10, -10, 0] }} transition={loop(D, [0, 0.45, 0.55, 0.92, 1])}>
        {card(218, true)}
        <motion.g
          style={{ originX: 0.5, originY: 0.5 }}
          animate={{ scale: [0, 0, 1.25, 1, 1, 0] }}
          transition={loop(D, [0, 0.5, 0.58, 0.64, 0.92, 1])}
        >
          <circle cx="336" cy="70" r="15" className="fill-sky" />
          <path d="M329 70 L334 75 L343 65" className="stroke-navy" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </motion.g>
    </Frame>
  );
}

// ── Fallback for capabilities without a custom scene ─────────────────────────
function IconScene({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="relative grid size-full place-items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute size-28 rounded-full border border-sky/50"
          animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
          transition={{ duration: 3, delay: i, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
      <span
        className="relative grid size-28 place-items-center rounded-3xl text-white"
        style={{ background: "linear-gradient(135deg, var(--sky), var(--electric))" }}
      >
        <Icon className="size-12" />
      </span>
    </div>
  );
}

const scenes: Record<string, () => ReactNode> = {
  "Social Media": SocialScene,
  "SEO & YouTube SEO": SeoScene,
  "Email Marketing": EmailScene,
  "Google & Meta Ads": AdsScene,
  "Lead Generation": LeadScene,
  "CRO": CroScene,
};

export function CapabilityScene({ title, icon }: { title: string; icon: LucideIcon }) {
  const Scene = scenes[title];
  return Scene ? <Scene /> : <IconScene icon={icon} />;
}
