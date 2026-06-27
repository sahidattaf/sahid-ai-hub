import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { ROADMAP, type RoadmapPhase } from "@/data/command-center";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Five-phase build progression — from public front door to a fully live AI-powered command center.",
};

function phaseStatusClass(status: RoadmapPhase["status"]): string {
  const map: Record<RoadmapPhase["status"], string> = {
    Complete: "phase-complete",
    Active: "phase-active",
    Planned: "phase-planned",
  };
  return map[status];
}

export default function RoadmapPage() {
  const complete = ROADMAP.filter((p) => p.status === "Complete").length;
  const active = ROADMAP.filter((p) => p.status === "Active").length;
  const planned = ROADMAP.filter((p) => p.status === "Planned").length;

  return (
    <>
      <PageHeader
        breadcrumb="Roadmap"
        label="Build Progression"
        title="Roadmap"
        description="Five phases taking Sahid AI Hub from a static public front door to a live, integrated, AI-powered operating system. Each phase ships something real."
      />
      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-14">
            <div
              className="rounded-lg border p-5 text-center"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "var(--navy-border)",
              }}
            >
              <p
                className="text-3xl font-bold font-mono mb-1"
                style={{ color: "var(--cyan)" }}
              >
                {complete}
              </p>
              <p className="text-xs font-mono phase-complete px-2 py-0.5 rounded-full inline-block">
                Complete
              </p>
            </div>
            <div
              className="rounded-lg border p-5 text-center"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "var(--navy-border)",
              }}
            >
              <p
                className="text-3xl font-bold font-mono mb-1"
                style={{ color: "var(--gold)" }}
              >
                {active}
              </p>
              <p className="text-xs font-mono phase-active px-2 py-0.5 rounded-full inline-block">
                Active
              </p>
            </div>
            <div
              className="rounded-lg border p-5 text-center"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "var(--navy-border)",
              }}
            >
              <p
                className="text-3xl font-bold font-mono mb-1"
                style={{ color: "var(--text-subtle)" }}
              >
                {planned}
              </p>
              <p className="text-xs font-mono phase-planned px-2 py-0.5 rounded-full inline-block">
                Planned
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {ROADMAP.map(({ phase, title, description, status, deliverables }) => (
              <div
                key={phase}
                className="card-hover rounded-lg border p-7"
                style={{
                  backgroundColor: "var(--navy-card)",
                  borderColor:
                    status === "Active"
                      ? "rgba(212, 168, 67, 0.35)"
                      : "rgba(30, 45, 90, 0.6)",
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p
                      className="text-xs font-mono uppercase mb-1"
                      style={{
                        color: "var(--text-subtle)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {phase}
                    </p>
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {title}
                    </h2>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-mono flex-shrink-0 ${phaseStatusClass(status)}`}
                  >
                    {status}
                  </span>
                </div>

                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  {description}
                </p>

                <div>
                  <p
                    className="text-xs font-mono uppercase mb-3"
                    style={{
                      color: "var(--text-subtle)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Deliverables
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <span
                          className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              status === "Complete"
                                ? "var(--cyan)"
                                : status === "Active"
                                  ? "var(--gold)"
                                  : "var(--text-subtle)",
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
