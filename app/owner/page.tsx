import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ownerLoginConfigured, signIn, signOut } from "@/lib/owner-auth";
import { loadOwnerPortfolio, validProjectSlug } from "@/lib/owner-portfolio";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Owner Dashboard",
  robots: { index: false, follow: false },
};

const buttonClass = "inline-block rounded border border-cyan-600 px-4 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-900";

export default async function OwnerPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string | string[] }>;
}) {
  const { project } = await searchParams;
  if (project !== undefined && (typeof project !== "string" || !validProjectSlug(project))) notFound();

  const result = await loadOwnerPortfolio(project);
  const returnTo = project ? `/owner?project=${encodeURIComponent(project)}` : "/owner";

  async function login() {
    "use server";
    if (ownerLoginConfigured()) await signIn("github", { redirectTo: returnTo });
  }

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/owner" });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Owner Dashboard</h1>
        {result.state !== "signed-out" && (
          <form action={logout}><button className={buttonClass}>Sign out</button></form>
        )}
      </header>
      {result.state === "signed-out" && (
        ownerLoginConfigured() ? (
          <form action={login}><button className={buttonClass}>Sign in with GitHub</button></form>
        ) : <p>Owner sign-in is currently unavailable.</p>
      )}
      {result.state === "unavailable" && <p>Could not load the portfolio. Try again shortly.</p>}
      {result.state === "ready" && (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">Notion Registry · {result.projects.length} {result.projects.length === 1 ? "project" : "projects"}</p>
            {project && <a className={buttonClass} href="/owner">View full portfolio</a>}
          </div>
          {result.projects.length === 0 ? <p>No matching projects.</p> : (
            <ul className="grid gap-4 lg:grid-cols-2">
              {result.projects.map(item => (
                <li key={item.slug} className="rounded-lg border border-slate-700 px-5 py-4">
                  <h2 className="text-xl font-semibold">
                    <a className="hover:underline" href={`/owner?project=${encodeURIComponent(item.slug)}`}>{item.name}</a>
                  </h2>
                  <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                    <dt className="text-slate-400">Status</dt><dd>{item.status || "Unassigned"}</dd>
                    <dt className="text-slate-400">Evidence</dt><dd>{item.evidence || "Unassigned"}</dd>
                    <dt className="text-slate-400">Next action</dt><dd>{item.action || "Unassigned"}</dd>
                    <dt className="text-slate-400">Repository</dt>
                    <dd>{item.repository ? <a className="text-cyan-200 underline" href={item.repository}>Open GitHub</a> : "No repository link"}</dd>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
