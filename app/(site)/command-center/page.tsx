import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { TOOLCHAIN, type ToolCategory } from "@/data/command-center";

export const metadata: Metadata = {
  title: "Command Center",
  description:
    "The active toolchain powering every project — eight tools across AI, design, development, and operations.",
};

const CATEGORY_ORDER: ToolCategory[] = ["AI", "Design", "Dev", "Ops"];

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  AI: "AI Systems",
  Design: "Design Tools",
  Dev: "Development",
  Ops: "Operations",
};

const CATEGORY_DESCRIPTIONS: Record<ToolCategory, string> = {
  AI: "Language models and intelligent systems used for reasoning, code generation, ideation, and research.",
  Design: "Visual tools for UI design, design systems, rapid prototyping, and component iteration.",
  Dev: "Development environment and version control — where code is written, reviewed, and shipped.",
  Ops: "Deployment and operations infrastructure that keeps every application running in production.",
};

export default function CommandCenterPage() {
  const byCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    tools: TOOLCHAIN.filter((t) => t.category === cat),
  }));

  return (
    <>
      <PageHeader
        breadcrumb="Command Center"
        label="AI Command Center"
        title="Active Toolchain"
        description="Eight tools forming the core operating environment for research, design, build, and deployment. Every project in this hub is built with this stack."
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {CATEGORY_ORDER.map((cat) => {
              const count = TOOLCHAIN.filter((t) => t.category === cat).length;
              return (
                <div
                  key={cat}
                  className="rounded-lg border p-5"
                  style={{
                    backgroundColor: "var(--navy-card)",
                    borderColor: "var(--navy-border)",
                  }}
                >
                  <p
                    className="text-2xl font-bold font-mono mb-1"
                    style={{ color: "var(--cyan)" }}
                  >
                    {count}
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {CATEGORY_LABELS[cat]}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-16">
            {byCategory.map(({ cat, tools }) => (
              <section key={cat}>
                <div
                  className="mb-6 pb-4 border-b"
                  style={{ borderColor: "var(--navy-border)" }}
                >
                  <p
                    className="text-xs font-mono uppercase tracking-widest mb-1"
                    style={{ color: "var(--cyan)", letterSpacing: "0.15em" }}
                  >
                    {CATEGORY_LABELS[cat]}
                  </p>
                  <p
                    className="text-sm max-w-xl"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {CATEGORY_DESCRIPTIONS[cat]}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {tools.map((tool) => (
                    <div
                      key={tool.name}
                      className="card-hover rounded-lg border p-6"
                      style={{
                        backgroundColor: "var(--navy-card)",
                        borderColor: "rgba(30, 45, 90, 0.6)",
                      }}
                    >
                      <h3
                        className="text-base font-semibold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {tool.name}
                      </h3>
                      <p
                        className="text-sm leading-relaxed mb-5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {tool.role}
                      </p>
                      <div>
                        <p
                          className="text-xs font-mono uppercase mb-2"
                          style={{
                            color: "var(--text-subtle)",
                            letterSpacing: "0.1em",
                          }}
                        >
                          Used for
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {tool.usedFor.map((use) => (
                            <span
                              key={use}
                              className="text-xs px-2 py-1 rounded font-mono"
                              style={{
                                backgroundColor: "var(--navy-800)",
                                color: "var(--text-subtle)",
                              }}
                            >
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
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
              style={{ color: "var(--gold)", letterSpacing: "0.15em" }}
            >
              Workflow
            </p>
            <h2
              className="text-xl font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              How the tools connect
            </h2>
            <p
              className="text-sm leading-relaxed max-w-2xl"
              style={{ color: "var(--text-muted)" }}
            >
              Research and ideation happen in ChatGPT. Architecture and code generation
              happen in Claude inside VS Code. UI design and component systems are built
              with Claude Design and validated in Spark. Code is versioned in GitHub and
              deployed automatically to Vercel. Everything is planned and documented in
              Notion command centers.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
