import { projects, type Project } from "@/lib/projects";
import { posts, type Post } from "@/lib/insights";
import { servicePages } from "@/lib/services";

// Demonstration-only gate, not authentication or access control.
export function acceptsPreviewLogin(username: string, password: string) {
  return username === "adzvoadmin" && password === "adzvoadmin";
}

export type AdminProject = Project & { image: string };
export type AdminPost = Post & { id: string };
export const initialProjects: AdminProject[] = projects.map((project) => ({
  ...project,
  image: servicePages.find((service) => service.slug === project.service)?.image ?? "",
}));
export const initialPosts: AdminPost[] = posts.map((post, index) => ({ ...post, images: [...post.images], id: `insight-${index}` }));

export const initialMetrics = [
  { value: 120, label: "Projects Delivered" },
  { value: 50, label: "Trusted Clients" },
  { value: 36, label: "Partners & Collaborators" },
  { value: 8, label: "Service Categories" },
];

export function upsertPreviewItem<T extends { id: string }>(items: T[], item: T): T[] {
  return items.some((existing) => existing.id === item.id)
    ? items.map((existing) => existing.id === item.id ? item : existing)
    : [item, ...items];
}

export function validMediaUrl(value: string): boolean {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (value.startsWith("blob:")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}