import type { Metadata } from "next";
import { DashHeader, Panel, SetupState, StatTile } from "@/components/dashboard/ui";
import { REVENUE_STREAMS } from "@/data/command-center";
import { REGISTRY, type CommercialStatus } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Revenue" };
export const dynamic = "force-dynamic";

const STATUSES: CommercialStatus[] = ["Revenue Operating", "Commercialization", "Pilot", "Pre-Revenue", "Internal", "Not Applicable"];

export default async function RevenuePage() {
  await requireOwner();
  const counts = STATUSES.map((s) => ({ status: s, projects: REGISTRY.filter((p) => p.commercialStatus === s) })).filter((c) => c.projects.length > 0);

  return (
    <>
      <DashHeader title="Revenue" description="Revenue is not measured here. This page shows the owner-declared commercial classification of each registry project and the revenue stream categories; no amounts are displayed because none are connected." />
      <SetupState
        title="No revenue data source is connected."
        missing={["(no revenue integration exists yet)"]}
        steps={["Revenue figures need a source of record (for example Stripe, accounting export or a Notion database).", "Until one is added, treat every status below as a declaration, not a result."]}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {counts.map(({ status, projects }) => (
          <StatTile key={status} label={status} value={projects.length} note={projects.map((p) => p.name).join(", ")} />
        ))}
      </div>
      <Panel title="Revenue stream categories (planning definitions, no figures)">
        <ul className="grid md:grid-cols-2 gap-3 text-sm">
          {REVENUE_STREAMS.map((s) => (
            <li key={s.name}>
              <span style={{ color: "var(--text-primary)" }}>{s.name}</span>{" "}
              <span className="text-xs font-mono" style={{ color: "var(--text-subtle)" }}>{s.incomeType}</span>
              <br />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.description}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
