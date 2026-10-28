import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashHeader, Panel, Pill } from "@/components/dashboard/ui";
import { REGISTRY, computeHealthScore } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Project" };
export const dynamic = "force-dynamic";

export default async function DashboardProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner();
  const { id } = await params;
  const p = REGISTRY.find((x) => x.id === id);
  if (!p) notFound();

  const rows: [string, string | undefined][] = [
    ["Zone", p.zone],
    ["Stream", p.portfolioStream],
    ["Asset type", p.assetType],
    ["Operating status", p.operatingStatus],
    ["Commercial status", p.commercialStatus],
    ["Evidence", p.evidenceStatus],
    ["Visibility", p.visibility],
    ["Priority", p.priority],
    ["Owner gate", p.ownerGate],
    ["Next decision", p.nextDecision],
    ["Next action", p.nextAction],
    ["Parent", p.parentProject],
    ["Last reviewed", p.lastReviewed],
    ["Vercel project", p.vercelProject],
  ];

  return (
    <>
      <p className="text-xs">
        <Link href="/dashboard/projects" style={{ color: "var(--cyan)" }}>
          ← Projects
        </Link>
      </p>
      <DashHeader title={p.name} description={p.description} />
      <Panel title="Registry record">
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {rows
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-mono uppercase" style={{ color: "var(--text-subtle)" }}>
                  {k}
                </dt>
                <dd style={{ color: "var(--text-muted)" }}>{v}</dd>
              </div>
            ))}
        </dl>
      </Panel>
      <Panel title="Links (declared)">
        <div className="flex flex-wrap gap-4 text-sm">
          {p.websiteUrl && (
            <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)" }}>
              Declared live URL ↗
            </a>
          )}
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)" }}>
              Repository ↗
            </a>
          )}
          {p.notionUrl && (
            <a href={p.notionUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
              Notion ↗
            </a>
          )}
          {!p.websiteUrl && !p.githubUrl && !p.notionUrl && <span style={{ color: "var(--text-subtle)" }}>No links declared.</span>}
        </div>
      </Panel>
      <Panel title="Registry completeness score">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          <Pill tone="muted">{computeHealthScore(p)} / 100</Pill> A registry-field checklist (evidence, links, next action, review date, priority). It is not a measure of deployment or business health.
        </p>
      </Panel>
    </>
  );
}
