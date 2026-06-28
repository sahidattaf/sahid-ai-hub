import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REGISTRY, computeHealthScore } from "@/data/project-registry";
import ProjectDetailHeader from "@/components/project-detail-header";
import ProjectHealthCard from "@/components/project-health-card";
import ProjectLinkGrid from "@/components/project-link-grid";
import ProjectModuleGrid from "@/components/project-module-grid";

export function generateStaticParams() {
  return REGISTRY.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = REGISTRY.find((p) => p.id === id);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = REGISTRY.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const score = computeHealthScore(project);

  return (
    <>
      <ProjectDetailHeader project={project} />

      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: main content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Links */}
              <ProjectLinkGrid
                websiteUrl={project.websiteUrl}
                githubUrl={project.githubUrl}
                vercelProject={project.vercelProject}
                tags={project.tags}
              />

              {/* Module grid */}
              <ProjectModuleGrid />
            </div>

            {/* Right: health sidebar */}
            <div>
              <ProjectHealthCard project={project} score={score} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
