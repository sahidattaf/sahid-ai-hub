import ProjectRegistryCard from "@/components/project-registry-card";
import { DashHeader, Panel } from "@/components/dashboard/ui";
import type { RegistryProject } from "@/data/project-registry";

// Shared body for registry-backed destinations (Hospitality, Kai Korsou, ...).
export default function ProjectGroup({
  title,
  description,
  projects,
  emptyNote,
}: {
  title: string;
  description: string;
  projects: RegistryProject[];
  emptyNote: string;
}) {
  return (
    <>
      <DashHeader title={title} description={description} />
      {projects.length === 0 ? (
        <Panel title="No registry entries">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {emptyNote}
          </p>
        </Panel>
      ) : (
        <>
          <p className="text-xs font-mono" style={{ color: "var(--text-subtle)" }}>
            {projects.length} registry entr{projects.length === 1 ? "y" : "ies"} · source: data/project-registry.ts
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((p) => (
              <ProjectRegistryCard key={p.id} project={p} detailHref={`/dashboard/projects/${p.id}`} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
