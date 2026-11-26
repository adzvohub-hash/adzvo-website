import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GlassButton } from "@/components/glass-button";
import { ArrowLeft } from "lucide-react";
import { Footer as SiteFooter } from "@/components/site-footer";
import { LOGO_FONT } from "@/components/brand-logo";
import { fetchInsights, type Post } from "@/lib/insights";
import { canonicalUrl, shareImageMeta } from "@/lib/seo";

/** Articles shorter than this are kept out of Google until they're written in full.
 *  Thin pages can lower how Google rates the whole site. Once an article in the admin
 *  reaches this length it becomes indexable automatically — no code change needed. */
const MIN_INDEXABLE_WORDS = 300;

/** The database stores UTC times like "2026-11-26 07:40:12"; this turns one into a real date (or null). */
function parseDbDate(v?: string): Date | null {
  if (!v) return null;
  const d = new Date(v.includes("T") ? v : v.replace(" ", "T") + "Z");
  return isNaN(d.getTime()) ? null : d;
}
/** "26 November 2026", in India time. */
const formatPostDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

/**
 * Turns the plain text typed in the admin into paragraphs and subheadings:
 * • every line (or blank-line-separated block) becomes its own paragraph;
 * • a short line with no full stop at the end — or a line starting with "## " — becomes a subheading.
 */
function ArticleBody({ body }: { body: string }) {
  const lines = body.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const isHeading = (l: string) =>
    l.startsWith("## ") || (l.length <= 80 && l.split(/\s+/).length <= 12 && !/[.!?:;,"”)]$/.test(l));
  return (
    <div className="mt-8 space-y-5 text-base leading-[1.85] text-foreground">
      {lines.map((l, i) =>
        isHeading(l) ? (
          <h2 key={i} className="!mt-10 font-display text-2xl font-bold leading-snug text-foreground">{l.replace(/^##\s+/, "")}</h2>
        ) : (
          <p key={i}>{l}</p>
        ),
      )}
    </div>
  );
}
const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const Route = createFileRoute("/resources/$slug")({
  // Load the live article (from the API, falling back to the built-in defaults) before the
  // page renders, so the title, description and robots rule match what's actually published.
  loader: async ({ params }) => {
    const all: Post[] = await fetchInsights();
    return { all, post: all.find((p) => p.id === params.slug) ?? null };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post ?? null;
    const url = canonicalUrl(`/resources/${params.slug}`);
    const indexable = !!post && wordCount(post.body) >= MIN_INDEXABLE_WORDS;
    return {
      meta: [
        { title: post ? `${post.title} | ADZVO` : "Article not found | ADZVO" },
        { name: "description", content: post?.excerpt ?? "ADZVO Resources — practical thinking on brands, growth, AI and creative work." },
        { name: "robots", content: indexable ? "index, follow" : "noindex, follow" },
        { property: "og:title", content: post ? post.title : "ADZVO Resources" },
        { property: "og:description", content: post?.excerpt ?? "" },
        { property: "og:type", content: "article" },
        ...(parseDbDate(post?.created_at) ? [{ property: "article:published_time", content: parseDbDate(post?.created_at)!.toISOString() }] : []),
        ...(parseDbDate(post?.updated_at) ? [{ property: "article:modified_time", content: parseDbDate(post?.updated_at)!.toISOString() }] : []),
        { property: "og:site_name", content: "ADZVO" },
        { name: "twitter:card", content: "summary_large_image" },
        ...shareImageMeta(post?.images[0] || undefined),
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ResourcePage,
});

/**
 * Article hero: every image the article has, cross-fading slowly one into the next
 * (each shows for 7 s, the fade takes 3 s). One image = a still picture; none = plain navy.
 * Visitors who ask their device for reduced motion see the first image only.
 */
function HeroSlideshow({ images, title }: { images: string[]; title: string }) {
  const list = images.filter(Boolean);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (list.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % list.length), 7000);
    return () => clearInterval(t);
  }, [list.length]);
  return (
    <>
      {list.map((src, k) => (
        <img
          key={src + k}
          src={src}
          alt={k === 0 ? title : ""}
          loading={k === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out ${k === i ? "opacity-70" : "opacity-0"}`}
        />
      ))}
    </>
  );
}

function ResourcePage() {
  const { post } = Route.useLoaderData() as { all: Post[]; post: Post | null };

  if (!post) {
    return (
      <>
        <main className="page-shell flex min-h-[60vh] flex-col items-center justify-center gap-6 pb-24 pt-40">
          <h1 className="font-display text-3xl font-extrabold text-navy">Article not found</h1>
          <Link to="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Resources
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const published = parseDbDate(post.created_at);
  const modified = parseDbDate(post.updated_at);
  // Tells Google this is an article by ADZVO and when it was published (can show the date in results).
  const articleData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    ...(post.images[0] ? { image: post.images.filter(Boolean) } : {}),
    ...(published ? { datePublished: published.toISOString() } : {}),
    ...(modified ? { dateModified: modified.toISOString() } : {}),
    author: { "@type": "Organization", name: "ADZVO", url: "https://adzvo.com/" },
    publisher: { "@id": "https://adzvo.com/#organization" },
    mainEntityOfPage: canonicalUrl(`/resources/${post.id}`),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, "\\u003c") }} />
      <main className="bg-off pb-24">
        {/* Hero image */}
        <div className="relative isolate h-[50vh] min-h-[320px] overflow-hidden bg-navy">
          <HeroSlideshow images={post.images} title={post.title} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/30 to-navy/80" />
          {/* Back link */}
          <div className="absolute left-0 top-0 p-6 md:p-10">
            <GlassButton as={Link} to="/resources" variant="secondary" on="dark" size="sm">
              <ArrowLeft className="h-4 w-4" /> Resources
            </GlassButton>
          </div>
          {/* Tag + title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-14">
            <div className="page-shell">
              <span
                className="inline-block rounded-md bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-navy"
                style={LOGO_FONT}
              >
                {post.tag}
              </span>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                {post.title}
              </h1>
              {published && (
                <p className="mt-3 text-sm font-medium text-white/80">
                  Posted on <time dateTime={published.toISOString()}>{formatPostDate(published)}</time>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Article body */}
        <article className="page-shell mt-12 max-w-3xl">
          <p className="text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <div className="mt-8 h-px bg-border" />
          <ArticleBody body={post.body} />


          <div className="mt-14">
            <GlassButton as={Link} to="/resources" variant="secondary">
              <ArrowLeft className="h-4 w-4" /> Back To Resources
            </GlassButton>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
