/**
 * ADZVO guided chatbot — every question, answer and button lives here.
 * No AI and no server: the bot walks this tree.
 *
 * HOW TO EDIT
 * • Each step has an `id`, the bot's `text`, and `options` (the buttons).
 * • An option either goes to another step (`next`), opens a page on the site
 *   (`page`), opens an outside link (`href`), or runs an `action`.
 * • `set` remembers what the visitor is enquiring about (service).
 * • action "callback" passes the request to the team (see src/lib/callback.ts).
 *   The bot first shows a small form: name (required) plus phone or email (at least one).
 * • In text you can use {name}, {phone}, {service}, {contactVia}.
 * • "← Back" and "Main menu" are added automatically to every step but "main".
 */

export type Answers = { service?: string };

export type FlowOption = {
  label: string;
  next?: string;                        // go to another step
  page?: string;                        // open a page on this site, e.g. "/services/branding-design"
  href?: string;                        // open an outside link (mailto:, tel:, https:)
  action?: "whatsapp" | "email" | "callback"; // hand off to the team
  set?: Partial<Answers>;               // remember an answer
};

export type FlowStep = {
  id: string;
  text: string;
  options: FlowOption[];
  input?: "contact";                    // show the name / phone / email form under the message
};

/* ─── Contact details ─────────────────────────────────────────────────────── */
export const CONTACT = {
  whatsapp: "917012376221",             // country code + number, no "+" or spaces
  phones: [
    { label: "+91 70123 76221", tel: "+917012376221" },
    { label: "+91 90198 35261", tel: "+919019835261" },
  ],
  email: "adzvohub@gmail.com",
  careersEmail: "hr@adzvo.com",
  location: "Bangalore, India",
};

