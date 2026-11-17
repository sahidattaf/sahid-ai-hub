import "server-only";
import { unstable_cache } from "next/cache";
import { getPublicProjectById, getPublicProjects, type PublicProject } from "@/data/public-projects";

/**
 * Project data for the public homepage.
 *
 * Server-only: reads NOTION_TOKEN / NOTION_DATABASE_ID, so never import the
 * functions below from a client component (importing the *types* is fine).
 *
 * PUBLIC-DATA BOUNDARY
 * This repository is public and the site is public. The Notion registry also
 * holds internal fields and non-public / client projects. The single source of
 * truth for WHAT may be shown is the committed allowlist
 * (data/public-projects.json, read through getPublicProjects()).
 *   1. Notion is queried only for the properties in PROP (Slug and Status).
 *   2. A Notion row is used only when its Slug matches an allowlisted project.
 *      Any other row is dropped, whatever it contains.
 *   3. Every displayed field (name, description, zone, links, stack, tags) comes
 *      from the allowlist. Notion can only change the Status, and only to a
 *      known value.
 * The static fallback is the allowlist itself, so Notion being down can never
 * show more (or different) data than Notion being up.
 */

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
  techStack: string[];
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const NOTION_API = "https://api.notion.com/v1";
/** Pinned: databases/{id}/query is stable on this version. */
const NOTION_VERSION = "2022-06-28";
const REVALIDATE_SECONDS = 300;
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_PAGES = 10; // safety cap: 10 x 100 rows
const MAX_ATTEMPTS = 3;

/** Tag for on-demand refresh: revalidateTag("projects") from a route/action. */
export const PROJECTS_CACHE_TAG = "projects";

const STATUSES: readonly Status[] = ["Live", "Repo", "Prototype", "Planning"];

/** Notion property names we read. Anything not listed here is never touched. */
const PROP = {
  slug: "Slug",
  status: "Status",
} as const;

// ---------------------------------------------------------------------------
// Allowlist -> Project (the only way a Project is ever built)
// ---------------------------------------------------------------------------

/** Maps an allowlisted project to the card shape. `status` may be overridden. */
export function fromPublicProject(pub: PublicProject, status: Status = pub.status): Project {
  return {
    title: pub.name,
    description: pub.description,
    live: pub.websiteUrl,
    repo: pub.githubUrl,
    tags: pub.tags,
    status,
    visibility: "Public",
    category: pub.category,
    zone: pub.zone,
    techStack: pub.stack,
  };
}

const STATUS_ORDER: Record<Status, number> = { Live: 0, Repo: 1, Prototype: 2, Planning: 3 };

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.title.localeCompare(b.title));
}

/** Static fallback: exactly the allowlist, nothing else. */
export function getFallbackProjects(): Project[] {
  return sortProjects(getPublicProjects().map((p) => fromPublicProject(p)));
}

// ---------------------------------------------------------------------------
// Errors & environment
// ---------------------------------------------------------------------------

export class NotionRegistryError extends Error {
  constructor(
    message: string,
    readonly kind: "config" | "http" | "network" | "shape",
    readonly status?: number,
  ) {
    super(message);
    this.name = "NotionRegistryError";
  }
}

interface NotionEnv {
  token: string;
  databaseId: string;
}

function readEnv(): NotionEnv {
  const token = process.env.NOTION_TOKEN?.trim();
  const rawId = process.env.NOTION_DATABASE_ID?.trim();
  if (!token || !rawId) {
    const missing = [!token && "NOTION_TOKEN", !rawId && "NOTION_DATABASE_ID"].filter(Boolean).join(", ");
    throw new NotionRegistryError(`Missing environment variable(s): ${missing}`, "config");
  }
  // Accept a bare id, a dashed UUID, or a pasted Notion database URL.
  const match = rawId.replace(/-/g, "").match(/[0-9a-f]{32}/i);
  if (!match) {
    throw new NotionRegistryError("NOTION_DATABASE_ID is not a valid Notion id", "config");
  }
  return { token, databaseId: match[0] };
}

// ---------------------------------------------------------------------------
// Notion response parsing (runtime-validated; no unchecked casts)
// ---------------------------------------------------------------------------

type Json = Record<string, unknown>;
export const isObj = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);

export function richText(prop: unknown): string {
  if (!isObj(prop)) return "";
  const parts = Array.isArray(prop.title) ? prop.title : Array.isArray(prop.rich_text) ? prop.rich_text : [];
  return parts
    .map((p) => (isObj(p) && typeof p.plain_text === "string" ? p.plain_text : ""))
    .join("")
    .trim();
}

export function selectName(prop: unknown): string {
  return isObj(prop) && isObj(prop.select) && typeof prop.select.name === "string" ? prop.select.name : "";
}

export interface RegistryRow {
  slug: string;
  status: Status;
}

