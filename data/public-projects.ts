import raw from "./public-projects.json";

// PUBLIC DATA ONLY. This repository is public, so everything below is world
// readable. Internal fields (priority, evidence, next actions/decisions, owner
// gates, Notion links, private repository/deployment identifiers, client
// details) are NOT stored here and must never be added. They live in the
// owner's private Notion backup/registry.

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

/** Non-public projects are listed by name only: no description, links or details. */
export interface NameOnlyProject {
  id: string;
  name: string;
  zone: string;
  assetType: AssetType;
}

export const UNDISCLOSED_ZONE = "Undisclosed";
export const ZONE_ORDER = ["AI Business", "Hospitality", "Real Estate / Kai Korsou", "Digital & Education", "Infrastructure", "Incubator & Proof", UNDISCLOSED_ZONE];

export const ZONE_DESCRIPTIONS: Record<string, string> = {
  "AI Business": "Commercial AI ventures, products, media and service workstreams.",
  Hospitality: "Operating hospitality businesses and reusable Hospitality OS products.",
  "Real Estate / Kai Korsou": "Development, property command centers and related systems.",
  "Digital & Education": "Education, community and digital platform initiatives.",
  Infrastructure: "Portfolio operating systems, registries and technical control layers.",
  "Incubator & Proof": "Early-stage ventures, proof-of-work products and research projects.",
  [UNDISCLOSED_ZONE]: "Projects whose details are not public.",
};

const PUBLIC = raw.public as PublicProject[];
const NAMES_ONLY = raw.namesOnly as NameOnlyProject[];

export function getPublicProjects(): PublicProject[] {
  return PUBLIC;
}

export function getPublicProjectById(id: string): PublicProject | undefined {
  return PUBLIC.find((p) => p.id === id);
}

export function getNameOnlyProjects(): NameOnlyProject[] {
  return NAMES_ONLY;
}

/** Public projects with a declared live URL and status "Live". */
export function getDeclaredLiveApps(): (PublicProject & { websiteUrl: string })[] {
  return PUBLIC.filter((p): p is PublicProject & { websiteUrl: string } => p.status === "Live" && typeof p.websiteUrl === "string");
}

export function getPublicStats() {
  return {
    total: PUBLIC.length + NAMES_ONLY.length,
    public: PUBLIC.length,
    live: PUBLIC.filter((p) => p.status === "Live").length,
    namesOnly: NAMES_ONLY.length,
  };
}
