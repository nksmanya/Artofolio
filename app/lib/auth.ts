import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // This `signIn` callback allows any authenticated GitHub user to sign in.
    // Admin-only protections remain enforced server-side via `isMainAdmin` / `isAdmin` in API routes.
    async signIn({ user }) {
      const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

      // If ADMIN_EMAIL is not configured, allow sign-ins but warn — safer than blocking everyone.
      if (!adminEmail) {
        console.warn("ADMIN_EMAIL not set — allowing sign-ins but no admin will be available.");
        return true;
      }

      // Allow all authenticated GitHub users to sign in. Server-side routes still check admin status.
      return true;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        // The 'role' from your Prisma schema can be added here if needed
        role: (user as any).role, 
      },
    }),
  },
};

