import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import type { Bindings } from "../types";

const media = new Hono<{ Bindings: Bindings }>();

// ─── Allowed MIME types ────────────────────────────────────────────────────────
const ALLOWED_DOC_TYPES = new Set([
  "application/pdf",  // .pdf
]);
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",       // .jpg / .jpeg
  "image/png",        // .png
  "image/webp",       // .webp
  "image/avif",       // .avif
  "image/gif",        // .gif
  "image/svg+xml",    // .svg
  "image/tiff",       // .tiff / .tif
  "image/bmp",        // .bmp
  "image/heic",       // .heic  (Apple)
  "image/heif",       // .heif  (Apple)
  "image/x-icon",     // .ico
  "image/vnd.microsoft.icon", // .ico (alt MIME)
]);
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",        // .mp4
  "video/webm",       // .webm
  "video/ogg",        // .ogv
  "video/quicktime",  // .mov
  "video/x-msvideo",  // .avi
  "video/x-matroska", // .mkv
  "video/3gpp",       // .3gp
  "video/x-ms-wmv",   // .wmv
]);
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;   // 20 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;  // 500 MB
const MAX_DOC_SIZE   = 50 * 1024 * 1024;   // 50 MB

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
  const isDoc   = ALLOWED_DOC_TYPES.has(file.type);

  if (!isImage && !isVideo && !isDoc) {
    return ctx.json({ error: `Unsupported file type: ${file.type}` }, 415);
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : isDoc ? MAX_DOC_SIZE : MAX_IMAGE_SIZE;
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
