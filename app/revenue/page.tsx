import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { REVENUE_STREAMS, type IncomeType } from "@/data/command-center";

export const metadata: Metadata = {
  title: "Revenue",
  description:
    "Seven active revenue streams — what each offers, who it serves, and how income flows.",
};

const INCOME_TYPE_ORDER: IncomeType[] = ["Project", "Retainer", "Service", "Product"];

function incomeTypeBadgeClass(type: IncomeType): string {
  const map: Record<IncomeType, string> = {
    Project: "badge-live",
    Retainer: "badge-prototype",
    Service: "badge-repo",
    Product: "badge-public",
  };
  return map[type];
}

export default function RevenuePage() {
  const byType = INCOME_TYPE_ORDER.map((type) => ({
    type,
    streams: REVENUE_STREAMS.filter((s) => s.incomeType === type),
  })).filter(({ streams }) => streams.length > 0);

  return (
    <>
      <PageHeader
        breadcrumb="Revenue"
        label="Revenue Engine"
        title="Commercial Offers"
        description="Seven active revenue streams organized by income type. Each entry shows what it is, who it serves, and how income flows from the engagement."
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INCOME_TYPE_ORDER.map((type) => {
              const count = REVENUE_STREAMS.filter(
                (s) => s.incomeType === type
              ).length;
              return (
                <div
                  key={type}
                  className="rounded-lg border p-5"
                  style={{
                    backgroundColor: "var(--navy-card)",
                    borderColor: "var(--navy-border)",
                  }}
                >
                  <p
                    className="text-2xl font-bold font-mono mb-1"
                    style={{ color: "var(--gold)" }}
                  >
                    {count}
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {type}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    {type === "Project" && "One-time build engagements"}
                    {type === "Retainer" && "Ongoing monthly relationships"}
                    {type === "Service" && "Packaged delivery programs"}
                    {type === "Product" && "Self-serve digital purchases"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-16">
            {byType.map(({ type, streams }) => (
              <section key={type}>
                <div
                  className="flex items-center gap-3 mb-6 pb-4 border-b"
                  style={{ borderColor: "var(--navy-border)" }}
                >
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-mono ${incomeTypeBadgeClass(type)}`}
                  >
                    {type}
                  </span>
                  <p
                    className="text-xs"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    {streams.length} stream{streams.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {streams.map((stream) => {
                    const globalIndex =
                      REVENUE_STREAMS.findIndex(
                        (s) => s.name === stream.name
                      ) + 1;
                    return (
                      <div
                        key={stream.name}
                        className="card-hover rounded-lg border p-6"
                        style={{
                          backgroundColor: "var(--navy-card)",
                          borderColor: "rgba(30, 45, 90, 0.6)",
                        }}
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <span
                            className="text-xs font-mono flex-shrink-0 pt-0.5"
                            style={{ color: "var(--gold)" }}
                          >
                            {String(globalIndex).padStart(2, "0")}
                          </span>
                          <h3
                            className="text-base font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {stream.name}
                          </h3>
                        </div>

                        <p
                          className="text-sm leading-relaxed mb-5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {stream.description}
                        </p>

                        <div className="space-y-4">
                          <div>
                            <p
                              className="text-xs font-mono uppercase mb-1"
                              style={{
                                color: "var(--text-subtle)",
                                letterSpacing: "0.1em",
                              }}
                            >
                              Who it serves
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {stream.audience}
                            </p>
                          </div>
                          <div>
                            <p
                              className="text-xs font-mono uppercase mb-1"
                              style={{
                                color: "var(--text-subtle)",
                                letterSpacing: "0.1em",
                              }}
                            >
                              How it earns
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {stream.howItEarns}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <div
            className="mt-16 rounded-lg border p-10 text-center"
            style={{
              backgroundColor: "var(--navy-card)",
              borderColor: "var(--navy-border)",
            }}
          >
            <p
              className="text-xs font-mono tracking-widest uppercase mb-3"
              style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}
            >
              Inquire
            </p>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to engage
            </h2>
            <p
              className="text-sm max-w-md mx-auto mb-8 leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Reach out directly to discuss which engagement model fits your
              situation. Response within 24 hours.
            </p>
            <a
              href="mailto:sahidattaf@gmail.com"
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded"
              style={{
                backgroundColor: "var(--cyan)",
                color: "var(--navy-950)",
              }}
            >
              Send an Email
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
