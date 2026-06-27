import Link from "next/link";

const NAV_LINKS: [string, string][] = [
  ["Home", "/"],
  ["Projects", "/projects"],
  ["Live Apps", "/live-apps"],
  ["Command", "/command-center"],
  ["Revenue", "/revenue"],
  ["Roadmap", "/roadmap"],
  ["About", "/about"],
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
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(([label, href]) => (
            <Link key={label} href={href} className="nav-link">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
