import { CtaBand } from "@/components/cta-video";
import { GlassButton } from "@/components/glass-button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Boxes, Sparkles, Presentation, Bot, Smartphone, Music, Globe, AppWindow, ShoppingCart, PenTool, LayoutDashboard, Gauge, Compass, Fingerprint, Palette, Megaphone, Package, MonitorPlay, Clapperboard, Building2, Video, Mic2, Camera, Film, PenLine, Newspaper, BookOpen, Book, Languages, Target, BarChart3, Tags, FileText, ListChecks, Share2, Search, Mail, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Highlight, SectionLabel } from "@/components/brand-logo";
import { CapabilitySpotlight } from "@/components/capability-spotlight";
import { CapabilityShowcase } from "@/components/capability-showcase";
import { CapabilityBento, CapabilityFlip, CapabilityPanels, CapabilityStack, CapabilityTilt } from "@/components/capability-layouts";
import { Button } from "@/components/ui/button";
import { servicePages } from "@/lib/services";
import animationCta from "@/assets/animation-play.jpg";
import digitalCta from "@/assets/svc-1.jpg";
import brandingCta from "@/assets/svc-3.jpg";
import filmCta from "@/assets/film-behind-scenes.jpg";
import contentCta from "@/assets/svc-7.jpg";
import strategyCta from "@/assets/svc-8.jpg";
import marketingCta from "@/assets/svc-2.jpg";

type Capability = { icon: LucideIcon; title: string; text: string };

// ── Animation variants ────────────────────────────────────────────────────────

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function CapabilityCard({ icon: Icon, title, text }: Capability) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="group flex flex-col rounded-3xl border border-navy/10 bg-off p-6 text-left transition-colors duration-300 hover:border-navy hover:bg-navy sm:p-7"
    >
      <span className="grid size-12 place-items-center rounded-xl bg-gold text-navy transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
        <Icon className="size-6" strokeWidth={2.2} />
      </span>
      <h3 className="mt-6 text-lg font-semibold text-navy transition-colors duration-300 group-hover:text-primary-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-primary-foreground/75">{text}</p>
      <span className="mt-auto block pt-5"><span className="block h-1 w-8 rounded-full bg-gold transition-all duration-300 group-hover:w-16" /></span>
    </motion.div>
  );
}

type BodyContent = {
  intro: string;
  capabilities: Capability[];
  /** How the capability list is presented. Omit for the classic icon grid. */
  layout?: "spotlight" | "showcase" | "tilt" | "panels" | "flip" | "stack" | "bento";
  studioLink?: { href: string; label: string };
  ctaTitle: [string, string];
  ctaText?: string;
  ctaLabel: string;
  ctaImage: string;
  ctaAlt: string;
};

const marketingCapabilities: Capability[] = [
  { icon: Share2, title: "Social Media", text: "Content and campaigns that build visibility, relevance, and community." },
  { icon: Search, title: "SEO & YouTube SEO", text: "Search-led strategies that improve discoverability across Google and YouTube." },
  { icon: Mail, title: "Email Marketing", text: "Targeted communication that nurtures audiences and strengthens relationships." },
  { icon: TrendingUp, title: "Google & Meta Ads", text: "Performance campaigns designed for reach, leads, and return on investment." },
  { icon: Target, title: "Lead Generation", text: "Focused acquisition journeys that connect your business with qualified prospects." },
  { icon: Zap, title: "CRO", text: "Data-informed improvements that turn more visits into meaningful actions." },
];

const animationCapabilities: Capability[] = [
  { icon: Boxes, title: "2D & 3D Animation", text: "Immersive animated experiences tailored to your story and visual style." },
  { icon: Sparkles, title: "Motion Graphics", text: "Dynamic visuals that bring brand messages, data, and ideas to life." },
  { icon: Presentation, title: "Explainer Videos", text: "Clear, engaging stories that make complex information easy to understand." },
  { icon: Bot, title: "AI Content", text: "Fast, imaginative content created through human creativity and AI-enabled workflows." },
  { icon: Smartphone, title: "Short-Form Content", text: "Platform-ready reels and videos built for quick, high-impact engagement." },
  { icon: Music, title: "Music Videos", text: "Concept-led visual storytelling that complements the sound and artist identity." },
];

