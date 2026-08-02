"use client";

/**
 * MemoryFlix — Premium Error Boundary Page
 * Shown on unexpected runtime errors.
 */

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap-utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Log for diagnostics
    console.error("[MemoryFlix Error]", error);
  }, [error]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out" }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-rose-500/30">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-red-500/6 blur-[100px] pointer-events-none" />

      <div ref={containerRef} className="relative z-10 flex flex-col items-center text-center max-w-md gap-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.1)]">
          <svg className="w-9 h-9 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-3">
            Something went wrong
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            An unexpected error occurred. This has been logged and we&apos;re working on it.
            You can try again or return to the dashboard.
          </p>
          {error.digest && (
            <p className="text-zinc-600 text-xs mt-3 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-sm hover:from-rose-400 hover:to-purple-500 transition-all shadow-[0_0_30px_rgba(244,63,94,0.25)] hover:-translate-y-0.5"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
