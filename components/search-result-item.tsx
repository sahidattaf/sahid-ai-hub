"use client";

import { memo } from "react";
import { SearchItem } from "@/data/search-index";

interface Props {
  item: SearchItem;
  isActive: boolean;
  onSelect: () => void;
  onHover: () => void;
}

function SearchResultItem({ item, isActive, onSelect, onHover }: Props) {
  return (
    <button
      role="option"
      aria-selected={isActive}
      onClick={onSelect}
      onMouseEnter={onHover}
      className="w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-lg mx-1 transition-all duration-100"
      style={{
        width: "calc(100% - 0.5rem)",
        backgroundColor: isActive
          ? "rgba(34, 211, 238, 0.08)"
          : "transparent",
        borderLeft: isActive
          ? "2px solid var(--cyan)"
          : "2px solid transparent",
      }}
    >
      <span
        className="text-base flex-shrink-0 w-6 text-center leading-none"
        aria-hidden="true"
      >
        {item.icon}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="text-sm font-medium truncate"
            style={{
              color: isActive ? "var(--cyan)" : "var(--text-primary)",
            }}
          >
            {item.title}
          </span>
          {item.favorite && (
            <span
              className="flex-shrink-0 text-xs px-1 py-px rounded"
              style={{
                backgroundColor: "rgba(212, 168, 67, 0.12)",
                color: "var(--gold)",
                border: "1px solid rgba(212, 168, 67, 0.25)",
                fontSize: "0.65rem",
              }}
            >
              ★
            </span>
          )}
          {item.recent && (
            <span
              className="flex-shrink-0 text-xs px-1.5 py-px rounded"
              style={{
                backgroundColor: "rgba(100, 116, 139, 0.12)",
                color: "var(--text-subtle)",
                border: "1px solid rgba(100, 116, 139, 0.2)",
                fontSize: "0.65rem",
              }}
            >
              Recent
            </span>
          )}
        </div>
        <p
          className="text-xs truncate mt-0.5 leading-none"
          style={{ color: "var(--text-subtle)" }}
        >
          {item.description}
        </p>
      </div>

      <span
        className="flex-shrink-0 text-xs px-2 py-0.5 rounded hidden sm:block"
        style={{
          backgroundColor: "rgba(30, 45, 90, 0.5)",
          color: "var(--text-subtle)",
          border: "1px solid var(--navy-border)",
          fontSize: "0.65rem",
          whiteSpace: "nowrap",
        }}
      >
        {item.category}
      </span>
    </button>
  );
}

export default memo(SearchResultItem);
