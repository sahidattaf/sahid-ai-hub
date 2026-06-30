// Domain types for the GitHub Executive Intelligence layer.
// `Repository` is the single unified shape every component renders from,
// regardless of whether its data came from the live API or the local registry.

export type RepoVisibility = "Public" | "Private";

export type DeploymentState =
  | "READY"
  | "BUILDING"
  | "ERROR"
  | "QUEUED"
  | "INITIALIZING"
  | "CANCELED"
  | "UNKNOWN"
  | "NOT_CONNECTED";

export type HealthLabel = "Excellent" | "Good" | "Needs Attention" | "Critical";

export type RepositoryStatus =
  | "Live"
  | "Active"
  | "Planning"
  | "Archived"
  | "Not Connected";

export type RepositorySource = "live" | "registry";

export interface HealthScoreInput {
  reachable: boolean;
  notConnected: boolean;
  archived: boolean;
  lastCommitDate: string | null;
  deploymentState: DeploymentState;
  openIssues: number;
  defaultBranchHealthy: boolean;
}

export interface HealthScoreResult {
  score: number;
  label: HealthLabel;
  color: string;
  nextAction: string;
}

export interface RepositoryLanguageBreakdown {
  name: string;
  bytes: number;
  percentage: number;
}

export interface RepositoryContributor {
  login: string;
  avatarUrl: string;
  contributions: number;
  htmlUrl: string;
}

export interface RepositoryActivityPoint {
  label: string;
  count: number;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  owner: string;
  repoSlug: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  visibility: RepoVisibility;
  defaultBranch: string;
  language: string | null;
  languages: RepositoryLanguageBreakdown[];
  lastCommitMessage: string | null;
  lastCommitDate: string | null;
  lastUpdated: string | null;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  openPullRequests: number;
  contributors: RepositoryContributor[];
  activity: RepositoryActivityPoint[];
  deploymentState: DeploymentState;
  vercelProject: string | null;
  source: RepositorySource;
  reachable: boolean;
  archived: boolean;
  health: HealthScoreResult;
}

export interface ExecutiveSummary {
  total: number;
  healthy: number;
  needsAttention: number;
  lastCommitAt: string | null;
  deploymentsReady: number;
  openPullRequests: number;
  openIssues: number;
}

// --- Raw GitHub REST API response shapes ---

export interface GithubRepoApiResponse {
  description: string | null;
  homepage: string | null;
  html_url: string;
  language: string | null;
  default_branch: string;
  private: boolean;
  archived: boolean;
  stargazers_count: number;
  forks_count: number;
  subscribers_count: number;
  updated_at: string;
  pushed_at: string;
}

export interface GithubCommitApiResponse {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; date: string } | null;
  };
}

export interface GithubPullRequestApiResponse {
  number: number;
  state: string;
}

export interface GithubIssueApiResponse {
  number: number;
  state: string;
  pull_request?: unknown;
}

export interface GithubContributorApiResponse {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export type GithubLanguagesApiResponse = Record<string, number>;
