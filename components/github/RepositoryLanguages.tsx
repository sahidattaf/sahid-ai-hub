import { languageColor } from "@/lib/github";
import type { RepositoryLanguageBreakdown } from "@/types/github";

export default function RepositoryLanguages({
  languages,
}: {
  languages: RepositoryLanguageBreakdown[];
}) {
  if (languages.length === 0) return null;

  const displayed = languages.slice(0, 4);

  return (
    <div>
      <div className="flex h-1.5 rounded-full overflow-hidden mb-2 gap-px">
        {displayed.map(({ name, percentage }) => (
          <div
            key={name}
            style={{
              width: `${percentage}%`,
              backgroundColor: languageColor(name),
              minWidth: percentage > 0 ? "2px" : "0",
            }}
            title={`${name}: ${percentage}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {displayed.map(({ name, percentage }) => (
          <span key={name} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: languageColor(name) }}
            />
            <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
              {name} {percentage > 0 && `${percentage}%`}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
