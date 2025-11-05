"use client";

import { Suspense, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { CyberpunkButton } from "./CyberpunkButton";
import SearchBar from "./SearchBar";

/**
 * The main header and navigation bar for the application.
 * It displays the site title and handles user authentication status,
 * showing sign-in/sign-out buttons and user info accordingly.
 */
export default function Header() {
  const { data: session } = useSession();
  const adminEnv = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "nksmanya@gmail.com").toLowerCase();
  const isMainAdmin = (session?.user?.email || "").toLowerCase() === adminEnv;

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="p-4 border-b border-cyan-500/50 sticky top-0 bg-gray-900/80 backdrop-blur-md z-10">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-cyan-400 hover:text-cyan-300 transition-colors tracking-wider uppercase flex items-center gap-2">
          <img src="/favicon.ico" alt="Artofolio" className="h-5 w-5" />
          Artofolio
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/#featured" className="text-cyan-300 hover:text-white transition">Featured</Link>
          <Link href="/#latest" className="text-cyan-300 hover:text-white transition">Gallery</Link>
          {isMainAdmin && (
            <Link href="/artwork/new" className="text-cyan-300 hover:text-white transition">New</Link>
          )}
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded bg-gray-800/60"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {session ? (
            <>
              {isMainAdmin && (
                <Link href="/artwork/new" className="hidden md:inline">
                  <CyberpunkButton>Add Artwork</CyberpunkButton>
                </Link>
              )}
              <div className="hidden md:flex items-center gap-3">
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
              </div>
              {/* mobile sign out button inside mobile menu */}
            </>
          ) : (
            <div className="hidden md:block">
              <CyberpunkButton onClick={() => signIn("github")}>
                Sign In with GitHub
              </CyberpunkButton>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900 border-t border-cyan-500/30 p-4">
          <div className="flex flex-col gap-3">
            <Link href="/#featured" onClick={() => setMobileOpen(false)} className="text-cyan-300">Featured</Link>
            <Link href="/#latest" onClick={() => setMobileOpen(false)} className="text-cyan-300">Gallery</Link>
            {isMainAdmin && (
              <Link href="/artwork/new" onClick={() => setMobileOpen(false)} className="text-cyan-300">New</Link>
            )}
            <Suspense fallback={null}>
              <SearchBar />
            </Suspense>
            <div className="flex flex-col gap-2 mt-2">
              {session ? (
                <>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="px-3 py-2 bg-red-500 rounded text-sm font-bold">Sign Out</button>
                </>
              ) : (
                <button onClick={() => { signIn("github"); setMobileOpen(false); }} className="px-3 py-2 bg-cyan-600 rounded text-sm font-bold">Sign In with GitHub</button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}