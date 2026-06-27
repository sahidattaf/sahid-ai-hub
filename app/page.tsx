import { PROJECTS, type Status, type Visibility } from "@/data/projects";
import {
  OS_DASHBOARD,
  TOOLCHAIN,
  REVENUE_STREAMS,
  ROADMAP,
  ZONES,
  type RoadmapPhase,
} from "@/data/command-center";

const STATS = [
  { value: "6", label: "Live Applications" },
  { value: "8", label: "Revenue Streams" },
  { value: "5", label: "Build Zones" },
  { value: "5", label: "Roadmap Phases" },
];

export default function Home() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--navy-950)" }}
    >
      <Nav />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <OSDashboardSection />
        <ProjectsSection />
        <ZonesSection />
        <CommandCenterSection />
        <RevenueSection />
        <RoadmapSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(5, 9, 26, 0.92)",
        borderColor: "var(--navy-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span
          className="text-base font-semibold tracking-widest uppercase"
          style={{ color: "var(--cyan)", letterSpacing: "0.15em" }}
        >
          Sahid AI Hub
        </span>
        <nav className="hidden md:flex items-center gap-7">
          {[
            ["Dashboard", "#dashboard"],
            ["Projects", "#projects"],
            ["Zones", "#zones"],
            ["Tools", "#command-center"],
            ["Revenue", "#revenue"],
            ["Roadmap", "#roadmap"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="nav-link">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
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
          Six live applications. Five build zones. Seven revenue streams. One
          operating system. All proof is in production.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#dashboard"
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded transition-all"
            style={{ backgroundColor: "var(--cyan)", color: "var(--navy-950)" }}
          >
            Open Dashboard
          </a>
          <a
            href="#projects"
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded border transition-all"
            style={{
              borderColor: "var(--navy-border)",
              color: "var(--text-muted)",
            }}
          >
            View Projects
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
              <p
                className="text-4xl font-bold mb-1"
                style={{ color: "var(--cyan)" }}
              >
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

function OSDashboardSection() {
  return (
    <section
      id="dashboard"
      className="py-24 px-6"
      style={{ backgroundColor: "var(--navy-900)" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="OS Dashboard"
          title="System Overview"
          description="A live map of every system, tool, and output in the Sahid AI Hub operating environment."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {OS_DASHBOARD.map((card) => (
            <div
              key={card.title}
              className={`card-hover rounded-lg border p-5 ${
                card.accent === "cyan" ? "os-card-cyan" : "os-card-gold"
              }`}
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "rgba(30, 45, 90, 0.6)",
              }}
            >
              <p
                className="text-3xl font-bold mb-2 font-mono"
                style={{
                  color:
                    card.accent === "cyan" ? "var(--cyan)" : "var(--gold)",
                }}
              >
                {card.count}
              </p>
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {card.title}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-subtle)" }}
              >
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Featured Projects"
          title="Live Applications"
          description="Six deployed applications across distinct domains. Status, visibility, and next actions tracked per project."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function statusClass(status: Status): string {
  const map: Record<Status, string> = {
    Live: "badge-live",
    Repo: "badge-repo",
    Prototype: "badge-prototype",
    Planning: "badge-planning",
  };
  return map[status];
}

function visibilityClass(visibility: Visibility): string {
  const map: Record<Visibility, string> = {
    Public: "badge-public",
    Private: "badge-private",
    Hybrid: "badge-hybrid",
  };
  return map[visibility];
}

function ProjectCard({
  title,
  description,
  live,
  repo,
  tags,
  status,
  visibility,
  category,
  nextAction,
}: {
  title: string;
  description: string;
  live?: string;
  repo?: string;
  tags: string[];
  status: Status;
  visibility: Visibility;
  category: string;
  zone: string;
  nextAction: string;
}) {
  return (
    <div
      className="card-hover flex flex-col rounded-lg border p-6"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "rgba(30, 45, 90, 0.6)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3
          className="text-base font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        <div className="flex gap-1.5 flex-shrink-0">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono ${statusClass(status)}`}
          >
            {status}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono ${visibilityClass(visibility)}`}
          >
            {visibility}
          </span>
        </div>
      </div>

      <p
        className="text-xs font-mono mb-3"
        style={{ color: "var(--text-subtle)" }}
      >
        {category}
      </p>

      <p
        className="text-sm leading-relaxed mb-4 flex-1"
        style={{ color: "var(--text-muted)" }}
      >
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded font-mono"
            style={{
              backgroundColor: "var(--navy-800)",
              color: "var(--text-subtle)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="pt-4 border-t mb-4"
        style={{ borderColor: "var(--navy-border)" }}
      >
        <p
          className="text-xs font-mono uppercase mb-1"
          style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
        >
          Next Action
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {nextAction}
        </p>
      </div>

      <div className="flex gap-3">
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium"
            style={{ color: "var(--cyan)" }}
          >
            Live App
          </a>
        )}
        {live && repo && (
          <span style={{ color: "var(--navy-border)" }}>|</span>
        )}
        {repo && (
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium"
            style={{ color: "var(--text-subtle)" }}
          >
            Repository
          </a>
        )}
      </div>
    </div>
  );
}

function ZonesSection() {
  return (
    <section
      id="zones"
      className="py-24 px-6"
      style={{ backgroundColor: "var(--navy-900)" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Project Zones"
          title="Domain Architecture"
          description="Five zones organizing every project, system, and initiative by industry and function."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {ZONES.map(({ name, description, count }) => (
            <div
              key={name}
              className="rounded-lg border p-6 card-hover"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "rgba(30, 45, 90, 0.6)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-1 h-4 rounded"
                  style={{ backgroundColor: "var(--gold)" }}
                />
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: "var(--navy-800)",
                    color: "var(--text-subtle)",
                  }}
                >
                  {count} project{count === "1" ? "" : "s"}
                </span>
              </div>
              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {name}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommandCenterSection() {
  return (
    <section id="command-center" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="AI Command Center"
          title="Active Toolchain"
          description="The eight tools forming the core operating environment for research, design, build, and deployment."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {TOOLCHAIN.map(({ name, role }) => (
            <div
              key={name}
              className="rounded-lg border p-5 card-hover"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "rgba(30, 45, 90, 0.6)",
              }}
            >
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {name}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-subtle)" }}
              >
                {role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RevenueSection() {
  return (
    <section
      id="revenue"
      className="py-24 px-6"
      style={{ backgroundColor: "var(--navy-900)" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Revenue Engine"
          title="Commercial Offers"
          description="Seven active revenue streams. Each maps to a real category of work that clients and partners engage with directly."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {REVENUE_STREAMS.map(({ name, description }, index) => (
            <div
              key={name}
              className="rounded-lg border p-6 card-hover"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "rgba(30, 45, 90, 0.6)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--gold)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {name}
                </h3>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function phaseStatusClass(status: RoadmapPhase["status"]): string {
  const map: Record<RoadmapPhase["status"], string> = {
    Complete: "phase-complete",
    Active: "phase-active",
    Planned: "phase-planned",
  };
  return map[status];
}

function RoadmapSection() {
  return (
    <section id="roadmap" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Roadmap"
          title="Build Progression"
          description="Five phases from public launch to a fully live AI-powered command center."
        />
        <div className="mt-12 space-y-4">
          {ROADMAP.map(({ phase, title, description, status }) => (
            <div
              key={phase}
              className="rounded-lg border p-6 card-hover flex flex-col sm:flex-row sm:items-start gap-4"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "rgba(30, 45, 90, 0.6)",
              }}
            >
              <div className="flex-shrink-0 sm:w-32">
                <p
                  className="text-xs font-mono uppercase mb-2"
                  style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
                >
                  {phase}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${phaseStatusClass(status)}`}
                >
                  {status}
                </span>
              </div>
              <div>
                <h3
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6">
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

function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-xl">
      <p
        className="text-xs font-mono tracking-widest uppercase mb-3"
        style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
      >
        {label}
      </p>
      <h2
        className="text-2xl md:text-3xl font-bold mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-muted)" }}
      >
        {description}
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer
      className="py-8 px-6 border-t section-divider"
      style={{ backgroundColor: "var(--navy-900)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span
          className="text-sm font-mono"
          style={{ color: "var(--text-subtle)" }}
        >
          Sahid AI Hub
        </span>
        <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
          Built with Next.js, TypeScript, and Tailwind CSS. Deployed on Vercel.
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com/sahidattaf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs footer-link transition-colors"
            style={{ color: "var(--text-subtle)" }}
          >
            GitHub
          </a>
          <a
            href="mailto:sahidattaf@gmail.com"
            className="text-xs footer-link transition-colors"
            style={{ color: "var(--text-subtle)" }}
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
