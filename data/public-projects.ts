import raw from "./public-projects.json";

// PUBLIC DATA ONLY. This repository is public, so everything below is world
// readable. Internal fields (priority, evidence, next actions/decisions, owner
// gates, Notion links, private repository/deployment identifiers, client
// details) are NOT stored here and must never be added. They live in the
// owner's private Notion backup/registry. Projects that are not public are not
// listed at all, not even by name.

export type Status = "Live" | "Repo" | "Prototype" | "Planning";
export type AssetType = "Venture" | "Product" | "Development" | "Client" | "Infrastructure" | "Media Workstream" | "Research" | "Legacy";

/** Fields that may be published for a public project. This is the allowlist. */
export interface PublicProject {
  id: string;
  name: string;
  zone: string;
  assetType: AssetType;
  status: Status;
  description: string;
  websiteUrl?: string;
  githubUrl?: string;
  category: string;
  stack: string[];
  tags: string[];
}

export const ZONE_ORDER = ["AI Business", "Hospitality", "Digital & Education", "Infrastructure", "Incubator & Proof"];

export const ZONE_DESCRIPTIONS: Record<string, string> = {
  "AI Business": "Commercial AI ventures, products, media and service workstreams.",
  Hospitality: "Operating hospitality businesses and reusable hospitality products.",
  "Digital & Education": "Education, community and digital platform initiatives.",
  Infrastructure: "Portfolio operating systems, registries and technical control layers.",
  "Incubator & Proof": "Early-stage ventures, proof-of-work products and research projects.",
};

const PUBLIC = raw.public as PublicProject[];

export function getPublicProjects(): PublicProject[] {
  return PUBLIC;
}

export function getPublicProjectById(id: string): PublicProject | undefined {
  return PUBLIC.find((p) => p.id === id);
}

/** Public projects with a declared live URL and status "Live". */
export function getDeclaredLiveApps(): (PublicProject & { websiteUrl: string })[] {
  return PUBLIC.filter((p): p is PublicProject & { websiteUrl: string } => p.status === "Live" && typeof p.websiteUrl === "string");
}

export function getPublicStats() {
  return {
    total: PUBLIC.length,
    live: PUBLIC.filter((p) => p.status === "Live").length,
    liveApps: getDeclaredLiveApps().length,
    repositories: PUBLIC.filter((p) => p.githubUrl).length,
    zones: new Set(PUBLIC.map((p) => p.zone)).size,
  };
}
