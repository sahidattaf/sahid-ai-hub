"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  memo,
} from "react";
import { useRouter } from "next/navigation";
import { search, groupByCategory } from "@/lib/search";
import { DEFAULT_ITEMS, type SearchItem } from "@/data/search-index";
import SearchResultItem from "@/components/search-result-item";
import SearchGroup from "@/components/search-group";
import KeyboardShortcuts from "@/components/keyboard-shortcuts";

const SHORTCUTS = [
  { keys: ["↑", "↓"], label: "navigate" },
  { keys: ["↵"], label: "open" },
  { keys: ["Esc"], label: "close" },
];

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const results = useMemo<SearchItem[]>(() => {
    if (!query.trim()) return DEFAULT_ITEMS;
    return search(query);
  }, [query]);

  const grouped = useMemo<Map<string, SearchItem[]>>(() => {
    if (!query.trim()) return new Map([["Quick Access", DEFAULT_ITEMS]]);
    return groupByCategory(results);
  }, [results, query]);

  const closePalette = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
      setQuery("");
      setActiveIndex(0);
    }, 200);
  }, []);

  const openPalette = useCallback(() => {
    setOpen(true);
    // Double rAF ensures transition fires after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  // Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (open) closePalette();
        else openPalette();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, openPalette, closePalette]);

  // Custom event triggered by NavSearchButton
  useEffect(() => {
    function onCustomOpen() {
      openPalette();
    }
    window.addEventListener("open-command-palette", onCustomOpen);
    return () =>
      window.removeEventListener("open-command-palette", onCustomOpen);
  }, [openPalette]);

  // Focus input when palette opens
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      '[aria-selected="true"]',
    );
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const selectItem = useCallback(
    (item: SearchItem) => {
      closePalette();
      if (item.url.startsWith("http")) {
        window.open(item.url, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.url);
      }
    },
    [closePalette, router],
  );

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setActiveIndex(0);
  }

  function clearQuery() {
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.focus();
  }

  function onDialogKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        closePalette();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[activeIndex]) selectItem(results[activeIndex]);
        break;
      case "Tab":
        // Keep focus contained within the palette
        e.preventDefault();
        break;
    }
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[9999] flex items-start justify-center px-4"
      style={{
        paddingTop: "clamp(4rem, 10vh, 8rem)",
        backgroundColor: visible
          ? "rgba(5, 9, 26, 0.8)"
          : "rgba(5, 9, 26, 0)",
        backdropFilter: visible ? "blur(6px)" : "blur(0px)",
        transition: "background-color 0.2s ease, backdrop-filter 0.2s ease",
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) closePalette();
      }}
    >
      <div
        className="w-full max-w-2xl rounded-xl overflow-hidden"
        style={{
          backgroundColor: "var(--navy-card)",
          border: "1px solid var(--navy-border)",
          boxShadow:
            "0 32px 96px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(34, 211, 238, 0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(-12px) scale(0.97)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.2s ease, opacity 0.2s ease",
        }}
        onKeyDown={onDialogKeyDown}
      >
        {/* Search input row */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 border-b"
          style={{ borderColor: "var(--navy-border)" }}
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "var(--text-subtle)" }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx={11} cy={11} r={8} />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-results"
            aria-activedescendant={
              results[activeIndex]
                ? `cmd-item-${results[activeIndex].id}`
                : undefined
            }
            placeholder="Search projects, pages, modules…"
            value={query}
            onChange={handleQueryChange}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />

          {query && (
            <button
              onClick={clearQuery}
              className="text-xs rounded px-1.5 py-px transition-opacity hover:opacity-80"
              style={{ color: "var(--text-subtle)" }}
              aria-label="Clear search"
              tabIndex={-1}
            >
              ✕
            </button>
          )}

          <kbd
            className="hidden sm:inline-flex items-center px-1.5 py-px rounded font-mono"
            style={{
              backgroundColor: "rgba(30, 45, 90, 0.8)",
              color: "var(--text-subtle)",
              border: "1px solid var(--navy-border)",
              fontSize: "0.65rem",
            }}
            aria-hidden="true"
          >
            Esc
          </kbd>
        </div>

        {/* Results list */}
        <div
          id="command-results"
          role="listbox"
          aria-label="Search results"
          ref={listRef}
          className="overflow-y-auto py-1.5"
          style={{ maxHeight: "min(60vh, 440px)" }}
        >
          {results.length === 0 && query.trim() ? (
            <div
              className="px-4 py-10 text-center text-sm"
              style={{ color: "var(--text-subtle)" }}
            >
              No results for{" "}
              <span style={{ color: "var(--text-muted)" }}>
                &ldquo;{query}&rdquo;
              </span>
            </div>
          ) : (
            Array.from(grouped.entries()).map(([category, items]) => {
              let baseIdx = 0;
              for (const [cat, its] of grouped) {
                if (cat === category) break;
                baseIdx += its.length;
              }

              return (
                <div key={category} role="group" aria-label={category}>
                  <SearchGroup category={category} count={items.length} />
                  {items.map((item, i) => {
                    const globalIdx = baseIdx + i;
                    return (
                      <div
                        key={item.id}
                        id={`cmd-item-${item.id}`}
                        role="presentation"
                      >
                        <SearchResultItem
                          item={item}
                          isActive={activeIndex === globalIdx}
                          onSelect={() => selectItem(item)}
                          onHover={() => setActiveIndex(globalIdx)}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <KeyboardShortcuts shortcuts={SHORTCUTS} />
      </div>
    </div>
  );
}

export default memo(CommandPalette);
