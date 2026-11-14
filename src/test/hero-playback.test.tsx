import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Hero } from "@/routes/index";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Hero slide playback", () => {
  it("continues changing slides while the pointer is over the hero", () => {
    vi.useFakeTimers();
    const { container } = render(<Hero />);
    const hero = container.querySelector("section");
    if (!hero) throw new Error("Hero is missing");
    fireEvent.mouseEnter(hero);
    act(() => vi.advanceTimersByTime(6500));
    expect(screen.getByText("02 / 03")).toBeInTheDocument();
  });

  it("stops slides only when paused and resumes when played", () => {
    vi.useFakeTimers();
    render(<Hero />);
    fireEvent.click(screen.getByRole("button", { name: "Pause slides" }));
    act(() => vi.advanceTimersByTime(13000));
    expect(screen.getByText("01 / 03")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Play slides" }));
    act(() => vi.advanceTimersByTime(6500));
    expect(screen.getByText("02 / 03")).toBeInTheDocument();
  });
});