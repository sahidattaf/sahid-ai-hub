export interface OSDashboardCard {
  title: string;
  count: string;
  description: string;
  accent: "cyan" | "gold";
}

export type ToolCategory = "AI" | "Design" | "Dev" | "Ops";

export interface Tool {
  name: string;
  role: string;
  category: ToolCategory;
  usedFor: string[];
}

export type IncomeType = "Project" | "Retainer" | "Product" | "Service";

export interface RevenueStream {
  name: string;
  description: string;
  audience: string;
  incomeType: IncomeType;
  howItEarns: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  description: string;
  status: "Complete" | "Active" | "Planned";
  deliverables: string[];
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
    category: "AI",
    usedFor: ["Ideation", "Research", "Prompt Engineering", "Domain Analysis"],
  },
  {
    name: "Claude",
    role: "Code generation, architecture design, and deep reasoning.",
    category: "AI",
    usedFor: ["Code Generation", "Architecture", "Deep Reasoning", "Refactoring"],
  },
  {
    name: "Claude Design",
    role: "UI design systems and visual component libraries.",
    category: "Design",
    usedFor: ["Design Systems", "Component Libraries", "Visual Design", "UI Review"],
  },
  {
    name: "Spark",
    role: "Rapid visual prototyping and concept iteration.",
    category: "Design",
    usedFor: ["Rapid Prototyping", "Concept Validation", "Visual Iteration"],
  },
  {
    name: "GitHub",
    role: "Version control, CI/CD pipelines, and open-source publishing.",
    category: "Dev",
    usedFor: ["Version Control", "CI/CD", "Open Source", "Code Review"],
  },
  {
    name: "Vercel",
    role: "Production deployment, edge functions, and web analytics.",
    category: "Ops",
    usedFor: ["Production Deployment", "Edge Functions", "Analytics", "Preview URLs"],
  },
  {
    name: "Notion",
    role: "Command centers, strategic planning, and documentation.",
    category: "Ops",
    usedFor: ["Strategic Planning", "Documentation", "Command Centers", "Roadmaps"],
  },
  {
    name: "VS Code",
    role: "Primary development environment with AI-assisted coding.",
    category: "Dev",
    usedFor: ["Development", "AI-Assisted Coding", "Debugging", "Terminal Work"],
  },
];

export const REVENUE_STREAMS: RevenueStream[] = [
  {
    name: "AI Websites",
    description:
      "Custom Next.js applications built with embedded AI features, from brand sites to full platforms.",
    audience: "Businesses, restaurants, brands, and startups that need a web presence powered by AI.",
    incomeType: "Project",
    howItEarns:
      "Fixed project fee scoped to the build. Includes design, development, and deployment. Maintenance sold separately.",
  },
  {
    name: "Custom GPTs",
    description:
      "Tailored GPT systems designed for specific business workflows, support, and automation.",
    audience: "Teams and entrepreneurs who need AI handling a specific function — support, sales, operations.",
    incomeType: "Project",
    howItEarns:
      "Per-build fee for system design, prompt engineering, testing, and delivery. Optional retainer for iteration.",
  },
  {
    name: "Monthly AI Support",
    description:
      "Ongoing retainer for AI system maintenance, iteration, and performance optimization.",
    audience: "Existing clients with live AI systems who need continuous improvement and adaptation.",
    incomeType: "Retainer",
    howItEarns:
      "Monthly flat fee covering a set number of hours. Covers updates, monitoring, new prompt versions, and small features.",
  },
  {
    name: "Hospitality AI OS",
    description:
      "Full AI operating system package for food and beverage businesses — menus, ops, and analytics.",
    audience: "Restaurant owners, cafe operators, and hospitality groups looking for AI-driven operations.",
    incomeType: "Service",
    howItEarns:
      "Packaged service fee covering system build, staff training, and a 90-day support window. Renewal sold as retainer.",
  },
  {
    name: "Real Estate AI Intelligence",
    description:
      "Market analysis tools, property intelligence dashboards, and buyer/seller automation.",
    audience: "Property developers, real estate agents, and investment groups in emerging markets.",
    incomeType: "Service",
    howItEarns:
      "Project fee for dashboard build plus optional subscription for data refresh and ongoing market intelligence.",
  },
  {
    name: "Training / Workshops",
    description:
      "AI literacy programs, implementation workshops, and team enablement sessions.",
    audience: "Organizations, teams, and entrepreneurs who want to understand and apply AI tools.",
    incomeType: "Service",
    howItEarns:
      "Per-session or per-head pricing. Half-day, full-day, and multi-week program formats available.",
  },
  {
    name: "Templates / Digital Products",
    description:
      "Packaged AI frameworks, starter kits, and prompt libraries for self-serve implementation.",
    audience: "Builders, solopreneurs, and small teams who want to move fast with pre-built AI systems.",
    incomeType: "Product",
    howItEarns:
      "One-time purchase per product. Sold as digital downloads. Zero ongoing support required from the builder.",
  },
];

export const ROADMAP: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    title: "Public Front Door",
    description:
      "Static homepage, project showcase, live app links, and public proof of work. First point of contact for collaborators and clients.",
    status: "Complete",
    deliverables: [
      "Hero section with CTA",
      "Quick stats bar",
      "Project cards grid",
      "Zone classification",
      "Contact section",
      "Deployed to Vercel",
    ],
  },
  {
    phase: "Phase 2",
    title: "Project Dashboard",
    description:
      "OS-style dashboard with status system, zone architecture, command center overview, revenue engine, and roadmap visibility.",
    status: "Active",
    deliverables: [
      "OS Dashboard section",
      "Status and visibility badges",
      "Multi-page routing",
      "Dedicated pages per section",
      "Shared component library",
      "Data layer in TypeScript",
    ],
  },
  {
    phase: "Phase 3",
    title: "Live Integrations",
    description:
      "GitHub API integration for live repo stats, Vercel API for deployment status, and real-time project health indicators.",
    status: "Planned",
    deliverables: [
      "GitHub API connection",
      "Live star and fork counts",
      "Vercel deployment status feed",
      "Last-updated timestamps",
      "Project health indicators",
    ],
  },
  {
    phase: "Phase 4",
    title: "AI Assistant",
    description:
      "Embedded Claude-powered command interface for navigating projects, querying status, and surfacing intelligence from the hub.",
    status: "Planned",
    deliverables: [
      "Claude API integration",
      "Command input interface",
      "Project-aware context",
      "Natural language project lookup",
      "Smart routing from prompts",
    ],
  },
  {
    phase: "Phase 5",
    title: "Client / Investor Portal",
    description:
      "Authenticated workspace for active clients and investors. Private dashboards, project tracking, and direct communication layer.",
    status: "Planned",
    deliverables: [
      "Auth system with Supabase",
      "Per-client dashboard",
      "Private project views",
      "File and document access",
      "Direct message layer",
    ],
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
