import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProjectById, getPublicProjects } from "@/data/public-projects";
import ProjectDetailHeader from "@/components/project-detail-header";
import ProjectLinkGrid from "@/components/project-link-grid";
import ProjectModuleGrid from "@/components/project-module-grid";

// Only public projects get a detail page. Any other id (including names-only
// projects) is a 404, so nothing beyond the name is ever published for them.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicProjects().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = getPublicProjectById(id);
  return project ? { title: project.name, description: project.description } : { title: "Project Not Found" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getPublicProjectById(id);
  if (!project) notFound();

  return (
    <>
      <ProjectDetailHeader project={project} />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <ProjectLinkGrid websiteUrl={project.websiteUrl} githubUrl={project.githubUrl} tags={project.tags} />
          <ProjectModuleGrid />
        </div>
      </main>
    </>
  );
}
