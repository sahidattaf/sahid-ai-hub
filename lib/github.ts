export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  location: string | null;
  blog: string | null;
  company: string | null;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
  private: boolean;
  topics: string[];
}

export type RepoStatus = "Live" | "Active" | "Archive" | "Repo";

export interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
}

export interface AggregateStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalIssues: number;
  topLanguages: LanguageStat[];
}

const GITHUB_BASE = "https://api.github.com";

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchProfile(username: string): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_BASE}/users/${username}`, {
    headers: getHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status} for user profile`);
  }
  return res.json() as Promise<GitHubUser>;
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_BASE}/users/${username}/repos?sort=pushed&per_page=100&type=public`,
    {
      headers: getHeaders(),
      next: { revalidate: 300 },
    }
  );
  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status} for repositories`);
  }
  return res.json() as Promise<GitHubRepo[]>;
}

export function getRepoStatus(repo: GitHubRepo): RepoStatus {
  if (repo.archived) return "Archive";
  if (repo.homepage && repo.homepage.trim().length > 0) return "Live";
  const pushed = new Date(repo.pushed_at || repo.updated_at);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  if (pushed > cutoff) return "Active";
  return "Repo";
}

export function getLanguageStats(repos: GitHubRepo[]): LanguageStat[] {
  const counts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language && !repo.fork && !repo.archived) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    }
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
}

export function getAggregateStats(repos: GitHubRepo[]): AggregateStats {
  const original = repos.filter((r) => !r.fork);
  return {
    totalRepos: repos.length,
    totalStars: original.reduce((s, r) => s + r.stargazers_count, 0),
    totalForks: original.reduce((s, r) => s + r.forks_count, 0),
    totalIssues: original.reduce((s, r) => s + r.open_issues_count, 0),
    topLanguages: getLanguageStats(repos).slice(0, 6),
  };
}

export function normalizeBlogUrl(blog: string | null): string | null {
  if (!blog || blog.trim() === "") return null;
  return blog.startsWith("http") ? blog : `https://${blog}`;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
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
