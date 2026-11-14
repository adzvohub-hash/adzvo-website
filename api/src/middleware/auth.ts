import type { Context, Next } from "hono";
import type { Bindings } from "../types";

// ─── Minimal JWT helpers (no external deps — Workers crypto is available) ─────

function base64url(data: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: object, secret: string): Promise<string> {
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body   = base64url(new TextEncoder().encode(JSON.stringify(payload)));
  const key    = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${body}`));
  return `${header}.${body}.${base64url(sig)}`;
}

async function verify(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
  );
  const sigBytes = Uint8Array.from(atob(sig.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
  const valid = await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(`${header}.${body}`));
  if (!valid) return null;
  try {
    const payload = JSON.parse(atob(body.replace(/-/g, "+").replace(/_/g, "/"))) as Record<string, unknown>;
    if (typeof payload.exp === "number" && payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createToken(username: string, secret: string): Promise<string> {
  return sign(
    { sub: username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 }, // 8 h
    secret
  );
}

// ─── Middleware ────────────────────────────────────────────────────────────────

export async function requireAuth(ctx: Context<{ Bindings: Bindings }>, next: Next) {
  const auth = ctx.req.header("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return ctx.json({ error: "Unauthorized" }, 401);
  const payload = await verify(token, ctx.env.JWT_SECRET);
  if (!payload) return ctx.json({ error: "Invalid or expired token" }, 401);
  await next();
}
