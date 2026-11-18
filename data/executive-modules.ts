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
    href: "/",
  },
  {
    id: "projects",
    name: "Projects",
    description:
      "Full project registry grouped by zone — status, tech stack, and links per entry.",
    status: "Active",
    category: "Command",
    href: "/projects",
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    description:
      "Registry and monitoring panel for all AI agents deployed across the Sahid AI Hub ecosystem.",
    status: "Planned",
    category: "Command",
  },
  {
    id: "hospitality",
    name: "Hospitality",
    description:
      "Hospitality platform — AI-powered staff scheduling, menu intelligence, and guest experience.",
    status: "Planned",
    category: "Operations",
  },
  {
    id: "restaurants",
    name: "Restaurants",
    description:
      "Restaurant brand management: BOSSA Asado i Mar reservation flows, AI menus, and brand assets.",
    status: "Active",
    category: "Operations",
    href: "/projects",
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    description:
      "Searchable knowledge graph — project notes, decisions, technical references, and brand guides.",
    status: "Future",
    category: "Knowledge",
  },
  {
    id: "analytics",
    name: "Analytics",
    description:
      "Cross-platform analytics aggregating traffic, deployment frequency, revenue trends, and agent activity.",
    status: "Planned",
    category: "Command",
    href: "/vercel",
  },
  {
    id: "automation",
    name: "Automation",
    description:
      "Trigger-based workflow automation linking AI agents, deployments, GitHub events, and business processes.",
    status: "Planned",
    category: "Operations",
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "Live GitHub dashboard — repository health, commit activity, language breakdown, and CI status.",
    status: "Active",
    category: "Infrastructure",
    href: "/github",
  },
  {
    id: "vercel",
    name: "Vercel",
    description:
      "Live Vercel deployment dashboard — project status, deployment history, and build health per project.",
    status: "Active",
    category: "Infrastructure",
    href: "/vercel",
  },
  {
    id: "supabase",
    name: "Supabase",
    description:
      "Database health, query performance, and storage utilization across all Supabase-backed projects.",
    status: "Planned",
    category: "Infrastructure",
  },
  {
    id: "settings",
    name: "Settings",
    description:
      "OS configuration, environment variable status, integrations management, and access control.",
    status: "Future",
    category: "Infrastructure",
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
