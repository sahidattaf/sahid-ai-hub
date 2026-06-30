// GitHub Executive Intelligence layer.
// Orchestrates the registry (data/github-repositories.ts) with the live
// GitHub API (lib/github-api.ts) into one unified `Repository` shape.
// When GITHUB_TOKEN is absent, or a live fetch fails for an individual repo,
// callers transparently fall back to registry-derived data — the UI never
// has to know which source a given repository came from.

import {
  hasGithubToken,
  fetchRepoApi,
  fetchCommitsApi,
  fetchPullRequestsApi,
  fetchIssuesApi,
  fetchContributorsApi,
  fetchLanguagesApi,
  GithubNotFoundError,
} from "@/lib/github-api";
import { GITHUB_REPOSITORIES, type GithubRepositoryEntry } from "@/data/github-repositories";
import type {
  Repository,
  RepositoryStatus,
  RepositoryLanguageBreakdown,
  RepositoryActivityPoint,
  HealthScoreInput,
  HealthScoreResult,
  HealthLabel,
  DeploymentState,
  ExecutiveSummary,
  GithubCommitApiResponse,
} from "@/types/github";

export type { Repository } from "@/types/github";

// --- Time helpers ---

export function daysSince(dateString: string): number {
  const diff = Date.now() - new Date(dateString).getTime();
  return Math.floor(diff / 86_400_000);
}

export function timeAgo(dateString: string): string {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f0db4f",
  Python: "#4b8bbe",
  HTML: "#e34f26",
  CSS: "#7952b3",
  Shell: "#4eaa25",
  Go: "#00add8",
  Rust: "#ce422b",
  Java: "#b07219",
  "C#": "#178600",
  PHP: "#4f5d95",
  Ruby: "#cc342d",
  Swift: "#f05138",
  Kotlin: "#7f52ff",
  Vue: "#4fc08d",
  Astro: "#ff5a03",
  MDX: "#1b1f24",
};

export function languageColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? "#64748b";
}

// --- Health scoring ---

function scoreToLabel(score: number): HealthLabel {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

function labelColor(label: HealthLabel): string {
  const map: Record<HealthLabel, string> = {
    Excellent: "var(--cyan)",
    Good: "var(--cyan-dim)",
    "Needs Attention": "var(--gold)",
    Critical: "#ef4444",
  };
  return map[label];
}

export function computeHealthScore(input: HealthScoreInput): HealthScoreResult {
  let score = 100;
  const reasons: string[] = [];

  if (!input.reachable) {
    score -= 40;
    reasons.push(
      input.notConnected
        ? "No GitHub repository connected yet — add a repo URL to the registry"
        : "Repository could not be found on GitHub — verify the URL",
    );
  }

  if (input.archived) {
    score -= 50;
    reasons.push("Repository is archived");
  }

  if (input.reachable && !input.archived) {
    if (input.lastCommitDate === null) {
      score -= 10;
      reasons.push("No commit history available yet");
    } else {
      const days = daysSince(input.lastCommitDate);
      if (days > 90) {
        score -= 30;
        reasons.push("No commits in over 90 days — schedule a maintenance pass");
      } else if (days > 30) {
        score -= 20;
        reasons.push("No commits in over 30 days — review project status");
      } else if (days > 7) {
        score -= 10;
        reasons.push("No commits in the last 7 days");
      }
    }

    if (input.deploymentState === "ERROR") {
      score -= 20;
      reasons.push("Latest deployment failed — investigate build logs");
    } else if (input.deploymentState === "NOT_CONNECTED") {
      score -= 10;
      reasons.push("No deployment target connected");
    } else if (input.deploymentState === "UNKNOWN") {
      score -= 5;
      reasons.push("Deployment status not yet tracked live");
    } else if (input.deploymentState !== "READY") {
      score -= 5;
      reasons.push("Deployment is in a transient state");
    }

    if (input.openIssues > 20) {
      score -= 15;
      reasons.push("High open issue volume — triage the backlog");
    } else if (input.openIssues > 10) {
      score -= 8;
      reasons.push("Growing open issue backlog");
    }

    if (!input.defaultBranchHealthy) {
      score -= 15;
      reasons.push("Default branch needs review");
    }
  }

  score = Math.max(0, Math.min(100, score));
  const label = scoreToLabel(score);

  return {
    score,
    label,
    color: labelColor(label),
    nextAction: reasons[0] ?? "No action needed — repository is healthy",
  };
}

// --- Status ---

export function getRepositoryStatus(repo: Repository): RepositoryStatus {
  if (!repo.reachable) return "Not Connected";
  if (repo.archived) return "Archived";
  if (repo.deploymentState === "READY" && repo.websiteUrl) return "Live";
  if (repo.lastCommitDate && daysSince(repo.lastCommitDate) <= 30) return "Active";
  return "Planning";
}

// --- Building a Repository from registry data only (no network) ---

function buildRegistryRepository(entry: GithubRepositoryEntry): Repository {
  const reachable = Boolean(entry.githubUrl);
  const deploymentState: DeploymentState = entry.vercelProject ? "UNKNOWN" : "NOT_CONNECTED";

  const health = computeHealthScore({
    reachable,
    notConnected: !entry.githubUrl,
    archived: false,
    lastCommitDate: null,
    deploymentState,
    openIssues: 0,
    defaultBranchHealthy: true,
  });

  return {
    id: entry.id,
    name: entry.name,
    description: entry.description,
    owner: entry.owner,
    repoSlug: entry.repo ? `${entry.owner}/${entry.repo}` : null,
    githubUrl: entry.githubUrl,
    websiteUrl: entry.websiteUrl,
    visibility: entry.visibility,
    defaultBranch: entry.defaultBranch,
    language: entry.language,
    languages: entry.language ? [{ name: entry.language, bytes: 0, percentage: 100 }] : [],
    lastCommitMessage: null,
    lastCommitDate: null,
    lastUpdated: null,
    stars: 0,
    forks: 0,
    watchers: 0,
    openIssues: 0,
    openPullRequests: 0,
    contributors: [],
    activity: [],
    deploymentState,
    vercelProject: entry.vercelProject,
    source: "registry",
    reachable,
    archived: false,
    health,
  };
}

// --- Bucketing commit activity into a 7-day sparkline ---

function bucketActivity(commits: GithubCommitApiResponse[]): RepositoryActivityPoint[] {
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const buckets = new Map<string, number>();
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.set(d.toDateString(), 0);
  }

  for (const commit of commits) {
    const dateStr = commit.commit.author?.date;
    if (!dateStr) continue;
    const key = new Date(dateStr).toDateString();
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([dateStr, count]) => ({
    label: DAY_LABELS[new Date(dateStr).getDay()],
    count,
  }));
}

