import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import GithubDashboardHeader from "@/components/github/GithubDashboardHeader";
import RepositoryGrid from "@/components/github/RepositoryGrid";
import { loadRepositories, getExecutiveSummary } from "@/lib/github";
import type { Repository, ExecutiveSummary, RepositorySource } from "@/types/github";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GitHub",
  description:
    "Live GitHub Executive Intelligence dashboard — repository health, deployment status, activity, and contributors across every Sahid AI Hub project.",
};

interface GitHubPageData {
  repositories: Repository[];
  summary: ExecutiveSummary;
  mode: RepositorySource;
}

async function loadDashboard(): Promise<GitHubPageData | null> {
  try {
    const { repositories, mode } = await loadRepositories();
    return { repositories, summary: getExecutiveSummary(repositories), mode };
  } catch {
    return null;
  }
}

export default async function GitHubPage() {
  const data = await loadDashboard();

  if (!data) {
    return <GitHubUnavailable />;
  }

  const { repositories, summary, mode } = data;

  return (
    <>
      <PageHeader
        breadcrumb="GitHub"
        label="Executive Intelligence"
        title="GitHub"
        description={
          mode === "live"
            ? "Live repository intelligence across every Sahid AI Hub project — pulled directly from the GitHub REST API. Refreshes every 5 minutes."
            : "Repository intelligence across every Sahid AI Hub project, served from the local registry. Add a GITHUB_TOKEN to enable live data."
        }
      />
      <main className="py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          <GithubDashboardHeader summary={summary} mode={mode} />
          <RepositoryGrid repositories={repositories} />
        </div>
      </main>
    </>
  );
}

function GitHubUnavailable() {
  return (
    <>
      <PageHeader
        breadcrumb="GitHub"
        label="Executive Intelligence"
        title="GitHub"
        description="Repository intelligence across every Sahid AI Hub project."
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
            This is usually a short-lived rate limit or network issue. Try
            again in a moment, or view the profile directly on GitHub.
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
