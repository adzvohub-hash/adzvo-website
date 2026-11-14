import { servicePages } from "@/lib/services";
import { getProjects, type Project } from "@/lib/api";

export { type Project } from "@/lib/api";

export const projectLocations = [
  "Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Chennai",
  "Pune", "Dubai", "Riyadh", "Doha", "London",
] as const;

type Slug = (typeof servicePages)[number]["slug"];

/** Seed data shown before the API responds (SSR / first paint). */
const pdf = "/case-studies/sample-case-study.pdf";
export const projectsSeed: Project[] = [
  { id: "retail-ai",        title: "Intelligent Retail Automation Platform", client: "OmniRetail India",   location: "Bengaluru", service: "ai-automation",          description: "An AI-driven operations platform that forecasts demand, automates replenishment and routes customer queries across 300 stores.",              image_url: "", case_study_url: pdf, sort_order: 0, created_at: "", updated_at: "" },
  { id: "d2c-brand",        title: "National D2C Brand Identity & Packaging", client: "Verdant Organics",  location: "Mumbai",    service: "branding-design",        description: "A complete identity system and packaging range for a fast-growing organic food brand.",                                                         image_url: "", case_study_url: pdf, sort_order: 1, created_at: "", updated_at: "" },
  { id: "aero-tvc",         title: "Cinematic Brand Film & TVC Campaign",     client: "AeroTech Mobility", location: "Mumbai",    service: "film-video-photography", description: "A multi-day cinematic shoot producing a hero brand film, TV commercial cut-downs and a photography library.",                                 image_url: "", case_study_url: pdf, sort_order: 2, created_at: "", updated_at: "" },
  { id: "bharat-local",     title: "Multilingual E-Commerce Localization",    client: "Bharatkart",        location: "Chennai",   service: "content-localization",   description: "Transcreated product content, voice-overs and campaigns in nine Indian languages.",                                                            image_url: "", case_study_url: pdf, sort_order: 3, created_at: "", updated_at: "" },
  { id: "finpulse-growth",  title: "Pan-India Performance Growth Engine",     client: "FinPulse Tech",     location: "Delhi NCR", service: "marketing-growth",       description: "A full-funnel performance programme across search, social and lifecycle channels.",                                                           image_url: "", case_study_url: pdf, sort_order: 4, created_at: "", updated_at: "" },
  { id: "cloud-ui",         title: "Enterprise Cloud Product UI System",      client: "Nimbus Systems",    location: "Hyderabad", service: "digital-technology",     description: "A design system and responsive web app rebuild for an enterprise cloud console.",                                                            image_url: "", case_study_url: pdf, sort_order: 5, created_at: "", updated_at: "" },
  { id: "market-entry",     title: "GCC Market Entry Strategy",               client: "Spice Route Foods", location: "Dubai",     service: "strategy-analytics",     description: "Market research, competitor mapping and a data-backed entry roadmap for an Indian food brand expanding into the UAE.",                     image_url: "", case_study_url: pdf, sort_order: 6, created_at: "", updated_at: "" },
  { id: "explainer-3d",     title: "3D Product Explainer Series",             client: "Kinetic Health",    location: "Pune",      service: "animation-content",      description: "A series of 3D animated explainers showing how a medical device works, used across sales, events and social media.",                     image_url: "", case_study_url: pdf, sort_order: 7, created_at: "", updated_at: "" },
  { id: "riyadh-portal",    title: "Smart Services Citizen Portal",           client: "Urban Services Co.",location: "Riyadh",    service: "digital-technology",     description: "A bilingual citizen services portal with a unified dashboard, online payments and real-time request tracking.",                            image_url: "", case_study_url: pdf, sort_order: 8, created_at: "", updated_at: "" },
  { id: "doha-film",        title: "Hospitality Brand Documentary",           client: "Pearl Bay Resorts", location: "Doha",      service: "film-video-photography", description: "A documentary-style brand film and stills capturing guest experiences for a luxury resort group.",                                       image_url: "", case_study_url: pdf, sort_order: 9, created_at: "", updated_at: "" },
  { id: "london-analytics", title: "Customer Insight Dashboard",              client: "Northgate Retail",  location: "London",    service: "strategy-analytics",     description: "Unified analytics and customer segmentation dashboards that guide merchandising and marketing decisions.",                                   image_url: "", case_study_url: pdf, sort_order: 10, created_at: "", updated_at: "" },
  { id: "chatbot-blr",      title: "Conversational AI Support Assistant",     client: "PayNest",           location: "Bengaluru", service: "ai-automation",          description: "A multilingual AI assistant resolving routine support queries instantly, with smooth handoff to human agents.",                            image_url: "", case_study_url: pdf, sort_order: 11, created_at: "", updated_at: "" },
];

/** Fetch live projects from D1. Falls back to seed on error. */
export async function fetchProjects(): Promise<Project[]> {
  try {
    const data = await getProjects();
    return data.length > 0 ? data : projectsSeed;
  } catch {
    return projectsSeed;
  }
}

// Keep old export shape for any components that still import `projects`
export const projects = projectsSeed;
