import type { Metadata } from "next";
import { DashHeader, Panel, Pill, SetupState } from "@/components/dashboard/ui";
import { REGISTRY } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Investors" };
export const dynamic = "force-dynamic";

export default async function InvestorsPage() {
  await requireOwner();
  // Only registry entries that explicitly mention investors are surfaced; nothing is inferred.
  const readiness = REGISTRY.filter((p) => /investor/i.test(`${p.nextAction} ${p.nextDecision ?? ""} ${p.description}`));

  return (
    <>
      <DashHeader title="Investors" description="No investor, contact or fundraising records are stored in this application. Only registry projects that mention investor readiness are listed, with their declared evidence status." />
      <SetupState
        title="No investor data source is connected."
        missing={["(no investor integration exists yet)"]}
        steps={["Investor contacts and pipeline belong in a private system of record (CRM or Notion database) read through a scoped, server-side integration.", "Do not add investor records to this repository."]}
      />
      <Panel title="Registry entries that mention investor readiness">
        {readiness.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No registry entries mention investors.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {readiness.map((p) => (
              <li key={p.id}>
                <span style={{ color: "var(--text-primary)" }}>{p.name}</span> <Pill tone={p.evidenceStatus === "Verified" ? "ok" : "warn"}>Evidence: {p.evidenceStatus}</Pill>
                <br />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.nextDecision ?? p.nextAction}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
