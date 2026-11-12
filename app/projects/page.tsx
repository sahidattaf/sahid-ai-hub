import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import PrivateProjectNames from "@/components/private-project-names";
import PublicProjectCard from "@/components/public-project-card";
import { ZONE_DESCRIPTIONS, ZONE_ORDER, getNameOnlyProjects, getPublicProjects } from "@/data/public-projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Sahid Attaf, grouped by zone. Public projects show their stack and links; other projects are listed by name only.",
};

export default function ProjectsPage() {
  const projects = getPublicProjects();
  const byZone = ZONE_ORDER.map((zone) => ({
    zone,
    description: ZONE_DESCRIPTIONS[zone] ?? "",
    projects: projects.filter((p) => p.zone === zone),
  })).filter(({ projects: list }) => list.length > 0);
  const namesOnly = getNameOnlyProjects();

  return (
    <>
      <PageHeader
        breadcrumb="Projects"
        label="All Projects"
        title="Projects"
        description={`${projects.length} public projects grouped by build zone. ${namesOnly.length} further projects are listed by name only; their details are not public.`}
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {byZone.map(({ zone, description, projects: list }) => (
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
                {list.map((project) => (
                  <PublicProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          ))}
          <section>
            <div className="mb-8 pb-4 border-b" style={{ borderColor: "var(--navy-border)" }}>
              <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
                Not public
              </p>
              <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Projects listed by name only
              </h2>
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
                Private ventures, client work and internal systems. Only the name is public.
              </p>
            </div>
            <PrivateProjectNames projects={namesOnly} />
          </section>
        </div>
      </main>
    </>
  );
}
