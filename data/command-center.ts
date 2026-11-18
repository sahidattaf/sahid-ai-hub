export type ToolCategory = "AI" | "Design" | "Dev" | "Ops";

export interface Tool {
  name: string;
  role: string;
  category: ToolCategory;
  usedFor: string[];
}

/** Public service summary: what is offered, nothing about pricing, clients or income. */
export interface ServiceOffer {
  name: string;
  description: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  description: string;
  status: "Complete" | "Active" | "Planned";
  deliverables: string[];
}

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

export const SERVICES: ServiceOffer[] = [
  { name: "AI Websites", description: "Next.js applications with embedded AI features, from brand sites to full platforms." },
  { name: "Custom GPTs", description: "GPT systems designed for specific business workflows, support and automation." },
  { name: "AI Support", description: "Ongoing maintenance, iteration and optimization of AI systems." },
  { name: "Hospitality AI", description: "AI systems for food and beverage businesses: menus, operations and analytics." },
  { name: "Training and Workshops", description: "AI literacy programs, implementation workshops and team enablement." },
  { name: "Digital Products", description: "Packaged AI frameworks, starter kits and prompt libraries." },
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
    title: "Authenticated Portal",
    description:
      "Authenticated area for signed-in users: private dashboards, project tracking, and a messaging layer.",
    status: "Planned",
    deliverables: [
      "Authentication",
      "Personal dashboard",
      "Private views",
      "File and document access",
      "Direct message layer",
    ],
  },
];
