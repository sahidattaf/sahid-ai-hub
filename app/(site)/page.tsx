import Link from "next/link";
import SectionHeader from "@/components/section-header";
import PublicProjectCard from "@/components/public-project-card";
import { ROADMAP } from "@/data/command-center";
import { getDeclaredLiveApps, getPublicProjects, getZoneSummaries } from "@/data/project-registry";

// Everything on this page is derived from the PUBLIC subset of the project
// registry (visibility "Public"). Private projects, revenue, investors and
// client records never reach this route.
const PUBLIC_PROJECTS = getPublicProjects();
const DECLARED_LIVE = getDeclaredLiveApps(PUBLIC_PROJECTS);
const ZONES = getZoneSummaries(PUBLIC_PROJECTS);

const STATS = [
  { value: String(PUBLIC_PROJECTS.length), label: "Public Projects" },
  { value: String(DECLARED_LIVE.length), label: "Declared Live Apps" },
  { value: String(ZONES.length), label: "Build Zones" },
  { value: String(ROADMAP.length), label: "Roadmap Phases" },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProjectsSection />
      <ZonesSection />
      <RoadmapPreview />
      <OwnerDashboardSection />
      <ContactSection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <p
          className="text-xs font-mono tracking-widest uppercase mb-6"
          style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
        >
          AI Operating System
        </p>
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none cyan-glow"
          style={{ color: "var(--text-primary)" }}
        >
          Sahid AI Hub
        </h1>
        <p
          className="text-xl md:text-2xl font-light max-w-2xl mb-4"
          style={{ color: "var(--text-muted)", lineHeight: "1.6" }}
        >
          The command center for everything Sahid Attaf builds with AI.
        </p>
        <p
          className="text-base max-w-xl mb-12"
          style={{ color: "var(--text-subtle)", lineHeight: "1.7" }}
        >
          {PUBLIC_PROJECTS.length} public projects across {ZONES.length} build zones. Live links are declared by the
          project registry; deployment health is verified only inside the owner dashboard.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded transition-all"
            style={{ backgroundColor: "var(--cyan)", color: "var(--navy-950)" }}
          >
            View Projects
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded border transition-all"
            style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}
          >
            About Sahid
          </Link>
          <a
            href="https://github.com/sahidattaf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded border transition-all"
            style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}
          >
            GitHub Profile
          </a>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 px-6 border-t border-b section-divider">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="pl-4 stat-border">
              <p className="text-4xl font-bold mb-1" style={{ color: "var(--cyan)" }}>
                {value}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const featured = PUBLIC_PROJECTS.slice(0, 3);
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            label="Featured Projects"
            title="Public Projects"
            description="A selection from the public project registry."
          />
          <Link
            href="/projects"
            className="hidden md:inline-flex text-sm font-medium flex-shrink-0 ml-8"
            style={{ color: "var(--cyan)" }}
          >
            View all {PUBLIC_PROJECTS.length} projects
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((project) => (
            <PublicProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-8 md:hidden">
          <Link href="/projects" className="text-sm font-medium" style={{ color: "var(--cyan)" }}>
            View all {PUBLIC_PROJECTS.length} projects
          </Link>
        </div>
      </div>
    </section>
  );
}

function ZonesSection() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "var(--navy-900)" }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Project Zones"
          title="Domain Architecture"
          description={`${ZONES.length} zones contain public projects.`}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {ZONES.map(({ zone, description, count }) => (
            <div
              key={zone}
              className="rounded-lg border p-6 card-hover"
              style={{ backgroundColor: "var(--navy-card)", borderColor: "rgba(30, 45, 90, 0.6)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-1 h-4 rounded" style={{ backgroundColor: "var(--gold)" }} />
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{ backgroundColor: "var(--navy-800)", color: "var(--text-subtle)" }}
                >
                  {count} public project{count === 1 ? "" : "s"}
                </span>
              </div>
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {zone}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OwnerDashboardSection() {
  return (
    <section className="py-24 px-6 border-t section-divider">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Owner Dashboard"
          title="Private command center"
          description="Live GitHub, Vercel and Notion status, the full project registry and portfolio detail are available to the owner after signing in."
        />
        <Link
          href="/dashboard"
          className="inline-flex items-center mt-8 px-6 py-3 text-sm font-medium rounded border"
          style={{ borderColor: "var(--navy-border)", color: "var(--cyan)" }}
        >
          Owner sign-in
        </Link>
      </div>
    </section>
  );
}

function RoadmapPreview() {
  return (
    <section
      className="py-24 px-6 border-t section-divider"
      style={{ backgroundColor: "var(--navy-900)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            label="Roadmap"
            title="Build Progression"
            description="Five phases from public launch to a fully live AI-powered command center."
          />
          <Link
            href="/roadmap"
            className="hidden md:inline-flex text-sm font-medium flex-shrink-0 ml-8"
            style={{ color: "var(--cyan)" }}
          >
            View full roadmap
          </Link>
        </div>
        <div className="space-y-3">
          {ROADMAP.map(({ phase, title, status }) => {
            const statusStyles: Record<string, string> = {
              Complete: "phase-complete",
              Active: "phase-active",
              Planned: "phase-planned",
            };
            return (
              <div
                key={phase}
                className="flex items-center gap-4 py-3 border-b"
                style={{ borderColor: "var(--navy-border)" }}
              >
                <span
                  className="text-xs font-mono w-16 flex-shrink-0"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {phase}
                </span>
                <span
                  className="text-sm font-medium flex-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono flex-shrink-0 ${statusStyles[status]}`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-8 md:hidden">
          <Link
            href="/roadmap"
            className="text-sm font-medium"
            style={{ color: "var(--cyan)" }}
          >
            View full roadmap
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-lg border p-10 md:p-16 text-center"
          style={{
            backgroundColor: "var(--navy-card)",
            borderColor: "var(--navy-border)",
          }}
        >
          <p
            className="text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
          >
            Get in Touch
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Start a Conversation
          </h2>
          <p
            className="text-base max-w-lg mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Open to collaboration on AI systems, platform builds, and
            hospitality technology. All work is public. Proof is in production.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:sahidattaf@gmail.com"
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded transition-all"
              style={{
                backgroundColor: "var(--cyan)",
                color: "var(--navy-950)",
              }}
            >
              Send an Email
            </a>
            <a
              href="https://github.com/sahidattaf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded border transition-all"
              style={{
                borderColor: "var(--navy-border)",
                color: "var(--text-muted)",
              }}
            >
              View GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
