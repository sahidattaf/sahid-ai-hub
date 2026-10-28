import Link from "next/link";
import type { PublicProject } from "@/data/project-registry";

// Public card: renders PublicProject only (no private registry fields exist on
// the type). A live link is a declared URL, not a verified deployment.
export default function PublicProjectCard({ project }: { project: PublicProject }) {
  return (
    <div
      className="card-hover flex flex-col rounded-lg border p-6"
      style={{ backgroundColor: "var(--navy-card)", borderColor: "rgba(30, 45, 90, 0.6)" }}
    >
      <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
        {project.name}
      </h3>
      <p className="text-xs font-mono mb-3" style={{ color: "var(--gold)" }}>
        {project.assetType} · {project.category}
      </p>
      <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--text-muted)" }}>
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.stack.map((s) => (
          <span key={s} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: "var(--navy-800)", color: "var(--text-subtle)" }}>
            {s}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {project.websiteUrl && (
          <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: "var(--cyan)" }}>
            Declared live URL ↗
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>
            Repository ↗
          </a>
        )}
        <Link href={`/projects/${project.id}`} className="text-xs font-medium" style={{ color: "var(--gold)" }}>
          Details →
        </Link>
      </div>
    </div>
  );
}
