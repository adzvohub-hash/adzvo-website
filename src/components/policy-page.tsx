import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const policyLinks = [
  { title: "Privacy Policy", to: "/privacy-policy" },
  { title: "Cookie Policy", to: "/cookie-policy" },
  { title: "Terms & Conditions", to: "/terms-and-conditions" },
] as const;

export function policyHead(title: string, description: string) {
  return { meta: [
    { title: `${title} — ADZVO` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — ADZVO` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] };
}

export function PolicyPage({ title, intro, sections }: {
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
}) {
  return (
    <main className="min-h-screen bg-off text-navy">
      <header className="bg-navy pb-14 pt-32 text-primary-foreground sm:pb-16">
        <div className="page-shell">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-gold"><ArrowLeft className="size-4" /> Back to ADZVO</Link>
          <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-gold">ADZVO / Legal</p>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-primary-foreground/70">{intro}</p>
        </div>
      </header>
      <div className="page-shell grid gap-10 py-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16 sm:py-16">
        <aside>
          <nav aria-label="Legal pages" className="flex flex-wrap gap-x-6 gap-y-3 lg:sticky lg:top-28 lg:flex-col lg:items-start">
            {policyLinks.map((policy) => <Link key={policy.to} to={policy.to} activeProps={{ className: "font-semibold text-electric", "aria-current": "page" }} className="text-sm text-muted-foreground transition-colors hover:text-electric">{policy.title}</Link>)}
          </nav>
        </aside>
        <article className="max-w-3xl min-w-0">
          <p className="border-l-2 border-gold pl-4 text-sm leading-relaxed text-muted-foreground">Draft for review. These terms should be confirmed against ADZVO’s actual business and data practices before publication.</p>
          <div className="mt-10 space-y-9">
            {sections.map((section, index) => <section key={section.title}>
              <h2 className="text-xl font-semibold">{index + 1}. {section.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{section.text}</p>
            </section>)}
          </div>
          <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">For questions about this {title.toLowerCase()}, <Link to="/" hash="contact" className="font-medium text-electric underline underline-offset-4">contact ADZVO</Link>.</div>
        </article>
      </div>
    </main>
  );
}