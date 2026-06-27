import {
  type GitHubRepo,
  type RepoStatus,
  getRepoStatus,
  languageColor,
} from "@/lib/github";
import RepoHealth from "./repo-health";

function statusClass(status: RepoStatus): string {
  const map: Record<RepoStatus, string> = {
    Live: "badge-live",
    Active: "badge-prototype",
    Archive: "badge-repo",
    Repo: "badge-planning",
  };
  return map[status];
}

export default function RepoCard({ repo }: { repo: GitHubRepo }) {
  const status = getRepoStatus(repo);
  const homepage =
    repo.homepage && repo.homepage.trim().length > 0
      ? repo.homepage.trim()
      : null;

  return (
    <div
      className="card-hover flex flex-col rounded-lg border p-5"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "rgba(30, 45, 90, 0.6)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className="text-sm font-semibold font-mono leading-snug min-w-0 truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {repo.name}
        </h3>
        <div className="flex gap-1.5 flex-shrink-0">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusClass(status)}`}
          >
            {status}
          </span>
          {repo.fork && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono badge-repo"
            >
              Fork
            </span>
          )}
        </div>
      </div>

      {repo.description && (
        <p
          className="text-xs leading-relaxed mb-4 flex-1"
          style={{ color: "var(--text-muted)" }}
        >
          {repo.description.length > 120
            ? `${repo.description.slice(0, 120)}...`
            : repo.description}
        </p>
      )}

      {!repo.description && <div className="flex-1" />}

      {repo.language && (
        <div className="flex items-center gap-1.5 mb-4">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: languageColor(repo.language) }}
          />
          <span
            className="text-xs font-mono"
            style={{ color: "var(--text-subtle)" }}
          >
            {repo.language}
          </span>
        </div>
      )}

      <div className="mb-4">
        <RepoHealth
          stars={repo.stargazers_count}
          forks={repo.forks_count}
          issues={repo.open_issues_count}
          pushedAt={repo.pushed_at || repo.updated_at}
        />
      </div>

      <div
        className="flex items-center justify-between pt-4 border-t"
        style={{ borderColor: "var(--navy-border)" }}
      >
        <div className="flex gap-3">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium"
            style={{ color: "var(--text-subtle)" }}
          >
            Repository
          </a>
          {homepage && (
            <>
              <span style={{ color: "var(--navy-border)" }}>|</span>
              <a
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium"
                style={{ color: "var(--cyan)" }}
              >
                Live App
              </a>
            </>
          )}
        </div>
        <span
          className="text-xs font-mono"
          style={{ color: "var(--text-subtle)" }}
        >
          {repo.default_branch}
        </span>
      </div>
    </div>
  );
}
