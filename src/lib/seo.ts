/**
 * Page titles and descriptions — the ONE place to edit what Google and social
 * previews (WhatsApp, LinkedIn, Facebook) show for each page.
 *
 * Guidelines
 * • Title: search phrase first, "| ADZVO" last, 60 characters or fewer.
 * • Description: 120–155 characters, says what the page offers and gives a reason to click.
 * • Articles are not here: their title and description come from the article itself (admin).
 */

type PageSeo = { title: string; description: string };

export const PAGE_SEO = {
  home: {
    title: "Creative & Digital Marketing Agency in Bangalore | ADZVO",
    description: "ADZVO is a Bangalore creative and digital agency for branding, websites, digital marketing, video and AI, helping brands across India grow. Let's talk.",
  },
  about: {
    title: "About ADZVO | Creative & Digital Agency, Bangalore",
    description: "Meet ADZVO, a Bangalore advertising and digital agency bringing creativity, technology and strategy together to build stronger brands across India.",
  },
  projects: {
    title: "Our Work: Branding, Digital & Film Projects | ADZVO",
    description: "See ADZVO's work for brands across India and the GCC: branding, websites, marketing, film and AI projects. Filter by service and location.",
  },
  resources: {
    title: "Marketing, Branding & AI Insights | ADZVO Resources",
    description: "Practical guides from ADZVO on branding, digital marketing, AI, film and content, to help growing brands make smarter decisions.",
  },
  contact: {
    title: "Contact ADZVO | Digital Agency in Bangalore",
    description: "Tell us about your project and we'll reply within one business day. Call +91 70123 76221, WhatsApp us or send an enquiry to our Bangalore team.",
  },
  careers: {
    title: "Careers at ADZVO | Creative & Digital Jobs in Bangalore",
    description: "Join ADZVO in Bangalore. We're always open to designers, developers, marketers, filmmakers and writers who care about their craft. Say hello.",
  },
  privacy: {
    title: "Privacy Policy | ADZVO",
    description: "How ADZVO collects, uses and protects personal information shared through our website, contact form and chat assistant.",
  },
  terms: {
    title: "Terms & Conditions | ADZVO",
    description: "The terms for using the ADZVO website, including intellectual property, external links and how our project agreements work.",
  },
  cookies: {
    title: "Cookie Policy | ADZVO",
    description: "How the ADZVO website uses cookies and similar technologies, including analytics, and how you can manage your choices.",
  },
} satisfies Record<string, PageSeo>;

/** Service pages, keyed by the slug in the URL (/services/<slug>). */
export const SERVICE_SEO: Record<string, PageSeo> = {
  "digital-technology": {
    title: "Website & App Development Company in Bangalore | ADZVO",
    description: "Websites, mobile and web apps, e-commerce and UX/UI design from ADZVO in Bangalore. Fast, secure digital products built to grow your business.",
  },
  "marketing-growth": {
    title: "Digital Marketing Agency in Bangalore: SEO & Ads | ADZVO",
    description: "Social media, SEO, Google and Meta ads, email and lead generation from ADZVO, a Bangalore digital marketing agency focused on measurable growth.",
  },
  "branding-design": {
    title: "Branding & Design Agency in Bangalore | ADZVO",
    description: "Brand strategy, logo and identity, packaging, ad creatives and presentations by ADZVO in Bangalore. Build a brand people recognise and trust.",
  },
  "film-video-photography": {
    title: "Video Production Company in Bangalore | ADZVO",
    description: "Ad films, corporate films, TV commercials, podcasts and photography by ADZVO and LCA Film Studio in Bangalore. End-to-end production, idea to screen.",
  },
  "animation-content": {
    title: "Animation & Motion Graphics Studio in Bangalore | ADZVO",
    description: "2D and 3D animation, motion graphics, explainer videos, reels and AI content from ADZVO in Bangalore. Make complex ideas simple and memorable.",
  },
  "ai-automation": {
    title: "AI Automation & Consulting Agency in Bangalore | ADZVO",
    description: "AI consulting, AI content and visuals, creative workflows and business automation from ADZVO in Bangalore. Save time and scale your work with AI.",
  },
  "content-localization": {
    title: "Content Writing & Translation in Bangalore | ADZVO",
    description: "Copywriting, blogs, e-books, translation, subtitles and multilingual content from ADZVO in Bangalore. Reach audiences across India in their language.",
  },
  "strategy-analytics": {
    title: "Digital Strategy & GA4 Analytics in Bangalore | ADZVO",
    description: "Digital and marketing strategy, GA4 and Tag Manager setup, dashboards and reporting from ADZVO in Bangalore. Know what works and where to invest next.",
  },
};

export const SITE_URL = "https://adzvo.com";

/** The one official address of a page — used for the canonical tag and og:url.
 *  Ad clicks add ?gclid=… and other tracking to URLs; the canonical tells Google
 *  all of those are this same page. */
/** Default picture for link previews (WhatsApp, LinkedIn, Facebook, X). 1200×630, in /public. */
export const SHARE_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: "1200",
  height: "630",
  alt: "ADZVO — Ideas That Inspire. Digital That Delivers.",
};

/** The share-image tags. Pass a page's own picture to override the default. */
export const shareImageMeta = (image?: string) =>
  image
    ? [
        { property: "og:image", content: image },
        { name: "twitter:image", content: image },
      ]
    : [
        { property: "og:image", content: SHARE_IMAGE.url },
        { property: "og:image:width", content: SHARE_IMAGE.width },
        { property: "og:image:height", content: SHARE_IMAGE.height },
        { property: "og:image:alt", content: SHARE_IMAGE.alt },
        { name: "twitter:image", content: SHARE_IMAGE.url },
      ];

export const canonicalUrl = (path: string) => SITE_URL + (path === "/" ? "/" : path.replace(/\/+$/, ""));

/** Builds a route's head(): title, description, canonical link and matching social-share tags. */
export function seoHead({ title, description }: PageSeo, path: string, type: "website" | "article" = "website") {
  const url = canonicalUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "ADZVO" },
      { name: "twitter:card", content: "summary_large_image" },
      ...shareImageMeta(),
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
