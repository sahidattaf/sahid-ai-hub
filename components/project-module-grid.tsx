type ModuleState = "available" | "planned" | "future";

interface ProjectModule {
  id: string;
  name: string;
  description: string;
  state: ModuleState;
}

const PROJECT_MODULES: ProjectModule[] = [
  {
    id: "overview",
    name: "Overview",
    description: "Project brief, goals, architecture decisions, and current sprint status.",
    state: "available",
  },
  {
    id: "kpis",
    name: "KPIs",
    description: "Key performance indicators — traffic, uptime, conversion, and revenue targets.",
    state: "planned",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Commit history, open PRs, issues, and repository health from GitHub API.",
    state: "available",
  },
  {
    id: "deployments",
    name: "Deployments",
    description: "Live deployment history, build status, and rollback capabilities via Vercel.",
    state: "available",
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    description: "Agents assigned to this project — run history, prompts, and output logs.",
    state: "planned",
  },
  {
    id: "documents",
    name: "Documents",
    description: "SOPs, design specs, contracts, and reference materials for this project.",
    state: "future",
  },
  {
    id: "meetings",
    name: "Meetings",
    description: "Logged meetings, decisions, and action items linked to this project.",
    state: "future",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Traffic trends, user behavior, and performance data from Vercel Analytics.",
    state: "planned",
  },
];

const STATE_META: Record<
  ModuleState,
  { label: string; className: string; color: string }
> = {
  available: { label: "Active",   className: "badge-live",     color: "var(--cyan)" },
  planned:   { label: "Planned",  className: "badge-prototype", color: "var(--gold)" },
  future:    { label: "Future",   className: "badge-planning",  color: "var(--text-subtle)" },
};

export default function ProjectModuleGrid() {
  return (
    <div>
      <p
        className="text-xs font-mono uppercase tracking-widest mb-4"
        style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
      >
        Project Modules
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PROJECT_MODULES.map(({ id, name, description, state }) => {
          const meta = STATE_META[state];
          return (
            <div
              key={id}
              className="rounded-lg border p-4 flex flex-col"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor:
                  state === "available"
                    ? "rgba(34, 211, 238, 0.15)"
                    : "rgba(30, 45, 90, 0.6)",
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: meta.color }}
                >
                  {name}
                </p>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-mono flex-shrink-0 ${meta.className}`}
                >
                  {meta.label}
                </span>
              </div>
              <p
                className="text-xs leading-relaxed flex-1"
                style={{ color: "var(--text-subtle)" }}
              >
                {description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
