const PROJECTS = [
  {
    title: "JobHunterGPT",
    description:
      "AI-powered job search assistant. Automated matching, application tracking, and career intelligence.",
    live: "https://jobhunter-gpt-gamma.vercel.app/",
    repo: "https://github.com/sahidattaf/jobhunter-gpt",
    tags: ["GPT", "Automation", "Career"],
  },
  {
    title: "BOSSA Asado i Mar",
    description:
      "Premium hospitality brand site with reservation flows and AI-enhanced guest experience.",
    live: "https://bossa-asado-i-mar.vercel.app/",
    repo: "https://github.com/sahidattaf/BOSSA-ASADO-I-MAR",
    tags: ["Hospitality", "Brand", "Next.js"],
  },
  {
    title: "BOSSA AI OS",
    description:
      "AI operating system for hospitality management, menu intelligence, and business automation.",
    live: "https://bossa-ai-os.vercel.app/",
    repo: "https://github.com/sahidattaf/bossa-ai-os",
    tags: ["AI OS", "Hospitality", "Automation"],
  },
  {
    title: "GPT OS Website",
    description:
      "Turborepo monorepo powering a multi-app AI ecosystem with five Next.js apps and six shared packages.",
    live: "https://gpt-os-website.vercel.app/",
    repo: "https://github.com/sahidattaf/gpt-innovation-os",
    tags: ["Monorepo", "Platform", "AI"],
  },
  {
    title: "Piskadera Marketplace",
    description:
      "Digital marketplace built for the Curacao fishing and local goods ecosystem.",
    live: "https://piskadera-marketplace.vercel.app/",
    repo: "https://github.com/sahidattaf/kai-korsou-command-center",
    tags: ["Marketplace", "E-commerce", "Curacao"],
  },
  {
    title: "AI Marketing Tools",
    description:
      "Suite of AI-powered marketing tools for content generation, campaign orchestration, and analytics.",
    live: "https://ai-marketing-tools-six.vercel.app/",
    repo: "https://github.com/sahidattaf/ai_-marketing-_tools-_agent",
    tags: ["Marketing", "AI", "Tools"],
  },
];

const STATS = [
  { value: "6", label: "Live Applications" },
  { value: "6", label: "Public Repositories" },
  { value: "3", label: "Industry Domains" },
  { value: "5+", label: "Markets Covered" },
];

const ZONES = [
  {
    name: "Hospitality Systems",
    description:
      "AI menus, reservation flows, guest experience automation, and brand intelligence for food and beverage.",
  },
  {
    name: "Workforce Intelligence",
    description:
      "Job-matching systems, career automation, and talent intelligence platforms for modern professionals.",
  },
  {
    name: "Marketing Automation",
    description:
      "AI-driven content engines, campaign orchestration, and performance analytics tooling.",
  },
  {
    name: "Local Commerce",
    description:
      "Marketplace infrastructure for Caribbean and emerging market commerce ecosystems.",
  },
  {
    name: "AI Operating Systems",
    description:
      "Custom GPT OS frameworks for multi-domain command, control, and business intelligence.",
  },
  {
    name: "Platform Engineering",
    description:
      "Monorepo architecture, shared component libraries, and scalable multi-app deployment pipelines.",
  },
];

const SERVICES = [
  "AI-powered Next.js web applications from concept to production",
  "Custom GPT workflows, automation agents, and prompt systems",
  "Hospitality tech platforms with real-time business intelligence",
  "Marketplace and e-commerce infrastructure builds",
  "Turborepo monorepo architecture for multi-product teams",
  "Brand sites with AI-enhanced user experience and CMS",
];

const STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "React",
  "Vercel",
  "Cloudflare Workers",
  "Supabase",
  "OpenAI API",
  "Turborepo",
  "GitHub",
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
        <ProjectsSection />
        <ZonesSection />
        <ServicesSection />
        <StackSection />
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
        <nav className="hidden md:flex items-center gap-8">
          {[
            ["Projects", "#projects"],
            ["Zones", "#zones"],
            ["Services", "#services"],
            ["Stack", "#stack"],
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
          Command Center
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
          Live applications, open-source repositories, and proof-of-work
          prototypes spanning hospitality, commerce, workforce intelligence, and
          platform engineering.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded transition-all"
            style={{
              backgroundColor: "var(--cyan)",
              color: "var(--navy-950)",
            }}
          >
            View Projects
          </a>
          <a
            href="https://github.com/sahidattaf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded border transition-all"
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

function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Featured Projects"
          title="Live Applications"
          description="Six deployed applications across distinct domains. Each built, shipped, and maintained publicly."
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

function ProjectCard({
  title,
  description,
  live,
  repo,
  tags,
}: {
  title: string;
  description: string;
  live: string;
  repo: string;
  tags: string[];
}) {
  return (
    <div
      className="card-hover flex flex-col rounded-lg border p-6"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "rgba(30, 45, 90, 0.6)",
      }}
    >
      <div className="flex-1">
        <h3
          className="text-base font-semibold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed mb-5"
          style={{ color: "var(--text-muted)" }}
        >
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
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
      </div>
      <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "var(--navy-border)" }}>
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium transition-colors"
          style={{ color: "var(--cyan)" }}
        >
          Live App
        </a>
        <span style={{ color: "var(--navy-border)" }}>|</span>
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium transition-colors"
          style={{ color: "var(--text-subtle)" }}
        >
          Repository
        </a>
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
          title="Domain Coverage"
          description="The verticals and system categories where active development is concentrated."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {ZONES.map(({ name, description }) => (
            <div
              key={name}
              className="rounded-lg border p-6 card-hover"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "rgba(30, 45, 90, 0.6)",
              }}
            >
              <div
                className="w-1 h-4 rounded mb-4"
                style={{ backgroundColor: "var(--gold)" }}
              />
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

function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="AI Services"
          title="What Gets Built"
          description="The scope of work — from standalone apps to multi-app platform systems."
        />
        <ul className="mt-12 space-y-4 max-w-2xl">
          {SERVICES.map((service) => (
            <li
              key={service}
              className="flex items-start gap-4 text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: "var(--cyan)" }}
              />
              {service}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StackSection() {
  return (
    <section
      id="stack"
      className="py-24 px-6 border-t section-divider"
      style={{ backgroundColor: "var(--navy-900)" }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Infrastructure"
          title="Technology Stack"
          description="The core tooling powering every project in this hub."
        />
        <div className="flex flex-wrap gap-3 mt-12">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="text-sm px-4 py-2 rounded border font-mono"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "var(--navy-border)",
                color: "var(--text-muted)",
              }}
            >
              {tech}
            </span>
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
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded transition-all"
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
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded border transition-all"
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
      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
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
            className="text-xs transition-colors"
            style={{ color: "var(--text-subtle)" }}
          >
            GitHub
          </a>
          <a
            href="mailto:sahidattaf@gmail.com"
            className="text-xs transition-colors"
            style={{ color: "var(--text-subtle)" }}
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
