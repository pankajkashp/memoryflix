"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-utils";
import { prefersReducedMotion } from "@/lib/gsap-utils";

/**
 * DashboardAmbientBackground
 * Lightweight, GPU-optimized background animation for the dashboard.
 * Creates an emotional, calm atmosphere using soft orbs, a giant blurred heart, and floating sparkles.
 */
export default function DashboardAmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const pinkOrbRef = useRef<HTMLDivElement>(null);
  const purpleOrbRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const reduced = prefersReducedMotion();
    if (reduced) return;

    const ctx = gsap.context(() => {
      // 1. Heart Breathing Animation
      if (heartRef.current) {
        gsap.to(heartRef.current, {
          scale: 1.03,
          opacity: 0.04,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // 2. Slow Orb Drifting
      if (pinkOrbRef.current) {
        gsap.to(pinkOrbRef.current, {
          x: "20vw",
          y: "15vh",
          rotation: 15,
          duration: 35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      if (purpleOrbRef.current) {
        gsap.to(purpleOrbRef.current, {
          x: "-20vw",
          y: "-15vh",
          rotation: -15,
          duration: 28,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // 3. Tiny Sparkles Floating
      if (sparklesRef.current) {
        const sparkles = sparklesRef.current.querySelectorAll(".sparkle");
        sparkles.forEach((sparkle, i) => {
          gsap.to(sparkle, {
            x: `+=${gsap.utils.random(-80, 80)}`,
            y: `+=${gsap.utils.random(-80, 80)}`,
            duration: gsap.utils.random(20, 30),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.4
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Soft Radial Orbs ────────────────────────────────────────── */}
      <div 
        ref={pinkOrbRef}
        className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] min-w-[500px] min-h-[500px] rounded-full opacity-[0.15] blur-[120px]"
        style={{ 
          background: "radial-gradient(circle, theme(colors.rose.500) 0%, transparent 70%)",
          willChange: "transform" 
        }}
      />
      <div 
        ref={purpleOrbRef}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] min-w-[600px] min-h-[600px] rounded-full opacity-[0.12] blur-[120px]"
        style={{ 
          background: "radial-gradient(circle, theme(colors.purple.500) 0%, transparent 70%)",
          willChange: "transform" 
        }}
      />

      {/* ── Giant Blurred Heart Outline ─────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          ref={heartRef}
          className="relative flex items-center justify-center pointer-events-none"
          style={{ 
            width: "1400px", 
            height: "1400px", 
            opacity: 0.15, 
            willChange: "transform, opacity",
            filter: "blur(20px)"
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#ambient-heart-gradient)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full drop-shadow-2xl"
          >
            <defs>
              <linearGradient id="ambient-heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" /> {/* rose-500 */}
                <stop offset="100%" stopColor="#a855f7" /> {/* purple-500 */}
              </linearGradient>
            </defs>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </div>

      {/* ── Floating Sparkles ───────────────────────────────────────── */}
      <div ref={sparklesRef} className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="sparkle absolute w-[6px] h-[6px] rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.15 + 0.1,
              boxShadow: "0 0 12px 2px rgba(255,255,255,0.6), 0 0 20px 2px rgba(244,63,94,0.4)",
              willChange: "transform"
            }}
          />
        ))}
      </div>
    </div>
  );
}
