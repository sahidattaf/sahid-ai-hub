import type { Metadata } from "next";
import { DashHeader, Panel } from "@/components/dashboard/ui";
import { TOOLCHAIN } from "@/data/command-center";
import { REGISTRY } from "@/data/project-registry";
import { requireOwner } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "AI Stack" };
export const dynamic = "force-dynamic";

export default async function AiStackPage() {
  await requireOwner();
  const usage = new Map<string, number>();
  for (const p of REGISTRY) for (const tech of p.stack) usage.set(tech, (usage.get(tech) ?? 0) + 1);
  const ranked = [...usage.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    <>
      <DashHeader title="AI Stack" description="The declared toolchain, and the technologies named by registry projects. Both are declarations; usage volume and spend are not measured here." />
      <Panel title={`Toolchain (${TOOLCHAIN.length})`}>
        <ul className="grid md:grid-cols-2 gap-3 text-sm">
          {TOOLCHAIN.map((t) => (
            <li key={t.name}>
              <span style={{ color: "var(--text-primary)" }}>{t.name}</span>{" "}
              <span className="text-xs font-mono" style={{ color: "var(--text-subtle)" }}>{t.category}</span>
              <br />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t.role}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Technologies across registry projects">
        <ul className="flex flex-wrap gap-2">
          {ranked.map(([tech, count]) => (
            <li key={tech} className="text-xs font-mono px-2 py-1 rounded" style={{ backgroundColor: "var(--navy-800)", color: "var(--text-muted)" }}>
              {tech} · {count}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
