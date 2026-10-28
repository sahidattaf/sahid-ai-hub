import type { Metadata } from "next";
import ProjectGroup from "@/components/dashboard/project-group";
import { REGISTRY } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "GPT Innovation" };
export const dynamic = "force-dynamic";

const ROOT = "gpt-innovation-os";

export default async function GptInnovationPage() {
  await requireOwner();
  return (
    <ProjectGroup
      title="GPT Innovation"
      description="The GPT Innovation venture and the registry entries that name it as their parent project."
      projects={REGISTRY.filter((p) => p.id === ROOT || p.parentProject === ROOT)}
      emptyNote="The gpt-innovation-os registry entry was not found."
    />
  );
}
