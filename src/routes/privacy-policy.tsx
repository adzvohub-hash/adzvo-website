import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/policy-page";

export const Route = createFileRoute("/privacy-policy")({
  head: () => policyHead("Privacy Policy", "Read ADZVO’s draft privacy policy covering personal information, privacy choices and enquiries."),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return <PolicyPage title="Privacy Policy" intro="Your privacy matters. This policy outlines how personal information should be handled when you interact with ADZVO." sections={[
    { title: "Scope", text: "This policy applies to the ADZVO website and communications with our agency. Any separate agreement or privacy notice provided for a specific service should be read alongside this policy." },
    { title: "Information you provide", text: "When you contact us through a working communication channel, you may provide your name, email address, company details and information about your project. Please do not include sensitive personal information unless it is necessary and an appropriate secure channel has been agreed." },
    { title: "Website chat assistant", text: "Our website chat assistant is a guided menu, not a live person or an AI system. To start a chat we ask for your name, and optionally your email address and phone number. We record the conversation — the options you select, any phone number you enter, the page you were on, the type of device you used and the date and time — so our team can follow up on your enquiry and improve the website. If you request a call back, your details and enquiry are sent to our team by email so we can contact you. Chat records are stored in ADZVO’s Google account (Google Sheets and Gmail). If you choose to continue on WhatsApp, your message is handled by WhatsApp under its own privacy policy. To have your chat records deleted, email adzvohub@gmail.com." },
    { title: "Use of information", text: "Information provided in enquiries is intended to be used to respond to your questions, discuss potential projects and manage agreed services. Any additional use, including marketing communications, should have an appropriate legal basis and respect your choices." },
    { title: "Service providers and disclosure", text: "Where external providers are needed to deliver a service, personal information should be shared only as necessary and under appropriate safeguards. Disclosure may also be required by applicable law. The specific providers and processing arrangements must be confirmed before this policy is finalised." },
    { title: "Security and retention", text: "Personal information should be protected with safeguards appropriate to the information and retained only for as long as needed for the relevant purpose or legal obligations. No online transmission or storage method can guarantee absolute security." },
    { title: "Your choices", text: "Depending on applicable law, you may have rights to request access, correction or deletion of your personal information, or to object to certain processing. Contact ADZVO to discuss a request. Verification of your identity may be necessary." },
    { title: "External websites and updates", text: "External websites have their own privacy policies. This policy may be updated as services and practices change. The final version should include its effective date and verified business contact details." },
  ]} />;
}