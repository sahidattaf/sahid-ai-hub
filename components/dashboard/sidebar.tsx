"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DASHBOARD_HOME, DASHBOARD_NAV, isActivePath } from "@/lib/dashboard-nav";

const ITEMS = [DASHBOARD_HOME, ...DASHBOARD_NAV];

// Responsive sidebar: fixed column on md+, slide-over drawer below md.
// Keyboard: the toggle is a real button (aria-expanded/controls), Escape closes
// the drawer and returns focus to it, and links are plain focusable anchors.
export default function DashboardSidebar({ signOutSlot }: { signOutSlot: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const nav = (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={() => setOpen(false)}
            className="rounded px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              outlineColor: "var(--cyan)",
              color: active ? "var(--cyan)" : "var(--text-muted)",
              backgroundColor: active ? "rgba(34, 211, 238, 0.10)" : "transparent",
              borderLeft: `2px solid ${active ? "var(--cyan)" : "transparent"}`,
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div
        className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b"
        style={{ backgroundColor: "rgba(5, 9, 26, 0.95)", borderColor: "var(--navy-border)" }}
      >
        <Link href="/dashboard" className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--cyan)" }}>
          Owner Dashboard
        </Link>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="dashboard-drawer"
          onClick={() => setOpen((v) => !v)}
          className="px-3 py-2 text-sm rounded border"
          style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}
        >
          {open ? "Close menu" : "Menu"}
        </button>
      </div>

      {open && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close menu"
          className="md:hidden fixed inset-0 z-40 cursor-default"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        id="dashboard-drawer"
        className={`${open ? "block" : "hidden"} md:block fixed md:sticky top-0 md:top-0 left-0 z-50 md:z-auto h-screen w-64 shrink-0 overflow-y-auto border-r p-4`}
        style={{ backgroundColor: "var(--navy-900)", borderColor: "var(--navy-border)" }}
      >
        <Link href="/" className="hidden md:block mb-6 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--cyan)" }}>
          Sahid AI Hub
        </Link>
        {nav}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: "var(--navy-border)" }}>
          {signOutSlot}
        </div>
      </aside>
    </>
  );
}
