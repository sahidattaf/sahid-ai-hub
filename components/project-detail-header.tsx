import Link from "next/link";
import type { PublicProject } from "@/data/public-projects";

export default function ProjectDetailHeader({ project }: { project: PublicProject }) {
  return (
    <section className="pt-16 pb-14 px-6 border-b section-divider" style={{ backgroundColor: "var(--navy-900)" }}>
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center gap-2 mb-8 text-xs">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <span>/</span>
          <Link href="/projects" className="nav-link">
            Projects
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-subtle)" }}>{project.name}</span>
        </nav>
        <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "var(--cyan)" }}>
          {project.zone} · {project.assetType}
        </p>
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {project.name}
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono badge-live">{project.status}</span>
        </div>
        <p className="text-base max-w-2xl leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 rounded font-mono" style={{ backgroundColor: "var(--navy-800)", color: "var(--text-subtle)" }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
