import type { Metadata } from "next";
import Link from "next/link";
import { DashHeader, Panel, Pill, StatTile } from "@/components/dashboard/ui";
import { REGISTRY, getRegistryStats, getGithubTargets, getVercelTargets } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";
import { DASHBOARD_NAV } from "@/lib/dashboard-nav";
import { readNotionConfig } from "@/lib/integrations/notion";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

// No provider calls here: the overview reports registry totals and whether each
// integration is configured. Live status and freshness live on each page.
export default async function DashboardOverviewPage() {
  const owner = await requireOwner();
  const stats = getRegistryStats();
  const notion = readNotionConfig(process.env);
  const integrations = [
    { name: "GitHub", href: "/dashboard/github", configured: Boolean(process.env.GITHUB_TOKEN?.trim()), scope: `${getGithubTargets().length} repositories in registry` },
    { name: "Vercel", href: "/dashboard/vercel", configured: Boolean(process.env.VERCEL_TOKEN?.trim()), scope: `${getVercelTargets().length} Vercel projects in registry` },
    { name: "Notion", href: "/dashboard/notion", configured: notion.ok, scope: notion.ok ? `${notion.config.dataSourceIds.length} data sources, ${notion.config.pageIds.length} pages` : "no scope configured" },
  ];

  return (
    <>
      <DashHeader title={`Welcome${owner.name ? `, ${owner.name}` : ""}`} description="Owner command center. All figures below are derived from the project registry; integration data is fetched on its own page with source and freshness shown." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Registry projects" value={stats.total} />
        <StatTile label="Private / hybrid" value={REGISTRY.filter((p) => p.visibility !== "Public").length} />
        <StatTile label="Active / pilot" value={stats.active} />
        <StatTile label="Evidence follow-up" value={stats.needsEvidence} />
      </div>
      <Panel title="Integrations">
        <ul className="space-y-3">
          {integrations.map((i) => (
            <li key={i.name} className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <Link href={i.href} style={{ color: "var(--cyan)" }}>{i.name}</Link>
              <span className="text-xs" style={{ color: "var(--text-subtle)" }}>{i.scope}</span>
              <Pill tone={i.configured ? "ok" : "warn"}>{i.configured ? "credentials set" : "setup required"}</Pill>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Destinations">
        <ul className="grid sm:grid-cols-2 gap-3">
          {DASHBOARD_NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="text-sm" style={{ color: "var(--cyan)" }}>{n.label}</Link>
              <p className="text-xs" style={{ color: "var(--text-subtle)" }}>{n.description}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
