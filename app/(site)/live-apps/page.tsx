import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import PublicProjectCard from "@/components/public-project-card";
import { getDeclaredLiveApps, getPublicProjects } from "@/data/project-registry";

export const metadata: Metadata = {
  title: "Live Apps",
  description: "Public applications with a declared production URL, sourced from the project registry.",
};

const APPS = getDeclaredLiveApps(getPublicProjects());

export default function LiveAppsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Live Apps"
        label="Declared Production URLs"
        title="Live Applications"
        description={`${APPS.length} public project${APPS.length === 1 ? "" : "s"} declare a production URL. These links are declared in the project registry; deployment health is not verified on this public page.`}
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {APPS.map((app) => (
            <PublicProjectCard key={app.id} project={app} />
          ))}
        </div>
      </main>
    </>
  );
}
