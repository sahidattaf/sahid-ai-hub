import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import PrivateProjectNames from "@/components/private-project-names";
import PublicProjectCard from "@/components/public-project-card";
import { ZONE_DESCRIPTIONS, ZONE_ORDER, getNameOnlyProjects, getPublicProjects, getPublicStats } from "@/data/public-projects";

export const metadata: Metadata = {
  title: "Portfolio Registry",
  description: "Public view of the portfolio registry: project names, zones, types and status. Internal classification is not published.",
};

export default function RegistryPage() {
  const stats = getPublicStats();
  const projects = getPublicProjects();
  const namesOnly = getNameOnlyProjects();
  const statItems = [
    { label: "Portfolio Projects", value: stats.total, accent: "var(--cyan)" },
    { label: "Public", value: stats.public, accent: "var(--cyan)" },
    { label: "Live", value: stats.live, accent: "var(--gold)" },
    { label: "Listed by name only", value: stats.namesOnly, accent: "var(--gold)" },
  ];
  const byZone = ZONE_ORDER.map((zone) => ({ zone, description: ZONE_DESCRIPTIONS[zone] ?? "", projects: projects.filter((p) => p.zone === zone) })).filter(({ projects: list }) => list.length > 0);

  return (
    <>
      <PageHeader
        breadcrumb="Registry"
        label="Public Registry"
        title="Portfolio Registry"
        description="Public view of the portfolio: project names, zones, types and status. Internal classification, priorities, decisions and client details are not published."
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map(({ label, value, accent }) => (
              <div key={label} className="rounded-lg border p-6 stat-border" style={{ backgroundColor: "var(--navy-card)", borderColor: "var(--navy-border)" }}>
                <p className="text-3xl font-bold font-mono mb-1" style={{ color: accent }}>
                  {value}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
          {byZone.map(({ zone, description, projects: list }) => (
            <section key={zone}>
              <div className="mb-8 pb-4 border-b" style={{ borderColor: "var(--navy-border)" }}>
                <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
                  Portfolio Zone
                </p>
                <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {zone}
                </h2>
                <p className="text-sm leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
                  {description}
                </p>
                <p className="text-xs font-mono mt-2" style={{ color: "var(--text-subtle)" }}>
                  {list.length} project{list.length !== 1 ? "s" : ""}
                </p>
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
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Projects listed by name only
              </h2>
            </div>
            <PrivateProjectNames projects={namesOnly} />
          </section>
        </div>
      </main>
    </>
  );
}
