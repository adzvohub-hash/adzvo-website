/**
 * Aurora sky — the dark-theme backdrop for the service heroes.
 * A night sky with faint stars and soft bands of gold/amber light (and one
 * faint blue-violet band) that drift, bend and slowly shift colour, rising over a
 * glowing planet horizon at the bottom that marks where the hero ends.
 * Stars twinkle, and every so often a shooting star streaks across.
 * Hidden in the light theme (see ".hero-aurora" in styles.css).
 * Place it directly after the hero's backdrop <img>.
 */
/* Twinkling stars: fixed positions (no randomness, so server and browser render the same). */
const TWINKLES = Array.from({ length: 34 }, (_, i) => {
  const x = (i * 37.7 + 11) % 100;
  const y = (i * 23.3 + 7) % 62; // upper sky only, above the horizon
  const size = 1.6 + ((i * 7) % 5) * 0.45;
  const dur = 2.4 + ((i * 13) % 9) * 0.35;
  const delay = -((i * 1.7) % 6);
  return { x, y, size, dur, delay, sparkle: i % 7 === 0, gold: i % 5 === 0 };
});

/* Shooting stars: each crosses the sky now and then (long cycle, short streak). */
const SHOOTERS = [
  { top: "8%", left: "82%", angle: 152, dur: 11, delay: 2.5 },
  { top: "4%", left: "48%", angle: 160, dur: 17, delay: 8 },
  { top: "18%", left: "96%", angle: 146, dur: 23, delay: 14 },
];

export function HeroAurora() {
  return (
    <div className="hero-aurora" aria-hidden="true">
      <span className="ha-stars" />
      <span className="ha-twinkles">
        {TWINKLES.map((t, i) => (
          <span
            key={i}
            className={`ha-tw ${t.sparkle ? "ha-tw-sparkle" : ""} ${t.gold ? "ha-tw-gold" : ""}`}
            style={{ left: `${t.x}%`, top: `${t.y}%`, width: t.size, height: t.size, animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s` }}
          />
        ))}
      </span>
      {SHOOTERS.map((s, i) => (
        <span
          key={i}
          className="ha-shoot"
          style={{ top: s.top, left: s.left, ["--ha-angle" as string]: `${s.angle}deg`, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
        />
      ))}
      <span className="ha-lights">
        <span className="ha-band ha-b1" />
        <span className="ha-band ha-b2" />
        <span className="ha-band ha-b3" />
        <span className="ha-band ha-b4" />
        <span className="ha-band ha-b5" />
        <span className="ha-horizon" />
      </span>
      <span className="ha-fade" />
      {/* the glowing edge of a planet: marks where the hero ends */}
      <span className="ha-planet" />
    </div>
  );
}
