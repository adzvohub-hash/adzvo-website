import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const Route = createFileRoute("/adzvoadmin")({
  head: () => ({ meta: [
    { title: "Admin Workspace — ADZVO" },
    { name: "description", content: "ADZVO frontend content management preview for homepage, projects and insights." },
    { property: "og:title", content: "Admin Workspace — ADZVO" },
    { property: "og:description", content: "ADZVO frontend content management preview for homepage, projects and insights." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: AdminDashboard,
});