import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import ProjectRegistryCard from "@/components/project-registry-card";
import { REGISTRY, ZONE_ORDER, ZONE_DESCRIPTIONS, getRegistryStats } from "@/data/project-registry";

export const metadata: Metadata = { title: "Portfolio Registry", description: "Portfolio Registry v2 — strategic classification, evidence routing, priority and next actions." };

export default function RegistryPage() {
  const stats = getRegistryStats();
  const statItems = [
    { label: "Portfolio Assets", value: stats.total, accent: "var(--cyan)" },
    { label: "Active / Pilot", value: stats.active, accent: "var(--cyan)" },
    { label: "P0 / P1", value: stats.p0p1, accent: "var(--gold)" },
    { label: "Evidence Follow-up", value: stats.needsEvidence, accent: "var(--gold)" },
  ];
  const byZone = ZONE_ORDER.map((zone) => ({ zone, description: ZONE_DESCRIPTIONS[zone] ?? "", projects: REGISTRY.filter((p) => p.zone === zone) })).filter(({ projects }) => projects.length > 0);

  return <>
    <PageHeader breadcrumb="Registry" label="Portfolio Source of Truth" title="Portfolio Registry v2" description="Strategic portfolio classification with asset type, operating status, priority, evidence state, owner routing and next action." />
    <main className="py-16 px-6"><div className="max-w-6xl mx-auto space-y-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{statItems.map(({label,value,accent}) => <div key={label} className="rounded-lg border p-6 stat-border" style={{backgroundColor:"var(--navy-card)",borderColor:"var(--navy-border)"}}><p className="text-3xl font-bold font-mono mb-1" style={{color:accent}}>{value}</p><p className="text-xs" style={{color:"var(--text-muted)"}}>{label}</p></div>)}</div>
      {byZone.map(({zone,description,projects}) => <section key={zone}><div className="mb-8 pb-4 border-b" style={{borderColor:"var(--navy-border)"}}><p className="text-xs font-mono uppercase tracking-widest mb-1" style={{color:"var(--gold)",letterSpacing:"0.15em"}}>Portfolio Zone</p><h2 className="text-lg font-semibold mb-2" style={{color:"var(--text-primary)"}}>{zone}</h2><p className="text-sm leading-relaxed max-w-xl" style={{color:"var(--text-muted)"}}>{description}</p><p className="text-xs font-mono mt-2" style={{color:"var(--text-subtle)"}}>{projects.length} asset{projects.length !== 1 ? "s" : ""}</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">{projects.map((project) => <ProjectRegistryCard key={project.id} project={project} detailHref={`/projects/${project.id}`} />)}</div></section>)}
    </div></main>
  </>;
}
