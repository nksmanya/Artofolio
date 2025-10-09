"use client";

import React from "react";

interface CyberpunkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * A reusable button component styled with a distinct cyberpunk aesthetic,
 * featuring a chunky shadow and interactive animations on hover and click.
 * It also supports a disabled state.
 */
export const CyberpunkButton = ({ children, className, ...props }: CyberpunkButtonProps) => {
  return (
    <button
      className={`
        px-6 py-2 bg-cyan-500 text-gray-900 font-bold 
        border-2 border-cyan-500 rounded-md 
        transition-all duration-300 ease-in-out 
        transform hover:-translate-y-1 
        shadow-[4px_4px_0px_0px_#0891b2] 
        hover:shadow-[6px_6px_0px_0px_#0891b2]
        active:shadow-[2px_2px_0px_0px_#0891b2]
        active:translate-x-1 active:translate-y-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

