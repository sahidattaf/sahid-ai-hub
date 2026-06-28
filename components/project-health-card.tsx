import type { RegistryProject } from "@/data/project-registry";

function scoreColor(score: number): string {
  if (score >= 80) return "var(--cyan)";
  if (score >= 60) return "var(--gold)";
  if (score >= 40) return "#f59e0b";
  return "#f87171";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
}

const FACTORS: {
  label: string;
  check: (p: RegistryProject) => boolean;
}[] = [
  { label: "Live website",    check: (p) => Boolean(p.websiteUrl) },
  { label: "GitHub repo",     check: (p) => Boolean(p.githubUrl) },
  { label: "Status: Live",    check: (p) => p.status === "Live" },
  { label: "High priority",   check: (p) => p.priority === "High" },
  { label: "Next action set", check: (p) => Boolean(p.nextAction) },
];

export default function ProjectHealthCard({
  project,
  score,
}: {
  project: RegistryProject;
  score: number;
}) {
  const color = scoreColor(score);
  const label = scoreLabel(score);
  const filled = Math.round(score / 20);

  return (
    <div
      className="rounded-lg border p-6"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "rgba(30, 45, 90, 0.6)",
      }}
    >
      <p
        className="text-xs font-mono uppercase tracking-widest mb-4"
        style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
      >
        Health Score
      </p>

      <div className="flex items-end gap-3 mb-2">
        <span className="text-5xl font-bold font-mono" style={{ color }}>
          {score}
        </span>
        <span className="text-sm mb-2 font-mono" style={{ color: "var(--text-subtle)" }}>
          / 100
        </span>
      </div>

      <p className="text-sm font-semibold mb-4" style={{ color }}>
        {label}
      </p>

      {/* Progress bar */}
      <div className="flex gap-1.5 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{
              backgroundColor: i < filled ? color : "var(--navy-border)",
            }}
          />
        ))}
      </div>

      {/* Factor breakdown */}
      <div className="space-y-2 mb-6">
        {FACTORS.map(({ label: factorLabel, check }) => {
          const active = check(project);
          return (
            <div
              key={factorLabel}
              className="flex items-center justify-between text-xs font-mono"
            >
              <span style={{ color: active ? "var(--text-muted)" : "var(--text-subtle)" }}>
                {factorLabel}
              </span>
              <span style={{ color: active ? "var(--cyan)" : "var(--navy-border)" }}>
                {active ? "+20" : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Next action */}
      <div
        className="rounded px-3 py-3 mb-5"
        style={{ backgroundColor: "var(--navy-800)" }}
      >
        <p
          className="text-xs font-mono uppercase mb-1"
          style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
        >
          Next Action
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {project.nextAction}
        </p>
      </div>

      {/* Stack */}
      <p
        className="text-xs font-mono uppercase mb-2"
        style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
      >
        Stack
      </p>
      <div className="flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-0.5 rounded font-mono border"
            style={{ borderColor: "var(--navy-border)", color: "var(--text-subtle)" }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
