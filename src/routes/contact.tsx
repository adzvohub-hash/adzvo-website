import { createFileRoute } from "@tanstack/react-router";
import { GlassButton } from "@/components/glass-button";
import { useState, useEffect, type FormEvent } from "react";
import { Toaster, toast } from "sonner";
import { sendEnquiry } from "@/lib/chat-log";
import contactImg from "@/assets/contact.jpg";
import { Button } from "@/components/ui/button";
import { Highlight, SectionLabel } from "@/components/brand-logo";
import { Footer } from "@/components/site-footer";
import { ArrowRight, Check } from "lucide-react";

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
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    // hidden field only bots fill in: pretend it worked and drop it
    if (get("company_website")) { form.reset(); toast.success("Thanks! We'll get back to you within one business day."); return; }
    const phone = get("phone");
    if (phone && !/^[+\d][\d\s()-]{5,}$/.test(phone)) { toast.error("Please enter a valid phone number, or leave it empty."); return; }
    setSending(true);
    const ok = await sendEnquiry({ name: get("name"), email: get("email"), phone, message: get("message") });
    setSending(false);
    if (ok) {
      form.reset();
      toast.success("Thanks! We'll get back to you within one business day.");
    } else {
      toast.error("Sorry, that didn't send. Please check your connection, or email adzvohub@gmail.com.");
    }
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
                <input required name="name" autoComplete="name" maxLength={120} className={input} placeholder="Your name" aria-label="Name" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy/70">Email <span className="text-gold">*</span></label>
                <input required name="email" type="email" autoComplete="email" maxLength={160} className={input} placeholder="you@company.com" aria-label="Email" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy/70">Phone <span className="font-normal text-navy/45">(optional)</span></label>
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} className={input} placeholder="+91 XXXXX XXXXX" aria-label="Phone (optional)" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-navy/70">Message <span className="text-gold">*</span></label>
                <textarea required name="message" rows={5} maxLength={3000} className={input} placeholder="Tell us about your project and goals…" aria-label="Project description" />
              </div>
              {/* spam trap: hidden from people, bots fill it in */}
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
              <GlassButton as="button" type="submit" disabled={sending} className="w-full">
                {sending ? "Sending…" : <>Send Enquiry <ArrowRight /></>}
              </GlassButton>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
