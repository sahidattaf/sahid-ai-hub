import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import { SERVICES } from "@/data/command-center";

export const metadata: Metadata = {
  title: "Services",
  description: "AI services offered: websites, custom GPTs, support, hospitality AI, training and digital products.",
};

// Public summary only: what is offered. No pricing, income model, client
// information or revenue figures are published on this page.
export default function ServicesPage() {
  return (
    <>
      <PageHeader
        breadcrumb="Services"
        label="Services"
        title="Services"
        description="A summary of the AI services offered. Get in touch to discuss scope."
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5">
            {SERVICES.map((service, index) => (
              <div key={service.name} className="card-hover rounded-lg border p-6" style={{ backgroundColor: "var(--navy-card)", borderColor: "rgba(30, 45, 90, 0.6)" }}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xs font-mono flex-shrink-0 pt-0.5" style={{ color: "var(--gold)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                    {service.name}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-lg border p-10 text-center" style={{ backgroundColor: "var(--navy-card)", borderColor: "var(--navy-border)" }}>
            <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "var(--cyan)", letterSpacing: "0.2em" }}>
              Inquire
            </p>
            <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Get in touch
            </h2>
            <p className="text-sm max-w-md mx-auto mb-8 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Reach out directly to discuss which service fits your situation.
            </p>
            <a href="mailto:sahidattaf@gmail.com" className="inline-flex items-center px-6 py-3 text-sm font-medium rounded" style={{ backgroundColor: "var(--cyan)", color: "var(--navy-950)" }}>
              Send an Email
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
