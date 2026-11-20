import type { CSSProperties } from "react";

/**
 * Neon curtain — the dark-theme counterpart of the frosted-glass service hero.
 * Glowing strands hang like curtain folds, sway gently and carry light pulses
 * downward. Hidden in the light theme (see ".neon-curtain" in styles.css).
 * Place it directly after the hero's backdrop <img>.
 */

// left %, colour, sway seconds, delay, glow strength, pulse seconds
const STRANDS: [number, "gold" | "amber" | "blue" | "violet", number, number, number, number][] = [
  [4, "blue", 9, 0, 0.55, 6.5],
  [9, "gold", 11, 2, 0.9, 5],
  [15, "amber", 10, 5, 0.7, 7],
  [22, "violet", 12, 1, 0.5, 6],
  [28, "gold", 9.5, 4, 0.8, 5.5],
  [35, "blue", 11.5, 7, 0.55, 7.5],
  [42, "amber", 10, 3, 0.6, 6],
  [58, "amber", 10.5, 6, 0.6, 6.5],
  [65, "blue", 12, 2, 0.55, 5.5],
  [72, "gold", 9, 5, 0.85, 7],
  [78, "violet", 11, 0, 0.5, 6],
  [85, "amber", 10, 8, 0.7, 5],
  [91, "gold", 12.5, 3, 0.9, 6.5],
  [97, "blue", 9.5, 6, 0.55, 7],
];

export function NeonCurtain() {
  return (
    <div className="neon-curtain" aria-hidden="true">
      <span className="neon-curtain-haze" />
      {STRANDS.map(([left, tone, sway, delay, strength, pulse]) => (
        <i
          key={left}
          className={`nc-${tone}`}
          style={{
            left: `${left}%`,
            opacity: strength,
            animationDuration: `${sway}s`,
            animationDelay: `-${delay}s`,
            "--pulse": `${pulse}s`,
            "--pulse-delay": `-${(delay * 0.7).toFixed(1)}s`,
          } as CSSProperties}
        />
      ))}
      <span className="neon-curtain-floor" />
    </div>
  );
}
