import Image from "next/image";
import { type GitHubUser, normalizeBlogUrl } from "@/lib/github";

export default function GitHubProfile({ profile }: { profile: GitHubUser }) {
  const blog = normalizeBlogUrl(profile.blog);

  return (
    <div
      className="rounded-lg border p-7"
      style={{
        backgroundColor: "var(--navy-card)",
        borderColor: "var(--navy-border)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="flex-shrink-0">
          <Image
            src={profile.avatar_url}
            alt={`${profile.login} GitHub avatar`}
            width={88}
            height={88}
            className="rounded-full"
            style={{
              border: "2px solid var(--navy-border)",
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {profile.name ?? profile.login}
              </h2>
              <p
                className="text-sm font-mono mt-0.5"
                style={{ color: "var(--text-subtle)" }}
              >
                @{profile.login}
              </p>
            </div>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-1.5 text-xs font-medium rounded border flex-shrink-0"
              style={{
                borderColor: "var(--navy-border)",
                color: "var(--text-muted)",
              }}
            >
              View on GitHub
            </a>
          </div>

          {profile.bio && (
            <p
              className="text-sm leading-relaxed mt-3 max-w-xl"
              style={{ color: "var(--text-muted)" }}
            >
              {profile.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
            {profile.location && (
              <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
                {profile.location}
              </span>
            )}
            {profile.company && (
              <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
                {profile.company}
              </span>
            )}
            {blog && (
              <a
                href={blog}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs"
                style={{ color: "var(--cyan)" }}
              >
                {blog.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t"
        style={{ borderColor: "var(--navy-border)" }}
      >
        <ProfileStat label="Followers" value={profile.followers} />
        <ProfileStat label="Following" value={profile.following} />
        <ProfileStat label="Public Repos" value={profile.public_repos} />
      </div>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p
        className="text-2xl font-bold font-mono"
        style={{ color: "var(--cyan)" }}
      >
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: "var(--text-subtle)" }}>
        {label}
      </p>
    </div>
  );
}
