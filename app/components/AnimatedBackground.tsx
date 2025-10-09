"use client";

import React from "react";

export default function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Neon grid */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage:
          "linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0",
      }} />

      {/* Animated scanlines */}
      <div className="absolute inset-0 mix-blend-screen" style={{
        backgroundImage: "repeating-linear-gradient( to bottom, rgba(8,145,178,0.08) 0, rgba(8,145,178,0.08) 2px, transparent 2px, transparent 4px )",
        animation: "scan 8s linear infinite",
      }} />

      {/* Floating orbs */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-20 bg-cyan-600 animate-pulse" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-20 bg-fuchsia-600 animate-pulse" />

      <style>{`
        @keyframes scan {
          0% { background-position-y: 0px; }
          100% { background-position-y: 100%; }
        }
      `}</style>
    </div>
  );
}


