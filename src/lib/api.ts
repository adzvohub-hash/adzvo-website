// Central API client for the ADZVO Hono backend

export const API_BASE = import.meta.env.VITE_API_BASE ?? "https://api.adzvo.com";
/**
 * Public address of the media bucket (adzvo-media), on our own domain.
 * Change MEDIA_DOMAIN here if you connect the bucket to a different address.
 */
export const R2_BASE = "https://media.adzvo.com";

/** The bucket's old r2.dev address. Links saved with it are rewritten to R2_BASE when read. */
export const LEGACY_R2_BASE = "https://pub-d599108787ca4f3283af2c206c0a1244.r2.dev";

/** Rewrite an old r2.dev link to the media domain (anything else is returned unchanged). */
export function toMediaUrl(url: string): string {
  return typeof url === "string" && url.startsWith(LEGACY_R2_BASE) ? R2_BASE + url.slice(LEGACY_R2_BASE.length) : url;
}

/** The file's key in the bucket (e.g. "videos/clip.mp4") for a link on either address, or null if it isn't a bucket link. */
export function r2KeyOf(url: string): string | null {
  for (const base of [R2_BASE, LEGACY_R2_BASE]) {
    if (typeof url === "string" && url.startsWith(base + "/")) return url.slice(base.length + 1);
  }
  return null;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(username: string, password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid username or password");
  const data = await res.json<{ token: string }>();
  return data.token;
}

// ─── Token storage (sessionStorage — cleared on tab close) ───────────────────

const TOKEN_KEY = "adzvo_admin_token";
export function saveToken(token: string) { sessionStorage.setItem(TOKEN_KEY, token); }
export function getToken(): string | null { return sessionStorage.getItem(TOKEN_KEY); }
export function clearToken() { sessionStorage.removeItem(TOKEN_KEY); }

// ─── Authenticated fetch helper ───────────────────────────────────────────────

async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 401) { clearToken(); throw new Error("Session expired. Please sign in again."); }
  return res;
}

// ─── Home settings ────────────────────────────────────────────────────────────

export type Settings = {
  hero_video_url: string;
  metric_projects: number;
  metric_clients: number;
  metric_partners: number;
  metric_categories: number;
};

export async function getSettings(): Promise<Settings> {
  const res = await fetch(`${API_BASE}/api/home/settings`);
  const data = await res.json<Settings>();
  return data && { ...data, hero_video_url: toMediaUrl(data.hero_video_url) };
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  const res = await authFetch("/api/home/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Failed to save settings");
}

// ─── Service images ───────────────────────────────────────────────────────────

export type ServiceImage = { slug: string; image_url: string };

export async function getServiceImages(): Promise<ServiceImage[]> {
  const res = await fetch(`${API_BASE}/api/home/service-images`);
  const rows = await res.json<ServiceImage[]>();
  return Array.isArray(rows) ? rows.map((r) => ({ ...r, image_url: toMediaUrl(r.image_url) })) : rows;
}

export async function saveServiceImages(images: ServiceImage[]): Promise<void> {
  const res = await authFetch("/api/home/service-images", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(images),
  });
  if (!res.ok) throw new Error("Failed to save service images");
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export type Project = {
  id: string; title: string; client: string; location: string;
  service: string; description: string; image_url: string;
  case_study_url: string; sort_order: number;
  created_at: string; updated_at: string;
};

const fixProjectLinks = (p: Project): Project =>
  p && { ...p, image_url: toMediaUrl(p.image_url), case_study_url: toMediaUrl(p.case_study_url) };

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/api/projects`);
  const rows = await res.json<Project[]>();
  return Array.isArray(rows) ? rows.map(fixProjectLinks) : rows;
}

export async function saveProject(project: Omit<Project, "created_at" | "updated_at">, isNew: boolean): Promise<Project> {
  const res = await authFetch(isNew ? "/api/projects" : `/api/projects/${project.id}`, {
    method: isNew ? "POST" : "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Failed to save project");
  return fixProjectLinks(await res.json<Project>());
}

export async function deleteProject(id: string): Promise<void> {
  const res = await authFetch(`/api/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete project");
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export type Insight = {
  id: string; tag: string; title: string; excerpt: string; body: string;
  images: string[]; sort_order: number;
  created_at: string; updated_at: string;
};

export async function getInsights(): Promise<Insight[]> {
  const res = await fetch(`${API_BASE}/api/insights`);
  const rows = await res.json<Insight[]>();
  return Array.isArray(rows) ? rows.map((i) => ({ ...i, images: Array.isArray(i.images) ? i.images.map(toMediaUrl) : i.images })) : rows;
}

export async function saveInsight(insight: Omit<Insight, "created_at" | "updated_at">, isNew: boolean): Promise<Insight> {
  const res = await authFetch(isNew ? "/api/insights" : `/api/insights/${insight.id}`, {
    method: isNew ? "POST" : "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(insight),
  });
  if (!res.ok) throw new Error("Failed to save insight");
  return res.json<Insight>();
}

export async function deleteInsight(id: string): Promise<void> {
  const res = await authFetch(`/api/insights/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete insight");
}

// ─── Media upload ─────────────────────────────────────────────────────────────

export async function uploadMedia(file: File, folder: "images" | "videos"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const res = await authFetch("/api/media/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json<{ url: string }>();
  return toMediaUrl(data.url);
}

/** Delete a file from R2. Pass the full public URL — the key is extracted automatically. */
export async function deleteMedia(url: string): Promise<void> {
  // Extract the R2 key from the public URL (works for the media domain and the old r2.dev address)
  const key = r2KeyOf(url);
  if (!key) return; // not an R2 URL — don't try to delete
  const res = await authFetch("/api/media", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });
  // Silently ignore delete errors — file may already be gone
  if (!res.ok) console.warn("Could not delete old media:", key);
}
