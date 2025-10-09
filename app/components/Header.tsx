"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { CyberpunkButton } from "./CyberpunkButton";

/**
 * The main header and navigation bar for the application.
 * It displays the site title and handles user authentication status,
 * showing sign-in/sign-out buttons and user info accordingly.
 */
export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="p-4 border-b border-cyan-500/50 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
          Artopolio
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/artwork/new">
                  <CyberpunkButton>Add Artwork</CyberpunkButton>
                </Link>
              )}
              <CyberpunkButton onClick={() => signOut()} className="bg-red-500 border-red-500 hover:bg-red-400 hover:border-red-400 shadow-[4px_4px_0px_0px_#b91c1c] hover:shadow-[6px_6px_0px_0px_#b91c1c] active:shadow-[2px_2px_0px_0px_#b91c1c]">
                Sign Out
              </CyberpunkButton>
              {session.user?.image && (
                 <img
                    src={session.user.image}
                    alt={session.user.name || "User avatar"}
                    className="w-10 h-10 rounded-full border-2 border-cyan-400"
                  />
              )}
            </>
          ) : (
            <CyberpunkButton onClick={() => signIn("github")}>
              Sign In with GitHub
            </CyberpunkButton>
          )}
        </div>
      </nav>
    </header>
  );
}