/* ─── Services ────────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    slug: "digital-technology", name: "Digital & Technology",
    intro: "We design and develop modern digital solutions — websites, mobile and web apps, e-commerce and UX/UI — built to be easy to use and ready to grow.",
    includes: ["Website Development", "Mobile & Web Apps", "E-commerce Solutions", "UX/UI Design", "Digital Platforms & Portals", "Optimization & Support"],
  },
  {
    slug: "marketing-growth", name: "Marketing & Growth",
    intro: "We create connected marketing that attracts the right audience, builds engagement and turns interest into measurable business growth.",
    includes: ["Social Media", "SEO & YouTube SEO", "Email Marketing", "Google & Meta Ads", "Lead Generation", "Conversion-rate optimization (CRO)"],
  },
  {
    slug: "branding-design", name: "Branding & Design",
    intro: "We build distinctive brands that communicate clearly and stay memorable across every customer touchpoint.",
    includes: ["Brand Strategy", "Logo & Identity", "Graphic Design", "Ad Creatives", "Packaging", "Presentations"],
  },
  {
    slug: "film-video-photography", name: "Film, Video & Photography",
    intro: "Through LCA Film Studio we turn ideas into visual stories — from ad and corporate films to commercials, podcasts and photography.",
    includes: ["Ad Films", "Corporate Films", "Commercials", "Podcasts", "Photography", "End-to-End Production"],
  },
  {
    slug: "animation-content", name: "Animation & Content",
    intro: "We combine storytelling, animation, motion and AI-enabled creativity to make ideas easier to understand and more engaging.",
    includes: ["2D & 3D Animation", "Motion Graphics", "Explainer Videos", "AI Content", "Short-Form Content", "Music Videos"],
  },
  {
    slug: "ai-automation", name: "AI & Automation",
    intro: "We turn AI into a practical advantage — finding the right opportunities, creating content and automating repetitive work.",
    includes: ["AI Consulting", "AI Content & Visuals", "Creative Workflows", "Business Automation"],
  },
  {
    slug: "content-localization", name: "Content & Localization",
    intro: "We create meaningful content and adapt it for different audiences, formats, cultures and languages — without losing the message.",
    includes: ["Copywriting", "Blogs", "E-books", "Storybooks", "Translation & Subtitles", "Multilingual Content"],
  },
  {
    slug: "strategy-analytics", name: "Strategy & Analytics",
    intro: "We connect strategy, data and measurement so you can make confident, informed marketing decisions.",
    includes: ["Digital & Marketing Strategy", "GA4", "Google Tag Manager", "Dashboards", "Reporting", "Content Strategy"],
  },
] as const;

const serviceSteps: FlowStep[] = SERVICES.flatMap((s) => [
  {
    id: `svc-${s.slug}`,
    text: `${s.name}\n\n${s.intro}`,
    options: [
      { label: "What's included?", next: `inc-${s.slug}` },
      { label: `Open the ${s.name} page`, page: `/services/${s.slug}` },
      { label: "Request a call back", next: "callback-ask", set: { service: s.name } },
      { label: "See other services", next: "services" },
    ],
  },
  {
    id: `inc-${s.slug}`,
    text: `${s.name} includes:\n${s.includes.map((x) => `• ${x}`).join("\n")}`,
    options: [
      { label: `Open the ${s.name} page`, page: `/services/${s.slug}` },
      { label: "Request a call back", next: "callback-ask", set: { service: s.name } },
      { label: "See other services", next: "services" },
    ],
  },
]);

/* ─── The flow ────────────────────────────────────────────────────────────── */
export const FLOW: FlowStep[] = [
  {
    id: "main",
    text: "Hi! I'm ADZVO's assistant. What would you like to do?",
    options: [
      { label: "Explore our services", next: "services" },
      { label: "Request a call back", next: "proj-service" },
      { label: "See our work", next: "work" },
      { label: "About ADZVO", next: "about" },
      { label: "Careers", next: "careers" },
      { label: "Talk to our team", next: "human" },
    ],
  },

  /* Services */
  {
    id: "services",
    text: "We offer 8 services under one roof. Which one would you like to know about?",
    options: [
      ...SERVICES.map((s) => ({ label: s.name, next: `svc-${s.slug}` })),
      { label: "View all services on the home page", page: "/#services" },
    ],
  },
  ...serviceSteps,

  /* Enquiry → call back */
  {
    id: "proj-service",
    text: "Happy to help! Which service would you like to talk to us about?",
    options: [
      ...SERVICES.map((s) => ({ label: s.name, next: "callback-ask", set: { service: s.name } })),
      { label: "More than one / not sure yet", next: "callback-ask", set: { service: "General enquiry" } },
    ],
  },
  {
    id: "callback-ask",
    text: "Would you like our team to get in touch with you about {service}?",
    options: [
      { label: "Yes, please contact me", action: "callback" },
      { label: "No, not right now", next: "callback-no" },
    ],
  },
  {
    id: "callback-phone",
    text: "Sure! Leave your name and a phone number or email (or both), and our team will get back to you.",
    input: "contact",
    options: [],
  },
  {
    id: "callback-done",
    text: "Thank you, {name}! I've let our team know about your enquiry on {service}. Someone will get back to you on {contactVia} shortly.",
    options: [
      { label: "Explore other services", next: "services" },
      { label: "See our work", next: "work" },
    ],
  },
  {
    id: "callback-no",
    text: "No problem! Is there anything else I can help you with?",
    options: [
      { label: "Explore our services", next: "services" },
      { label: "Talk to our team", next: "human" },
    ],
  },

  /* Work */
  {
    id: "work",
    text: "We've delivered 120+ projects for 50+ clients across India and global markets. Where would you like to look?",
    options: [
      { label: "View all projects", page: "/projects" },
      { label: "Read our insights & articles", page: "/resources" },
      { label: "Request a call back", next: "proj-service" },
    ],
  },

  /* About */
  {
    id: "about",
    text: "ADZVO is an advertising and digital agency built around an integrated way of working — creativity, technology and strategy together. We're based in Bangalore, India.",
    options: [
      { label: "Our mission & vision", next: "about-mission" },
      { label: "How we work with clients", next: "about-approach" },
      { label: "Open the About page", page: "/about" },
    ],
  },
  {
    id: "about-mission",
    text: "Mission — to help brands communicate with clarity and grow with confidence, combining creative thinking, digital capability and purposeful technology.\n\nVision — to be a trusted creative and digital partner for businesses building meaningful brands and lasting connections.\n\nPromise — thoughtful strategy, relevant creativity, reliable execution.",
    options: [
      { label: "How we work with clients", next: "about-approach" },
      { label: "Open the About page", page: "/about" },
      { label: "Request a call back", next: "proj-service" },
    ],
  },
  {
    id: "about-approach",
    text: "Every business has a different story, audience and ambition, so:\n• We listen first — every brief starts with understanding you.\n• We build around you — never a one-size-fits-all package.\n• We keep it clear — transparent collaboration from the first conversation to delivery.",
    options: [
      { label: "Explore our services", next: "services" },
      { label: "Open the About page", page: "/about" },
      { label: "Request a call back", next: "proj-service" },
    ],
  },

  /* Careers */
  {
    id: "careers",
    text: "We don't always have open roles listed, but we're always looking for talented people who care deeply about their craft.\n\nSend a short note about yourself to {careersEmail} — no formal application needed.",
    options: [
      { label: "Email {careersEmail}", href: "mailto:{careersEmail}?subject=Careers%20at%20ADZVO" },
      { label: "Open the Careers page", page: "/careers" },
    ],
  },

  /* Talk to a human */
  {
    id: "human",
    text: "Happy to connect you with our team. How would you like to reach us?",
    options: [
      { label: "Request a call back", next: "proj-service" },
      { label: "Chat on WhatsApp", action: "whatsapp" },
      { label: "Call us", next: "call" },
      { label: "Email us", action: "email" },
      { label: "Open the Contact page", page: "/contact" },
    ],
  },
  {
    id: "call",
    text: "You can reach us on either number. We're based in {location}.",
    options: [
      ...CONTACT.phones.map((p) => ({ label: `Call ${p.label}`, href: `tel:${p.tel}` })),
      { label: "Chat on WhatsApp instead", action: "whatsapp" as const },
    ],
  },
];

