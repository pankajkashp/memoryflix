import React from "react";
import Link from "next/link";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white relative font-sans">
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 bg-gradient-to-b from-black/80 to-transparent">
        <span className="text-red-600 font-bold text-2xl md:text-3xl tracking-tighter">MEMORYFLIX</span>
        <Link 
          href="/dashboard"
          className="text-white/80 hover:text-white text-sm md:text-base font-medium transition-colors"
        >
          Exit Preview
        </Link>
      </header>
      {children}
    </div>
  );
}
