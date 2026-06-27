export default function GitHubLoading() {
  return (
    <div className="px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div
          className="rounded-lg border p-7 animate-pulse"
          style={{
            backgroundColor: "var(--navy-card)",
            borderColor: "var(--navy-border)",
          }}
        >
          <div className="flex gap-6">
            <div
              className="w-22 h-22 rounded-full flex-shrink-0"
              style={{
                width: "88px",
                height: "88px",
                backgroundColor: "var(--navy-800)",
              }}
            />
            <div className="flex-1 space-y-3">
              <div
                className="h-5 w-48 rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div
                className="h-3 w-32 rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div
                className="h-3 w-72 rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse"
        >
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
                className="h-7 w-12 rounded mb-2"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div
                className="h-3 w-20 rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-5 space-y-3"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "rgba(30, 45, 90, 0.6)",
              }}
            >
              <div
                className="h-4 w-36 rounded"
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
              <div
                className="h-3 w-16 rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
