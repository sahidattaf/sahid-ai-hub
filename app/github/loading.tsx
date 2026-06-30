export default function GitHubLoading() {
  return (
    <div className="px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 animate-pulse">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-4"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "var(--navy-border)",
              }}
            >
              <div
                className="h-6 w-10 rounded mb-2"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div
                className="h-3 w-16 rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
            </div>
          ))}
        </div>

        <div
          className="h-12 rounded-lg animate-pulse"
          style={{ backgroundColor: "var(--navy-card)" }}
        />

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-5 space-y-3"
              style={{
                backgroundColor: "var(--navy-card)",
                borderColor: "rgba(30, 45, 90, 0.6)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="h-4 w-32 rounded"
                  style={{ backgroundColor: "var(--navy-800)" }}
                />
                <div
                  className="h-5 w-16 rounded-full"
                  style={{ backgroundColor: "var(--navy-800)" }}
                />
              </div>
              <div
                className="h-3 w-full rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div
                className="h-3 w-4/5 rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div
                className="h-8 w-full rounded"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
              <div
                className="h-1.5 w-full rounded-full"
                style={{ backgroundColor: "var(--navy-800)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
