import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import PublicProjectCard from "@/components/public-project-card";
import { getPublicProjects, getZoneSummaries } from "@/data/project-registry";

export const metadata: Metadata = {
  title: "Projects",
  description: "Public projects by Sahid Attaf, grouped by zone and sourced from the project registry.",
};

export default function ProjectsPage() {
  const projects = getPublicProjects();
  const zones = getZoneSummaries(projects);

  return (
    <>
      <PageHeader
        breadcrumb="Projects"
        label="Public Projects"
        title="Projects"
        description={`${projects.length} public projects grouped by build zone. Private ventures, client work and internal systems are available only in the owner dashboard.`}
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {zones.map(({ zone, description }) => (
            <section key={zone}>
              <div className="mb-8 pb-4 border-b" style={{ borderColor: "var(--navy-border)" }}>
                <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
                  Zone
                </p>
                <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {zone}
                </h2>
                {description && (
                  <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
                    {description}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects
                  .filter((p) => p.zone === zone)
                  .map((project) => (
                    <PublicProjectCard key={project.id} project={project} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
