import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Bindings } from "./types";
import auth     from "./routes/auth";
import home     from "./routes/home";
import projects from "./routes/projects";
import insights from "./routes/insights";
import media    from "./routes/media";

const app = new Hono<{ Bindings: Bindings }>();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use("*", (ctx, next) => {
  // CORS_ORIGIN can be a comma-separated list e.g. "https://adzvo.com,https://adzvo-website.adzvohub.workers.dev"
  const allowed = (ctx.env.CORS_ORIGIN ?? "*").split(",").map((s) => s.trim());
  return cors({
    origin: (origin) => allowed.includes("*") || allowed.includes(origin) ? origin : allowed[0],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })(ctx, next);
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (ctx) => ctx.json({ ok: true, env: ctx.env.ENVIRONMENT }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.route("/api/auth",     auth);
app.route("/api/home",     home);
app.route("/api/projects", projects);
app.route("/api/insights", insights);
app.route("/api/media",    media);

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.notFound((ctx) => ctx.json({ error: "Not found" }, 404));

export default app;
