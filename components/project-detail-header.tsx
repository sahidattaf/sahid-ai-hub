import Link from "next/link";
import type { RegistryProject, Status, Visibility } from "@/data/project-registry";

function statusClass(s: Status) {
  const map: Record<Status, string> = {
    Live: "badge-live",
    Repo: "badge-repo",
    Prototype: "badge-prototype",
    Planning: "badge-planning",
  };
  return map[s];
}

function visibilityClass(v: Visibility) {
  const map: Record<Visibility, string> = {
    Public: "badge-public",
    Private: "badge-private",
    Hybrid: "badge-hybrid",
  };
  return map[v];
}

export default function ProjectDetailHeader({
  project,
}: {
  project: RegistryProject;
}) {
  return (
    <section
      className="pt-16 pb-14 px-6 border-b section-divider"
      style={{ backgroundColor: "var(--navy-900)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-xs">
          <Link href="/" className="nav-link" style={{ fontSize: "0.75rem" }}>
            Home
          </Link>
          <span style={{ color: "var(--navy-border)" }}>/</span>
          <Link
            href="/projects"
            className="nav-link"
            style={{ fontSize: "0.75rem" }}
          >
            Projects
          </Link>
          <span style={{ color: "var(--navy-border)" }}>/</span>
          <span style={{ color: "var(--text-subtle)", fontSize: "0.75rem" }}>
            {project.name}
          </span>
        </nav>

        {/* Zone + category */}
        <p
          className="text-xs font-mono tracking-widest uppercase mb-3"
          style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
        >
          {project.zone}
        </p>

        {/* Title + badges */}
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <h1
            className="text-3xl md:text-5xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {project.name}
          </h1>
          <div className="flex items-center gap-2 mt-1 md:mt-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusClass(project.status)}`}
            >
              {project.status}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-mono ${visibilityClass(project.visibility)}`}
            >
              {project.visibility}
            </span>
          </div>
        </div>

        <p
          className="text-base max-w-2xl leading-relaxed mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          {project.description}
        </p>

        {/* Quick meta row */}
        <div className="flex flex-wrap gap-6 text-xs font-mono">
          <div>
            <span style={{ color: "var(--text-subtle)" }}>Category: </span>
            <span style={{ color: "var(--text-muted)" }}>{project.category}</span>
          </div>
          <div>
            <span style={{ color: "var(--text-subtle)" }}>Owner: </span>
            <span style={{ color: "var(--text-muted)" }}>{project.owner}</span>
          </div>
          <div>
            <span style={{ color: "var(--text-subtle)" }}>Priority: </span>
            <span
              style={{
                color:
                  project.priority === "High" ? "var(--gold)" : "var(--text-muted)",
              }}
            >
              {project.priority}
            </span>
          </div>
          <div>
            <span style={{ color: "var(--text-subtle)" }}>Revenue: </span>
            <span style={{ color: "var(--cyan)" }}>{project.revenuePotential}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
