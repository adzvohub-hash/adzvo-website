import { Link } from "@tanstack/react-router";
import { policyLinks } from "@/components/policy-page";
import { servicePages } from "@/lib/services";
import { BrandLogo } from "@/components/brand-logo";

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" aria-label="ADZVO home" className={dark ? "text-navy" : "text-primary-foreground"}>
      <BrandLogo />
    </Link>
  );
}

export 
function Footer() {
  const cols = [
    ["Company", ["About Us", "Our Work", "Careers", "Blog"]],
    ["Contact", ["hello@adzvo.com", "+91 XX XXXX XXXX", "Mumbai, India"]],
  ] as const;
  return (
    <footer className="bg-ink pt-20 pb-8">
      <div className="page-shell">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1.4fr_0.8fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/45">
              A full-service creative digital agency built for Indian brands that want to grow, stand out and make a lasting impact.
            </p>
            <div className="mt-6 flex gap-2">
              {["in", "ig", "tw", "yt", "tk"].map((s) => (
                <a key={s} href="#" className="glass flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-primary-foreground/70 transition hover:-translate-y-0.5 hover:bg-gold hover:text-navy hover:shadow-gold">
                  {s}
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Footer services">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">Services</h4>
            <ul className="mt-5 space-y-3">
              {servicePages.map((service) => (
                <li key={service.slug}>
                  <Link to="/services/$service" params={{ service: service.slug }} className="text-sm text-primary-foreground/45 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">{service.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          {cols.map(([h, items]) => (
            <div key={h}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">{h}</h4>
              <ul className="mt-5 space-y-3">
                {items.map((i) => (
                  <li key={i}><a href="#" className="text-sm text-primary-foreground/45 transition hover:text-gold">{i}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-6">
            <p className="text-xs text-primary-foreground/40">© 2026 ADZVO Digital Agency. All rights reserved.</p>
            <Link to="/adzvoadmin" className="text-xs text-primary-foreground/25 transition-colors hover:text-primary-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">Login</Link>
          </div>
          <nav aria-label="Footer policies" className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-primary-foreground/70 sm:justify-end">
            {policyLinks.map((policy) => <Link key={policy.to} to={policy.to} className="transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">{policy.title}</Link>)}
          </nav>
        </div>
      </div>
    </footer>
  );
}
