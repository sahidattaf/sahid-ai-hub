export default function VercelLoading() {
  return (
    <div className="px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-5"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "var(--navy-border)",
              }}
            >
              <div
                className="h-7 w-10 rounded mb-2"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div
                className="h-3 w-24 rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-6 space-y-3"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "rgba(30, 45, 90, 0.6)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div
                    className="h-4 w-36 rounded"
                    style={{ backgroundColor: "var(--navy-800)" }}
                  />
                  <div
                    className="h-3 w-20 rounded"
                    style={{ backgroundColor: "var(--navy-800)" }}
                  />
                </div>
                <div
                  className="h-5 w-16 rounded-full"
                  style={{ backgroundColor: "var(--navy-800)" }}
                />
              </div>
              <div
                className="h-3 w-48 rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div
                className="h-3 w-full rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div
                className="h-3 w-4/5 rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--navy-border)" }}>
                <div
                  className="h-3 w-16 rounded"
                  style={{ backgroundColor: "var(--navy-800)" }}
                />
                <div
                  className="h-3 w-12 rounded"
                  style={{ backgroundColor: "var(--navy-800)" }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
