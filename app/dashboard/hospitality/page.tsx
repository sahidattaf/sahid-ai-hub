import type { Metadata } from "next";
import ProjectGroup from "@/components/dashboard/project-group";
import { REGISTRY } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Hospitality" };
export const dynamic = "force-dynamic";

export default async function HospitalityPage() {
  await requireOwner();
  return (
    <ProjectGroup
      title="Hospitality"
      description="Registry entries in the Hospitality zone, including client delivery. Status fields are registry classifications, not live telemetry."
      projects={REGISTRY.filter((p) => p.zone === "Hospitality")}
      emptyNote="No projects are classified in the Hospitality zone."
    />
  );
}