const digitalCapabilities: Capability[] = [
  { icon: Globe, title: "Website Development", text: "Modern, responsive websites built around your brand, audience, and business goals." },
  { icon: AppWindow, title: "Mobile & Web Apps", text: "User-friendly applications designed for seamless experiences across devices and platforms." },
  { icon: ShoppingCart, title: "E-commerce Solutions", text: "Engaging online stores with smooth browsing, checkout, and customer journeys designed to convert." },
  { icon: PenTool, title: "UX/UI Design", text: "Intuitive interfaces and thoughtful user journeys that make every interaction simple, engaging, and effective." },
  { icon: LayoutDashboard, title: "Digital Platforms & Portals", text: "Custom digital experiences that bring content, services, workflows, and users together in one place." },
  { icon: Gauge, title: "Optimization & Support", text: "Continuous improvements focused on performance, usability, responsiveness, and evolving business needs." },
];

const brandingCapabilities: Capability[] = [
  { icon: Compass, title: "Brand Strategy", text: "Positioning, purpose, and direction that give your brand a strong foundation." },
  { icon: Fingerprint, title: "Logo & Identity", text: "Distinctive visual identities designed for recognition and consistency." },
  { icon: Palette, title: "Graphic Design", text: "Thoughtful design for digital, print, campaigns, and everyday communication." },
  { icon: Megaphone, title: "Ad Creatives", text: "Scroll-stopping campaign assets built to capture attention and inspire action." },
  { icon: Package, title: "Packaging", text: "Impactful packaging that balances shelf appeal, clarity, and brand character." },
  { icon: MonitorPlay, title: "Presentations", text: "Polished, persuasive decks that transform ideas into clear visual stories." },
];

const filmCapabilities: Capability[] = [
  { icon: Clapperboard, title: "Ad Films", text: "Concept-driven films designed to capture attention and move audiences." },
  { icon: Building2, title: "Corporate Films", text: "Authentic stories that communicate your purpose, culture, and impact." },
  { icon: Video, title: "Commercials", text: "High-quality productions crafted for broadcast, digital, and social platforms." },
  { icon: Mic2, title: "Podcasts", text: "Professional audio and video podcast production, from setup to final edit." },
  { icon: Camera, title: "Photography", text: "Brand, product, people, and campaign photography with a consistent visual style." },
  { icon: Film, title: "End-to-End Production", text: "Creative development, filming, editing, sound, and final delivery." },
];

const contentLocalizationCapabilities: Capability[] = [
  { icon: PenLine, title: "Copywriting", text: "Brand-led copy for websites, campaigns, products, and communication." },
  { icon: Newspaper, title: "Blogs", text: "Useful, search-friendly articles that build authority and audience interest." },
  { icon: BookOpen, title: "E-books", text: "Well-structured long-form content designed to educate and generate value." },
  { icon: Book, title: "Storybooks", text: "Imaginative stories shaped for learning, engagement, and memorable experiences." },
  { icon: Languages, title: "Translation & Subtitles", text: "Accurate language adaptation and subtitles for global accessibility." },
  { icon: Globe, title: "Multilingual Content", text: "Consistent content experiences customized for regional audiences." },
];

const strategyAnalyticsCapabilities: Capability[] = [
  { icon: Target, title: "Digital & Marketing Strategy", text: "Clear plans that connect your goals, audiences, channels and budget into one practical roadmap." },
  { icon: BarChart3, title: "GA4", text: "Measurement frameworks that reveal how users discover, explore, and convert." },
  { icon: Tags, title: "Tag Manager", text: "Structured tracking implementation for cleaner, more reliable marketing data." },
  { icon: LayoutDashboard, title: "Dashboards", text: "Clear visual views of the metrics and trends that matter most." },
  { icon: FileText, title: "Reporting", text: "Insight-led performance reports with focused findings and next steps." },
  { icon: ListChecks, title: "Content Strategy", text: "Audience-focused plans that connect content themes, channels, and business goals." },
];

