import { Check, Plus } from "lucide-react";
import { SectionLabel } from "@/components/brand-logo";
import { serviceDetails } from "@/lib/service-details";

/**
 * The longer, search-friendly copy on each service page: about the service, how we work,
 * who it's for and common questions. Words live in src/lib/service-details.ts.
 *
 * Plain HTML on purpose (no scroll animations): the text is visible immediately, readable
 * by search engines, and the questions use <details> so they open without JavaScript.
 */
export function ServiceDetails({ slug }: { slug: string }) {
  const d = serviceDetails[slug];
  if (!d) return null;
  return <>
    {/* About the service */}
    <section className="bg-off py-16 text-navy sm:py-20">
      <div className="page-shell grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionLabel>About the service</SectionLabel>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{d.about.heading}</h2>
          <span aria-hidden className="mt-6 block h-1.5 w-16 rounded-full bg-gold" />
        </div>
        <div className="space-y-5 text-base leading-relaxed text-slate sm:text-lg">
          {d.about.paragraphs.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
        </div>
      </div>
    </section>

    {/* How we work */}
    <section className="bg-background py-16 sm:py-20">
      <div className="page-shell">
        <SectionLabel>How we work</SectionLabel>
        <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl">{d.steps.heading}</h2>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {d.steps.items.map((s, i) => (
            <li key={s.title} className="flex flex-col rounded-3xl border border-navy/10 bg-off p-6 sm:p-7">
              <span className="font-display text-4xl font-extrabold text-gold-text" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-lg font-semibold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* Who it's for */}
    <section className="bg-off py-16 text-navy sm:py-20">
      <div className="page-shell grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <SectionLabel>Who it's for</SectionLabel>
          <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{d.audience.heading}</h2>
        </div>
        <ul className="space-y-4">
          {d.audience.items.map((a) => (
            <li key={a.who} className="flex gap-4 rounded-2xl border border-navy/10 bg-white p-5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gold text-navy"><Check className="size-4" strokeWidth={3} /></span>
              <p className="leading-relaxed text-slate"><strong className="font-semibold text-navy">{a.who}</strong> {a.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* Questions people ask */}
    <section className="bg-background py-16 sm:py-20">
      <div className="page-shell mx-auto max-w-4xl">
        <SectionLabel>Questions people ask</SectionLabel>
        <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl">{d.faqs.heading}</h2>
        <div className="mt-10 divide-y divide-navy/10 border-y border-navy/10">
          {d.faqs.items.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg font-semibold text-navy">{f.q}</h3>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-navy/15 text-navy transition-transform duration-300 group-open:rotate-45">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  </>;
}
