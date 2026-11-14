import { servicePages } from "@/lib/services";

export const projectLocations = ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Chennai", "Pune", "Dubai", "Riyadh", "Doha", "London"] as const;

type Slug = (typeof servicePages)[number]["slug"];
export type Project = {
  id: string; title: string; client: string; location: (typeof projectLocations)[number];
  service: Slug; description: string; caseStudyUrl: string;
};

const pdf = "/case-studies/sample-case-study.pdf";
export const projects: Project[] = [
  { id: "retail-ai", title: "Intelligent Retail Automation Platform", client: "OmniRetail India", location: "Bengaluru", service: "ai-automation", description: "An AI-driven operations platform that forecasts demand, automates replenishment and routes customer queries across 300 stores, cutting manual workload and stock-outs.", caseStudyUrl: pdf },
  { id: "d2c-brand", title: "National D2C Brand Identity & Packaging", client: "Verdant Organics", location: "Mumbai", service: "branding-design", description: "A complete identity system and packaging range for a fast-growing organic food brand, built to stand out on shelves and on screen.", caseStudyUrl: pdf },
  { id: "aero-tvc", title: "Cinematic Brand Film & TVC Campaign", client: "AeroTech Mobility", location: "Mumbai", service: "film-video-photography", description: "A multi-day cinematic shoot producing a hero brand film, TV commercial cut-downs and a photography library for the national launch.", caseStudyUrl: pdf },
  { id: "bharat-local", title: "Multilingual E-Commerce Localization & Voice", client: "Bharatkart", location: "Chennai", service: "content-localization", description: "Transcreated product content, voice-overs and campaigns in nine Indian languages, helping the platform connect with regional shoppers.", caseStudyUrl: pdf },
  { id: "finpulse-growth", title: "Pan-India Performance Growth Engine", client: "FinPulse Tech", location: "Delhi NCR", service: "marketing-growth", description: "A full-funnel performance programme across search, social and lifecycle channels that scaled sign-ups while lowering acquisition cost.", caseStudyUrl: pdf },
  { id: "cloud-ui", title: "Enterprise Cloud Product UI System", client: "Nimbus Systems", location: "Hyderabad", service: "digital-technology", description: "A design system and responsive web app rebuild for an enterprise cloud console, improving speed, accessibility and developer handoff.", caseStudyUrl: pdf },
  { id: "market-entry", title: "GCC Market Entry Strategy", client: "Spice Route Foods", location: "Dubai", service: "strategy-analytics", description: "Market research, competitor mapping and a data-backed entry roadmap for an Indian food brand expanding into the UAE.", caseStudyUrl: pdf },
  { id: "explainer-3d", title: "3D Product Explainer Series", client: "Kinetic Health", location: "Pune", service: "animation-content", description: "A series of 3D animated explainers showing how a medical device works, used across sales, events and social media.", caseStudyUrl: pdf },
  { id: "riyadh-portal", title: "Smart Services Citizen Portal", client: "Urban Services Co.", location: "Riyadh", service: "digital-technology", description: "A bilingual citizen services portal with a unified dashboard, online payments and real-time request tracking.", caseStudyUrl: pdf },
  { id: "doha-film", title: "Hospitality Brand Documentary", client: "Pearl Bay Resorts", location: "Doha", service: "film-video-photography", description: "A documentary-style brand film and stills capturing guest experiences for a luxury resort group.", caseStudyUrl: pdf },
  { id: "london-analytics", title: "Customer Insight Dashboard", client: "Northgate Retail", location: "London", service: "strategy-analytics", description: "Unified analytics and customer segmentation dashboards that guide merchandising and marketing decisions.", caseStudyUrl: pdf },
  { id: "chatbot-blr", title: "Conversational AI Support Assistant", client: "PayNest", location: "Bengaluru", service: "ai-automation", description: "A multilingual AI assistant resolving routine support queries instantly, with smooth handoff to human agents.", caseStudyUrl: pdf },
];
