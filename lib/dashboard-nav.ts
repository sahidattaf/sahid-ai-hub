export interface DashboardNavItem {
  label: string;
  href: string;
  description: string;
}

export const DASHBOARD_HOME: DashboardNavItem = {
  label: "Overview",
  href: "/dashboard",
  description: "Registry totals and integration setup status",
};

// Every entry must have a real page under app/dashboard (enforced by tests).
export const DASHBOARD_NAV: DashboardNavItem[] = [
  { label: "Projects", href: "/dashboard/projects", description: "Full project registry" },
  { label: "Live Apps", href: "/dashboard/live-apps", description: "Declared URLs vs verified deployment health" },
  { label: "GitHub", href: "/dashboard/github", description: "Repository status from the GitHub API" },
  { label: "Vercel", href: "/dashboard/vercel", description: "Project and production state from the Vercel API" },
  { label: "Notion", href: "/dashboard/notion", description: "Explicitly configured pages and data sources" },
  { label: "Revenue", href: "/dashboard/revenue", description: "Commercial classification and revenue data status" },
  { label: "Investors", href: "/dashboard/investors", description: "Investor-readiness evidence and data status" },
  { label: "Hospitality", href: "/dashboard/hospitality", description: "Hospitality zone projects and clients" },
  { label: "Kai Korsou", href: "/dashboard/kai-korsou", description: "Real estate and Kai Kòrsou projects" },
  { label: "GPT Innovation", href: "/dashboard/gpt-innovation", description: "GPT Innovation and child products" },
  { label: "JobHunter", href: "/dashboard/jobhunter", description: "JobHunterGPT proof-of-work product" },
  { label: "AI Stack", href: "/dashboard/ai-stack", description: "Toolchain and registry technology usage" },
  { label: "Settings", href: "/dashboard/settings", description: "Authentication and environment configuration status" },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
