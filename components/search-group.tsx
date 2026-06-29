import { memo } from "react";
import { CATEGORY_ICONS } from "@/data/search-index";

interface Props {
  category: string;
  count: number;
}

function SearchGroup({ category, count }: Props) {
  const icon = CATEGORY_ICONS[category] ?? "🔷";
  return (
    <div
      className="flex items-center gap-2 px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider select-none"
      style={{ color: "var(--text-subtle)" }}
      role="presentation"
    >
      <span aria-hidden="true">{icon}</span>
      <span>{category}</span>
      <span
        className="ml-auto tabular-nums"
        style={{ color: "var(--text-subtle)", opacity: 0.6 }}
      >
        {count}
      </span>
    </div>
  );
}

export default memo(SearchGroup);
