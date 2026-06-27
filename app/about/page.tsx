import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sahid Attaf — Curaçao-based AI systems builder, entrepreneur, and founder of Sahid AI Hub.",
};

const WHAT_I_BUILD = [
  {
    title: "AI-Powered Web Applications",
    description:
      "Full-stack Next.js applications with embedded AI features. From brand sites to operating systems, built with TypeScript and deployed on Vercel.",
  },
  {
    title: "Hospitality Technology",
    description:
      "AI operating systems for food and beverage businesses — menus, reservations, guest intelligence, and operations automation built for the Caribbean market.",
  },
  {
    title: "Commerce Platforms",
    description:
      "Digital marketplaces and e-commerce infrastructure for local and regional ecosystems, starting with the Curacao market.",
  },
  {
    title: "GPT Systems and Agents",
    description:
      "Custom GPT workflows, automation agents, and prompt systems designed for specific business domains and repeatable tasks.",
  },
  {
    title: "Platform Engineering",
    description:
      "Turborepo monorepo architectures supporting multiple apps from a single codebase with shared packages, types, and deployment pipelines.",
  },
];

const PRINCIPLES = [
  "Ship proof before pitch. Every project is live before it is sold.",
  "Build in public. All repositories and deployments are publicly accessible.",
  "Systems thinking. Every tool and app is part of a broader operating system.",
  "Caribbean-first. Curaçao and the region are the primary market, not an afterthought.",
  "AI-native by default. AI is built into the stack from day one, not added later.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumb="About"
        label="About"
        title="Sahid Attaf"
        description="Curaçao-based AI systems builder and entrepreneur. Building proof-of-work applications across hospitality, commerce, career tech, and platform engineering."
      />
      <main className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-4"
                  style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
                >
                  Background
                </p>
                <div
                  className="space-y-4 text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  <p>
                    Based in Curaçao, Dutch Caribbean. Building AI systems and
                    digital products for real business problems in real markets —
                    not demos or portfolios for their own sake.
                  </p>
                  <p>
                    The work spans six live applications, five industry zones, and
                    seven commercial revenue streams. Every project is publicly
                    deployed and verifiable. All code is open source on GitHub.
                  </p>
                  <p>
                    The focus is on markets that are underserved by off-the-shelf
                    software: Caribbean hospitality, local commerce, emerging
                    market real estate, and small business automation.
                  </p>
                </div>
              </div>
              <div>
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-4"
                  style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
                >
                  Focus Areas
                </p>
                <ul className="space-y-3">
                  {[
                    "AI-native web application development",
                    "Hospitality technology for Caribbean businesses",
                    "Local commerce and marketplace infrastructure",
                    "GPT system design and prompt engineering",
                    "Turborepo monorepo platform architecture",
                    "AI literacy and implementation training",
                  ].map((area) => (
                    <li
                      key={area}
                      className="flex items-start gap-3 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span
                        className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "var(--gold)" }}
                      />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
            >
              What Gets Built
            </p>
            <h2
              className="text-2xl font-bold mb-10"
              style={{ color: "var(--text-primary)" }}
            >
              Five categories of work
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {WHAT_I_BUILD.map(({ title, description }) => (
                <div
                  key={title}
                  className="card-hover rounded-lg border p-6"
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
                    {title}
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
          </section>

          <section className="mb-20">
            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
            >
              Principles
            </p>
            <h2
              className="text-2xl font-bold mb-8"
              style={{ color: "var(--text-primary)" }}
            >
              How the work is done
            </h2>
            <ul className="space-y-4">
              {PRINCIPLES.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-4 text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "var(--cyan)" }}
                  />
                  {p}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div
              className="rounded-lg border p-10 text-center"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "var(--navy-border)",
              }}
            >
              <p
                className="text-xs font-mono tracking-widest uppercase mb-4"
                style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
              >
                Work Together
              </p>
              <h2
                className="text-2xl font-bold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                Open to collaboration
              </h2>
              <p
                className="text-sm max-w-md mx-auto mb-8 leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                Available for AI system builds, hospitality tech, marketplace
                platforms, and training engagements. See the full revenue model
                for engagement options.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:sahidattaf@gmail.com"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium rounded"
                  style={{
                    backgroundColor: "var(--cyan)",
                    color: "var(--navy-950)",
                  }}
                >
                  Send an Email
                </a>
                <Link
                  href="/revenue"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium rounded border"
                  style={{
                    borderColor: "var(--navy-border)",
                    color: "var(--text-muted)",
                  }}
                >
                  View Revenue Engine
                </Link>
                <a
                  href="https://github.com/sahidattaf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium rounded border"
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
        </div>
      </main>
    </>
  );
}
