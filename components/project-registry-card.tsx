import Link from "next/link";
import type { RegistryProject } from "@/data/project-registry";

export default function ProjectRegistryCard({ project, detailHref }: { project: RegistryProject; detailHref?: string }) {
  return <div className="card-hover flex flex-col rounded-lg border p-6" style={{backgroundColor:"var(--navy-card)",borderColor:"rgba(30, 45, 90, 0.6)"}}>
    <div className="flex items-start justify-between gap-3 mb-2"><h3 className="text-base font-semibold" style={{color:"var(--text-primary)"}}>{project.name}</h3><span className="text-xs px-2 py-0.5 rounded-full font-mono badge-live">{project.priority}</span></div>
    <p className="text-xs font-mono mb-3" style={{color:"var(--gold)"}}>{project.assetType} · {project.operatingStatus}</p>
    <p className="text-sm leading-relaxed mb-4 flex-1" style={{color:"var(--text-muted)"}}>{project.description}</p>
    <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono"><div className="rounded p-2" style={{backgroundColor:"var(--navy-800)"}}><span style={{color:"var(--text-subtle)"}}>Stream</span><br/><span style={{color:"var(--text-muted)"}}>{project.portfolioStream}</span></div><div className="rounded p-2" style={{backgroundColor:"var(--navy-800)"}}><span style={{color:"var(--text-subtle)"}}>Evidence</span><br/><span style={{color:project.evidenceStatus === "Verified" ? "var(--cyan)" : "var(--gold)"}}>{project.evidenceStatus}</span></div></div>
    <div className="mb-4"><p className="text-xs font-mono uppercase mb-1" style={{color:"var(--text-subtle)"}}>Next Action</p><p className="text-xs" style={{color:"var(--text-muted)"}}>{project.nextAction}</p></div>
    {project.nextDecision && <div className="mb-4"><p className="text-xs font-mono uppercase mb-1" style={{color:"var(--text-subtle)"}}>Next Decision</p><p className="text-xs" style={{color:"var(--text-muted)"}}>{project.nextDecision}</p></div>}
    <div className="flex flex-wrap gap-3">{project.notionUrl && <a href={project.notionUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{color:"var(--gold)"}}>Notion</a>}{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{color:"var(--text-subtle)"}}>Repository</a>}{project.websiteUrl && <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{color:"var(--cyan)"}}>Live App</a>}{detailHref && <Link href={detailHref} className="text-xs font-medium" style={{color:"var(--gold)"}}>Details →</Link>}</div>
  </div>;
}
