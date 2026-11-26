/**
 * Gives every page its own HTML file with its own title, description, canonical link
 * and share-preview tags (runs after `vite build`, see "build" in package.json).
 *
 * Why: WhatsApp, LinkedIn, Facebook, X, Bing and AI tools mostly don't run JavaScript,
 * so without this they see the homepage's tags on every address.
 *
 * • Page titles and descriptions come from src/lib/seo.ts — still the ONE place to edit them.
 * • dist/contact.html is served by Cloudflare at /contact, dist/services/x.html at /services/x.
 * • The page itself still loads exactly as before; these tags are swapped for the live ones on load.
 * • Articles are read from the live API. If it can't be reached, articles fall back to the
 *   normal page (homepage tags) until the next deploy — nothing breaks.
 * • A new page needs one line in PAGES below (and in generate-sitemap.mjs).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { runnerImport } from "vite";

const API = process.env.VITE_API_BASE ?? "https://api.adzvo.com";
const MIN_INDEXABLE_WORDS = 300; // same rule as src/routes/resources.$slug.tsx

const { module: seo } = await runnerImport("./src/lib/seo.ts");
const { PAGE_SEO, SERVICE_SEO, SHARE_IMAGE, canonicalUrl } = seo;

// address → entry in PAGE_SEO (the homepage stays in dist/index.html)
const PAGES = {
  "/about": "about",
  "/projects": "projects",
  "/resources": "resources",
  "/contact": "contact",
  "/careers": "careers",
  "/privacy-policy": "privacy",
  "/terms-and-conditions": "terms",
  "/cookie-policy": "cookies",
};

const attr = (s = "") => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const toIso = (v) => {
  if (!v) return undefined;
  const d = new Date(String(v).includes("T") ? v : String(v).replace(" ", "T") + "Z");
  return isNaN(d.getTime()) ? undefined : d.toISOString();
};
const words = (t = "") => t.trim().split(/\s+/).filter(Boolean).length;
const meta = (key, name, content) => `    <meta ${key}="${name}" content="${attr(content)}" data-static-seo />`;

function headTags({ path, title, description, type = "website", image, robots, published }) {
  const url = canonicalUrl(path);
  const img = image
    ? [meta("property", "og:image", image), meta("name", "twitter:image", image)]
    : [
        meta("property", "og:image", SHARE_IMAGE.url),
        meta("property", "og:image:width", SHARE_IMAGE.width),
        meta("property", "og:image:height", SHARE_IMAGE.height),
        meta("property", "og:image:alt", SHARE_IMAGE.alt),
        meta("name", "twitter:image", SHARE_IMAGE.url),
      ];
  return [
    meta("name", "description", description),
    `    <title data-static-seo>${attr(title)}</title>`,
    ...(robots ? [meta("name", "robots", robots)] : []),
    `    <link rel="canonical" href="${attr(url)}" data-static-seo />`,
    meta("property", "og:type", type),
    ...(published ? [meta("property", "article:published_time", published)] : []),
    meta("property", "og:site_name", "ADZVO"),
    meta("property", "og:url", url),
    meta("property", "og:title", title),
    meta("property", "og:description", description),
    ...img,
    meta("name", "twitter:card", "summary_large_image"),
  ].join("\n");
}

if (!existsSync("dist/index.html")) throw new Error("[prerender] dist/index.html not found — run vite build first");
const shell = readFileSync("dist/index.html", "utf8");
const ANCHOR = /(<meta name="viewport"[^>]*>\n)/;
if (!ANCHOR.test(shell)) throw new Error("[prerender] viewport tag not found in dist/index.html");
// the shell without its homepage tags (every line carrying data-static-seo)
const bare = shell.split("\n").filter((l) => !l.includes("data-static-seo")).join("\n");

function write(path, tags) {
  const file = `dist${path}.html`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, bare.replace(ANCHOR, `$1${tags}\n`));
}

let count = 0;
for (const [path, key] of Object.entries(PAGES)) {
  const s = PAGE_SEO[key];
  if (!s) throw new Error(`[prerender] PAGE_SEO.${key} missing in src/lib/seo.ts`);
  write(path, headTags({ path, ...s }));
  count++;
}
for (const [slug, s] of Object.entries(SERVICE_SEO)) {
  write(`/services/${slug}`, headTags({ path: `/services/${slug}`, ...s }));
  count++;
}
write("/adzvoadmin", [
  `    <title data-static-seo>Admin Workspace — ADZVO</title>`,
  meta("name", "robots", "noindex, nofollow"),
].join("\n"));
count++;

let articles = 0;
try {
  const res = await fetch(`${API}/api/insights`, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error("unexpected response");
  for (const a of rows) {
    if (!a?.id || !/^[A-Za-z0-9_-]+$/.test(a.id)) continue; // only plain slugs make safe file names
    const path = `/resources/${a.id}`;
    const image = Array.isArray(a.images) && typeof a.images[0] === "string" && a.images[0].startsWith("http") ? a.images[0] : undefined;
    write(path, headTags({
      path,
      title: `${a.title} | ADZVO`,
      description: a.excerpt || "ADZVO Resources — practical thinking on brands, growth, AI and creative work.",
      type: "article",
      image,
      robots: words(a.body) >= MIN_INDEXABLE_WORDS ? "index, follow" : "noindex, follow",
      published: toIso(a.created_at),
    }));
    articles++;
  }
} catch (err) {
  console.warn(`[prerender] Could not load articles (${err.message}) — they keep the default tags until the next deploy.`);
}

console.log(`[prerender] wrote ${count} page files and ${articles} article files`);
