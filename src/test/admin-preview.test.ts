import { describe, expect, it } from "vitest";
import { acceptsPreviewLogin, initialMetrics, initialPosts, initialProjects, upsertPreviewItem } from "@/lib/admin-preview";

describe("Admin frontend preview", () => {
  it("accepts the requested demonstration credentials only", () => {
    expect(acceptsPreviewLogin("adzvoadmin", "adzvoadmin")).toBe(true);
    expect(acceptsPreviewLogin("adzvoadmin", "wrong")).toBe(false);
    expect(acceptsPreviewLogin("wrong", "adzvoadmin")).toBe(false);
  });
  it("adds a project to the temporary collection without changing public samples", () => {
    const source = initialProjects[0];
    if (!source) throw new Error("Missing project seed");
    const next = upsertPreviewItem(initialProjects, { ...source, id: "new", title: "New project" });
    expect(next.length).toBe(initialProjects.length + 1);
    expect(next[0]?.title).toBe("New project");
    expect(initialProjects.some((item) => item.id === "new")).toBe(false);
  });
  it("edits an insight rather than duplicating it", () => {
    const source = initialPosts[0];
    if (!source) throw new Error("Missing article seed");
    const next = upsertPreviewItem(initialPosts, { ...source, title: "Revised article" });
    expect(next.length).toBe(initialPosts.length);
    expect(next.find((item) => item.id === source.id)?.title).toBe("Revised article");
    expect(initialPosts[0]?.title).not.toBe("Revised article");
  });
  it("starts the four impact editors at the current site values", () => {
    expect(initialMetrics.map((metric) => metric.value)).toEqual([120, 50, 36, 8]);
  });
});