export type Status = "Live" | "Repo" | "Prototype" | "Planning";
export type Visibility = "Public" | "Private" | "Hybrid";

export interface Project {
  title: string;
  description: string;
  live?: string;
  repo?: string;
  tags: string[];
  status: Status;
  visibility: Visibility;
  category: string;
  zone: string;
  nextAction: string;
  techStack: string[];
}

export const PROJECTS: Project[] = [
  {
    title: "JobHunterGPT",
    description:
      "AI-powered job search assistant. Automated matching, application tracking, and career intelligence.",
    live: "https://jobhunter-gpt-gamma.vercel.app/",
    repo: "https://github.com/sahidattaf/jobhunter-gpt",
    tags: ["GPT", "Automation", "Career"],
    status: "Live",
    visibility: "Public",
    category: "Career Tech",
    zone: "Proof of Work",
    nextAction: "Add AI resume builder module",
    techStack: ["Next.js", "OpenAI API", "TypeScript", "Vercel"],
  },
  {
    title: "BOSSA Asado i Mar",
    description:
      "Premium hospitality brand site with reservation flows and AI-enhanced guest experience.",
    live: "https://bossa-asado-i-mar.vercel.app/",
    repo: "https://github.com/sahidattaf/BOSSA-ASADO-I-MAR",
    tags: ["Hospitality", "Brand", "Next.js"],
    status: "Live",
    visibility: "Public",
    category: "Hospitality Brand",
    zone: "Hospitality",
    nextAction: "Integrate online reservation system",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "Vercel"],
  },
  {
    title: "BOSSA AI OS",
    description:
      "AI operating system for hospitality management, menu intelligence, and business automation.",
    live: "https://bossa-ai-os.vercel.app/",
    repo: "https://github.com/sahidattaf/bossa-ai-os",
    tags: ["AI OS", "Hospitality", "Automation"],
    status: "Live",
    visibility: "Public",
    category: "AI Operating System",
    zone: "Hospitality",
    nextAction: "Build POS intelligence layer",
    techStack: ["Next.js", "OpenAI API", "Supabase", "Vercel"],
  },
  {
    title: "GPT OS Website",
    description:
      "Turborepo monorepo powering a multi-app AI ecosystem with five Next.js apps and six shared packages.",
    live: "https://gpt-os-website.vercel.app/",
    repo: "https://github.com/sahidattaf/gpt-innovation-os",
    tags: ["Monorepo", "Platform", "AI"],
    status: "Live",
    visibility: "Public",
    category: "Platform Engineering",
    zone: "GPT Innovation / AI Services",
    nextAction: "Launch shared API gateway",
    techStack: ["Turborepo", "Next.js", "TypeScript", "Vercel"],
  },
  {
    title: "Piskadera Marketplace",
    description:
      "Digital marketplace built for the Curacao fishing and local goods ecosystem.",
    live: "https://piskadera-marketplace.vercel.app/",
    repo: "https://github.com/sahidattaf/kai-korsou-command-center",
    tags: ["Marketplace", "E-commerce", "Curacao"],
    status: "Live",
    visibility: "Public",
    category: "Local Commerce",
    zone: "Real Estate / Kai Korsou",
    nextAction: "Build vendor self-service dashboard",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "Vercel"],
  },
  {
    title: "AI Marketing Tools",
    description:
      "Suite of AI-powered marketing tools for content generation, campaign orchestration, and analytics.",
    live: "https://ai-marketing-tools-six.vercel.app/",
    repo: "https://github.com/sahidattaf/ai_-marketing-_tools-_agent",
    tags: ["Marketing", "AI", "Tools"],
    status: "Live",
    visibility: "Public",
    category: "Marketing Automation",
    zone: "GPT Innovation / AI Services",
    nextAction: "Add campaign analytics dashboard",
    techStack: ["Next.js", "OpenAI API", "TypeScript", "Vercel"],
  },
];
