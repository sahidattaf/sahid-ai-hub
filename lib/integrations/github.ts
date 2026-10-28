import "server-only";
import { getGithubTargets, type GithubTarget } from "@/data/project-registry";
import { cachedFetch } from "./cache";
import { isRecord, malformed, providerJson } from "./http";
import { IntegrationError, type FailureKind, type IntegrationResult } from "./types";

const PROVIDER = "GitHub";
export const GITHUB_SOURCE = "GitHub REST API (api.github.com)";
const BASE = "https://api.github.com";
const TTL_MS = 5 * 60_000;

export type GithubCommit =
  | { state: "ok"; date: string; message: string }
  | { state: "none" }
  | { state: "unavailable"; kind: FailureKind };

export interface GithubRepoDetails {
  fullName: string;
  isPrivate: boolean;
  archived: boolean;
  defaultBranch: string;
  language: string | null;
  stars: number;
  forks: number;
  /** GitHub's count includes open pull requests. */
  openIssuesAndPrs: number;
  pushedAt: string | null;
  lastCommit: GithubCommit;
}

export type GithubRepoResult =
  | { target: GithubTarget; state: "ok"; repo: GithubRepoDetails }
  | { target: GithubTarget; state: "error"; kind: FailureKind; message: string; retryAfterSeconds?: number };

export interface GithubSnapshot {
  repos: GithubRepoResult[];
}

function headers(token: string): Record<string, string> {
  return { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", Authorization: `Bearer ${token}` };
}

function num(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value)) throw malformed(PROVIDER, key);
  return value;
}

export function parseRepo(raw: unknown): Omit<GithubRepoDetails, "lastCommit"> {
  if (!isRecord(raw) || typeof raw.full_name !== "string" || typeof raw.default_branch !== "string") throw malformed(PROVIDER, "repository fields");
  if (typeof raw.private !== "boolean" || typeof raw.archived !== "boolean") throw malformed(PROVIDER, "visibility fields");
  return {
    fullName: raw.full_name,
    isPrivate: raw.private,
    archived: raw.archived,
    defaultBranch: raw.default_branch,
    language: typeof raw.language === "string" ? raw.language : null,
    stars: num(raw, "stargazers_count"),
    forks: num(raw, "forks_count"),
    openIssuesAndPrs: num(raw, "open_issues_count"),
    pushedAt: typeof raw.pushed_at === "string" ? raw.pushed_at : null,
  };
}

export function parseLatestCommit(raw: unknown): GithubCommit {
  if (!Array.isArray(raw)) throw malformed(PROVIDER, "commit list");
  if (raw.length === 0) return { state: "none" };
  const commit = isRecord(raw[0]) && isRecord(raw[0].commit) ? raw[0].commit : null;
  const author = commit && isRecord(commit.author) ? commit.author : null;
  if (!commit || typeof commit.message !== "string" || !author || typeof author.date !== "string") throw malformed(PROVIDER, "commit fields");
  return { state: "ok", date: author.date, message: commit.message.split("\n")[0].slice(0, 200) };
}

async function loadRepo(target: GithubTarget, token: string): Promise<GithubRepoResult> {
  const path = `${BASE}/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}`;
  try {
    const repo = parseRepo(await providerJson({ provider: PROVIDER, url: path, headers: headers(token) }));
    let lastCommit: GithubCommit;
    try {
      lastCommit = parseLatestCommit(await providerJson({ provider: PROVIDER, url: `${path}/commits?per_page=1`, headers: headers(token) }));
    } catch (error) {
      // HTTP 409 = empty repository (no commits), which is a valid state.
      lastCommit = error instanceof IntegrationError && error.message.endsWith("HTTP 409.") ? { state: "none" } : { state: "unavailable", kind: error instanceof IntegrationError ? error.kind : "provider_error" };
    }
    return { target, state: "ok", repo: { ...repo, lastCommit } };
  } catch (error) {
    const known = error instanceof IntegrationError;
    return { target, state: "error", kind: known ? error.kind : "provider_error", message: known ? error.message : "GitHub request failed.", retryAfterSeconds: known ? error.retryAfterSeconds : undefined };
  }
}

/** Fetches every registry repository. Throws only when NO repository could be read. */
export async function fetchGithubSnapshot(token: string, targets: GithubTarget[]): Promise<GithubSnapshot> {
  const repos = await Promise.all(targets.map((t) => loadRepo(t, token)));
  const firstError = repos.find((r): r is Extract<GithubRepoResult, { state: "error" }> => r.state === "error");
  if (repos.length > 0 && firstError && repos.every((r) => r.state === "error")) throw new IntegrationError(firstError.kind, firstError.message, firstError.retryAfterSeconds);
  return { repos };
}

export async function getGithubIntegration(
  env: Record<string, string | undefined> = process.env,
  targets: GithubTarget[] = getGithubTargets(),
): Promise<IntegrationResult<GithubSnapshot>> {
  const token = env.GITHUB_TOKEN?.trim();
  if (!token) return { state: "unconfigured", source: GITHUB_SOURCE, missing: ["GITHUB_TOKEN"] };
  return cachedFetch({
    key: "github",
    source: GITHUB_SOURCE,
    ttlMs: TTL_MS,
    load: () => fetchGithubSnapshot(token, targets),
    isEmpty: (s) => s.repos.length === 0,
  });
}
