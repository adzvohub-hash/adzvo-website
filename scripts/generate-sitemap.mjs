/**
 * Writes dist/sitemap.xml after `vite build` (see "build" in package.json).
 *
 * • Fixed pages are listed below — add a line here when a new page is created.
 * • Articles are read from the live API. An article is included only once its body
 *   reaches MIN_INDEXABLE_WORDS (the same rule that hides short articles from Google
 *   in src/routes/resources.$slug.tsx), so the sitemap never lists a hidden page.
 * • If the API can't be reached during the build, the fixed pages are still written.
 *   New articles appear in the sitemap on the next deploy (any git push).
 */
import { writeFileSync, existsSync } from "node:fs";

const SITE = "https://adzvo.com";
const API = process.env.VITE_API_BASE ?? "https://api.adzvo.com";
const MIN_INDEXABLE_WORDS = 300;

const SERVICES = [
  "digital-technology", "marketing-growth", "branding-design", "film-video-photography",
  "animation-content", "ai-automation", "content-localization", "strategy-analytics",
];

const FIXED = [
  { path: "/", priority: "1.0" },
  ...SERVICES.map((s) => ({ path: `/services/${s}`, priority: "0.9" })),
  { path: "/contact", priority: "0.8" },
  { path: "/about", priority: "0.7" },
  { path: "/projects", priority: "0.7" },
  { path: "/resources", priority: "0.6" },
  { path: "/careers", priority: "0.4" },
  { path: "/privacy-policy", priority: "0.2" },
  { path: "/terms-and-conditions", priority: "0.2" },
  { path: "/cookie-policy", priority: "0.2" },
];

const words = (t = "") => t.trim().split(/\s+/).filter(Boolean).length;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function articles() {
  try {
    const res = await fetch(`${API}/api/insights`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    if (!Array.isArray(rows)) throw new Error("unexpected response");
    const keep = rows.filter((a) => a?.id && words(a.body) >= MIN_INDEXABLE_WORDS);
    console.log(`[sitemap] ${keep.length} of ${rows.length} articles are long enough to include`);
    return keep.map((a) => ({
      path: `/resources/${encodeURIComponent(a.id)}`,
      priority: "0.5",
      lastmod: a.updated_at ? String(a.updated_at).slice(0, 10) : undefined,
    }));
  } catch (err) {
    console.warn(`[sitemap] Could not load articles (${err.message}) — writing fixed pages only.`);
    return [];
  }
}

const entries = [...FIXED, ...(await articles())];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url><loc>${esc(SITE + e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}<priority>${e.priority}</priority></url>`).join("\n")}
</urlset>
`;

if (!existsSync("dist")) throw new Error("[sitemap] dist/ not found — run vite build first");
writeFileSync("dist/sitemap.xml", xml);
console.log(`[sitemap] wrote dist/sitemap.xml with ${entries.length} URLs`);
