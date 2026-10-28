import type { Metadata } from "next";
import ProjectRegistryCard from "@/components/project-registry-card";
import { DashHeader, StatTile } from "@/components/dashboard/ui";
import { REGISTRY, ZONE_DESCRIPTIONS, ZONE_ORDER, getRegistryStats } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

export default async function DashboardProjectsPage() {
  await requireOwner();
  const stats = getRegistryStats();
  const zones = ZONE_ORDER.map((zone) => ({ zone, projects: REGISTRY.filter((p) => p.zone === zone) })).filter((z) => z.projects.length > 0);

  return (
    <>
      <DashHeader title="Projects" description="The canonical project registry (data/project-registry.ts), including private entries. Classifications are declared by the owner, not measured." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Registry entries" value={stats.total} />
        <StatTile label="Active / pilot" value={stats.active} />
        <StatTile label="P0 / P1" value={stats.p0p1} />
        <StatTile label="Evidence follow-up" value={stats.needsEvidence} note="Not yet Verified" />
      </div>
      {zones.map(({ zone, projects }) => (
        <section key={zone} aria-labelledby={`zone-${zone}`}>
          <h2 id={`zone-${zone}`} className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            {zone}
          </h2>
          <p className="text-xs mb-4" style={{ color: "var(--text-subtle)" }}>
            {ZONE_DESCRIPTIONS[zone]} · {projects.length}
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((p) => (
              <ProjectRegistryCard key={p.id} project={p} detailHref={`/dashboard/projects/${p.id}`} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
