import { timeAgo } from "@/lib/github";
import type { Repository } from "@/types/github";

export default function RepositoryActivity({ repo }: { repo: Repository }) {
  const hasActivity = repo.activity.length > 0;
  const max = Math.max(1, ...repo.activity.map((p) => p.count));

  return (
    <div>
      {hasActivity && (
        <div
          className="flex items-end gap-1 h-8 mb-2"
          role="img"
          aria-label="Commit activity over the last 7 days"
        >
          {repo.activity.map((point, i) => (
            <div
              key={`${point.label}-${i}`}
              className="flex-1 rounded-sm"
              style={{
                height: `${Math.max(8, (point.count / max) * 100)}%`,
                backgroundColor:
                  point.count > 0 ? "var(--cyan)" : "rgba(100, 116, 139, 0.25)",
                opacity: point.count > 0 ? 1 : 0.5,
              }}
              title={`${point.label}: ${point.count} commit${point.count === 1 ? "" : "s"}`}
            />
          ))}
        </div>
      )}

      {repo.lastCommitDate ? (
        <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
          Last commit{" "}
          <span style={{ color: "var(--text-muted)" }}>
            {timeAgo(repo.lastCommitDate)}
          </span>
          {repo.lastCommitMessage && (
            <span className="block truncate mt-0.5" style={{ color: "var(--text-subtle)" }}>
              &ldquo;{repo.lastCommitMessage}&rdquo;
            </span>
          )}
        </p>
      ) : (
        <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
          No commit history available
        </p>
      )}
    </div>
  );
}
