import type { Metadata } from "next";
import ProjectGroup from "@/components/dashboard/project-group";
import { REGISTRY } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "JobHunter" };
export const dynamic = "force-dynamic";

export default async function JobHunterPage() {
  await requireOwner();
  return (
    <ProjectGroup
      title="JobHunter"
      description="JobHunterGPT is retained as proof-of-work. Usage, user and revenue metrics are not connected to this dashboard."
      projects={REGISTRY.filter((p) => p.id === "jobhunter-gpt")}
      emptyNote="The jobhunter-gpt registry entry was not found."
    />
  );
}
