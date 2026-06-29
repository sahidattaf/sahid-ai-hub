import { memo } from "react";

interface Shortcut {
  keys: string[];
  label: string;
}

interface Props {
  shortcuts: Shortcut[];
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd
      className="inline-flex items-center justify-center rounded font-mono"
      style={{
        backgroundColor: "rgba(30, 45, 90, 0.8)",
        color: "var(--text-muted)",
        border: "1px solid var(--navy-border)",
        fontSize: "0.65rem",
        padding: "2px 5px",
        minWidth: "1.25rem",
        lineHeight: "1.4",
      }}
    >
      {children}
    </kbd>
  );
}

function KeyboardShortcuts({ shortcuts }: Props) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 py-2.5 border-t"
      style={{
        borderColor: "var(--navy-border)",
        color: "var(--text-subtle)",
        fontSize: "0.7rem",
      }}
      aria-hidden="true"
    >
      {shortcuts.map((s, i) => (
        <span key={i} className="flex items-center gap-1">
          {s.keys.map((k) => (
            <Kbd key={k}>{k}</Kbd>
          ))}
          <span className="ml-0.5">{s.label}</span>
        </span>
      ))}
    </div>
  );
}

export default memo(KeyboardShortcuts);
