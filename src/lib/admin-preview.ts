import { R2_BASE } from "@/lib/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function r2img(name: string) { return `${R2_BASE}/images/${name}`; }
export function r2vid(name: string) { return `${R2_BASE}/videos/${name}`; }

export function validMediaUrl(value: string): boolean {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  if (value.startsWith("blob:")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

export function upsertItem<T extends { id: string }>(items: T[], item: T): T[] {
  return items.some((existing) => existing.id === item.id)
    ? items.map((existing) => existing.id === item.id ? item : existing)
    : [item, ...items];
}
