"use client";

import { SessionProvider } from "next-auth/react";

/**
 * A client-side component that wraps the application in NextAuth's SessionProvider.
 * This makes the user session data (like login status, user name, etc.)
 * available globally to any component that needs it.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}

