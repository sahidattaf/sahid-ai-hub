import Link from "next/link";
import SectionHeader from "@/components/section-header";
import ProjectCard from "@/components/project-card";
import { PROJECTS } from "@/data/projects";
import {
  OS_DASHBOARD,
  ZONES,
  ROADMAP,
  REVENUE_STREAMS,
} from "@/data/command-center";
import { EXECUTIVE_MODULES, CATEGORY_ORDER } from "@/data/executive-modules";

const STATS = [
  { value: "6", label: "Live Applications" },
  { value: "7", label: "Revenue Streams" },
  { value: "5", label: "Build Zones" },
  { value: "5", label: "Roadmap Phases" },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <OSDashboardSection />
      <ProjectsSection />
      <ZonesSection />
      <RevenuePreview />
      <RoadmapPreview />
      <ExecutiveOSSection />
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
          Six live applications. Five build zones. Seven revenue streams. One
          operating system. All proof is in production.
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
            style={{
              borderColor: "var(--navy-border)",
              color: "var(--text-muted)",
            }}
          >
            About Sahid
          </Link>
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
                  color: card.accent === "cyan" ? "var(--cyan)" : "var(--gold)",
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
  const featured = PROJECTS.slice(0, 3);
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            label="Featured Projects"
            title="Live Applications"
            description="Six deployed applications across distinct domains. Status, visibility, and next actions tracked per project."
          />
          <Link
            href="/projects"
            className="hidden md:inline-flex text-sm font-medium flex-shrink-0 ml-8"
            style={{ color: "var(--cyan)" }}
          >
            View all 6 projects
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
        <div className="mt-8 md:hidden">
          <Link
            href="/projects"
            className="text-sm font-medium"
            style={{ color: "var(--cyan)" }}
          >
            View all 6 projects
          </Link>
        </div>
      </div>
    </section>
  );
}

function ZonesSection() {
  return (
    <section
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

function RevenuePreview() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            label="Revenue Engine"
            title="Commercial Offers"
            description="Seven active revenue streams. Each maps to a real category of work."
          />
          <Link
            href="/revenue"
            className="hidden md:inline-flex text-sm font-medium flex-shrink-0 ml-8"
            style={{ color: "var(--cyan)" }}
          >
            View revenue engine
          </Link>
        </div>
        <ul className="space-y-3 max-w-2xl">
          {REVENUE_STREAMS.map(({ name, incomeType }, index) => (
            <li
              key={name}
              className="flex items-center justify-between py-3 border-b"
              style={{ borderColor: "var(--navy-border)" }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="text-xs font-mono w-6"
                  style={{ color: "var(--gold)" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {name}
                </span>
              </div>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{
                  backgroundColor: "var(--navy-800)",
                  color: "var(--text-subtle)",
                }}
              >
                {incomeType}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 md:hidden">
          <Link
            href="/revenue"
            className="text-sm font-medium"
            style={{ color: "var(--cyan)" }}
          >
            View revenue engine
          </Link>
        </div>
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

function ExecutiveOSSection() {
  const active = EXECUTIVE_MODULES.filter((m) => m.status === "Active").length;
  const planned = EXECUTIVE_MODULES.filter((m) => m.status === "Planned").length;
  const future = EXECUTIVE_MODULES.filter((m) => m.status === "Future").length;

  const quickLinks = [
    { label: "Projects",  href: "/projects",  accent: "cyan" as const },
    { label: "Registry",  href: "/registry",  accent: "gold" as const },
    { label: "GitHub",    href: "/github",    accent: "muted" as const },
    { label: "Vercel",    href: "/vercel",    accent: "muted" as const },
    { label: "Live Apps", href: "/live-apps", accent: "cyan" as const },
  ];

  return (
    <section className="py-24 px-6 border-t section-divider">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            label="Executive OS"
            title="Operating System"
            description={`${EXECUTIVE_MODULES.length} modules across ${CATEGORY_ORDER.length} categories — ${active} active, ${planned} planned, ${future} future.`}
          />
          <Link
            href="/projects"
            className="hidden md:inline-flex text-sm font-medium flex-shrink-0 ml-8"
            style={{ color: "var(--cyan)" }}
          >
            View projects
          </Link>
        </div>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-3 mb-10">
          {quickLinks.map(({ label, href, accent }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center px-4 py-2 text-xs font-medium rounded border transition-all card-hover"
              style={{
                borderColor:
                  accent === "cyan"
                    ? "rgba(34, 211, 238, 0.3)"
                    : accent === "gold"
                    ? "rgba(212, 168, 67, 0.3)"
                    : "var(--navy-border)",
                color:
                  accent === "cyan"
                    ? "var(--cyan)"
                    : accent === "gold"
                    ? "var(--gold)"
                    : "var(--text-muted)",
                backgroundColor: "var(--navy-card)",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Module grid — show Active modules prominently */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXECUTIVE_MODULES.filter((m) => m.status !== "Future")
            .slice(0, 8)
            .map((mod) => (
              <div
                key={mod.id}
                className={`rounded-lg border p-4 ${mod.href ? "card-hover" : ""}`}
                style={{
                  backgroundColor: "var(--navy-card)",
                  borderColor:
                    mod.status === "Active"
                      ? "rgba(34, 211, 238, 0.15)"
                      : "rgba(30, 45, 90, 0.6)",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color:
                        mod.status === "Active"
                          ? "var(--text-primary)"
                          : "var(--text-muted)",
                    }}
                  >
                    {mod.name}
                  </p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-mono flex-shrink-0 ${
                      mod.status === "Active" ? "badge-live" : "badge-prototype"
                    }`}
                  >
                    {mod.status}
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {mod.description}
                </p>
                {mod.href && (
                  <Link
                    href={mod.href}
                    className="inline-block mt-3 text-xs"
                    style={{ color: "var(--cyan)" }}
                  >
                    Open →
                  </Link>
                )}
              </div>
            ))}
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
