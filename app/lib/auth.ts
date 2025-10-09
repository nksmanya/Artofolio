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
    // This new `signIn` callback is the key change.
    // It checks if the user's email matches the ADMIN_EMAIL from your .env.local file.
    async signIn({ user }) {
      const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
      
      // A security check to ensure the ADMIN_EMAIL is set.
      if (!adminEmail) {
        console.error("CRITICAL SECURITY RISK: ADMIN_EMAIL is not set in environment variables. No logins will be allowed.");
        return false;
      }

      if (user.email && user.email.toLowerCase() === adminEmail) {
        return true; // If the emails match, allow the sign-in.
      } else {
        console.warn(`Unauthorized sign-in attempt by: ${user.email}`);
        return false; // If they don't match, block the sign-in.
      }
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

