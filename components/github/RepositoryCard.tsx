import { timeAgo } from "@/lib/github";
import type { Repository } from "@/types/github";
import RepositoryStatusBadge from "./RepositoryStatusBadge";
import RepositoryStats from "./RepositoryStats";
import RepositoryActivity from "./RepositoryActivity";
import RepositoryLanguages from "./RepositoryLanguages";
import RepositoryContributors from "./RepositoryContributors";
import RepositoryHealth from "./RepositoryHealth";

export default function RepositoryCard({ repo }: { repo: Repository }) {
  return (
    <article
      className="card-hover flex flex-col rounded-lg border p-5"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "rgba(30, 45, 90, 0.6)",
      }}
      aria-label={`${repo.name} repository card`}
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h3
          className="text-sm font-semibold leading-snug min-w-0 truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {repo.name}
        </h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <RepositoryStatusBadge repo={repo} />
          <span
            className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{
              backgroundColor: "rgba(100, 116, 139, 0.12)",
              color: "var(--text-subtle)",
            }}
          >
            {repo.visibility}
          </span>
        </div>
      </div>

      <p
        className="text-xs leading-relaxed mb-3 line-clamp-2"
        style={{ color: "var(--text-muted)" }}
      >
        {repo.description}
      </p>

      <div className="mb-3">
        <RepositoryStats repo={repo} />
      </div>

      <div className="mb-3">
        <RepositoryActivity repo={repo} />
      </div>

      {repo.languages.length > 0 && (
        <div className="mb-3">
          <RepositoryLanguages languages={repo.languages} />
        </div>
      )}

      {repo.contributors.length > 0 && (
        <div className="mb-3">
          <RepositoryContributors contributors={repo.contributors} />
        </div>
      )}

      <div className="flex-1" />

      <div
        className="pt-3.5 mt-1 border-t"
        style={{ borderColor: "var(--navy-border)" }}
      >
        <RepositoryHealth health={repo.health} />
      </div>

      <div
        className="flex items-center justify-between pt-3.5 mt-3.5 border-t"
        style={{ borderColor: "var(--navy-border)" }}
      >
        <div className="flex gap-3">
          {repo.githubUrl && (
            <a
              href={repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium"
              style={{ color: "var(--text-subtle)" }}
            >
              Repository
            </a>
          )}
          {repo.websiteUrl && (
            <>
              <span style={{ color: "var(--navy-border)" }}>|</span>
              <a
                href={repo.websiteUrl}
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
          {repo.lastUpdated ? timeAgo(repo.lastUpdated) : repo.defaultBranch}
        </span>
      </div>
    </article>
  );
}
