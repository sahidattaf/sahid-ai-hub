import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import IntegrationCard from "@/components/integration-card";
import { INTEGRATIONS, CATEGORY_ORDER, CATEGORY_DESCRIPTIONS, type IntegrationCategory } from "@/data/integrations";

export const metadata: Metadata = {
  title: "Integrations",
  description: "Platforms used by the Sahid AI Hub and their current status.",
};

const CATEGORY_ACCENT: Record<IntegrationCategory, string> = {
  AI: "var(--cyan)",
  Data: "var(--gold)",
  Ops: "var(--text-subtle)",
  Communication: "#4ade80",
};

export default function IntegrationsPage() {
  const active = INTEGRATIONS.filter((i) => i.status === "Active").length;
  const planned = INTEGRATIONS.filter((i) => i.status === "Planned").length;
  const byCategory = CATEGORY_ORDER.map((cat) => ({ cat, integrations: INTEGRATIONS.filter((i) => i.category === cat) }));

  return (
    <>
      <PageHeader breadcrumb="Integrations" label="Integrations" title="Platforms" description="Platforms used by the hub and their current status." />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-16">
            <SummaryCard value={String(INTEGRATIONS.length)} label="Platforms" accent="var(--cyan)" />
            <SummaryCard value={String(active)} label="Active" accent="var(--cyan)" />
            <SummaryCard value={String(planned)} label="Planned" accent="var(--gold)" />
          </div>
          <div className="space-y-12">
            {byCategory.map(({ cat, integrations }) => (
              <section key={cat}>
                <div className="mb-6 pb-4 border-b" style={{ borderColor: "var(--navy-border)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_ACCENT[cat] }} />
                    <p className="text-xs font-mono uppercase tracking-widest" style={{ color: CATEGORY_ACCENT[cat], letterSpacing: "0.15em" }}>
                      {cat}
                    </p>
                  </div>
                  <p className="text-sm max-w-xl" style={{ color: "var(--text-muted)" }}>
                    {CATEGORY_DESCRIPTIONS[cat]}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {integrations.map((integration) => (
                    <IntegrationCard key={integration.name} integration={integration} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function SummaryCard({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div className="rounded-lg border p-5 stat-border" style={{ backgroundColor: "var(--navy-card)", borderColor: "var(--navy-border)", borderLeft: `2px solid ${accent}` }}>
      <p className="text-3xl font-bold font-mono mb-1" style={{ color: accent }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}