export function parseRow(page: unknown): RegistryRow | null {
  if (!isObj(page) || !isObj(page.properties) || page.archived === true) return null;
  const p = page.properties;
  const slug = richText(p[PROP.slug]);
  const status = selectName(p[PROP.status]);
  // Incomplete rows (e.g. a draft with no Slug/Status) are skipped, not fatal.
  if (!slug || !STATUSES.includes(status as Status)) return null;
  return { slug, status: status as Status };
}

// ---------------------------------------------------------------------------
// HTTP with timeout + retry
// ---------------------------------------------------------------------------

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function notionQuery(env: NotionEnv, cursor?: string, slug?: string): Promise<Json> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${NOTION_API}/databases/${env.databaseId}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.token}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
          filter: { property: PROP.slug, rich_text: slug ? { equals: slug } : { is_not_empty: true } },
        }),
        // Caching is handled once, around the whole fetch (see loadFromNotion),
        // so a partial/failed run is never persisted page-by-page.
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (res.ok) {
        const json: unknown = await res.json();
        if (!isObj(json) || !Array.isArray(json.results)) {
          throw new NotionRegistryError("Unexpected Notion response shape", "shape");
        }
        return json;
      }

      const retriable = res.status === 429 || res.status >= 500;
      const err = new NotionRegistryError(`Notion responded ${res.status}`, "http", res.status);
      if (!retriable) throw err; // 401/403/404: retrying cannot help
      lastError = err;
      const retryAfter = Number(res.headers.get("retry-after"));
      await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 5) * 1000 : 400 * 2 ** (attempt - 1));
    } catch (e) {
      if (e instanceof NotionRegistryError && e.kind !== "network") throw e;
      lastError = e instanceof NotionRegistryError ? e : new NotionRegistryError("Network error or timeout reaching Notion", "network");
      if (attempt < MAX_ATTEMPTS) await sleep(400 * 2 ** (attempt - 1));
    }
  }
  throw lastError;
}

export async function readRegistryRows<T>(parse: (page: unknown) => T | null, slug?: string): Promise<T[]> {
  const env = readEnv();
  const rows: T[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const json = await notionQuery(env, cursor, slug);
    for (const raw of json.results as unknown[]) {
      const row = parse(raw);
      if (row !== null) rows.push(row);
    }
    if (json.has_more !== true) return rows;
    if (typeof json.next_cursor !== "string" || !json.next_cursor || json.next_cursor === cursor) {
      throw new NotionRegistryError("Missing or invalid Notion page cursor", "shape");
    }
    cursor = json.next_cursor;
  }
  throw new NotionRegistryError(`Registry exceeds ${MAX_PAGES * 100} rows`, "shape");
}

// ---------------------------------------------------------------------------
// Mapping: Notion rows -> public Projects (allowlist join)
// ---------------------------------------------------------------------------

/**
 * Selects projects by allowlist. A row whose Slug is not on the allowlist is
 * dropped. For a matching row only the Status is taken from Notion. Allowlisted
 * projects that have no (valid) Notion row keep their allowlist status, so the
 * Notion result is never smaller than what the allowlist already permits.
 */
export function buildProjects(rows: RegistryRow[]): Project[] {
  const statusBySlug = new Map<string, Status>();
  for (const row of rows) {
    if (getPublicProjectById(row.slug)) statusBySlug.set(row.slug, row.status);
  }
  if (statusBySlug.size === 0) return [];
  return sortProjects(getPublicProjects().map((pub) => fromPublicProject(pub, statusBySlug.get(pub.id) ?? pub.status)));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Cached for REVALIDATE_SECONDS. unstable_cache only stores *successful*
 * results: a thrown error is not cached, and Next keeps serving the previous
 * entry while it revalidates in the background (stale-while-revalidate).
 */
const loadFromNotion = unstable_cache(
  async (): Promise<Project[]> => {
    const projects = buildProjects(await readRegistryRows(parseRow));
    // An empty result almost always means a mis-shared integration or a wrong
    // database id, not "no projects"; refuse to cache it.
    if (projects.length === 0) {
      throw new NotionRegistryError("Notion returned no publishable projects", "shape");
    }
    return projects;
  },
  ["notion-project-registry", NOTION_VERSION],
  { revalidate: REVALIDATE_SECONDS, tags: [PROJECTS_CACHE_TAG] },
);

export interface ProjectsResult {
  projects: Project[];
  source: "notion" | "fallback";
}

/** Never throws. Use this when you need to know where the data came from. */
export async function getProjectsWithSource(): Promise<ProjectsResult> {
  try {
    return { projects: await loadFromNotion(), source: "notion" };
  } catch (e) {
    // Log the failure class only; never the token, database id or response body.
    const detail = e instanceof NotionRegistryError ? `${e.kind}${e.status ? ` ${e.status}` : ""}: ${e.message}` : "unexpected error";
    console.error(`[projects] Notion registry unavailable, using fallback snapshot (${detail})`);
    return { projects: getFallbackProjects(), source: "fallback" };
  }
}

/** All publishable projects (Notion statuses over the allowlist; allowlist on failure). */
export async function getProjects(): Promise<Project[]> {
  return (await getProjectsWithSource()).projects;
}
