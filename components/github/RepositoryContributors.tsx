import Image from "next/image";
import type { RepositoryContributor } from "@/types/github";

export default function RepositoryContributors({
  contributors,
}: {
  contributors: RepositoryContributor[];
}) {
  if (contributors.length === 0) return null;

  const displayed = contributors.slice(0, 5);

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {displayed.map((c) => (
          <a
            key={c.login}
            href={c.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`${c.login} — ${c.contributions} contribution${c.contributions === 1 ? "" : "s"}`}
          >
            <Image
              src={c.avatarUrl}
              alt={`${c.login} avatar`}
              width={24}
              height={24}
              className="rounded-full"
              style={{ border: "2px solid var(--navy-card)" }}
            />
          </a>
        ))}
      </div>
      <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
        {contributors.length} contributor{contributors.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
