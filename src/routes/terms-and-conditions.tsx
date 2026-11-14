import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/policy-page";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => policyHead("Terms & Conditions", "Read ADZVO’s draft website terms covering website use, intellectual property and service agreements."),
  component: TermsAndConditions,
});

function TermsAndConditions() {
  return <PolicyPage title="Terms & Conditions" intro="The terms relating to use of the ADZVO website. Project-specific arrangements belong in a separate written agreement." sections={[
    { title: "Using this website", text: "Please use this website lawfully and respectfully. Do not attempt unauthorised access, disrupt its operation, introduce harmful software or misuse content or information obtained through it." },
    { title: "Website information", text: "Website content provides general information about ADZVO and its services. It is not a binding offer, a guarantee of results or professional advice. Service availability and project details should be confirmed directly with ADZVO." },
    { title: "Intellectual property", text: "Website text, branding, designs and media may be protected by intellectual property rights belonging to ADZVO or their respective owners. Viewing this website does not grant permission to reproduce or commercially exploit those materials. Obtain permission where required." },
    { title: "Project agreements", text: "Scope, fees, payment schedules, delivery dates, revisions, confidentiality and ownership of project work should be set out in a separate written agreement. An enquiry alone does not create a service contract." },
    { title: "External links", text: "Links to third-party websites are provided for convenience. ADZVO does not control their content or practices. Review the relevant terms and privacy notices before using external services." },
    { title: "Availability and responsibility", text: "Website access may be interrupted and information may change. Any final provisions concerning warranties, liability or dispute resolution must be reviewed under applicable law; nothing in these draft terms is intended to exclude rights that cannot lawfully be excluded." },
    { title: "Changes and applicable law", text: "These terms may be revised as the website and services evolve. The final terms should identify the contracting legal entity, effective date, applicable law and dispute forum after legal review." },
  ]} />;
}