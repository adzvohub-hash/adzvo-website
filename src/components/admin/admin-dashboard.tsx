import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight, BarChart3, Check, ChevronRight, Eye, EyeOff, Film,
  Home, Images, LayoutGrid, LockKeyhole, LogOut, MapPin, Pencil,
  Plus, Search, Settings2, Trash2, Loader2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaField, MediaPreview } from "./media-field";
import { ProjectEditor, InsightEditor, selectClass } from "./content-editor";
import { AboutImagesEditor } from "./about-images-editor";
import { ServiceVideosEditor } from "./service-videos-editor";
import { validMediaUrl, upsertItem, r2img } from "@/lib/admin-preview";
import { servicePages } from "@/lib/services";
import { projectLocations } from "@/lib/projects";
import { BrandLogo } from "@/components/brand-logo";
import loginImage from "@/assets/about-hero.jpg";
import {
  apiLogin, saveToken, getToken, clearToken,
  getSettings, saveSettings,
  getServiceImages, saveServiceImages,
  getProjects, saveProject, deleteProject,
  getInsights, saveInsight, deleteInsight,
  type Settings, type Project, type Insight,
} from "@/lib/api";

const tabs = ["Home", "About", "Services", "Projects", "Insights"] as const;
type Tab = (typeof tabs)[number];
const homeSections = [
  { title: "Hero Page",     icon: Film },
  { title: "ADZVO Impact",  icon: BarChart3 },
  { title: "What We Do",    icon: Images },
] as const;
type HomeSection = (typeof homeSections)[number]["title"];

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginView({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visible,  setVisible]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const token = await apiLogin(username, password);
      saveToken(token);
      setPassword("");
      onLogin();
    } catch {
      setError("The username or password is incorrect.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="grid min-h-svh bg-card lg:grid-cols-2">
    <section className="relative hidden overflow-hidden bg-navy text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
      <img src={loginImage} alt="ADZVO creative studio" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-navy/65" />
      <Link to="/" aria-label="ADZVO home" className="relative w-fit"><BrandLogo markClassName="size-11" textClassName="text-2xl" /></Link>
      <div className="relative max-w-lg">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">The studio, behind the scenes</span>
        <h1 className="mt-5 font-display text-5xl leading-tight">Great work starts<br />with a clear view.</h1>
        <p className="mt-6 text-sm text-primary-foreground/75">ADZVO content workspace</p>
      </div>
      <p className="relative text-xs text-primary-foreground/65">Creative thinking. Connected experiences.</p>
    </section>
    <section className="flex flex-col justify-center px-6 py-12 sm:px-14 lg:px-20">
      <div className="mx-auto w-full max-w-sm">
        <Link to="/" aria-label="ADZVO home" className="lg:hidden"><BrandLogo /></Link>
        <div className="mt-10 flex size-12 items-center justify-center rounded-lg bg-electric/10 text-electric lg:mt-0"><LockKeyhole className="size-5" /></div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-electric">Admin workspace</p>
        <h2 className="mt-3 font-display text-3xl">Welcome back.</h2>
        <p className="mt-3 text-sm text-muted-foreground">Sign in to manage your content.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="grid gap-2 text-sm font-medium">Username
            <Input required autoComplete="username" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} className="h-11" />
          </label>
          <label className="grid gap-2 text-sm font-medium">Password
            <span className="relative">
              <Input required autoComplete="current-password" type={visible ? "text" : "password"} value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }} className="h-11 pr-12" />
              <Button type="button" variant="ghost" size="icon" aria-label={visible ? "Hide password" : "Show password"}
                onClick={() => setVisible(!visible)} className="absolute right-1 top-1">
                {visible ? <EyeOff /> : <Eye />}
              </Button>
            </span>
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="h-11 w-full bg-electric text-primary-foreground hover:bg-electric/90">
            {loading ? <Loader2 className="animate-spin" /> : null}
            {loading ? "Signing in…" : "Sign in"}<ChevronRight />
          </Button>
        </form>
        <Button variant="link" asChild className="mt-4 px-0"><Link to="/">Back to website<ArrowUpRight /></Link></Button>
      </div>
    </section>
  </main>;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function AdminDashboard() {
  const [signedIn,     setSignedIn]     = useState(() => Boolean(getToken()));
  const [tab,          setTab]          = useState<Tab>("Home");
  const [homeSection,  setHomeSection]  = useState<HomeSection>("Hero Page");

  // Home state
  const [settings,       setSettings]       = useState<Settings | null>(null);
  const [settingsDraft,  setSettingsDraft]  = useState<Settings | null>(null);
  const [serviceImages,  setServiceImages]  = useState<Record<string, string>>({});
  const [svcImgDrafts,   setSvcImgDrafts]   = useState<Record<string, string>>({});

  // Projects / Insights
  const [projects, setProjects] = useState<Project[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  // Editors / dialogs
  const [projectEdit,   setProjectEdit]   = useState<Omit<Project, "created_at" | "updated_at"> | null>(null);
  const [projectIsNew,  setProjectIsNew]  = useState(false);
  const [insightEdit,   setInsightEdit]   = useState<Omit<Insight, "created_at" | "updated_at"> | null>(null);
  const [insightIsNew,  setInsightIsNew]  = useState(false);
  const [deleteItem,    setDeleteItem]    = useState<{ id: string; title: string; type: "project" | "insight" } | null>(null);
  const [projectPreview, setProjectPreview] = useState<Project | null>(null);
  const [insightPreview, setInsightPreview] = useState<Insight | null>(null);

  // UI state
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("all");
  const [notice,   setNotice]   = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  function notify(msg: string) { setNotice(msg); setError(""); }
  function fail(msg: string)   { setError(msg);  setNotice(""); }
  function changeTab(t: Tab)   { setTab(t); setSearch(""); setCategory("all"); setNotice(""); setError(""); }

  // ─── Load data on sign-in ──────────────────────────────────────────────────
  useEffect(() => {
    if (!signedIn) return;
    void (async () => {
      setLoading(true);
      try {
        const [s, imgs, p, ins] = await Promise.all([
          getSettings(), getServiceImages(), getProjects(), getInsights(),
        ]);
        setSettings(s);
        setSettingsDraft({ ...s });
        const imgMap = Object.fromEntries(imgs.map(({ slug, image_url }) => [slug, image_url]));
        // fill in defaults from R2 for any slug not yet in DB
        const defaults = Object.fromEntries(servicePages.map((svc) => [svc.slug, r2img(`svc-${servicePages.indexOf(svc) + 1}.jpg`)]));
        const merged = { ...defaults, ...imgMap };
        setServiceImages(merged);
        setSvcImgDrafts({ ...merged });
        setProjects(p);
        setInsights(ins);
      } catch {
        fail("Failed to load data. Check your connection.");
      } finally {
        setLoading(false);
      }
    })();
  }, [signedIn]);

  // ─── Save home settings ────────────────────────────────────────────────────
  async function applyHome(event: FormEvent) {
    event.preventDefault();
    if (!settingsDraft) return;
    setLoading(true);
    try {
      if (homeSection === "Hero Page") {
        if (!validMediaUrl(settingsDraft.hero_video_url)) { fail("Use an HTTPS video URL."); return; }
        await saveSettings({ hero_video_url: settingsDraft.hero_video_url });
        setSettings({ ...settings!, hero_video_url: settingsDraft.hero_video_url });
      } else if (homeSection === "ADZVO Impact") {
        const { metric_projects, metric_clients, metric_partners, metric_categories } = settingsDraft;
        await saveSettings({ metric_projects, metric_clients, metric_partners, metric_categories });
        setSettings({ ...settings!, metric_projects, metric_clients, metric_partners, metric_categories });
      } else {
        if (!Object.values(svcImgDrafts).every(validMediaUrl)) { fail("Check the image links."); return; }
        await saveServiceImages(Object.entries(svcImgDrafts).map(([slug, image_url]) => ({ slug, image_url })));
        setServiceImages({ ...svcImgDrafts });
      }
      notify("Changes saved.");
    } catch (err) {
      fail(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Project save ──────────────────────────────────────────────────────────
  async function handleSaveProject(draft: Omit<Project, "created_at" | "updated_at">) {
    const saved = await saveProject(draft, projectIsNew);
    setProjects(upsertItem(projects, saved));
    setProjectEdit(null);
    setSearch(""); setCategory("all");
    notify(projectIsNew ? "Project added." : "Project updated.");
  }

  // ─── Insight save ──────────────────────────────────────────────────────────
  async function handleSaveInsight(draft: Omit<Insight, "created_at" | "updated_at">) {
    const saved = await saveInsight(draft, insightIsNew);
    setInsights(upsertItem(insights, saved));
    setInsightEdit(null);
    setSearch(""); setCategory("all");
    notify(insightIsNew ? "Insight added." : "Insight updated.");
  }

  // ─── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteItem) return;
    try {
      if (deleteItem.type === "project") {
        await deleteProject(deleteItem.id);
        setProjects(projects.filter((p) => p.id !== deleteItem.id));
      } else {
        await deleteInsight(deleteItem.id);
        setInsights(insights.filter((i) => i.id !== deleteItem.id));
      }
      setDeleteItem(null);
      notify("Item deleted.");
    } catch {
      fail("Delete failed.");
    }
  }

  if (!signedIn) return <LoginView onLogin={() => setSignedIn(true)} />;

  const query = search.trim().toLowerCase();
  const shownProjects = projects.filter((p) =>
    (category === "all" || p.service === category) &&
    `${p.title} ${p.client} ${p.location}`.toLowerCase().includes(query)
  );
  const shownInsights = insights.filter((i) =>
    (category === "all" || i.tag === category) &&
    `${i.title} ${i.excerpt}`.toLowerCase().includes(query)
  );
  const metrics = [
    { label: "Projects Delivered",       key: "metric_projects"   as const },
    { label: "Trusted Clients",          key: "metric_clients"    as const },
    { label: "Partners & Collaborators", key: "metric_partners"   as const },
    { label: "Service Categories",       key: "metric_categories" as const },
  ];

  return <div className="min-h-svh bg-background">
    {/* Header */}
    <header className="sticky top-0 z-30 border-b bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="ADZVO home"><BrandLogo /></Link>
          <span className="border-l pl-3 text-xs font-medium text-muted-foreground">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild><Link to="/">View site<ArrowUpRight /></Link></Button>
          <Button variant="outline" size="sm" onClick={() => { clearToken(); setSignedIn(false); setNotice(""); }}>
            <LogOut />Sign out
          </Button>
        </div>
      </div>
      <nav aria-label="Admin navigation" className="flex gap-1 overflow-x-auto px-5 sm:px-8">
        {tabs.map((item) => (
          <Button key={item} variant="ghost" aria-current={tab === item ? "page" : undefined}
            onClick={() => changeTab(item)}
            className={`h-12 shrink-0 rounded-none border-b-2 px-5 ${tab === item ? "border-electric text-electric" : "border-transparent text-muted-foreground"}`}>
            {item}
          </Button>
        ))}
      </nav>
    </header>

    {/* Loading overlay */}
    {loading && <div className="flex items-center gap-2 border-b bg-electric/10 px-5 py-2.5 text-xs sm:px-8">
      <Loader2 className="size-3.5 animate-spin text-electric" />Loading…
    </div>}

    <div className={tab === "Home" ? "grid grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)]" : ""}>
      {/* Sidebar */}
      {tab === "Home" && (
        <aside className="border-b bg-card px-5 py-5 lg:min-h-[calc(100svh-120px)] lg:border-b-0 lg:border-r lg:px-4 lg:py-8">
          <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Homepage</p>
          <nav aria-label="Homepage sections" className="flex gap-2 overflow-x-auto lg:flex-col">
            {homeSections.map(({ title, icon: Icon }) => (
              <Button key={title} variant={homeSection === title ? "secondary" : "ghost"}
                aria-current={homeSection === title ? "page" : undefined}
                onClick={() => { setHomeSection(title); setNotice(""); setError(""); }}
                className={`h-11 shrink-0 justify-start lg:w-full ${homeSection === title ? "bg-electric/10 text-electric" : "text-muted-foreground"}`}>
                <Icon />{title}
              </Button>
            ))}
          </nav>
        </aside>
      )}

      {/* Main */}
      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Home className="size-3.5" />Workspace<ChevronRight className="size-3" />{tab}
            </p>
            <h1 className="font-display text-3xl">{tab === "Home" ? homeSection : tab}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {tab === "Home" ? "Homepage content"
                : tab === "Projects" ? `${projects.length} projects in your portfolio`
                : tab === "Insights" ? `${insights.length} articles in your library`
                : "Content management"}
            </p>
          </div>
          {(tab === "Projects" || tab === "Insights") && (
            <Button onClick={() => {
              if (tab === "Projects") {
                setProjectEdit({ id: crypto.randomUUID(), title: "", client: "", location: projectLocations[0], service: servicePages[0].slug, description: "", image_url: "", case_study_url: "", sort_order: 0 });
                setProjectIsNew(true);
              } else {
                setInsightEdit({ id: crypto.randomUUID(), tag: "", title: "", excerpt: "", body: "", images: [], sort_order: 0 });
                setInsightIsNew(true);
              }
            }} className="bg-electric text-primary-foreground hover:bg-electric/90">
              <Plus />{tab === "Projects" ? "Add project" : "Add insight"}
            </Button>
          )}
        </div>

        {notice && (
          <p role="status" className="mb-6 flex items-center gap-2 rounded-md border border-mint/30 bg-mint/10 px-4 py-3 text-sm">
            <Check className="size-4 text-mint" />{notice}
          </p>
        )}
        {error && (
          <p role="alert" className="mb-6 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="size-4" />{error}
          </p>
        )}

        {/* Home tab */}
        {tab === "Home" && settingsDraft && (
          <form onSubmit={applyHome} className="space-y-7">
            {homeSection === "Hero Page" && (
              <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">Background video</h2>
                  <MediaField label="Hero video URL" value={settingsDraft.hero_video_url}
                    onChange={(v) => setSettingsDraft({ ...settingsDraft, hero_video_url: v })} video />
                  <p className="text-xs text-muted-foreground">16:9 landscape · MP4</p>
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Current</p>
                  <MediaPreview src={settings?.hero_video_url ?? ""} video />
                </div>
              </div>
            )}

            {homeSection === "ADZVO Impact" && (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {metrics.map(({ label, key }) => (
                    <label key={key} className="grid gap-2 text-sm font-medium">{label}
                      <Input type="number" required min={0} step={1} value={settingsDraft[key]}
                        onChange={(e) => setSettingsDraft({ ...settingsDraft, [key]: Number(e.target.value) })} />
                    </label>
                  ))}
                </div>
                <div className="border-t pt-8">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Preview</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map(({ label, key }, i) => (
                      <article key={key} className={`rounded-lg border p-5 ${["bg-navy text-primary-foreground", "bg-electric/10", "bg-gold/15", "bg-mint/15"][i]}`}>
                        <p className="text-3xl font-bold">{settingsDraft[key]}+</p>
                        <p className="mt-2 text-xs">{label}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </>
            )}

            {homeSection === "What We Do" && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {servicePages.map((svc) => (
                  <article key={svc.slug} className="space-y-4 rounded-lg border bg-card p-4">
                    <MediaPreview src={serviceImages[svc.slug] ?? ""} />
                    <h2 className="text-base font-semibold">{svc.title}</h2>
                    <MediaField label={`${svc.title} image URL`} value={svcImgDrafts[svc.slug] ?? ""}
                      onChange={(v) => setSvcImgDrafts({ ...svcImgDrafts, [svc.slug]: v })} />
                  </article>
                ))}
              </div>
            )}

            <div className="flex justify-end border-t pt-5">
              <Button type="submit" disabled={loading} className="bg-electric text-primary-foreground hover:bg-electric/90">
                {loading ? <Loader2 className="animate-spin" /> : <Check />}
                {loading ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        )}

        {/* About tab: chapter background images (R2, with built-in fallback) */}
        {tab === "About" && (
          <AboutImagesEditor
            saved={serviceImages}
            onSaved={(next) => { setServiceImages(next); setSvcImgDrafts((d) => ({ ...d, ...Object.fromEntries(Object.entries(next).filter(([k]) => k.startsWith("about-"))) })); }}
            notify={notify}
            fail={fail}
          />
        )}

        {/* Services tab: the looping video on each service page (R2, original video as fallback) */}
        {tab === "Services" && (
          <ServiceVideosEditor
            saved={serviceImages}
            onSaved={(next) => {
              setServiceImages(next);
              setSvcImgDrafts((d) => ({ ...d, ...Object.fromEntries(Object.entries(next).filter(([k]) => k.startsWith("video-"))) }));
            }}
            notify={notify}
            fail={fail}
          />
        )}

        {/* Projects / Insights */}
        {(tab === "Projects" || tab === "Insights") && (
          <>
            <div className="mb-7 flex flex-wrap items-center gap-3">
              <label className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input aria-label={`Search ${tab.toLowerCase()}`} placeholder={`Search ${tab.toLowerCase()}…`}
                  value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 pl-9" />
              </label>
              <select aria-label="Filter category" value={category} onChange={(e) => setCategory(e.target.value)}
                className={`${selectClass} sm:max-w-xs`}>
                <option value="all">All categories</option>
                {tab === "Projects"
                  ? servicePages.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)
                  : Array.from(new Set(insights.map((i) => i.tag))).map((t) => <option key={t}>{t}</option>)}
              </select>
              <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                <LayoutGrid className="size-4" />
                {tab === "Projects" ? shownProjects.length : shownInsights.length} results
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {tab === "Projects" && shownProjects.map((project) => (
                <article key={project.id} className="flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card">
                  <MediaPreview src={project.image_url} />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold text-electric">
                      {servicePages.find((s) => s.slug === project.service)?.title}
                    </p>
                    <h2 className="mt-3 font-semibold">{project.title}</h2>
                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />{project.client} · {project.location}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                      <Button size="sm" variant="outline" onClick={() => setProjectPreview(project)}>More</Button>
                      {project.case_study_url && (
                        <Button size="sm" variant="ghost" asChild>
                          <a href={project.case_study_url} target="_blank" rel="noopener noreferrer">Case Study<ArrowUpRight /></a>
                        </Button>
                      )}
                      <div className="ml-auto flex">
                        <Button size="icon" variant="ghost" aria-label={`Edit ${project.title}`}
                          onClick={() => { setProjectEdit(project); setProjectIsNew(false); }}><Pencil /></Button>
                        <Button size="icon" variant="ghost" aria-label={`Delete ${project.title}`}
                          onClick={() => setDeleteItem({ id: project.id, title: project.title, type: "project" })}
                          className="text-destructive"><Trash2 /></Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {tab === "Insights" && shownInsights.map((post) => (
                <article key={post.id} className="flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card">
                  <div className="relative">
                    <MediaPreview src={post.images[0] ?? ""} />
                    <span className="absolute bottom-3 right-3 rounded bg-card/90 px-2 py-1 text-xs">{post.images.length} images</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold text-electric">{post.tag}</p>
                    <h2 className="mt-3 font-display text-lg leading-snug">{post.title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                      <Button size="sm" variant="outline" onClick={() => setInsightPreview(post)}>Read more</Button>
                      <div className="flex">
                        <Button size="icon" variant="ghost" aria-label={`Edit ${post.title}`}
                          onClick={() => { setInsightEdit(post); setInsightIsNew(false); }}><Pencil /></Button>
                        <Button size="icon" variant="ghost" aria-label={`Delete ${post.title}`}
                          onClick={() => setDeleteItem({ id: post.id, title: post.title, type: "insight" })}
                          className="text-destructive"><Trash2 /></Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {(tab === "Projects" ? shownProjects.length : shownInsights.length) === 0 && !loading && (
              <div className="py-20 text-center">
                <Search className="mx-auto size-7 text-muted-foreground" />
                <h2 className="mt-4 font-semibold">No matches found</h2>
                <Button variant="link" onClick={() => { setSearch(""); setCategory("all"); }}>Clear filters</Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>

    {/* Editors */}
    {projectEdit && (
      <ProjectEditor key={projectEdit.id} item={projectEdit} isNew={projectIsNew}
        onClose={() => setProjectEdit(null)} onSave={handleSaveProject} />
    )}
    {insightEdit && (
      <InsightEditor key={insightEdit.id} item={insightEdit} isNew={insightIsNew}
        onClose={() => setInsightEdit(null)} onSave={handleSaveInsight} />
    )}

    {/* Delete confirm */}
    <Dialog open={Boolean(deleteItem)} onOpenChange={(open) => { if (!open) setDeleteItem(null); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {deleteItem?.type}?</DialogTitle>
          <DialogDescription>{deleteItem?.title} will be permanently removed.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Preview dialogs */}
    <Dialog open={Boolean(projectPreview || insightPreview)} onOpenChange={(open) => { if (!open) { setProjectPreview(null); setInsightPreview(null); } }}>
      <DialogContent className="max-h-[90svh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{projectPreview?.title ?? insightPreview?.title}</DialogTitle>
          <DialogDescription>
            {projectPreview ? `${projectPreview.client} · ${projectPreview.location}` : insightPreview?.excerpt}
          </DialogDescription>
        </DialogHeader>
        <MediaPreview src={projectPreview?.image_url ?? insightPreview?.images[0] ?? ""} />
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{projectPreview?.description ?? insightPreview?.body}</p>
        {insightPreview && insightPreview.images.length > 1 && (
          <div className="grid grid-cols-2 gap-3">
            {insightPreview.images.slice(1).map((img, i) => <MediaPreview key={i} src={img} />)}
          </div>
        )}
      </DialogContent>
    </Dialog>
  </div>;
}
