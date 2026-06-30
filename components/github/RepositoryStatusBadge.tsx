import { getRepositoryStatus } from "@/lib/github";
import type { Repository, RepositoryStatus } from "@/types/github";

const STATUS_CLASS: Record<RepositoryStatus, string> = {
  Live: "badge-live",
  Active: "badge-prototype",
  Planning: "badge-planning",
  Archived: "badge-repo",
  "Not Connected": "badge-repo",
};

export default function RepositoryStatusBadge({ repo }: { repo: Repository }) {
  const status = getRepositoryStatus(repo);

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-mono ${STATUS_CLASS[status]}`}
      role="status"
      aria-label={`Repository status: ${status}`}
    >
      {status}
    </span>
  );
}
