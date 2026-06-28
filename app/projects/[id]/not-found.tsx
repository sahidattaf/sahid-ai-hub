import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p
          className="text-xs font-mono tracking-widest uppercase mb-4"
          style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
        >
          404
        </p>
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Project Not Found
        </h1>
        <p
          className="text-base leading-relaxed mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          This project doesn&rsquo;t exist in the registry, may be private, or the
          URL is incorrect.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded transition-all"
            style={{ backgroundColor: "var(--cyan)", color: "var(--navy-950)" }}
          >
            View All Projects
          </Link>
          <Link
            href="/registry"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded border transition-all"
            style={{
              borderColor: "var(--navy-border)",
              color: "var(--text-muted)",
            }}
          >
            Project Registry
          </Link>
        </div>
      </div>
    </main>
  );
}