export const FLOW_BY_ID: Record<string, FlowStep> = Object.fromEntries(FLOW.map((s) => [s.id, s]));

/** How the team will reach the visitor: phone, email, or both. */
function contactVia(user: { phone: string; email?: string }) {
  if (user.phone && user.email) return `${user.phone} or ${user.email}`;
  return user.phone || user.email || "the details you gave";
}

/** Fill {name}, {phone}, {service}, {contactVia}, … in a piece of text. */
export function fill(text: string, user: { name: string; phone: string; email?: string }, a: Answers) {
  return text
    .replace(/\{name\}/g, user.name || "there")
    .replace(/\{contactVia\}/g, contactVia(user))
    .replace(/\{phone\}/g, user.phone || "your number")
    .replace(/\{service\}/g, a.service ?? "your enquiry")
    .replace(/\{careersEmail\}/g, CONTACT.careersEmail)
    .replace(/\{location\}/g, CONTACT.location);
}

/** The message sent by WhatsApp / email: the visitor's details plus any answers. */
export function leadMessage(user: { name: string; email: string; phone: string }, a: Answers) {
  const lines = [user.name ? `Hi ADZVO, I'm ${user.name}.` : "Hi ADZVO,"];
  if (a.service) lines.push(`I'm interested in: ${a.service}`);
  if (user.email) lines.push(`Email: ${user.email}`);
  if (user.phone) lines.push(`Phone: ${user.phone}`);
  if (!a.service) lines.push("I'd like to talk to your team.");
  return lines.join("\n");
}
