interface ProjectLinkGridProps {
  websiteUrl?: string;
  githubUrl?: string;
  vercelProject?: string;
  tags: string[];
}

interface LinkItem {
  label: string;
  href: string;
  description: string;
  accent: "cyan" | "gold" | "muted";
}

export default function ProjectLinkGrid({
  websiteUrl,
  githubUrl,
  vercelProject,
  tags,
}: ProjectLinkGridProps) {
  const links: LinkItem[] = [];

  if (websiteUrl) {
    links.push({
      label: "Live Application",
      href: websiteUrl,
      description: "Open the deployed application",
      accent: "cyan",
    });
  }

  if (githubUrl) {
    links.push({
      label: "GitHub Repository",
      href: githubUrl,
      description: "View source code and commit history",
      accent: "muted",
    });
  }

  if (vercelProject) {
    links.push({
      label: "Vercel Project",
      href: `https://vercel.com/sahidattaf/${vercelProject}`,
      description: "Deployment dashboard on Vercel",
      accent: "gold",
    });
  }

  if (links.length === 0) return null;

  return (
    <div>
      <p
        className="text-xs font-mono uppercase tracking-widest mb-4"
        style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
      >
        Links
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {links.map(({ label, href, description, accent }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex flex-col rounded-lg border p-4"
            style={{
              backgroundColor: "var(--navy-card)",
              borderColor: "rgba(30, 45, 90, 0.6)",
            }}
          >
            <p
              className="text-sm font-semibold mb-1"
              style={{
                color:
                  accent === "cyan"
                    ? "var(--cyan)"
                    : accent === "gold"
                    ? "var(--gold)"
                    : "var(--text-primary)",
              }}
            >
              {label} ↗
            </p>
            <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
              {description}
            </p>
          </a>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="mt-6">
          <p
            className="text-xs font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--text-subtle)", letterSpacing: "0.1em" }}
          >
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded font-mono"
                style={{
                  backgroundColor: "var(--navy-800)",
                  color: "var(--text-subtle)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
