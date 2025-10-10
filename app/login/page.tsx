"use client";

import { signIn } from "next-auth/react";
import { CyberpunkButton } from "@/app/components/CyberpunkButton";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-8 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_20px_#0891b2]">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400 text-center">Admin Access</h1>
      <p className="text-gray-400 text-center mb-6">This portfolio is centrally managed. Please sign in to continue.</p>
      <div className="flex justify-center">
        <CyberpunkButton onClick={() => signIn('github')}>
          Sign in with GitHub
        </CyberpunkButton>
      </div>
    </div>
  );
}
