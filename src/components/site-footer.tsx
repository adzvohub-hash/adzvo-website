import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { policyLinks } from "@/components/policy-page";
import { servicePages } from "@/lib/services";
import { BrandLogo } from "@/components/brand-logo";
import { HomeCta } from "@/components/home-cta";
import { gtagEvent } from "@/routes/__root";

/**
 * Site footer — orange call-to-action strip (HomeCta), link columns, giant ADZVO wordmark.
 * The strip's text, buttons and WhatsApp number live in home-cta.tsx.
 * Styles live in styles.css under ".ftA" (self-contained, no custom Tailwind classes).
 */
const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Resources", to: "/resources" },
  { label: "Careers", to: "/careers" },
] as const;

const contactItems = [
  { label: "adzvohub@gmail.com", href: "mailto:adzvohub@gmail.com", icon: Mail, main: true },
  { label: "+91 70123 76221", href: "tel:+917012376221", icon: Phone },
  { label: "+91 90198 35261", href: "tel:+919019835261", icon: Phone },
  { label: "Bangalore, India", href: "https://maps.google.com/?q=Bangalore,+India", icon: MapPin },
] as const;

/* Social profiles — the ONE place to change these links.
   These are the expected handles; they may not exist yet (or may belong to someone else).
   Update each href once the real ADZVO profile is created. */
const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/adzvo", path: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></> },
  { label: "Instagram", href: "https://www.instagram.com/adzvo", path: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5v.01" /></> },
  { label: "X (Twitter)", href: "https://x.com/adzvo", path: <path d="M4 4l16 16M20 4L4 20" /> },
  { label: "YouTube", href: "https://www.youtube.com/@adzvo", path: <><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="M10 9l5 3-5 3z" /></> },
];

/** cta={false} hides the orange call-to-action strip that sits on top of the footer. */
export function Footer({ cta = true }: { cta?: boolean } = {}) {
  const half = Math.ceil(servicePages.length / 2);
  const serviceCols = [servicePages.slice(0, half), servicePages.slice(half)];

  return (
    <>
    {cta && <HomeCta />}
    <footer className={`ftA ftA-nocta ${cta ? "ftA-joined" : ""}`}>
      <div className="ftA-glow" aria-hidden />

      <div className="page-shell ftA-inner">
        {/* Columns */}
        <div className="ftA-grid">
          <div className="ftA-brand">
            <Link to="/" aria-label="ADZVO home" className="ftA-logo"><BrandLogo /></Link>
            <p className="ftA-about">A full-service creative digital agency built for Indian brands that want to grow, stand out and make a lasting impact.</p>
            <div className="ftA-socials">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={`ADZVO on ${s.label}`} target="_blank" rel="noopener noreferrer" className="ftA-social">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{s.path}</svg>
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer services" className="ftA-services">
            <h3 className="ftA-head">Services</h3>
            <div className="ftA-services-cols">
              {serviceCols.map((col, i) => (
                <ul key={i} className="ftA-list">
                  {col.map((service) => (
                    <li key={service.slug}>
                      <Link to="/services/$service" params={{ service: service.slug }} className="ftA-link">{service.title}</Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </nav>

          <nav aria-label="Footer company">
            <h3 className="ftA-head">Company</h3>
            <ul className="ftA-list">
              {companyLinks.map(({ label, to }) => (
                <li key={label}><Link to={to} className="ftA-link">{label}</Link></li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="ftA-head">Get in Touch</h3>
            <ul className="ftA-list">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClick={() => {
                      if (item.href.startsWith("tel:")) gtagEvent("phone_clicked", { location: "footer", number: item.label });
                    }}
                    className={`ftA-contact ${"main" in item && item.main ? "ftA-contact-main" : ""}`}
                  >
                    <item.icon className="ftA-contact-icon" strokeWidth={2} aria-hidden />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="ftA-mark" aria-hidden>ADZVO</div>

      {/* Bottom bar */}
      <div className="ftA-bar">
        <div className="page-shell ftA-bar-inner">
          <div className="ftA-bar-left">
            <p>© 2026 ADZVO Digital Agency. All rights reserved.</p>
            <Link to="/adzvoadmin" className="ftA-login">Login</Link>
          </div>
          <nav aria-label="Footer policies" className="ftA-policies">
            {policyLinks.map((policy) => <Link key={policy.to} to={policy.to} className="ftA-link">{policy.title}</Link>)}
          </nav>
        </div>
      </div>
    </footer>
    </>
  );
}
