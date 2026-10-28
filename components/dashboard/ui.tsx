import type { ReactNode } from "react";
import { FAILURE_LABELS, type IntegrationResult } from "@/lib/integrations/types";

export function formatUtc(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "unknown" : `${d.toISOString().slice(0, 16).replace("T", " ")} UTC`;
}

export function DashHeader({ title, description }: { title: string; description: string }) {
  return (
    <header>
      <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        {title}
      </h1>
      <p className="text-sm max-w-2xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {description}
      </p>
    </header>
  );
}

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border p-5" style={{ backgroundColor: "var(--navy-card)", borderColor: "var(--navy-border)" }}>
      {title && (
        <h2 className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: "var(--gold)" }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function StatTile({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-lg border p-4 stat-border" style={{ backgroundColor: "var(--navy-card)", borderColor: "var(--navy-border)" }}>
      <p className="text-2xl font-bold font-mono" style={{ color: "var(--cyan)" }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      {note && (
        <p className="text-xs mt-1" style={{ color: "var(--text-subtle)" }}>
          {note}
        </p>
      )}
    </div>
  );
}

export function Pill({ children, tone = "muted" }: { children: ReactNode; tone?: "ok" | "warn" | "bad" | "muted" }) {
  const colors = { ok: "var(--cyan)", warn: "var(--gold)", bad: "#f87171", muted: "var(--text-subtle)" } as const;
  return (
    <span className="text-xs font-mono px-2 py-0.5 rounded-full border" style={{ color: colors[tone], borderColor: colors[tone] }}>
      {children}
    </span>
  );
}

export function SetupState({ title, missing, steps }: { title: string; missing: string[]; steps: string[] }) {
  return (
    <Panel title="Setup required">
      <p className="text-sm mb-3" style={{ color: "var(--text-primary)" }}>
        {title}
      </p>
      <p className="text-xs mb-2" style={{ color: "var(--text-subtle)" }}>
        Missing environment variables:
      </p>
      <ul className="mb-4 space-y-1">
        {missing.map((m) => (
          <li key={m}>
            <code className="text-xs font-mono" style={{ color: "var(--cyan)" }}>
              {m}
            </code>
          </li>
        ))}
      </ul>
      <ol className="list-decimal pl-5 space-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </Panel>
  );
}

/**
 * Provenance + status strip shown above every integration view: where the data
 * came from, when it was last fetched successfully, and whether it is fresh.
 * Failures are shown as failures, never as zero counts.
 */
export function IntegrationStatus<T>({ result }: { result: IntegrationResult<T> }) {
  if (result.state === "unconfigured") {
    return (
      <Panel title="Source">
        <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {result.source} · <Pill tone="warn">not configured</Pill> · no data fetched
        </p>
      </Panel>
    );
  }
  if (result.state === "error") {
    return (
      <div role="alert" className="rounded-lg border p-5" style={{ borderColor: "#f87171", backgroundColor: "rgba(248,113,113,0.08)" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: "#f87171" }}>
          Fetch failed — {FAILURE_LABELS[result.kind]}
        </p>
        <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
          {result.message} No counts are shown for this fetch.
          {result.retryAfterSeconds !== undefined && ` Provider asks to retry in ~${result.retryAfterSeconds}s.`}
        </p>
        <p className="text-xs font-mono" style={{ color: "var(--text-subtle)" }}>
          Source: {result.source} · Attempted: {formatUtc(result.attemptedAt)} ·{" "}
          {result.lastSuccess ? `Last successful fetch: ${formatUtc(result.lastSuccess.fetchedAt)} (stale)` : "No successful fetch yet in this server process"}
        </p>
      </div>
    );
  }
  return (
    <Panel title="Source">
      <p className="text-xs font-mono flex flex-wrap items-center gap-2" style={{ color: "var(--text-muted)" }}>
        <span>{result.source}</span>
        <span>· Last successful fetch: {formatUtc(result.fetchedAt)}</span>
        <Pill tone={result.freshness === "fresh" ? "ok" : "warn"}>{result.freshness}</Pill>
        {result.state === "empty" && <Pill tone="muted">provider returned no items</Pill>}
      </p>
    </Panel>
  );
}
