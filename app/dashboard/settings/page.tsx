import type { Metadata } from "next";
import IntegrationCard from "@/components/integration-card";
import { DashHeader, Panel, Pill } from "@/components/dashboard/ui";
import { INTEGRATIONS } from "@/data/integrations";
import { requireOwner } from "@/lib/auth/guard";
import { getAuthConfigStatus } from "@/lib/auth/owner";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

// Names only. Values are never read into the rendered output; only whether
// each variable is set.
const ENV_GROUPS: { group: string; names: string[] }[] = [
  { group: "Authentication", names: ["AUTH_SECRET", "AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET", "OWNER_GITHUB_IDS"] },
  { group: "GitHub", names: ["GITHUB_TOKEN"] },
  { group: "Vercel", names: ["VERCEL_TOKEN", "VERCEL_TEAM_ID"] },
  { group: "Notion", names: ["NOTION_TOKEN", "NOTION_DATA_SOURCE_IDS", "NOTION_PAGE_IDS", "NOTION_API_VERSION"] },
];

export default async function SettingsPage() {
  const owner = await requireOwner();
  const auth = getAuthConfigStatus();

  return (
    <>
      <DashHeader title="Settings" description="Read-only configuration status. Variables are set in .env.local or the Vercel project environment; values are never displayed." />
      <Panel title="Authentication">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          <Pill tone={auth.configured ? "ok" : "bad"}>{auth.configured ? "configured" : "not configured"}</Pill> Signed in as {owner.name ?? "owner"} via GitHub OAuth (allowlist enforced server-side by numeric GitHub user ID).
        </p>
      </Panel>
      <Panel title="Environment variables">
        <div className="space-y-4">
          {ENV_GROUPS.map(({ group, names }) => (
            <div key={group}>
              <p className="text-xs font-mono uppercase mb-1" style={{ color: "var(--text-subtle)" }}>{group}</p>
              <ul className="flex flex-wrap gap-2">
                {names.map((n) => (
                  <li key={n}>
                    <code className="text-xs font-mono mr-1" style={{ color: "var(--cyan)" }}>{n}</code>
                    <Pill tone={process.env[n]?.trim() ? "ok" : "muted"}>{process.env[n]?.trim() ? "set" : "not set"}</Pill>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>
      <section aria-labelledby="specs">
        <h2 id="specs" className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Integration specifications
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {INTEGRATIONS.map((i) => (
            <IntegrationCard key={i.name} integration={i} />
          ))}
        </div>
      </section>
    </>
  );
}
