-- ADZVO D1 Database Schema
-- Run: wrangler d1 execute adzvo-db --file=src/db/schema.sql

-- ─── Settings (key/value store for homepage content) ─────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed default homepage settings
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('hero_video_url',    ''),
  ('metric_projects',   '120'),
  ('metric_clients',    '50'),
  ('metric_partners',   '36'),
  ('metric_categories', '8');

-- ─── Service images (one image URL per service slug) ─────────────────────────
CREATE TABLE IF NOT EXISTS service_images (
  slug      TEXT PRIMARY KEY,
  image_url TEXT NOT NULL DEFAULT ''
);

INSERT OR IGNORE INTO service_images (slug) VALUES
  ('digital-technology'),
  ('marketing-growth'),
  ('branding-design'),
  ('film-video-photography'),
  ('animation-content'),
  ('ai-automation'),
  ('content-localization'),
  ('strategy-analytics');

-- ─── Projects ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  client          TEXT NOT NULL,
  location        TEXT NOT NULL,
  service         TEXT NOT NULL,
  description     TEXT NOT NULL,
  image_url       TEXT NOT NULL DEFAULT '',
  case_study_url  TEXT NOT NULL DEFAULT '',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_service ON projects(service);

-- ─── Insights (blog posts) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS insights (
  id         TEXT PRIMARY KEY,
  tag        TEXT NOT NULL,
  title      TEXT NOT NULL,
  excerpt    TEXT NOT NULL,
  body       TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_insights_tag ON insights(tag);

-- ─── Insight images (ordered carousel images per post) ────────────────────────
CREATE TABLE IF NOT EXISTS insight_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  insight_id TEXT NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
  image_url  TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_insight_images_insight ON insight_images(insight_id);
