import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "Live Apps",
  description:
    "Six publicly deployed Vercel applications by Sahid Attaf — direct links, tech stacks, and categories.",
};

const LIVE = PROJECTS.filter((p) => p.status === "Live" && p.live);

export default function LiveAppsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Live Apps"
        label="Vercel Deployments"
        title="Live Applications"
        description="Six publicly accessible applications deployed on Vercel. Each is live, functional, and linked below."
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {LIVE.map((app, index) => (
              <AppCard key={app.title} app={app} index={index} />
            ))}
          </div>

          <div
            className="mt-16 rounded-lg border p-8"
            style={{
              backgroundColor: "var(--navy-card)",
              borderColor: "var(--navy-border)",
            }}
          >
            <p
              className="text-xs font-mono uppercase tracking-widest mb-3"
              style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
            >
              Deployment Platform
            </p>
            <h2
              className="text-xl font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              All apps deploy via Vercel
            </h2>
            <p
              className="text-sm leading-relaxed max-w-xl"
              style={{ color: "var(--text-muted)" }}
            >
              Every application in this hub is deployed through Vercel with
              automated CI/CD from GitHub. Each push to the main branch triggers
              a production deployment with preview URLs for every pull request.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              {["Automated CI/CD", "Preview URLs", "Edge Network", "GitHub Integration", "Zero-downtime deploys"].map(
                (feat) => (
                  <span
                    key={feat}
                    className="text-xs px-3 py-1 rounded font-mono border"
                    style={{
                      borderColor: "var(--navy-border)",
                      color: "var(--text-subtle)",
                    }}
                  >
                    {feat}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function AppCard({
  app,
  index,
}: {
  app: (typeof LIVE)[number];
  index: number;
}) {
  return (
    <div
      className="card-hover rounded-lg border p-7 flex flex-col"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "rgba(30, 45, 90, 0.6)",
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <span
            className="text-xs font-mono"
            style={{ color: "var(--text-subtle)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2
            className="text-lg font-semibold mt-1"
            style={{ color: "var(--text-primary)" }}
          >
            {app.title}
          </h2>
          <p
            className="text-xs font-mono mt-0.5"
            style={{ color: "var(--text-subtle)" }}
          >
            {app.category}
          </p>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-mono flex-shrink-0 badge-live"
        >
          Live
        </span>
      </div>

      <p
        className="text-sm leading-relaxed mb-6 flex-1"
        style={{ color: "var(--text-muted)" }}
      >
        {app.description}
      </p>

      <div className="mb-5">
        <p
          className="text-xs font-mono uppercase mb-2"
          style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
        >
          Tech Stack
        </p>
        <div className="flex flex-wrap gap-2">
          {app.techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 rounded font-mono"
              style={{
                backgroundColor: "var(--navy-800)",
                color: "var(--text-subtle)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div
        className="pt-5 border-t flex gap-4"
        style={{ borderColor: "var(--navy-border)" }}
      >
        <a
          href={app.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 text-xs font-medium rounded transition-all"
          style={{
            backgroundColor: "var(--cyan)",
            color: "var(--navy-950)",
          }}
        >
          Open Live App
        </a>
        {app.repo && (
          <a
            href={app.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-xs font-medium rounded border transition-all"
            style={{
              borderColor: "var(--navy-border)",
              color: "var(--text-muted)",
            }}
          >
            View Repository
          </a>
        )}
      </div>
    </div>
  );
}
