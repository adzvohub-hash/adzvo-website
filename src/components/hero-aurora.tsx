/**
 * Aurora sky — the dark-theme backdrop for the service heroes.
 * A night sky with faint stars and soft bands of gold/amber light (and one
 * faint blue-violet band) that drift, bend and slowly shift colour.
 * Hidden in the light theme (see ".hero-aurora" in styles.css).
 * Place it directly after the hero's backdrop <img>.
 */
export function HeroAurora() {
  return (
    <div className="hero-aurora" aria-hidden="true">
      <span className="ha-stars" />
      <span className="ha-lights">
        <span className="ha-band ha-b1" />
        <span className="ha-band ha-b2" />
        <span className="ha-band ha-b3" />
        <span className="ha-band ha-b4" />
        <span className="ha-band ha-b5" />
        <span className="ha-horizon" />
      </span>
      <span className="ha-fade" />
    </div>
  );
}
