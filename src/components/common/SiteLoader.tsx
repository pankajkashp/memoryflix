"use client";

/**
 * SiteLoader — Cinematic intro loader for MemoryFlix.
 *
 * • Heart beats with glow (GSAP keyframes)
 * • Logo fades in
 * • Loader fades out → page fades in
 * • Runs only ONCE per session (sessionStorage flag)
 * • Respects prefers-reduced-motion
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-utils";
import { prefersReducedMotion } from "@/lib/gsap-utils";

const SESSION_KEY = "mf_loader_shown";

export default function SiteLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const loader = loaderRef.current;
    const heart = heartRef.current;
    const logo = logoRef.current;
    if (!loader || !heart || !logo) return;

    const reduced = prefersReducedMotion();

    if (reduced) {
      // Simple fade: loader fades out quickly
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        delay: 0.4,
        onComplete: () => setIsVisible(false),
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Fade out the entire loader
          gsap.to(loader, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => setIsVisible(false),
          });
        },
      });

      // 1. Heart beats + glows (keyframes)
      tl.fromTo(
        heart,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }
      ).to(heart, {
        keyframes: [
          { scale: 1.18, filter: "drop-shadow(0 0 20px rgba(244,63,94,0.9))", duration: 0.22, ease: "power2.in" },
          { scale: 0.95, filter: "drop-shadow(0 0 6px rgba(244,63,94,0.4))", duration: 0.18, ease: "power2.out" },
          { scale: 1.12, filter: "drop-shadow(0 0 16px rgba(244,63,94,0.8))", duration: 0.18, ease: "power2.in" },
          { scale: 1, filter: "drop-shadow(0 0 8px rgba(244,63,94,0.5))", duration: 0.18, ease: "power2.out" },
        ],
      });

      // 2. Logo text fades in
      tl.fromTo(
        logo,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      );

      // 3. Brief hold (total ~2–2.5s then onComplete triggers)
      tl.to({}, { duration: 0.5 });
    }, loader);

    return () => ctx.revert();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080808]"
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-rose-500/10 blur-[80px]" />
      </div>

      {/* Logo image */}
      <div
        ref={heartRef}
        className="relative mb-5"
        style={{ willChange: "transform, filter, opacity" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.png" alt="MemoryFlix Logo" className="w-32 h-32 object-cover rounded-2xl shadow-xl shadow-rose-500/20" />
      </div>

      {/* Logo text */}
      <div
        ref={logoRef}
        className="text-2xl font-bold tracking-tight text-white"
        style={{ opacity: 0, willChange: "opacity, transform" }}
      >
        Memory<span className="text-rose-400">Flix</span>
      </div>
    </div>
  );
}
