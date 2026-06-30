import type { HealthScoreResult } from "@/types/github";

export default function RepositoryHealth({ health }: { health: HealthScoreResult }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-xs font-mono uppercase tracking-wider"
          style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
        >
          Health
        </span>
        <span
          className="text-xs font-mono font-semibold"
          style={{ color: health.color }}
        >
          {health.score} · {health.label}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(100, 116, 139, 0.2)" }}
        role="progressbar"
        aria-valuenow={health.score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Health score ${health.score} out of 100`}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${health.score}%`, backgroundColor: health.color }}
        />
      </div>
      <p
        className="text-xs mt-2 leading-snug"
        style={{ color: "var(--text-subtle)" }}
      >
        {health.nextAction}
      </p>
    </div>
  );
}
