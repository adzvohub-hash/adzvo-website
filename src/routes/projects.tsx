import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { FileText, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Footer as SiteFooter } from "@/components/site-footer";
import { Highlight, LOGO_FONT, SectionLabel } from "@/components/brand-logo";
import projectsHero from "@/assets/projects-hero.jpg";
import { servicePages } from "@/lib/services";
import { projectLocations, projectsSeed, fetchProjects, type Project } from "@/lib/projects";

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
  const [allProjects, setAllProjects] = useState<Project[]>(projectsSeed);

  useEffect(() => {
    void fetchProjects().then(setAllProjects);
  }, []);

  const list = useMemo(() => allProjects.filter((p) => (service === "all" || p.service === service) && (location === "all" || p.location === location)), [allProjects, service, location]);
  const selectCls = "h-11 rounded-xl border border-navy/15 bg-card px-3 text-sm font-medium normal-case tracking-normal text-navy outline-none transition focus:border-navy focus:ring-[3px] focus:ring-gold/40";

  return (
    <>
      <main className="bg-off pb-24">
        <section className="relative isolate overflow-hidden bg-navy pb-20 pt-40 text-center text-primary-foreground">
          <img src={projectsHero} alt="" width={1920} height={832} className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/70 via-navy/40 to-navy/80" />
          <div className="page-shell">
            <p><SectionLabel light>Portfolio</SectionLabel></p>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-6xl">Our <Highlight dark>Projects</Highlight></h1>
            <p className="mx-auto mt-7 max-w-2xl text-primary-foreground/80">Explore our portfolio of work across India and global markets, spanning every ADZVO service.</p>
          </div>
        </section>
        <section className="page-shell mt-10">
          <div className="flex flex-wrap items-end gap-4">
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-navy/70" style={LOGO_FONT}>Category
              <select aria-label="Category" className={selectCls} value={service} onChange={(e) => setService(e.target.value)}>
                <option value="all">All Categories</option>
                {servicePages.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-navy/70" style={LOGO_FONT}>Location
              <select aria-label="Location" className={selectCls} value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="all">All Locations</option>
                {projectLocations.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
            <p className="ml-auto text-sm font-bold uppercase tracking-[0.18em] text-navy/70" style={LOGO_FONT}>{list.length} project{list.length === 1 ? "" : "s"}</p>
          </div>
          {list.length === 0 ? <p className="py-20 text-center text-muted-foreground">No projects match these filters.</p> :
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => {
              const s = serviceOf(p.service);
              return (
                <article key={p.id} className="group flex flex-col overflow-hidden rounded-3xl border border-navy/10 bg-card shadow-[0_14px_36px_-22px] shadow-navy/30 transition duration-300 hover:-translate-y-1.5 hover:border-gold">
                  <img src={p.image_url || s.image} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-navy/70" style={LOGO_FONT}><span className="size-1.5 shrink-0 rounded-full bg-gold" />{s.title}</p>
                    <h2 className="mt-3 font-display text-lg font-bold leading-snug text-navy">{p.title}</h2>
                    <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{p.client} · {p.location}</p>
                    <div className="mt-auto flex gap-2 pt-5">
                      <Button size="sm" className="rounded-lg bg-navy font-semibold text-primary-foreground hover:bg-gold hover:text-navy" onClick={() => setActive(p)}>More</Button>
                      {p.case_study_url && <Button size="sm" variant="outline" className="rounded-lg border-navy/20 font-semibold text-navy hover:border-navy hover:bg-navy hover:text-primary-foreground" asChild><a href={p.case_study_url} target="_blank" rel="noopener noreferrer"><FileText />Case Study</a></Button>}
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
              <DialogTitle className="font-display text-2xl font-extrabold text-navy">{active.title}</DialogTitle>
              <DialogDescription>{active.client} · {active.location} · {serviceOf(active.service).title}</DialogDescription>
            </DialogHeader>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-navy" style={LOGO_FONT}>Project Description</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{active.description}</p>
            </div>
            {(active.image_url || serviceOf(active.service).image) && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-navy" style={LOGO_FONT}>Images</h3>
                <img src={active.image_url || serviceOf(active.service).image} alt={active.title} className="mt-3 h-40 w-56 rounded-xl object-cover" />
              </div>
            )}
            {active.case_study_url && <Button asChild className="w-fit rounded-xl bg-gold font-bold text-navy hover:bg-gold hover:brightness-110"><a href={active.case_study_url} target="_blank" rel="noopener noreferrer"><FileText />View Case Study</a></Button>}
          </>}
        </DialogContent>
      </Dialog>
      <SiteFooter />
    </>
  );
}