export const serviceBodies: Record<string, BodyContent> = {
  "marketing-growth": {
    intro: "We create connected marketing experiences that help brands attract the right audience, strengthen engagement, and turn interest into measurable business growth. From social media and targeted email campaigns to SEO, YouTube SEO, Google and Meta advertising, every initiative is shaped around clear objectives and audience insights. Our lead-generation and conversion-rate optimization strategies continuously improve the customer journey, helping your marketing investment deliver stronger visibility, qualified opportunities, and sustainable results.",
    capabilities: marketingCapabilities,
    layout: "showcase",
    ctaTitle: ["Ready to accelerate", "your growth?"],
    ctaLabel: "Build My Growth Plan",
    ctaImage: marketingCta,
    ctaAlt: "Marketing and performance analytics workspace",
  },
  "animation-content": {
    intro: "We combine imaginative storytelling, animation, motion, and AI-enabled creativity to produce content that makes ideas easier to understand and more engaging to experience. Our capabilities include 2D and 3D animation, motion graphics, explainer videos, AI-assisted content, short-form social content, and music videos. From simplifying complex information to creating high-impact visual moments, we develop content tailored to your audience, platform, and communication goals.",
    capabilities: animationCapabilities, layout: "flip", ctaTitle: ["Turn your next idea", "into motion."], ctaLabel: "Create With Us", ctaImage: animationCta, ctaAlt: "Sculptural 3D star and sphere artwork",
  },
  "branding-design": {
    intro: "We build distinctive brands that communicate clearly, connect meaningfully, and remain memorable across every customer touchpoint. Our approach brings together brand strategy, logo and identity development, graphic design, advertising creatives, packaging, and presentations to create one consistent visual language. Whether launching a new brand or refreshing an established identity, we translate your purpose and personality into impactful design that strengthens recognition, credibility, and audience trust.",
    capabilities: brandingCapabilities, ctaTitle: ["Let’s create a brand", "that stands apart."], ctaLabel: "Shape My Brand", ctaImage: brandingCta, ctaAlt: "Branded stationery and packaging laid out on a desk",
  },
  "digital-technology": {
    intro: "We design and develop modern digital solutions that combine smart technology with intuitive experiences. From high-performing websites and mobile apps to e-commerce platforms and UX/UI, we turn ideas into scalable digital products that are easy to use and built for growth.",
    capabilities: digitalCapabilities, layout: "tilt", ctaTitle: ["Have an idea? Let’s", "bring it to life."], ctaText: "From the first sketch to the final launch, we help transform your vision into a meaningful digital experience.", ctaLabel: "Start Your Digital Project", ctaImage: digitalCta, ctaAlt: "Laptop showing a modern website build",
  },
  "film-video-photography": {
    intro: "Through LCA Film Studio, we transform ideas into compelling visual stories that capture attention and create lasting impact. From advertising and corporate films to commercials, podcasts, and professional photography, we manage every stage of the creative process with a strong focus on storytelling and production quality. Our end-to-end capabilities cover concept development, scripting, filming, editing, sound, and final delivery, ensuring every frame communicates your brand with clarity and purpose.",
    capabilities: filmCapabilities,
    layout: "panels",
    studioLink: { href: "https://www.lcafilmstudio.com/", label: "Visit LCA Film Studio" },
    ctaTitle: ["Have a story worth", "filming?"],
    ctaLabel: "Start a Production",
    ctaImage: filmCta,
    ctaAlt: "Film crew preparing a cinema camera on set",
  },
  "content-localization": {
    intro: "We create meaningful content and adapt it for different audiences, formats, cultures, and languages without losing the clarity or intent of the original message. Our services include copywriting, blogs, e-books, storybooks, translation, subtitles, and multilingual content development for digital and offline channels. By combining thoughtful writing with culturally relevant localization, we help brands communicate consistently, improve accessibility, and build stronger connections with audiences across regions.",
    capabilities: contentLocalizationCapabilities,
    layout: "stack",
    ctaTitle: ["Take your content", "beyond borders."],
    ctaLabel: "Create With Us",
    ctaImage: contentCta,
    ctaAlt: "Books and handwritten notes surrounded by multilingual scripts",
  },
  "strategy-analytics": {
    intro: "We connect strategy, data, and performance measurement to help businesses make confident and informed marketing decisions. Our services cover digital and marketing strategy, GA4, Google Tag Manager, dashboards, reporting, and content strategy, creating a clear view of how audiences discover, engage, and convert. We transform complex performance data into focused insights, practical recommendations, and actionable roadmaps that reveal what is working, what needs improvement, and where the next opportunity lies.",
    capabilities: strategyAnalyticsCapabilities,
    layout: "bento",
    ctaTitle: ["Make your next", "move with clarity."],
    ctaLabel: "Plan With Data",
    ctaImage: strategyCta,
    ctaAlt: "Analytics dashboard showing audience, acquisition and sales performance",
  },
};

