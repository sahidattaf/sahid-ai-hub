import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import ProjectCard from "@/components/project-card";
import { PROJECTS } from "@/data/projects";
import { ZONES } from "@/data/command-center";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "All six live projects by Sahid Attaf — status, visibility, zone, tech stack, and next actions.",
};

const ZONE_ORDER = [
  "Proof of Work",
  "Hospitality",
  "Real Estate / Kai Korsou",
  "GPT Innovation / AI Services",
  "Infrastructure / Archive",
];

export default function ProjectsPage() {
  const byZone = ZONE_ORDER.map((zone) => ({
    zone,
    projects: PROJECTS.filter((p) => p.zone === zone),
  })).filter(({ projects }) => projects.length > 0);

  const zoneMap = Object.fromEntries(ZONES.map((z) => [z.name, z.description]));

  return (
    <>
      <PageHeader
        breadcrumb="Projects"
        label="All Projects"
        title="Live Applications"
        description="Every active project — grouped by build zone, with status, visibility, tech stack, and next action tracked per entry."
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {byZone.map(({ zone, projects }) => (
            <section key={zone}>
              <div
                className="mb-8 pb-4 border-b"
                style={{ borderColor: "var(--navy-border)" }}
              >
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-1"
                  style={{ color: "var(--gold)", letterSpacing: "0.15em" }}
                >
                  Zone
                </p>
                <h2
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {zone}
                </h2>
                {zoneMap[zone] && (
                  <p
                    className="text-sm leading-relaxed max-w-xl"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {zoneMap[zone]}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project) => (
                  <ProjectCard key={project.title} project={project} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
