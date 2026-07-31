"use client";

import { useEffect, useState } from "react";

/**
 * SiteLoader — Lightweight cinematic preloader for MemoryFlix.
 *
 * • CSS-only animations (No GSAP) for optimal performance
 * • Tracks actual load state (document.fonts.ready, window.onload)
 * • 4s max fallback timeout
 */

export default function SiteLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const hideLoader = () => {
      if (!isFading) {
        setIsFading(true);
        setTimeout(() => setIsVisible(false), 800);
      }
    };

    // 1. Strict fallback timeout (4s max)
    const fallbackTimeout = setTimeout(() => {
      hideLoader();
    }, 4000);

    // 2. Real load state checking
    const checkLoadState = async () => {
      try {
        // Wait for document and resources to be parsed
        if (document.readyState !== 'complete') {
          await new Promise((resolve) => {
            window.addEventListener('load', resolve, { once: true });
          });
        }
        
        // Wait for critical fonts (Next.js font optimization)
        if ('fonts' in document) {
          await document.fonts.ready;
        }

        // Slight delay to ensure first meaningful paint is ready
        setTimeout(hideLoader, 50);
      } catch (err) {
        // Fallback handles errors
      }
    };

    checkLoadState();

    return () => clearTimeout(fallbackTimeout);
  }, [isFading]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden pointer-events-none transition-opacity duration-700 ease-in-out bg-[#09090B] ${isFading ? "opacity-0" : "opacity-100"}`}
      aria-hidden="true"
    >
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090B_100%)] opacity-90" />
      
      {/* Subtle ambient gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 blur-[120px] mix-blend-screen animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center mt-[-5%] transition-all duration-700 ease-in-out ${isFading ? 'scale-105 blur-[8px] -translate-y-8' : 'scale-100 blur-0 translate-y-0'}`}>
        
        {/* Logo */}
        <div className="relative mb-8 animate-pulse-slow">
          <div className="absolute inset-0 rounded-[1.25rem] shadow-[0_0_40px_rgba(244,63,94,0.3)] animate-pulse" />
          <img 
            src="/icon.png" 
            alt="MemoryFlix Logo" 
            className="relative w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-[1.25rem] border border-white/5" 
          />
        </div>

        {/* Text */}
        <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Memory<span className="text-rose-400">Flix</span>
        </div>

        <div className="text-sm sm:text-base text-zinc-400 font-medium tracking-wide mb-14">
          Preserving your beautiful moments...
        </div>

        {/* Loading Indicator */}
        <div className="relative w-48 sm:w-64 h-[2px] bg-white/[0.05] rounded-full overflow-hidden">
          {/* Indeterminate loading bar */}
          <div 
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-[shimmer_1.5s_infinite]"
            style={{ 
              boxShadow: "0 0 12px rgba(244,63,94,0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
