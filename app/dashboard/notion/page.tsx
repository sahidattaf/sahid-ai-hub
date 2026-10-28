import type { Metadata } from "next";
import { DashHeader, IntegrationStatus, Panel, Pill, SetupState, formatUtc } from "@/components/dashboard/ui";
import { requireOwner } from "@/lib/auth/guard";
import { getNotionIntegration, type NotionSnapshot } from "@/lib/integrations/notion";
import { FAILURE_LABELS } from "@/lib/integrations/types";

export const metadata: Metadata = { title: "Notion" };
export const dynamic = "force-dynamic";

export default async function NotionDashboardPage() {
  await requireOwner();
  const result = await getNotionIntegration();

  return (
    <>
      <DashHeader title="Notion" description="Titles and edit times from the pages and data sources you explicitly configure. Nothing else in the workspace is searched or read." />
      <IntegrationStatus result={result} />

      {result.state === "unconfigured" && (
        <SetupState
          title="Connect Notion to a scoped set of pages or data sources."
          missing={result.missing}
          steps={[
            "Create an internal integration at notion.so/profile/integrations with read content capability only.",
            "In Notion, share only the intended pages or databases with that integration (… menu → Connections).",
            "Set NOTION_TOKEN plus NOTION_DATA_SOURCE_IDS and/or NOTION_PAGE_IDS (comma-separated IDs) in .env.local or the Vercel environment.",
          ]}
        />
      )}

      {(result.state === "ok" || result.state === "empty") && <NotionBody snapshot={result.data} />}
    </>
  );
}

function NotionBody({ snapshot }: { snapshot: NotionSnapshot }) {
  return (
    <>
      {snapshot.scopes.map((scope) => (
        <Panel key={`${scope.kind}-${scope.id}`} title={`${scope.kind === "page" ? "Page" : "Data source"} ${scope.id.slice(0, 8)}…`}>
          {scope.state === "error" ? (
            <p role="alert" className="text-sm" style={{ color: "#f87171" }}>
              Could not read this {scope.kind === "page" ? "page" : "data source"}: {FAILURE_LABELS[scope.failure]}. {scope.message} It is excluded from the list.
            </p>
          ) : scope.items.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              The query succeeded and returned no pages. <Pill tone="muted">0 rows (confirmed)</Pill>
            </p>
          ) : (
            <>
              <ul className="divide-y" style={{ borderColor: "var(--navy-border)" }}>
                {scope.items.map((item) => (
                  <li key={item.id} className="py-2 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)" }}>
                        {item.title} ↗
                      </a>
                    ) : (
                      <span style={{ color: "var(--text-primary)" }}>{item.title}</span>
                    )}
                    <span className="text-xs font-mono" style={{ color: "var(--text-subtle)" }}>
                      {item.lastEdited ? `edited ${formatUtc(item.lastEdited)}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
              {scope.hasMore && (
                <p className="text-xs mt-2" style={{ color: "var(--text-subtle)" }}>
                  Showing the most recently edited rows only; more exist.
                </p>
              )}
            </>
          )}
        </Panel>
      ))}
    </>
  );
}
