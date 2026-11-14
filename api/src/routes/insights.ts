import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import type { Bindings, Insight, InsightRow } from "../types";

const insights = new Hono<{ Bindings: Bindings }>();

// ─── Helper: attach images to insight rows ────────────────────────────────────
async function withImages(db: D1Database, rows: InsightRow[]): Promise<Insight[]> {
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const placeholders = ids.map(() => "?").join(",");
  const imgRows = await db
    .prepare(`SELECT insight_id, image_url FROM insight_images WHERE insight_id IN (${placeholders}) ORDER BY position ASC`)
    .bind(...ids)
    .all<{ insight_id: string; image_url: string }>();

  const imageMap = new Map<string, string[]>();
  for (const img of imgRows.results) {
    const list = imageMap.get(img.insight_id) ?? [];
    list.push(img.image_url);
    imageMap.set(img.insight_id, list);
  }

  return rows.map((row) => ({ ...row, images: imageMap.get(row.id) ?? [] }));
}

// ─── GET /api/insights ────────────────────────────────────────────────────────
insights.get("/", async (ctx) => {
  const tag = ctx.req.query("tag");
  const query = tag
    ? "SELECT * FROM insights WHERE tag = ? ORDER BY sort_order ASC, created_at DESC"
    : "SELECT * FROM insights ORDER BY sort_order ASC, created_at DESC";

  const rows = tag
    ? await ctx.env.DB.prepare(query).bind(tag).all<InsightRow>()
    : await ctx.env.DB.prepare(query).all<InsightRow>();

  return ctx.json(await withImages(ctx.env.DB, rows.results));
});

// ─── GET /api/insights/:id ────────────────────────────────────────────────────
insights.get("/:id", async (ctx) => {
  const row = await ctx.env.DB
    .prepare("SELECT * FROM insights WHERE id = ?")
    .bind(ctx.req.param("id"))
    .first<InsightRow>();
  if (!row) return ctx.json({ error: "Insight not found" }, 404);
  const [insight] = await withImages(ctx.env.DB, [row]);
  return ctx.json(insight);
});

// ─── POST /api/insights ───────────────────────────────────────────────────────
insights.post("/", requireAuth, async (ctx) => {
  const body = await ctx.req.json<Omit<Insight, "created_at" | "updated_at">>();
  const { id, tag, title, excerpt, body: bodyText, images = [], sort_order = 0 } = body;

  if (!id || !tag || !title || !excerpt || !bodyText) {
    return ctx.json({ error: "Missing required fields: id, tag, title, excerpt, body" }, 400);
  }

  await ctx.env.DB
    .prepare("INSERT INTO insights (id, tag, title, excerpt, body, sort_order) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, tag, title, excerpt, bodyText, sort_order)
    .run();

  if (images.length > 0) {
    const imgStmts = images.map((url, i) =>
      ctx.env.DB
        .prepare("INSERT INTO insight_images (insight_id, image_url, position) VALUES (?, ?, ?)")
        .bind(id, url, i)
    );
    await ctx.env.DB.batch(imgStmts);
  }

  const row = await ctx.env.DB.prepare("SELECT * FROM insights WHERE id = ?").bind(id).first<InsightRow>();
  if (!row) return ctx.json({ error: "Insert failed" }, 500);
  const [insight] = await withImages(ctx.env.DB, [row]);
  return ctx.json(insight, 201);
});

// ─── PUT /api/insights/:id ────────────────────────────────────────────────────
insights.put("/:id", requireAuth, async (ctx) => {
  const id = ctx.req.param("id");
  const body = await ctx.req.json<Partial<Insight>>();

  const existing = await ctx.env.DB
    .prepare("SELECT id FROM insights WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!existing) return ctx.json({ error: "Insight not found" }, 404);

  const { tag, title, excerpt, body: bodyText, images, sort_order } = body;

  await ctx.env.DB
    .prepare(`
      UPDATE insights
      SET tag = COALESCE(?, tag),
          title = COALESCE(?, title),
          excerpt = COALESCE(?, excerpt),
          body = COALESCE(?, body),
          sort_order = COALESCE(?, sort_order),
          updated_at = datetime('now')
      WHERE id = ?
    `)
    .bind(tag ?? null, title ?? null, excerpt ?? null, bodyText ?? null, sort_order ?? null, id)
    .run();

  // Replace images if provided
  if (Array.isArray(images)) {
    await ctx.env.DB.prepare("DELETE FROM insight_images WHERE insight_id = ?").bind(id).run();
    if (images.length > 0) {
      const imgStmts = images.map((url, i) =>
        ctx.env.DB
          .prepare("INSERT INTO insight_images (insight_id, image_url, position) VALUES (?, ?, ?)")
          .bind(id, url, i)
      );
      await ctx.env.DB.batch(imgStmts);
    }
  }

  const row = await ctx.env.DB.prepare("SELECT * FROM insights WHERE id = ?").bind(id).first<InsightRow>();
  if (!row) return ctx.json({ error: "Update failed" }, 500);
  const [insight] = await withImages(ctx.env.DB, [row]);
  return ctx.json(insight);
});

// ─── DELETE /api/insights/:id ─────────────────────────────────────────────────
insights.delete("/:id", requireAuth, async (ctx) => {
  const id = ctx.req.param("id");
  // insight_images deleted by CASCADE
  const result = await ctx.env.DB
    .prepare("DELETE FROM insights WHERE id = ?")
    .bind(id)
    .run();

  if (result.meta.changes === 0) return ctx.json({ error: "Insight not found" }, 404);
  return ctx.json({ ok: true });
});

export default insights;
