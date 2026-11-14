import { describe, expect, it } from "vitest";
import { IMPACT_STATS } from "@/routes/index";

describe("Impact metrics from the supplied reference", () => {
  it("reports 120+ projects delivered", () => {
    expect(IMPACT_STATS.find(stat => stat.label === "Projects Delivered")?.value).toBe(120);
  });
  it("reports 50+ trusted clients", () => {
    expect(IMPACT_STATS.find(stat => stat.label === "Trusted Clients")?.value).toBe(50);
  });
  it("reports 36+ partners and collaborators", () => {
    expect(IMPACT_STATS.find(stat => stat.label === "Partners & Collaborators")?.value).toBe(36);
  });
  it("reports 8+ service categories", () => {
    expect(IMPACT_STATS.find(stat => stat.label === "Service Categories")?.value).toBe(8);
  });
});