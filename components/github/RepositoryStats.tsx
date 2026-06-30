import type { Repository } from "@/types/github";

export default function RepositoryStats({ repo }: { repo: Repository }) {
  const items = [
    { label: "Stars", value: repo.stars },
    { label: "Forks", value: repo.forks },
    { label: "Watchers", value: repo.watchers },
    {
      label: "Issues",
      value: repo.openIssues,
      accent: repo.openIssues > 10 ? "var(--gold)" : undefined,
    },
    {
      label: "PRs",
      value: repo.openPullRequests,
      accent: repo.openPullRequests > 0 ? "var(--cyan)" : undefined,
    },
  ];

  return (
    <dl className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map(({ label, value, accent }) => (
        <div key={label} className="flex items-center gap-1">
          <dt className="sr-only">{label}</dt>
          <dd
            className="text-xs font-mono"
            style={{ color: accent ?? "var(--text-muted)" }}
          >
            {value}
          </dd>
          <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
            {label.toLowerCase()}
          </span>
        </div>
      ))}
    </dl>
  );
}
