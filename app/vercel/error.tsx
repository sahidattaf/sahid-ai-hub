"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function VercelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Vercel Dashboard]", error.message);
  }, [error]);

  return (
    <div className="px-6 py-24">
      <div className="max-w-2xl mx-auto text-center">
        <p
          className="text-xs font-mono uppercase tracking-widest mb-4"
          style={{ color: "var(--gold)", letterSpacing: "0.2em" }}
        >
          API Error
        </p>
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Vercel data unavailable
        </h1>
        <p
          className="text-base leading-relaxed max-w-md mx-auto mb-10"
          style={{ color: "var(--text-muted)" }}
        >
          The Vercel API could not be reached right now. This may be a
          temporary network issue or the token may have expired. Check that{" "}
          <code
            className="text-xs px-1.5 py-0.5 rounded font-mono"
            style={{ backgroundColor: "var(--navy-800)", color: "var(--cyan)" }}
          >
            VERCEL_TOKEN
          </code>{" "}
          is set in your environment and try again.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded"
            style={{ backgroundColor: "var(--cyan)", color: "var(--navy-950)" }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-sm font-medium rounded border"
            style={{ borderColor: "var(--navy-border)", color: "var(--text-muted)" }}
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
