import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import ProjectRegistryCard from "@/components/project-registry-card";
import {
  REGISTRY,
  ZONE_ORDER,
  ZONE_DESCRIPTIONS,
  getRegistryStats,
} from "@/data/project-registry";

export const metadata: Metadata = {
  title: "Registry",
  description:
    "One source of truth for Sahid Attaf's AI ecosystem — all projects with status, visibility, stack, revenue potential, and next actions.",
};

export default function RegistryPage() {
  const stats = getRegistryStats();

  const statItems = [
    { label: "Total Projects", value: stats.total, accent: "var(--cyan)" },
    { label: "Live", value: stats.live, accent: "var(--cyan)" },
    { label: "Public", value: stats.public, accent: "var(--gold)" },
    { label: "Revenue Targets", value: stats.revenue, accent: "var(--gold)" },
  ];

  const byZone = ZONE_ORDER.map((zone) => ({
    zone,
    description: ZONE_DESCRIPTIONS[zone] ?? "",
    projects: REGISTRY.filter((p) => p.zone === zone),
  })).filter(({ projects }) => projects.length > 0);

  return (
    <>
      <PageHeader
        breadcrumb="Registry"
        label="Source of Truth"
        title="Project Registry"
        description="One source of truth for Sahid Attaf's AI ecosystem. Every project, its zone, status, stack, and next action — tracked in one place."
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-20">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map(({ label, value, accent }) => (
              <div
                key={label}
                className="rounded-lg border p-6 stat-border"
                style={{
                  backgroundColor: "var(--navy-card)",
                  borderColor: "var(--navy-border)",
                }}
              >
                <p
                  className="text-3xl font-bold font-mono mb-1"
                  style={{ color: accent }}
                >
                  {value}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

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
                <p
                  className="text-xs font-mono mt-2"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {projects.length} project{projects.length !== 1 ? "s" : ""}
                </p>
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
