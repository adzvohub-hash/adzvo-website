import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Footer as SiteFooter } from "@/components/site-footer";
import projectsHero from "@/assets/projects-hero.jpg";
import { servicePages } from "@/lib/services";
import { projectLocations, projects, type Project } from "@/lib/projects";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — ADZVO Portfolio" },
      { name: "description", content: "Explore ADZVO projects across India and global markets, filterable by service and location." },
      { property: "og:title", content: "Projects — ADZVO Portfolio" },
      { property: "og:description", content: "Explore ADZVO projects across India and global markets, filterable by service and location." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProjectsPage,
});

const serviceOf = (slug: string) => servicePages.find((s) => s.slug === slug)!;

function ProjectsPage() {
  const [service, setService] = useState("all");
  const [location, setLocation] = useState("all");
  const [active, setActive] = useState<Project | null>(null);
  const list = useMemo(() => projects.filter((p) => (service === "all" || p.service === service) && (location === "all" || p.location === location)), [service, location]);
  const selectCls = "h-11 rounded-md border border-border bg-background px-3 text-sm text-navy";

  return (
    <>
      <main className="pb-24">
        <section className="relative isolate overflow-hidden bg-navy pb-20 pt-40 text-center text-primary-foreground">
          <img src={projectsHero} alt="" width={1920} height={832} className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/70 via-navy/40 to-navy/80" />
          <div className="page-shell">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Portfolio</p>
            <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl">Our Projects</h1>
            <p className="mx-auto mt-5 max-w-2xl text-primary-foreground/75">Explore our portfolio of work across India and global markets, spanning every ADZVO service.</p>
          </div>
        </section>
        <section className="page-shell mt-10">
          <div className="flex flex-wrap items-end gap-4">
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category
              <select aria-label="Category" className={selectCls} value={service} onChange={(e) => setService(e.target.value)}>
                <option value="all">All Categories</option>
                {servicePages.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location
              <select aria-label="Location" className={selectCls} value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="all">All Locations</option>
                {projectLocations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
            <p className="ml-auto text-sm text-muted-foreground">{list.length} project{list.length === 1 ? "" : "s"}</p>
          </div>
          {list.length === 0 ? <p className="py-20 text-center text-muted-foreground">No projects match these filters.</p> :
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => {
              const s = serviceOf(p.service);
              return (
                <article key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
                  <img src={s.image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-electric">{s.title}</p>
                    <h2 className="mt-2 font-semibold text-navy">{p.title}</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{p.client} · {p.location}</p>
                    <div className="mt-auto flex gap-2 pt-5">
                      <Button size="sm" onClick={() => setActive(p)}>More</Button>
                      <Button size="sm" variant="outline" asChild><a href={p.caseStudyUrl} target="_blank" rel="noopener noreferrer"><FileText />Case Study</a></Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>}
        </section>
      </main>
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl">
          {active && <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-navy">{active.title}</DialogTitle>
              <DialogDescription>{active.client} · {active.location} · {serviceOf(active.service).title}</DialogDescription>
            </DialogHeader>
            <div>
              <h3 className="font-semibold text-navy">Project Description</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-navy">Images</h3>
              <img src={serviceOf(active.service).image} alt={active.title} className="mt-3 h-40 w-56 rounded-xl object-cover" />
            </div>
            <Button variant="outline" asChild className="w-fit"><a href={active.caseStudyUrl} target="_blank" rel="noopener noreferrer"><FileText />View Case Study</a></Button>
          </>}
        </DialogContent>
      </Dialog>
      <SiteFooter />
    </>
  );
}
