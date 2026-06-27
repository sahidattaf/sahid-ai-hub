export type IntegrationStatus = "Active" | "Planned";
export type DataPrivacy = "Public" | "Private" | "Hybrid";
export type IntegrationCategory = "AI" | "Data" | "Ops" | "Communication";

export interface Integration {
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  privacy: DataPrivacy;
  purpose: string;
  futureData: string[];
  envVars: string[];
  safetyRule: string;
  sprintTarget: string;
}

export const INTEGRATIONS: Integration[] = [
  {
    name: "GitHub API",
    category: "Data",
    status: "Planned",
    privacy: "Public",
    purpose:
      "Fetch live repository stats — star counts, fork counts, last commit timestamps, and open issue totals — to surface real-time project health on the projects dashboard.",
    futureData: [
      "Repository star count",
      "Fork count",
      "Last commit timestamp",
      "Open issues count",
      "Default branch name",
      "Repository description",
    ],
    envVars: ["GITHUB_TOKEN"],
    safetyRule:
      "Only fetch public repository data. For public repos, the token is optional but recommended to avoid rate limiting. Never expose the token in client-side code.",
    sprintTarget: "Phase 3 — Sprint 5",
  },
  {
    name: "Vercel API",
    category: "Ops",
    status: "Planned",
    privacy: "Private",
    purpose:
      "Pull live deployment status, last deployment timestamp, and preview URLs for each project — showing real deployment health rather than static labels.",
    futureData: [
      "Deployment state (ready / building / error)",
      "Last deployed timestamp",
      "Production URL confirmation",
      "Preview URL list",
      "Build duration",
    ],
    envVars: ["VERCEL_TOKEN", "VERCEL_TEAM_ID"],
    safetyRule:
      "Token must be server-side only. Use Next.js Server Components or Route Handlers — never pass the token to the client bundle. Scope the token to read-only deployment access.",
    sprintTarget: "Phase 3 — Sprint 5",
  },
  {
    name: "Notion API",
    category: "Data",
    status: "Planned",
    privacy: "Private",
    purpose:
      "Surface sanitized command center data — roadmap status updates, project notes, and planning summaries — without exposing internal workspace links or private content.",
    futureData: [
      "Roadmap page status fields",
      "Project page titles",
      "Last edited timestamps",
      "Public-approved summary blocks",
    ],
    envVars: ["NOTION_TOKEN", "NOTION_DATABASE_ID"],
    safetyRule:
      "Only expose pre-approved, explicitly public-safe fields. Never render raw Notion page content, block content, or workspace URLs on the public site. Map data to a safe schema before rendering.",
    sprintTarget: "Phase 3 — Sprint 6",
  },
  {
    name: "Claude API",
    category: "AI",
    status: "Planned",
    privacy: "Private",
    purpose:
      "Power the embedded AI assistant in Phase 4, allowing visitors to query projects, ask about services, and navigate the hub using natural language commands.",
    futureData: [
      "N/A — output integration",
      "Claude generates responses from hub context",
      "No external data pulled",
    ],
    envVars: ["ANTHROPIC_API_KEY"],
    safetyRule:
      "All requests must route through a server-side handler with a constrained system prompt. The system prompt must limit Claude to hub-related context only. No direct user prompt injection into the API call.",
    sprintTarget: "Phase 4 — AI Assistant",
  },
  {
    name: "OpenAI API",
    category: "AI",
    status: "Active",
    privacy: "Private",
    purpose:
      "AI features within live apps — content generation, embedding-based search, text classification, and GPT-powered automation agents. Already in use across deployed projects.",
    futureData: [
      "N/A — output integration",
      "Used within individual app features",
      "Results rendered per app context",
    ],
    envVars: ["OPENAI_API_KEY"],
    safetyRule:
      "API key must never appear in browser-accessible code. Use server-side route handlers exclusively. Apply per-endpoint rate limiting before any feature reaches production traffic.",
    sprintTarget: "Active — live in deployed apps",
  },
  {
    name: "Google Sheets",
    category: "Data",
    status: "Planned",
    privacy: "Private",
    purpose:
      "Lightweight data layer for revenue tracking, client intake, and early-stage CRM — no full database required while volume is low and operations are founder-led.",
    futureData: [
      "Revenue log entries",
      "Client contact form submissions",
      "Workshop registration records",
      "Simple pipeline stage tracking",
    ],
    envVars: [
      "GOOGLE_SERVICE_ACCOUNT_EMAIL",
      "GOOGLE_PRIVATE_KEY",
      "GOOGLE_SHEET_ID",
    ],
    safetyRule:
      "Only read from pre-approved named ranges. Never expose raw sheet data, row indices, or email addresses to the client. Sanitize and map all outputs to a safe schema before rendering.",
    sprintTarget: "Phase 3 — Sprint 5",
  },
  {
    name: "Analytics",
    category: "Ops",
    status: "Planned",
    privacy: "Hybrid",
    purpose:
      "Understand which pages, projects, and sections drive the most engagement — used to inform roadmap prioritization, content decisions, and conversion optimization.",
    futureData: [
      "Page view counts",
      "Unique visitor estimates",
      "Top pages by traffic",
      "Referrer sources",
      "Country / region breakdown",
    ],
    envVars: ["NEXT_PUBLIC_ANALYTICS_ID"],
    safetyRule:
      "Use privacy-first, cookie-free analytics only (Vercel Analytics or Plausible). No personal data collection, no IP logging, and GDPR-compliant by default. No third-party ad tracking.",
    sprintTarget: "Phase 3 — Sprint 5",
  },
  {
    name: "Email / CRM",
    category: "Communication",
    status: "Planned",
    privacy: "Private",
    purpose:
      "Automated confirmation emails for contact form submissions, lead capture responses, and client onboarding sequences — keeping communication fast and consistent at scale.",
    futureData: [
      "N/A — output integration",
      "Sends transactional emails on trigger",
      "Receives webhook delivery events",
    ],
    envVars: ["RESEND_API_KEY", "EMAIL_FROM", "EMAIL_TO"],
    safetyRule:
      "Never log or expose email addresses in client code. Apply rate limiting to all form endpoints before going live. Validate and sanitize all user inputs server-side before passing to the email provider.",
    sprintTarget: "Phase 3 — Sprint 5",
  },
];

export const CATEGORY_ORDER: IntegrationCategory[] = [
  "AI",
  "Data",
  "Ops",
  "Communication",
];

export const CATEGORY_DESCRIPTIONS: Record<IntegrationCategory, string> = {
  AI: "Language model APIs used for generation, reasoning, and assistant features.",
  Data: "External data sources that will feed live project and ops stats into the dashboard.",
  Ops: "Deployment and observability tools that surface infrastructure health in real time.",
  Communication:
    "Outbound channels for automated email, notifications, and client communication.",
};
