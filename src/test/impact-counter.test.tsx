import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImpactCounter, incrementValue } from "@/components/impact-counter";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function visibilityHarness(reducedMotion = false) {
  let notify: IntersectionObserverCallback | undefined;
  const disconnect = vi.fn();
  const observer = { observe: vi.fn(), disconnect, unobserve: vi.fn(), takeRecords: () => [], root: null, rootMargin: "", scrollMargin: "", thresholds: [0.25] };
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { notify = callback; }
    observe = observer.observe;
    disconnect = observer.disconnect;
  });
  vi.stubGlobal("matchMedia", () => ({ matches: reducedMotion, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  return (ratio: number) => {
    act(() => notify?.([{ isIntersecting: ratio > 0, intersectionRatio: ratio } as IntersectionObserverEntry], observer));
  };
}

describe("Impact scroll-triggered count-up", () => {
  it.each([120, 50, 36, 8])("increments from zero and settles on %i only after entering view", (target) => {
    vi.useFakeTimers();
    const enter = visibilityHarness();
    render(<ImpactCounter value={target} />);
    const counter = screen.getByRole("img", { name: `${target}+` });
    act(() => vi.advanceTimersByTime(2000));
    expect(counter).toHaveAttribute("data-value", "0");
    enter(0.1);
    act(() => vi.advanceTimersByTime(2000));
    expect(counter).toHaveAttribute("data-value", "0");
    enter(0.3);
    act(() => vi.advanceTimersByTime(850));
    expect(Number(counter.getAttribute("data-value"))).toBeGreaterThan(0);
    expect(Number(counter.getAttribute("data-value"))).toBeLessThan(target);
    act(() => vi.advanceTimersByTime(850));
    expect(counter).toHaveAttribute("data-value", String(target));
    enter(0);
    enter(0.5);
    act(() => vi.advanceTimersByTime(7000));
    expect(counter).toHaveAttribute("data-value", String(target));
    expect(vi.getTimerCount()).toBe(0);
  });

  it("uses only increasing values before reaching the final number", () => {
    const values = Array.from({ length: 21 }, (_, step) => incrementValue(120, step));
    expect(values[0]).toBe(0);
    expect(values[20]).toBe(120);
    expect(values.every((value, index) => value >= (values[index - 1] ?? 0))).toBe(true);
  });

  it("shows the final value immediately when reduced motion is preferred", () => {
    visibilityHarness(true);
    render(<ImpactCounter value={120} />);
    expect(screen.getByRole("img", { name: "120+" })).toHaveAttribute("data-value", "120");
  });

  it("replays the count-up when the stat card is hovered, then settles again", () => {
    vi.useFakeTimers();
    const enter = visibilityHarness();
    const { container } = render(
      <div className="impact-stat-card"><ImpactCounter value={120} /></div>
    );
    const counter = screen.getByRole("img", { name: "120+" });
    const card = container.firstElementChild as HTMLElement;
    enter(0.5);
    act(() => vi.advanceTimersByTime(2000));
    expect(counter).toHaveAttribute("data-value", "120");

    act(() => vi.advanceTimersByTime(500)); // clear the post-settle cooldown
    act(() => card.dispatchEvent(new Event("pointerenter")));
    act(() => vi.advanceTimersByTime(300));
    const midHover = Number(counter.getAttribute("data-value"));
    expect(midHover).toBeGreaterThan(0);
    expect(midHover).toBeLessThan(120);
    act(() => vi.advanceTimersByTime(2000));
    expect(counter).toHaveAttribute("data-value", "120");
    expect(vi.getTimerCount()).toBe(0);
  });
});