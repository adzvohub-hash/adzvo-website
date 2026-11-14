import { Hono } from "hono";
import { createToken } from "../middleware/auth";
import type { Bindings } from "../types";

const auth = new Hono<{ Bindings: Bindings }>();

// POST /api/auth/login
// Body: { username: string, password: string }
// Returns: { token: string }
auth.post("/login", async (ctx) => {
  const body = await ctx.req.json<{ username?: string; password?: string }>();
  const { username = "", password = "" } = body;

  if (
    username !== ctx.env.ADMIN_USERNAME ||
    password !== ctx.env.ADMIN_PASSWORD
  ) {
    return ctx.json({ error: "Invalid username or password" }, 401);
  }

  const token = await createToken(username, ctx.env.JWT_SECRET);
  return ctx.json({ token });
});

export default auth;
