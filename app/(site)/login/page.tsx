import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import PageHeader from "@/components/page-header";
import { getOwner } from "@/lib/auth/guard";
import { getAuthConfigStatus } from "@/lib/auth/owner";

export const metadata: Metadata = { title: "Owner sign-in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const status = getAuthConfigStatus();
  const { error } = await searchParams;

  if (status.configured && (await getOwner())) redirect("/dashboard");

  async function signInAction() {
    "use server";
    await signIn("github", { redirectTo: "/dashboard" });
  }

  return (
    <>
      <PageHeader breadcrumb="Sign in" label="Owner access" title="Owner sign-in" description="The dashboard contains private repositories, deployments and portfolio detail. Access is limited to the configured owner GitHub account." />
      <main className="py-16 px-6">
        <div className="max-w-xl mx-auto rounded-lg border p-8" style={{ backgroundColor: "var(--navy-card)", borderColor: "var(--navy-border)" }}>
          {!status.configured ? (
            <div role="status">
              <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>
                Setup required — access is closed
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                Authentication is not configured, so the dashboard denies everyone. Set these environment variables (names only; see .env.example):
              </p>
              <ul className="space-y-1 mb-2">
                {status.missing.map((name) => (
                  <li key={name}>
                    <code className="text-xs font-mono" style={{ color: "var(--cyan)" }}>{name}</code>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <form action={signInAction}>
              {error && (
                <p role="alert" className="text-sm mb-4" style={{ color: "#f87171" }}>
                  Sign-in was not completed. This GitHub account may not be authorized for this dashboard.
                </p>
              )}
              <button type="submit" className="inline-flex items-center px-6 py-3 text-sm font-medium rounded" style={{ backgroundColor: "var(--cyan)", color: "var(--navy-950)" }}>
                Sign in with GitHub
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
