import type { Metadata } from "next";
import { DashHeader, IntegrationStatus, Panel, Pill, SetupState, StatTile, formatUtc } from "@/components/dashboard/ui";
import { requireOwner } from "@/lib/auth/guard";
import { getGithubIntegration, type GithubRepoResult } from "@/lib/integrations/github";
import { FAILURE_LABELS } from "@/lib/integrations/types";

export const metadata: Metadata = { title: "GitHub" };
export const dynamic = "force-dynamic";

function visibilityNote(r: Extract<GithubRepoResult, { state: "ok" }>): { text: string; tone: "ok" | "warn" } {
  const declaredPublic = r.target.declaredVisibility === "Public";
  if (declaredPublic && r.repo.isPrivate) return { text: "Declared Public but repository is private", tone: "warn" };
  if (r.target.declaredVisibility === "Private" && !r.repo.isPrivate) return { text: "Declared Private but repository is public", tone: "warn" };
  return { text: r.repo.isPrivate ? "private" : "public", tone: "ok" };
}

export default async function GithubDashboardPage() {
  await requireOwner();
  const result = await getGithubIntegration();

  return (
    <>
      <DashHeader title="GitHub" description="Repository status for every registry project that declares a GitHub URL. Fetched server-side with a read-only token; the token never reaches the browser." />
      <IntegrationStatus result={result} />

      {result.state === "unconfigured" && (
        <SetupState
          title="Connect GitHub to see repository status."
          missing={result.missing}
          steps={[
            "Create a fine-grained personal access token at github.com/settings/personal-access-tokens.",
            "Grant read-only access to the repositories in the registry (Metadata: read, Contents: read).",
            "Set GITHUB_TOKEN in .env.local (local) or the Vercel project environment (deployed), then restart.",
          ]}
        />
      )}

      {(result.state === "ok" || result.state === "empty") && <GithubBody repos={result.data.repos} />}
    </>
  );
}

function GithubBody({ repos }: { repos: GithubRepoResult[] }) {
  if (repos.length === 0) {
    return (
      <Panel title="No repositories">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No registry project declares a GitHub URL, so there is nothing to fetch. This is a registry state, not a GitHub result.
        </p>
      </Panel>
    );
  }
  const ok = repos.filter((r): r is Extract<GithubRepoResult, { state: "ok" }> => r.state === "ok");
  const failed = repos.filter((r): r is Extract<GithubRepoResult, { state: "error" }> => r.state === "error");

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Repositories read" value={`${ok.length} / ${repos.length}`} note={failed.length ? `${failed.length} failed — excluded from totals` : "All succeeded"} />
        <StatTile label="Archived" value={ok.filter((r) => r.repo.archived).length} note={`of ${ok.length} read`} />
        <StatTile label="Open issues + PRs" value={ok.reduce((n, r) => n + r.repo.openIssuesAndPrs, 0)} note={`across ${ok.length} read`} />
        <StatTile label="Visibility mismatches" value={ok.filter((r) => visibilityNote(r).tone === "warn").length} />
      </div>

      {failed.length > 0 && (
        <div role="alert" className="rounded-lg border p-4" style={{ borderColor: "#f87171", backgroundColor: "rgba(248,113,113,0.08)" }}>
          <p className="text-sm font-semibold mb-2" style={{ color: "#f87171" }}>
            {failed.length} repositor{failed.length === 1 ? "y" : "ies"} could not be read
          </p>
          <ul className="text-xs space-y-1" style={{ color: "var(--text-muted)" }}>
            {failed.map((f) => (
              <li key={f.target.projectId}>
                {f.target.owner}/{f.target.repo}: {FAILURE_LABELS[f.kind]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--navy-border)" }}>
        <table className="w-full text-sm">
          <caption className="sr-only">GitHub repository status from the GitHub API</caption>
          <thead>
            <tr className="text-left text-xs font-mono uppercase" style={{ color: "var(--text-subtle)" }}>
              <th scope="col" className="p-3">Project / repository</th>
              <th scope="col" className="p-3">Visibility</th>
              <th scope="col" className="p-3">Last push</th>
              <th scope="col" className="p-3">Last commit</th>
              <th scope="col" className="p-3 text-right">Stars</th>
              <th scope="col" className="p-3 text-right">Issues+PRs</th>
            </tr>
          </thead>
          <tbody>
            {ok.map((r) => {
              const note = visibilityNote(r);
              return (
                <tr key={r.target.projectId} className="border-t align-top" style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}>
                  <th scope="row" className="p-3 text-left font-normal">
                    <span style={{ color: "var(--text-primary)" }}>{r.target.projectName}</span>
                    <br />
                    <a href={r.target.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono" style={{ color: "var(--cyan)" }}>
                      {r.repo.fullName} ↗
                    </a>
                    {r.repo.archived && <> <Pill tone="warn">archived</Pill></>}
                  </th>
                  <td className="p-3"><Pill tone={note.tone}>{note.text}</Pill></td>
                  <td className="p-3 text-xs font-mono">{r.repo.pushedAt ? formatUtc(r.repo.pushedAt) : "—"}</td>
                  <td className="p-3 text-xs">
                    {r.repo.lastCommit.state === "ok" && <>{r.repo.lastCommit.message}<br /><span className="font-mono">{formatUtc(r.repo.lastCommit.date)}</span></>}
                    {r.repo.lastCommit.state === "none" && "No commits"}
                    {r.repo.lastCommit.state === "unavailable" && <Pill tone="warn">unavailable: {FAILURE_LABELS[r.repo.lastCommit.kind]}</Pill>}
                  </td>
                  <td className="p-3 text-right font-mono">{r.repo.stars}</td>
                  <td className="p-3 text-right font-mono">{r.repo.openIssuesAndPrs}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
