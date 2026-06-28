export type ModuleStatus = "Active" | "Planned" | "Future";
export type ModuleCategory =
  | "Command"
  | "Operations"
  | "Finance"
  | "Knowledge"
  | "Infrastructure";

export interface ExecutiveModule {
  id: string;
  name: string;
  description: string;
  status: ModuleStatus;
  category: ModuleCategory;
  publicSafe: boolean;
  nextAction: string;
  href?: string;
}

export const EXECUTIVE_MODULES: ExecutiveModule[] = [
  {
    id: "executive-dashboard",
    name: "Executive Dashboard",
    description:
      "High-level view of all projects, KPIs, AI agents, and live activity across the operating system.",
    status: "Active",
    category: "Command",
    publicSafe: true,
    nextAction: "Connect live health scores and deployment events",
    href: "/",
  },
  {
    id: "projects",
    name: "Projects",
    description:
      "Full project registry grouped by zone — status, visibility, tech stack, and next action per entry.",
    status: "Active",
    category: "Command",
    publicSafe: true,
    nextAction: "Add project detail pages with module breakdown",
    href: "/projects",
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    description:
      "Registry and monitoring panel for all AI agents deployed across the Sahid AI Hub ecosystem.",
    status: "Planned",
    category: "Command",
    publicSafe: true,
    nextAction: "Define agent manifest schema and build registry page",
  },
  {
    id: "crm",
    name: "CRM",
    description:
      "Customer and prospect relationship management linked to live projects and revenue streams.",
    status: "Planned",
    category: "Operations",
    publicSafe: false,
    nextAction: "Design contact and deal schema in Supabase",
  },
  {
    id: "hospitality",
    name: "Hospitality",
    description:
      "Multi-property hospitality OS — AI-powered staff scheduling, menu intelligence, and guest experience.",
    status: "Planned",
    category: "Operations",
    publicSafe: true,
    nextAction: "Port BOSSA AI OS core to shared hospitality module",
  },
  {
    id: "restaurants",
    name: "Restaurants",
    description:
      "Restaurant brand management: BOSSA Asado i Mar reservation flows, AI menus, and brand assets.",
    status: "Active",
    category: "Operations",
    publicSafe: true,
    nextAction: "Integrate online reservation API",
    href: "/projects",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description:
      "Curacao property intelligence and Kai Kòrsou marketplace — listings, market data, local economy dashboards.",
    status: "Planned",
    category: "Operations",
    publicSafe: true,
    nextAction: "Build listing integration for Kai Kòrsou Command Center",
  },
  {
    id: "investors",
    name: "Investors",
    description:
      "Investor relations dashboard — portfolio performance, revenue projections, and pitch materials.",
    status: "Planned",
    category: "Finance",
    publicSafe: false,
    nextAction: "Define investor-safe KPI set and build deck view",
  },
  {
    id: "documents",
    name: "Documents",
    description:
      "Contracts, SOPs, brand guidelines, and structured reference documents across all business units.",
    status: "Future",
    category: "Knowledge",
    publicSafe: false,
    nextAction: "Integrate Supabase Storage for document management",
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    description:
      "Searchable knowledge graph — project notes, decisions, technical references, and brand guides.",
    status: "Future",
    category: "Knowledge",
    publicSafe: true,
    nextAction: "Design knowledge schema with AI-powered semantic search",
  },
  {
    id: "analytics",
    name: "Analytics",
    description:
      "Cross-platform analytics aggregating traffic, deployment frequency, revenue trends, and agent activity.",
    status: "Planned",
    category: "Command",
    publicSafe: true,
    nextAction: "Connect Vercel Analytics and GitHub event streams",
    href: "/vercel",
  },
  {
    id: "automation",
    name: "Automation",
    description:
      "Trigger-based workflow automation linking AI agents, deployments, GitHub events, and business processes.",
    status: "Planned",
    category: "Operations",
    publicSafe: true,
    nextAction: "Design automation manifest and event bus architecture",
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "Live GitHub dashboard — repository health, commit activity, language breakdown, and CI status.",
    status: "Active",
    category: "Infrastructure",
    publicSafe: true,
    nextAction: "Add PR and issue tracking to the dashboard",
    href: "/github",
  },
  {
    id: "vercel",
    name: "Vercel",
    description:
      "Live Vercel deployment dashboard — project status, deployment history, and build health per project.",
    status: "Active",
    category: "Infrastructure",
    publicSafe: true,
    nextAction: "Add per-project deployment health alerts",
    href: "/vercel",
  },
  {
    id: "supabase",
    name: "Supabase",
    description:
      "Database health, query performance, and storage utilization across all Supabase-backed projects.",
    status: "Planned",
    category: "Infrastructure",
    publicSafe: true,
    nextAction: "Connect Supabase Management API for health metrics",
  },
  {
    id: "settings",
    name: "Settings",
    description:
      "OS configuration, environment variable status, integrations management, and access control.",
    status: "Future",
    category: "Infrastructure",
    publicSafe: true,
    nextAction: "Build env-var status page and integration config panel",
  },
];

export const CATEGORY_ORDER: ModuleCategory[] = [
  "Command",
  "Operations",
  "Finance",
  "Knowledge",
  "Infrastructure",
];

export function getModulesByStatus(status: ModuleStatus): ExecutiveModule[] {
  return EXECUTIVE_MODULES.filter((m) => m.status === status);
}

export function getModulesByCategory(
  category: ModuleCategory
): ExecutiveModule[] {
  return EXECUTIVE_MODULES.filter((m) => m.category === category);
}
