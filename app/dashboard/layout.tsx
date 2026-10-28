import type { Metadata } from "next";
import { signOut } from "@/auth";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { requireOwner } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: { default: "Owner Dashboard", template: "%s | Owner Dashboard" },
  robots: { index: false, follow: false },
};

// Layouts do not re-render on client-side navigation, so this is defence in
// depth: every page and data loader under /dashboard calls requireOwner() too.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const owner = await requireOwner();

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="md:flex min-h-screen">
      <DashboardSidebar
        signOutSlot={
          <form action={signOutAction}>
            <p className="text-xs mb-2 px-1" style={{ color: "var(--text-subtle)" }}>
              Signed in{owner.name ? ` as ${owner.name}` : ""}
            </p>
            <button
              type="submit"
              className="w-full rounded border px-3 py-2 text-sm text-left"
              style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}
            >
              Sign out
            </button>
          </form>
        }
      />
      <main id="main" className="flex-1 min-w-0 px-4 sm:px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-10">{children}</div>
      </main>
    </div>
  );
}
