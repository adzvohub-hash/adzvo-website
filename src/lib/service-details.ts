/**
 * Longer service-page copy (about, how we work, who it's for, questions), shown by
 * <ServiceDetails /> below the capability cards on each /services/<slug> page.
 * Edit the words here; the layout lives in src/components/service-details.tsx.
 */
export type ServiceDetail = {
  about: { heading: string; paragraphs: string[] };
  steps: { heading: string; items: { title: string; text: string }[] };
  audience: { heading: string; items: { who: string; detail: string }[] };
  faqs: { heading: string; items: { q: string; a: string }[] };
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "branding-design": {
    about: {
      heading: "A branding agency in Bangalore that builds brands people remember",
      paragraphs: [
        "A brand is the feeling people carry away after every interaction with your business. ADZVO is a branding and design agency in Bangalore that shapes that feeling on purpose, from the first strategy conversation to the last pixel on your packaging.",
        "We start with positioning: who you serve, what makes you different and how you want to be seen. From there we design the visible brand, including your logo, colour palette, typography, imagery style and tone of voice, and pull it all together in brand guidelines your team can actually use.",
        "Then we put the brand to work. That means ad creatives for Meta and Google campaigns, social media templates, brochures, packaging that stands out on the shelf and presentation decks that win the room. Every piece follows the same visual language, so your brand looks and sounds like itself everywhere.",
        "We work with startups launching their first identity, growing businesses that have outgrown their old look, and established brands entering new markets across India and the GCC. The goal is always the same: a brand that is clear, consistent and easy to recognise.",
      ],
    },
    steps: {
      heading: "How we build your brand",
      items: [
        { title: "Discover", text: "We learn your business, audience and competitors through a workshop and a short questionnaire, and review what you already have." },
        { title: "Define", text: "We agree your positioning, brand personality and key messages, so every design choice has a reason behind it." },
        { title: "Design", text: "We present logo and identity directions, refine the chosen one with your feedback, and build the full visual system around it." },
        { title: "Deliver and roll out", text: "You receive brand guidelines and ready-to-use files for print and digital, and we can design your first campaigns, packaging and templates with the new identity." },
      ],
    },
    audience: {
      heading: "Who we design brands for",
      items: [
        { who: "Startups", detail: "that need a professional identity before launch or a funding round" },
        { who: "D2C and retail brands", detail: "that need packaging and ad creatives that sell" },
        { who: "Growing businesses", detail: "whose look no longer matches the company they've become" },
        { who: "Service businesses", detail: "such as clinics, schools, consultancies and real estate firms that compete on trust and first impressions" },
        { who: "Companies in India and the GCC", detail: "that need one brand that works across markets and languages" },
      ],
    },
    faqs: {
      heading: "Branding questions, answered",
      items: [
        { q: "How long does a brand identity take?", a: "A logo and core identity usually takes a few weeks, depending on how many feedback rounds you need. A full brand with guidelines, packaging and launch creatives takes longer. We agree a clear timeline in your proposal before we start." },
        { q: "What's included in a branding project?", a: "It depends on your needs. Most projects include brand strategy, a logo with variations, a colour palette, typography and brand guidelines. Packaging, ad creatives, social media templates and presentations can be added." },
        { q: "Can you refresh our existing brand instead of starting over?", a: "Yes. If people already recognise your brand, we often modernise it rather than replace it, keeping what works and fixing what holds you back." },
        { q: "Do I get the final logo and design files?", a: "Yes. When the project is complete, you receive the final approved logo and brand files in formats for print and digital use. Usage terms are set out in your proposal." },
        { q: "Do you work with businesses outside Bangalore?", a: "Yes. We're based in Bangalore and work with brands across India and the GCC. Workshops and reviews run on video calls, so location is never a barrier." },
      ],
    },
  },
  "digital-technology": {
    about: {
      heading: "A web and app development company in Bangalore that builds for growth",
      paragraphs: [
        "Your website or app is often the first place people meet your business, and the place they decide whether to trust you. ADZVO designs and develops websites, mobile apps and digital platforms in Bangalore that look sharp, load fast and are easy to use.",
        "Every project starts with what the product needs to achieve: more enquiries, more sales, smoother operations or a better customer experience. We plan the user journeys first, design the interface around them, then build with modern, reliable technology that is easy to update and ready to grow.",
        "Our work covers business websites, landing pages, e-commerce stores, customer portals, booking systems and mobile and web apps. Each one is responsive across phones, tablets and desktops, set up with analytics from day one, and built with search engines in mind so people can find you.",
        "After launch we don't disappear. We improve speed, fix issues, add features and help your platform keep up with your business, for brands across India and the GCC.",
      ],
    },
    steps: {
      heading: "How we build your website or app",
      items: [
        { title: "Plan", text: "We define goals, users, features and content, and agree a clear scope, timeline and budget." },
        { title: "Design", text: "We map the user journeys and design the screens, so you see and approve exactly how it will look and work before we build." },
        { title: "Build and test", text: "We develop it in stages you can review, then test it on real devices and browsers for speed, security and usability." },
        { title: "Launch and improve", text: "We launch, connect analytics, train your team, and keep improving it with support and updates." },
      ],
    },
    audience: {
      heading: "Who we build for",
      items: [
        { who: "Businesses", detail: "that need a website that turns visitors into enquiries" },
        { who: "Retail and D2C brands", detail: "ready to sell online with a smooth store and checkout" },
        { who: "Startups", detail: "building a first product, app or MVP" },
        { who: "Companies", detail: "that want customer portals, booking systems or internal tools" },
        { who: "Teams", detail: "whose current site is slow, outdated or hard to update" },
      ],
    },
    faqs: {
      heading: "Website and app questions, answered",
      items: [
        { q: "How long does it take to build a website?", a: "A focused business website usually takes a few weeks. Larger sites, e-commerce stores and apps take longer, depending on features and content. You get a clear timeline in your proposal." },
        { q: "Will my website work well on mobile?", a: "Yes. Every site we build is responsive and tested on phones, tablets and desktops, because most visitors now arrive on mobile." },
        { q: "Can I update the content myself?", a: "Yes. Where it makes sense, we set up an easy admin area so your team can change text, images, products and articles without a developer." },
        { q: "Do you help with SEO and speed?", a: "Yes. We build with clean structure, fast loading, page titles and descriptions and analytics from the start. For ongoing growth, our marketing team can take over SEO." },
        { q: "Do you offer support after launch?", a: "Yes. We offer ongoing support for fixes, updates, security and new features, so your website or app keeps working as your business grows." },
      ],
    },
  },
  "marketing-growth": {
    about: {
      heading: "A digital marketing agency in Bangalore focused on leads and growth",
      paragraphs: [
        "Good marketing isn't about being everywhere. It's about reaching the right people, with the right message, on the channels where they already spend time. ADZVO is a digital marketing agency in Bangalore that plans and runs campaigns built around clear business goals: more enquiries, more sales and a stronger brand.",
        "We bring together social media marketing, SEO and YouTube SEO, Google Ads and Meta Ads, email marketing and lead generation. Instead of treating each channel separately, we connect them, so your ads, content, search presence and follow-up emails all move people one step closer to choosing you.",
        "Every campaign is measured. We set up tracking before we spend, report on the numbers that matter, such as leads, cost per lead and sales, and use conversion rate optimisation to make your website and landing pages turn more visits into action.",
        "We work with startups, growing businesses and established brands across India and the GCC, from local Bangalore businesses to companies running campaigns in several languages.",
      ],
    },
    steps: {
      heading: "How we grow your business",
      items: [
        { title: "Audit", text: "We review your current marketing, website, competitors and data to find what's working and what's wasting budget." },
        { title: "Plan", text: "We set goals and targets, choose the right channels and budget split, and agree the content and campaign calendar." },
        { title: "Launch", text: "We create the ads, content and landing pages, set up tracking, and launch the campaigns." },
        { title: "Measure and improve", text: "We report regularly, test new ideas and move budget to what performs best." },
      ],
    },
    audience: {
      heading: "Who we market for",
      items: [
        { who: "Businesses", detail: "that need a steady flow of qualified leads" },
        { who: "E-commerce and D2C brands", detail: "focused on sales and return on ad spend" },
        { who: "Startups", detail: "building awareness and their first customer base" },
        { who: "Real estate, education and healthcare brands", detail: "where every enquiry counts" },
        { who: "Brands", detail: "expanding into new cities or GCC markets" },
      ],
    },
    faqs: {
      heading: "Digital marketing questions, answered",
      items: [
        { q: "How soon will I see results?", a: "Paid ads such as Google and Meta can bring enquiries within days of launch. SEO and content build more slowly, usually over a few months, but keep delivering without paying for every click." },
        { q: "How much should I spend on ads?", a: "It depends on your goals, market and competition. We recommend a starting budget in your proposal, test what works, then scale the campaigns that bring the best return." },
        { q: "Do you manage both Google Ads and Meta Ads?", a: "Yes. We plan, create and manage campaigns on Google, YouTube, Facebook and Instagram, and connect them with your website tracking so you can see which ads bring results." },
        { q: "Will I get reports?", a: "Yes. You get regular reports in plain language showing spend, leads, cost per lead and what we're changing next, plus a live dashboard where it helps." },
        { q: "Can you also manage our social media?", a: "Yes. We plan, design and publish social media content, manage your pages, and combine organic posts with paid campaigns for wider reach." },
      ],
    },
  },
  "film-video-photography": {
    about: {
      heading: "A video production company in Bangalore for films that move people",
      paragraphs: [
        "Video is the fastest way to make people feel something about your brand. Through our production arm, LCA Film Studio, ADZVO produces ad films, corporate films, commercials, podcasts and brand photography in Bangalore, from the first idea to the final cut.",
        "We handle the whole process in-house: concept, script, storyboard, casting, locations, shooting, editing, colour grading, sound design and music. That means one team is responsible for the story and the quality from start to finish, and you have one point of contact.",
        "Every piece is made for where it will be seen. A TV commercial, a YouTube pre-roll, an Instagram reel and a corporate film for investors all need different lengths, formats and pacing. We plan the edits and cut-downs from day one, so one shoot gives you content for many channels.",
        "Our photography covers products, people, food, spaces and campaigns, in a consistent style that matches your brand. We work with brands across India and the GCC, in the studio and on location.",
      ],
    },
    steps: {
      heading: "How we produce your film",
      items: [
        { title: "Concept and script", text: "We understand your goal and audience, then develop the idea, script and storyboard for your approval." },
        { title: "Pre-production", text: "We plan the shoot: cast, crew, locations, schedule, props and every shot on the list." },
        { title: "Production", text: "We shoot with professional cameras, lighting and sound, with a director making sure every scene serves the story." },
        { title: "Post-production and delivery", text: "We edit, grade, add sound and music, and deliver the final film and cut-downs in every format you need." },
      ],
    },
    audience: {
      heading: "Who we make films for",
      items: [
        { who: "Brands", detail: "launching a product or campaign that needs an ad film or commercial" },
        { who: "Companies", detail: "that want a corporate film for clients, investors or recruitment" },
        { who: "E-commerce and D2C brands", detail: "that need product photography and short videos" },
        { who: "Founders and experts", detail: "starting a video podcast" },
        { who: "Restaurants, hotels and real estate", detail: "that sell an experience people need to see" },
      ],
    },
    faqs: {
      heading: "Video production questions, answered",
      items: [
        { q: "How long does it take to make an ad film?", a: "A typical ad film takes a few weeks from concept to final delivery, depending on script approval, casting and locations. Simpler videos and photo shoots can be faster. You get a production schedule before we start." },
        { q: "What does video production cost?", a: "It depends on the length, number of shoot days, locations, cast and crew. We share a clear quote after understanding your brief, and can suggest options to fit your budget." },
        { q: "Do you write the script and concept?", a: "Yes. Our team develops the concept, script and storyboard, or works from your own idea if you already have one." },
        { q: "Can one shoot give us content for social media too?", a: "Yes. We plan cut-downs and vertical formats in advance, so one shoot delivers a main film plus reels, shorts and stills for social media." },
        { q: "Do you shoot outside Bangalore?", a: "Yes. We're based in Bangalore and shoot on location across India and the GCC, as well as in the studio." },
      ],
    },
  },
  "animation-content": {
    about: {
      heading: "An animation studio in Bangalore for stories that are easy to understand",
      paragraphs: [
        "Some ideas are hard to film and harder to explain. Animation makes them simple, memorable and fun to watch. ADZVO creates 2D and 3D animation, motion graphics, explainer videos and short-form content in Bangalore for brands that want to explain more and say it better.",
        "We use animation where it works best: product explainers that show how something works, app walkthroughs, training and e-learning content, data stories, logo animations, social media reels and music videos. Each project starts with a clear script, so the message is right before a single frame is drawn.",
        "Our team combines illustration, motion design and AI-enabled workflows. AI helps us explore ideas and produce variations faster, while our designers and animators make sure everything stays on-brand and polished. The result is content made faster without looking generic.",
        "We deliver in every format you need, from widescreen films for your website and YouTube to vertical reels for Instagram, for brands across India and the GCC.",
      ],
    },
    steps: {
      heading: "How we create your animation",
      items: [
        { title: "Script", text: "We turn your message into a short, clear script and agree it with you first." },
        { title: "Storyboard and style", text: "We sketch the key scenes and design the look, characters and colours so you can see the direction early." },
        { title: "Animate", text: "We animate the scenes, add voice-over, music and sound effects, and share drafts for your feedback." },
        { title: "Deliver", text: "We export the final video in every size and format you need, with subtitles if required." },
      ],
    },
    audience: {
      heading: "Who we animate for",
      items: [
        { who: "Tech and SaaS companies", detail: "that need to explain a product in under two minutes" },
        { who: "Education and training teams", detail: "creating e-learning content" },
        { who: "Brands", detail: "that want scroll-stopping reels and motion graphics" },
        { who: "Healthcare and finance companies", detail: "that need complex ideas made simple" },
        { who: "Artists and labels", detail: "making music videos" },
      ],
    },
    faqs: {
      heading: "Animation questions, answered",
      items: [
        { q: "How long does an explainer video take?", a: "A short explainer usually takes a few weeks from script to final delivery, depending on the style, length and feedback rounds. We share a schedule before starting." },
        { q: "Should I choose 2D or 3D animation?", a: "2D suits explainers, social content and illustrated styles, and is usually quicker. 3D suits products, architecture and realistic scenes. We'll recommend what fits your message and budget." },
        { q: "How long should an explainer video be?", a: "Most explainers work best between 60 and 90 seconds. Short-form social videos are usually 15 to 30 seconds." },
        { q: "Do you use AI in your animation?", a: "Yes, as a tool. AI helps us explore ideas and speed up parts of production, while our designers and animators control the quality and keep everything on-brand." },
        { q: "Can you add voice-over and subtitles in other languages?", a: "Yes. We arrange professional voice-overs and subtitles in English, Hindi, regional Indian languages and Arabic, with help from our content and localization team." },
      ],
    },
  },
  "ai-automation": {
    about: {
      heading: "An AI automation agency in Bangalore that makes AI practical",
      paragraphs: [
        "Most businesses know AI could help, but not where to start or what is worth the effort. ADZVO is an AI consulting and automation agency in Bangalore that turns AI into practical, measurable improvements, without the hype.",
        "We start by finding the right opportunities: the repetitive tasks, slow processes and content bottlenecks where AI can save time or money. Then we build a clear roadmap, starting with quick wins that prove value before you invest in anything bigger.",
        "Our work covers AI-generated content and visuals, creative workflows that speed up production, chatbots that answer customer questions and capture leads, and business automation that connects your tools, such as forms, CRM, email, spreadsheets and reports, so information moves without manual copying.",
        "Every solution is designed with people in the loop, so your team stays in control of quality and decisions. We work with startups, agencies and growing businesses across India and the GCC.",
      ],
    },
    steps: {
      heading: "How we bring AI into your business",
      items: [
        { title: "Discover", text: "We map your processes and find the tasks where AI or automation would save the most time." },
        { title: "Prioritise", text: "We recommend a short list of use cases with expected benefits, and agree where to start." },
        { title: "Build and test", text: "We set up the tools, workflows or chatbots, and test them with real data and your team." },
        { title: "Train and scale", text: "We train your team, measure the results and expand what works." },
      ],
    },
    audience: {
      heading: "Who we help with AI",
      items: [
        { who: "Businesses", detail: "spending hours on repetitive admin, data entry or reporting" },
        { who: "Marketing and content teams", detail: "that need more content without more headcount" },
        { who: "Customer service teams", detail: "that want a chatbot to answer common questions around the clock" },
        { who: "Sales teams", detail: "that want leads captured and followed up automatically" },
        { who: "Leaders", detail: "who want a clear, realistic AI plan for their company" },
      ],
    },
    faqs: {
      heading: "AI and automation questions, answered",
      items: [
        { q: "Where should a business start with AI?", a: "Start with a repetitive, time-consuming task that follows clear rules, such as reporting, lead follow-up or content drafts. A small, successful project builds confidence for bigger ones." },
        { q: "Will AI replace my team?", a: "No. We design AI to take over repetitive work so your team can focus on decisions, creativity and customers. People stay in control of quality." },
        { q: "Is our data safe?", a: "We choose tools and set-ups that suit your data and agree how it is handled before we start, keeping sensitive information out of public AI tools." },
        { q: "Can you build a chatbot for our website or WhatsApp?", a: "Yes. We build chatbots that answer common questions, qualify enquiries and pass leads to your team, on your website and messaging channels." },
        { q: "How long does an automation project take?", a: "Simple automations can be ready in days. Larger workflows that connect several systems take a few weeks. We agree the scope and timeline first." },
      ],
    },
  },
  "content-localization": {
    about: {
      heading: "A content writing and localization agency in Bangalore for every audience",
      paragraphs: [
        "Words decide whether people understand you, trust you and act. ADZVO writes and adapts content in Bangalore for brands that want to speak clearly to every audience, in every language they serve.",
        "Our writers create website copy, product descriptions, blogs, e-books, brochures, scripts and storybooks, all in your brand's voice. Search-friendly blogs and articles help you get found on Google, while longer content such as e-books and guides builds authority and generates leads.",
        "Localization goes beyond translation. We adapt your message for culture, context and tone, so it feels natural to readers in Hindi, Kannada, Tamil, Telugu, Malayalam, Arabic and other languages. That covers websites, campaigns, packaging, subtitles and video voice-overs.",
        "Whether you're reaching customers across India's regions or expanding into the GCC, we help your brand sound consistent and local at the same time.",
      ],
    },
    steps: {
      heading: "How we create and localize your content",
      items: [
        { title: "Brief", text: "We understand your audience, goals, tone of voice and the languages and markets you're targeting." },
        { title: "Write", text: "Our writers create the content, researched and optimised for search where it needs to be found." },
        { title: "Localize", text: "Native-language specialists adapt it for each market, checking meaning, tone and cultural fit." },
        { title: "Review and deliver", text: "We proofread, apply your feedback and deliver ready-to-publish files, subtitles or scripts." },
      ],
    },
    audience: {
      heading: "Who we write for",
      items: [
        { who: "Brands", detail: "that need website copy and blogs that rank and convert" },
        { who: "Companies", detail: "expanding into new Indian regions or GCC markets" },
        { who: "Video and film teams", detail: "that need subtitles and translated scripts" },
        { who: "Publishers and educators", detail: "creating e-books and storybooks" },
        { who: "Businesses", detail: "with inconsistent messaging across channels" },
      ],
    },
    faqs: {
      heading: "Content and localization questions, answered",
      items: [
        { q: "What's the difference between translation and localization?", a: "Translation changes the words into another language. Localization also adapts tone, examples, idioms and cultural references, so the content feels written for that audience." },
        { q: "Which languages do you work in?", a: "We work in English, Hindi, Kannada, Tamil, Telugu, Malayalam, Arabic and other languages on request, using native-language writers and reviewers." },
        { q: "Do you write SEO blogs?", a: "Yes. We research the topics your customers search for and write helpful, well-structured articles that are optimised for Google." },
        { q: "Can you write in our brand's tone of voice?", a: "Yes. We study your existing content and brand guidelines, or help create a tone-of-voice guide, so everything sounds like you." },
        { q: "Do you provide subtitles for videos?", a: "Yes. We create accurate, well-timed subtitles in multiple languages for films, reels, training videos and podcasts." },
      ],
    },
  },
  "strategy-analytics": {
    about: {
      heading: "A marketing strategy and analytics agency in Bangalore for clearer decisions",
      paragraphs: [
        "Most businesses have plenty of data and very little clarity. ADZVO helps you turn marketing data into decisions, so you know what is working, what is wasting money and where to invest next.",
        "We start with strategy: your goals, audiences, channels and budget, brought together in one practical digital marketing roadmap. Then we make sure you can measure it, with Google Analytics 4 (GA4) and Google Tag Manager set up correctly to track enquiries, calls, WhatsApp clicks, sign-ups and sales.",
        "From there we build clear dashboards and reports that show the few numbers that matter, not hundreds of charts. Each report comes with plain-language findings and recommended next steps, so the data actually changes what you do.",
        "We also shape content strategy: what to publish, where, and for whom, based on real search and audience data. We work with businesses across India and the GCC, from first-time GA4 set-ups to ongoing analytics support.",
      ],
    },
    steps: {
      heading: "How we bring clarity to your marketing",
      items: [
        { title: "Audit", text: "We review your goals, current marketing, tracking and data, and find the gaps." },
        { title: "Plan", text: "We build a strategy and a measurement plan: what to track, why, and what success looks like." },
        { title: "Set up", text: "We configure GA4, Google Tag Manager, conversions and dashboards, and test that the data is accurate." },
        { title: "Report and advise", text: "We deliver regular reports with insights and recommendations, and refine the strategy as results come in." },
      ],
    },
    audience: {
      heading: "Who we help",
      items: [
        { who: "Businesses", detail: "that run marketing but can't tell what's working" },
        { who: "Teams", detail: "whose GA4 or tracking was never set up properly" },
        { who: "Founders and managers", detail: "who want one clear dashboard instead of many tools" },
        { who: "Brands", detail: "planning a launch, rebrand or move into a new market" },
        { who: "Marketing teams", detail: "that need a content strategy based on real data" },
      ],
    },
    faqs: {
      heading: "Strategy and analytics questions, answered",
      items: [
        { q: "Why is GA4 important?", a: "GA4 is Google's current analytics platform. Set up correctly, it shows where visitors come from, what they do and which channels bring enquiries and sales." },
        { q: "What is Google Tag Manager used for?", a: "Tag Manager lets you add and manage tracking, such as form submissions, button clicks and ad conversions, without changing your website code each time." },
        { q: "Can you fix our existing tracking?", a: "Yes. We audit your current GA4 and tags, fix what's broken or missing, and document the set-up so it stays reliable." },
        { q: "What will be in our reports?", a: "The numbers tied to your goals, such as leads, sales, cost per lead and top channels, with plain-language findings and recommended next steps." },
        { q: "Do you only do analytics, or also strategy?", a: "Both. We create marketing and content strategies, then measure them, so planning and results stay connected." },
      ],
    },
  },
};
