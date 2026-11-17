import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import PublicProjectCard from "@/components/public-project-card";
import { getPublicProjects } from "@/data/public-projects";

export const metadata: Metadata = {
  title: "GitHub",
  description: "Public repositories for the Sahid AI Hub portfolio projects.",
};

// Static on purpose: built only from the approved public data. No GitHub API
// call, no token, and no repository that is not listed in the public data.
const WITH_REPOSITORY = getPublicProjects().filter((p) => p.githubUrl);

export default function GitHubPage() {
  return (
    <>
      <PageHeader
        breadcrumb="GitHub"
        label="Repositories"
        title="GitHub"
        description={`${WITH_REPOSITORY.length} portfolio projects with a public repository. This is a static list; no live repository data is shown.`}
      />
      <main className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WITH_REPOSITORY.map((project) => (
              <PublicProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
