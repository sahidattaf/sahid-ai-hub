import DeploymentStatus from "./deployment-status";
import {
  type VercelProjectRow,
  productionUrl,
  productionState,
  productionTimestamp,
  githubUrl,
  frameworkLabel,
  timeAgo,
} from "@/lib/vercel";

export default function VercelProjectCard({ row }: { row: VercelProjectRow }) {
  const { project, latestDeploy } = row;

  const liveUrl = productionUrl(project);
  const state = productionState(project);
  const ts = productionTimestamp(project) ?? latestDeploy?.createdAt ?? null;
  const repoUrl = githubUrl(project);
  const framework = frameworkLabel(project.framework);

  const commitMsg = latestDeploy?.meta?.githubCommitMessage
    ?.split("\n")[0]
    ?.slice(0, 80);
  const commitRef = latestDeploy?.meta?.githubCommitRef;

  return (
    <div
      className="card-hover flex flex-col rounded-lg border p-6"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "rgba(30, 45, 90, 0.6)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {project.name}
          </h3>
          <p
            className="text-xs font-mono mt-0.5"
            style={{ color: "var(--text-subtle)" }}
          >
            {framework}
          </p>
        </div>
        <DeploymentStatus state={state} />
      </div>

      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono mb-3 truncate block"
          style={{ color: "var(--cyan)" }}
        >
          {liveUrl.replace("https://", "")}
        </a>
      )}

      {commitMsg && (
        <div className="mb-4">
          <p
            className="text-xs line-clamp-2 leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {commitRef && (
              <span
                className="font-mono mr-1.5 text-xs"
                style={{ color: "var(--text-subtle)" }}
              >
                {commitRef}
              </span>
            )}
            {commitMsg}
          </p>
        </div>
      )}

      <div className="flex-1" />

      <div
        className="pt-4 border-t flex items-center justify-between gap-3"
        style={{ borderColor: "var(--navy-border)" }}
      >
        <span
          className="text-xs font-mono"
          style={{ color: "var(--text-subtle)" }}
        >
          {ts ? timeAgo(ts) : "No deployments"}
        </span>
        <div className="flex gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium"
              style={{ color: "var(--cyan)" }}
            >
              Live
            </a>
          )}
          {liveUrl && repoUrl && (
            <span style={{ color: "var(--navy-border)" }}>|</span>
          )}
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium"
              style={{ color: "var(--text-subtle)" }}
            >
              Repo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
