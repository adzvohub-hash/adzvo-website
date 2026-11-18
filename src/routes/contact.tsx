import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { Toaster, toast } from "sonner";
import contactImg from "@/assets/contact.jpg";
import { Button } from "@/components/ui/button";
import { Highlight, SectionLabel } from "@/components/brand-logo";
import { Footer } from "@/components/site-footer";
import { Check } from "lucide-react";

function useReveal() {
  useEffect(() => {
    let raf = 0;
    const scan = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("in");
          else if (r.bottom <= 0) el.classList.add("in");
        });
      });
    };
    scan();
    window.addEventListener("scroll", scan, { passive: true });
    window.addEventListener("resize", scan);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", scan);
      window.removeEventListener("resize", scan);
    };
  }, []);
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact ADZVO — Start a Project" },
      { name: "description", content: "Get in touch with ADZVO. Tell us about your brand and goals — we'll come back with a clear plan." },
      { property: "og:title", content: "Contact ADZVO" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  useReveal();
  const [sending, setSending] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    setTimeout(() => {
      setSending(false);
      form.reset();
      toast.success("Thanks! We'll get back to you within one business day.");
    }, 700);
  };
  const input = "w-full rounded-[10px] border border-border bg-off px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted-foreground/60 focus:border-navy focus:ring-[3px] focus:ring-gold/40";

  return (
    <main className="bg-off">
      <Toaster position="top-center" richColors />
      <section id="contact" className="bg-off py-20 pt-32 sm:py-24 sm:pt-36">
        <div className="page-shell grid gap-8 lg:grid-cols-[11fr_13fr]">
          {/* Left panel */}
          <div className="shadow-contact relative min-w-0 overflow-hidden rounded-3xl bg-navy p-6 sm:p-10 xl:p-12">
            <img src={contactImg} alt="" width={1024} height={1280} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/85 to-navy/60" />
            <div className="orb -top-20 -right-20 h-80 w-80 bg-gold/20" />
            <div className="orb -bottom-20 -left-20 h-80 w-80 bg-gold/10 [animation-delay:-5s]" />
            <div className="reveal relative flex h-full w-full flex-col justify-center">
              <SectionLabel light>Start a Project</SectionLabel>
              <h2 className="font-display mt-5 text-4xl leading-tight font-extrabold text-primary-foreground sm:text-5xl">
                Your Next Big Idea <Highlight dark>Starts Here.</Highlight>
              </h2>
              <ul className="mt-8 space-y-3">
                {["Response within 24 hours", "Free initial strategy session", "No long-term lock-in contracts"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-primary-foreground/80">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold text-navy">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="shadow-contact min-w-0 rounded-3xl border border-border bg-primary-foreground p-6 sm:p-10 xl:p-12">
            <form onSubmit={submit} className="reveal w-full space-y-4">
              <h3 className="font-display text-3xl font-bold text-navy">Send us an enquiry</h3>
              <p className="pb-2 text-sm text-muted-foreground">We'll get back to you within one business day.</p>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy/70">Name <span className="text-gold">*</span></label>
                <input required className={input} placeholder="Your name" aria-label="Name" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy/70">Email <span className="text-gold">*</span></label>
                <input required type="email" className={input} placeholder="you@company.com" aria-label="Email" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy/70">Message <span className="text-gold">*</span></label>
                <textarea required rows={5} className={input} placeholder="Tell us about your project and goals…" aria-label="Project description" />
              </div>
              <Button type="submit" disabled={sending} className="shadow-gold h-auto w-full rounded-xl bg-gold py-4 font-semibold text-navy transition hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-60">
                {sending ? "Sending…" : "Send Enquiry →"}
              </Button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
