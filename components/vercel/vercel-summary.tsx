import { type VercelSummaryStats } from "@/lib/vercel";

export default function VercelSummary({ stats }: { stats: VercelSummaryStats }) {
  const items = [
    { label: "Total Projects", value: stats.total, color: "var(--cyan)" },
    { label: "Ready", value: stats.ready, color: "var(--cyan)" },
    {
      label: "Failed",
      value: stats.failed,
      color: stats.failed > 0 ? "#ef4444" : "var(--text-subtle)",
    },
    { label: "Deployments (24h)", value: stats.recentCount, color: "var(--gold)" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(({ label, value, color }) => (
        <div
          key={label}
          className="rounded-lg border p-5 stat-border"
          style={{
            backgroundColor: "var(--navy-card)",
            borderColor: "var(--navy-border)",
          }}
        >
          <p
            className="text-2xl font-bold font-mono mb-1"
            style={{ color }}
          >
            {value}
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
