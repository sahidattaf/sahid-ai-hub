export interface OSDashboardCard {
  title: string;
  count: string;
  description: string;
  accent: "cyan" | "gold";
}

export interface Tool {
  name: string;
  role: string;
}

export interface RevenueStream {
  name: string;
  description: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  description: string;
  status: "Complete" | "Active" | "Planned";
}

export interface Zone {
  name: string;
  description: string;
  count: string;
}

export const OS_DASHBOARD: OSDashboardCard[] = [
  {
    title: "Live Apps",
    count: "6",
    description: "Deployed, publicly accessible Next.js applications on Vercel.",
    accent: "cyan",
  },
  {
    title: "GitHub Repositories",
    count: "6",
    description: "Open-source repositories under sahidattaf, all public.",
    accent: "cyan",
  },
  {
    title: "Vercel Deployments",
    count: "6",
    description: "Production deployments with automated CI/CD pipelines.",
    accent: "cyan",
  },
  {
    title: "Notion Command Centers",
    count: "3",
    description: "Internal planning hubs, operational dashboards, and strategy maps.",
    accent: "gold",
  },
  {
    title: "Claude Design Systems",
    count: "2",
    description: "UI design systems and component libraries built with Claude.",
    accent: "gold",
  },
  {
    title: "Spark Prototypes",
    count: "4",
    description: "Rapid prototypes and validated concept builds in Spark.",
    accent: "gold",
  },
  {
    title: "AI Agents / GPTs",
    count: "3",
    description: "Custom GPT systems and automation agents deployed for specific domains.",
    accent: "cyan",
  },
  {
    title: "Revenue Engine",
    count: "7",
    description: "Active revenue streams and packaged commercial offers.",
    accent: "gold",
  },
];

export const TOOLCHAIN: Tool[] = [
  {
    name: "ChatGPT",
    role: "Ideation, prompt engineering, and domain research.",
  },
  {
    name: "Claude",
    role: "Code generation, architecture design, and deep reasoning.",
  },
  {
    name: "Claude Design",
    role: "UI design systems and visual component libraries.",
  },
  {
    name: "Spark",
    role: "Rapid visual prototyping and concept iteration.",
  },
  {
    name: "GitHub",
    role: "Version control, CI/CD pipelines, and open-source publishing.",
  },
  {
    name: "Vercel",
    role: "Production deployment, edge functions, and web analytics.",
  },
  {
    name: "Notion",
    role: "Command centers, strategic planning, and documentation.",
  },
  {
    name: "VS Code",
    role: "Primary development environment with AI-assisted coding.",
  },
];

export const REVENUE_STREAMS: RevenueStream[] = [
  {
    name: "AI Websites",
    description:
      "Custom Next.js applications built with embedded AI features, from brand sites to full platforms.",
  },
  {
    name: "Custom GPTs",
    description:
      "Tailored GPT systems designed for specific business workflows, support, and automation.",
  },
  {
    name: "Monthly AI Support",
    description:
      "Ongoing retainer for AI system maintenance, iteration, and performance optimization.",
  },
  {
    name: "Hospitality AI OS",
    description:
      "Full AI operating system package for food and beverage businesses — menus, ops, and analytics.",
  },
  {
    name: "Real Estate AI Intelligence",
    description:
      "Market analysis tools, property intelligence dashboards, and buyer/seller automation.",
  },
  {
    name: "Training / Workshops",
    description:
      "AI literacy programs, implementation workshops, and team enablement sessions.",
  },
  {
    name: "Templates / Digital Products",
    description:
      "Packaged AI frameworks, starter kits, and prompt libraries for self-serve implementation.",
  },
];

export const ROADMAP: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    title: "Public Front Door",
    description:
      "Static homepage, project showcase, live app links, and public proof of work. First point of contact for collaborators and clients.",
    status: "Complete",
  },
  {
    phase: "Phase 2",
    title: "Project Dashboard",
    description:
      "OS-style dashboard with status system, zone architecture, command center overview, revenue engine, and roadmap visibility.",
    status: "Active",
  },
  {
    phase: "Phase 3",
    title: "Live Integrations",
    description:
      "GitHub API integration for live repo stats, Vercel API for deployment status, and real-time project health indicators.",
    status: "Planned",
  },
  {
    phase: "Phase 4",
    title: "AI Assistant",
    description:
      "Embedded Claude-powered command interface for navigating projects, querying status, and surfacing intelligence from the hub.",
    status: "Planned",
  },
  {
    phase: "Phase 5",
    title: "Client / Investor Portal",
    description:
      "Authenticated workspace for active clients and investors. Private dashboards, project tracking, and direct communication layer.",
    status: "Planned",
  },
];

export const ZONES: Zone[] = [
  {
    name: "Proof of Work",
    description:
      "Publicly deployed applications and repositories that demonstrate real capability. Every item here is live, functional, and verifiable.",
    count: "6",
  },
  {
    name: "Hospitality",
    description:
      "AI systems built for food, beverage, and guest experience — brand sites, operating systems, and intelligence layers for the hospitality industry.",
    count: "2",
  },
  {
    name: "Real Estate / Kai Korsou",
    description:
      "Property intelligence tools, local commerce infrastructure, and digital ecosystem builds for the Curacao market.",
    count: "1",
  },
  {
    name: "GPT Innovation / AI Services",
    description:
      "Custom GPT systems, AI marketing platforms, and multi-app AI ecosystems offered as commercial services.",
    count: "2",
  },
  {
    name: "Infrastructure / Archive",
    description:
      "Platform engineering, monorepo architecture, deployment infrastructure, and foundational systems that power every other zone.",
    count: "1",
  },
];
