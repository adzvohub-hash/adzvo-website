import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import type { Bindings, Settings, ServiceImage } from "../types";

const home = new Hono<{ Bindings: Bindings }>();

// ─── GET /api/home/settings ───────────────────────────────────────────────────
// Returns hero video URL + 4 impact metrics
home.get("/settings", async (ctx) => {
  const rows = await ctx.env.DB
    .prepare("SELECT key, value FROM settings")
    .all<{ key: string; value: string }>();

  const map: Record<string, string> = {};
  for (const row of rows.results) map[row.key] = row.value;

  const settings: Settings = {
    hero_video_url:    map["hero_video_url"]    ?? "",
    metric_projects:   Number(map["metric_projects"]   ?? 120),
    metric_clients:    Number(map["metric_clients"]    ?? 50),
    metric_partners:   Number(map["metric_partners"]   ?? 36),
    metric_categories: Number(map["metric_categories"] ?? 8),
  };
  return ctx.json(settings);
});

// ─── PUT /api/home/settings ───────────────────────────────────────────────────
// Body: Partial<Settings>
home.put("/settings", requireAuth, async (ctx) => {
  const body = await ctx.req.json<Partial<Settings>>();

  const updates: { key: string; value: string }[] = [];
  if (typeof body.hero_video_url    === "string") updates.push({ key: "hero_video_url",    value: body.hero_video_url });
  if (typeof body.metric_projects   === "number") updates.push({ key: "metric_projects",   value: String(body.metric_projects) });
  if (typeof body.metric_clients    === "number") updates.push({ key: "metric_clients",    value: String(body.metric_clients) });
  if (typeof body.metric_partners   === "number") updates.push({ key: "metric_partners",   value: String(body.metric_partners) });
  if (typeof body.metric_categories === "number") updates.push({ key: "metric_categories", value: String(body.metric_categories) });

  if (updates.length === 0) return ctx.json({ error: "Nothing to update" }, 400);

  const stmts = updates.map(({ key, value }) =>
    ctx.env.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").bind(key, value)
  );
  await ctx.env.DB.batch(stmts);

  return ctx.json({ ok: true });
});

// ─── GET /api/home/service-images ────────────────────────────────────────────
home.get("/service-images", async (ctx) => {
  const rows = await ctx.env.DB
    .prepare("SELECT slug, image_url FROM service_images ORDER BY slug")
    .all<ServiceImage>();
  return ctx.json(rows.results);
});

// ─── PUT /api/home/service-images ────────────────────────────────────────────
// Body: { slug: string, image_url: string }[]
home.put("/service-images", requireAuth, async (ctx) => {
  const body = await ctx.req.json<ServiceImage[]>();
  if (!Array.isArray(body) || body.length === 0) return ctx.json({ error: "Expected an array" }, 400);

  const stmts = body.map(({ slug, image_url }) =>
    ctx.env.DB
      .prepare("INSERT OR REPLACE INTO service_images (slug, image_url) VALUES (?, ?)")
      .bind(slug, image_url)
  );
  await ctx.env.DB.batch(stmts);

  return ctx.json({ ok: true });
});

export default home;
