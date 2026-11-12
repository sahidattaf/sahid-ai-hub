import type { NameOnlyProject } from "@/data/public-projects";

// Names only: no description, status, links or details for non-public projects.
export default function PrivateProjectNames({ projects }: { projects: NameOnlyProject[] }) {
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {projects.map((p) => (
        <li key={p.id} className="rounded-lg border px-4 py-3 text-sm" style={{ backgroundColor: "var(--navy-card)", borderColor: "rgba(30, 45, 90, 0.6)", color: "var(--text-primary)" }}>
          {p.name}
          <span className="block text-xs font-mono mt-1" style={{ color: "var(--text-subtle)" }}>
            {p.assetType} · details not public
          </span>
        </li>
      ))}
    </ul>
  );
}
