/**
 * Slow aurora for dark service heroes: blurred ribbons of gold and deep blue
 * drifting over navy. Pure CSS (see ".hero-aurora" in styles.css), no script,
 * and it holds still for visitors who prefer reduced motion.
 * Use inside a hero <section> that also has the "hero-dark" class.
 */
export function HeroAurora() {
  return (
    <div className="hero-aurora" aria-hidden="true">
      <i /><i /><i /><i />
    </div>
  );
}
