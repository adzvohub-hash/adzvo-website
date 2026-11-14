import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, BarChart3, Check, ChevronRight, Eye, EyeOff, Film, Home, Images, LayoutGrid, LockKeyhole, LogOut, MapPin, Pencil, Plus, Search, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaField, MediaPreview } from "./media-field";
import { InsightEditor, ProjectEditor, selectClass } from "./content-editor";
import { acceptsPreviewLogin, initialMetrics, initialPosts, initialProjects, upsertPreviewItem, validMediaUrl, type AdminPost, type AdminProject } from "@/lib/admin-preview";
import { servicePages } from "@/lib/services";
import { BrandLogo } from "@/components/brand-logo";
import { HERO_VIDEO_URL } from "@/lib/videos";
import loginImage from "@/assets/about-hero.jpg";

const tabs = ["Home", "About", "Services", "Projects", "Insights"] as const;
type Tab = (typeof tabs)[number];
const homeSections = [{ title: "Hero Page", icon: Film }, { title: "ADZVO Impact", icon: BarChart3 }, { title: "What We Do", icon: Images }] as const;
type HomeSection = (typeof homeSections)[number]["title"];

function LoginView({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!acceptsPreviewLogin(username, password)) { setError("The username or password is incorrect."); return; }
    setPassword(""); onLogin();
  }
  return <main className="grid min-h-svh bg-card lg:grid-cols-2">
    <section className="relative hidden overflow-hidden bg-navy text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
      <img src={loginImage} alt="ADZVO creative studio" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-navy/65" />
      <Link to="/" aria-label="ADZVO home" className="relative w-fit"><BrandLogo markClassName="size-11" textClassName="text-2xl" /></Link>
      <div className="relative max-w-lg"><span className="text-xs font-semibold uppercase tracking-widest text-gold">The studio, behind the scenes</span><h1 className="mt-5 font-display text-5xl leading-tight">Great work starts<br />with a clear view.</h1><p className="mt-6 text-sm text-primary-foreground/75">ADZVO content workspace</p></div>
      <p className="relative text-xs text-primary-foreground/65">Creative thinking. Connected experiences.</p>
    </section>
    <section className="flex flex-col justify-center px-6 py-12 sm:px-14 lg:px-20">
      <div className="mx-auto w-full max-w-sm">
        <Link to="/" aria-label="ADZVO home" className="lg:hidden"><BrandLogo /></Link>
        <div className="mt-10 flex size-12 items-center justify-center rounded-lg bg-electric/10 text-electric lg:mt-0"><LockKeyhole className="size-5" /></div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-electric">Admin workspace</p>
        <h2 className="mt-3 font-display text-3xl">Welcome back.</h2>
        <p className="mt-3 text-sm text-muted-foreground">Sign in to your content preview.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="grid gap-2 text-sm font-medium">Username<Input required autoComplete="username" value={username} onChange={(event) => { setUsername(event.target.value); setError(""); }} className="h-11" /></label>
          <label className="grid gap-2 text-sm font-medium">Password<span className="relative"><Input required autoComplete="current-password" type={visible ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} className="h-11 pr-12" /><Button type="button" variant="ghost" size="icon" aria-label={visible ? "Hide password" : "Show password"} title={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)} className="absolute right-1 top-1">{visible ? <EyeOff /> : <Eye />}</Button></span></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="h-11 w-full bg-electric text-primary-foreground hover:bg-electric/90">Sign in<ChevronRight /></Button>
        </form>
        <p className="mt-6 border-t pt-5 text-xs leading-relaxed text-muted-foreground">Preview only · No secure login or saved changes. Refreshing resets the workspace.</p>
        <Button variant="link" asChild className="mt-4 px-0"><Link to="/">Back to website<ArrowUpRight /></Link></Button>
      </div>
    </section>
  </main>;
}

