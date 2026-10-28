import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { isOwnerGithubId } from "@/lib/auth/owner";

declare module "next-auth" {
  interface Session {
    githubId?: string;
  }
}

// Auth.js (next-auth v5) with GitHub OAuth and stateless JWT sessions.
// Sign-in is refused for every GitHub account except the owner allowlist
// (OWNER_GITHUB_IDS); the allowlist is re-checked on every session read.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub({ clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET })],
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    signIn({ profile }) {
      return isOwnerGithubId(profile?.id);
    },
    jwt({ token, profile }) {
      if (profile?.id !== undefined) token.githubId = String(profile.id);
      return token;
    },
    session({ session, token }) {
      // Expose the minimum: display name and the ID used for the allowlist check.
      return { expires: session.expires, user: { name: session.user?.name ?? null }, githubId: typeof token.githubId === "string" ? token.githubId : undefined } as typeof session;
    },
  },
});
