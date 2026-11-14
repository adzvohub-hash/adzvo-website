// Cloudflare Worker bindings
export type Bindings = {
  DB: D1Database;
  MEDIA: R2Bucket;
  JWT_SECRET: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  ENVIRONMENT: string;
  CORS_ORIGIN: string;
};

// ─── Domain types (match the frontend's lib/projects.ts, lib/insights.ts) ─────

export type Project = {
  id: string;
  title: string;
  client: string;
  location: string;
  service: string;
  description: string;
  image_url: string;
  case_study_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Insight = {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  body: string;
  images: string[];  // assembled from insight_images table
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type InsightRow = Omit<Insight, "images">;

export type ServiceImage = {
  slug: string;
  image_url: string;
};

export type Settings = {
  hero_video_url: string;
  metric_projects: number;
  metric_clients: number;
  metric_partners: number;
  metric_categories: number;
};
