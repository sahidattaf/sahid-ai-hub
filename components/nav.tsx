import Link from "next/link";
import NavSearchButton from "@/components/nav-search-button";

const NAV_LINKS: [string, string][] = [
  ["Home", "/"],
  ["Projects", "/projects"],
  ["Live Apps", "/live-apps"],
  ["Command", "/command-center"],
  ["Roadmap", "/roadmap"],
  ["About", "/about"],
  ["Dashboard", "/dashboard"],
];

export default function Nav() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(5, 9, 26, 0.92)",
        borderColor: "var(--navy-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold tracking-widest uppercase"
          style={{ color: "var(--cyan)", letterSpacing: "0.15em" }}
        >
          Sahid AI Hub
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-4">
          {NAV_LINKS.map(([label, href]) => (
            <Link key={label} href={href} className="nav-link">
              {label}
            </Link>
          ))}
          <NavSearchButton />
        </nav>
        {/* Mobile: native <details> keeps the menu keyboard accessible without client JS. */}
        <details className="md:hidden relative">
          <summary
            className="list-none cursor-pointer px-3 py-2 text-sm rounded border"
            style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}
          >
            Menu
          </summary>
          <nav
            aria-label="Primary mobile"
            className="absolute right-0 mt-2 w-48 rounded border p-2 flex flex-col"
            style={{ backgroundColor: "var(--navy-card)", borderColor: "var(--navy-border)" }}
          >
            {NAV_LINKS.map(([label, href]) => (
              <Link key={label} href={href} className="nav-link px-3 py-2">
                {label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
