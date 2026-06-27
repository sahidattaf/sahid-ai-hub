import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import VercelSummaryCard from "@/components/vercel/vercel-summary";
import VercelProjectCard from "@/components/vercel/vercel-project-card";
import {
  hasToken,
  fetchProjects,
  fetchDeployments,
  joinProjects,
  buildSummaryStats,
  type VercelProjectRow,
  type VercelSummaryStats,
} from "@/lib/vercel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vercel",
  description:
    "Live Vercel deployment dashboard — project status, latest deployments, frameworks, and production URLs pulled from the Vercel API.",
};

type VercelData =
  | { type: "ready"; rows: VercelProjectRow[]; stats: VercelSummaryStats }
  | { type: "no-token" }
  | { type: "error" };

async function loadVercelData(): Promise<VercelData> {
  if (!hasToken()) return { type: "no-token" };
  try {
    const [projects, deployments] = await Promise.all([
      fetchProjects(),
      fetchDeployments(),
    ]);
    return {
      type: "ready",
      rows: joinProjects(projects, deployments),
      stats: buildSummaryStats(projects, deployments),
    };
  } catch {
    return { type: "error" };
  }
}

export default async function VercelPage() {
  const data = await loadVercelData();

  if (data.type === "no-token") return <VercelSetup />;
  if (data.type === "error") return <VercelUnavailable />;

  const { rows, stats } = data;

  return (
    <>
      <PageHeader
        breadcrumb="Vercel"
        label="Live Dashboard"
        title="Vercel"
        description="Live deployment status for all Vercel projects — pulled from the Vercel REST API. Refreshes every 60 seconds."
      />
      <main className="py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-10">

          <VercelSummaryCard stats={stats} />

          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest mb-5"
              style={{ color: "var(--text-subtle)", letterSpacing: "0.15em" }}
            >
              {rows.length} project{rows.length !== 1 ? "s" : ""}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rows.map((row) => (
                <VercelProjectCard key={row.project.id} row={row} />
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

function VercelSetup() {
  const envVars = [
    {
      name: "VERCEL_TOKEN",
      description: "Personal access token from vercel.com/account/tokens",
      required: true,
    },
    {
      name: "VERCEL_TEAM_ID",
      description: "Team ID (team_…) — only needed for team accounts",
      required: false,
    },
  ];

  return (
    <>
      <PageHeader
        breadcrumb="Vercel"
        label="Live Dashboard"
        title="Vercel"
        description="Live deployment status for all Vercel projects."
      />
      <main className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-lg border p-8"
            style={{
              backgroundColor: "var(--navy-card)",
              borderColor: "var(--navy-border)",
            }}
          >
            <p
              className="text-xs font-mono uppercase tracking-widest mb-4"
              style={{ color: "var(--gold)", letterSpacing: "0.2em" }}
            >
              Setup Required
            </p>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Connect your Vercel account
            </h2>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: "var(--text-muted)" }}
            >
              This dashboard fetches live project and deployment data from the
              Vercel API. Add your token to{" "}
              <code
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{ backgroundColor: "var(--navy-800)", color: "var(--cyan)" }}
              >
                .env.local
              </code>{" "}
              to activate it.
            </p>

            <div className="space-y-4 mb-8">
              {envVars.map(({ name, description, required }) => (
                <div
                  key={name}
                  className="rounded border p-4"
                  style={{ borderColor: "var(--navy-border)", backgroundColor: "var(--navy-800)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <code
                      className="text-xs font-mono font-semibold"
                      style={{ color: "var(--cyan)" }}
                    >
                      {name}
                    </code>
                    <span
                      className="text-xs font-mono px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: required
                          ? "rgba(0,212,255,0.12)"
                          : "rgba(100,116,139,0.12)",
                        color: required ? "var(--cyan)" : "var(--text-subtle)",
                      }}
                    >
                      {required ? "required" : "optional"}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="rounded border p-4 mb-8 font-mono text-xs"
              style={{ borderColor: "var(--navy-border)", backgroundColor: "var(--navy-950)", color: "var(--text-muted)" }}
            >
              <p style={{ color: "var(--text-subtle)" }}># .env.local</p>
              <p>VERCEL_TOKEN=<span style={{ color: "var(--cyan)" }}>your_token_here</span></p>
              <p>VERCEL_TEAM_ID=<span style={{ color: "var(--text-subtle)" }}># optional</span></p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://vercel.com/account/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded"
                style={{ backgroundColor: "var(--cyan)", color: "var(--navy-950)" }}
              >
                Get Vercel Token
              </a>
              <Link
                href="/"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded border"
                style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}
              >
                Return home
              </Link>
            </div>
          </div>

          <p
            className="text-xs text-center mt-6"
            style={{ color: "var(--text-subtle)" }}
          >
            Token is read server-side only and never sent to the browser. See{" "}
            <code className="font-mono" style={{ color: "var(--text-muted)" }}>
              .env.example
            </code>{" "}
            for the full list of env vars.
          </p>
        </div>
      </main>
    </>
  );
}

function VercelUnavailable() {
  return (
    <>
      <PageHeader
        breadcrumb="Vercel"
        label="Live Dashboard"
        title="Vercel"
        description="Live deployment status for all Vercel projects."
      />
      <main className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-xs font-mono uppercase tracking-widest mb-4"
            style={{ color: "var(--gold)", letterSpacing: "0.2em" }}
          >
            Temporarily Unavailable
          </p>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Vercel data could not load
          </h2>
          <p
            className="text-base leading-relaxed max-w-md mx-auto mb-10"
            style={{ color: "var(--text-muted)" }}
          >
            The Vercel API is temporarily unreachable or the token may have
            expired. This is usually a short-lived issue. Try again in a
            moment, or check your{" "}
            <code
              className="text-xs px-1.5 py-0.5 rounded font-mono"
              style={{ backgroundColor: "var(--navy-800)", color: "var(--cyan)" }}
            >
              VERCEL_TOKEN
            </code>{" "}
            environment variable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded"
              style={{ backgroundColor: "var(--cyan)", color: "var(--navy-950)" }}
            >
              Open Vercel Dashboard
            </a>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded border"
              style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}
            >
              Return home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
