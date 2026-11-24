-- ADZVO D1 Seed Data
-- Run: npx wrangler d1 execute adzvo-db --remote --file=src/db/seed.sql
-- Safe to re-run: uses INSERT OR IGNORE so existing rows are never overwritten.

-- ─── Projects ─────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO projects (id, title, client, location, service, description, image_url, case_study_url, sort_order) VALUES
  ('retail-ai',        'Intelligent Retail Automation Platform', 'OmniRetail India',    'Bengaluru', 'ai-automation',          'An AI-driven operations platform that forecasts demand, automates replenishment and routes customer queries across 300 stores.',              '', '/case-studies/sample-case-study.pdf', 0),
  ('d2c-brand',        'National D2C Brand Identity & Packaging','Verdant Organics',    'Mumbai',    'branding-design',        'A complete identity system and packaging range for a fast-growing organic food brand.',                                                        '', '/case-studies/sample-case-study.pdf', 1),
  ('aero-tvc',         'Cinematic Brand Film & TVC Campaign',    'AeroTech Mobility',   'Mumbai',    'film-video-photography', 'A multi-day cinematic shoot producing a hero brand film, TV commercial cut-downs and a photography library.',                                '', '/case-studies/sample-case-study.pdf', 2),
  ('bharat-local',     'Multilingual E-Commerce Localization',   'Bharatkart',          'Chennai',   'content-localization',   'Transcreated product content, voice-overs and campaigns in nine Indian languages.',                                                           '', '/case-studies/sample-case-study.pdf', 3),
  ('finpulse-growth',  'Pan-India Performance Growth Engine',    'FinPulse Tech',       'Delhi NCR', 'marketing-growth',       'A full-funnel performance programme across search, social and lifecycle channels.',                                                          '', '/case-studies/sample-case-study.pdf', 4),
  ('cloud-ui',         'Enterprise Cloud Product UI System',     'Nimbus Systems',      'Hyderabad', 'digital-technology',     'A design system and responsive web app rebuild for an enterprise cloud console.',                                                           '', '/case-studies/sample-case-study.pdf', 5),
  ('market-entry',     'GCC Market Entry Strategy',              'Spice Route Foods',   'Dubai',     'strategy-analytics',     'Market research, competitor mapping and a data-backed entry roadmap for an Indian food brand expanding into the UAE.',                    '', '/case-studies/sample-case-study.pdf', 6),
  ('explainer-3d',     '3D Product Explainer Series',            'Kinetic Health',      'Pune',      'animation-content',      'A series of 3D animated explainers showing how a medical device works, used across sales, events and social media.',                    '', '/case-studies/sample-case-study.pdf', 7),
  ('riyadh-portal',    'Smart Services Citizen Portal',          'Urban Services Co.',  'Riyadh',    'digital-technology',     'A bilingual citizen services portal with a unified dashboard, online payments and real-time request tracking.',                           '', '/case-studies/sample-case-study.pdf', 8),
  ('doha-film',        'Hospitality Brand Documentary',          'Pearl Bay Resorts',   'Doha',      'film-video-photography', 'A documentary-style brand film and stills capturing guest experiences for a luxury resort group.',                                      '', '/case-studies/sample-case-study.pdf', 9),
  ('london-analytics', 'Customer Insight Dashboard',             'Northgate Retail',    'London',    'strategy-analytics',     'Unified analytics and customer segmentation dashboards that guide merchandising and marketing decisions.',                                '', '/case-studies/sample-case-study.pdf', 10),
  ('chatbot-blr',      'Conversational AI Support Assistant',    'PayNest',             'Bengaluru', 'ai-automation',          'A multilingual AI assistant resolving routine support queries instantly, with smooth handoff to human agents.',                           '', '/case-studies/sample-case-study.pdf', 11);

-- ─── Insights ─────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO insights (id, tag, title, excerpt, body, sort_order) VALUES
  ('ai-saves-time',
   'AI & Automation',
   'Where AI Agents Actually Save Time in a Marketing Team',
   'A practical look at the repetitive tasks worth automating first, and the ones that still need people.',
   'Most teams start with content generation, but the biggest gains often come from reporting, lead routing and briefing. We break down where automation pays back fastest and how to keep quality guardrails in place.',
   0),
  ('brand-scales',
   'Branding',
   'Building a Brand System That Scales Across Markets',
   'How typography, colour and voice rules help a brand stay recognisable from Mumbai to Dubai.',
   'A strong identity is more than a logo. We share how to document a flexible system that local teams can use confidently without diluting the brand.',
   1),
  ('brand-film',
   'Film & Video',
   'Planning a Brand Film That People Watch to the End',
   'Story structure, pacing and production choices that keep audiences engaged.',
   'From the first three seconds to the final frame, we explain the creative and production decisions that turn a brand film into something people share.',
   2),
  ('perf-marketing-2026',
   'Marketing',
   'Performance Marketing in 2026: Signals Over Spend',
   'Why better first-party data now matters more than bigger budgets.',
   'With privacy changes reshaping targeting, the brands winning on Meta and Google are the ones feeding platforms cleaner conversion signals. Here is how to set that up.',
   3),
  ('transcreation',
   'Localization',
   'Transcreation vs Translation: Speaking to Every Culture',
   'Why literal translation falls flat and how to adapt campaigns for Hindi, Tamil and Arabic audiences.',
   'Great localization keeps the intent, emotion and humour of a message. We walk through our transcreation process and common pitfalls.',
   4),
  ('dashboard-leadership',
   'Strategy',
   'Choosing the Dashboards Your Leadership Team Needs',
   'Fewer metrics, clearer decisions: a framework for useful reporting.',
   'GA4 and Looker Studio can show everything, which is exactly the problem. We outline how to pick the handful of measures that drive real decisions.',
   5);

-- ─── Insight images ────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO insight_images (insight_id, image_url, position) VALUES
  ('ai-saves-time',         'https://media.adzvo.com/images/svc-6.jpg', 0),
  ('ai-saves-time',         'https://media.adzvo.com/images/svc-7.jpg', 1),
  ('brand-scales',          'https://media.adzvo.com/images/svc-3.jpg', 0),
  ('brand-scales',          'https://media.adzvo.com/images/svc-4.jpg', 1),
  ('brand-film',            'https://media.adzvo.com/images/svc-3.jpg', 0),
  ('brand-film',            'https://media.adzvo.com/images/svc-5.jpg', 1),
  ('perf-marketing-2026',   'https://media.adzvo.com/images/svc-5.jpg', 0),
  ('perf-marketing-2026',   'https://media.adzvo.com/images/svc-8.jpg', 1),
  ('transcreation',         'https://media.adzvo.com/images/svc-7.jpg', 0),
  ('transcreation',         'https://media.adzvo.com/images/svc-2.jpg', 1),
  ('dashboard-leadership',  'https://media.adzvo.com/images/svc-8.jpg', 0),
  ('dashboard-leadership',  'https://media.adzvo.com/images/svc-1.jpg', 1);
