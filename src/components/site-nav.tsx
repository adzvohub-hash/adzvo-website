import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { servicePages } from "@/lib/services";
import { BrandLogo } from "@/components/brand-logo";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const close = () => { setOpen(false); setServicesOpen(false); };
  const serviceLinks = servicePages.map((service, i) => (
    <Link key={service.slug} to="/services/$service" params={{ service: service.slug }} onClick={close}
      className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-navy transition-colors hover:bg-electric/10 hover:text-electric focus-visible:bg-electric/10 focus-visible:outline-none">
      <span className="text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
      <span className="flex-1">{service.title}</span><ArrowUpRight className="size-4 shrink-0" />
    </Link>
  ));
  return (
    <header className={`site-nav-glass fixed inset-x-0 top-0 z-50 border-b ${scrolled ? "site-nav-scrolled" : ""}`} onKeyDown={(event) => { if (event.key === "Escape") close(); }}>
      <nav aria-label="Main navigation" className="page-shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 md:flex md:justify-between">
        <Link to="/" onClick={close} aria-label="ADZVO home" className="min-w-0"><BrandLogo /></Link>
        <ul className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.16em] md:flex">
          <li><Link to="/" className="hover:text-gold">Home</Link></li>
          <li><Link to="/about" className="hover:text-gold">About</Link></li>
          <li className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false); }}>
            <Button variant="ghost" aria-expanded={servicesOpen} aria-controls="desktop-services" onFocus={() => setServicesOpen(true)} onClick={() => setServicesOpen(!servicesOpen)}
              className="h-auto gap-1.5 p-0 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-transparent hover:text-gold">
              Services <ChevronDown className={`size-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </Button>
            {servicesOpen && <div id="desktop-services" className="absolute left-1/2 top-full w-[370px] -translate-x-1/2 pt-6">
              <div className="site-menu-glass rounded-lg border p-2 normal-case tracking-normal">{serviceLinks}</div>
            </div>}
          </li>
          <li><Link to="/projects" className="hover:text-gold">Projects</Link></li>
          <li><Link to="/resources" className="hover:text-gold">Resources</Link></li>
          <li><Link to="/" hash="contact" className="hover:text-gold">Contact</Link></li>
        </ul>
        <Button asChild className="site-nav-cta hidden md:inline-flex"><Link to="/" hash="contact" onClick={close}>Let's Talk</Link></Button>
        <Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="hover:bg-white/15 hover:text-inherit md:hidden">{open ? <X /> : <Menu />}</Button>
      </nav>
      {open && <div className="site-menu-glass page-shell my-2 max-h-[calc(100dvh-100px)] overflow-y-auto rounded-lg border p-3 md:hidden">
        <Link to="/" onClick={close} className="block px-3 py-3 font-semibold text-navy">Home</Link>
        <Link to="/about" onClick={close} className="block px-3 py-3 font-semibold text-navy">About</Link>
        <Button variant="ghost" className="w-full justify-between px-3 text-navy" aria-expanded={servicesOpen} onClick={() => setServicesOpen(!servicesOpen)}>Services <ChevronDown className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} /></Button>
        {servicesOpen && <div className="border-l border-border pl-1">{serviceLinks}</div>}
        <Link to="/projects" onClick={close} className="block px-3 py-3 font-semibold text-navy">Projects</Link>
        <Link to="/resources" onClick={close} className="block px-3 py-3 font-semibold text-navy">Resources</Link>
        <Link to="/" hash="contact" onClick={close} className="block px-3 py-3 font-semibold text-navy">Contact</Link>
        <Button asChild className="mt-2 w-full"><Link to="/" hash="contact" onClick={close}>Let's Talk</Link></Button>
      </div>}
    </header>
  );
}