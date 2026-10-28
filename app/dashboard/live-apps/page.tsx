import type { Metadata } from "next";
import { DashHeader, IntegrationStatus, Panel, Pill } from "@/components/dashboard/ui";
import { REGISTRY, getDeclaredLiveApps } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";
import { FAILURE_LABELS } from "@/lib/integrations/types";
import { getVercelIntegration, hostOf } from "@/lib/integrations/vercel";

export const metadata: Metadata = { title: "Live Apps" };
export const dynamic = "force-dynamic";

export default async function DashboardLiveAppsPage() {
  await requireOwner();
  const apps = getDeclaredLiveApps(REGISTRY);
  const vercel = await getVercelIntegration();
  const byName = vercel.state === "ok" || vercel.state === "empty" ? new Map(vercel.data.projects.map((p) => [p.name, p])) : null;

  return (
    <>
      <DashHeader
        title="Live Apps"
        description="Every registry project that declares a production URL. The URL is a declaration; the verification column comes from the Vercel API and is shown only when that fetch succeeded."
      />
      <IntegrationStatus result={vercel} />
      {apps.length === 0 ? (
        <Panel title="No declared live apps">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No registry project declares a production URL.</p>
        </Panel>
      ) : (
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--navy-border)" }}>
          <table className="w-full text-sm">
            <caption className="sr-only">Declared production URLs and verified Vercel deployment state</caption>
            <thead>
              <tr className="text-left text-xs font-mono uppercase" style={{ color: "var(--text-subtle)" }}>
                <th scope="col" className="p-3">Project</th>
                <th scope="col" className="p-3">Declared URL</th>
                <th scope="col" className="p-3">Verified deployment health</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => {
                const project = app.vercelProject ? byName?.get(app.vercelProject) : undefined;
                return (
                  <tr key={app.id} className="border-t align-top" style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}>
                    <th scope="row" className="p-3 text-left font-normal" style={{ color: "var(--text-primary)" }}>
                      {app.name} {app.visibility !== "Public" && <Pill tone="muted">{app.visibility}</Pill>}
                    </th>
                    <td className="p-3 text-xs">
                      <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)" }}>
                        {hostOf(app.websiteUrl) ?? app.websiteUrl} ↗
                      </a>
                    </td>
                    <td className="p-3">
                      {!app.vercelProject && <Pill tone="muted">not verified — no Vercel project in registry</Pill>}
                      {app.vercelProject && vercel.state === "unconfigured" && <Pill tone="muted">not verified — Vercel not configured</Pill>}
                      {app.vercelProject && vercel.state === "error" && <Pill tone="warn">not verified — {FAILURE_LABELS[vercel.kind]}</Pill>}
                      {app.vercelProject && byName && !project && <Pill tone="warn">Vercel project not found</Pill>}
                      {project && !project.production && <Pill tone="muted">no production deployment</Pill>}
                      {project?.production && (
                        <Pill tone={project.production.readyState === "READY" ? "ok" : project.production.readyState === "ERROR" ? "bad" : "warn"}>
                          Vercel: {project.production.readyState}
                        </Pill>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
