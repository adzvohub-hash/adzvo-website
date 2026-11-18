import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Footer as SiteFooter } from "@/components/site-footer";
import { LOGO_FONT } from "@/components/brand-logo";
import { postsSeed, fetchInsights, type Post } from "@/lib/insights";

export const Route = createFileRoute("/resources/$slug")({
  head: ({ params }) => {
    const post = postsSeed.find((p) => p.id === params.slug);
    return {
      meta: [
        { title: post ? `${post.title} — ADZVO Resources` : "Resources — ADZVO" },
        { name: "description", content: post?.excerpt ?? "ADZVO Resources — practical thinking on brands, growth, AI and creative work." },
        { property: "og:title", content: post ? post.title : "ADZVO Resources" },
        { property: "og:description", content: post?.excerpt ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:image", content: post?.images[0] ?? "" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: post?.images[0] ?? "" },
      ],
    };
  },
  component: ResourcePage,
});

function ResourcePage() {
  const { slug } = Route.useParams();
  const [allPosts, setAllPosts] = useState<Post[]>(postsSeed);

  useEffect(() => {
    void fetchInsights().then(setAllPosts);
  }, []);

  const post = allPosts.find((p) => p.id === slug);

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

  return (
    <>
      <main className="bg-off pb-24">
        {/* Hero image */}
        <div className="relative isolate h-[50vh] min-h-[320px] overflow-hidden bg-navy">
          <img src={post.images[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/30 to-navy/80" />
          {/* Back link */}
          <div className="absolute left-0 top-0 p-6 md:p-10">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-navy/50 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-navy"
            >
              <ArrowLeft className="h-4 w-4" /> Resources
            </Link>
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
            </div>
          </div>
        </div>

        {/* Article body */}
        <article className="page-shell mt-12 max-w-3xl">
          <p className="text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <div className="mt-8 h-px bg-border" />
          <p className="mt-8 text-base leading-[1.85] text-foreground">{post.body}</p>

          {/* Image gallery if more than one image */}
          {post.images.length > 1 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {post.images.slice(1).map((src, i) => (
                <img key={i} src={src} alt="" className="aspect-video w-full rounded-2xl object-cover" />
              ))}
            </div>
          )}

          <div className="mt-14">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 rounded-lg border border-navy/25 px-4 py-2.5 text-sm font-bold text-navy transition hover:border-navy hover:bg-navy hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back To Resources
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
