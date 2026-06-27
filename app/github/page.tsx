import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import GitHubProfile from "@/components/github/github-profile";
import RepoCard from "@/components/github/repo-card";
import LanguageChart from "@/components/github/language-chart";
import {
  fetchProfile,
  fetchRepos,
  getAggregateStats,
  getLanguageStats,
  type GitHubUser,
  type GitHubRepo,
  type AggregateStats,
  type LanguageStat,
} from "@/lib/github";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GitHub",
  description:
    "Live GitHub dashboard for sahidattaf — profile, repositories, languages, and activity pulled directly from the GitHub REST API.",
};

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "sahidattaf";

interface GitHubData {
  profile: GitHubUser;
  repos: GitHubRepo[];
  stats: AggregateStats;
  languages: LanguageStat[];
  sorted: GitHubRepo[];
}

async function loadGitHubData(): Promise<GitHubData | null> {
  try {
    const [profile, repos] = await Promise.all([
      fetchProfile(GITHUB_USERNAME),
      fetchRepos(GITHUB_USERNAME),
    ]);
    const stats = getAggregateStats(repos);
    const languages = getLanguageStats(repos);
    const sorted = [...repos].sort((a, b) => {
      if (a.archived !== b.archived) return a.archived ? 1 : -1;
      return (
        new Date(b.pushed_at || b.updated_at).getTime() -
        new Date(a.pushed_at || a.updated_at).getTime()
      );
    });
    return { profile, repos, stats, languages, sorted };
  } catch {
    return null;
  }
}

export default async function GitHubPage() {
  const data = await loadGitHubData();

  if (!data) {
    return <GitHubUnavailable />;
  }

  const { profile, stats, languages, sorted } = data;

  return (
    <>
      <PageHeader
        breadcrumb="GitHub"
        label="Live Dashboard"
        title="GitHub"
        description={`Live data for @${GITHUB_USERNAME} — pulled directly from the GitHub REST API. Refreshes every 5 minutes.`}
      />
      <main className="py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <GitHubProfile profile={profile} />

          <AggregateStatsBar stats={stats} />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p
                className="text-xs font-mono uppercase tracking-widest mb-5"
                style={{
                  color: "var(--text-subtle)",
                  letterSpacing: "0.15em",
                }}
              >
                {sorted.length} public repositor{sorted.length !== 1 ? "ies" : "y"}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {sorted.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <LanguageChart languages={languages} />
              <StatusLegend />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function AggregateStatsBar({ stats }: { stats: AggregateStats }) {
  const items = [
    { label: "Public Repos", value: stats.totalRepos },
    { label: "Total Stars", value: stats.totalStars },
    { label: "Total Forks", value: stats.totalForks },
    { label: "Open Issues", value: stats.totalIssues },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-lg border p-5 stat-border"
          style={{
            backgroundColor: "var(--navy-card)",
            borderColor: "var(--navy-border)",
          }}
        >
          <p
            className="text-2xl font-bold font-mono mb-1"
            style={{ color: "var(--cyan)" }}
          >
            {value}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

function StatusLegend() {
  const items = [
    { label: "Live", cls: "badge-live", description: "Has a homepage URL" },
    {
      label: "Active",
      cls: "badge-prototype",
      description: "Pushed within 30 days",
    },
    {
      label: "Repo",
      cls: "badge-planning",
      description: "Public, not recently active",
    },
    { label: "Archive", cls: "badge-repo", description: "Archived by owner" },
  ] as const;

  return (
    <div
      className="rounded-lg border p-5"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "var(--navy-border)",
      }}
    >
      <p
        className="text-xs font-mono uppercase tracking-widest mb-4"
        style={{ color: "var(--text-subtle)", letterSpacing: "0.15em" }}
      >
        Status Key
      </p>
      <div className="space-y-3">
        {items.map(({ label, cls, description }) => (
          <div key={label} className="flex items-start gap-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-mono flex-shrink-0 ${cls}`}
            >
              {label}
            </span>
            <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
              {description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GitHubUnavailable() {
  return (
    <>
      <PageHeader
        breadcrumb="GitHub"
        label="Live Dashboard"
        title="GitHub"
        description="Live repository and profile data for sahidattaf."
      />
      <main className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: "var(--gold)", letterSpacing: "0.2em" }}
          >
            Temporarily Unavailable
          </p>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            GitHub data could not load
          </h2>
          <p
            className="text-base leading-relaxed max-w-md mx-auto mb-10"
            style={{ color: "var(--text-muted)" }}
          >
            The GitHub API is temporarily unreachable. This is usually a
            short-lived rate limit or a network issue. Try again in a moment,
            or view the profile directly on GitHub.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/sahidattaf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded"
              style={{
                backgroundColor: "var(--cyan)",
                color: "var(--navy-950)",
              }}
            >
              View on GitHub
            </a>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded border"
              style={{
                borderColor: "var(--navy-border)",
                color: "var(--text-muted)",
              }}
            >
              Return home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
