import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, policyHead } from "@/components/policy-page";

export const Route = createFileRoute("/cookie-policy")({
  head: () => policyHead("Cookie Policy", "Read ADZVO’s draft cookie policy and learn about cookies, similar technologies and browser choices."),
  component: CookiePolicy,
});

function CookiePolicy() {
  return <PolicyPage title="Cookie Policy" intro="A clear overview of cookies, similar technologies and the choices available to you." sections={[
    { title: "What cookies are", text: "Cookies are small files a website may place on your device. Similar technologies can include browser storage and tracking pixels. They can support website operation, remember preferences or measure how a website is used." },
    { title: "Essential technologies", text: "Some technologies may be necessary for a website or its hosting platform to operate safely and reliably. The exact technologies used on this website, their providers and their lifetimes must be verified before this policy is finalised." },
    { title: "Preferences, analytics and advertising", text: "Preference cookies remember choices, analytics cookies help measure visits and advertising cookies can support targeted campaigns. Listing these categories does not mean they are currently enabled on this website. Any non-essential technologies should be identified and, where required, used only after consent." },
    { title: "Third-party resources", text: "Resources such as hosted media, fonts or external links may involve third-party services. Their use of cookies or similar technologies is governed by their own policies and should be reviewed as part of the website’s final cookie inventory." },
    { title: "Managing cookies", text: "You can use your browser settings to view, delete or block cookies. Blocking essential cookies may affect how some websites work. Browser controls do not necessarily manage every similar technology; consult your browser’s privacy settings for further options." },
    { title: "Policy updates", text: "This policy should be updated when the website’s technologies change. A final cookie inventory should state each cookie’s name, purpose, provider and duration, along with any applicable consent choices." },
  ]} />;
}