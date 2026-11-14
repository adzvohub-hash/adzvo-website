import type { CSSProperties } from "react";

/**
 * Falling-water light for the frosted-glass service heroes.
 * Soft vertical streaks slide down behind a ribbed-glass overlay, so it reads
 * as water running down the back of a frosted pane. Pure CSS (see
 * ".hero-waterfall" in styles.css) and still for reduced-motion visitors.
 * Place it directly after the hero's backdrop <img>.
 */

// left %, width px, seconds per fall, start offset in seconds, tone, strength
const STREAKS: [number, number, number, number, "light" | "tint", number][] = [
  [3, 90, 13, 0, "light", 0.9],
  [11, 46, 10, 4, "tint", 0.7],
  [19, 120, 15, 9, "light", 0.75],
  [28, 54, 11, 2, "tint", 0.6],
  [36, 84, 14, 7, "light", 0.85],
  [45, 40, 9.5, 5, "tint", 0.75],
  [53, 110, 15.5, 11, "light", 0.7],
  [62, 58, 11.5, 1, "tint", 0.65],
  [70, 96, 13.5, 6, "light", 0.9],
  [79, 44, 10.5, 8, "tint", 0.7],
  [87, 104, 14.5, 3, "light", 0.8],
  [95, 60, 12, 10, "tint", 0.6],
];

export function HeroWaterfall() {
  return (
    <div className="hero-waterfall" aria-hidden="true">
      {STREAKS.map(([left, width, seconds, offset, tone, strength]) => (
        <i
          key={left}
          className={tone === "tint" ? "is-tint" : ""}
          style={{ left: `${left}%`, width, opacity: strength, animationDuration: `${seconds}s`, animationDelay: `-${offset}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}