function languagesFromBytes(bytes: Record<string, number>): RepositoryLanguageBreakdown[] {
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);
  return Object.entries(bytes)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({
      name,
      bytes: value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
}

// --- Enriching a registry repository with live API data ---

async function buildLiveRepository(
  entry: GithubRepositoryEntry,
  base: Repository,
): Promise<Repository> {
  if (!entry.repo) return base;

  try {
    const [repoData, commits, pulls, issues, contributors, languageBytes] = await Promise.all([
      fetchRepoApi(entry.owner, entry.repo),
      fetchCommitsApi(entry.owner, entry.repo).catch(() => [] as GithubCommitApiResponse[]),
      fetchPullRequestsApi(entry.owner, entry.repo).catch(() => []),
      fetchIssuesApi(entry.owner, entry.repo).catch(() => []),
      fetchContributorsApi(entry.owner, entry.repo).catch(() => []),
      fetchLanguagesApi(entry.owner, entry.repo).catch(() => ({})),
    ]);

    const latestCommit = commits[0] ?? null;
    const realIssues = issues.filter((i) => !i.pull_request);
    const deploymentState: DeploymentState = entry.vercelProject ? "UNKNOWN" : "NOT_CONNECTED";

    const health = computeHealthScore({
      reachable: true,
      notConnected: false,
      archived: repoData.archived,
      lastCommitDate: latestCommit?.commit.author?.date ?? null,
      deploymentState,
      openIssues: realIssues.length,
      defaultBranchHealthy: !repoData.archived,
    });

    return {
      ...base,
      description: repoData.description ?? base.description,
      websiteUrl: repoData.homepage || base.websiteUrl,
      visibility: repoData.private ? "Private" : "Public",
      defaultBranch: repoData.default_branch,
      language: repoData.language ?? base.language,
      languages: languagesFromBytes(languageBytes),
      lastCommitMessage: latestCommit?.commit.message.split("\n")[0] ?? null,
      lastCommitDate: latestCommit?.commit.author?.date ?? null,
      lastUpdated: repoData.pushed_at || repoData.updated_at,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      watchers: repoData.subscribers_count,
      openIssues: realIssues.length,
      openPullRequests: pulls.length,
      contributors: contributors.map((c) => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        contributions: c.contributions,
        htmlUrl: c.html_url,
      })),
      activity: bucketActivity(commits),
      deploymentState,
      source: "live",
      reachable: true,
      archived: repoData.archived,
      health,
    };
  } catch (err) {
    if (err instanceof GithubNotFoundError) {
      const health = computeHealthScore({
        reachable: false,
        notConnected: false,
        archived: false,
        lastCommitDate: null,
        deploymentState: base.deploymentState,
        openIssues: 0,
        defaultBranchHealthy: true,
      });
      return { ...base, reachable: false, health };
    }
    // Rate limit, offline, or any other transient failure: keep registry fallback.
    return base;
  }
}

export interface LoadRepositoriesResult {
  repositories: Repository[];
  mode: "live" | "registry";
}

export async function loadRepositories(): Promise<LoadRepositoriesResult> {
  const live = hasGithubToken();

  const repositories = await Promise.all(
    GITHUB_REPOSITORIES.map(async (entry) => {
      const base = buildRegistryRepository(entry);
      if (!live) return base;
      return buildLiveRepository(entry, base);
    }),
  );

  return { repositories, mode: live ? "live" : "registry" };
}

// --- Executive summary aggregation ---

export function getExecutiveSummary(repos: Repository[]): ExecutiveSummary {
  const healthy = repos.filter(
    (r) => r.health.label === "Excellent" || r.health.label === "Good",
  ).length;

  const lastCommitAt = repos.reduce<string | null>((latest, r) => {
    if (!r.lastCommitDate) return latest;
    if (!latest) return r.lastCommitDate;
    return r.lastCommitDate > latest ? r.lastCommitDate : latest;
  }, null);

  return {
    total: repos.length,
    healthy,
    needsAttention: repos.length - healthy,
    lastCommitAt,
    deploymentsReady: repos.filter((r) => r.deploymentState === "READY").length,
    openPullRequests: repos.reduce((sum, r) => sum + r.openPullRequests, 0),
    openIssues: repos.reduce((sum, r) => sum + r.openIssues, 0),
  };
}