export function AdminDashboard() {
  const [signedIn, setSignedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("Home");
  const [homeSection, setHomeSection] = useState<HomeSection>("Hero Page");
  const [video, setVideo] = useState(HERO_VIDEO_URL);
  const [videoDraft, setVideoDraft] = useState(HERO_VIDEO_URL);
  const [metrics, setMetrics] = useState(initialMetrics.map((metric) => ({ ...metric })));
  const [metricDrafts, setMetricDrafts] = useState(initialMetrics.map((metric) => String(metric.value)));
  const [images, setImages] = useState<Record<string, string>>(Object.fromEntries(servicePages.map((service) => [service.slug, service.image])));
  const [imageDrafts, setImageDrafts] = useState<Record<string, string>>({ ...images });
  const [projectItems, setProjectItems] = useState(initialProjects.map((project) => ({ ...project })));
  const [postItems, setPostItems] = useState(initialPosts.map((post) => ({ ...post, images: [...post.images] })));
  const [projectEdit, setProjectEdit] = useState<AdminProject | null>(null);
  const [postEdit, setPostEdit] = useState<AdminPost | null>(null);
  const [deleteItem, setDeleteItem] = useState<{ id: string; title: string; type: "project" | "insight" } | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [postPreview, setPostPreview] = useState<AdminPost | null>(null);
  const [projectPreview, setProjectPreview] = useState<AdminProject | null>(null);
  function notify(message: string) { setNotice(message); setError(""); }
  function changeTab(value: Tab) { setTab(value); setSearch(""); setCategory("all"); setNotice(""); setError(""); }
  function applyHome(event: FormEvent) {
    event.preventDefault();
    if (homeSection === "Hero Page") {
      if (!validMediaUrl(videoDraft)) { setError("Use an HTTPS video URL or upload a video."); return; }
      setVideo(videoDraft);
    } else if (homeSection === "ADZVO Impact") {
      if (!metricDrafts.every((value) => value.trim() && Number.isSafeInteger(Number(value)) && Number(value) >= 0)) { setError("Enter a whole number of zero or more for each metric."); return; }
      setMetrics(metrics.map((metric, index) => ({ ...metric, value: Number(metricDrafts[index]) })));
    } else {
      if (!Object.values(imageDrafts).every(validMediaUrl)) { setError("Check the image links before applying changes."); return; }
      setImages({ ...imageDrafts });
    }
    notify("Changes applied to this preview only.");
  }
  if (!signedIn) return <LoginView onLogin={() => setSignedIn(true)} />;
  const query = search.trim().toLowerCase();
  const shownProjects = projectItems.filter((project) => (category === "all" || project.service === category) && `${project.title} ${project.client} ${project.location}`.toLowerCase().includes(query));
  const shownPosts = postItems.filter((post) => (category === "all" || post.tag === category) && `${post.title} ${post.excerpt}`.toLowerCase().includes(query));
  return <div className="min-h-svh bg-background">
    <header className="sticky top-0 z-30 border-b bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3"><Link to="/" aria-label="ADZVO home"><BrandLogo /></Link><span className="border-l pl-3 text-xs font-medium text-muted-foreground">Admin</span></div>
        <div className="flex items-center gap-2"><Button variant="ghost" size="sm" asChild><Link to="/">View site<ArrowUpRight /></Link></Button><Button variant="outline" size="sm" onClick={() => { setSignedIn(false); setNotice(""); }}><LogOut />Sign out</Button></div>
      </div>
      <nav aria-label="Admin navigation" className="flex gap-1 overflow-x-auto px-5 sm:px-8">{tabs.map((item) => <Button key={item} variant="ghost" aria-current={tab === item ? "page" : undefined} onClick={() => changeTab(item)} className={`h-12 shrink-0 rounded-none border-b-2 px-5 ${tab === item ? "border-electric text-electric" : "border-transparent text-muted-foreground"}`}>{item}</Button>)}</nav>
    </header>
    <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-gold/10 px-5 py-2.5 text-xs text-foreground sm:px-8"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-gold" />Preview workspace · Changes are temporary and do not affect the website.</span><span className="text-muted-foreground">Not connected</span></div>
    <div className={tab === "Home" ? "grid grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)]" : ""}>
      {tab === "Home" && <aside className="border-b bg-card px-5 py-5 lg:min-h-[calc(100svh-165px)] lg:border-b-0 lg:border-r lg:px-4 lg:py-8"><p className="mb-4 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Homepage</p><nav aria-label="Homepage sections" className="flex gap-2 overflow-x-auto lg:flex-col">{homeSections.map(({ title, icon: Icon }) => <Button key={title} variant={homeSection === title ? "secondary" : "ghost"} aria-current={homeSection === title ? "page" : undefined} onClick={() => { setHomeSection(title); setNotice(""); setError(""); }} className={`h-11 shrink-0 justify-start lg:w-full ${homeSection === title ? "bg-electric/10 text-electric" : "text-muted-foreground"}`}><Icon />{title}</Button>)}</nav></aside>}
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><Home className="size-3.5" />Workspace<ChevronRight className="size-3" />{tab}</p><h1 className="font-display text-3xl">{tab === "Home" ? homeSection : tab}</h1><p className="mt-2 text-sm text-muted-foreground">{tab === "Home" ? "Homepage content" : tab === "Projects" ? `${projectItems.length} projects in your portfolio` : tab === "Insights" ? `${postItems.length} articles in your library` : "Content management"}</p></div>
          {(tab === "Projects" || tab === "Insights") && <Button onClick={() => {
            if (tab === "Projects") setProjectEdit({ id: crypto.randomUUID(), title: "", client: "", location: "Bengaluru", service: "digital-technology", description: "", image: servicePages[0].image, caseStudyUrl: "" });
            else setPostEdit({ id: crypto.randomUUID(), title: "", tag: "", excerpt: "", body: "", images: [] });
          }} className="bg-electric text-primary-foreground hover:bg-electric/90"><Plus />{tab === "Projects" ? "Add project" : "Add insight"}</Button>}
        </div>
        {notice && <p role="status" className="mb-6 flex items-center gap-2 rounded-md border border-mint/30 bg-mint/10 px-4 py-3 text-sm"><Check className="size-4 text-mint" />{notice}</p>}
        {error && <p role="alert" className="mb-6 text-sm text-destructive">{error}</p>}
        {tab === "Home" && <form onSubmit={applyHome} className="space-y-7">
          {homeSection === "Hero Page" && <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"><div className="space-y-5"><h2 className="text-lg font-semibold">Background video</h2><MediaField label="Hero video URL" value={videoDraft} onChange={setVideoDraft} video /><p className="text-xs text-muted-foreground">16:9 landscape · MP4</p></div><div><p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Current preview</p><MediaPreview src={video} video /></div></div>}
          {homeSection === "ADZVO Impact" && <><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric, index) => <label key={metric.label} className="grid gap-2 text-sm font-medium">{metric.label}<Input type="number" required min={0} step={1} value={metricDrafts[index]} onChange={(event) => setMetricDrafts(metricDrafts.map((value, i) => i === index ? event.target.value : value))} /></label>)}</div><div className="border-t pt-8"><p className="text-xs uppercase tracking-wider text-muted-foreground">Current preview</p><h2 className="mt-3 font-display text-2xl">Ideas in Motion. Impact in Numbers.</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric, index) => <article key={metric.label} className={`rounded-lg border p-5 ${["bg-navy text-primary-foreground", "bg-electric/10", "bg-gold/15", "bg-mint/15"][index]}`}><p className="text-3xl font-bold">{metric.value}+</p><p className="mt-2 text-xs">{metric.label}</p></article>)}</div></div></>}
          {homeSection === "What We Do" && <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{servicePages.map((service) => <article key={service.slug} className="space-y-4 rounded-lg border bg-card p-4"><MediaPreview src={images[service.slug] ?? ""} /><h2 className="text-base font-semibold">{service.title}</h2><MediaField label={`${service.title} image URL`} value={imageDrafts[service.slug] ?? ""} onChange={(value) => setImageDrafts({ ...imageDrafts, [service.slug]: value })} /></article>)}</div>}
          <div className="flex justify-end border-t pt-5"><Button type="submit" className="bg-electric text-primary-foreground hover:bg-electric/90"><Check />Apply changes</Button></div>
        </form>}
        {(tab === "About" || tab === "Services") && <div className="flex min-h-72 flex-col items-center justify-center border-y py-16 text-center"><Settings2 className="size-8 text-muted-foreground" /><h2 className="mt-5 font-display text-2xl">{tab} content</h2><p className="mt-3 text-sm text-muted-foreground">Awaiting your content requirements.</p>{tab === "Services" && <div className="mt-8 grid gap-x-8 gap-y-3 text-left text-sm text-muted-foreground sm:grid-cols-2">{servicePages.map((service) => <span key={service.slug}>{service.title}</span>)}</div>}</div>}
        {(tab === "Projects" || tab === "Insights") && <>
          <div className="mb-7 flex flex-wrap items-center gap-3"><label className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label={`Search ${tab.toLowerCase()}`} placeholder={`Search ${tab.toLowerCase()}…`} value={search} onChange={(event) => setSearch(event.target.value)} className="h-10 pl-9" /></label><select aria-label="Filter category" value={category} onChange={(event) => setCategory(event.target.value)} className={`${selectClass} sm:max-w-xs`}><option value="all">All categories</option>{tab === "Projects" ? servicePages.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>) : Array.from(new Set(postItems.map((post) => post.tag))).map((tag) => <option key={tag}>{tag}</option>)}</select><span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground"><LayoutGrid className="size-4" />{tab === "Projects" ? shownProjects.length : shownPosts.length} results</span></div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {tab === "Projects" && shownProjects.map((project) => <article key={project.id} className="flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card"><MediaPreview src={project.image} /><div className="flex flex-1 flex-col p-5"><p className="text-xs font-semibold text-electric">{servicePages.find((service) => service.slug === project.service)?.title}</p><h2 className="mt-3 font-semibold">{project.title}</h2><p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3 shrink-0" />{project.client} · {project.location}</p><div className="mt-auto flex flex-wrap items-center gap-2 pt-5"><Button size="sm" variant="outline" onClick={() => setProjectPreview(project)}>More</Button>{project.caseStudyUrl && <Button size="sm" variant="ghost" asChild><a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer">Case Study<ArrowUpRight /></a></Button>}<div className="ml-auto flex"><Button size="icon" variant="ghost" aria-label={`Edit ${project.title}`} title="Edit project" onClick={() => setProjectEdit(project)}><Pencil /></Button><Button size="icon" variant="ghost" aria-label={`Delete ${project.title}`} title="Delete project" onClick={() => setDeleteItem({ id: project.id, title: project.title, type: "project" })} className="text-destructive"><Trash2 /></Button></div></div></div></article>)}
            {tab === "Insights" && shownPosts.map((post) => <article key={post.id} className="flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card"><div className="relative"><MediaPreview src={post.images[0] ?? ""} /><span className="absolute bottom-3 right-3 rounded bg-card/90 px-2 py-1 text-xs">{post.images.length} images</span></div><div className="flex flex-1 flex-col p-5"><p className="text-xs font-semibold text-electric">{post.tag}</p><h2 className="mt-3 font-display text-lg leading-snug">{post.title}</h2><p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p><div className="mt-auto flex items-center justify-between gap-2 pt-5"><Button size="sm" variant="outline" onClick={() => setPostPreview(post)}>Read more</Button><div className="flex"><Button size="icon" variant="ghost" aria-label={`Edit ${post.title}`} title="Edit insight" onClick={() => setPostEdit(post)}><Pencil /></Button><Button size="icon" variant="ghost" aria-label={`Delete ${post.title}`} title="Delete insight" onClick={() => setDeleteItem({ id: post.id, title: post.title, type: "insight" })} className="text-destructive"><Trash2 /></Button></div></div></div></article>)}
          </div>
          {(tab === "Projects" ? shownProjects.length : shownPosts.length) === 0 && <div className="py-20 text-center"><Search className="mx-auto size-7 text-muted-foreground" /><h2 className="mt-4 font-semibold">No matches found</h2><Button variant="link" onClick={() => { setSearch(""); setCategory("all"); }}>Clear filters</Button></div>}
        </>}
      </main>
    </div>
    {projectEdit && <ProjectEditor key={projectEdit.id} item={projectEdit} onClose={() => setProjectEdit(null)} onSave={(item) => { setProjectItems(upsertPreviewItem(projectItems, item)); setProjectEdit(null); setSearch(""); setCategory("all"); notify("Project updated in this preview."); }} />}
    {postEdit && <InsightEditor key={postEdit.id} item={postEdit} onClose={() => setPostEdit(null)} onSave={(item) => { setPostItems(upsertPreviewItem(postItems, item)); setPostEdit(null); setSearch(""); setCategory("all"); notify("Insight updated in this preview."); }} />}
    <Dialog open={Boolean(deleteItem)} onOpenChange={(open) => { if (!open) setDeleteItem(null); }}><DialogContent><DialogHeader><DialogTitle>Delete {deleteItem?.type}?</DialogTitle><DialogDescription>{deleteItem?.title} will be removed from this preview only.</DialogDescription></DialogHeader><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button><Button variant="destructive" onClick={() => { if (!deleteItem) return; if (deleteItem.type === "project") setProjectItems(projectItems.filter((project) => project.id !== deleteItem.id)); else setPostItems(postItems.filter((post) => post.id !== deleteItem.id)); setDeleteItem(null); notify("Item removed from this preview."); }}>Delete</Button></div></DialogContent></Dialog>
    <Dialog open={Boolean(projectPreview || postPreview)} onOpenChange={(open) => { if (!open) { setProjectPreview(null); setPostPreview(null); } }}><DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto"><DialogHeader><DialogTitle>{projectPreview?.title ?? postPreview?.title}</DialogTitle><DialogDescription>{projectPreview ? `${projectPreview.client} · ${projectPreview.location}` : postPreview?.excerpt}</DialogDescription></DialogHeader><MediaPreview src={projectPreview?.image ?? postPreview?.images[0] ?? ""} /><p className="whitespace-pre-wrap text-sm leading-relaxed">{projectPreview?.description ?? postPreview?.body}</p>{postPreview && postPreview.images.length > 1 && <div className="grid grid-cols-2 gap-3">{postPreview.images.slice(1).map((image, index) => <MediaPreview key={index} src={image} />)}</div>}</DialogContent></Dialog>
  </div>;
}