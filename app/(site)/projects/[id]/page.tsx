import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProjectById, getPublicProjects } from "@/data/project-registry";

// Only public projects are generated; any other id (including private registry
// entries) is a 404 rather than a gated page, so their existence is not revealed.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicProjects().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = getPublicProjectById(id);
  return project ? { title: project.name, description: project.description } : { title: "Project Not Found" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getPublicProjectById(id);
  if (!project) notFound();

  return (
    <>
      <section className="pt-16 pb-14 px-6 border-b section-divider" style={{ backgroundColor: "var(--navy-900)" }}>
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 mb-8 text-xs">
            <Link href="/" className="nav-link">Home</Link>
            <span>/</span>
            <Link href="/projects" className="nav-link">Projects</Link>
            <span>/</span>
            <span style={{ color: "var(--text-subtle)" }}>{project.name}</span>
          </nav>
          <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "var(--cyan)" }}>
            {project.zone} · {project.assetType}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
            {project.name}
          </h1>
          <p className="text-base max-w-2xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {project.description}
          </p>
        </div>
      </section>
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-wrap gap-2">
            {[...project.stack, ...project.tags].map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded font-mono" style={{ backgroundColor: "var(--navy-800)", color: "var(--text-subtle)" }}>
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {project.websiteUrl && (
              <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium" style={{ color: "var(--cyan)" }}>
                Declared live URL ↗
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Repository ↗
              </a>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
