import { type LanguageStat, languageColor } from "@/lib/github";

export default function LanguageChart({
  languages,
}: {
  languages: LanguageStat[];
}) {
  if (languages.length === 0) return null;

  const displayed = languages.slice(0, 6);

  return (
    <div
      className="rounded-lg border p-6"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "var(--navy-border)",
      }}
    >
      <p
        className="text-xs font-mono uppercase tracking-widest mb-5"
        style={{ color: "var(--text-subtle)", letterSpacing: "0.15em" }}
      >
        Languages
      </p>

      <div className="flex h-2 rounded-full overflow-hidden mb-6 gap-px">
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

      <div className="space-y-3">
        {displayed.map(({ name, count, percentage }) => (
          <div key={name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: languageColor(name) }}
              />
              <span
                className="text-sm truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {name}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span
                className="text-xs font-mono"
                style={{ color: "var(--text-subtle)" }}
              >
                {count} repo{count !== 1 ? "s" : ""}
              </span>
              <span
                className="text-xs font-mono w-8 text-right"
                style={{ color: "var(--text-subtle)" }}
              >
                {percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
