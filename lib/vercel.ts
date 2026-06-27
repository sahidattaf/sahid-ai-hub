const VERCEL_BASE = "https://api.vercel.com";

export type DeployState =
  | "BUILDING"
  | "ERROR"
  | "INITIALIZING"
  | "QUEUED"
  | "READY"
  | "CANCELED";

export interface VercelProjectLink {
  type: "github" | "gitlab" | "bitbucket";
  org?: string;
  repo?: string;
  repoId?: number;
}

export interface VercelProductionTarget {
  id?: string;
  url?: string;
  readyState?: DeployState;
  createdAt?: number;
  ready?: number;
}

export interface VercelProject {
  id: string;
  name: string;
  framework: string | null;
  link?: VercelProjectLink;
  targets?: { production?: VercelProductionTarget };
  updatedAt: number;
  createdAt: number;
}

export interface VercelDeploymentMeta {
  githubCommitMessage?: string;
  githubCommitRef?: string;
  githubCommitSha?: string;
  githubOrg?: string;
  githubRepo?: string;
  githubCommitAuthorName?: string;
}

export interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state: DeployState;
  target: "production" | "staging" | null;
  createdAt: number;
  ready?: number;
  meta?: VercelDeploymentMeta;
}

export interface VercelProjectRow {
  project: VercelProject;
  latestDeploy: VercelDeployment | null;
}

export interface VercelSummaryStats {
  total: number;
  ready: number;
  failed: number;
  recentCount: number;
}

export function hasToken(): boolean {
  return Boolean(process.env.VERCEL_TOKEN);
}

function buildHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function teamParam(): string {
  const teamId = process.env.VERCEL_TEAM_ID;
  return teamId ? `&teamId=${encodeURIComponent(teamId)}` : "";
}

export async function fetchProjects(): Promise<VercelProject[]> {
  const res = await fetch(
    `${VERCEL_BASE}/v9/projects?limit=100${teamParam()}`,
    { headers: buildHeaders(), next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error(`Vercel API returned ${res.status} for /v9/projects`);
  }
  const data = (await res.json()) as { projects: VercelProject[] };
  return data.projects;
}

export async function fetchDeployments(limit = 50): Promise<VercelDeployment[]> {
  const res = await fetch(
    `${VERCEL_BASE}/v6/deployments?limit=${limit}${teamParam()}`,
    { headers: buildHeaders(), next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error(`Vercel API returned ${res.status} for /v6/deployments`);
  }
  const data = (await res.json()) as { deployments: VercelDeployment[] };
  return data.deployments;
}

export function joinProjects(
  projects: VercelProject[],
  deployments: VercelDeployment[]
): VercelProjectRow[] {
  const latestByName: Record<string, VercelDeployment> = {};
  for (const dep of deployments) {
    const existing = latestByName[dep.name];
    if (!existing || dep.createdAt > existing.createdAt) {
      latestByName[dep.name] = dep;
    }
  }
  return [...projects]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((project) => ({
      project,
      latestDeploy: latestByName[project.name] ?? null,
    }));
}

export function buildSummaryStats(
  projects: VercelProject[],
  deployments: VercelDeployment[]
): VercelSummaryStats {
  const oneDayAgo = Date.now() - 86_400_000;
  return {
    total: projects.length,
    ready: projects.filter(
      (p) => p.targets?.production?.readyState === "READY"
    ).length,
    failed: projects.filter(
      (p) => p.targets?.production?.readyState === "ERROR"
    ).length,
    recentCount: deployments.filter((d) => d.createdAt > oneDayAgo).length,
  };
}

export function productionUrl(project: VercelProject): string | null {
  const url = project.targets?.production?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `https://${url}`;
}

export function productionState(project: VercelProject): DeployState | null {
  return project.targets?.production?.readyState ?? null;
}

export function productionTimestamp(project: VercelProject): number | null {
  return (
    project.targets?.production?.ready ??
    project.targets?.production?.createdAt ??
    null
  );
}

export function githubUrl(project: VercelProject): string | null {
  const link = project.link;
  if (!link || link.type !== "github" || !link.org || !link.repo) return null;
  return `https://github.com/${link.org}/${link.repo}`;
}

export function frameworkLabel(framework: string | null): string {
  const labels: Record<string, string> = {
    nextjs: "Next.js",
    "next.js": "Next.js",
    react: "React",
    "create-react-app": "Create React App",
    vite: "Vite",
    nuxtjs: "Nuxt.js",
    gatsby: "Gatsby",
    astro: "Astro",
    remix: "Remix",
    svelte: "SvelteKit",
    sveltekit: "SvelteKit",
    blitzjs: "Blitz.js",
    static: "Static",
    html: "HTML",
    angular: "Angular",
    ionic: "Ionic",
    eleventy: "Eleventy",
    hugo: "Hugo",
    jekyll: "Jekyll",
  };
  if (!framework) return "Custom";
  return labels[framework.toLowerCase()] ?? framework;
}

export function stateLabel(state: DeployState | null): string {
  if (!state) return "Unknown";
  const map: Record<DeployState, string> = {
    READY: "Ready",
    ERROR: "Failed",
    BUILDING: "Building",
    QUEUED: "Queued",
    INITIALIZING: "Initializing",
    CANCELED: "Canceled",
  };
  return map[state];
}

export function stateColor(state: DeployState | null): string {
  if (!state) return "var(--text-subtle)";
  const map: Record<DeployState, string> = {
    READY: "var(--cyan)",
    ERROR: "#ef4444",
    BUILDING: "var(--gold)",
    QUEUED: "var(--text-subtle)",
    INITIALIZING: "var(--text-subtle)",
    CANCELED: "var(--text-subtle)",
  };
  return map[state];
}

export function stateBg(state: DeployState | null): string {
  if (!state) return "rgba(100,116,139,0.12)";
  const map: Record<DeployState, string> = {
    READY: "rgba(0,212,255,0.12)",
    ERROR: "rgba(239,68,68,0.15)",
    BUILDING: "rgba(255,184,0,0.12)",
    QUEUED: "rgba(100,116,139,0.12)",
    INITIALIZING: "rgba(100,116,139,0.12)",
    CANCELED: "rgba(100,116,139,0.12)",
  };
  return map[state];
}

export function timeAgo(ms: number): string {
  const diff = Math.floor((Date.now() - ms) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
