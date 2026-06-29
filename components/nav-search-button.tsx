"use client";

export default function NavSearchButton() {
  function openPalette() {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  }

  return (
    <button
      onClick={openPalette}
      aria-label="Open command palette (Ctrl+K)"
      className="hidden md:flex items-center gap-2 rounded-md transition-all duration-150"
      style={{
        backgroundColor: "rgba(30, 45, 90, 0.4)",
        border: "1px solid var(--navy-border)",
        color: "var(--text-muted)",
        padding: "5px 10px",
        fontSize: "0.8rem",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.35)";
        e.currentTarget.style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--navy-border)";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx={11} cy={11} r={8} />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <span>Search</span>
      <kbd
        className="flex items-center gap-0.5 font-mono"
        style={{
          fontSize: "0.65rem",
          color: "var(--text-subtle)",
          marginLeft: "2px",
        }}
      >
        <span>⌘</span>
        <span>K</span>
      </kbd>
    </button>
  );
}
