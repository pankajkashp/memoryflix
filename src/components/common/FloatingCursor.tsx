"use client";

/**
 * FloatingCursor — Ambient cursor glow for MemoryFlix.
 *
 * • Desktop only (hover: hover media query)
 * • GSAP lerp for silky smooth trailing movement
 * • pointer-events: none — never blocks clicks
 * • Respects prefers-reduced-motion
 * • Two layers: outer glow (slow) + inner dot (fast)
 */

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap-utils";

export default function FloatingCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on devices that support hover (not touch)
    const supportsHover = window.matchMedia("(hover: hover)").matches;
    if (!supportsHover || prefersReducedMotion()) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    // Mouse position target
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    // Current lerped position
    let curX = mouseX;
    let curY = mouseY;
    let innerX = mouseX;
    let innerY = mouseY;

    let rafId: number;
    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        gsap.to([outer, inner], { opacity: 1, duration: 0.3 });
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      gsap.to([outer, inner], { opacity: 0, duration: 0.4 });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const tick = () => {
      // Outer glow: very slow lerp (cinematic trail)
      curX += (mouseX - curX) * 0.06;
      curY += (mouseY - curY) * 0.06;
      gsap.set(outer, { x: curX - 160, y: curY - 160 });

      // Inner dot: faster lerp
      innerX += (mouseX - innerX) * 0.18;
      innerY += (mouseY - innerY) * 0.18;
      gsap.set(inner, { x: innerX - 4, y: innerY - 4 });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Outer ambient glow */}
      <div
        ref={outerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-80 h-80 rounded-full pointer-events-none z-[9998] opacity-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(244,63,94,0.07) 0%, rgba(244,63,94,0.03) 40%, transparent 70%)",
          willChange: "transform",
          mixBlendMode: "screen",
        }}
      />
      {/* Inner precise dot */}
      <div
        ref={innerRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] opacity-0 bg-rose-400/60"
        style={{ willChange: "transform", mixBlendMode: "screen" }}
      />
    </>
  );
}
