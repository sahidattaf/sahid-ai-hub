import type { Metadata } from "next";
import { DashHeader, IntegrationStatus, Panel, Pill, SetupState, StatTile, formatUtc } from "@/components/dashboard/ui";
import { requireOwner } from "@/lib/auth/guard";
import { getVercelIntegration, joinWithRegistry, type VercelSnapshot } from "@/lib/integrations/vercel";

export const metadata: Metadata = { title: "Vercel" };
export const dynamic = "force-dynamic";

export default async function VercelDashboardPage() {
  await requireOwner();
  const result = await getVercelIntegration();

  return (
    <>
      <DashHeader title="Vercel" description="Production deployment state reported by the Vercel API for registry projects that declare a Vercel project. This is verified provider data, distinct from the declared URLs in the registry." />
      <IntegrationStatus result={result} />

      {result.state === "unconfigured" && (
        <SetupState
          title="Connect Vercel to verify deployments."
          missing={result.missing}
          steps={[
            "Create an access token at vercel.com/account/tokens with read access to the scope that owns the projects.",
            "Set VERCEL_TOKEN in .env.local or the Vercel project environment. For team projects also set VERCEL_TEAM_ID.",
            "Restart the server.",
          ]}
        />
      )}

      {(result.state === "ok" || result.state === "empty") && <VercelBody snapshot={result.data} />}
    </>
  );
}

function VercelBody({ snapshot }: { snapshot: VercelSnapshot }) {
  const { rows, unregistered } = joinWithRegistry(snapshot);
  const found = rows.filter((r) => r.project);
  const ready = found.filter((r) => r.project?.production?.readyState === "READY").length;

  if (rows.length === 0) {
    return (
      <Panel title="No Vercel projects declared">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>No registry project declares a Vercel project, so there is nothing to compare.</p>
      </Panel>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Declared in registry" value={rows.length} />
        <StatTile label="Found in Vercel" value={`${found.length} / ${rows.length}`} />
        <StatTile label="Production READY" value={`${ready} / ${found.length}`} />
        <StatTile label="In Vercel, not in registry" value={unregistered.length} />
      </div>

      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--navy-border)" }}>
        <table className="w-full text-sm">
          <caption className="sr-only">Registry Vercel projects compared with Vercel API data</caption>
          <thead>
            <tr className="text-left text-xs font-mono uppercase" style={{ color: "var(--text-subtle)" }}>
              <th scope="col" className="p-3">Project</th>
              <th scope="col" className="p-3">Verified production state</th>
              <th scope="col" className="p-3">Declared URL</th>
              <th scope="col" className="p-3">Vercel host</th>
              <th scope="col" className="p-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ target, project, urlCheck }) => (
              <tr key={target.projectId} className="border-t align-top" style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}>
                <th scope="row" className="p-3 text-left font-normal">
                  <span style={{ color: "var(--text-primary)" }}>{target.projectName}</span>
                  <br />
                  <span className="text-xs font-mono">{target.vercelProject}</span>
                </th>
                <td className="p-3">
                  {!project && <Pill tone="warn">not found in Vercel account</Pill>}
                  {project && !project.production && <Pill tone="muted">no production deployment</Pill>}
                  {project?.production && <Pill tone={project.production.readyState === "READY" ? "ok" : project.production.readyState === "ERROR" ? "bad" : "warn"}>{project.production.readyState}</Pill>}
                </td>
                <td className="p-3 text-xs">
                  {target.declaredUrl ?? "—"}
                  {urlCheck === "differs" && <><br /><Pill tone="warn">differs from Vercel host</Pill></>}
                  {urlCheck === "matches" && <><br /><Pill tone="ok">matches</Pill></>}
                </td>
                <td className="p-3 text-xs font-mono">{project?.production?.host ?? "—"}</td>
                <td className="p-3 text-xs font-mono">{project?.production?.at ? formatUtc(new Date(project.production.at).toISOString()) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {unregistered.length > 0 && (
        <Panel title="Vercel projects not in the registry">
          <ul className="text-xs font-mono space-y-1" style={{ color: "var(--text-muted)" }}>
            {unregistered.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
