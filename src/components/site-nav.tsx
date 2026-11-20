import { Link, useRouterState } from "@tanstack/react-router";
import { GlassButton } from "@/components/glass-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { servicePages } from "@/lib/services";
import { BrandLogo } from "@/components/brand-logo";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const close = () => { setOpen(false); setServicesOpen(false); };

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(path + "/");

  const navLink = (path: string) =>
    `hover:text-gold transition-colors ${isActive(path) ? "text-gold" : ""}`;

  const mobileNavLink = (path: string) =>
    `block px-3 py-3 font-semibold transition-colors ${isActive(path) ? "text-gold" : "text-navy"}`;

  const serviceLinks = servicePages.map((service, i) => (
    <Link key={service.slug} to="/services/$service" params={{ service: service.slug }} onClick={close}
      className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-navy transition-colors hover:bg-electric/10 hover:text-electric focus-visible:bg-electric/10 focus-visible:outline-none">
      <span className="text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
      <span className="flex-1">{service.title}</span><ArrowUpRight className="size-4 shrink-0" />
    </Link>
  ));

  const isServices = pathname.startsWith("/services");

  return (
    <header className={`site-nav-glass fixed inset-x-0 top-0 z-50 border-b ${scrolled ? "site-nav-scrolled" : ""}`} onKeyDown={(event) => { if (event.key === "Escape") close(); }}>
      <nav aria-label="Main navigation" className="page-shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 lg:flex lg:justify-between">
        <Link to="/" onClick={close} aria-label="ADZVO home" className="min-w-0"><BrandLogo /></Link>
        <ul className="hidden shrink-0 items-center gap-5 text-xs font-semibold uppercase tracking-[0.1em] lg:flex xl:gap-8 xl:tracking-[0.16em]">
          <li><Link to="/" className={navLink("/")}>Home</Link></li>
          <li><Link to="/about" className={navLink("/about")}>About</Link></li>
          <li className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false); }}>
            <Button variant="ghost" aria-expanded={servicesOpen} aria-controls="desktop-services" onFocus={() => setServicesOpen(true)} onClick={() => setServicesOpen(!servicesOpen)}
              className={`h-auto gap-1.5 p-0 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-transparent hover:text-gold ${isServices ? "text-gold" : ""}`}>
              Services <ChevronDown className={`size-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </Button>
            {servicesOpen && <div id="desktop-services" className="absolute left-1/2 top-full w-[370px] -translate-x-1/2 pt-6">
              <div className="site-menu-glass rounded-lg border p-2 normal-case tracking-normal">{serviceLinks}</div>
            </div>}
          </li>
          <li><Link to="/projects" className={navLink("/projects")}>Projects</Link></li>
          <li><Link to="/resources" className={navLink("/resources")}>Resources</Link></li>
          <li><Link to="/contact" className={navLink("/contact")}>Contact</Link></li>
        </ul>
        <div className="site-nav-actions">
          <ThemeToggle />
          <GlassButton as={Link} to="/contact" onClick={close} size="sm" className="site-nav-glass-cta">Let's Talk</GlassButton>
          <Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="hover:bg-white/15 hover:text-inherit lg:hidden">{open ? <X /> : <Menu />}</Button>
        </div>
      </nav>
      {open && <div className="site-menu-glass page-shell my-2 max-h-[calc(100dvh-100px)] overflow-y-auto rounded-lg border p-3 lg:hidden">
        <Link to="/" onClick={close} className={mobileNavLink("/")}>Home</Link>
        <Link to="/about" onClick={close} className={mobileNavLink("/about")}>About</Link>
        <Button variant="ghost" className={`w-full justify-between px-3 ${isServices ? "text-gold" : "text-navy"}`} aria-expanded={servicesOpen} onClick={() => setServicesOpen(!servicesOpen)}>Services <ChevronDown className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} /></Button>
        {servicesOpen && <div className="border-l border-border pl-1">{serviceLinks}</div>}
        <Link to="/projects" onClick={close} className={mobileNavLink("/projects")}>Projects</Link>
        <Link to="/resources" onClick={close} className={mobileNavLink("/resources")}>Resources</Link>
        <Link to="/contact" onClick={close} className={mobileNavLink("/contact")}>Contact</Link>
        <GlassButton as={Link} to="/contact" onClick={close} className="mt-2 w-full">Let's Talk</GlassButton>
      </div>}
    </header>
  );
}
