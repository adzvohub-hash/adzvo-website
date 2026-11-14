import { useEffect, useRef, useState } from "react";

const STEPS = 20;
const STEP_MS = 85;

export function incrementValue(target: number, step: number) {
  const progress = Math.min(1, Math.max(0, step / STEPS));
  return Math.floor(target * (1 - (1 - progress) ** 2));
}

/** A single scroll-triggered count-up; the final value stays put on re-entry. Hovering the stat card replays the flip. */
export function ImpactCounter({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const stop = () => {
      if (timer !== undefined) clearInterval(timer);
      timer = undefined;
    };
    let endedAt = 0;
    const run = () => {
      stop();
      setStep(0);
      let next = 0;
      timer = setInterval(() => {
        next += 1;
        setStep(next);
        if (next >= STEPS) {
          stop();
          endedAt = Date.now();
        }
      }, STEP_MS);
    };
    const reduceMotion = () => {
      if (preference.matches) {
        stop();
        setStep(STEPS);
      }
    };
    if (preference.matches || !("IntersectionObserver" in window)) {
      setStep(STEPS);
      return;
    }
    let started = false;
    const observer = new IntersectionObserver((entries) => {
      if (started || !entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25)) return;
      started = true;
      observer.disconnect();
      run();
    }, { threshold: 0.25 });
    observer.observe(element);
    // Hovering the stat card replays the mechanical count-up. Enters that the
    // flap elements themselves trigger under a resting cursor are ignored.
    const card = element.closest(".impact-stat-card") ?? element;
    const replay = (event: Event) => {
      if (preference.matches) return;
      if (timer !== undefined) return;
      if (Date.now() - endedAt < 400) return;
      const pointerType = (event as PointerEvent).pointerType;
      if (pointerType === "touch") return;
      run();
    };
    card.addEventListener("pointerenter", replay);
    preference.addEventListener("change", reduceMotion);
    return () => {
      stop();
      observer.disconnect();
      card.removeEventListener("pointerenter", replay);
      preference.removeEventListener("change", reduceMotion);
    };
  }, []);

  const current = incrementValue(value, step);
  const previous = incrementValue(value, step - 1);
  const flipping = current !== previous && step > 0;

  return (
    <div ref={ref} className="impact-counter" role="img" aria-label={`${value}+`} data-value={current}>
      <span aria-hidden="true" className="impact-counter-face">{current}+</span>
      {flipping && <span key={current} aria-hidden="true" className="impact-counter-flaps">
        <span className="impact-flap impact-flap-top"><span>{previous}+</span></span>
        <span className="impact-flap impact-flap-bottom"><span>{current}+</span></span>
      </span>}
    </div>
  );
}