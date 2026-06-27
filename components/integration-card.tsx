import {
  type Integration,
  type IntegrationStatus,
  type DataPrivacy,
  type IntegrationCategory,
} from "@/data/integrations";

function statusClass(status: IntegrationStatus): string {
  return status === "Active" ? "badge-live" : "badge-planning";
}

function privacyClass(privacy: DataPrivacy): string {
  const map: Record<DataPrivacy, string> = {
    Public: "badge-public",
    Private: "badge-private",
    Hybrid: "badge-hybrid",
  };
  return map[privacy];
}

function categoryAccent(category: IntegrationCategory): string {
  const map: Record<IntegrationCategory, string> = {
    AI: "var(--cyan)",
    Data: "var(--gold)",
    Ops: "var(--text-subtle)",
    Communication: "#4ade80",
  };
  return map[category];
}

export default function IntegrationCard({
  integration,
}: {
  integration: Integration;
}) {
  const {
    name,
    category,
    status,
    privacy,
    purpose,
    futureData,
    envVars,
    safetyRule,
    sprintTarget,
  } = integration;

  return (
    <div
      className="card-hover flex flex-col rounded-lg border"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "rgba(30, 45, 90, 0.6)",
        borderTop: `2px solid ${categoryAccent(category)}`,
      }}
    >
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3
            className="text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {name}
          </h3>
          <div className="flex gap-1.5 flex-shrink-0">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusClass(status)}`}
            >
              {status}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-mono ${privacyClass(privacy)}`}
            >
              {privacy}
            </span>
          </div>
        </div>

        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          {purpose}
        </p>

        <div className="space-y-5">
          <div>
            <p
              className="text-xs font-mono uppercase mb-2"
              style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
            >
              Future data to fetch
            </p>
            <ul className="space-y-1">
              {futureData.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: categoryAccent(category) }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              className="text-xs font-mono uppercase mb-2"
              style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
            >
              Environment variables
            </p>
            <div className="flex flex-wrap gap-2">
              {envVars.map((env) => (
                <code
                  key={env}
                  className="text-xs px-2 py-1 rounded font-mono"
                  style={{
                    backgroundColor: "var(--navy-800)",
                    color: "var(--cyan)",
                    border: "1px solid rgba(34, 211, 238, 0.12)",
                  }}
                >
                  {env}
                </code>
              ))}
            </div>
          </div>

          <div
            className="rounded p-3"
            style={{
              backgroundColor: "rgba(212, 168, 67, 0.06)",
              border: "1px solid rgba(212, 168, 67, 0.15)",
            }}
          >
            <p
              className="text-xs font-mono uppercase mb-1.5"
              style={{ color: "var(--gold)", letterSpacing: "0.1em" }}
            >
              Safety rule
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {safetyRule}
            </p>
          </div>
        </div>
      </div>

      <div
        className="px-6 py-4 border-t flex items-center justify-between"
        style={{ borderColor: "var(--navy-border)" }}
      >
        <p
          className="text-xs font-mono uppercase"
          style={{ color: "var(--text-subtle)", letterSpacing: "0.08em" }}
        >
          Target
        </p>
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {sprintTarget}
        </p>
      </div>
    </div>
  );
}
