import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import type { Bindings } from "../types";

const media = new Hono<{ Bindings: Bindings }>();

// ─── Allowed MIME types ────────────────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB

// ─── POST /api/media/upload ───────────────────────────────────────────────────
// Accepts multipart/form-data with field "file" and optional "folder" (images|videos)
// Returns: { url: string, key: string }
media.post("/upload", requireAuth, async (ctx) => {
  const formData = await ctx.req.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string | null) ?? "images";

  if (!(file instanceof File)) return ctx.json({ error: "No file provided" }, 400);

  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);

  if (!isImage && !isVideo) {
    return ctx.json({ error: `Unsupported file type: ${file.type}` }, 415);
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    return ctx.json({ error: `File exceeds maximum size (${maxSize / 1024 / 1024} MB)` }, 413);
  }

  // Build a unique key: folder/timestamp-filename
  const ext       = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safeName  = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const key       = `${folder}/${Date.now()}-${safeName}`;

  await ctx.env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  // Public URL — R2 custom domain or the R2.dev dev URL
  // Set R2_PUBLIC_URL in your Cloudflare env/secret for production
  const baseUrl   = (ctx.env as unknown as Record<string, string>)["R2_PUBLIC_URL"] ?? "";
  const url       = baseUrl ? `${baseUrl}/${key}` : `/api/media/${key}`;

  return ctx.json({ url, key });
});

// ─── GET /api/media/* ─────────────────────────────────────────────────────────
// Serves a file from R2 (use a public R2 custom domain in production instead)
media.get("/*", async (ctx) => {
  const key = ctx.req.param("*");
  const object = await ctx.env.MEDIA.get(key);
  if (!object) return ctx.json({ error: "Not found" }, 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body, { headers });
});

// ─── DELETE /api/media ────────────────────────────────────────────────────────
// Body: { key: string }
media.delete("/", requireAuth, async (ctx) => {
  const body = await ctx.req.json<{ key?: string }>();
  if (!body.key) return ctx.json({ error: "key is required" }, 400);
  await ctx.env.MEDIA.delete(body.key);
  return ctx.json({ ok: true });
});

export default media;
