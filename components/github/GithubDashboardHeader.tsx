import { timeAgo } from "@/lib/github";
import type { ExecutiveSummary, RepositorySource } from "@/types/github";

export default function GithubDashboardHeader({
  summary,
  mode,
}: {
  summary: ExecutiveSummary;
  mode: RepositorySource;
}) {
  const items: Array<{
    label: string;
    value: string | number;
    color: string;
    isText: boolean;
  }> = [
    { label: "Repositories", value: summary.total, color: "var(--cyan)", isText: false },
    { label: "Healthy", value: summary.healthy, color: "var(--cyan)", isText: false },
    {
      label: "Need Attention",
      value: summary.needsAttention,
      color: summary.needsAttention > 0 ? "var(--gold)" : "var(--text-subtle)",
      isText: false,
    },
    {
      label: "Last Commit",
      value: summary.lastCommitAt ? timeAgo(summary.lastCommitAt) : "—",
      color: "var(--text-primary)",
      isText: true,
    },
    { label: "Deployments", value: summary.deploymentsReady, color: "var(--cyan)", isText: false },
    { label: "Open PRs", value: summary.openPullRequests, color: "var(--cyan-dim)", isText: false },
    {
      label: "Open Issues",
      value: summary.openIssues,
      color: summary.openIssues > 10 ? "var(--gold)" : "var(--text-subtle)",
      isText: false,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p
          className="text-xs font-mono uppercase tracking-widest"
          style={{ color: "var(--text-subtle)", letterSpacing: "0.15em" }}
        >
          Executive Summary
        </p>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full"
          style={{
            backgroundColor:
              mode === "live" ? "rgba(34, 211, 238, 0.12)" : "rgba(212, 168, 67, 0.12)",
            color: mode === "live" ? "var(--cyan)" : "var(--gold)",
            border: `1px solid ${mode === "live" ? "rgba(34, 211, 238, 0.25)" : "rgba(212, 168, 67, 0.25)"}`,
          }}
        >
          {mode === "live" ? "Live API" : "Registry Mode"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {items.map(({ label, value, color, isText }) => (
          <div
            key={label}
            className="rounded-lg border p-4 stat-border"
            style={{
              backgroundColor: "var(--navy-card)",
              borderColor: "var(--navy-border)",
            }}
          >
            <p
              className={isText ? "text-base font-bold mb-1" : "text-2xl font-bold font-mono mb-1"}
              style={{ color }}
            >
              {value}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
