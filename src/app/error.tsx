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
    <main className="min-h-screen bg-[#FFF8F2] text-[#3B2436] flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-[#E85D75]/25">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#B9425C]/10 blur-[100px] pointer-events-none mix-blend-multiply" />

      <div ref={containerRef} className="relative z-10 flex flex-col items-center text-center max-w-md gap-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#F6D3DA] border border-[#F0DCE0] flex items-center justify-center shadow-magical">
          <svg className="w-9 h-9 text-[#B9425C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#3B2436] mb-3">
            Something went wrong
          </h1>
          <p className="text-[#8B6B7A] text-sm leading-relaxed">
            An unexpected error occurred. This has been logged and we&apos;re working on it.
            You can try again or return to the dashboard.
          </p>
          {error.digest && (
            <p className="text-[#B49AA4] text-xs mt-3 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E85D75] to-[#B79FD1] text-white font-bold text-sm hover:scale-[1.02] transition-all shadow-magical hover:-translate-y-0.5"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white border border-[#F0DCE0] text-[#3B2436] font-semibold text-sm hover:bg-[#FDEFE6] transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
