import "server-only";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

function ownerId() {
  return process.env.OWNER_GITHUB_ID?.trim();
}

export function ownerLoginConfigured() {
  const id = ownerId();
  return Boolean(
    id && /^\d+$/.test(id) && process.env.AUTH_SECRET &&
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    signIn({ account }) {
      return ownerLoginConfigured() &&
        account?.provider === "github" && account.providerAccountId === ownerId();
    },
    jwt({ token, account }) {
      if (account?.provider === "github") token.sub = account.providerAccountId;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});

export async function hasOwnerSession() {
  if (!ownerLoginConfigured()) return false;
  const session = await auth();
  return session?.user?.id === ownerId();
}
