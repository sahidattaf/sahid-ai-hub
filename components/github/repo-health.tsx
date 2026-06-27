import { timeAgo } from "@/lib/github";

interface RepoHealthProps {
  stars: number;
  forks: number;
  issues: number;
  pushedAt: string;
}

export default function RepoHealth({
  stars,
  forks,
  issues,
  pushedAt,
}: RepoHealthProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <HealthStat label="Stars" value={stars} accent="var(--gold)" />
      <HealthStat label="Forks" value={forks} accent="var(--text-subtle)" />
      <HealthStat
        label="Issues"
        value={issues}
        accent={issues > 5 ? "var(--gold)" : "var(--text-subtle)"}
      />
      <span
        className="text-xs font-mono"
        style={{ color: "var(--text-subtle)" }}
      >
        pushed {timeAgo(pushedAt)}
      </span>
    </div>
  );
}

function HealthStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs font-mono" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
        {label.toLowerCase()}
      </span>
    </div>
  );
}
