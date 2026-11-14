// Central API client for the ADZVO Hono backend

export const API_BASE = "https://adzvo-api.adzvohub.workers.dev";
export const R2_BASE  = "https://pub-d599108787ca4f3283af2c206c0a1244.r2.dev";

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
  return res.json<Settings>();
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
  return res.json<ServiceImage[]>();
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

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/api/projects`);
  return res.json<Project[]>();
}

export async function saveProject(project: Omit<Project, "created_at" | "updated_at">, isNew: boolean): Promise<Project> {
  const res = await authFetch(isNew ? "/api/projects" : `/api/projects/${project.id}`, {
    method: isNew ? "POST" : "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Failed to save project");
  return res.json<Project>();
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
  return res.json<Insight[]>();
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
  return data.url;
}
