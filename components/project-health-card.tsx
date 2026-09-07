import type { RegistryProject } from "@/data/project-registry";

export default function ProjectHealthCard({ project, score }: { project: RegistryProject; score: number }) {
  const factors = [
    ["Evidence verified", project.evidenceStatus === "Verified"],
    ["Control link", Boolean(project.notionUrl || project.githubUrl)],
    ["Next action set", Boolean(project.nextAction)],
    ["Review date set", Boolean(project.lastReviewed)],
    ["Portfolio priority", project.priority === "P0" || project.priority === "P1"],
  ] as const;
  return <div className="rounded-lg border p-6" style={{backgroundColor:"var(--navy-card)",borderColor:"rgba(30, 45, 90, 0.6)"}}>
    <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{color:"var(--text-subtle)"}}>Portfolio Health</p><div className="flex items-end gap-3 mb-5"><span className="text-5xl font-bold font-mono" style={{color:score >= 80 ? "var(--cyan)" : "var(--gold)"}}>{score}</span><span className="text-sm mb-2 font-mono" style={{color:"var(--text-subtle)"}}>/ 100</span></div>
    <div className="space-y-2 mb-6">{factors.map(([label,active]) => <div key={label} className="flex items-center justify-between text-xs font-mono"><span style={{color:active ? "var(--text-muted)" : "var(--text-subtle)"}}>{label}</span><span style={{color:active ? "var(--cyan)" : "var(--navy-border)"}}>{active ? "+20" : "—"}</span></div>)}</div>
    <div className="rounded px-3 py-3 mb-5" style={{backgroundColor:"var(--navy-800)"}}><p className="text-xs font-mono uppercase mb-1" style={{color:"var(--text-subtle)"}}>Next Action</p><p className="text-xs leading-relaxed" style={{color:"var(--text-muted)"}}>{project.nextAction}</p></div>
    {project.ownerGate && <div><p className="text-xs font-mono uppercase mb-1" style={{color:"var(--text-subtle)"}}>Owner Gate</p><p className="text-xs" style={{color:"var(--gold)"}}>{project.ownerGate}</p></div>}
  </div>;
}
