import Link from "next/link";

export default function PageHeader({
  label,
  title,
  description,
  breadcrumb,
}: {
  label: string;
  title: string;
  description: string;
  breadcrumb?: string;
}) {
  return (
    <section
      className="pt-16 pb-14 px-6 border-b section-divider"
      style={{ backgroundColor: "var(--navy-900)" }}
    >
      <div className="max-w-6xl mx-auto">
        {breadcrumb && (
          <nav className="flex items-center gap-2 mb-8 text-xs">
            <Link href="/" className="nav-link" style={{ fontSize: "0.75rem" }}>
              Home
            </Link>
            <span style={{ color: "var(--navy-border)" }}>/</span>
            <span style={{ color: "var(--text-subtle)", fontSize: "0.75rem" }}>
              {breadcrumb}
            </span>
          </nav>
        )}
        <p
          className="text-xs font-mono tracking-widest uppercase mb-4"
          style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
        >
          {label}
        </p>
        <h1
          className="text-3xl md:text-5xl font-bold mb-4 tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        <p
          className="text-base max-w-2xl leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}
