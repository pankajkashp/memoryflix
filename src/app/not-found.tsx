"use client";

/**
 * MemoryFlix — Premium 404 Page
 * Cinematic design with GSAP entrance animation.
 */

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap-utils";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo("[data-nf-code]", { opacity: 0, scale: 0.8, filter: "blur(20px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8 })
        .fromTo("[data-nf-title]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .fromTo("[data-nf-sub]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2")
        .fromTo("[data-nf-btn]", { opacity: 0, y: 16, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4 }, "-=0.1");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8F2] text-[#3B2436] flex flex-col items-center justify-center px-6 relative overflow-hidden selection:bg-[#E85D75]/25">
      {/* Ambient glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#E85D75]/10 blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#B79FD1]/10 blur-[100px] pointer-events-none mix-blend-multiply" />

      {/* Paper grain */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      <div ref={containerRef} className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* 404 code */}
        <div
          data-nf-code
          className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter select-none mb-4"
          style={{
            willChange: "transform, opacity, filter",
            backgroundImage: "linear-gradient(135deg, rgba(232,93,117,0.35) 0%, rgba(183,159,209,0.25) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </div>

        {/* Logo */}
        <div className="mb-8">
          { }
          <img src="/icon.png" alt="MemoryFlix Logo" className="w-24 h-24 object-cover mx-auto rounded-2xl shadow-magical" />
        </div>

        <h1
          data-nf-title
          className="text-3xl sm:text-4xl font-black tracking-tight text-[#3B2436] mb-3"
          style={{ willChange: "transform, opacity" }}
        >
          This memory doesn&apos;t exist
        </h1>

        <p
          data-nf-sub
          className="text-[#8B6B7A] text-base mb-10 leading-relaxed"
          style={{ willChange: "transform, opacity" }}
        >
          The page you&apos;re looking for may have been moved, deleted, or never existed.
          Every memory deserves a proper home — let&apos;s get you back to yours.
        </p>

        <div
          data-nf-btn
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          style={{ willChange: "transform, opacity" }}
        >
          <Link
            href="/templates"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E85D75] to-[#B79FD1] text-white font-bold text-sm hover:scale-[1.02] transition-all shadow-magical hover:-translate-y-0.5"
          >
            Explore Templates
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white border border-[#F0DCE0] text-[#3B2436] font-semibold text-sm hover:bg-[#FDEFE6] transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
