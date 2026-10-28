import "server-only";
import { getVercelTargets, type VercelTarget } from "@/data/project-registry";
import { cachedFetch } from "./cache";
import { isRecord, malformed, providerJson } from "./http";
import { IntegrationError, type IntegrationResult } from "./types";

const PROVIDER = "Vercel";
export const VERCEL_SOURCE = "Vercel REST API (api.vercel.com /v10/projects)";
const BASE = "https://api.vercel.com";
const TTL_MS = 60_000;
const PAGE_LIMIT = 100;
const MAX_PAGES = 5;

export interface VercelProduction {
  readyState: string;
  /** Hostname Vercel reports for the production deployment. */
  host: string | null;
  at: number | null;
}

export interface VercelProjectSnapshot {
  id: string;
  name: string;
  framework: string | null;
  updatedAt: number | null;
  production: VercelProduction | null;
}

export interface VercelSnapshot {
  projects: VercelProjectSnapshot[];
}

export function hostOf(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).host;
  } catch {
    return null;
  }
}

export function parseVercelProject(raw: unknown): VercelProjectSnapshot {
  if (!isRecord(raw) || typeof raw.id !== "string" || typeof raw.name !== "string") throw malformed(PROVIDER, "project id/name");
  let production: VercelProduction | null = null;
  const targets = isRecord(raw.targets) ? raw.targets : null;
  const prod = targets && isRecord(targets.production) ? targets.production : null;
  if (prod && typeof prod.readyState === "string") {
    const alias = Array.isArray(prod.alias) ? prod.alias.find((a) => typeof a === "string") : undefined;
    const at = [prod.readyAt, prod.ready, prod.createdAt].find((v): v is number => typeof v === "number");
    production = { readyState: prod.readyState, host: hostOf(alias) ?? hostOf(prod.url), at: at ?? null };
  }
  return {
    id: raw.id,
    name: raw.name,
    framework: typeof raw.framework === "string" ? raw.framework : null,
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : null,
    production,
  };
}

/** Accepts both documented shapes: a bare array or `{ projects, pagination }`. */
export function parseProjectsPage(raw: unknown): { projects: VercelProjectSnapshot[]; next: number | null } {
  const list = Array.isArray(raw) ? raw : isRecord(raw) && Array.isArray(raw.projects) ? raw.projects : null;
  if (!list) throw malformed(PROVIDER, "projects list");
  const pagination = isRecord(raw) && isRecord(raw.pagination) ? raw.pagination : null;
  return { projects: list.map(parseVercelProject), next: pagination && typeof pagination.next === "number" ? pagination.next : null };
}

export async function fetchVercelSnapshot(token: string, teamId?: string): Promise<VercelSnapshot> {
  const projects: VercelProjectSnapshot[] = [];
  let until: number | null = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    const params = new URLSearchParams({ limit: String(PAGE_LIMIT) });
    if (teamId) params.set("teamId", teamId);
    if (until !== null) params.set("until", String(until));
    const raw = await providerJson({ provider: PROVIDER, url: `${BASE}/v10/projects?${params}`, headers: { Authorization: `Bearer ${token}` } });
    const parsed = parseProjectsPage(raw);
    projects.push(...parsed.projects);
    if (parsed.next === null) return { projects };
    until = parsed.next;
  }
  throw new IntegrationError("malformed", "Vercel pagination did not terminate.");
}

export async function getVercelIntegration(env: Record<string, string | undefined> = process.env): Promise<IntegrationResult<VercelSnapshot>> {
  const token = env.VERCEL_TOKEN?.trim();
  if (!token) return { state: "unconfigured", source: VERCEL_SOURCE, missing: ["VERCEL_TOKEN"] };
  const teamId = env.VERCEL_TEAM_ID?.trim() || undefined;
  return cachedFetch({
    key: `vercel:${teamId ?? "personal"}`,
    source: VERCEL_SOURCE,
    ttlMs: TTL_MS,
    load: () => fetchVercelSnapshot(token, teamId),
    isEmpty: (s) => s.projects.length === 0,
  });
}

/** Declared URL (registry claim) compared with what Vercel reports. */
export type UrlCheck = "matches" | "differs" | "not-declared" | "no-production";

export interface VercelJoinRow {
  target: VercelTarget;
  /** null = the registry names a Vercel project that the account did not return. */
  project: VercelProjectSnapshot | null;
  urlCheck: UrlCheck;
}

/** Joins registry-declared Vercel projects with provider data. Pure. */
export function joinWithRegistry(snapshot: VercelSnapshot, targets: VercelTarget[] = getVercelTargets()) {
  const byName = new Map(snapshot.projects.map((p) => [p.name, p]));
  const rows: VercelJoinRow[] = targets.map((target) => {
    const project = byName.get(target.vercelProject) ?? null;
    let urlCheck: UrlCheck = "no-production";
    if (project?.production?.host) {
      const declaredHost = target.declaredUrl ? hostOf(target.declaredUrl) : null;
      urlCheck = !declaredHost ? "not-declared" : declaredHost === project.production.host ? "matches" : "differs";
    }
    return { target, project, urlCheck };
  });
  const registered = new Set(targets.map((t) => t.vercelProject));
  return { rows, unregistered: snapshot.projects.filter((p) => !registered.has(p.name)) };
}
