import { type Project, type Status, type Visibility } from "@/data/projects";

function statusClass(status: Status): string {
  const map: Record<Status, string> = {
    Live: "badge-live",
    Repo: "badge-repo",
    Prototype: "badge-prototype",
    Planning: "badge-planning",
  };
  return map[status];
}

function visibilityClass(visibility: Visibility): string {
  const map: Record<Visibility, string> = {
    Public: "badge-public",
    Private: "badge-private",
    Hybrid: "badge-hybrid",
  };
  return map[visibility];
}

export default function ProjectCard({ project }: { project: Project }) {
  const {
    title,
    description,
    live,
    repo,
    tags,
    status,
    visibility,
    category,
    nextAction,
  } = project;

  return (
    <div
      className="card-hover flex flex-col rounded-lg border p-6"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "rgba(30, 45, 90, 0.6)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3
          className="text-base font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        <div className="flex gap-1.5 flex-shrink-0">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusClass(status)}`}
          >
            {status}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono ${visibilityClass(visibility)}`}
          >
            {visibility}
          </span>
        </div>
      </div>

      <p
        className="text-xs font-mono mb-3"
        style={{ color: "var(--text-subtle)" }}
      >
        {category}
      </p>

      <p
        className="text-sm leading-relaxed mb-4 flex-1"
        style={{ color: "var(--text-muted)" }}
      >
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded font-mono"
            style={{
              backgroundColor: "var(--navy-800)",
              color: "var(--text-subtle)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="pt-4 border-t mb-4"
        style={{ borderColor: "var(--navy-border)" }}
      >
        <p
          className="text-xs font-mono uppercase mb-1"
          style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
        >
          Next Action
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {nextAction}
        </p>
      </div>

      <div className="flex gap-3">
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium"
            style={{ color: "var(--cyan)" }}
          >
            Live App
          </a>
        )}
        {live && repo && <span style={{ color: "var(--navy-border)" }}>|</span>}
        {repo && (
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium"
            style={{ color: "var(--text-subtle)" }}
          >
            Repository
          </a>
        )}
      </div>
    </div>
  );
}
