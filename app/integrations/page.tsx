import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import IntegrationCard from "@/components/integration-card";
import {
  INTEGRATIONS,
  CATEGORY_ORDER,
  CATEGORY_DESCRIPTIONS,
  type IntegrationCategory,
} from "@/data/integrations";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "Eight API integrations planned for Phase 3 live integrations — GitHub, Vercel, Notion, Claude, OpenAI, Google Sheets, Analytics, and Email.",
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

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    integrations: INTEGRATIONS.filter((i) => i.category === cat),
  }));

  return (
    <>
      <PageHeader
        breadcrumb="Integrations"
        label="Live Integrations"
        title="API Readiness"
        description="Eight integrations planned for Phase 3. Each entry documents its purpose, the data it will surface, the required environment variables, its safety constraints, and its target sprint — ready to wire up when the phase begins."
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <SummaryCard
              value={String(INTEGRATIONS.length)}
              label="Total Integrations"
              accent="var(--cyan)"
            />
            <SummaryCard
              value={String(active)}
              label="Active"
              accent="var(--cyan)"
            />
            <SummaryCard
              value={String(planned)}
              label="Planned"
              accent="var(--gold)"
            />
            <SummaryCard
              value={String(CATEGORY_ORDER.length)}
              label="Categories"
              accent="var(--gold)"
            />
          </div>

          <div className="space-y-20">
            {byCategory.map(({ cat, integrations }) => (
              <section key={cat}>
                <div
                  className="mb-8 pb-4 border-b"
                  style={{ borderColor: "var(--navy-border)" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_ACCENT[cat] }}
                    />
                    <p
                      className="text-xs font-mono uppercase tracking-widest"
                      style={{
                        color: CATEGORY_ACCENT[cat],
                        letterSpacing: "0.15em",
                      }}
                    >
                      {cat}
                    </p>
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: "var(--navy-800)",
                        color: "var(--text-subtle)",
                      }}
                    >
                      {integrations.length}
                    </span>
                  </div>
                  <p
                    className="text-sm max-w-xl"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {CATEGORY_DESCRIPTIONS[cat]}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {integrations.map((integration) => (
                    <IntegrationCard
                      key={integration.name}
                      integration={integration}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div
            className="mt-20 rounded-lg border p-8"
            style={{
              backgroundColor: "var(--navy-card)",
              borderColor: "var(--navy-border)",
            }}
          >
            <p
              className="text-xs font-mono uppercase tracking-widest mb-3"
              style={{ color: "var(--gold)", letterSpacing: "0.2em" }}
            >
              Security Policy
            </p>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              How integrations are kept safe
            </h2>
            <ul className="space-y-3 max-w-2xl">
              {[
                "All API keys are stored as server-side environment variables only — never in client bundles or public files.",
                "Private integrations (Vercel, Notion, OpenAI) use Next.js Server Components or Route Handlers to keep secrets off the client.",
                "Public integrations (GitHub public repo data) require no token for basic reads but use one to avoid rate limiting.",
                "No real credentials appear in this repository. All env var names shown here are placeholders for documentation purposes.",
                "Every integration goes through a safety review before it is wired up to a live environment.",
              ].map((rule) => (
                <li
                  key={rule}
                  className="flex items-start gap-3 text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "var(--cyan)" }}
                  />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}

function SummaryCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-lg border p-5 stat-border"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "var(--navy-border)",
        borderLeft: `2px solid ${accent}`,
      }}
    >
      <p className="text-3xl font-bold font-mono mb-1" style={{ color: accent }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
    </div>
  );
}
