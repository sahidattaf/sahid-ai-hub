import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import ProjectRegistryCard from "@/components/project-registry-card";
import { REGISTRY, ZONE_ORDER, ZONE_DESCRIPTIONS } from "@/data/project-registry";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "All projects by Sahid Attaf — status, visibility, zone, tech stack, and next actions. Sourced from the project registry.",
};

export default function ProjectsPage() {
  const byZone = ZONE_ORDER.map((zone) => ({
    zone,
    description: ZONE_DESCRIPTIONS[zone] ?? "",
    projects: REGISTRY.filter((p) => p.zone === zone),
  })).filter(({ projects }) => projects.length > 0);

  return (
    <>
      <PageHeader
        breadcrumb="Projects"
        label="All Projects"
        title="Projects"
        description="Every active project grouped by build zone — status, visibility, tech stack, and next action tracked per entry. Sourced from the project registry."
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {byZone.map(({ zone, description, projects }) => (
            <section key={zone}>
              <div
                className="mb-8 pb-4 border-b"
                style={{ borderColor: "var(--navy-border)" }}
              >
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-1"
                  style={{ color: "var(--gold)", letterSpacing: "0.15em" }}
                >
                  Zone
                </p>
                <h2
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {zone}
                </h2>
                {description && (
                  <p
                    className="text-sm leading-relaxed max-w-xl"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {description}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project) => (
                  <ProjectRegistryCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