export function ServiceContentBody({ slug }: { slug: string }) {
  const body = serviceBodies[slug];
  if (!body) return null;
  const others = servicePages.filter((s) => s.slug !== slug);
  return <>
    <section className="bg-background py-16 sm:py-20">
      <div className="page-shell">
        <p className="mx-auto max-w-3xl text-center leading-relaxed text-muted-foreground">{body.intro}</p>
        {/* key={slug}: moving between service pages reuses this component, and the scroll-in
            animation only plays once per mount. Without the key, the next page's cards
            are added to an already-played animation and stay invisible until a refresh. */}
        {body.layout === "spotlight" ? <CapabilitySpotlight key={slug} capabilities={body.capabilities} />
        : body.layout === "showcase" ? <CapabilityShowcase key={slug} capabilities={body.capabilities} />
        : body.layout === "tilt" ? <CapabilityTilt key={slug} capabilities={body.capabilities} />
        : body.layout === "panels" ? <CapabilityPanels key={slug} capabilities={body.capabilities} />
        : body.layout === "flip" ? <CapabilityFlip key={slug} capabilities={body.capabilities} />
        : body.layout === "stack" ? <CapabilityStack key={slug} capabilities={body.capabilities} />
        : body.layout === "bento" ? <CapabilityBento key={slug} capabilities={body.capabilities} />
        : <motion.div
          key={slug}
          className="mx-auto mt-14 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {body.capabilities.map((cap) => (
            <CapabilityCard key={cap.title} {...cap} />
          ))}
        </motion.div>}
        {body.studioLink && <div className="mt-12 text-center">
          <GlassButton as="a" href={body.studioLink.href} target="_blank" rel="noreferrer">
            {body.studioLink.label} <ArrowUpRight />
          </GlassButton>
        </div>}
      </div>
    </section>

    <CtaBand slug={slug} poster={body.ctaImage} label={body.ctaAlt}>
          <SectionLabel light>Start a Project</SectionLabel>
          <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{body.ctaTitle[0]}<br /><Highlight dark>{body.ctaTitle[1]}</Highlight></h2>
          {body.ctaText && <p className="mt-6 max-w-md text-primary-foreground/85">{body.ctaText}</p>}
          <GlassButton as={Link} to="/" hash="contact" className="mt-8">{body.ctaLabel} <ArrowRight /></GlassButton>
    </CtaBand>

    <section className="bg-off py-16 text-navy sm:py-20">
      <div className="page-shell">
        <SectionLabel>Explore More</SectionLabel>
        <h2 className="mt-5 font-display text-4xl font-extrabold">Other <Highlight>Services</Highlight></h2>
        <div className="mt-10 overflow-hidden pb-4">
          <div className="ai-services-track flex w-max gap-5">
          {[...others, ...others].map((s, i) => (
            <Link key={`${s.slug}-${i}`} to="/services/$service" params={{ service: s.slug }} aria-hidden={i >= others.length || undefined} tabIndex={i >= others.length ? -1 : undefined}
              className="group relative h-72 w-64 shrink-0 overflow-hidden rounded-lg bg-navy text-primary-foreground shadow-xl shadow-navy/20">
              <img src={s.image} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
              <ArrowUpRight className="absolute right-3 top-3 size-4" />
              <div className="absolute inset-x-4 bottom-4">
                <p className="font-display text-lg">{s.title}</p>
                <span className="mt-2 block h-0.5 w-8 bg-gold" />
              </div>
            </Link>
          ))}
          </div>
        </div>
        <Link to="/" hash="services" className="mt-6 inline-flex items-center gap-2 border-b-2 border-gold pb-0.5 font-semibold text-navy transition hover:gap-3">All services <ArrowRight className="size-4" /></Link>
      </div>
    </section>
  </>;
}
