// Low-level GitHub REST client. No business logic — only typed fetches.
// Gated entirely on GITHUB_TOKEN: callers should check hasGithubToken()
// before invoking any fetch* function here.

import type {
  GithubRepoApiResponse,
  GithubCommitApiResponse,
  GithubPullRequestApiResponse,
  GithubIssueApiResponse,
  GithubContributorApiResponse,
  GithubLanguagesApiResponse,
} from "@/types/github";

const GITHUB_BASE = "https://api.github.com";

export class GithubNotFoundError extends Error {
  constructor(repoSlug: string) {
    super(`GitHub repository not found: ${repoSlug}`);
    this.name = "GithubNotFoundError";
  }
}

export class GithubRateLimitError extends Error {
  constructor() {
    super("GitHub API rate limit exceeded");
    this.name = "GithubRateLimitError";
  }
}

export function hasGithubToken(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function githubFetch<T>(
  path: string,
  repoSlug: string,
  revalidate: number,
): Promise<T> {
  const res = await fetch(`${GITHUB_BASE}${path}`, {
    headers: buildHeaders(),
    next: { revalidate },
  });

  if (res.status === 404) throw new GithubNotFoundError(repoSlug);
  if (res.status === 403 || res.status === 429) throw new GithubRateLimitError();
  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status} for ${path}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchRepoApi(
  owner: string,
  repo: string,
): Promise<GithubRepoApiResponse> {
  return githubFetch<GithubRepoApiResponse>(
    `/repos/${owner}/${repo}`,
    `${owner}/${repo}`,
    300,
  );
}

export async function fetchCommitsApi(
  owner: string,
  repo: string,
  perPage = 30,
): Promise<GithubCommitApiResponse[]> {
  return githubFetch<GithubCommitApiResponse[]>(
    `/repos/${owner}/${repo}/commits?per_page=${perPage}`,
    `${owner}/${repo}`,
    300,
  );
}

export async function fetchPullRequestsApi(
  owner: string,
  repo: string,
): Promise<GithubPullRequestApiResponse[]> {
  return githubFetch<GithubPullRequestApiResponse[]>(
    `/repos/${owner}/${repo}/pulls?state=open&per_page=100`,
    `${owner}/${repo}`,
    300,
  );
}

export async function fetchIssuesApi(
  owner: string,
  repo: string,
): Promise<GithubIssueApiResponse[]> {
  return githubFetch<GithubIssueApiResponse[]>(
    `/repos/${owner}/${repo}/issues?state=open&per_page=100`,
    `${owner}/${repo}`,
    300,
  );
}

export async function fetchContributorsApi(
  owner: string,
  repo: string,
): Promise<GithubContributorApiResponse[]> {
  return githubFetch<GithubContributorApiResponse[]>(
    `/repos/${owner}/${repo}/contributors?per_page=5`,
    `${owner}/${repo}`,
    3600,
  );
}

export async function fetchLanguagesApi(
  owner: string,
  repo: string,
): Promise<GithubLanguagesApiResponse> {
  return githubFetch<GithubLanguagesApiResponse>(
    `/repos/${owner}/${repo}/languages`,
    `${owner}/${repo}`,
    3600,
  );
}

export function parseRepoSlug(
  githubUrl: string,
): { owner: string; repo: string } | null {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)\/?$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}
