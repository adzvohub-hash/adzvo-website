import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import type { Bindings, Project } from "../types";

const projects = new Hono<{ Bindings: Bindings }>();

// ─── GET /api/projects ────────────────────────────────────────────────────────
projects.get("/", async (ctx) => {
  const service = ctx.req.query("service");
  const query = service
    ? "SELECT * FROM projects WHERE service = ? ORDER BY sort_order ASC, created_at DESC"
    : "SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC";

  const rows = service
    ? await ctx.env.DB.prepare(query).bind(service).all<Project>()
    : await ctx.env.DB.prepare(query).all<Project>();

  return ctx.json(rows.results);
});

// ─── GET /api/projects/:id ────────────────────────────────────────────────────
projects.get("/:id", async (ctx) => {
  const row = await ctx.env.DB
    .prepare("SELECT * FROM projects WHERE id = ?")
    .bind(ctx.req.param("id"))
    .first<Project>();
  if (!row) return ctx.json({ error: "Project not found" }, 404);
  return ctx.json(row);
});

// ─── POST /api/projects ───────────────────────────────────────────────────────
projects.post("/", requireAuth, async (ctx) => {
  const body = await ctx.req.json<Omit<Project, "created_at" | "updated_at">>();

  const { id, title, client, location, service, description, image_url, case_study_url, sort_order } = body;
  if (!id || !title || !client || !location || !service || !description) {
    return ctx.json({ error: "Missing required fields: id, title, client, location, service, description" }, 400);
  }

  await ctx.env.DB
    .prepare(`
      INSERT INTO projects (id, title, client, location, service, description, image_url, case_study_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(id, title, client, location, service, description, image_url ?? "", case_study_url ?? "", sort_order ?? 0)
    .run();

  const row = await ctx.env.DB.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first<Project>();
  return ctx.json(row, 201);
});

// ─── PUT /api/projects/:id ────────────────────────────────────────────────────
projects.put("/:id", requireAuth, async (ctx) => {
  const id = ctx.req.param("id");
  const body = await ctx.req.json<Partial<Project>>();

  const existing = await ctx.env.DB
    .prepare("SELECT id FROM projects WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!existing) return ctx.json({ error: "Project not found" }, 404);

  const { title, client, location, service, description, image_url, case_study_url, sort_order } = body;

  await ctx.env.DB
    .prepare(`
      UPDATE projects
      SET title = COALESCE(?, title),
          client = COALESCE(?, client),
          location = COALESCE(?, location),
          service = COALESCE(?, service),
          description = COALESCE(?, description),
          image_url = COALESCE(?, image_url),
          case_study_url = COALESCE(?, case_study_url),
          sort_order = COALESCE(?, sort_order),
          updated_at = datetime('now')
      WHERE id = ?
    `)
    .bind(
      title ?? null, client ?? null, location ?? null, service ?? null,
      description ?? null, image_url ?? null, case_study_url ?? null,
      sort_order ?? null, id
    )
    .run();

  const row = await ctx.env.DB.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first<Project>();
  return ctx.json(row);
});

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────
projects.delete("/:id", requireAuth, async (ctx) => {
  const id = ctx.req.param("id");
  const result = await ctx.env.DB
    .prepare("DELETE FROM projects WHERE id = ?")
    .bind(id)
    .run();

  if (result.meta.changes === 0) return ctx.json({ error: "Project not found" }, 404);
  return ctx.json({ ok: true });
});

export default projects;
