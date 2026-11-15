import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Footer as SiteFooter } from "@/components/site-footer";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";
import hero from "@/assets/insights-hero.jpg";
import { postsSeed, fetchInsights, type Post } from "@/lib/insights";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — ADZVO" },
      { name: "description", content: "Practical thinking on brands, growth, AI, film and the ideas shaping modern creative work." },
      { property: "og:title", content: "ADZVO Insights" },
      { property: "og:description", content: "Practical thinking on brands, growth, AI, film and the ideas shaping modern creative work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InsightsPage,
});

const tags = ["All", ...Array.from(new Set(postsSeed.map((p) => p.tag)))];

function PostCard({ post, onOpen }: { post: Post; onOpen: () => void }) {
  const [i, setI] = useState(0);
  const n = post.images.length;
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 4000);
    return () => clearInterval(t);
  }, [n, i]);
  return (
    <article className="flex flex-col">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy shadow-[0_14px_36px_-22px] shadow-navy/40">
        {post.images.map((src, k) => (
          <img key={k} src={src} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${k === i ? "opacity-100" : "opacity-0"}`} />
        ))}
        <span className="absolute right-3 top-3 rounded-md bg-navy/70 px-2 py-1 text-xs font-bold tracking-wider text-primary-foreground backdrop-blur" style={LOGO_FONT}>{i + 1} / {n}</span>
        <button aria-label="Previous image" onClick={() => setI((i - 1 + n) % n)} className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/30 bg-navy/60 text-primary-foreground backdrop-blur hover:bg-navy"><ArrowLeft className="h-4 w-4" /></button>
        <button aria-label="Next image" onClick={() => setI((i + 1) % n)} className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/30 bg-navy/60 text-primary-foreground backdrop-blur hover:bg-navy"><ArrowRight className="h-4 w-4" /></button>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-navy/60 px-3 py-2 backdrop-blur">
          {post.images.map((_, k) => <button key={k} aria-label={`Image ${k + 1}`} onClick={() => setI(k)} className={`h-2 w-2 rounded-full ${k === i ? "bg-gold" : "bg-primary-foreground/50"}`} />)}
        </div>
      </div>
      <span className="mt-5 w-fit rounded-md bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-navy" style={LOGO_FONT}>{post.tag}</span>
      <h2 className="mt-3 font-display text-lg font-bold leading-snug text-navy">{post.title}</h2>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
      <button onClick={onOpen} className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg border border-navy/25 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-navy transition hover:border-navy hover:bg-navy hover:text-primary-foreground">Read more <ArrowUpRight className="h-4 w-4" /></button>
    </article>
  );
}

function InsightsPage() {
  const [tag, setTag] = useState("All");
  const [open, setOpen] = useState<Post | null>(null);
  const [allPosts, setAllPosts] = useState<Post[]>(postsSeed);

  useEffect(() => {
    void fetchInsights().then(setAllPosts);
  }, []);

  const list = tag === "All" ? allPosts : allPosts.filter((p) => p.tag === tag);
  return (
    <>
      <main className="bg-off pb-24">
        <section className="relative isolate overflow-hidden bg-navy pb-28 pt-40 text-center text-primary-foreground">
          <img src={hero} alt="" width={1920} height={832} className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/70 via-navy/40 to-navy/80" />
          <div className="page-shell">
            <p><SectionLabel light>Knowledge & Perspectives</SectionLabel></p>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-6xl">ADZVO <Highlight dark>Insights</Highlight></h1>
            <p className="mx-auto mt-7 max-w-xl text-primary-foreground/80">Practical thinking on brands, growth, AI and the creative ideas shaping how businesses connect with people.</p>
          </div>
        </section>
        <div className="page-shell relative z-10 -mt-6 flex flex-wrap justify-center gap-3">
          {tags.map((t) => (
            <button key={t} onClick={() => setTag(t)} aria-pressed={t === tag} className={`rounded-xl border px-5 py-2.5 text-sm font-semibold shadow-lg shadow-navy/10 transition ${t === tag ? "border-gold bg-gold text-navy" : "border-navy/10 bg-card text-navy hover:border-gold"}`}>{t}</button>
          ))}
        </div>
        <section className="page-shell mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => <PostCard key={p.title} post={p} onOpen={() => setOpen(p)} />)}
        </section>
      </main>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          {open && (<>
            <img src={open.images[0]} alt="" className="aspect-video w-full rounded-2xl object-cover" />
            <DialogHeader>
              <span className="w-fit rounded-md bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-navy" style={LOGO_FONT}>{open.tag}</span>
              <DialogTitle className="font-display text-2xl font-extrabold text-navy">{open.title}</DialogTitle>
              <DialogDescription>{open.excerpt}</DialogDescription>
            </DialogHeader>
            <p className="text-sm leading-relaxed text-foreground">{open.body}</p>
          </>)}
        </DialogContent>
      </Dialog>
      <SiteFooter />
    </>
  );
}
