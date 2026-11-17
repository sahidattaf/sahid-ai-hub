import { type Integration, type IntegrationStatus } from "@/data/integrations";

function statusClass(status: IntegrationStatus): string {
  return status === "Active" ? "badge-live" : "badge-planning";
}

export default function IntegrationCard({ integration }: { integration: Integration }) {
  const { name, status } = integration;
  return (
    <div className="card-hover flex items-center justify-between rounded-lg border px-5 py-4" style={{ backgroundColor: "var(--navy-card)", borderColor: "rgba(30, 45, 90, 0.6)" }}>
      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {name}
      </h3>
      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusClass(status)}`}>{status}</span>
    </div>
  );
}
