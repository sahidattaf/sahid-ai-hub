export type Status = "Live" | "Repo" | "Prototype" | "Planning";
export type Visibility = "Public" | "Private" | "Hybrid";
export type Priority = "High" | "Medium" | "Low";
export type RevenuePotential =
  | "SaaS"
  | "Platform"
  | "Marketplace"
  | "Client Site"
  | "Portfolio";

export interface RegistryProject {
  id: string;
  name: string;
  zone: string;
  status: Status;
  visibility: Visibility;
  description: string;
  websiteUrl?: string;
  githubUrl?: string;
  vercelProject?: string;
  category: string;
  stack: string[];
  owner: string;
  priority: Priority;
  revenuePotential: RevenuePotential;
  nextAction: string;
  tags: string[];
}

export const ZONE_ORDER = [
  "Proof of Work",
  "Hospitality",
  "Real Estate / Kai Korsou",
  "GPT Innovation / AI Services",
  "Infrastructure",
];

export const ZONE_DESCRIPTIONS: Record<string, string> = {
  "Proof of Work":
    "Client-facing applications demonstrating technical depth, real-world deployment, and AI integration.",
  Hospitality:
    "Brand sites, AI operating systems, and management tools for the hospitality and restaurant sector.",
  "Real Estate / Kai Korsou":
    "Marketplace and command center tools for the Curacao local economy and property sector.",
  "GPT Innovation / AI Services":
    "Platform infrastructure, AI service suites, and creative AI applications.",
  Infrastructure:
    "The operating layer: dashboards, command centers, and tooling that powers all other zones.",
};

