import { type DeployState, stateLabel, stateColor, stateBg } from "@/lib/vercel";

const PULSING: Set<DeployState> = new Set(["BUILDING", "INITIALIZING", "QUEUED"]);

export default function DeploymentStatus({ state }: { state: DeployState | null }) {
  const pulse = state !== null && PULSING.has(state);

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ color: stateColor(state), backgroundColor: stateBg(state) }}
    >
      {pulse && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse inline-block flex-shrink-0"
          style={{ backgroundColor: stateColor(state) }}
        />
      )}
      {stateLabel(state)}
    </span>
  );
}
