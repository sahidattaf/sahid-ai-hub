import type { Metadata } from "next";
import ProjectGroup from "@/components/dashboard/project-group";
import { REGISTRY } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Kai Korsou" };
export const dynamic = "force-dynamic";

export default async function KaiKorsouPage() {
  await requireOwner();
  return (
    <ProjectGroup
      title="Kai Kòrsou"
      description="Registry entries in the Real Estate / Kai Kòrsou zone. Status fields are registry classifications, not live telemetry."
      projects={REGISTRY.filter((p) => p.zone === "Real Estate / Kai Korsou")}
      emptyNote="No projects are classified in the Real Estate / Kai Korsou zone."
    />
  );
}
