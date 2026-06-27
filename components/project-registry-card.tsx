import type { RegistryProject, Status, Visibility, RevenuePotential } from "@/data/project-registry";

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

function revenueColor(r: RevenuePotential): string {
  const map: Record<RevenuePotential, string> = {
    SaaS: "var(--cyan)",
    Platform: "var(--cyan)",
    Marketplace: "var(--gold)",
    "Client Site": "var(--gold)",
    Portfolio: "var(--text-subtle)",
  };
  return map[r];
}

export default function ProjectRegistryCard({ project }: { project: RegistryProject }) {
  const {
    name,
    zone,
    status,
    visibility,
    description,
    websiteUrl,
    githubUrl,
    category,
    stack,
    revenuePotential,
    nextAction,
    tags,
  } = project;

  return (
    <div
      className="card-hover flex flex-col rounded-lg border p-6"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "rgba(30, 45, 90, 0.6)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3
          className="text-base font-semibold leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {name}
        </h3>
        <div className="flex gap-1.5 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusClass(status)}`}>
            {status}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${visibilityClass(visibility)}`}>
            {visibility}
          </span>
        </div>
      </div>

      <p className="text-xs font-mono mb-3" style={{ color: "var(--text-subtle)" }}>
        {category}
      </p>

      <p
        className="text-sm leading-relaxed mb-4 flex-1"
        style={{ color: "var(--text-muted)" }}
      >
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded font-mono"
            style={{ backgroundColor: "var(--navy-800)", color: "var(--text-subtle)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="rounded px-3 py-2 mb-4 flex items-center justify-between gap-3"
        style={{ backgroundColor: "var(--navy-800)" }}
      >
        <span className="text-xs font-mono" style={{ color: "var(--text-subtle)" }}>
          Zone
        </span>
        <span className="text-xs font-mono text-right" style={{ color: "var(--text-muted)" }}>
          {zone}
        </span>
      </div>

      <div className="mb-4">
        <p
          className="text-xs font-mono uppercase mb-2"
          style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
        >
          Stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {stack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 rounded font-mono border"
              style={{ borderColor: "var(--navy-border)", color: "var(--text-subtle)" }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div
        className="flex items-center justify-between pt-4 border-t mb-4"
        style={{ borderColor: "var(--navy-border)" }}
      >
        <p className="text-xs font-mono uppercase" style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}>
          Revenue
        </p>
        <span
          className="text-xs font-mono font-semibold"
          style={{ color: revenueColor(revenuePotential) }}
        >
          {revenuePotential}
        </span>
      </div>

      <div className="mb-5">
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
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium"
            style={{ color: "var(--cyan)" }}
          >
            Live App
          </a>
        )}
        {websiteUrl && githubUrl && (
          <span style={{ color: "var(--navy-border)" }}>|</span>
        )}
        {githubUrl && (
          <a
            href={githubUrl}
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
