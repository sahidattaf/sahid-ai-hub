import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="py-8 px-6 border-t section-divider"
      style={{ backgroundColor: "var(--navy-900)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-mono transition-colors"
          style={{ color: "var(--text-subtle)" }}
        >
          Sahid AI Hub
        </Link>
        <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
          Built with Next.js, TypeScript, and Tailwind CSS. Deployed on Vercel.
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com/sahidattaf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs footer-link transition-colors"
            style={{ color: "var(--text-subtle)" }}
          >
            GitHub
          </a>
          <a
            href="mailto:sahidattaf@gmail.com"
            className="text-xs footer-link transition-colors"
            style={{ color: "var(--text-subtle)" }}
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