export const REGISTRY: RegistryProject[] = [
  {
    id: "jobhunter-gpt",
    name: "JobHunterGPT",
    zone: "Proof of Work",
    status: "Live",
    visibility: "Public",
    description:
      "AI-powered job search assistant. Automated matching, application tracking, and career intelligence.",
    websiteUrl: "https://jobhunter-gpt-gamma.vercel.app/",
    githubUrl: "https://github.com/sahidattaf/jobhunter-gpt",
    vercelProject: "jobhunter-gpt",
    category: "Career Tech",
    stack: ["Next.js", "OpenAI API", "TypeScript", "Vercel"],
    owner: "Sahid Attaf",
    priority: "High",
    revenuePotential: "SaaS",
    nextAction: "Add AI resume builder module",
    tags: ["GPT", "Automation", "Career"],
  },
  {
    id: "bossa-asado-i-mar",
    name: "BOSSA Asado i Mar",
    zone: "Hospitality",
    status: "Live",
    visibility: "Public",
    description:
      "Premium hospitality brand site with reservation flows and AI-enhanced guest experience.",
    websiteUrl: "https://bossa-asado-i-mar.vercel.app/",
    githubUrl: "https://github.com/sahidattaf/BOSSA-ASADO-I-MAR",
    vercelProject: "bossa-asado-i-mar",
    category: "Hospitality Brand",
    stack: ["Next.js", "Tailwind CSS", "TypeScript", "Vercel"],
    owner: "Sahid Attaf",
    priority: "High",
    revenuePotential: "Client Site",
    nextAction: "Integrate online reservation system",
    tags: ["Hospitality", "Brand", "Next.js"],
  },
  {
    id: "bossa-ai-os",
    name: "BOSSA AI OS",
    zone: "Hospitality",
    status: "Live",
    visibility: "Public",
    description:
      "AI operating system for hospitality management, menu intelligence, and business automation.",
    websiteUrl: "https://bossa-ai-os.vercel.app/",
    githubUrl: "https://github.com/sahidattaf/bossa-ai-os",
    vercelProject: "bossa-ai-os",
    category: "AI Operating System",
    stack: ["Next.js", "OpenAI API", "Supabase", "Vercel"],
    owner: "Sahid Attaf",
    priority: "High",
    revenuePotential: "SaaS",
    nextAction: "Build POS intelligence layer",
    tags: ["AI OS", "Hospitality", "Automation"],
  },
  {
    id: "hospitality-os",
    name: "Hospitality OS",
    zone: "Hospitality",
    status: "Planning",
    visibility: "Private",
    description:
      "Universal hospitality operating system — multi-property management, AI-powered staff scheduling, and revenue intelligence for hotels and restaurants.",
    category: "AI Operating System",
    stack: ["Next.js", "Supabase", "TypeScript", "Vercel"],
    owner: "Sahid Attaf",
    priority: "Medium",
    revenuePotential: "SaaS",
    nextAction: "Define product scope and core feature set",
    tags: ["Hospitality", "AI OS", "Multi-property"],
  },
  {
    id: "kai-korsou-command-center",
    name: "Kai Kòrsou Command Center",
    zone: "Real Estate / Kai Korsou",
    status: "Prototype",
    visibility: "Public",
    description:
      "AI command center for the Curacao real estate and tourism ecosystem — property intelligence, local market data, and island economy dashboards.",
    githubUrl: "https://github.com/sahidattaf/kai-korsou-command-center",
    category: "Real Estate Tech",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    owner: "Sahid Attaf",
    priority: "Medium",
    revenuePotential: "Platform",
    nextAction: "Build real estate listing integration",
    tags: ["Real Estate", "Curacao", "Command Center"],
  },
  {
    id: "piskadera-marketplace",
    name: "Piskadera Marketplace",
    zone: "Real Estate / Kai Korsou",
    status: "Live",
    visibility: "Public",
    description:
      "Digital marketplace built for the Curacao fishing and local goods ecosystem.",
    websiteUrl: "https://piskadera-marketplace.vercel.app/",
    githubUrl: "https://github.com/sahidattaf/kai-korsou-command-center",
    vercelProject: "piskadera-marketplace",
    category: "Local Commerce",
    stack: ["Next.js", "Tailwind CSS", "TypeScript", "Vercel"],
    owner: "Sahid Attaf",
    priority: "Medium",
    revenuePotential: "Marketplace",
    nextAction: "Build vendor self-service dashboard",
    tags: ["Marketplace", "E-commerce", "Curacao"],
  },
  {
    id: "gpt-innovation-os",
    name: "GPT Innovation OS",
    zone: "GPT Innovation / AI Services",
    status: "Live",
    visibility: "Public",
    description:
      "Turborepo monorepo powering a multi-app AI ecosystem with five Next.js apps and six shared packages.",
    websiteUrl: "https://gpt-os-website.vercel.app/",
    githubUrl: "https://github.com/sahidattaf/gpt-innovation-os",
    vercelProject: "gpt-os-website",
    category: "Platform Engineering",
    stack: ["Turborepo", "Next.js", "TypeScript", "Vercel"],
    owner: "Sahid Attaf",
    priority: "High",
    revenuePotential: "Platform",
    nextAction: "Launch shared API gateway",
    tags: ["Monorepo", "Platform", "AI"],
  },
  {
    id: "ai-marketing-tools",
    name: "AI Marketing Tools",
    zone: "GPT Innovation / AI Services",
    status: "Live",
    visibility: "Public",
    description:
      "Suite of AI-powered marketing tools for content generation, campaign orchestration, and analytics.",
    websiteUrl: "https://ai-marketing-tools-six.vercel.app/",
    githubUrl: "https://github.com/sahidattaf/ai_-marketing-_tools-_agent",
    vercelProject: "ai-marketing-tools",
    category: "Marketing Automation",
    stack: ["Next.js", "OpenAI API", "TypeScript", "Vercel"],
    owner: "Sahid Attaf",
    priority: "High",
    revenuePotential: "SaaS",
    nextAction: "Add campaign analytics dashboard",
    tags: ["Marketing", "AI", "Tools"],
  },
  {
    id: "dreamscape",
    name: "Dreamscape",
    zone: "GPT Innovation / AI Services",
    status: "Planning",
    visibility: "Private",
    description:
      "AI-powered creative studio for generative narratives, world-building, and interactive fiction — turning imagination into structured story experiences.",
    category: "Creative AI",
    stack: ["Next.js", "Claude API", "TypeScript", "Vercel"],
    owner: "Sahid Attaf",
    priority: "Low",
    revenuePotential: "SaaS",
    nextAction: "Design core narrative engine architecture",
    tags: ["Creative", "AI", "Storytelling"],
  },
  {
    id: "sahid-ai-hub",
    name: "Sahid AI Hub",
    zone: "Infrastructure",
    status: "Live",
    visibility: "Public",
    description:
      "Multi-page AI Operating System command center — project registry, GitHub dashboard, integrations map, revenue tracking, and build roadmap.",
    githubUrl: "https://github.com/sahidattaf/sahid-ai-hub",
    vercelProject: "sahid-ai-hub",
    category: "Infrastructure / Command Center",
    stack: ["Next.js 16", "Tailwind CSS v4", "TypeScript", "Vercel"],
    owner: "Sahid Attaf",
    priority: "High",
    revenuePotential: "Portfolio",
    nextAction: "Deploy Sprint 6 project registry",
    tags: ["Dashboard", "AI OS", "Infrastructure"],
  },
];

export function getRegistryStats() {
  return {
    total: REGISTRY.length,
    live: REGISTRY.filter((p) => p.status === "Live").length,
    public: REGISTRY.filter((p) => p.visibility === "Public").length,
    revenue: REGISTRY.filter((p) => p.revenuePotential !== "Portfolio").length,
  };
}
