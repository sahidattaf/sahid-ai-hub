import type { RepoVisibility } from "@/types/github";

export interface GithubRepositoryEntry {
  id: string;
  name: string;
  description: string;
  owner: string;
  repo: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  defaultBranch: string;
  visibility: RepoVisibility;
  language: string | null;
  vercelProject: string | null;
  topics: string[];
}

export const GITHUB_REPOSITORIES: GithubRepositoryEntry[] = [
  {
    id: "jobhunter-gpt",
    name: "JobHunterGPT",
    description:
      "AI-powered job search assistant. Automated matching, application tracking, and career intelligence.",
    owner: "sahidattaf",
    repo: "jobhunter-gpt",
    githubUrl: "https://github.com/sahidattaf/jobhunter-gpt",
    websiteUrl: "https://jobhunter-gpt-gamma.vercel.app/",
    defaultBranch: "main",
    visibility: "Public",
    language: "TypeScript",
    vercelProject: "jobhunter-gpt",
    topics: ["gpt", "automation", "career"],
  },
  {
    id: "sahid-ai-hub",
    name: "Sahid AI Hub",
    description:
      "Multi-page AI Operating System command center — project registry, GitHub dashboard, integrations map, revenue tracking, and build roadmap.",
    owner: "sahidattaf",
    repo: "sahid-ai-hub",
    githubUrl: "https://github.com/sahidattaf/sahid-ai-hub",
    websiteUrl: null,
    defaultBranch: "master",
    visibility: "Public",
    language: "TypeScript",
    vercelProject: "sahid-ai-hub",
    topics: ["dashboard", "ai-os", "infrastructure"],
  },
  {
    id: "gpt-innovation-os",
    name: "GPT Innovation OS",
    description:
      "Turborepo monorepo powering a multi-app AI ecosystem with five Next.js apps and six shared packages.",
    owner: "sahidattaf",
    repo: "gpt-innovation-os",
    githubUrl: "https://github.com/sahidattaf/gpt-innovation-os",
    websiteUrl: "https://gpt-os-website.vercel.app/",
    defaultBranch: "main",
    visibility: "Public",
    language: "TypeScript",
    vercelProject: "gpt-os-website",
    topics: ["monorepo", "platform", "ai"],
  },
  {
    id: "bossa-ai-os",
    name: "BOSSA AI OS",
    description:
      "AI operating system for hospitality management, menu intelligence, and business automation.",
    owner: "sahidattaf",
    repo: "bossa-ai-os",
    githubUrl: "https://github.com/sahidattaf/bossa-ai-os",
    websiteUrl: "https://bossa-ai-os.vercel.app/",
    defaultBranch: "main",
    visibility: "Public",
    language: "TypeScript",
    vercelProject: "bossa-ai-os",
    topics: ["ai-os", "hospitality", "automation"],
  },
  {
    id: "kai-korsou-command-center",
    name: "Kai Kòrsou Command Center",
    description:
      "AI command center for the Curacao real estate and tourism ecosystem — property intelligence, local market data, and island economy dashboards.",
    owner: "sahidattaf",
    repo: "kai-korsou-command-center",
    githubUrl: "https://github.com/sahidattaf/kai-korsou-command-center",
    websiteUrl: null,
    defaultBranch: "main",
    visibility: "Public",
    language: "TypeScript",
    vercelProject: null,
    topics: ["real-estate", "curacao", "command-center"],
  },
  {
    id: "dreamscape",
    name: "Dreamscape",
    description:
      "AI-powered creative studio for generative narratives, world-building, and interactive fiction — turning imagination into structured story experiences.",
    owner: "sahidattaf",
    repo: null,
    githubUrl: null,
    websiteUrl: null,
    defaultBranch: "main",
    visibility: "Private",
    language: "TypeScript",
    vercelProject: null,
    topics: ["creative", "ai", "storytelling"],
  },
  {
    id: "ai-marketing-tools",
    name: "AI Marketing Tools",
    description:
      "Suite of AI-powered marketing tools for content generation, campaign orchestration, and analytics.",
    owner: "sahidattaf",
    repo: "ai_-marketing-_tools-_agent",
    githubUrl: "https://github.com/sahidattaf/ai_-marketing-_tools-_agent",
    websiteUrl: "https://ai-marketing-tools-six.vercel.app/",
    defaultBranch: "main",
    visibility: "Public",
    language: "TypeScript",
    vercelProject: "ai-marketing-tools",
    topics: ["marketing", "ai", "tools"],
  },
  {
    id: "piskadera-marketplace",
    name: "Piskadera Marketplace",
    description:
      "Digital marketplace built for the Curacao fishing and local goods ecosystem.",
    owner: "sahidattaf",
    repo: "kai-korsou-command-center",
    githubUrl: "https://github.com/sahidattaf/kai-korsou-command-center",
    websiteUrl: "https://piskadera-marketplace.vercel.app/",
    defaultBranch: "main",
    visibility: "Public",
    language: "TypeScript",
    vercelProject: "piskadera-marketplace",
    topics: ["marketplace", "ecommerce", "curacao"],
  },
  {
    id: "ghost-reit",
    name: "Ghost REIT",
    description:
      "AI-powered real estate investment trust management and portfolio intelligence platform.",
    owner: "sahidattaf",
    repo: null,
    githubUrl: null,
    websiteUrl: null,
    defaultBranch: "main",
    visibility: "Private",
    language: null,
    vercelProject: null,
    topics: ["real-estate", "investment", "reit"],
  },
  {
    id: "hospitality-os",
    name: "Hospitality OS",
    description:
      "Universal hospitality operating system — multi-property management, AI-powered staff scheduling, and revenue intelligence for hotels and restaurants.",
    owner: "sahidattaf",
    repo: null,
    githubUrl: null,
    websiteUrl: null,
    defaultBranch: "main",
    visibility: "Private",
    language: "TypeScript",
    vercelProject: null,
    topics: ["hospitality", "ai-os", "multi-property"],
  },
  {
    id: "digital-korsou",
    name: "Digital Kòrsou",
    description:
      "Digital ecosystem and economy platform for the island of Curaçao.",
    owner: "sahidattaf",
    repo: null,
    githubUrl: null,
    websiteUrl: null,
    defaultBranch: "main",
    visibility: "Private",
    language: null,
    vercelProject: null,
    topics: ["curacao", "ecosystem", "economy"],
  },
];
