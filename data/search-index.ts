export type SearchCategory =
  | "Projects"
  | "Pages"
  | "Modules"
  | "GitHub"
  | "Vercel"
  | "Services"
  | "Roadmap"
  | "AI Agents";

export interface SearchItem {
  id: string;
  title: string;
  category: SearchCategory;
  description: string;
  url: string;
  icon: string;
  keywords: string[];
  recent?: boolean;
  favorite?: boolean;
}

export const SEARCH_INDEX: SearchItem[] = [
  // === PAGES ===
  {
    id: "page-home",
    title: "Dashboard",
    category: "Pages",
    description: "Executive dashboard — projects, KPIs, and live activity",
    url: "/",
    icon: "⚡",
    keywords: ["home", "dashboard", "command", "center", "overview", "executive"],
    favorite: true,
  },
  {
    id: "page-projects",
    title: "Projects",
    category: "Pages",
    description: "Full project registry grouped by zone and status",
    url: "/projects",
    icon: "📁",
    keywords: ["projects", "registry", "apps", "portfolio"],
    favorite: true,
  },
  {
    id: "page-registry",
    title: "Registry",
    category: "Pages",
    description: "Public project registry by zone",
    url: "/registry",
    icon: "📋",
    keywords: ["registry", "projects", "list", "status"],
  },
  {
    id: "page-github",
    title: "GitHub",
    category: "Pages",
    description: "Public repositories for the portfolio projects",
    url: "/github",
    icon: "🐙",
    keywords: ["github", "repos", "code", "repositories", "commits", "ci"],
    favorite: true,
  },
  {
    id: "page-vercel",
    title: "Vercel",
    category: "Pages",
    description: "Live app links for the portfolio projects",
    url: "/live-apps",
    icon: "▲",
    keywords: ["vercel", "deployments", "builds", "hosting", "deploy"],
    favorite: true,
  },
  {
    id: "page-live-apps",
    title: "Live Apps",
    category: "Pages",
    description: "All live deployed applications running in production",
    url: "/live-apps",
    icon: "🚀",
    keywords: ["live", "apps", "deployed", "running", "production"],
  },
  {
    id: "page-revenue",
    title: "Services",
    category: "Pages",
    description: "AI services offered",
    url: "/revenue",
    icon: "💰",
    keywords: ["services", "offers", "consulting"],
    favorite: true,
  },
  {
    id: "page-roadmap",
    title: "Roadmap",
    category: "Pages",
    description: "Build roadmap — phases, milestones, and next actions",
    url: "/roadmap",
    icon: "🗺️",
    keywords: ["roadmap", "phases", "plan", "milestones", "timeline", "sprint"],
    favorite: true,
  },
  {
    id: "page-command",
    title: "Command Center",
    category: "Pages",
    description: "Executive OS — modules, toolchain, and OS overview",
    url: "/command-center",
    icon: "🎯",
    keywords: ["command", "center", "os", "executive", "modules", "toolchain"],
  },
  {
    id: "page-integrations",
    title: "Integrations",
    category: "Pages",
    description: "Platforms used by the hub and their status",
    url: "/integrations",
    icon: "🔌",
    keywords: ["integrations", "platforms", "status"],
  },
  {
    id: "page-about",
    title: "About",
    category: "Pages",
    description: "About Sahid Attaf and the Sahid AI Hub mission",
    url: "/about",
    icon: "👤",
    keywords: ["about", "sahid", "bio", "mission", "profile"],
  },

  // === PROJECTS ===
  {
    id: "proj-jobhunter",
    title: "JobHunterGPT",
    category: "Projects",
    description: "AI-powered job search assistant — matching, tracking, career intelligence",
    url: "/projects/jobhunter-gpt",
    icon: "💼",
    keywords: ["job", "career", "gpt", "resume", "search", "automation", "hunting"],
    favorite: true,
  },
  {
    id: "proj-bossa-brand",
    title: "BOSSA Asado i Mar",
    category: "Projects",
    description: "Premium hospitality brand site with reservation flows and AI guest experience",
    url: "/projects/bossa-asado-i-mar",
    icon: "🍽️",
    keywords: ["bossa", "restaurant", "hospitality", "brand", "reservations", "asado"],
  },
  {
    id: "proj-bossa-os",
    title: "BOSSA AI OS",
    category: "Projects",
    description: "AI operating system for hospitality management, menu intelligence, and automation",
    url: "/projects/bossa-ai-os",
    icon: "🏨",
    keywords: ["bossa", "ai", "os", "hospitality", "menu", "management", "automation"],
  },
  {
    id: "proj-gpt-os",
    title: "GPT Innovation OS",
    category: "Projects",
    description: "Turborepo monorepo powering a multi-app AI ecosystem",
    url: "/projects/gpt-innovation-os",
    icon: "⚙️",
    keywords: ["gpt", "innovation", "monorepo", "turborepo", "platform", "ecosystem"],
  },
  {
    id: "proj-ai-marketing",
    title: "AI Marketing Tools",
    category: "Projects",
    description: "AI-powered content generation, campaign orchestration, and analytics",
    url: "/projects/ai-marketing-tools",
    icon: "📣",
    keywords: ["marketing", "ai", "content", "campaigns", "analytics", "tools"],
  },
  {
    id: "proj-dreamscape",
    title: "Dreamscape",
    category: "Projects",
    description: "AI creative studio for generative narratives and interactive fiction",
    url: "/projects/dreamscape",
    icon: "✨",
    keywords: ["dreamscape", "creative", "ai", "narrative", "fiction", "storytelling", "generative"],
  },
  {
    id: "proj-digital-korsou",
    title: "Digital Kòrsou",
    category: "Projects",
    description: "AI education and workforce/community pilot program.",
    url: "/projects/digital-korsou",
    icon: "🌴",
    keywords: ["digital", "korsou", "boske", "education", "ai"],
  },
  {
    id: "proj-sahid-ai-hub",
    title: "Sahid AI Hub",
    category: "Projects",
    description: "Multi-page AI OS command center — registry, dashboards, and intelligence",
    url: "/projects/sahid-ai-hub",
    icon: "🌐",
    keywords: ["sahid", "ai", "hub", "infrastructure", "command", "center", "os"],
  },

  // === MODULES ===
  {
    id: "mod-analytics",
    title: "Analytics",
    category: "Modules",
    description: "Cross-platform traffic and deployment frequency",
    url: "/integrations",
    icon: "📈",
    keywords: ["analytics", "traffic", "metrics", "data"],
  },
  {
    id: "mod-hospitality",
    title: "Hospitality Module",
    category: "Modules",
    description: "AI-powered multi-property hospitality management and scheduling",
    url: "/projects",
    icon: "🏨",
    keywords: ["hospitality", "hotel", "restaurant", "management", "staff"],
  },
  {
    id: "mod-knowledge",
    title: "Knowledge Base",
    category: "Modules",
    description: "Searchable reference material and brand guides",
    url: "/command-center",
    icon: "🧠",
    keywords: ["knowledge", "reference", "search", "graph"],
  },
  {
    id: "mod-automation",
    title: "Automation",
    category: "Modules",
    description: "Trigger-based workflow automation linking AI agents and business processes",
    url: "/command-center",
    icon: "⚡",
    keywords: ["automation", "workflows", "triggers", "agents", "events"],
  },
  {
    id: "mod-claude-design",
    title: "Claude Design",
    category: "Modules",
    description: "AI-assisted design and creative direction powered by Claude",
    url: "/integrations",
    icon: "🎨",
    keywords: ["claude", "design", "ai", "creative", "anthropic", "visual"],
  },
  {
    id: "mod-supabase",
    title: "Supabase",
    category: "Modules",
    description: "Database health, query performance, and storage across all projects",
    url: "/command-center",
    icon: "🗄️",
    keywords: ["supabase", "database", "sql", "storage", "backend", "postgres"],
  },

  // === AI AGENTS ===
  {
    id: "agent-registry",
    title: "AI Agents Registry",
    category: "AI Agents",
    description: "Registry and monitoring panel for all deployed AI agents",
    url: "/command-center",
    icon: "🤖",
    keywords: ["ai", "agents", "bots", "automation", "registry", "monitor", "llm"],
  },
  {
    id: "agent-jobhunter",
    title: "JobHunter Agent",
    category: "AI Agents",
    description: "AI agent powering job search automation and career matching",
    url: "/projects/jobhunter-gpt",
    icon: "🤖",
    keywords: ["agent", "jobhunter", "career", "automation", "gpt", "matching"],
  },
  {
    id: "agent-marketing",
    title: "Marketing Agent",
    category: "AI Agents",
    description: "AI agent for content generation and campaign orchestration",
    url: "/projects/ai-marketing-tools",
    icon: "🤖",
    keywords: ["agent", "marketing", "content", "campaigns", "automation", "ai"],
  },

  // === GITHUB ===
  {
    id: "github-dashboard",
    title: "GitHub Dashboard",
    category: "GitHub",
    description: "Public repositories for the portfolio projects",
    url: "/github",
    icon: "🐙",
    keywords: ["github", "repos", "code", "ci", "commits", "languages", "pull requests"],
  },

  // === VERCEL ===
  {
    id: "vercel-dashboard",
    title: "Vercel Dashboard",
    category: "Vercel",
    description: "Live app links for the portfolio projects",
    url: "/live-apps",
    icon: "▲",
    keywords: ["vercel", "deploy", "build", "hosting", "edge", "serverless"],
  },

  // === REVENUE ===
  {
    id: "rev-streams",
    title: "Services",
    category: "Services",
    description: "AI services offered",
    url: "/revenue",
    icon: "💰",
    keywords: ["services", "offers", "ai"],
  },
  {
    id: "rev-consulting",
    title: "AI Consulting",
    category: "Services",
    description: "AI consulting and build services",
    url: "/revenue",
    icon: "💼",
    keywords: ["consulting", "services", "build"],
  },

  // === ROADMAP ===
  {
    id: "road-phases",
    title: "Build Roadmap",
    category: "Roadmap",
    description: "5-phase build plan from foundation to AI monetization",
    url: "/roadmap",
    icon: "🗺️",
    keywords: ["roadmap", "phases", "milestones", "plan", "timeline", "build"],
  },
  {
    id: "road-current",
    title: "Current Sprint",
    category: "Roadmap",
    description: "Active sprint goals and in-progress deliverables",
    url: "/roadmap",
    icon: "🏃",
    keywords: ["sprint", "current", "active", "now", "today", "progress"],
  },
  {
    id: "road-documentation",
    title: "Documentation",
    category: "Roadmap",
    description: "Technical docs, SOPs, and architecture references",
    url: "/roadmap",
    icon: "📚",
    keywords: ["documentation", "docs", "technical", "sop", "architecture", "reference"],
  },
];

export const CATEGORY_ICONS: Record<string, string> = {
  Projects: "📁",
  Pages: "🗂️",
  Modules: "🧩",
  GitHub: "🐙",
  Vercel: "▲",
  Services: "💰",
  Roadmap: "🗺️",
  "AI Agents": "🤖",
};

export const CATEGORY_ORDER: string[] = [
  "Pages",
  "Projects",
  "AI Agents",
  "Modules",
  "GitHub",
  "Vercel",
  "Services",
  "Roadmap",
];

export const DEFAULT_ITEMS: SearchItem[] = SEARCH_INDEX.filter(
  (item) => item.favorite,
);
